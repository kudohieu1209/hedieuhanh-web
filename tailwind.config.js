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
        brand: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
          950: '#450a0a',
        },
        hust: {
          red: '#b91c1c',
          'red-dark': '#991b1b',
          'red-light': '#dc2626',
          gold: '#f59e0b',
          'gold-dark': '#d97706',
          'gold-light': '#fbbf24',
        },
        apple: {
          canvas: '#eae2d5',
          'canvas-dark': '#0b0f19',
          surface: '#ffffff',
          'surface-dark': '#111827',
          red: '#b91c1c',
          yellow: '#f59e0b',
          green: '#27c93f',
        },
        navy: {
          800: '#111827',
          850: '#0d131f',
          900: '#0b0f19',
          950: '#060911',
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
        serif: ['Newsreader', 'Playfair Display', 'Georgia', 'serif'],
        mono: ['"JetBrains Mono"', 'Fira Code', 'Consolas', 'monospace'],
      },
      borderRadius: {
        '22px': '22px',
        apple: '22px',
      },
      boxShadow: {
        apple: '0 1px 2px rgba(0, 0, 0, 0.03), 0 16px 40px -8px rgba(28, 25, 23, 0.07), 0 32px 70px -16px rgba(28, 25, 23, 0.05)',
        'apple-hover': '0 20px 48px -10px rgba(28, 25, 23, 0.12), 0 2px 6px rgba(0, 0, 0, 0.06)',
        'apple-dark': '0 1px 2px rgba(0, 0, 0, 0.2), 0 16px 40px -8px rgba(0, 0, 0, 0.5), 0 32px 70px -16px rgba(0, 0, 0, 0.6)',
      }
    },
  },
  plugins: [],
}
