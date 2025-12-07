/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        charcoal: '#1A1A1D',
        navy: '#0D1B2A',
        lime: '#C7F464',
        hotpink: '#FF006E',
        offwhite: '#F8F9FA',
      },
      fontFamily: {
        'space': ['SpaceMono-Regular'],
      },
    },
  },
  plugins: [],
};
