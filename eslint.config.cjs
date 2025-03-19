const airbnbBase = require('eslint-config-airbnb-base');
const jest = require('eslint-plugin-jest');
const prettier = require('eslint-plugin-prettier');

module.exports = [
  {
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: 'commonjs',
      globals: {
        browser: true,
        commonjs: true,
        console: 'readonly',   // ✅ Add this line
        process: 'readonly',   // ✅ Ensure this is here for process.env
        module: 'readonly',    // Optional, but good for CommonJS
        require: 'readonly',   // Optional, but good for CommonJS
        __dirname: 'readonly', // Optional, good for Node.js
      }
    },
    plugins: {
      jest,
      prettier,
    },
    rules: {
      ...airbnbBase.rules,
      'comma-dangle': ['error', 'always-multiline'],
      'max-len': ['error', { code: 200 }],
      quotes: [2, 'single', 'avoid-escape'],
      camelcase: 'warn',
      'no-case-declarations': 'warn',
      'no-console': 'off',
      'no-param-reassign': [2, {
        props: false,
      }],
      'linebreak-style': 0,
      'no-shadow': 'warn',
      'no-await-in-loop': 0,
    },
    settings: {
      'import/resolver': {
        alias: {
          map: [
            ['#root/*', '.'],
            ['#src/*', './src'],
            ['#middlewares', './src/middlewares'],
            ['#functions', './src/functions'],
            ['#utils', './src/utils'],
            ['#testUtils', './src/functions/common/__tests__/__utils__'],
          ],
          extensions: ['.js', '.json'],
        },
        node: {
          extensions: ['.js', '.json', '.jsx', '.ts', '.tsx'],
        },
      },
    },
  },
  // ✅ Test-specific config for Jest globals
  {
    files: ["**/__tests__/**/*.js", "**/*.spec.js", "**/*.test.js", "**/*.spec.test.js"],
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: 'commonjs',
      globals: {
        jest: 'readonly',
        describe: 'readonly',
        test: 'readonly',
        expect: 'readonly',
        beforeEach: 'readonly',
        afterEach: 'readonly',
      },
    },
    plugins: {
      jest,
    },
    rules: {
      'jest/no-disabled-tests': 'warn',
      'jest/no-focused-tests': 'error',
      'jest/no-identical-title': 'error',
    },
  },
];
