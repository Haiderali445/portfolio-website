import React, { useState, useEffect } from "react";

const SkeletonBlock = ({ className = "" }) => (
  <div className={`skeleton-shimmer rounded-xl bg-white/[0.07] ${className}`} />
);

const SkeletonSection = ({ children, className = "" }) => (
  <section className={`relative py-16 md:py-24 ${className}`}>
    <div className="container mx-auto max-w-7xl px-6">{children}</div>
  </section>
);

export default function LoadingScreen() {
  const [activeNode, setActiveNode] = useState(0);

  // Cycles through active boot states interactively
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveNode((prev) => (prev + 1) % 4);
    }, 400);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen w-full overflow-hidden bg-[#050505] text-white select-none" aria-busy="true" aria-label="Loading portfolio">
      {/* Background Radial Glow */}
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_center,rgba(0,234,255,0.07),transparent_38rem)]" />

      {/* Interactive Central Tech Loader HUD */}
      <div className="pointer-events-none fixed inset-0 z-30 flex items-center justify-center px-6">
        <div className="relative flex flex-col items-center gap-5 p-7 rounded-3xl border border-cyan-500/20 bg-[#080a0d]/90 shadow-2xl shadow-cyan-500/10 backdrop-blur-xl">
          
          {/* Outer Rotating HUD Ring */}
          <div className="relative flex h-24 w-24 items-center justify-center">
            <div className="absolute inset-0 rounded-full border border-white/10 bg-white/[0.02]" />
            <div className="absolute inset-0 rounded-full border-t-2 border-cyan-400 animate-spin" />
            <div className="absolute inset-2 rounded-full border-b-2 border-emerald-400 animate-[spin_3s_linear_infinite_reverse]" />

            {/* Core Center Pulse Node */}
            <div className="absolute h-3 w-3 rounded-full bg-cyan-400 shadow-[0_0_16px_rgba(0,234,255,0.9)] animate-ping" />
            <div className="absolute h-2.5 w-2.5 rounded-full bg-cyan-300 shadow-[0_0_12px_rgba(0,234,255,0.8)]" />
          </div>

          {/* Micro Node Activity Indicator Pills */}
          <div className="flex items-center gap-1.5 font-mono text-[10px] tracking-widest text-cyan-300">
            {['API', 'MESH', 'DB', 'READY'].map((node, idx) => (
              <span
                key={node}
                className={`px-2 py-0.5 rounded transition-all duration-300 border ${
                  activeNode === idx 
                    ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200 shadow-[0_0_10px_rgba(0,234,255,0.3)] scale-105' 
                    : 'bg-white/5 border-white/10 text-slate-500 opacity-60'
                }`}
              >
                {node}
              </span>
            ))}
          </div>

        </div>
      </div>

      {/* Underlying Layout Skeletons */}
      <div className="relative z-0 opacity-95 blur-[0.5px]">
        <header className="min-h-[min(42rem,82vh)] border-b border-white/[0.06] bg-[#06080b]/70 px-6 py-28 backdrop-blur-sm md:py-36">
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

        <SkeletonSection className="border-y border-white/[0.04] bg-white/[0.02]">
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

        <SkeletonSection className="border-y border-white/[0.04] bg-white/[0.02]">
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

        <SkeletonSection className="border-t border-white/[0.04] bg-white/[0.02]">
          <SkeletonBlock className="mx-auto mb-12 h-10 w-64" />
          <div className="grid gap-5 md:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => <SkeletonBlock key={index} className="h-72" />)}
          </div>
        </SkeletonSection>
      </div>
    </div>
  );
}