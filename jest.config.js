module.exports = {
  verbose: true,
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: ['**/*.spec.test.js'],
  coverageDirectory: './coverage/',
  collectCoverage: true,
  testEnvironmentOptions: { url: 'http://localhost:3000' },
  moduleNameMapper: {
    '^#utils/(.*)$': '<rootDir>/src/utils/$1',
    '^#testUtils/(.*)$': '<rootDir>/src/functions/common/__tests__/__utils__/$1',
  },
  resetMocks: true,
};
