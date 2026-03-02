import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Primary: Professional Blue (shadcn style)
        primary: {
          50: '#f0f4f8',
          100: '#d9e2ec',
          200: '#b3c5d9',
          300: '#8da9c5',
          400: '#698cb2',
          500: '#456f9f',
          600: '#35568c',
          700: '#263d79',
          800: '#1a2a5f',
          900: '#0f1845',
          950: '#0a0f2e',
        },
        // Neutral: Professional Grey (shadcn style)
        neutral: {
          50: '#f8f9fa',
          100: '#f1f3f5',
          200: '#e9ecef',
          300: '#dee2e6',
          400: '#ced4da',
          500: '#adb5bd',
          600: '#868e96',
          700: '#495057',
          800: '#343a40',
          900: '#212529',
          950: '#0d0f12',
        },
      },
      spacing: {
        'safe-top': 'env(safe-area-inset-top)',
        'safe-bottom': 'env(safe-area-inset-bottom)',
      },
      screens: {
        xs: '320px',
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1536px',
      },
    },
  },
  plugins: [],
};

export default config;
