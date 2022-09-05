/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./**/*.html'],
  darkMode: 'class',
  theme: {
    screens: {
      'xxl': {'max': '786px'},
      'xl': {'max': '388px'},
    },

    extend: {

      colors: {
        // Light mode work
        'focus-bg-light': '#FFF2F2',
        'element-color': 'rgba(255, 76, 76, 0.15)',

        // Dark mode work
        'focus-bg-d': '#0D0404',
        'focus-text-color-d': '#FFF2F2',
        'element-color-d': ' rgba(255, 76, 76, 0.15)',
      },

      transitionProperty: {
        'normal': 'all 0.3ms'
      },

      boxShadow: {
        'focus-light': '0px 1px 6px rgba(0, 0, 0, 0.039), 0px 5.5px 16px rgba(0, 0, 0, 0.19)'
      },

      container: {
        center: true,
        padding: '15px',
      },

    },
  },
  plugins: [],
}
