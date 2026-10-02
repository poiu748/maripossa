import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // night (dark sections + the logo's natural home)
        night: "#160F0D",
        "night-2": "#211613",
        "night-3": "#2C1E18",
        // warm light surfaces
        crust: "#FBF3E6",
        surface: "#FFFDF8",
        // text
        ink: "#241A14",
        cream: "#F5E8D2",
        muted: "#8C765C",
        "muted-d": "#C2A887",
        // heat
        ember: "#E4552A",
        "ember-d": "#C6431D",
        amber: "#F4A93C",
        // fresh
        basil: "#356B3D",
        "basil-l": "#4E8A4F",
        // lines
        line: "#EEE0C8",
        "line-d": "rgba(255,255,255,.12)",
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        ar: ["var(--font-ar)", "var(--font-sans)", "sans-serif"],
      },
      maxWidth: {
        app: "1180px",
      },
      boxShadow: {
        card: "0 14px 34px -10px rgba(60,30,12,.18)",
        "card-sm": "0 6px 18px -6px rgba(60,30,12,.16)",
        lift: "0 22px 48px -16px rgba(60,30,12,.30)",
        glow: "0 0 0 7px rgba(255,255,255,.06), 0 24px 60px -12px rgba(228,85,42,.45)",
      },
      keyframes: {
        floatUp: {
          from: { opacity: "0", transform: "translateY(14px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        glowPulse: {
          "0%, 100%": {
            boxShadow:
              "0 0 0 7px rgba(255,255,255,.05), 0 26px 70px -10px rgba(228,85,42,.40)",
          },
          "50%": {
            boxShadow:
              "0 0 0 7px rgba(255,255,255,.08), 0 30px 90px -8px rgba(244,169,60,.55)",
          },
        },
        drift: {
          "0%, 100%": { transform: "translate3d(0,0,0)" },
          "50%": { transform: "translate3d(0,-10px,0)" },
        },
      },
      animation: {
        floatUp: "floatUp .6s ease both",
        glowPulse: "glowPulse 5s ease-in-out infinite",
        drift: "drift 7s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
