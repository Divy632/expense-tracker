/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: '#10192B',
          light: '#18243D',
          lighter: '#22314F',
        },
        paper: {
          DEFAULT: '#FBF8F2',
          dim: '#F1ECE0',
        },
        ledger: {
          DEFAULT: '#1F6F5C',
          light: '#2C8A73',
          dark: '#155647',
        },
        gold: {
          DEFAULT: '#C9973E',
          light: '#DDB264',
          dark: '#A87A2B',
        },
        rust: {
          DEFAULT: '#B24C3A',
          light: '#CC6650',
          dark: '#8F3B2C',
        },
        slate: {
          DEFAULT: '#64708A',
          light: '#8993AA',
          dark: '#414B62',
        },
      },
      fontFamily: {
        display: ['"Fraunces"', 'serif'],
        body: ['"Inter"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      backgroundImage: {
        'ledger-lines':
          'repeating-linear-gradient(180deg, transparent, transparent 27px, rgba(100,112,138,0.08) 28px)',
      },
      boxShadow: {
        stub: '0 1px 0 rgba(16,25,43,0.04), 0 8px 24px -12px rgba(16,25,43,0.25)',
      },
    },
  },
  plugins: [],
};
