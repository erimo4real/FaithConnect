/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#2563eb',
        secondary: '#f59e0b',
        accent: '#059669',
        success: '#16a34a',
        danger: '#dc2626',
        warning: '#ea580c',
      }
    },
  },
  plugins: [],
}
