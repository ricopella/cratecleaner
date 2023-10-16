/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/renderer/index.html', './src/renderer/src/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class',
  daisyui: {
    themes: ['luxury']
  },
  theme: {
    extend: {
      gridTemplateColumns: {
        'max-max': 'max-content max-content',
        'max-max-max': 'repeat(3, max-content)',
        'max-max-1fr': 'max-content max-content 1fr',
        'max-max-1fr-max': 'max-content max-content 1fr max-content',
        'max-max-1fr-max-max': 'max-content max-content 1fr max-content max-content',
        '1fr-max': '1fr max-content',
        'max-1fr': 'max-content 1fr',
        '1fr-1fr-max': '1fr 1fr max-content',
        '1fr-1fr-max-max': '1fr 1fr max-content max-content'
      },
      gridTemplateRows: {
        'max-1fr-max': 'max-content 1fr max-content',
        'max-1fr': 'max-content 1fr',
        '1fr-max': '1fr max-content',
        'max-max': 'max-content max-content',
        'max-max-max': 'repeat(3, max-content)'
      }
    }
  },
  plugins: [require('daisyui')]
}
