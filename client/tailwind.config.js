const { join } = require('path')

/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: 'jit',
  content: [
    join(__dirname, './src/pages/**/*.{js,ts,jsx,tsx}'),
    join(__dirname, './src/components/**/*.{js,ts,jsx,tsx}'),
    join(__dirname, './src/hooks/**/*.{js,ts,jsx,tsx}'),
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        gray: {
          900: '#202225',
          800: '#2f3136',
          700: '#36393f',
          600: '#4f545c',
          400: '#d4d7dc',
          300: '#e3e5e8',
          200: '#ebedef',
          100: '#f2f3f5',
        },
        'main': '#bb4817',
        'main-l': '#bb4817AA',
        'sec': '#779dad',
        'sec-l': '#779dadAA',
        'dark-gray': '#808080',
        'offwhite': '#FAF9F6'
      },
      spacing: {
        88: '22rem',
      },
    },
  },
}
