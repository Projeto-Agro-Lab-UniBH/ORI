/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        shark: {
          50: "#f4f6f7",
          100: "#e3e7ea",
          200: "#cbd3d6",
          300: "#a6b4ba",
          400: "#7a8c96",
          500: "#5f717b",
          600: "#515f69",
          700: "#465058",
          800: "#3e454c",
          900: "#373d42",
          950: "#212529",
        },
        'science-blue': {
          '50': '#ecf8ff',
          '100': '#d5eeff',
          '200': '#b5e2ff',
          '300': '#81d2ff',
          '400': '#46b6ff',
          '500': '#1c94ff',
          '600': '#0473ff',
          '700': '#005af7',
          '800': '#064acb',
          '900': '#0c419c',
          '950': '#0d295e',
        },      
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};
