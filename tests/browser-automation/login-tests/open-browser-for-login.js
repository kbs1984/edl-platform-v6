/**
 * Session 151: Open Browser for Manual Login
 * This script opens a browser window and waits for manual login
 */

const { chromium } = require('playwright');

(async () => {
  console.log('🚀 Opening browser for manual login...');
  
  // Launch browser with UI visible
  const browser = await chromium.launch({
    headless: false,
    slowMo: 100,
  });

  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 }
  });
  
  const page = await context.newPage();
  
  // Navigate to the auth gateway
  console.log('📍 Navigating to http://localhost:3000 (Auth Gateway)...');
  await page.goto('http://localhost:3000');
  
  console.log('✅ Browser opened. Please log in manually.');
  console.log('📝 After login, you should be redirected to http://localhost:3001 (Dashboard)');
  console.log('⏸️  The browser will stay open. Press Ctrl+C when done.');
  
  // Keep the browser open
  await new Promise(() => {});
})();