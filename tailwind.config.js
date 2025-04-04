module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        'primary-light': '#CB997E',
        'primary': '#DDBEA9',
        'primary-dark': '#A5A58D',
        'secondary': '#FFE8D6',
        'secondary-dark': '#B7B7A4',
        'accent': '#6B705C',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}