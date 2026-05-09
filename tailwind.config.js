/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1e3a5f',
        secondary: '#f59e0b',
        accent: '#2d5a7b',
        blue: '#3b82f6',
        yellow: '#fbbf24',
        green: '#10b981',
        red: '#ef4444',
        orange: '#f97316',
        purple: '#8b5cf6',
      }
    },
  },
  plugins: [],
}
