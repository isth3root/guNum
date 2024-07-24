/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily : {
        Teko : ["Teko", 'sans-serif']
      },
      colors: {
        greenWinner : "#06D001",
        redLoser : "#ef4444",
        greyTie : "#cbd5e1",
        themePink : "#F19ED2",
        themeDark : "#0C0C0C",
        themeBlue : "#4C3BCF",
        themePurple : "#4A249D"
      },
    },
  },
  plugins: [],
}