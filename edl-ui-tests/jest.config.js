/**
 * Jest Configuration for EDL UI Tests
 * Session 133 - Test reporting and coverage configuration
 */

module.exports = {
    // Test environment
    testEnvironment: 'node',
    
    // Test match patterns
    testMatch: [
        '**/*.test.js',
        '**/*.spec.js'
    ],
    
    // Ignore patterns
    testPathIgnorePatterns: [
        '/node_modules/',
        '/dist/',
        '/build/'
    ],
    
    // Coverage configuration
    coverageDirectory: './coverage',
    collectCoverageFrom: [
        '**/*.js',
        '!**/node_modules/**',
        '!**/coverage/**',
        '!jest.config.js'
    ],
    
    // Reporters for test results
    reporters: [
        'default',
        ['jest-junit', {
            outputDirectory: './test-results',
            outputName: 'junit.xml',
            ancestorSeparator: ' › ',
            uniqueOutputName: 'false',
            suiteNameTemplate: '{filepath}',
            classNameTemplate: '{classname}',
            titleTemplate: '{title}'
        }]
    ],
    
    // Timeout settings
    testTimeout: 30000, // 30 seconds per test
    
    // Setup and teardown
    globalSetup: undefined, // Can add './test-setup.js' if needed
    globalTeardown: undefined, // Can add './test-teardown.js' if needed
    
    // Verbose output for CI
    verbose: process.env.CI === 'true',
    
    // Bail on first test failure in CI
    bail: process.env.CI === 'true' ? 1 : 0,
    
    // Maximum worker threads
    maxWorkers: process.env.CI === 'true' ? 2 : '50%',
    
    // Transform files (if using ES6 modules)
    transform: {},
    
    // Module name mapper for aliases
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/$1'
    },
    
    // Clear mocks between tests
    clearMocks: true,
    
    // Restore mocks between tests
    restoreMocks: true,
    
    // Root directory
    rootDir: '.',
    
    // Display name
    displayName: 'EDL UI Tests'
};