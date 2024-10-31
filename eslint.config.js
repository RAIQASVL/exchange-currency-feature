import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import * as tseslint from '@typescript-eslint/eslint-plugin';
import tsparser from '@typescript-eslint/parser';

export default {
  overrides: [
    {
      files: ['**/*.{ts,tsx}'],
      processor: tsparser,
      languageOptions: {
        ecmaVersion: 2020,
        globals: {
          ...globals.browser,
        },
      },
      plugins: {
        'react-hooks': reactHooks,
        'react-refresh': reactRefresh,
      },
      rules: {
        ...reactHooks.configs.recommended.rules,
        'react-refresh/only-export-components': [
          'warn',
          { allowConstantExport: true },
        ],
      },
    },
  ],
  extends: [
    js.configs.recommended,
    'plugin:@typescript-eslint/recommended',
    'next/core-web-vitals',
    'next/typescript',
  ],
  ignores: ['dist'],
};