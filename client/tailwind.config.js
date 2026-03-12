/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#14A800',
        secondary: '#108A00',
        dark: '#001E00',
      }
    },
  },
  plugins: [],
}