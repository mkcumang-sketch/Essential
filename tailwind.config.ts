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
        // SwissTimeHouse Style Luxury Palette
        swiss: {
          cream: "#F8F6F2",  // मुख्य बैकग्राउंड
          gold: "#C9A24D",   // बटन्स और एक्सेंट के लिए
          dark: "#1A1A1A",   // टेक्स्ट के लिए डीप चारकोल
          muted: "#E5E1DA",  // हल्के बॉर्डर के लिए
        },
      },
      fontFamily: {
        // Fonts को यहाँ रजिस्टर करें
        serif: ["var(--font-playfair)", "serif"],
        sans: ["var(--font-inter)", "sans-serif"],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
};
export default config;