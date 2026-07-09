import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./data/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        graphite: {
          950: "#070707",
          900: "#0d0d0f",
          850: "#141417",
          800: "#1a1a1e",
        },
        mist: "#aab7cf",
        silver: "#d7d9dd",
        antique: "#c8b78a",
        violetAsh: "#a899c7",
      },
      fontFamily: {
        sans: [
          "Inter",
          "Geist",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "sans-serif",
        ],
      },
      boxShadow: {
        "soft-glow": "0 24px 90px rgba(170, 183, 207, 0.16)",
      },
      keyframes: {
        "album-marquee": {
          "0%": { transform: "translate3d(0, 0, 0)" },
          "100%": { transform: "translate3d(-50%, 0, 0)" },
        },
        "album-marquee-reverse": {
          "0%": { transform: "translate3d(-50%, 0, 0)" },
          "100%": { transform: "translate3d(0, 0, 0)" },
        },
        "slow-float": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
      animation: {
        "album-marquee": "album-marquee 42s linear infinite",
        "album-marquee-slow": "album-marquee 58s linear infinite",
        "album-marquee-reverse": "album-marquee-reverse 52s linear infinite",
        "slow-float": "slow-float 7s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
