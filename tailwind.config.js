/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#e6f1fe',
          100: '#cce3fd',
          200: '#99c7fb',
          300: '#66abf9',
          400: '#338ff7',
          500: '#0073f5',
          600: '#005cc4',
          700: '#004593',
          800: '#002e62',
          900: '#001731',
        },
        secondary: {
          50: '#e6fff7',
          100: '#ccfff0',
          200: '#99ffe1',
          300: '#66ffd2',
          400: '#33ffc3',
          500: '#00ffb4',
          600: '#00cc90',
          700: '#00996c',
          800: '#006648',
          900: '#003324',
        },
        accent: {
          50: '#f2e6ff',
          100: '#e5ccff',
          200: '#cb99ff',
          300: '#b166ff',
          400: '#9733ff',
          500: '#7d00ff',
          600: '#6400cc',
          700: '#4b0099',
          800: '#320066',
          900: '#190033',
        },
        dark: {
          50: '#e6e8ec',
          100: '#ccd1d9',
          200: '#99a3b3',
          300: '#66758d',
          400: '#334766',
          500: '#001a40',
          600: '#001533',
          700: '#001026',
          800: '#000a1a',
          900: '#00050d',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        glow: '0 0 15px rgba(0, 115, 245, 0.5)',
        'glow-lg': '0 0 30px rgba(0, 115, 245, 0.5)',
        'glow-accent': '0 0 15px rgba(125, 0, 255, 0.5)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 10s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
};