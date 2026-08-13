import React from "react";

export default function LoadingScreen() {
  return (
    <div className="h-screen w-full bg-[#050505] flex flex-col items-center justify-center relative overflow-hidden">
      <div className="absolute w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px] animate-pulse" />
      <div className="relative z-10 p-8 rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-xl flex flex-col items-center gap-6 shadow-2xl">
        <div className="relative flex items-center justify-center w-16 h-16">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-30" />
          <div className="w-12 h-12 rounded-full border-2 border-cyan-400/20 border-t-cyan-400 animate-spin" />
        </div>
        <p className="text-sm font-mono text-cyan-400 tracking-widest uppercase animate-pulse">
          INITIALIZING SYSTEM...
        </p>
      </div>
    </div>
  );
}