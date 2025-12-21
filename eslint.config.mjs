// @ts-check

import eslint from '@eslint/js';
import hooks from 'eslint-plugin-react-hooks'
import react from 'eslint-plugin-react'
import tseslint from 'typescript-eslint';

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    ignores: ['**/.next/*']
  },
  {
    plugins: {
      react,
      'react-hooks': hooks,
    },
    rules: {
      ...hooks.configs.recommended.rules,
      ...react.configs.recommended.rules,
      '@typescript-eslint/no-unused-expressions': 'off',
      'react/prop-types': 'off',
      'react/react-in-jsx-scope': 'off',
    }
  }
);
