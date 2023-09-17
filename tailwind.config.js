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
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};
