// src/hooks/useLenis.js
import { useEffect } from "react";
import Lenis from "lenis";

export const useLenis = () => {
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
    const isTouchDevice = window.matchMedia?.("(pointer: coarse)")?.matches;

    if (prefersReducedMotion || isTouchDevice) {
      return undefined;
    }

    const lenis = new Lenis({
      duration: 0.9,
      easing: (t) => 1 - Math.pow(1 - t, 3),
      smoothWheel: true,
      wheelMultiplier: 0.9,
      touchMultiplier: 1.1,
      gestureOrientation: "vertical",
      lerp: 0.08,
      syncTouch: false,
      autoResize: true,
    });

    let rafId = null;

    const loop = (time) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(loop);
    };

    rafId = requestAnimationFrame(loop);

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);
};