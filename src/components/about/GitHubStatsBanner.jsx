import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useGitHubStats } from '../../hooks/useGitHubStats';
import { extractGitHubUsername } from '../../utils/github';
import {
  FaGithub,
  FaCodeBranch,
  FaCodeCommit,
  FaRocket,
  FaFileCode,
  FaStar,
  FaArrowUpRightFromSquare,
  FaRotateRight,
  FaCircleDot,
  FaChartSimple,
  FaCopy,
  FaCheck,
} from 'react-icons/fa6';

export const GitHubStatsBanner = ({ username = 'Haiderali445' }) => {
  const { stats, loading, error, refetch } = useGitHubStats(username);
  const [copiedKey, setCopiedKey] = useState('');

  const cleanUser = extractGitHubUsername(username);

  // Format large numbers with commas or K/M suffixes
  const formatNumber = (val) => {
    if (val === null || val === undefined || val === '') return '--';
    const num = typeof val === 'number' ? val : Number(val);
    if (isNaN(num)) return String(val);
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return num.toLocaleString();
    return String(num);
  };

  const commitsCount = stats?.commitsLastYear ?? stats?.commits6M ?? stats?.recentCommits;
  const locCount = stats?.totalLinesOfCode;
  const reposCount = stats?.publicRepos;
  const pushesCount = stats?.recentPushes ?? 0;
  const starsCount = stats?.totalStars ?? 0;

  // Dynamic copy handler with formatted clipboard payload
  const handleCopy = async (key, textToCopy) => {
    if (!textToCopy) return;
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(''), 2500);
    } catch {
      setCopiedKey('');
    }
  };

  // Generate full live markdown/summary string for clipboard
  const getFullSummaryText = () => {
    return `🐙 GitHub @${cleanUser} Stats: ${reposCount || 0} Public Repos | ${commitsCount || 0} Commits (Last Year) | ${formatNumber(locCount)} LOC | ${pushesCount} Pushes • ${starsCount} ★ | https://github.com/${cleanUser}`;
  };

  const statItems = [
    {
      id: 'commits-year',
      label: 'Commits (Last Year)',
      value: commitsCount,
      formatted: commitsCount !== undefined ? formatNumber(commitsCount) : '--',
      copyValue: `${commitsCount || 0} Commits (Last Year) - @${cleanUser}`,
      subtext: 'Annual Repository Commits',
      icon: FaCodeCommit,
      glowColor: 'from-cyan-500/20 to-blue-500/10',
      iconColor: 'text-cyan-400',
    },
    {
      id: 'loc',
      label: 'Total Lines of Code',
      value: locCount,
      formatted: locCount !== undefined ? `${formatNumber(locCount)} LOC` : '--',
      copyValue: `${formatNumber(locCount)} Lines of Code - @${cleanUser}`,
      subtext: 'Source Code Volume',
      icon: FaFileCode,
      glowColor: 'from-emerald-500/20 to-teal-500/10',
      iconColor: 'text-emerald-400',
    },
    {
      id: 'repos',
      label: 'Public Repositories',
      value: reposCount,
      formatted: reposCount !== undefined ? formatNumber(reposCount) : '--',
      copyValue: `${reposCount || 0} Public Repositories - @${cleanUser}`,
      subtext: 'Open-Source Projects',
      icon: FaCodeBranch,
      glowColor: 'from-purple-500/20 to-indigo-500/10',
      iconColor: 'text-purple-400',
    },
    {
      id: 'pushes',
      label: 'Pushes & Stars',
      value: pushesCount,
      formatted: stats ? `${pushesCount} Pushes • ${starsCount} ★` : '--',
      copyValue: `${pushesCount} Pushes • ${starsCount} Stars - @${cleanUser}`,
      subtext: 'Recent Deploy Batches',
      icon: starsCount > 0 ? FaStar : FaRocket,
      glowColor: 'from-amber-500/20 to-orange-500/10',
      iconColor: 'text-amber-400',
    },
  ];

  // Generate dynamic month labels for the last 6 months
  const monthLabels = useMemo(() => {
    const months = [];
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      months.push(d.toLocaleString('en-US', { month: 'short' }));
    }
    return months;
  }, []);

  // 26-week activity grid data
  const activityData = useMemo(() => {
    if (stats?.weeklyActivity6M && Array.isArray(stats.weeklyActivity6M) && stats.weeklyActivity6M.length === 26) {
      return stats.weeklyActivity6M;
    }
    return Array(26).fill(0);
  }, [stats?.weeklyActivity6M]);

  // Determine intensity color block based on commit count
  const getIntensityClass = (count) => {
    if (!count || count === 0) return 'bg-white/[0.04] border-white/5';
    if (count <= 2) return 'bg-cyan-950/80 border-cyan-800/50 shadow-sm shadow-cyan-900/20';
    if (count <= 5) return 'bg-cyan-700/70 border-cyan-500/60 shadow-sm shadow-cyan-500/30';
    if (count <= 9) return 'bg-cyan-500/90 border-cyan-400 shadow-md shadow-cyan-400/40';
    return 'bg-[#00ffff] border-white shadow-lg shadow-[#00ffff]/60';
  };

  const isInitialLoading = loading && !stats;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="group relative mt-10 w-full"
    >
      {/* Ambient background glow */}
      <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-r from-[#00ffff]/15 via-purple-500/10 to-transparent opacity-20 blur-2xl transition-all duration-700 group-hover:opacity-40" />

      {/* Main Glassmorphic Container */}
      <div
        className="relative min-h-[240px] overflow-hidden rounded-[2rem] border border-white/[0.08] bg-[#121212]/80 p-6 backdrop-blur-xl transition-all duration-500 hover:border-[#00ffff]/30 hover:shadow-2xl hover:shadow-[#00ffff]/5 md:p-8"
        aria-busy={loading}
      >
        {isInitialLoading ? (
          <div className="space-y-5">
            <div className="flex items-center justify-between gap-4 border-b border-white/[0.06] pb-5">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-white/10 skeleton-shimmer" />
                <div className="space-y-2">
                  <div className="h-3 w-40 rounded bg-white/10 skeleton-shimmer" />
                  <div className="h-2.5 w-28 rounded bg-white/10 skeleton-shimmer" />
                </div>
              </div>
              <div className="flex gap-2">
                <div className="h-8 w-24 rounded-xl bg-white/10 skeleton-shimmer" />
                <div className="h-8 w-8 rounded-lg bg-white/10 skeleton-shimmer" />
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 4 }).map((_, idx) => (
                <div key={idx} className="h-28 rounded-xl bg-white/10 skeleton-shimmer" />
              ))}
            </div>
            <div className="h-24 rounded-2xl bg-white/10 skeleton-shimmer" />
          </div>
        ) : (
          <>
        
        {/* Top Header Bar */}
        <div className="mb-6 flex flex-col items-start justify-between gap-4 border-b border-white/[0.06] pb-5 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3">
            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-[#161616] text-white shadow-inner">
              <FaGithub className="text-xl text-[#00ffff]" />
              <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#00ffff] opacity-75" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#00ffff]" />
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-sans text-base font-semibold tracking-tight text-white md:text-lg">
                  Live GitHub Activity Engine
                </h3>
                {stats?.isLive && (
                  <span className="flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 font-mono text-[9.5px] uppercase tracking-wider text-emerald-400">
                    <FaCircleDot className="h-1.5 w-1.5 animate-pulse text-emerald-400" />
                    Realtime Sync
                  </span>
                )}
              </div>
              <p className="font-mono text-xs text-[#858585]">
                Real-time open-source metrics for{' '}
                <span className="text-gray-300">@{stats?.username || cleanUser}</span>
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Dynamic Copy Stats Button */}
            <button
              type="button"
              onClick={() => handleCopy('summary', getFullSummaryText())}
              title="Copy live GitHub metrics summary"
              className={`flex items-center gap-1.5 rounded-xl border px-3 py-1.5 font-mono text-xs transition-all duration-300 ${
                copiedKey === 'summary'
                  ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400'
                  : 'border-white/10 bg-white/[0.03] text-gray-300 hover:border-[#00ffff]/40 hover:bg-[#00ffff]/10 hover:text-white'
              }`}
            >
              {copiedKey === 'summary' ? (
                <>
                  <FaCheck className="text-emerald-400 text-xs" />
                  <span>Stats Copied!</span>
                </>
              ) : (
                <>
                  <FaCopy className="text-xs text-gray-400" />
                  <span>Copy Stats</span>
                </>
              )}
            </button>

            {/* Refresh Button */}
            <button
              type="button"
              onClick={() => refetch()}
              title="Fetch fresh real-time GitHub metrics"
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/[0.02] text-gray-400 transition-all hover:border-[#00ffff]/30 hover:bg-[#00ffff]/10 hover:text-white"
            >
              <FaRotateRight className={`text-xs ${loading ? 'animate-spin text-[#00ffff]' : ''}`} />
            </button>

            {/* View Profile Link */}
            <a
              href={stats?.profileUrl || `https://github.com/${cleanUser}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-1.5 font-mono text-xs text-white/80 transition-all duration-300 hover:border-[#00ffff]/40 hover:bg-[#00ffff]/10 hover:text-[#00ffff]"
            >
              <span>View Profile</span>
              <FaArrowUpRightFromSquare className="text-[10px]" />
            </a>
          </div>
        </div>

        {/* Dynamic Metrics Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {statItems.map((item) => {
            const isCardCopied = copiedKey === item.id;

            return (
              <div
                key={item.id}
                className="group/card relative overflow-hidden rounded-xl border border-white/[0.06] bg-[#161616]/60 p-4.5 transition-all duration-300 hover:border-white/20 hover:bg-[#1a1a1a]/80"
              >
                {/* Inner gradient glow on card hover */}
                <div
                  className={`absolute -right-6 -top-6 h-20 w-20 rounded-full bg-gradient-to-br ${item.glowColor} opacity-0 blur-xl transition-opacity duration-500 group-hover/card:opacity-100`}
                />

                <div className="relative flex items-center justify-between mb-2">
                  <span className="font-mono text-[10.5px] uppercase tracking-wider text-gray-400">
                    {item.label}
                  </span>

                  <div className="flex items-center gap-1.5">
                    {/* Quick Metric Copy Icon Button */}
                    <button
                      type="button"
                      onClick={() => handleCopy(item.id, item.copyValue)}
                      title={`Copy ${item.label}`}
                      className="opacity-0 group-hover/card:opacity-100 rounded p-1 text-gray-400 hover:bg-white/10 hover:text-cyan-400 transition-all"
                    >
                      {isCardCopied ? (
                        <FaCheck className="text-emerald-400 text-xs" />
                      ) : (
                        <FaCopy className="text-xs" />
                      )}
                    </button>

                    <div className={`flex h-7 w-7 items-center justify-center rounded-lg border border-white/5 bg-white/[0.03] ${item.iconColor}`}>
                      <item.icon className="text-sm" />
                    </div>
                  </div>
                </div>

                <div className="relative">
                  {loading ? (
                    <div className="h-8 w-24 animate-pulse rounded bg-white/10 my-1" />
                  ) : (
                    <div className="font-sans text-xl font-bold tracking-tight text-white md:text-2xl lg:text-[22px]">
                      {item.formatted}
                    </div>
                  )}
                  <p className="mt-1 font-mono text-[10px] text-gray-400">
                    {item.subtext}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* ─── 6-MONTH COMMIT ACTIVITY HEATMAP GRID ────────────────────────── */}
        <div className="mt-6 rounded-2xl border border-white/[0.06] bg-[#161616]/40 p-4 md:p-5">
          <div className="mb-3 flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
            <div className="flex items-center gap-2">
              <FaChartSimple className="text-xs text-[#00ffff]" />
              <span className="font-mono text-xs font-medium text-gray-300">
                Commit Activity Grid (Past 6 Months)
              </span>
            </div>
            <div className="flex items-center gap-1.5 font-mono text-[10px] text-gray-400">
              <span>Less</span>
              <span className="h-2.5 w-2.5 rounded-sm bg-white/[0.04] border border-white/5" />
              <span className="h-2.5 w-2.5 rounded-sm bg-cyan-950/80 border border-cyan-800/50" />
              <span className="h-2.5 w-2.5 rounded-sm bg-cyan-700/70 border border-cyan-500/60" />
              <span className="h-2.5 w-2.5 rounded-sm bg-cyan-500/90 border border-cyan-400" />
              <span className="h-2.5 w-2.5 rounded-sm bg-[#00ffff] border border-white" />
              <span>More</span>
            </div>
          </div>

          {/* Month labels header */}
          <div className="mb-1.5 flex justify-between px-0.5 font-mono text-[9.5px] text-gray-400">
            {monthLabels.map((m, idx) => (
              <span key={idx}>{m}</span>
            ))}
          </div>

          {/* 26-week activity block row */}
          {loading ? (
            <div className="h-6 w-full animate-pulse rounded-lg bg-white/5" />
          ) : (
            <div
              className="grid gap-1 sm:gap-1.5"
              style={{ gridTemplateColumns: 'repeat(26, minmax(0, 1fr))' }}
            >
              {activityData.map((count, idx) => (
                <div
                  key={idx}
                  title={`Week ${idx + 1}: ${count} commit${count === 1 ? '' : 's'}`}
                  className={`h-6 sm:h-7 rounded-sm sm:rounded border transition-all duration-300 hover:scale-110 hover:border-white ${getIntensityClass(count)}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Dynamic Top Languages Row */}
        {stats?.topLanguages && stats.topLanguages.length > 0 && !loading && (
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/[0.04] bg-white/[0.01] px-4 py-2.5">
            <span className="font-mono text-[11px] text-[#858585]">
              Primary Tech Stack:
            </span>
            <div className="flex flex-wrap items-center gap-2">
              {stats.topLanguages.map((lang) => (
                <span
                  key={lang.name}
                  className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-[#161616] px-2.5 py-1 font-mono text-[10.5px] text-gray-300"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-[#00ffff]" />
                  <span>{lang.name}</span>
                  <span className="text-[#858585]">{lang.percentage}%</span>
                </span>
              ))}
            </div>
          </div>
        )}

            {/* Error notification if rate limited */}
            {error && (
              <div className="mt-4 rounded-xl border border-amber-500/20 bg-amber-500/5 px-3 py-2 text-center font-mono text-xs text-amber-300">
                {error}
              </div>
            )}
          </>
        )}
      </div>
    </motion.div>
  );
};

export default GitHubStatsBanner;
