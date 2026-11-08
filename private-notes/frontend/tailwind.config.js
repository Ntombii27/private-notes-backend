/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: { sans: ['Figtree', 'system-ui', 'sans-serif'] },
      colors: {
        paper: '#E9EFEC',
        sheet: '#FBFCFB',
        ink: '#1B2622',
        muted: '#5E6E67',
        line: '#CBD6D1',
        pine: { DEFAULT: '#1F5F55', dark: '#174A42' },
        danger: '#A8402F',
      },
    },
  },
  plugins: [],
};
