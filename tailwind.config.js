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
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
          950: '#082f49',
        },
        apple: {
          canvas: '#eae2d5',
          'canvas-dark': '#0b0f19',
          surface: '#ffffff',
          'surface-dark': '#111827',
          red: '#ff5f56',
          yellow: '#ffbd2e',
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
