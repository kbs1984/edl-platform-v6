const puppeteer = require('puppeteer');

(async () => {
  console.log('=== Session 153: Focus and Type Properly ===');
  
  const browser = await puppeteer.launch({
    headless: false,
    slowMo: 200,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();
    
    // Navigate
    await page.goto('http://localhost:3000/login', { waitUntil: 'networkidle2' });
    console.log('✅ On login page');
    
    // Method: Focus first, then type with proper events
    console.log('\n📝 Filling email...');
    
    // Focus the email field by clicking it
    await page.focus('[data-testid="email"]');
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Clear any existing value and type new one
    await page.evaluate(() => {
      const input = document.querySelector('[data-testid="email"]');
      input.value = '';
    });
    
    // Type using a combination approach
    await page.type('[data-testid="email"]', 'brian.bumsik.kim+08test@gmail.com', { delay: 100 });
    
    // Check if it's white
    const emailColor = await page.evaluate(() => {
      const input = document.querySelector('[data-testid="email"]');
      return window.getComputedStyle(input).color;
    });
    console.log('Email text color:', emailColor);
    
    // Now do password
    console.log('\n📝 Filling password...');
    
    // Focus password field
    await page.focus('[data-testid="password"]');
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Clear and type password
    await page.evaluate(() => {
      const input = document.querySelector('[data-testid="password"]');
      input.value = '';
    });
    
    await page.type('[data-testid="password"]', '16180339*emD', { delay: 100 });
    
    // Check password color
    const passwordColor = await page.evaluate(() => {
      const input = document.querySelector('[data-testid="password"]');
      return window.getComputedStyle(input).color;
    });
    console.log('Password text color:', passwordColor);
    
    // Verify values are set
    const values = await page.evaluate(() => {
      return {
        email: document.querySelector('[data-testid="email"]').value,
        passwordLength: document.querySelector('[data-testid="password"]').value.length
      };
    });
    
    console.log('\n📊 Form values:');
    console.log('Email:', values.email);
    console.log('Password length:', values.passwordLength);
    
    if (emailColor === 'rgb(248, 250, 252)' && passwordColor === 'rgb(248, 250, 252)') {
      console.log('\n✅ Text is WHITE - inputs recognized!');
      
      // Try to submit
      console.log('\n🚀 Submitting form...');
      await page.click('button[type="submit"]');
      
      // Wait for navigation
      await new Promise(resolve => setTimeout(resolve, 5000));
      
      const finalUrl = page.url();
      console.log('\n📍 Final URL:', finalUrl);
      
      if (finalUrl.includes('localhost:3001')) {
        console.log('🎉 SUCCESS! Logged in!');
      } else {
        console.log('❌ Still on login page');
      }
    } else {
      console.log('\n❌ Text is GRAY - input not recognized');
      console.log('This is the issue - the form isn\'t accepting the input properly');
    }
    
    console.log('\n✅ Test complete - browser stays open');
    console.log('Press Ctrl+C to close');
    
    await new Promise(() => {});
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    await browser.close();
  }
})();