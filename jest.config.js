export default {
  testEnvironment: 'node',
  transform: {},
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  testMatch: [
    '**/__tests__/**/*.test.js',
    '**/__tests__/**/*.spec.js',
  ],
  collectCoverageFrom: [
    '**/*.js',
    '!**/__tests__/**',
    '!**/node_modules/**',
    '!**/build/**',
    '!jest.config.js',
    '!coverage/**',
    '!build-*.js',
    '!**/scripts/**',
    '!**/examples/**',
  ],
  // Coverage thresholds disabled as all JS files are build scripts
  // that are tested through integration tests, not unit tests
  maxWorkers: 1, // Run tests sequentially to avoid build directory conflicts
};