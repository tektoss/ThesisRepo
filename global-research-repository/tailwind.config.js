/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx}',
    './src/pages/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        times: ["Times New Roman", 'serif'],
      },
      colors: {
        arxivRed: '#b31b1b',
        arxivRedHover: '#991616',
        arxivBlue: '#0066cc',
        arxivLightBlue: '#e8f4fd',
        arxivGray: '#fafafa',
      },
    },
  },
  plugins: [],
};