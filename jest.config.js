/**
 * Jest Configuration for @technioz/claude-agents
 *
 * Configuration for running tests with coverage reporting
 */

module.exports = {
  // Test environment
  testEnvironment: 'node',

  // Coverage configuration
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],

  // Coverage thresholds - Critical security files have high coverage
  // fileOperations.js: 93.65% coverage (security-critical functions at 100%)
  // init.js: 78-80% coverage, create.js: 86.66% coverage
  coverageThreshold: {
    './src/utils/fileOperations.js': {
      branches: 90,
      functions: 90,
      lines: 90,
      statements: 90
    },
    './src/commands/init.js': {
      branches: 55,
      functions: 65,
      lines: 75,
      statements: 75
    },
    './src/commands/create.js': {
      branches: 65,
      functions: 100,
      lines: 85,
      statements: 85
    }
  },

  // Files to collect coverage from
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/index.js',
    '!**/node_modules/**',
    '!**/tests/**'
  ],

  // Test match patterns
  testMatch: [
    '**/tests/**/*.test.js'
  ],

  // Setup files
  setupFilesAfterEnv: [],

  // Clear mocks between tests
  clearMocks: true,

  // Verbose output
  verbose: true,

  // Test timeout
  testTimeout: 10000
};
