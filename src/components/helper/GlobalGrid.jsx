// src/components/helper/GlobalGrid.jsx
import React, { useEffect, useRef } from "react";

/**
 * GlobalGrid
 *
 * Fixed overlay at z-[999] with mix-blend-mode: screen.
 * White lines on black canvas = visible. pointer-events-none so
 * nothing underneath loses click/hover interaction.
 *
 * Scroll-driven rAF loop breathes the opacity dynamically.
 */
const GlobalGrid = () => {
  const gridRef = useRef(null);
  const rafRef = useRef(null);

  useEffect(() => {
    const el = gridRef.current;
    if (!el) return;

    const lerp = (a, b, t) => a + (b - a) * t;
    const clamp = (v, min, max) => Math.min(Math.max(v, min), max);

    // Opacity curve — tuned for mix-blend-mode: screen
    // Higher values = more visible white lines on dark canvas
    const getTargetOpacity = (scrollY) => {
      if (scrollY < 400) {
        // Hero: 0.18 → 0.13
        return lerp(0.18, 0.13, clamp(scrollY / 400, 0, 1));
      } else if (scrollY < 1400) {
        // Content: 0.13 → 0.10
        return lerp(0.13, 0.10, clamp((scrollY - 400) / 1000, 0, 1));
      } else {
        // Footer approach: 0.10 → 0.15
        return lerp(0.10, 0.15, clamp((scrollY - 1400) / 1200, 0, 1));
      }
    };

    let currentOpacity = 0.18;
    let targetOpacity = 0.18;

    const tick = () => {
      targetOpacity = getTargetOpacity(window.scrollY);
      currentOpacity += (targetOpacity - currentOpacity) * 0.06;
      el.style.opacity = currentOpacity.toFixed(4);
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <>
      {/* ── Architectural grid — screen blend cuts through all section backgrounds ── */}
      <div
        ref={gridRef}
        aria-hidden="true"
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 999,
          pointerEvents: "none",
          opacity: 0.18,
          mixBlendMode: "screen",
          backgroundImage:
            "linear-gradient(to right, rgba(255,255,255,1) 1px, transparent 1px), " +
            "linear-gradient(to bottom, rgba(255,255,255,1) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      {/* ── Edge vignette — fades grid at viewport perimeter ── */}
      <div
        aria-hidden="true"
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 999,
          pointerEvents: "none",
          mixBlendMode: "multiply",
          background:
            "radial-gradient(ellipse 90% 80% at 50% 50%, transparent 50%, #000000 100%)",
        }}
      />
    </>
  );
};

export default GlobalGrid;
