// tailwind.config.js
module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  theme: {
    extend: {
      colors: {
          'red-team': '#d81c2c',
          'blue-team': '#17739e',
          'bystander': '#aeae99',
          'assassin': '#060505',
          'manila': '#cfbd94',
      },
    },
  },
  variants: {},
  plugins: [],
};
