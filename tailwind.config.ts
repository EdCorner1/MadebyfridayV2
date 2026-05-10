import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif'],
        stinger: ['Stinger', 'Georgia', 'serif'],
      },
      colors: {
        coral: '#FF6B35',
        cream: '#FDFCF7',
        charcoal: '#111111',
      },
    },
  },
  plugins: [],
};

export default config;