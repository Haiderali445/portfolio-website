/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  safelist: [
    // Domain glow shadow helpers
    'shadow-glow-azure', 'shadow-glow-cyan', 'shadow-glow-emerald',
    'shadow-glow-violet', 'shadow-glow-amber', 'shadow-glow-rose',
    // Surface elevations
    'bg-surface-1', 'bg-surface-2',
    // Navigation classes
    'nav-dock-container', 'nav-btn', 'nav-btn-active', 
    'nav-btn-home', 'nav-btn-home-active', 'nav-tooltip',
    // Animations
    'animate-scan', 'animate-float', 'animate-domain-pulse',
    'animate-slide-up', 'animate-fade-in', 'animate-pulse-slow',
  ],
  theme: {
    extend: {
      colors: {
        background:    "#050505",
        "surface-1":   "#0d0d0d",
        "surface-2":   "#111111",
        glass:         "rgba(255, 255, 255, 0.03)",
        "glass-border":"rgba(255, 255, 255, 0.08)",
        primary:       "#06B6D4",
        "text-muted":  "#888888",
        border: "hsl(var(--border))",
        input:  "hsl(var(--input))",
        ring:   "hsl(var(--ring))",

        // Domain Color Spectrum
        azure: {
          50:  "#eff6ff", 100: "#dbeafe", 200: "#bfdbfe",
          300: "#93c5fd", 400: "#60a5fa", 500: "#3b82f6",
          600: "#2563eb", 700: "#1d4ed8", 800: "#1e40af",
          900: "#1e3a8a", 950: "#172554",
        },
        cyan: {
          50:  "#ecfeff", 100: "#cffafe", 200: "#a5f3fc",
          300: "#67e8f9", 400: "#22d3ee", 500: "#06b6d4",
          600: "#0891b2", 700: "#0e7490", 800: "#155e75",
          900: "#164e63", 950: "#083344",
        },
        emerald: {
          50:  "#ecfdf5", 100: "#d1fae5", 200: "#a7f3d0",
          300: "#6ee7b7", 400: "#34d399", 500: "#10b981",
          600: "#059669", 700: "#047857", 800: "#065f46",
          900: "#064e3b", 950: "#022c22",
        },
        violet: {
          50:  "#f5f3ff", 100: "#ede9fe", 200: "#ddd6fe",
          300: "#c4b5fd", 400: "#a78bfa", 500: "#8b5cf6",
          600: "#7c3aed", 700: "#6d28d9", 800: "#5b21b6",
          900: "#4c1d95", 950: "#2e1065",
        },
        amber: {
          50:  "#fffbeb", 100: "#fef3c7", 200: "#fde68a",
          300: "#fcd34d", 400: "#fbbf24", 500: "#f59e0b",
          600: "#d97706", 700: "#b45309", 800: "#92400e",
          900: "#78350f", 950: "#451a03",
        },
        rose: {
          50:  "#fff1f2", 100: "#ffe4e6", 200: "#fecdd3",
          300: "#fda4af", 400: "#fb7185", 500: "#f43f5e",
          600: "#e11d48", 700: "#be123c", 800: "#9f1239",
          900: "#881337", 950: "#4c0519",
        },
      },

      fontFamily: {
        sans: ["Geist Sans", "Inter", "sans-serif"],
        mono: ["Geist Mono", "fira-code", "monospace"],
      },

      boxShadow: {
        "glow-azure":    "0 0 40px -8px rgba(59, 130, 246, 0.50)",
        "glow-cyan":     "0 0 40px -8px rgba(6,  182, 212, 0.50)",
        "glow-emerald":  "0 0 40px -8px rgba(16, 185, 129, 0.50)",
        "glow-violet":   "0 0 40px -8px rgba(139, 92, 246, 0.50)",
        "glow-amber":    "0 0 40px -8px rgba(245, 158, 11, 0.50)",
        "glow-rose":     "0 0 40px -8px rgba(244,  63,  94, 0.50)",
        "card-resting":  "0 4px 16px -4px rgba(0,0,0,0.50), inset 0 1px 0 rgba(255,255,255,0.06)",
        "card-elevated": "0 16px 48px -12px rgba(0,0,0,0.75), inset 0 1px 0 rgba(255,255,255,0.10)",
        "card-featured": "0 24px 64px -16px rgba(0,0,0,0.85), inset 0 1px 0 rgba(255,255,255,0.12)",
      },

      animation: {
        "spin-slow":    "spin 8s linear infinite",
        "shimmer":      "shimmer 2s linear infinite",
        "scan":         "scan 3.5s ease-in-out infinite",
        "float":        "float 6s ease-in-out infinite",
        "domain-pulse": "domainPulse 2.5s ease-in-out infinite",
        "pulse-slow":   "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "slide-up":     "slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
        "fade-in":      "fadeIn 0.3s ease-out",
      },

      keyframes: {
        shimmer: {
          from: { backgroundPosition: "0 0" },
          to:   { backgroundPosition: "-200% 0" },
        },
        scan: {
          "0%":   { transform: "translateX(-100%)", opacity: "0" },
          "15%":  { opacity: "1" },
          "85%":  { opacity: "1" },
          "100%": { transform: "translateX(100%)",  opacity: "0" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%":      { transform: "translateY(-8px)" },
        },
        domainPulse: {
          "0%, 100%": { opacity: "0.45", transform: "scale(0.96)" },
          "50%":      { opacity: "1",    transform: "scale(1.04)" },
        },
        slideUp: {
          "0%":   { transform: "translateY(14px)", opacity: "0" },
          "100%": { transform: "translateY(0)",    opacity: "1" },
        },
        fadeIn: {
          "0%":   { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
    },
  },
  plugins: [],
}
