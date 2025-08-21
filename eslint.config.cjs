const eslintPluginPrettier = require('eslint-plugin-prettier');
const tsParser = require('@typescript-eslint/parser');
const tsPlugin = require('@typescript-eslint/eslint-plugin');

module.exports = [
  {
    files: ['src/**/*.ts'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: './tsconfig.json',
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      prettier: eslintPluginPrettier,
    },
    rules: {
      'prettier/prettier': 'error',
      // tambahkan rules lain sesuai kebutuhan
    },
  },
];