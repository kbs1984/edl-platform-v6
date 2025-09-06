/**
 * Session 151: Force Click Approach
 * Try clicking on the input areas directly
 */

const { chromium } = require('playwright');

(async () => {
  console.log('🚀 Attempting login with force click approach...\n');
  
  const browser = await chromium.launch({
    headless: false,
    slowMo: 500,
  });

  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 }
  });
  
  const page = await context.newPage();
  
  try {
    console.log('📍 Navigating to login page...');
    await page.goto('http://localhost:3000/login');
    await page.waitForTimeout(2000);
    
    console.log('🔍 Looking for input fields...');
    
    // Try to click on the email field area first
    console.log('Clicking on email field area...');
    await page.click('text=Your email');
    await page.waitForTimeout(500);
    
    // Type the email
    console.log('Typing email...');
    await page.keyboard.type('brian.bumsik.kim+08test@gmail.com', { delay: 50 });
    await page.waitForTimeout(500);
    
    // Click on password field
    console.log('Clicking on password field area...');
    await page.click('text=Your password');
    await page.waitForTimeout(500);
    
    // Type the password
    console.log('Typing password...');
    await page.keyboard.type('16180339*emD', { delay: 50 });
    await page.waitForTimeout(500);
    
    // Click login button
    console.log('Clicking login button...');
    await page.click('button:has-text("Login")');
    
    console.log('Waiting for navigation...');
    await page.waitForTimeout(5000);
    
    // Check where we are
    const url = page.url();
    console.log(`\n📍 Current URL: ${url}`);
    
    if (url.includes('localhost:3001')) {
      console.log('✅ SUCCESS! Logged into dashboard!');
      
      // Now check for addiction bar
      const addictionBar = await page.$('#v5-addiction-bar');
      if (addictionBar) {
        console.log('✅ Addiction bar found!');
        
        // Get values
        const emcoins = await page.textContent('#v5-emcoin-balance');
        const streak = await page.textContent('#v5-streak-count');
        const visitors = await page.textContent('#v5-today-count');
        const rank = await page.textContent('#v5-rank-position');
        
        console.log('\n📊 Current Addiction Bar Values:');
        console.log(`  🪙 EmCoins: ${emcoins}`);
        console.log(`  🔥 Streak: ${streak}`);
        console.log(`  👁️ Visitors: ${visitors}`);
        console.log(`  🏆 Rank: ${rank}`);
      }
      
      await page.screenshot({ path: 'successful-login-with-addiction-bar.png' });
      console.log('\n📸 Screenshot saved: successful-login-with-addiction-bar.png');
      
    } else {
      console.log('❌ Login failed - still on login page');
      
      // Look for any error messages
      const pageContent = await page.textContent('body');
      if (pageContent.includes('Invalid')) {
        console.log('Error: Invalid credentials');
      }
    }
    
  } catch (error) {
    console.error('Error:', error.message);
  }
  
  console.log('\n✅ Test complete. Browser staying open for 10 seconds...');
  await page.waitForTimeout(10000);
  
  await browser.close();
  console.log('Browser closed.');
})();