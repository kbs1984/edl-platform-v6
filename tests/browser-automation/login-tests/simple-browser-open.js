/**
 * Session 151: Simple Browser - Just Stay Open
 * Opens browser and keeps it alive for manual exploration
 */

const { chromium } = require('playwright');

(async () => {
  console.log('🚀 Opening browser...\n');
  
  const browser = await chromium.launch({
    headless: false,
    slowMo: 100,
  });

  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 }
  });
  
  const page = await context.newPage();
  
  console.log('📍 Navigating to Auth Gateway...');
  await page.goto('http://localhost:3000/login');
  
  console.log('\n' + '='.repeat(60));
  console.log('Browser is open. You can:');
  console.log('1. Log in manually');
  console.log('2. Navigate through the dashboard');
  console.log('3. Show me what features exist');
  console.log('='.repeat(60));
  console.log('\nThe browser will stay open until you press Ctrl+C\n');
  
  // Just keep it alive
  setInterval(() => {
    // Do nothing, just prevent exit
  }, 1000);
})();