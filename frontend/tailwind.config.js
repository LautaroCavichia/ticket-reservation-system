/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      fontFamily: {
        'display': ['Playfair Display', 'serif'],
        'body': ['Inter', 'sans-serif'],
      },
      colors: {
        primary: {
          50: '#faf7f2',
          100: '#f5efe5',
          200: '#e8dcc6',
          300: '#dbc9a7',
          400: '#cd853f', // Peru
          500: '#8b4513', // Sienna
          600: '#7a3d11',
          700: '#65320e',
          800: '#4f270b',
          900: '#3a1d08',
        },
        accent: {
          50: '#fefce8',
          100: '#fef9c3',
          200: '#fef08a',
          300: '#fde047',
          400: '#facc15',
          500: '#daa520', // Goldenrod
          600: '#ca8a04',
          700: '#a16207',
          800: '#854d0e',
          900: '#713f12',
        },
        secondary: {
          50: '#f7f8f0',
          100: '#eef1e1',
          200: '#dde3c4',
          300: '#c6d29f',
          400: '#9acd32', // Yellow Green
          500: '#556b2f', // Dark Olive Green
          600: '#4a5e29',
          700: '#3e4f22',
          800: '#32401c',
          900: '#263116',
        },
        warm: {
          50: '#fefbf3',
          100: '#fdf6e3',
          200: '#fbecbe',
          300: '#f8e194',
          400: '#f4d76a',
          500: '#deb887', // Burlywood
          600: '#d4a574',
          700: '#c99261',
          800: '#be7f4e',
          900: '#b36c3b',
        },
        earth: {
          50: '#f9f6f4',
          100: '#f3ede9',
          200: '#e5d5cc',
          300: '#d7bdaf',
          400: '#c19a82',
          500: '#a0522d', // Sienna
          600: '#904a28',
          700: '#783e22',
          800: '#60311b',
          900: '#482515',
        },
        stone: {
          50: '#fefefe',
          100: '#fdfdfd',
          200: '#fafafa',
          300: '#f7f7f7',
          400: '#f1f1f1',
          500: '#f5f5dc', // Beige
          600: '#ddddc7',
          700: '#c5c5b2',
          800: '#adad9d',
          900: '#959588',
        },
        wine: {
          50: '#faf5f5',
          100: '#f5ebeb',
          200: '#e8d0d0',
          300: '#dab5b5',
          400: '#be7f7f',
          500: '#722f37', // Dark Red
          600: '#672932',
          700: '#56232a',
          800: '#451c22',
          900: '#34151a',
        }
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'gradient-primary': 'linear-gradient(135deg, #8b4513 0%, #654321 100%)',
        'gradient-accent': 'linear-gradient(135deg, #daa520 0%, #cd853f 100%)',
        'gradient-warm': 'linear-gradient(135deg, #deb887 0%, #f4e4bc 100%)',
        'gradient-glass': 'linear-gradient(135deg, rgba(245, 245, 220, 0.1) 0%, rgba(245, 245, 220, 0.05) 100%)',
      },
      backdropBlur: {
        xs: '2px',
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.8s ease-out',
        'fade-in-scale': 'fadeInScale 0.6s ease-out',
        'shimmer': 'shimmer 2s infinite linear',
        'float': 'float 3s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'bounce-subtle': 'bounceSubtle 2s infinite',
      },
      keyframes: {
        fadeInUp: {
          'from': {
            opacity: '0',
            transform: 'translateY(30px)',
          },
          'to': {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        fadeInScale: {
          'from': {
            opacity: '0',
            transform: 'scale(0.9)',
          },
          'to': {
            opacity: '1',
            transform: 'scale(1)',
          },
        },
        shimmer: {
          '0%': {
            'background-position': '-200px 0',
          },
          '100%': {
            'background-position': 'calc(200px + 100%) 0',
          },
        },
        float: {
          '0%, 100%': {
            transform: 'translateY(0px)',
          },
          '50%': {
            transform: 'translateY(-10px)',
          },
        },
        pulseGlow: {
          '0%, 100%': {
            'box-shadow': '0 0 5px rgba(139, 69, 19, 0.5)',
          },
          '50%': {
            'box-shadow': '0 0 20px rgba(139, 69, 19, 0.8)',
          },
        },
        bounceSubtle: {
          '0%, 20%, 50%, 80%, 100%': {
            transform: 'translateY(0)',
          },
          '40%': {
            transform: 'translateY(-4px)',
          },
          '60%': {
            transform: 'translateY(-2px)',
          },
        },
      },
      boxShadow: {
        'glass': '0 8px 32px rgba(139, 69, 19, 0.1)',
        'glass-lg': '0 12px 40px rgba(139, 69, 19, 0.15)',
        'glass-xl': '0 20px 60px rgba(139, 69, 19, 0.2)',
        'warm': '0 4px 20px rgba(222, 184, 135, 0.3)',
        'accent': '0 4px 20px rgba(218, 165, 32, 0.3)',
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      zIndex: {
        '60': '60',
        '70': '70',
        '80': '80',
        '90': '90',
        '100': '100',
      },
      lineClamp: {
        7: '7',
        8: '8',
        9: '9',
        10: '10',
      }
    },
  },
  plugins: [],
}