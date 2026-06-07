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
        'primary-light': '#3b82f6',
        'primary-dark': '#1d4ed8',
        secondary: '#f59e0b',
        'secondary-light': '#fbbf24',
        accent: '#059669',
        'accent-light': '#10b981',
        success: '#16a34a',
        danger: '#dc2626',
        warning: '#ea580c',
      },
      fontFamily: {
        display: ['Playfair Display', 'Georgia', 'serif'],
        body: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      fontSize: {
        'display': ['clamp(2.5rem, 6vw, 5rem)', { lineHeight: '1.1', fontWeight: '800' }],
      },
      boxShadow: {
        'card': '0 1px 2px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.08)',
        'card-hover': '0 4px 8px rgba(0,0,0,0.06), 0 12px 28px rgba(0,0,0,0.1)',
        'button': '0 4px 12px rgba(37, 99, 235, 0.3)',
      },
      spacing: {
        'section': 'clamp(60px, 8vw, 120px)',
      },
      borderRadius: {
        'card': '12px',
      },
    },
  },
  plugins: [],
}
