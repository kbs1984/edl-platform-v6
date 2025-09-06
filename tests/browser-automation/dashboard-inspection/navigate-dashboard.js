/**
 * Session 151: Navigate Dashboard with Puppeteer
 * I will control the navigation after you log in
 */

const { chromium } = require('playwright');

(async () => {
  console.log('🚀 Opening browser for navigation test...\n');
  
  const browser = await chromium.launch({
    headless: false,
    slowMo: 500, // Slow so you can see what I'm doing
  });

  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 }
  });
  
  const page = await context.newPage();
  
  // Navigate to login
  console.log('📍 Going to login page...');
  await page.goto('http://localhost:3000/login');
  
  console.log('\n' + '='.repeat(60));
  console.log('Please log in manually. I will wait...');
  console.log('='.repeat(60));
  
  // Wait for manual login
  while (true) {
    await page.waitForTimeout(1000);
    const url = page.url();
    if (url.includes('localhost:3001')) {
      console.log('\n✅ Login detected! Now I will navigate...\n');
      break;
    }
  }
  
  // Give dashboard time to load
  await page.waitForTimeout(3000);
  
  console.log('='.repeat(60));
  console.log('STARTING NAVIGATION');
  console.log('='.repeat(60));
  
  // 1. Check main dashboard
  console.log('\n📍 On Dashboard page');
  await page.waitForTimeout(2000);
  const dashboardContent = await page.evaluate(() => {
    return {
      url: window.location.href,
      title: document.title,
      hasAddictionBar: !!document.querySelector('#v5-addiction-bar'),
      emCoins: document.querySelector('#v5-emcoin-balance')?.textContent || 'not found',
      streak: document.querySelector('#v5-streak-count')?.textContent || 'not found',
      buttonCount: document.querySelectorAll('button').length
    };
  });
  console.log('Dashboard info:', dashboardContent);
  
  // 2. Navigate to Friends
  console.log('\n📍 Navigating to Friends...');
  const friendsBtn = await page.$('text=Friends');
  if (friendsBtn) {
    await friendsBtn.click();
    await page.waitForTimeout(2000);
    
    const friendsContent = await page.evaluate(() => {
      return {
        url: window.location.href,
        hasAddFriendButton: !!document.querySelector('button:has-text("Add")'),
        friendElements: document.querySelectorAll('[class*="friend"]').length,
        pageText: document.body.textContent.substring(0, 200)
      };
    });
    console.log('Friends page info:', friendsContent);
  } else {
    console.log('  ❌ Friends button not found');
  }
  
  // 3. Navigate to Teams
  console.log('\n📍 Navigating to Teams & Guilds...');
  const teamsBtn = await page.$('text=Teams');
  if (teamsBtn) {
    await teamsBtn.click();
    await page.waitForTimeout(2000);
    
    const teamsContent = await page.evaluate(() => {
      return {
        url: window.location.href,
        teamElements: document.querySelectorAll('[class*="team"]').length,
        guildElements: document.querySelectorAll('[class*="guild"]').length,
        pageText: document.body.textContent.substring(0, 200)
      };
    });
    console.log('Teams page info:', teamsContent);
  } else {
    console.log('  ❌ Teams button not found');
  }
  
  // 4. Navigate to Chats
  console.log('\n📍 Navigating to Chats...');
  const chatsBtn = await page.$('text=Chats');
  if (chatsBtn) {
    await chatsBtn.click();
    await page.waitForTimeout(2000);
    
    const chatsContent = await page.evaluate(() => {
      return {
        url: window.location.href,
        chatElements: document.querySelectorAll('[class*="chat"], [class*="message"]').length,
        hasInput: !!document.querySelector('input[type="text"], textarea'),
        pageText: document.body.textContent.substring(0, 200)
      };
    });
    console.log('Chats page info:', chatsContent);
  } else {
    console.log('  ❌ Chats button not found');
  }
  
  // 5. Navigate to My Debates
  console.log('\n📍 Navigating to My Debates...');
  const debatesBtn = await page.$('text=My Debates');
  if (debatesBtn) {
    await debatesBtn.click();
    await page.waitForTimeout(2000);
    
    const debatesContent = await page.evaluate(() => {
      return {
        url: window.location.href,
        debateElements: document.querySelectorAll('[class*="debate"]').length,
        activityElements: document.querySelectorAll('[class*="activity"]').length,
        pageText: document.body.textContent.substring(0, 200)
      };
    });
    console.log('Debates page info:', debatesContent);
  } else {
    console.log('  ❌ My Debates button not found');
  }
  
  // 6. Check Calendar
  console.log('\n📍 Navigating to Calendar...');
  const calendarBtn = await page.$('text=Calendar');
  if (calendarBtn) {
    await calendarBtn.click();
    await page.waitForTimeout(2000);
    
    const calendarContent = await page.evaluate(() => {
      return {
        url: window.location.href,
        calendarElements: document.querySelectorAll('[class*="calendar"]').length,
        eventElements: document.querySelectorAll('[class*="event"]').length,
        pageText: document.body.textContent.substring(0, 200)
      };
    });
    console.log('Calendar page info:', calendarContent);
  } else {
    console.log('  ❌ Calendar button not found');
  }
  
  // 7. Check My Score
  console.log('\n📍 Navigating to My Score...');
  const scoreBtn = await page.$('text=My Score');
  if (scoreBtn) {
    await scoreBtn.click();
    await page.waitForTimeout(2000);
    
    const scoreContent = await page.evaluate(() => {
      return {
        url: window.location.href,
        scoreElements: document.querySelectorAll('[class*="score"], [class*="points"]').length,
        statsElements: document.querySelectorAll('[class*="stat"]').length,
        pageText: document.body.textContent.substring(0, 200)
      };
    });
    console.log('Score page info:', scoreContent);
  } else {
    console.log('  ❌ My Score button not found');
  }
  
  // Final summary
  console.log('\n' + '='.repeat(60));
  console.log('NAVIGATION COMPLETE');
  console.log('='.repeat(60));
  
  // Take final screenshot
  await page.screenshot({ path: 'final-navigation-state.png', fullPage: true });
  console.log('\n📸 Final screenshot saved');
  
  console.log('\nBrowser will stay open for 30 seconds...');
  await page.waitForTimeout(30000);
  
  await browser.close();
  console.log('Browser closed.');
})();