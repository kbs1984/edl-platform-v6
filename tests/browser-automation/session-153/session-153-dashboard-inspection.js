const puppeteer = require('puppeteer');

(async () => {
  console.log('=== Session 153: Dashboard Inspection with Visible Browser ===');
  console.log('Using credentials: brian.bumsik.kim+08test@gmail.com');
  console.log('');
  
  const browser = await puppeteer.launch({
    headless: false,  // VISIBLE BROWSER
    slowMo: 500,      // Slow down so user can see
    defaultViewport: null,
    args: ['--start-maximized']
  });

  try {
    const page = await browser.newPage();
    
    // Step 1: Navigate to Auth Gateway
    console.log('📍 Navigating to Auth Gateway...');
    await page.goto('http://localhost:3000/login', { 
      waitUntil: 'networkidle2'  // Critical for Next.js hydration
    });
    
    // Step 2: Fill Login Form (using correct selectors from Session 152)
    console.log('📝 Filling login form...');
    
    // Wait for the form to be ready
    await page.waitForSelector('[data-testid="email"]', { timeout: 5000 });
    
    // Fill email
    await page.type('[data-testid="email"]', 'brian.bumsik.kim+08test@gmail.com');
    
    // Fill password
    await page.type('[data-testid="password"]', '16180339*emD');
    
    console.log('🔐 Credentials entered');
    
    // Step 3: Submit the form
    console.log('🚀 Submitting login form...');
    await page.click('button[type="submit"]');
    
    // Step 4: Wait for navigation to dashboard
    console.log('⏳ Waiting for dashboard...');
    try {
      await page.waitForNavigation({ 
        waitUntil: 'networkidle2',
        timeout: 10000 
      });
      console.log('✅ Successfully logged in!');
    } catch (e) {
      console.log('⚠️ Navigation timeout - checking current URL...');
      const currentUrl = page.url();
      console.log('Current URL:', currentUrl);
      
      if (currentUrl.includes('localhost:3001')) {
        console.log('✅ Redirected to dashboard successfully');
      }
    }
    
    // Step 5: Inspect Dashboard Elements
    console.log('\n=== Dashboard Inspection ===\n');
    
    // Check for addiction bar elements
    const addictionElements = [
      { selector: '#v5-emcoin-balance', name: 'EmCoin Balance' },
      { selector: '#v5-streak-count', name: 'Streak Count' },
      { selector: '#v5-today-count', name: 'Today Count' },
      { selector: '#v5-rank-position', name: 'Rank Position' }
    ];
    
    console.log('🎮 Checking Addiction Mechanics:');
    for (const elem of addictionElements) {
      try {
        await page.waitForSelector(elem.selector, { timeout: 2000 });
        const value = await page.$eval(elem.selector, el => el.textContent);
        console.log(`  ✅ ${elem.name}: "${value}"`);
      } catch (e) {
        console.log(`  ❌ ${elem.name}: NOT FOUND`);
      }
    }
    
    // Check for navigation elements
    console.log('\n🧭 Checking Navigation:');
    const navElements = [
      { selector: '[href="/activities"]', name: 'Activities' },
      { selector: '[href="/friends"]', name: 'Friends' },
      { selector: '[href="/groups"]', name: 'Groups' },
      { selector: '[href="/progress"]', name: 'Progress' }
    ];
    
    for (const elem of navElements) {
      try {
        await page.waitForSelector(elem.selector, { timeout: 1000 });
        console.log(`  ✅ ${elem.name} link exists`);
      } catch (e) {
        console.log(`  ❌ ${elem.name} link NOT FOUND`);
      }
    }
    
    // Step 6: Try to navigate to Friends
    console.log('\n🔄 Attempting to navigate to Friends page...');
    try {
      // Try the corrected approach from Session 152
      await page.evaluate(() => {
        const friendsLink = document.querySelector('[href="/friends"]');
        if (friendsLink) friendsLink.click();
      });
      
      await page.waitForTimeout(2000);
      const afterClickUrl = page.url();
      console.log('Current URL after click:', afterClickUrl);
      
      if (afterClickUrl.includes('/friends')) {
        console.log('✅ Successfully navigated to Friends');
        
        // Check what's on the Friends page
        const friendsContent = await page.evaluate(() => {
          return document.body.innerText.substring(0, 200);
        });
        console.log('Friends page content preview:', friendsContent);
      } else {
        console.log('⚠️ Navigation did not work - still on:', afterClickUrl);
      }
    } catch (e) {
      console.log('❌ Failed to navigate to Friends:', e.message);
    }
    
    // Step 7: Check for any error messages
    console.log('\n🔍 Checking for errors or warnings:');
    const errorSelectors = [
      '.error', '.alert', '.warning', '[role="alert"]'
    ];
    
    for (const selector of errorSelectors) {
      const errors = await page.$$(selector);
      if (errors.length > 0) {
        const errorText = await page.$eval(selector, el => el.textContent);
        console.log(`  ⚠️ Found error: ${errorText}`);
      }
    }
    
    // Step 8: Take screenshot for evidence
    console.log('\n📸 Taking screenshot...');
    await page.screenshot({ 
      path: 'session-153-dashboard-evidence.png',
      fullPage: true 
    });
    console.log('Screenshot saved: session-153-dashboard-evidence.png');
    
    // Step 9: Get page title and meta info
    const pageTitle = await page.title();
    console.log('\n📄 Page Info:');
    console.log('  Title:', pageTitle);
    console.log('  URL:', page.url());
    
    // Step 10: Check for V5 integration
    console.log('\n🔧 Checking V5 Integration:');
    const hasV5 = await page.evaluate(() => {
      return typeof window.v5 !== 'undefined';
    });
    
    if (hasV5) {
      console.log('  ✅ V5 object exists in window');
      const v5Info = await page.evaluate(() => {
        if (window.v5) {
          return {
            hasAddiction: typeof window.v5.addiction !== 'undefined',
            hasProgress: typeof window.v5.progress !== 'undefined',
            hasEmcoin: typeof window.v5.emcoin !== 'undefined'
          };
        }
        return null;
      });
      if (v5Info) {
        console.log('  V5 modules:', v5Info);
      }
    } else {
      console.log('  ❌ V5 integration NOT FOUND');
    }
    
    console.log('\n=== Inspection Complete ===');
    console.log('Browser will remain open for manual inspection.');
    console.log('Press Ctrl+C to close when done.');
    
    // Keep browser open for manual inspection
    await new Promise(() => {});
    
  } catch (error) {
    console.error('❌ Error during inspection:', error.message);
    console.error('Stack:', error.stack);
  }
})();