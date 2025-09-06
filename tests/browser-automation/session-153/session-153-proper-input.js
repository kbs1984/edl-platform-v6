const puppeteer = require('puppeteer');

(async () => {
  console.log('=== Session 153: Proper Input Method for Next.js ===');
  
  const browser = await puppeteer.launch({
    headless: false,
    slowMo: 200
  });

  try {
    const page = await browser.newPage();
    
    // Navigate to login
    await page.goto('http://localhost:3000/login', { waitUntil: 'networkidle2' });
    console.log('✅ On login page');
    
    // Method 1: Click first, then type (to focus properly)
    console.log('\n🔧 Using click-focus-type method...');
    
    // Click to focus the email field
    await page.click('[data-testid="email"]');
    await page.keyboard.type('brian.bumsik.kim+08test@gmail.com', {delay: 50});
    console.log('✅ Email entered with keyboard');
    
    // Click to focus the password field  
    await page.click('[data-testid="password"]');
    await page.keyboard.type('16180339*emD', {delay: 50});
    console.log('✅ Password entered with keyboard');
    
    // Check if inputs look correct now
    const inputCheck = await page.evaluate(() => {
      const emailInput = document.querySelector('[data-testid="email"]');
      const passwordInput = document.querySelector('[data-testid="password"]');
      
      return {
        emailValue: emailInput ? emailInput.value : 'not found',
        emailColor: emailInput ? window.getComputedStyle(emailInput).color : 'unknown',
        passwordValue: passwordInput ? passwordInput.value.replace(/./g, '*') : 'not found',
        passwordColor: passwordInput ? window.getComputedStyle(passwordInput).color : 'unknown',
        emailClasses: emailInput ? emailInput.className : 'no classes',
        passwordClasses: passwordInput ? passwordInput.className : 'no classes'
      };
    });
    
    console.log('\n📊 Input State Check:');
    console.log('Email value:', inputCheck.emailValue);
    console.log('Email text color:', inputCheck.emailColor);
    console.log('Password value:', inputCheck.passwordValue);
    console.log('Password text color:', inputCheck.passwordColor);
    
    // Now try to submit
    console.log('\n🚀 Submitting form...');
    
    // Click the submit button
    await page.click('button[type="submit"]');
    
    // Wait for navigation or error
    console.log('⏳ Waiting for response...');
    await page.waitForNavigation({ 
      waitUntil: 'networkidle2',
      timeout: 5000 
    }).catch(() => {
      console.log('⚠️ Navigation timeout - checking current state...');
    });
    
    // Check where we ended up
    const currentUrl = page.url();
    console.log('\n📍 Final URL:', currentUrl);
    
    if (currentUrl.includes('localhost:3001')) {
      console.log('✅ SUCCESS! Redirected to dashboard!');
      
      // Check dashboard content
      const dashboardInfo = await page.evaluate(() => {
        return {
          title: document.title,
          url: window.location.href,
          hasAddictionBar: !!document.querySelector('#v5-emcoin-balance'),
          emcoinValue: document.querySelector('#v5-emcoin-balance')?.textContent || 'not found',
          bodyPreview: document.body.innerText.substring(0, 200)
        };
      });
      
      console.log('\n📊 Dashboard Info:');
      console.log('Title:', dashboardInfo.title);
      console.log('Has addiction bar:', dashboardInfo.hasAddictionBar);
      console.log('EmCoin value:', dashboardInfo.emcoinValue);
      
      // Take screenshot of dashboard
      await page.screenshot({ 
        path: 'session-153-dashboard-success.png',
        fullPage: true
      });
      console.log('📸 Dashboard screenshot saved');
      
    } else {
      console.log('❌ Still on auth page');
      
      // Check for errors
      const errors = await page.evaluate(() => {
        const alerts = document.querySelectorAll('[role="alert"], .text-red-500, .text-destructive');
        return Array.from(alerts).map(el => el.textContent.trim());
      });
      
      if (errors.length > 0) {
        console.log('Errors found:', errors);
      }
      
      // Take screenshot of current state
      await page.screenshot({ 
        path: 'session-153-login-state.png',
        fullPage: true
      });
      console.log('📸 Login state screenshot saved');
    }
    
    console.log('\n✅ Test complete');
    console.log('Browser will stay open for inspection...');
    
    // Keep browser open for manual inspection
    await new Promise(() => {});
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    await browser.close();
  }
})();