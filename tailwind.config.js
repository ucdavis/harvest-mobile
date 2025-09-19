/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        harvest: "#266041",
        merlot: "#79242F",      // brand primary
        "secondary-bg": "#F7F7F7",
        "primary-font": "#1F1F1F",
        "primary-border": "#DFDFDF",
        "danger": "#79242F",
      },
      textColor: {
        DEFAULT: "#1F1F1F",
      },
    },
  },
  plugins: [],
};