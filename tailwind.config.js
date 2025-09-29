/** @type {import('tailwindcss').Config} */
// Keep this file CJS-friendly; Node can't import TS here.
const Colors = {
  harvest: "#266041",
  merlot: "#79242F",
  secondarybg: "#F7F7F7",
  primaryfont: "#1F1F1F",
  primaryborder: "#DFDFDF",
};
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        harvest: Colors.harvest,
        merlot: Colors.merlot,
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