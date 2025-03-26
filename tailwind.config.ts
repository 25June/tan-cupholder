import type { Config } from 'tailwindcss';

export default {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'from-white-to-transparent-180deg':
          'linear-gradient(180deg, rgba(255, 255, 255, 0) 48.29%, rgba(249, 249, 249, 0.95) 71.06%)',
        'from-white-to-transparent-270deg':
          'linear-gradient(270deg, rgba(255, 255, 255, 0) 48.29%, rgba(249, 249, 249, 0.95) 71.06%)',
      },
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        'logo-orange': '#f57722',
        'logo-orange-border': '#ec8c4c',
        'logo-text': '#493213',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out', // Adjust duration and easing
        'fade-out': 'fadeOut 0.5s ease-in-out', // Adjust duration and easing,
        'shadow-pulse': 'shadow-pulse 3s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeOut: {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
        'shadow-pulse': {
          '0%': { boxShadow: '0 25px 50px -12px rgba(255, 255, 255, 0.7)' }, // White shadow
          '50%': {
            boxShadow:
              '0 20px 25px -5px rgba(236, 140, 76, 0.5), 0 8px 10px -6px rgba(236, 140, 76, 0.5)',
          }, // Orange shadow
          '100%': { boxShadow: '0 25px 50px -12px rgba(255, 255, 255, 0.7)' }, // Back to white
        },
      },
      maxWidth: {
        '8xl': '90rem',
        'extra-20vw': 'calc(100vw)',
      },
      maxHeight: {
        '128': '32rem',
      },
      outlineOffset: {
        '8': '8px',
      },
      transitionProperty: {
        'max-height': 'max-height',
        spacing: 'margin, padding',
      },
    },
  },
  plugins: [],
} satisfies Config;
