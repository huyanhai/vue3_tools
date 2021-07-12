const colors = require('tailwindcss/colors');
const IS_PROD = process.env.NODE_ENV !== 'development';

module.exports = {
  mode: IS_PROD ? '' : 'jit',
  purge: ['./*.html', './src/**/*.vue'],
  darkMode: 'media', // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        custom: ({ opacityVariable, opacityValue }) => {
          if (opacityValue !== undefined) {
            return `rgba(var(--color-primary), ${opacityValue})`;
          }
          if (opacityVariable !== undefined) {
            return `rgba(var(--color-primary), var(${opacityVariable}, 1))`;
          }
          return `rgb(var(--color-primary))`;
        },
      },
    },
    margin: {
      sm: '10px',
    },
    colors: {
      ...colors,
    },
  },
  variants: {
    extend: {
      padding: ['hover'],
    },
  },
  plugins: [],
};
