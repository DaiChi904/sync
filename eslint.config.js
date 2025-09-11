import plugin from './eslint-rules-plugin/index.js';
import tsParser from "@typescript-eslint/parser";

export default [
  {
    ignores: ["node_modules/**", ".next/**"],
  },
  {
    files: ['**/*.js', '**/*.ts', '**/*.jsx', '**/*.tsx'],
    languageOptions: {
      parser: tsParser,
      sourceType: 'module',
      parserOptions: {
        project: "./tsconfig.json",
      },
    },
    plugins: {
      'custom-rules': plugin,
    },
    rules: {
      'custom-rules/throw-only-in-try': 'error',
    },
  },
];