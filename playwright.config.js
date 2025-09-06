/**
 * Playwright Configuration for Session 151
 * Configured to show browser window for visual test verification
 */

module.exports = {
  testDir: './tests',
  timeout: 60000,
  expect: {
    timeout: 10000
  },
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: 'list',
  use: {
    // CRITICAL: Show the browser window
    headless: false,
    
    // Slow down actions so user can see them
    slowMo: 500,
    
    // Browser viewport settings
    viewport: { width: 1280, height: 720 },
    
    // Enable screenshots on failure
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    
    // Base URL for tests
    baseURL: 'http://localhost:3001',
    
    // Action timeout
    actionTimeout: 10000,
  },
  
  projects: [
    {
      name: 'chromium',
      use: {
        ...require('@playwright/test').devices['Desktop Chrome'],
        // Override to ensure browser is visible
        headless: false,
        launchOptions: {
          slowMo: 500,
        }
      },
    },
  ],
};