import React from "react";

const SkeletonBlock = ({ className = "" }) => (
  <div className={`skeleton-shimmer rounded-xl bg-white/[0.07] ${className}`} />
);

const SkeletonSection = ({ children, className = "" }) => (
  <section className={`relative py-16 md:py-24 ${className}`}>
    <div className="container mx-auto max-w-7xl px-6">{children}</div>
  </section>
);

export default function LoadingScreen() {
  return (
    <div className="min-h-screen w-full overflow-hidden bg-[#050505] text-white" aria-busy="true" aria-label="Loading portfolio">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top,rgba(0,234,255,0.08),transparent_34rem)]" />

      <div className="pointer-events-none fixed inset-0 z-20 flex items-center justify-center px-6">
        <div className="flex items-center gap-3 rounded-2xl border border-cyan-400/20 bg-[#080a0d]/90 px-4 py-3 font-mono text-xs text-cyan-300 shadow-2xl shadow-cyan-500/10 backdrop-blur-xl">
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-60" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-cyan-400" />
          </span>
          <span>INITIALIZING PORTFOLIO DATA...</span>
        </div>
      </div>

      <div className="relative">
        <header className="min-h-[min(42rem,82vh)] border-b border-white/[0.06] px-6 py-28 md:py-36">
          <div className="container mx-auto max-w-7xl">
            <SkeletonBlock className="mb-6 h-4 w-36" />
            <SkeletonBlock className="h-14 w-[min(34rem,90vw)] md:h-20" />
            <SkeletonBlock className="mt-4 h-5 w-[min(28rem,80vw)]" />
            <div className="mt-10 flex flex-wrap gap-3">
              <SkeletonBlock className="h-11 w-32" />
              <SkeletonBlock className="h-11 w-11 rounded-full" />
              <SkeletonBlock className="h-11 w-11 rounded-full" />
            </div>
          </div>
        </header>

        <SkeletonSection>
          <div className="grid min-h-[20rem] items-center gap-10 md:grid-cols-[1fr_1.3fr]">
            <SkeletonBlock className="mx-auto h-56 w-56 rounded-full md:mx-0" />
            <div>
              <SkeletonBlock className="mb-6 h-10 w-64" />
              <SkeletonBlock className="mb-3 h-4 w-full" />
              <SkeletonBlock className="mb-3 h-4 w-11/12" />
              <SkeletonBlock className="h-4 w-3/4" />
              <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {Array.from({ length: 4 }).map((_, index) => <SkeletonBlock key={index} className="h-20" />)}
              </div>
            </div>
          </div>
        </SkeletonSection>

        <SkeletonSection className="border-y border-white/[0.04]">
          <SkeletonBlock className="mx-auto mb-12 h-10 w-64" />
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <SkeletonBlock key={index} className="h-48" />
            ))}
          </div>
        </SkeletonSection>

        <SkeletonSection>
          <SkeletonBlock className="mb-12 h-10 w-72" />
          <div className="space-y-6">
            {Array.from({ length: 3 }).map((_, index) => (
              <SkeletonBlock key={index} className="h-48 md:h-40" />
            ))}
          </div>
        </SkeletonSection>

        <SkeletonSection className="border-y border-white/[0.04]">
          <SkeletonBlock className="mx-auto mb-12 h-10 w-72" />
          <div className="grid gap-5 md:grid-cols-2">
            {Array.from({ length: 4 }).map((_, index) => <SkeletonBlock key={index} className="h-32" />)}
          </div>
        </SkeletonSection>

        <SkeletonSection>
          <SkeletonBlock className="mx-auto mb-4 h-10 w-64" />
          <SkeletonBlock className="mx-auto mb-12 h-4 w-80 max-w-full" />
          <div className="grid auto-rows-[18rem] gap-5 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 4 }).map((_, index) => (
              <SkeletonBlock key={index} className={index % 3 === 0 ? "md:col-span-2" : ""} />
            ))}
          </div>
        </SkeletonSection>

        <SkeletonSection className="border-t border-white/[0.04]">
          <SkeletonBlock className="mx-auto mb-12 h-10 w-64" />
          <div className="grid gap-5 md:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => <SkeletonBlock key={index} className="h-72" />)}
          </div>
        </SkeletonSection>
      </div>
    </div>
  );
}