const puppeteer = require('puppeteer');

(async () => {
  console.log('=== Session 153: Simple Fill Test ===');
  
  const browser = await puppeteer.launch({
    headless: false,
    slowMo: 100,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();
    
    // Navigate to login
    await page.goto('http://localhost:3000/login', { waitUntil: 'networkidle2' });
    console.log('✅ On login page');
    
    // Try different input methods
    console.log('\n🔧 Method: Direct value setting with input event...');
    
    // Set email value directly and trigger input event
    await page.evaluate(() => {
      const emailInput = document.querySelector('[data-testid="email"]');
      if (emailInput) {
        emailInput.focus();
        emailInput.value = 'brian.bumsik.kim+08test@gmail.com';
        emailInput.dispatchEvent(new Event('input', { bubbles: true }));
        emailInput.dispatchEvent(new Event('change', { bubbles: true }));
      }
    });
    console.log('✅ Email set');
    
    // Set password value directly and trigger input event
    await page.evaluate(() => {
      const passwordInput = document.querySelector('[data-testid="password"]');
      if (passwordInput) {
        passwordInput.focus();
        passwordInput.value = '16180339*emD';
        passwordInput.dispatchEvent(new Event('input', { bubbles: true }));
        passwordInput.dispatchEvent(new Event('change', { bubbles: true }));
      }
    });
    console.log('✅ Password set');
    
    // Check the values and styles
    const inputState = await page.evaluate(() => {
      const email = document.querySelector('[data-testid="email"]');
      const password = document.querySelector('[data-testid="password"]');
      
      return {
        emailValue: email ? email.value : 'not found',
        passwordLength: password ? password.value.length : 0,
        emailStyle: email ? window.getComputedStyle(email).color : 'unknown',
        passwordStyle: password ? window.getComputedStyle(password).color : 'unknown'
      };
    });
    
    console.log('\n📊 Input State:');
    console.log('Email:', inputState.emailValue);
    console.log('Password length:', inputState.passwordLength);
    console.log('Email color:', inputState.emailStyle);
    console.log('Password color:', inputState.passwordStyle);
    
    // Submit the form
    console.log('\n🚀 Submitting form...');
    await page.click('button[type="submit"]');
    
    // Wait a bit for response
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    // Check result
    const currentUrl = page.url();
    console.log('\n📍 Current URL:', currentUrl);
    
    if (currentUrl.includes('localhost:3001')) {
      console.log('✅ SUCCESS! Logged in to dashboard!');
      
      // Analyze dashboard
      const analysis = await page.evaluate(() => {
        const results = {
          title: document.title,
          url: window.location.href,
          addiction: {},
          navigation: [],
          v5exists: typeof window.v5 !== 'undefined'
        };
        
        // Check addiction elements
        const addictionElements = [
          { id: '#v5-emcoin-balance', name: 'EmCoin' },
          { id: '#v5-streak-count', name: 'Streak' },
          { id: '#v5-today-count', name: 'Today' },
          { id: '#v5-rank-position', name: 'Rank' }
        ];
        
        for (const elem of addictionElements) {
          const el = document.querySelector(elem.id);
          results.addiction[elem.name] = el ? el.textContent : 'not found';
        }
        
        // Check navigation
        const navLinks = document.querySelectorAll('a[href^="/"]');
        navLinks.forEach(link => {
          results.navigation.push({
            href: link.getAttribute('href'),
            text: link.textContent.trim()
          });
        });
        
        return results;
      });
      
      console.log('\n📊 Dashboard Analysis:');
      console.log('Title:', analysis.title);
      console.log('\nAddiction Bar:');
      Object.entries(analysis.addiction).forEach(([key, value]) => {
        console.log(`  ${key}: ${value}`);
      });
      console.log('\nNavigation Links:');
      analysis.navigation.forEach(link => {
        if (link.text) console.log(`  ${link.href}: ${link.text}`);
      });
      console.log('\nV5 Integration:', analysis.v5exists ? '✅ Found' : '❌ Not found');
      
      // Take screenshot
      await page.screenshot({ 
        path: 'session-153-dashboard-final.png',
        fullPage: true
      });
      console.log('\n📸 Dashboard screenshot saved');
      
    } else {
      console.log('❌ Login did not succeed');
      
      // Check for errors
      const pageContent = await page.evaluate(() => document.body.innerText);
      console.log('\nPage content preview:');
      console.log(pageContent.substring(0, 300));
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