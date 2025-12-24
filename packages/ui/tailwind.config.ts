import type { Config } from 'tailwindcss';

export default {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/libs/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        button: {
          active: '#ac8ad0',
          hover: '#e8c6f8',
          main: '#caa8e4',
        },
        error: '#d72b0d',
        foreground: 'var(--foreground)',
        gray: '#999999',
        phase10: {
          card: {
            black: '#111111',
            blue: '#0f56b5',
            green: '#11650c',
            purple: '#6a0dad',
            red: '#e5000b',
          },
          cover: {
            blue: '#063684',
          },
        }
      },
    },
    fontFamily: {
      quicksand: ['Quicksand'],
      roboto: ['Roboto'],
    }
  },
  plugins: [],
} satisfies Config;
