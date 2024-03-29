module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
    'jest/globals': true,
  },
  extends: [
    'airbnb-base',
  ],
  plugins: ['prettier', 'jest'],
  parserOptions: {
    ecmaVersion: 2020,
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
    },
  },
  rules: {
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
};
