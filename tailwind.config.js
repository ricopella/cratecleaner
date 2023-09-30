/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/renderer/index.html', './src/renderer/src/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class',
  daisyui: {
    themes: ['luxury']
  },
  theme: {
    extend: {}
  },
  plugins: [require('daisyui')]
}
