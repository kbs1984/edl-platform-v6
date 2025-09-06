const puppeteer = require('puppeteer');

(async () => {
  console.log('=== Session 153: Automated Login and Dashboard Check ===');
  
  const browser = await puppeteer.launch({
    headless: false,  // VISIBLE BROWSER
    slowMo: 100
  });

  try {
    const page = await browser.newPage();
    
    // Navigate to login
    await page.goto('http://localhost:3000/login', { waitUntil: 'networkidle2' });
    console.log('✅ On login page');
    
    // Fill and submit form
    await page.type('[data-testid="email"]', 'brian.bumsik.kim+08test@gmail.com');
    await page.type('[data-testid="password"]', '16180339*emD');
    console.log('✅ Credentials entered');
    
    // Submit form
    await Promise.all([
      page.waitForNavigation({ waitUntil: 'networkidle2' }),
      page.click('button[type="submit"]')
    ]);
    
    console.log('✅ Form submitted');
    
    // Check current location
    const url = page.url();
    console.log('📍 Current URL:', url);
    
    if (url.includes('3001')) {
      console.log('✅ Successfully logged into dashboard!');
      
      // Wait for page to fully load
      await page.waitForTimeout(2000);
      
      // Check for addiction bar
      const addictionChecks = await page.evaluate(() => {
        const results = {};
        
        // Check for V5 elements
        const emcoin = document.querySelector('#v5-emcoin-balance');
        const streak = document.querySelector('#v5-streak-count');
        const today = document.querySelector('#v5-today-count');
        const rank = document.querySelector('#v5-rank-position');
        
        results.emcoin = emcoin ? emcoin.textContent : 'not found';
        results.streak = streak ? streak.textContent : 'not found';
        results.today = today ? today.textContent : 'not found';
        results.rank = rank ? rank.textContent : 'not found';
        
        // Check for navigation
        results.hasActivities = !!document.querySelector('[href="/activities"]');
        results.hasFriends = !!document.querySelector('[href="/friends"]');
        results.hasGroups = !!document.querySelector('[href="/groups"]');
        results.hasProgress = !!document.querySelector('[href="/progress"]');
        
        // Check page title
        results.pageTitle = document.title;
        
        return results;
      });
      
      console.log('\n📊 Dashboard Analysis:');
      console.log('Addiction Bar:');
      console.log('  EmCoin:', addictionChecks.emcoin);
      console.log('  Streak:', addictionChecks.streak);
      console.log('  Today:', addictionChecks.today);
      console.log('  Rank:', addictionChecks.rank);
      console.log('\nNavigation:');
      console.log('  Activities:', addictionChecks.hasActivities ? '✅' : '❌');
      console.log('  Friends:', addictionChecks.hasFriends ? '✅' : '❌');
      console.log('  Groups:', addictionChecks.hasGroups ? '✅' : '❌');
      console.log('  Progress:', addictionChecks.hasProgress ? '✅' : '❌');
      console.log('\nPage Title:', addictionChecks.pageTitle);
      
      // Take screenshot
      await page.screenshot({ 
        path: 'session-153-dashboard.png',
        fullPage: true
      });
      console.log('\n📸 Screenshot saved: session-153-dashboard.png');
      
      // Try navigating to Friends
      console.log('\n🔄 Attempting Friends navigation...');
      await page.evaluate(() => {
        const link = document.querySelector('[href="/friends"]');
        if (link) link.click();
      });
      
      await page.waitForTimeout(2000);
      const newUrl = page.url();
      
      if (newUrl.includes('/friends')) {
        console.log('✅ Navigated to Friends page');
        
        // Check Friends page content
        const friendsInfo = await page.evaluate(() => {
          return {
            title: document.title,
            hasAddFriend: !!document.querySelector('button:has-text("Add Friend")'),
            bodyText: document.body.innerText.substring(0, 100)
          };
        });
        
        console.log('Friends Page:', friendsInfo);
        
        await page.screenshot({ 
          path: 'session-153-friends.png',
          fullPage: true 
        });
        console.log('📸 Friends screenshot saved');
      } else {
        console.log('❌ Could not navigate to Friends (still at:', newUrl, ')');
      }
      
    } else {
      console.log('❌ Login failed - still on auth page');
      
      // Check for error messages
      const errors = await page.evaluate(() => {
        const alerts = document.querySelectorAll('[role="alert"], .text-red-500, .error');
        return Array.from(alerts).map(el => el.textContent.trim());
      });
      
      if (errors.length > 0) {
        console.log('Errors found:', errors);
      }
    }
    
    console.log('\n✅ Test complete!');
    await browser.close();
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    await browser.close();
  }
})();