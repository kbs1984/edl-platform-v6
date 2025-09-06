const puppeteer = require('puppeteer');

(async () => {
  console.log('=== Session 153: Quick Login Test ===');
  
  const browser = await puppeteer.launch({
    headless: false,  // VISIBLE BROWSER
    slowMo: 200,      // Faster but still visible
    defaultViewport: null
  });

  try {
    const page = await browser.newPage();
    
    // Navigate
    console.log('Going to login page...');
    await page.goto('http://localhost:3000/login', { 
      waitUntil: 'networkidle2'
    });
    
    // Check what selectors exist
    console.log('\nChecking available selectors:');
    
    const selectors = [
      '[data-testid="email"]',
      '[data-cy="email"]',
      'input[name="email"]',
      '#email'
    ];
    
    for (const sel of selectors) {
      const exists = await page.$(sel) !== null;
      console.log(`  ${sel}: ${exists ? '✅' : '❌'}`);
    }
    
    // Try to find the actual email input
    const emailInput = await page.$('[data-testid="email"]') || 
                      await page.$('[data-cy="email"]') || 
                      await page.$('input[name="email"]');
    
    if (emailInput) {
      console.log('\n✅ Found email input, filling form...');
      
      // Type email
      await page.type('[data-testid="email"]', 'brian.bumsik.kim+08test@gmail.com');
      
      // Type password
      await page.type('[data-testid="password"]', '16180339*emD');
      
      console.log('📝 Form filled');
      
      // Submit
      console.log('🚀 Submitting...');
      await page.click('button[type="submit"]');
      
      // Wait briefly
      await page.waitForTimeout(5000);
      
      // Check where we are
      const currentUrl = page.url();
      console.log('\n📍 Current URL:', currentUrl);
      
      if (currentUrl.includes('3001')) {
        console.log('✅ Redirected to dashboard!');
        
        // Quick check for addiction elements
        const emcoinBalance = await page.$('#v5-emcoin-balance');
        if (emcoinBalance) {
          const value = await page.$eval('#v5-emcoin-balance', el => el.textContent);
          console.log(`EmCoin Balance: ${value}`);
        }
        
        // Take screenshot
        await page.screenshot({ 
          path: 'session-153-logged-in.png'
        });
        console.log('\n📸 Screenshot saved: session-153-logged-in.png');
      } else {
        console.log('⚠️ Still on auth page');
        
        // Check for errors
        const errorText = await page.evaluate(() => {
          const alerts = document.querySelectorAll('[role="alert"], .error, .text-red-500');
          return Array.from(alerts).map(el => el.textContent).join(' | ');
        });
        
        if (errorText) {
          console.log('Error found:', errorText);
        }
      }
    } else {
      console.log('❌ Could not find email input!');
    }
    
    console.log('\n✅ Test complete - browser stays open');
    console.log('Press Ctrl+C to close');
    
    // Keep open
    await new Promise(() => {});
    
  } catch (error) {
    console.error('Error:', error.message);
    await browser.close();
  }
})();