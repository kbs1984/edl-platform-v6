const puppeteer = require('puppeteer');

(async () => {
  console.log('=== Session 153: Using Session 152 Correct Approach ===');
  
  const browser = await puppeteer.launch({
    headless: false,
    slowMo: 100,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();
    
    // Navigate and wait for full hydration (critical for Next.js)
    console.log('📍 Navigating to login page...');
    await page.goto('http://localhost:3000/login', { 
      waitUntil: 'networkidle2'  // Critical for Next.js Server Components
    });
    console.log('✅ Page loaded and hydrated');
    
    // Wait for the form to be ready
    await page.waitForSelector('[data-testid="email"]', { timeout: 5000 });
    console.log('✅ Form is ready');
    
    // Use the type method that Session 152 found works
    // This is different from keyboard.type() - it's page.type()
    console.log('\n📝 Filling form...');
    
    // Type directly into the selectors (this should show white text)
    await page.type('[data-testid="email"]', 'brian.bumsik.kim+08test@gmail.com', { delay: 50 });
    console.log('✅ Email entered');
    
    await page.type('[data-testid="password"]', '16180339*emD', { delay: 50 });
    console.log('✅ Password entered');
    
    // Check the input state
    const inputState = await page.evaluate(() => {
      const email = document.querySelector('[data-testid="email"]');
      const password = document.querySelector('[data-testid="password"]');
      
      return {
        emailValue: email ? email.value : 'not found',
        emailColor: email ? window.getComputedStyle(email).color : 'unknown',
        passwordFilled: password ? password.value.length > 0 : false,
        passwordColor: password ? window.getComputedStyle(password).color : 'unknown'
      };
    });
    
    console.log('\n📊 Input State:');
    console.log('Email:', inputState.emailValue);
    console.log('Email color:', inputState.emailColor);
    console.log('Password filled:', inputState.passwordFilled);
    console.log('Password color:', inputState.passwordColor);
    
    // Submit the form
    console.log('\n🚀 Submitting form...');
    
    // Use Promise.all to click and wait for navigation
    await Promise.all([
      page.waitForNavigation({ waitUntil: 'networkidle2' }),
      page.click('button[type="submit"]')
    ]).catch(async () => {
      // If navigation doesn't happen, check for errors
      console.log('⚠️ No navigation occurred, checking for errors...');
      await new Promise(resolve => setTimeout(resolve, 2000));
    });
    
    // Check final state
    const currentUrl = page.url();
    console.log('\n📍 Current URL:', currentUrl);
    
    if (currentUrl.includes('localhost:3001')) {
      console.log('🎉 SUCCESS! Logged into dashboard!');
      
      // Wait for dashboard to fully load
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Analyze dashboard
      const dashboard = await page.evaluate(() => {
        const data = {
          title: document.title,
          url: window.location.href,
          addiction: {},
          navigation: [],
          v5: typeof window.v5 !== 'undefined'
        };
        
        // Check addiction bar
        data.addiction.emcoin = document.querySelector('#v5-emcoin-balance')?.textContent || 'not found';
        data.addiction.streak = document.querySelector('#v5-streak-count')?.textContent || 'not found';
        data.addiction.today = document.querySelector('#v5-today-count')?.textContent || 'not found';
        data.addiction.rank = document.querySelector('#v5-rank-position')?.textContent || 'not found';
        
        // Check navigation links
        const links = document.querySelectorAll('a[href^="/"]');
        links.forEach(link => {
          const href = link.getAttribute('href');
          const text = link.textContent.trim();
          if (text && href !== '/') {
            data.navigation.push({ href, text });
          }
        });
        
        return data;
      });
      
      console.log('\n📊 Dashboard Analysis:');
      console.log('Title:', dashboard.title);
      console.log('\nAddiction Bar:');
      console.log('  EmCoin:', dashboard.addiction.emcoin);
      console.log('  Streak:', dashboard.addiction.streak);
      console.log('  Today:', dashboard.addiction.today);
      console.log('  Rank:', dashboard.addiction.rank);
      console.log('\nNavigation Available:');
      dashboard.navigation.forEach(nav => {
        console.log(`  ${nav.href}: ${nav.text}`);
      });
      console.log('\nV5 Integration:', dashboard.v5 ? '✅ Found' : '❌ Not found');
      
      // Take screenshot
      await page.screenshot({ 
        path: 'session-153-dashboard.png',
        fullPage: true
      });
      console.log('\n📸 Screenshot saved: session-153-dashboard.png');
      
      // Try navigating to Friends
      console.log('\n🔄 Testing navigation to Friends...');
      const friendsLink = await page.$('[href="/friends"]');
      if (friendsLink) {
        await friendsLink.click();
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        const newUrl = page.url();
        if (newUrl.includes('/friends')) {
          console.log('✅ Successfully navigated to Friends');
          await page.screenshot({ 
            path: 'session-153-friends.png',
            fullPage: true
          });
          console.log('📸 Friends screenshot saved');
        } else {
          console.log('❌ Could not navigate to Friends');
        }
      }
      
    } else {
      console.log('❌ Login failed - still on auth page');
      
      // Check for error messages
      const errors = await page.evaluate(() => {
        const alerts = document.querySelectorAll('[role="alert"], .text-red-500, .text-destructive');
        return Array.from(alerts).map(el => el.textContent.trim()).filter(t => t.length > 0);
      });
      
      if (errors.length > 0) {
        console.log('\nError messages:');
        errors.forEach(err => console.log('  -', err));
      } else {
        console.log('\nNo visible errors - possible credential issue');
      }
      
      await page.screenshot({ 
        path: 'session-153-login-failed.png'
      });
      console.log('📸 Login screenshot saved');
    }
    
    console.log('\n✅ Test complete - browser stays open');
    console.log('Press Ctrl+C to close');
    
    // Keep open
    await new Promise(() => {});
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    await browser.close();
  }
})();