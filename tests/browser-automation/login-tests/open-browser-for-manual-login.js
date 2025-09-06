/**
 * Session 151: Open Browser for Manual Login
 * Opens browser and waits for you to log in manually
 * Then we can test the dashboard features
 */

const { chromium } = require('playwright');

(async () => {
  console.log('🚀 Opening browser for manual login...\n');
  
  const browser = await chromium.launch({
    headless: false,
    slowMo: 100,
  });

  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 },
    // Keep session data
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
  });
  
  const page = await context.newPage();
  
  console.log('📍 Navigating to Auth Gateway...');
  await page.goto('http://localhost:3000/login');
  
  console.log('\n' + '='.repeat(60));
  console.log('📝 MANUAL LOGIN REQUIRED');
  console.log('='.repeat(60));
  console.log('Please log in manually with:');
  console.log('Email: brian.bumsik.kim+08test@gmail.com');
  console.log('Password: 16180339*emD');
  console.log('='.repeat(60));
  console.log('\nAfter login, the browser will stay open.');
  console.log('I will then run tests on the dashboard.\n');
  
  // Wait for login - check URL every second
  let loggedIn = false;
  while (!loggedIn) {
    await page.waitForTimeout(1000);
    const url = page.url();
    if (url.includes('localhost:3001')) {
      loggedIn = true;
      console.log('\n✅ Login detected! Now at dashboard.');
      break;
    }
  }
  
  // Now test the addiction bar
  console.log('\n' + '='.repeat(60));
  console.log('🧪 TESTING ADDICTION BAR ELEMENTS');
  console.log('='.repeat(60));
  
  // Test 1: Check addiction bar exists
  console.log('\nTest 1: Checking addiction bar visibility...');
  const addictionBar = await page.$('#v5-addiction-bar');
  if (addictionBar) {
    console.log('  ✅ Addiction bar is visible');
    
    // Get current values
    const emcoins = await page.textContent('#v5-emcoin-balance').catch(() => 'not found');
    const streak = await page.textContent('#v5-streak-count').catch(() => 'not found');
    const visitors = await page.textContent('#v5-today-count').catch(() => 'not found');
    const rank = await page.textContent('#v5-rank-position').catch(() => 'not found');
    
    console.log('\n📊 Current Values:');
    console.log(`  🪙 EmCoins: ${emcoins}`);
    console.log(`  🔥 Streak: ${streak} days`);
    console.log(`  👁️ Today Visitors: ${visitors}`);
    console.log(`  🏆 Division Rank: ${rank}`);
  } else {
    console.log('  ❌ Addiction bar not found');
  }
  
  // Test 2: Navigate and check persistence
  console.log('\nTest 2: Testing addiction bar persistence...');
  
  const navButtons = ['Friends', 'Teams & Guilds', 'Dashboard'];
  for (const btnText of navButtons) {
    const button = await page.$(`button:has-text("${btnText}")`);
    if (button) {
      console.log(`  Clicking ${btnText}...`);
      await button.click();
      await page.waitForTimeout(1500);
      
      const stillVisible = await page.$('#v5-addiction-bar');
      if (stillVisible) {
        console.log(`    ✅ Bar still visible on ${btnText}`);
      } else {
        console.log(`    ❌ Bar disappeared on ${btnText}`);
      }
    }
  }
  
  // Test 3: Take screenshots
  console.log('\nTest 3: Capturing evidence...');
  await page.screenshot({ path: 'dashboard-with-addiction-bar.png', fullPage: true });
  console.log('  📸 Full page screenshot saved');
  
  // Take close-up of just the addiction bar
  const barElement = await page.$('#v5-addiction-bar');
  if (barElement) {
    await barElement.screenshot({ path: 'addiction-bar-closeup.png' });
    console.log('  📸 Addiction bar close-up saved');
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('✅ TESTING COMPLETE');
  console.log('='.repeat(60));
  console.log('\nEvidence collected:');
  console.log('  • dashboard-with-addiction-bar.png');
  console.log('  • addiction-bar-closeup.png');
  console.log('\nBrowser will stay open. Press Ctrl+C to close.');
  
  // Keep browser open
  await new Promise(() => {});
})();