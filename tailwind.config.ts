import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#D85A30",
          light: "#E87A55",
          dark: "#B84820",
          50: "#FDF2ED",
          100: "#FAE0D4",
          200: "#F5C1A9",
          300: "#EFA17E",
          400: "#E87A55",
          500: "#D85A30",
          600: "#B84820",
          700: "#8F3818",
          800: "#662810",
          900: "#3D1808",
        },
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      keyframes: {
        "score-ring": {
          "0%": { "stroke-dashoffset": "339.29" },
          "100%": { "stroke-dashoffset": "var(--target-offset)" },
        },
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "slide-in": {
          "0%": { opacity: "0", transform: "translateX(-10px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        pulse: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.5" },
        },
      },
      animation: {
        "score-ring": "score-ring 1.5s ease-out forwards",
        "fade-in": "fade-in 0.4s ease-out forwards",
        "slide-in": "slide-in 0.3s ease-out forwards",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
