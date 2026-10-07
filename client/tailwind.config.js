/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cyber: {
          deep: '#06152F',
          dark: '#081B3A',
          midnight: '#031027',
          cyan: '#00C8FF',
          blue: '#1687FF',
          purple: '#7C3AED',
          violet: '#9B5CFF',
          bg: '#F5F8FC',
          card: '#FFFFFF',
          border: '#E2E8F0',
          text: '#0F172A',
          muted: '#64748B'
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'cyber-sm': '0 2px 8px -2px rgba(0, 200, 255, 0.15)',
        'cyber-glow': '0 0 15px rgba(0, 200, 255, 0.35)',
        'cyber-purple-glow': '0 0 15px rgba(124, 58, 237, 0.35)',
        'card': '0 4px 20px -2px rgba(6, 21, 47, 0.05)',
      }
    },
  },
  plugins: [],
}
