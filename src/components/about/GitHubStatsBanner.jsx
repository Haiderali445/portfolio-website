import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useGitHubStats } from '../../hooks/useGitHubStats';
import { extractGitHubUsername } from '../../utils/github';
import { GitHubCalendar } from 'react-github-calendar';
import {
  FaGithub,
  FaCodeBranch,
  FaCodeCommit,
  FaCodeFork,
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
  const [selectedYear, setSelectedYear] = useState('last');

  const cleanUser = extractGitHubUsername(username);
  const currentYear = new Date().getFullYear();
  const calendarYears = ['last', ...Array.from({ length: 4 }, (_, index) => currentYear - index)];

  // Format large numbers with commas or K/M suffixes
  const formatNumber = (val) => {
    if (val === null || val === undefined || val === '') return '--';
    const num = typeof val === 'number' ? val : Number(val);
    if (isNaN(num)) return String(val);
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return num.toLocaleString();
    return String(num);
  };

  const commitsCount = stats?.commitsLastYear;
  const locCount = stats?.totalLinesOfCode;
  const reposCount = stats?.publicRepos;
  const pushesCount = stats?.recentPushes;
  const deploymentsCount = stats?.recentDeployments;
  const starsCount = stats?.totalStars;
  const forksCount = stats?.totalForks;

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
    return `GitHub @${cleanUser} Stats: ${formatNumber(reposCount)} Public Repos | ${formatNumber(commitsCount)} Commits (Last Year) | ${formatNumber(locCount)} LOC | ${formatNumber(pushesCount)} Pushes | ${formatNumber(deploymentsCount)} Deployments | ${formatNumber(forksCount)} Forks | ${formatNumber(starsCount)} Stars | https://github.com/${cleanUser}`;
  };

  const statItems = [
    {
      id: 'commits-year',
      label: 'Commits (Last Year)',
      value: commitsCount,
      formatted: formatNumber(commitsCount),
      copyValue: `${formatNumber(commitsCount)} Commits (Last Year) - @${cleanUser}`,
      subtext: 'Annual Repository Commits',
      icon: FaCodeCommit,
      glowColor: 'from-cyan-500/20 to-blue-500/10',
      iconColor: 'text-cyan-400',
    },
    {
      id: 'loc',
      label: 'Lines of Code (LOC)',
      value: locCount,
      formatted: locCount == null ? '--' : `${formatNumber(locCount)} LOC`,
      copyValue: `${formatNumber(locCount)} Lines of Code - @${cleanUser}`,
      subtext: 'Estimated Source Code Volume',
      icon: FaFileCode,
      glowColor: 'from-emerald-500/10 to-teal-500/5',
      iconColor: 'text-emerald-400',
    },
    {
      id: 'repos',
      label: 'Public Repositories',
      value: reposCount,
      formatted: formatNumber(reposCount),
      copyValue: `${formatNumber(reposCount)} Public Repositories - @${cleanUser}`,
      subtext: 'Open-Source Projects',
      icon: FaCodeBranch,
      glowColor: 'from-blue-500/10 to-indigo-500/5',
      iconColor: 'text-blue-400',
    },
    {
      id: 'forks',
      label: 'Forks Count',
      value: forksCount,
      formatted: formatNumber(forksCount),
      copyValue: `${formatNumber(forksCount)} Forks - @${cleanUser}`,
      subtext: 'Across Public Repositories',
      icon: FaCodeFork,
      glowColor: 'from-purple-500/10 to-indigo-500/5',
      iconColor: 'text-purple-400',
    },
    {
      id: 'stars',
      label: 'Total Stars',
      value: starsCount,
      formatted: formatNumber(starsCount),
      copyValue: `${formatNumber(starsCount)} Stars - @${cleanUser}`,
      subtext: 'Earned Across Repositories',
      icon: FaStar,
      glowColor: 'from-amber-500/10 to-orange-500/5',
      iconColor: 'text-amber-400',
    },
    {
      id: 'pushes-deployments',
      label: 'Pushes & Deployments',
      value: pushesCount,
      formatted: stats
        ? `${formatNumber(pushesCount)} pushes · ${formatNumber(deploymentsCount)} deploys`
        : '--',
      copyValue: `${formatNumber(pushesCount)} Pushes • ${formatNumber(deploymentsCount)} Deployments - @${cleanUser}`,
      subtext: 'Recent Pushes and Deploy Batches',
      icon: FaRocket,
      glowColor: 'from-teal-500/10 to-cyan-500/5',
      iconColor: 'text-teal-400',
    },
  ];

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
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-500/10 via-purple-500/5 to-transparent opacity-20 blur-lg transition-opacity duration-500 group-hover:opacity-30" />

      {/* Main Glassmorphic Container */}
      <div
        className="relative min-h-[240px] overflow-hidden rounded-2xl border border-white/[0.08] bg-surface-2/80 p-6 backdrop-blur-xl transition-colors duration-300 hover:border-cyan-400/30 md:p-8"
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
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, idx) => (
                <div key={idx} className="h-28 rounded-xl bg-white/10 skeleton-shimmer" />
              ))}
            </div>
            <div className="h-40 rounded-2xl bg-white/10 skeleton-shimmer" />
          </div>
        ) : (
          <>
            {/* Top Header Bar */}
            <div className="mb-6 flex flex-col items-start justify-between gap-4 border-b border-white/[0.06] pb-5 sm:flex-row sm:items-center">
              <div className="flex items-center gap-3">
                <div className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-surface-1 text-white shadow-inner">
                <FaGithub className="text-xl text-cyan-400" />
                  <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-75" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-cyan-400" />
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
                  <p className="font-mono text-xs text-slate-400">
                    Real-time open-source metrics for{' '}
                    <span className="text-gray-300">@{stats?.username || cleanUser}</span>
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleCopy('summary', getFullSummaryText())}
                  title="Copy live GitHub metrics summary"
                  className={`flex items-center gap-1.5 rounded-xl border px-3 py-1.5 font-mono text-xs transition-all duration-300 ${
                    copiedKey === 'summary'
                      ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400'
                      : 'border-white/10 bg-white/[0.03] text-gray-300 hover:border-cyan-400/40 hover:bg-cyan-400/10 hover:text-white'
                  }`}
                  aria-label="Copy live GitHub metrics summary"
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

                <button
                  type="button"
                  onClick={() => refetch()}
                  title="Fetch fresh real-time GitHub metrics"
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/[0.02] text-gray-400 transition-all hover:border-cyan-400/30 hover:bg-cyan-400/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-surface-2"
                  aria-label="Refresh GitHub statistics"
                >
                  <FaRotateRight className={`text-xs ${loading ? 'animate-spin text-cyan-400' : ''}`} />
                </button>

                <a
                  href={stats?.profileUrl || `https://github.com/${cleanUser}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-1.5 font-mono text-xs text-white/80 transition-all duration-300 hover:border-cyan-400/40 hover:bg-cyan-400/10 hover:text-cyan-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-surface-2"
                >
                  <span>View Profile</span>
                  <FaArrowUpRightFromSquare className="text-[10px]" />
                </a>
              </div>
            </div>

            {/* Dynamic Metrics Grid */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {statItems.map((item) => {
                const isCardCopied = copiedKey === item.id;

                return (
                  <div
                    key={item.id}
                    className="group/card relative overflow-hidden rounded-xl border border-white/[0.06] bg-surface-1/70 p-4 transition-all duration-300 hover:border-white/20 hover:bg-surface-1"
                  >
                    <div
                      className={`absolute -right-6 -top-6 h-20 w-20 rounded-full bg-gradient-to-br ${item.glowColor} opacity-0 blur-xl transition-opacity duration-500 group-hover/card:opacity-100`}
                    />

                    <div className="relative flex items-center justify-between mb-2">
                      <span className="font-mono text-[10.5px] uppercase tracking-wider text-slate-400">
                        {item.label}
                      </span>

                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleCopy(item.id, item.copyValue)}
                          title={`Copy ${item.label}`}
                          className="rounded p-1 text-slate-400 opacity-0 transition-all hover:bg-white/10 hover:text-cyan-400 group-hover/card:opacity-100 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
                          aria-label={`Copy ${item.label}`}
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
                        <div className="font-sans text-lg font-bold tracking-tight text-white md:text-xl">
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

            {/* ─── AUTHENTIC GITHUB CONTRIBUTION CALENDAR MATRIX ────────────────── */}
            <div className="mt-6 rounded-2xl border border-white/[0.06] bg-surface-2/50 p-4 md:p-5">
              <div className="mb-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                <div className="flex items-center gap-2">
                  <FaChartSimple className="text-xs text-cyan-400" />
                  <span className="font-mono text-xs font-medium text-gray-300">
                    Day-to-Day Contribution Matrix
                  </span>
                </div>

                {/* Year filter selector allowing up to 3 years back */}
                <div className="flex items-center gap-1 rounded-lg border border-white/10 bg-black/40 p-1 font-mono text-[11px]">
                  {calendarYears.map((yr) => (
                    <button
                      type="button"
                      key={yr}
                      onClick={() => setSelectedYear(yr)}
                      aria-pressed={selectedYear === yr}
                      className={`rounded px-2.5 py-1 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 ${
                        selectedYear === yr 
                          ? 'border border-cyan-400/30 bg-cyan-400/20 font-bold text-cyan-400' 
                          : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      {yr === 'last' ? 'Past Year' : yr}
                    </button>
                  ))}
                </div>
              </div>

              {/* Native Contribution Calendar Grid with working SVG hover tooltips */}
              <div className="relative">
                <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-0 z-10 w-5 bg-gradient-to-r from-surface-2 to-transparent sm:w-8" />
                <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 right-0 z-10 w-5 bg-gradient-to-l from-surface-2 to-transparent sm:w-8" />
                <div className="overflow-x-auto py-2">
                  <div className="min-w-max px-4">
                    <GitHubCalendar
                      username={cleanUser}
                      year={selectedYear}
                      blockSize={11}
                      blockMargin={4}
                      fontSize={12}
                      theme={{
                        dark: ['rgba(255,255,255,0.03)', '#0e3a40', '#007a8a', '#00bccc', '#00ffff'],
                      }}
                      renderBlock={(block, activity) => {
                        const dateLabel = new Date(`${activity.date}T00:00:00`).toLocaleDateString(
                          undefined,
                          { year: 'numeric', month: 'short', day: 'numeric' }
                        );

                        return (
                          <g key={activity.date}>
                            {activity.level === 1
                              ? React.cloneElement(block, {
                                  stroke: 'rgba(34,211,238,0.35)',
                                  strokeWidth: 1,
                                })
                              : block}
                            <title>{`${activity.count} contributions on ${dateLabel}`}</title>
                          </g>
                        );
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Dynamic Top Languages Row */}
            {stats?.topLanguages && stats.topLanguages.length > 0 && !loading && (
              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/[0.04] bg-white/[0.01] px-4 py-2.5">
                <span className="font-mono text-[11px] text-slate-400">
                  Primary Tech Stack:
                </span>
                <div className="flex flex-wrap items-center gap-2">
                  {stats.topLanguages.map((lang) => (
                    <span
                      key={lang.name}
                      className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-surface-1 px-2.5 py-1 font-mono text-[10.5px] text-gray-300"
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
                      <span>{lang.name}</span>
                      <span className="text-slate-400">{lang.percentage}%</span>
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