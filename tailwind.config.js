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
        'max-max-1fr': 'max-content max-content 1fr',
        'max-max-1fr-max': 'max-content max-content 1fr max-content',
        'max-max-1fr-max-max': 'max-content max-content 1fr max-content max-content'
      },
      gridTemplateRows: {
        'max-1fr-max': 'max-content 1fr max-content',
        'max-1fr': 'max-content 1fr'
      }
    }
  },
  plugins: [require('daisyui')]
}
