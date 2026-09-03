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
  const [chargeLevel, setChargeLevel] = useState(0);

  // Cycles through active boot states & simulates battery charging progress
  useEffect(() => {
    const nodeTimer = setInterval(() => {
      setActiveNode((prev) => (prev + 1) % 4);
    }, 400);

    const chargeTimer = setInterval(() => {
      setChargeLevel((prev) => (prev >= 100 ? 0 : prev + 10));
    }, 250);

    return () => {
      clearInterval(nodeTimer);
      clearInterval(chargeTimer);
    };
  }, []);

  // Total number of discrete horizontal charging bars inside the battery
  const totalBars = 7;
  const activeBarsCount = Math.round((chargeLevel / 100) * totalBars);

  return (
    <div className="min-h-screen w-full overflow-hidden bg-[#050505] text-white select-none" aria-busy="true" aria-label="Loading portfolio">
      {/* Background Radial Glow */}
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_center,rgba(0,234,255,0.07),transparent_38rem)]" />

      {/* Interactive Central Vertical Battery Cell HUD */}
      <div className="pointer-events-none fixed inset-0 z-30 flex items-center justify-center px-6">
        <div className="relative flex flex-col items-center gap-6 p-8 rounded-3xl border border-cyan-500/25 bg-[#080a0d]/95 shadow-2xl shadow-cyan-500/15 backdrop-blur-2xl">
          
          {/* Battery Top Terminal Cap - Wider to match new proportion */}
          <div className="w-14 h-3 rounded-t-md bg-gradient-to-r from-cyan-500/40 via-cyan-300 to-cyan-500/40 border border-cyan-400/40 shadow-[0_0_12px_rgba(0,234,255,0.4)]" />

          {/* Main Vertical Battery Body - Significantly wider proportions */}
          <div className="relative flex h-36 w-28 flex-col justify-between overflow-hidden rounded-2xl border-2 border-cyan-500/30 bg-[#030406] p-2 shadow-inner shadow-cyan-950">
            
            {/* Discrete Horizontal Charging Bars Container (Mapped bottom to top) */}
            <div className="flex flex-col-reverse justify-between h-full w-full gap-1.5 z-10">
              {Array.from({ length: totalBars }).map((_, index) => {
                const isLit = index < activeBarsCount;
                return (
                  <div
                    key={index}
                    className={`w-full h-full rounded-md transition-all duration-300 ${
                      isLit
                        ? "bg-gradient-to-r from-cyan-400 via-cyan-300 to-emerald-400 shadow-[0_0_12px_rgba(0,234,255,0.6)] opacity-100 scale-100"
                        : "bg-white/[0.04] border border-white/[0.02] opacity-30 scale-[0.98]"
                    }`}
                  />
                );
              })}
            </div>

            {/* Percentage Text Overlay inside Cell */}
            <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
              <span className="font-mono text-sm font-extrabold tracking-tighter text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] bg-black/60 px-2 py-0.5 rounded-md backdrop-blur-xs border border-white/10">
                {chargeLevel}%
              </span>
            </div>
          </div>

          {/* Core System Telemetry Subtext */}
          <div className="flex flex-col items-center gap-1">
            <span className="font-mono text-xs tracking-widest text-cyan-400 font-semibold drop-shadow-[0_0_8px_rgba(0,234,255,0.4)]">
              SYS_CHARGING
            </span>
            <span className="font-mono text-[10px] text-slate-400 tracking-wider">
              VOLT: 5.0V // MESH_ACTIVE
            </span>
          </div>

          {/* Micro Node Activity Indicator Pills */}
          <div className="flex items-center gap-2 font-mono text-[10px] tracking-widest text-cyan-300 pt-2 border-t border-white/5">
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