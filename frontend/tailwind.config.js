/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        navy: { DEFAULT: "#0F172A", 800: "#1E293B", 700: "#334155", 600: "#475569" },
        black: { DEFAULT: "#111827", soft: "#1a2235" },
        slate: { panel: "#1E293B", border: "#2d3f5b" },
        cyan: { ai: "#00D4FF", glow: "#00b8d9" },
        purple: { ai: "#7C3AED", light: "#a855f7" },
        green: { neon: "#10b981", soft: "#34d399" },
        amber: { warn: "#f59e0b" },
      },
      fontFamily: {
        heading: ["Space Grotesk", "sans-serif"],
        body: ["Inter", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "hero-gradient": "linear-gradient(135deg, #0F172A 0%, #1a1040 50%, #0F172A 100%)",
        "card-gradient": "linear-gradient(135deg, rgba(30,41,59,0.9) 0%, rgba(15,23,42,0.95) 100%)",
        "cyber-grid": "linear-gradient(rgba(0,212,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,255,0.03) 1px, transparent 1px)",
      },
      boxShadow: {
        "glow-cyan": "0 0 20px rgba(0,212,255,0.3), 0 0 40px rgba(0,212,255,0.1)",
        "glow-purple": "0 0 20px rgba(124,58,237,0.3), 0 0 40px rgba(124,58,237,0.1)",
        "card": "0 4px 24px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)",
        "card-hover": "0 8px 40px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.08)",
      },
      animation: {
        "float": "float 6s ease-in-out infinite",
        "pulse-slow": "pulse 4s ease-in-out infinite",
        "glow": "glow 2s ease-in-out infinite alternate",
        "slide-up": "slideUp 0.6s ease-out forwards",
        "counter": "counter 2s ease-out forwards",
      },
      keyframes: {
        float: { "0%,100%": { transform: "translateY(0)" }, "50%": { transform: "translateY(-10px)" } },
        glow: { from: { boxShadow: "0 0 10px rgba(0,212,255,0.2)" }, to: { boxShadow: "0 0 30px rgba(0,212,255,0.5)" } },
        slideUp: { from: { opacity: 0, transform: "translateY(30px)" }, to: { opacity: 1, transform: "translateY(0)" } },
      },
    },
  },
  plugins: [],
};
