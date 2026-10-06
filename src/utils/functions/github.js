/**
 * Extracts a clean GitHub username from URL, handle, or raw string.
 * @param {string} githubInput - e.g. "https://github.com/Haiderali445", "@Haiderali445", "Haiderali445"
 * @returns {string} - Clean username (e.g. "Haiderali445")
 */
export const extractGitHubUsername = (githubInput) => {
  if (!githubInput || typeof githubInput !== 'string') return 'Haiderali445';

  let username = githubInput.trim();

  if (username.startsWith('http://') || username.startsWith('https://')) {
    try {
      const url = new URL(username);
      const segments = url.pathname.split('/').filter(Boolean);
      username = segments[0] || '';
    } catch {
      username = username.split('/').filter(Boolean).pop() || '';
    }
  } else if (username.includes('github.com/')) {
    username = username.split('github.com/').pop().split('/')[0] || '';
  }

  username = username.replace(/^@/, '').trim();

  return username || 'Haiderali445';
};

/**
 * Automatically extracts or constructs an optimized GitHub avatar image link.
 * @param {string} githubInput -
 * @param {number} [size=null] 
 * @returns {string} 
 */
export const getGitHubAvatar = (githubInput, size = null) => {
  const username = extractGitHubUsername(githubInput);
  if (!username) return '';

  let avatarUrl = `https://github.com/${username}.png`;

  if (size) {
    avatarUrl += `?size=${size}`;
  }

  return avatarUrl;
};