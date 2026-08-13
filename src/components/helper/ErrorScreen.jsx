import React from "react";

export default function ErrorScreen() {
  return (
    <div className="h-screen w-full bg-[#050505] flex flex-col items-center justify-center text-red-500 font-mono">
      <div className="p-8 rounded-3xl bg-red-500/5 border border-red-500/20 backdrop-blur-xl text-center">
        <h2 className="text-xl font-bold mb-2">ERROR: DATA_LOAD_FAILED</h2>
        <p className="text-sm text-gray-400">Please check system logs or backend connectivity.</p>
      </div>
    </div>
  );
}