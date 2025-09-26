/** @type {import('tailwindcss').Config} */
const { Colors } = require("./constants/Colors");
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        harvest: Colors.harvest,
        merlot: Colors.merlot,      // brand primary
        secondarybg: Colors.secondarybg,
        primaryfont: Colors.primaryfont,
        primaryborder: Colors.primaryborder,
        danger: Colors.merlot,
      },
      textColor: {
        DEFAULT: Colors.primaryfont,
      },
    },
  },
  plugins: [],
};