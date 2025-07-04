/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        black: "#000000",
        "navy-blue": "#14213d",
        "accent-gold": "#fca311",
        "light-gray": "#e5e5e5",
        white: "#ffffff",
      },
    },
  },
  plugins: [],
};
