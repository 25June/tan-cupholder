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
        'fade-out': 'fadeOut 0.5s ease-in-out', // Adjust duration and easing
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
    },
  },
  plugins: [],
} satisfies Config;
