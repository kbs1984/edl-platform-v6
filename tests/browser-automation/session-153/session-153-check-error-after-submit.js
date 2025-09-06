const puppeteer = require('puppeteer');

(async () => {
  console.log('=== Session 153: Check for Login Errors ===');
  
  const browser = await puppeteer.launch({
    headless: false,
    slowMo: 100
  });

  try {
    const page = await browser.newPage();
    
    // Navigate
    await page.goto('http://localhost:3000/login', { waitUntil: 'networkidle2' });
    console.log('✅ On login page');
    
    // Fill form using page.type (working method)
    await page.type('[data-testid="email"]', 'brian.bumsik.kim+08test@gmail.com', { delay: 30 });
    await page.type('[data-testid="password"]', '16180339*emD', { delay: 30 });
    console.log('✅ Form filled with white text');
    
    // Click submit
    await page.click('button[type="submit"]');
    console.log('✅ Submit clicked');
    
    // Wait for any response
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    // Now check everything
    const pageAnalysis = await page.evaluate(() => {
      const results = {
        url: window.location.href,
        title: document.title,
        errors: [],
        formStillVisible: false,
        bodyText: ''
      };
      
      // Check if form is still visible
      results.formStillVisible = !!document.querySelector('[data-testid="email"]');
      
      // Look for ANY error-like text
      const possibleErrors = document.querySelectorAll(
        '[role="alert"], .text-red-500, .text-destructive, .error, ' +
        '.alert, .warning, .text-red-600, .bg-red-50, .border-red-500'
      );
      
      possibleErrors.forEach(el => {
        const text = el.textContent.trim();
        if (text) results.errors.push(text);
      });
      
      // Also check for any text that contains "error", "invalid", "incorrect"
      const allText = document.body.innerText.toLowerCase();
      if (allText.includes('invalid') || allText.includes('incorrect') || 
          allText.includes('error') || allText.includes('wrong')) {
        results.bodyText = document.body.innerText.substring(0, 1000);
      }
      
      return results;
    });
    
    console.log('\n📊 Page Analysis:');
    console.log('URL:', pageAnalysis.url);
    console.log('Title:', pageAnalysis.title);
    console.log('Form still visible:', pageAnalysis.formStillVisible);
    
    if (pageAnalysis.errors.length > 0) {
      console.log('\n❌ Error messages found:');
      pageAnalysis.errors.forEach(err => console.log('  -', err));
    }
    
    if (pageAnalysis.bodyText) {
      console.log('\n📄 Page contains error keywords:');
      console.log(pageAnalysis.bodyText);
    }
    
    // Take screenshot
    await page.screenshot({ 
      path: 'session-153-after-submit.png',
      fullPage: true
    });
    console.log('\n📸 Screenshot saved: session-153-after-submit.png');
    
    console.log('\n✅ Analysis complete - browser stays open');
    console.log('Press Ctrl+C to close');
    
    await new Promise(() => {});
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    await browser.close();
  }
})();