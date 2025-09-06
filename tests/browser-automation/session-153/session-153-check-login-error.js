const puppeteer = require('puppeteer');

(async () => {
  console.log('=== Session 153: Login Error Check ===');
  
  const browser = await puppeteer.launch({
    headless: false,
    slowMo: 100
  });

  try {
    const page = await browser.newPage();
    
    // Navigate to login
    await page.goto('http://localhost:3000/login', { waitUntil: 'networkidle2' });
    console.log('✅ On login page');
    
    // Fill form
    await page.type('[data-testid="email"]', 'brian.bumsik.kim+08test@gmail.com');
    await page.type('[data-testid="password"]', '16180339*emD');
    console.log('✅ Credentials entered');
    
    // Click submit and wait a bit
    await page.click('button[type="submit"]');
    console.log('⏳ Form submitted, waiting for response...');
    
    // Wait for potential navigation or error
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Check where we are
    const currentUrl = page.url();
    console.log('\n📍 Current URL:', currentUrl);
    
    // Check for any error messages
    const errorCheck = await page.evaluate(() => {
      // Look for error alerts
      const alerts = document.querySelectorAll('[role="alert"], .text-red-500, .error, .text-destructive');
      const errors = Array.from(alerts).map(el => el.textContent.trim()).filter(t => t.length > 0);
      
      // Check if we're still on login page
      const stillOnLogin = window.location.pathname === '/login';
      
      // Check page content
      const pageText = document.body.innerText;
      
      return {
        errors,
        stillOnLogin,
        pageTitle: document.title,
        hasEmailInput: !!document.querySelector('[data-testid="email"]'),
        pagePreview: pageText.substring(0, 500)
      };
    });
    
    console.log('\n📊 Page Analysis:');
    console.log('Still on login:', errorCheck.stillOnLogin);
    console.log('Page title:', errorCheck.pageTitle);
    console.log('Has email input:', errorCheck.hasEmailInput);
    
    if (errorCheck.errors.length > 0) {
      console.log('\n❌ Errors found:');
      errorCheck.errors.forEach(err => console.log('  -', err));
    } else {
      console.log('\n✅ No visible errors');
    }
    
    console.log('\n📄 Page content preview:');
    console.log(errorCheck.pagePreview);
    
    // Take screenshot
    await page.screenshot({ 
      path: 'session-153-login-result.png',
      fullPage: true
    });
    console.log('\n📸 Screenshot saved: session-153-login-result.png');
    
    console.log('\n✅ Check complete');
    await browser.close();
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    await browser.close();
  }
})();