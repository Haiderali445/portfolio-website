/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#050505",
        glass: "rgba(255, 255, 255, 0.03)",
        "glass-border": "rgba(255, 255, 255, 0.08)",
        primary: "#00eaff", // Keeping legacy primary for accents if needed, or we can mute it
        "text-muted": "#888888",
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
      },
      fontFamily: {
        sans: ["Geist Sans", "Inter", "sans-serif"],
        mono: ["Geist Mono", "fira-code", "monospace"],
      },
      animation: {
        "spin-slow": "spin 8s linear infinite",
        "shimmer": "shimmer 2s linear infinite",
      },
      keyframes: {
        shimmer: {
          from: { backgroundPosition: "0 0" },
          to: { backgroundPosition: "-200% 0" },
        },
      },
    },
  },
  plugins: [],
}