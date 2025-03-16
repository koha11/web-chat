/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    'src/**/*.{html,pug}',
    'src/**/**/*.{html,pug}',
    'src/**/**/**/*.{html,pug}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        body: ['Roboto', 'Arial', 'sans-serif'],
        poppins: ['Poppins', 'sans-serif'],
      },
    },
  },

  darkMode: 'class',
  plugins: [],
};
