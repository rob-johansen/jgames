import type { Config } from 'tailwindcss';

export default {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/libs/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      boxShadow: {
        phase: '0 0 8px 2px rgba(0, 0, 0, 0.1)',
        phaseToggle: '0 0 5px 1px rgba(0, 0, 0, 0.2)',
        phaseToggleInset: 'inset 0 0 8px 1px rgba(0, 0, 0, 0.25)',
      },
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
        },
        success: '#258750'
      },
    },
    fontFamily: {
      quicksand: ['Quicksand'],
      roboto: ['Roboto'],
    }
  },
  plugins: [],
} satisfies Config;
