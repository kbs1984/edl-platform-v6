const puppeteer = require('puppeteer');

(async () => {
  console.log('=== Session 153: Keyboard Input Method (Working) ===');
  
  const browser = await puppeteer.launch({
    headless: false,
    slowMo: 300,  // Slower to see what's happening
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();
    
    // Navigate to login
    await page.goto('http://localhost:3000/login', { waitUntil: 'networkidle2' });
    console.log('✅ On login page');
    
    // Method that was working: Click to focus, then use keyboard
    console.log('\n🔧 Using click-focus + keyboard method...');
    
    // Click email field to focus it
    await page.click('[data-testid="email"]');
    await new Promise(resolve => setTimeout(resolve, 500)); // Small delay
    
    // Type email using keyboard (this shows white text)
    await page.keyboard.type('brian.bumsik.kim+08test@gmail.com', {delay: 50});
    console.log('✅ Email entered (should be white)');
    
    await new Promise(resolve => setTimeout(resolve, 500)); // Small delay
    
    // Click password field to focus it
    await page.click('[data-testid="password"]');
    await new Promise(resolve => setTimeout(resolve, 500)); // Small delay
    
    // Type password using keyboard (this shows white text)
    await page.keyboard.type('16180339*emD', {delay: 50});
    console.log('✅ Password entered (should be white)');
    
    await new Promise(resolve => setTimeout(resolve, 1000)); // Wait a bit
    
    // Check input states
    const inputCheck = await page.evaluate(() => {
      const email = document.querySelector('[data-testid="email"]');
      const password = document.querySelector('[data-testid="password"]');
      
      return {
        emailValue: email ? email.value : 'not found',
        passwordValue: password ? '***hidden***' : 'not found',
        emailColor: email ? window.getComputedStyle(email).color : 'unknown',
        passwordColor: password ? window.getComputedStyle(password).color : 'unknown'
      };
    });
    
    console.log('\n📊 Input State:');
    console.log('Email value:', inputCheck.emailValue);
    console.log('Password value:', inputCheck.passwordValue);
    console.log('Email text color:', inputCheck.emailColor);
    console.log('Password text color:', inputCheck.passwordColor);
    
    // Now submit the form
    console.log('\n🚀 Submitting form...');
    
    // Click submit button
    await page.click('button[type="submit"]');
    
    console.log('⏳ Waiting for response...');
    
    // Wait for navigation with a longer timeout
    try {
      await page.waitForNavigation({ 
        waitUntil: 'networkidle2',
        timeout: 10000 
      });
      console.log('✅ Navigation completed');
    } catch (e) {
      console.log('⚠️ Navigation timeout - checking current state...');
    }
    
    // Wait a bit more for any redirects
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Check final location
    const finalUrl = page.url();
    console.log('\n📍 Final URL:', finalUrl);
    
    if (finalUrl.includes('localhost:3001')) {
      console.log('🎉 SUCCESS! Logged into dashboard!');
      
      // Quick dashboard check
      const dashboardData = await page.evaluate(() => {
        return {
          title: document.title,
          url: window.location.href,
          // Check for addiction bar elements
          emcoin: document.querySelector('#v5-emcoin-balance')?.textContent || 'not found',
          streak: document.querySelector('#v5-streak-count')?.textContent || 'not found',
          today: document.querySelector('#v5-today-count')?.textContent || 'not found',
          rank: document.querySelector('#v5-rank-position')?.textContent || 'not found',
          // Check navigation
          hasActivities: !!document.querySelector('[href="/activities"]'),
          hasFriends: !!document.querySelector('[href="/friends"]'),
          hasGroups: !!document.querySelector('[href="/groups"]'),
          hasProgress: !!document.querySelector('[href="/progress"]')
        };
      });
      
      console.log('\n📊 Dashboard State:');
      console.log('Title:', dashboardData.title);
      console.log('\nAddiction Bar:');
      console.log('  EmCoin:', dashboardData.emcoin);
      console.log('  Streak:', dashboardData.streak);
      console.log('  Today:', dashboardData.today);
      console.log('  Rank:', dashboardData.rank);
      console.log('\nNavigation:');
      console.log('  Activities:', dashboardData.hasActivities ? '✅' : '❌');
      console.log('  Friends:', dashboardData.hasFriends ? '✅' : '❌');
      console.log('  Groups:', dashboardData.hasGroups ? '✅' : '❌');
      console.log('  Progress:', dashboardData.hasProgress ? '✅' : '❌');
      
      // Take screenshot
      await page.screenshot({ 
        path: 'session-153-dashboard-success.png',
        fullPage: true
      });
      console.log('\n📸 Dashboard screenshot saved: session-153-dashboard-success.png');
      
    } else {
      console.log('❌ Still on login page - checking for errors...');
      
      // Look for any error messages
      const errorInfo = await page.evaluate(() => {
        const alerts = document.querySelectorAll('[role="alert"], .text-red-500, .text-destructive, .error');
        const errors = Array.from(alerts).map(el => el.textContent.trim()).filter(t => t.length > 0);
        
        return {
          errors,
          pageText: document.body.innerText.substring(0, 500)
        };
      });
      
      if (errorInfo.errors.length > 0) {
        console.log('\n❌ Error messages found:');
        errorInfo.errors.forEach(err => console.log('  -', err));
      } else {
        console.log('\n⚠️ No visible errors but login didn\'t work');
        console.log('This might be a credential issue or server problem');
      }
      
      // Take screenshot of login state
      await page.screenshot({ 
        path: 'session-153-login-failed.png',
        fullPage: true
      });
      console.log('\n📸 Login state screenshot saved: session-153-login-failed.png');
    }
    
    console.log('\n✅ Test complete');
    console.log('Browser stays open for inspection - Press Ctrl+C to close');
    
    // Keep browser open
    await new Promise(() => {});
    
  } catch (error) {
    console.error('\n❌ Error occurred:', error.message);
    console.error('Stack:', error.stack);
    
    // Try to take error screenshot
    try {
      const page = (await browser.pages())[0];
      if (page) {
        await page.screenshot({ path: 'session-153-error.png' });
        console.log('📸 Error screenshot saved');
      }
    } catch (e) {
      console.log('Could not take error screenshot');
    }
    
    await browser.close();
  }
})();