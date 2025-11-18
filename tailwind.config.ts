// import type { Config } from "tailwindcss";s
import { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#3ED36D",
        secondary: "#1E293B",
        accent: "#22C55E",
        heading: "#0F172A",
        body: "#475569",
        background: "#F8FAFC",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        display: ["Poppins", "sans-serif"],
      },
      fontSize: {
        h1: ["3rem", { lineHeight: "1.1", fontWeight: "800" }],
        h2: ["2.25rem", { lineHeight: "1.2", fontWeight: "700" }],
        h3: ["1.5rem", { lineHeight: "1.3", fontWeight: "600" }],
        base: ["1rem", { lineHeight: "1.6", fontWeight: "400" }],
        small: ["0.875rem", { lineHeight: "1.4" }],
      },
    },
  },
  plugins: [],
};

export default config;
