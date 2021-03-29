module.exports = {
  purge: false,
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        'test-color': '#ff0000',
        'test-black': 'black',
        'test-red': 'red',
      },
      padding: {
        test: '10px',
      },
      margin: {
        test: '10px',
      },
    },
  },
  variants: {
    extend: {},
  },
  prefix: '',
  plugins: [],
};
