/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        glow: {
          primary: '#FF5E9C',
          'primary-dark': '#E04884',
          'primary-light': '#FFA1C5',
          secondary: '#FFD6E8',
          bg: '#FFF9FC',
          'bg-card': '#FFFFFF',
          accent: '#E9A6C3',
          'rose-gold': '#D487A7',
          dark: {
            bg: '#0F090E',
            card: '#1B1119',
            surface: '#261723',
            border: '#3D2036',
          }
        }
      },
      fontFamily: {
        sans: ['Poppins', 'Manrope', 'system-ui', 'sans-serif'],
        display: ['Playfair Display', 'Poppins', 'serif']
      },
      boxShadow: {
        'glow-sm': '0 4px 20px -2px rgba(255, 94, 156, 0.15)',
        'glow': '0 8px 30px -4px rgba(255, 94, 156, 0.25)',
        'glow-lg': '0 15px 40px -5px rgba(255, 94, 156, 0.35)',
        'glass': '0 8px 32px 0 rgba(255, 140, 185, 0.12)',
        'glass-dark': '0 8px 32px 0 rgba(0, 0, 0, 0.4)',
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [],
}
