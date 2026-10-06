import React, { useEffect, useRef, useState } from "react";
import logoImg from "../../Assets/images/logo.png";
import { motion, useReducedMotion } from "framer-motion";

const SkeletonBlock = ({ className = "" }) => (
  <div className={`skeleton-shimmer rounded-xl bg-white/[0.05] ${className}`} />
);

const SkeletonSection = ({ children, className = "" }) => (
  <section className={`relative py-16 md:py-24 ${className}`}>
    <div className="container mx-auto max-w-7xl px-6">{children}</div>
  </section>
);

export default function LoadingScreen({ isReady = false, onComplete }) {
  const [progress, setProgress] = useState(3);
  const shouldReduceMotion = useReducedMotion();
  const hasCompletedRef = useRef(false);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setProgress((current) => {
        if (isReady) return Math.min(current + 4, 100);
        if (current >= 88) return 88;
        return Math.min(current + Math.max(0.3, (88 - current) * 0.025), 88);
      });
    }, 40);

    return () => {
      window.clearInterval(timer);
    };
  }, [isReady]);

  useEffect(() => {
    if (progress < 100 || hasCompletedRef.current) return;
    hasCompletedRef.current = true;
    onComplete?.();
  }, [onComplete, progress]);

  const displayProgress = Math.round(Number(progress) || 0);

  // SVG Circle calculations for progress ring
  const radius = 68;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (displayProgress / 100) * circumference;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-[#050608] text-white select-none"
      aria-busy="true"
      role="status"
      aria-label="Loading portfolio"
    >
      {/* Background Grid */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.035] [background-image:linear-gradient(to_right,rgba(255,255,255,0.8)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.8)_1px,transparent_1px)] [background-size:32px_32px]"
      />

      <div className="relative z-20 mx-4 flex w-full max-w-sm flex-col items-center gap-7 rounded-2xl border border-white/[0.08] bg-[#090c10]/90 px-8 py-9 backdrop-blur-xl shadow-2xl">
        
        {/* Progress-Linked SVG Spinner Ring Stage */}
        <div className="relative flex h-40 w-40 items-center justify-center">
          
          {/* Radial Ambient Backlight */}
          <div
            aria-hidden="true"
            className="absolute inset-4 rounded-full bg-[radial-gradient(circle,rgba(34,211,238,0.15)_0%,rgba(34,211,238,0)_75%)]"
          />

          {/* DYNAMIC PROGRESS SVG RING */}
          <motion.svg
            className="absolute inset-0 h-full w-full -rotate-90"
            viewBox="0 0 160 160"
            animate={shouldReduceMotion ? undefined : { rotate: 360 }}
            transition={{ duration: 12, ease: "linear", repeat: Infinity }}
          >
            <defs>
              <linearGradient id="cyanEmeraldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#22d3ee" />
                <stop offset="100%" stopColor="#34d399" />
              </linearGradient>
            </defs>

            {/* Background Track Circle */}
            <circle
              cx="80"
              cy="80"
              r={radius}
              className="stroke-white/[0.06]"
              strokeWidth="4"
              fill="transparent"
            />

            {/* Progress Filled Circle Ring */}
            <motion.circle
              cx="80"
              cy="80"
              r={radius}
              stroke="url(#cyanEmeraldGradient)"
              strokeWidth="4"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            />
          </motion.svg>

          {/* Central Logo Box */}
          <motion.div
            className="relative z-10 flex h-24 w-24 items-center justify-center rounded-2xl border border-white/[0.08] bg-[#090c10]/95 shadow-xl shadow-black/40"
            animate={shouldReduceMotion ? undefined : { y: [0, -2, 0] }}
            transition={{ duration: 3.4, ease: "easeInOut", repeat: Infinity }}
          >
            <img
              src={logoImg}
              alt="Ego Web"
              className="h-[4.5rem] w-[4.5rem] object-contain drop-shadow-[0_8px_12px_rgba(0,0,0,0.35)]"
            />
          </motion.div>
        </div>

        {/* Subtext */}
        <div className="w-full text-center">
          <p className="font-sans text-base font-semibold tracking-tight text-white">
            Haider Ali
          </p>
          <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.22em] text-slate-400">
            Software Engineer
          </p>
        </div>

        {/* Clean Progress Meter */}
        <div
          className="w-full text-center"
          role="progressbar"
          aria-label="Loading portfolio content"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={displayProgress}
        >
          <p className="font-mono text-2xl font-bold tabular-nums tracking-tight text-white" aria-hidden="true">
            {displayProgress}<span className="ml-0.5 text-base text-cyan-400">%</span>
          </p>
          <p className="mt-2 font-mono text-[10px] tracking-wide text-slate-400 uppercase">
            Preparing portfolio
          </p>
        </div>
        <span className="sr-only">Portfolio content is loading</span>
      </div>

      {/* Skeletons */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 overflow-hidden opacity-20 blur-[0.5px]">
        <header className="min-h-[min(42rem,82vh)] border-b border-white/[0.06] bg-[#06080b]/70 px-6 py-28 backdrop-blur-sm md:py-36">
          <div className="container mx-auto max-w-7xl">
            <SkeletonBlock className="mb-6 h-4 w-36" />
            <SkeletonBlock className="h-14 w-[min(34rem,90vw)] md:h-20" />
            <SkeletonBlock className="mt-4 h-5 w-[min(28rem,80vw)]" />
          </div>
        </header>
      </div>
    </div>
  );
}