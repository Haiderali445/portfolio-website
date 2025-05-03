module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      animation: {
        'spin-slow': 'spin 8s linear infinite',
      },
      colors: {
        'primary': '#6B5B95',
        'secondary': '#FFD700',
      },
    },
  },
  plugins: [
    require('aos'),
  ],
}