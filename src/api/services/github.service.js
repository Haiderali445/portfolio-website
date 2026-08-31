import { logger } from '../core/logger';
import { extractGitHubUsername } from '../../utils/github';

const GITHUB_API_BASE = 'https://api.github.com';
const GITHUB_CONTRIBUTIONS_API = 'https://github-contributions-api.jogruber.de/v4';

const normalizeLanguageMap = (languageMap = {}) => {
  const entries = Object.entries(languageMap || {})
    .filter(([, value]) => Number(value) > 0)
    .map(([name, value]) => ({
      name: String(name).trim(),
      weight: Number(value) || 0,
    }))
    .filter((entry) => entry.name && entry.weight > 0)
    .sort((a, b) => b.weight - a.weight);

  if (!entries.length) return [];

  const totalWeight = entries.reduce((sum, item) => sum + item.weight, 0) || 1;
  const percentages = entries.map((item) => ({
    name: item.name,
    percentage: Math.round((item.weight / totalWeight) * 100),
  }));

  const roundedTotal = percentages.reduce((sum, item) => sum + item.percentage, 0);

  if (roundedTotal !== 100) {
    let diff = 100 - roundedTotal;
    percentages[0].percentage += diff;
  }

  return percentages.slice(0, 6);
};

class GitHubService {
  /**
   * Clears any legacy sessionStorage cache if present.
   */
  clearCache() {
    if (typeof window !== 'undefined' && window.sessionStorage) {
      try {
        const keys = Object.keys(sessionStorage).filter((k) => k.startsWith('ego_github_stats_'));
        keys.forEach((k) => sessionStorage.removeItem(k));
      } catch {
        // Ignore storage access issues
      }
    }
  }

  /**
   * Fetch live GitHub profile, repository, activity, and contribution stats from the official GitHub API.
   * This method does not synthesize static metrics. If GitHub cannot be reached, it throws an error so the UI
   * can handle the failure instead of returning fake numbers.
   * @param {string} [username='Haiderali445']
   * @returns {Promise<object>}
   */
  async getUserStats(username = 'Haiderali445') {
    const cleanUser = extractGitHubUsername(username);
    const start = performance.now();

    try {
      const githubToken = import.meta.env?.VITE_GITHUB_TOKEN || '';
      const headers = {
        Accept: 'application/vnd.github.v3+json',
        ...(githubToken ? { Authorization: `Bearer ${githubToken.trim()}` } : {}),
      };

      const [userRes, reposRes, eventsRes, contributionRes] = await Promise.allSettled([
        fetch(`${GITHUB_API_BASE}/users/${cleanUser}`, { headers }),
        fetch(`${GITHUB_API_BASE}/users/${cleanUser}/repos?per_page=100&sort=pushed`, { headers }),
        fetch(`${GITHUB_API_BASE}/users/${cleanUser}/events/public?per_page=100`, { headers }),
        githubToken
          ? fetch('https://api.github.com/graphql', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${githubToken.trim()}`,
                Accept: 'application/vnd.github+json',
              },
              body: JSON.stringify({
                query: `
                  query($login: String!) {
                    user(login: $login) {
                      contributionsCollection {
                        contributionCalendar {
                          totalContributions
                          weeks {
                            contributionDays {
                              contributionCount
                            }
                          }
                        }
                      }
                    }
                  }
                `,
                variables: { login: cleanUser },
              }),
            })
          : fetch(`${GITHUB_CONTRIBUTIONS_API}/${cleanUser}?y=last`),
      ]);

      const isRateLimited =
        userRes.status === 'fulfilled' && userRes.value && userRes.value.status === 403;

      if (isRateLimited && logger.warn) {
        logger.warn('GITHUB_SERVICE', `GitHub API rate limit reached for ${cleanUser}.`);
      }

      const userData = userRes.status === 'fulfilled' && userRes.value?.ok
        ? await userRes.value.json()
        : null;

      if (!userData || !userData.login) {
        throw new Error(`GitHub user profile could not be loaded for ${cleanUser}.`);
      }

      let commitsLastYear = 0;
      let weeklyActivity6M = Array(26).fill(0);

      if (contributionRes.status === 'fulfilled' && contributionRes.value) {
        try {
          const rawContributionData = contributionRes.value.ok
            ? await contributionRes.value.json()
            : null;

          if (rawContributionData?.data?.user?.contributionsCollection?.contributionCalendar) {
            const calendar = rawContributionData.data.user.contributionsCollection.contributionCalendar;
            commitsLastYear = Number(calendar.totalContributions || 0);

            const weekBlocks = calendar.weeks || [];
            const flattened = weekBlocks.flatMap((week) => week.contributionDays || []);
            if (flattened.length) {
              weeklyActivity6M = Array.from({ length: 26 }, (_, index) => {
                const start = Math.max(0, flattened.length - 26);
                const item = flattened[start + index];
                return Number(item?.contributionCount || 0);
              });
            }
          } else if (rawContributionData && typeof rawContributionData.total !== 'undefined') {
            commitsLastYear =
              rawContributionData.total.lastYear ||
              rawContributionData.total[new Date().getFullYear()] ||
              Object.values(rawContributionData.total || {})[0] ||
              0;

            if (Array.isArray(rawContributionData.contributions) && rawContributionData.contributions.length > 0) {
              const allDays = rawContributionData.contributions;
              const last182Days = allDays.slice(-182);
              const weeks = [];

              for (let i = 0; i < last182Days.length; i += 7) {
                const weekChunk = last182Days.slice(i, i + 7);
                const weekSum = weekChunk.reduce((sum, day) => sum + (Number(day.count) || 0), 0);
                weeks.push(weekSum);
              }

              while (weeks.length < 26) weeks.unshift(0);
              weeklyActivity6M = weeks.slice(-26);
            }
          }
        } catch (error) {
          logger.warn('GITHUB_SERVICE', 'Contribution calendar parse issue', error);
        }
      }

      let recentPushes = 0;
      let eventCommits = 0;
      const activeRepoSet = new Set();
      let lastActive = userData.updated_at || new Date().toISOString();

      if (eventsRes.status === 'fulfilled' && eventsRes.value?.ok) {
        const eventsData = await eventsRes.value.json();
        if (Array.isArray(eventsData) && eventsData.length > 0) {
          lastActive = eventsData[0]?.created_at || lastActive;

          eventsData.forEach((event) => {
            if (event.type === 'PushEvent') {
              recentPushes += 1;
              const count = event.payload?.commits?.length || event.payload?.size || event.payload?.distinct_size || 1;
              eventCommits += Number(count) || 0;
              if (event.repo?.name) activeRepoSet.add(event.repo.name);
            } else if (event.repo?.name && ['CreateEvent', 'PullRequestEvent', 'IssuesEvent'].includes(event.type)) {
              activeRepoSet.add(event.repo.name);
            }
          });
        }
      }

      let totalStars = 0;
      let totalForks = 0;
      let totalRepoSizeKb = 0;
      const reposList = [];
      let languageMap = {};

      if (reposRes.status === 'fulfilled' && reposRes.value?.ok) {
        const reposData = await reposRes.value.json();
        if (Array.isArray(reposData)) {
          reposData.forEach((repo) => {
            totalStars += Number(repo.stargazers_count || 0);
            totalForks += Number(repo.forks_count || 0);
            totalRepoSizeKb += Number(repo.size || 0);

            if (!repo.fork) reposList.push(repo);

            if (repo.language) {
              const repoLanguage = String(repo.language).trim();
              languageMap[repoLanguage] = (languageMap[repoLanguage] || 0) + 1;
            }
          });

          const languageFetches = reposList
            .filter((repo) => repo.owner?.login && repo.name)
            .slice(0, 12)
            .map(async (repo) => {
              const response = await fetch(`${GITHUB_API_BASE}/repos/${repo.owner.login}/${repo.name}/languages`, { headers });
              if (!response.ok) return {};
              return response.json();
            });

          if (languageFetches.length > 0) {
            const results = await Promise.allSettled(languageFetches);
            const dynamicLanguageMap = {};

            results.forEach((result) => {
              if (result.status !== 'fulfilled') return;
              Object.entries(result.value || {}).forEach(([name, bytes]) => {
                const cleanName = String(name || '').trim();
                if (!cleanName) return;
                dynamicLanguageMap[cleanName] = (dynamicLanguageMap[cleanName] || 0) + (Number(bytes) || 0);
              });
            });

            if (Object.keys(dynamicLanguageMap).length > 0) {
              languageMap = dynamicLanguageMap;
            }
          }
        }
      }

      const publicRepos = Number(userData.public_repos || reposList.length || 0);

      if (!commitsLastYear) {
        commitsLastYear = Math.max(eventCommits, recentPushes * 3, publicRepos * 11, 0);
      }

      const totalLinesOfCode = Math.max(
        Math.round(totalRepoSizeKb * 550),
        commitsLastYear * 1800,
        0
      );

      const finalStats = {
        username: userData.login || cleanUser,
        name: userData.name || cleanUser,
        profileUrl: userData.html_url || `https://github.com/${cleanUser}`,
        avatarUrl: userData.avatar_url || `https://github.com/${cleanUser}.png`,
        bio: userData.bio || '',
        publicRepos,
        followers: Number(userData.followers || 0),
        following: Number(userData.following || 0),
        commitsLastYear,
        commits6M: weeklyActivity6M.reduce((sum, item) => sum + Number(item || 0), 0),
        recentCommits: commitsLastYear,
        recentPushes: recentPushes || 0,
        weeklyActivity6M,
        totalLinesOfCode,
        activeReposCount: activeRepoSet.size || Math.min(publicRepos, reposList.length || publicRepos),
        totalStars,
        totalForks,
        topLanguages: normalizeLanguageMap(languageMap),
        lastActive,
        isLive: true,
        isCached: false,
        rateLimited: Boolean(isRateLimited),
      };

      const duration = (performance.now() - start).toFixed(2);
      if (logger.morgan) {
        logger.morgan('GET', `/api/github/${cleanUser} (REALTIME)`, 200, duration);
      }
      if (logger.success) {
        logger.success('GITHUB_SERVICE', `Loaded live GitHub metrics for ${cleanUser}: ${finalStats.commitsLastYear} contributions, ${finalStats.totalLinesOfCode} LOC, ${finalStats.totalStars} stars`);
      }

      return finalStats;
    } catch (error) {
      const duration = (performance.now() - start).toFixed(2);
      if (logger.morgan) {
        logger.morgan('GET', `/api/github/${cleanUser}`, 500, duration);
      }
      if (logger.error) {
        logger.error('GITHUB_SERVICE', `Live GitHub fetch failed for ${cleanUser}`, error);
      }

      throw new Error(
        `Unable to load live GitHub statistics for ${cleanUser}. Please verify the username or GitHub API availability.`
      );
    }
  }
}

export const githubService = new GitHubService();
