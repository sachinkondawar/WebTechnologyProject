/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'jb-dark': '#f8fafc', // Soft slate off-white for background
        'jb-card': 'rgba(255, 255, 255, 0.8)', // Glassmorphism white
        'jb-border': 'rgba(0, 0, 0, 0.06)', // Soft thin borders
        'jb-accent': '#0d9488', // Teal
        'jb-accent-hover': '#0f766e', // Deep Teal
      },
      animation: {
        'fade-in': 'fadeIn 0.8s ease-out forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      }
    },
  },
  plugins: [],
}