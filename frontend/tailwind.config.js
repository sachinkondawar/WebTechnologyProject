/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'jb-dark': '#09090b', // Deep zinc/black
        'jb-card': 'rgba(24, 24, 27, 0.65)', // Elegant glassmorphism dark
        'jb-border': 'rgba(255, 255, 255, 0.08)', // Subtle light border
        'jb-accent': '#0ea5e9', // Vibrant Sky blue
        'jb-accent-hover': '#38bdf8', // Lighter sky on hover
      },
      animation: {
        'fade-in': 'fadeIn 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(15px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      }
    },
  },
  plugins: [],
}