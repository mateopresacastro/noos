import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "music-bars": {
          "10%, 100%": { transform: "scaleY(0.6)" },
          "30%": { transform: "scaleY(1)" },
          "60%": { transform: "scaleY(0.5)" },
          "80%": { transform: "scaleY(0.75)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "music-bars": "music-bars 1.8s ease infinite alternate",
      },
      animationDelay: {
        "500": "1750ms",
        "750": "360ms",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
