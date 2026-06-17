import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        cream: {
          50: "#FAF7F2",
          100: "#F0EBE3",
        },
        dark: {
          bg: "#1C1916",
          surface: "#252018",
        },
        warm: {
          900: "#2C2620",
          600: "#7A6E66",
          400: "#9E9085",
          border: "#DDD5C8",
          "border-dark": "#3A342C",
        },
        accent: {
          DEFAULT: "#8B6F47",
          dark: "#B08B60",
        },
      },
      fontFamily: {
        serif: ["var(--font-lora)", "Georgia", "serif"],
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      maxWidth: {
        prose: "65ch",
      },
      lineHeight: {
        reading: "1.85",
      },
    },
  },
  plugins: [],
};
export default config;
