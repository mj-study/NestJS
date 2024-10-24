// eslint.config.js
import { ESLint } from 'eslint';
import parser from '@typescript-eslint/parser'; // 파서를 명확하게 지정
import prettierPlugin from 'eslint-plugin-prettier'; // Prettier 플러그인을 불러옴

export default [
  {
    files: ['**/*.ts', '**/*.js'],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: 'module',
      parser: parser, // 파서를 직접 지정
    },
    plugins: {
      prettier: prettierPlugin,
    }, // Prettier 플러그인 적용
    rules: {
      'no-unused-vars': 'warn',
      semi: ['error', 'always'],
      quotes: ['error', 'single'],
      'prettier/prettier': ['error'], // Prettier의 규칙을 ESLint에서 에러로 처리
    },
  },
];
