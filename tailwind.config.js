/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'selector',
  content: ["./src/**/*.{html,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        random: "hsl(var(--random))",
        grape: "rgba(var(--grape))",
      }
    },
  },
  plugins: [],
}

