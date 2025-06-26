/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        surface: 'var(--surface)',
        border: 'var(--border)',
        'text-primary': 'var(--text-primary)',
        'text-secondary': 'var(--text-secondary)',
        'accent-green': 'var(--accent-green)',
        'accent-green-hover': 'var(--accent-green-hover)',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['"Times New Roman"', 'serif'],
      },
    },
  },
  plugins: [],
};