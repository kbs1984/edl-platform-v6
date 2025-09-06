const puppeteer = require('puppeteer');

(async () => {
  console.log('=== Session 153: Opening Browser for Manual Login ===\n');
  
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
    args: ['--start-maximized']
  });

  const page = await browser.newPage();
  
  console.log('📍 Opening login page...');
  await page.goto('http://localhost:3000/login', { waitUntil: 'networkidle2' });
  
  console.log('\n⏳ PLEASE MANUALLY LOG IN NOW');
  console.log('================================');
  console.log('1. Enter email: brian.bumsik.kim+08test@gmail.com');
  console.log('2. Enter password: 16180339*emD');
  console.log('3. Click Login button');
  console.log('4. Wait for dashboard to appear');
  console.log('\nI will detect when you reach the dashboard...\n');
  
  // Wait for successful login by checking URL change to port 3001
  let isLoggedIn = false;
  let attempts = 0;
  
  while (!isLoggedIn && attempts < 60) { // Wait up to 60 seconds
    await new Promise(resolve => setTimeout(resolve, 1000));
    const currentUrl = page.url();
    
    if (currentUrl.includes('localhost:3001')) {
      isLoggedIn = true;
      console.log('✅ Dashboard detected! Starting inspection...\n');
    } else {
      attempts++;
      if (attempts % 5 === 0) {
        console.log(`Still waiting for login... (${attempts}s)`);
      }
    }
  }
  
  if (!isLoggedIn) {
    console.log('❌ Timeout waiting for login');
    await browser.close();
    return;
  }
  
  // Wait a bit for dashboard to fully load
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  console.log('════════════════════════════════════════════');
  console.log('         DASHBOARD INSPECTION RESULTS        ');
  console.log('════════════════════════════════════════════\n');
  
  const analysis = await page.evaluate(() => {
    const results = {
      basic: {},
      addiction: {},
      navigation: [],
      features: {},
      content: {}
    };
    
    // Basic info
    results.basic.title = document.title;
    results.basic.url = window.location.href;
    
    // Addiction Mechanics Bar
    const addictionElements = [
      { id: '#v5-emcoin-balance', name: 'EmCoin Balance' },
      { id: '#v5-streak-count', name: 'Streak Count' },
      { id: '#v5-today-count', name: 'Today Count' },
      { id: '#v5-rank-position', name: 'Rank Position' }
    ];
    
    for (const elem of addictionElements) {
      const el = document.querySelector(elem.id);
      results.addiction[elem.name] = el ? el.textContent : 'NOT FOUND';
    }
    
    // Navigation links
    const navLinks = document.querySelectorAll('a[href^="/"]');
    const seenHrefs = new Set();
    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      const text = link.textContent.trim();
      if (text && href !== '/' && !href.includes('logout') && !seenHrefs.has(href)) {
        seenHrefs.add(href);
        results.navigation.push({ href, text });
      }
    });
    
    // Check features
    results.features.hasV5 = typeof window.v5 !== 'undefined';
    results.features.hasSidebar = !!document.querySelector('aside, [class*="sidebar"]');
    results.features.buttonCount = document.querySelectorAll('button').length;
    
    // Get page content
    results.content.mainText = document.body.innerText.substring(0, 500);
    
    return results;
  });
  
  console.log('📋 BASIC INFO');
  console.log('Title:', analysis.basic.title);
  console.log('URL:', analysis.basic.url);
  
  console.log('\n🎮 ADDICTION MECHANICS:');
  Object.entries(analysis.addiction).forEach(([key, value]) => {
    const status = value !== 'NOT FOUND' ? '✅' : '❌';
    console.log(`  ${status} ${key}: ${value}`);
  });
  
  console.log('\n🧭 NAVIGATION:');
  if (analysis.navigation.length > 0) {
    analysis.navigation.forEach(nav => {
      console.log(`  • ${nav.href}: ${nav.text}`);
    });
  } else {
    console.log('  No navigation links found');
  }
  
  console.log('\n🔧 FEATURES:');
  console.log('  V5 Integration:', analysis.features.hasV5 ? '✅ Yes' : '❌ No');
  console.log('  Sidebar:', analysis.features.hasSidebar ? '✅ Yes' : '❌ No');
  console.log('  Button Count:', analysis.features.buttonCount);
  
  console.log('\n📄 PAGE CONTENT:');
  console.log(analysis.content.mainText);
  
  // Take screenshot
  await page.screenshot({ 
    path: 'session-153-manual-login-dashboard.png',
    fullPage: true
  });
  console.log('\n📸 Screenshot saved: session-153-manual-login-dashboard.png');
  
  // Test navigation
  console.log('\n🔄 TESTING NAVIGATION...');
  
  for (const link of ['/friends', '/activities', '/groups', '/progress']) {
    const navElement = await page.$(`a[href="${link}"]`);
    if (navElement) {
      console.log(`\nClicking ${link}...`);
      await navElement.click();
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const newUrl = page.url();
      if (newUrl.includes(link)) {
        console.log(`  ✅ Navigated to ${link}`);
        await page.screenshot({ 
          path: `session-153-${link.substring(1)}.png`
        });
        
        // Go back to dashboard
        await page.goBack();
        await new Promise(resolve => setTimeout(resolve, 1000));
      } else {
        console.log(`  ❌ Navigation failed`);
      }
    } else {
      console.log(`\n❌ Link ${link} not found`);
    }
  }
  
  console.log('\n✅ Inspection complete!');
  console.log('Browser stays open for you to explore.');
  console.log('Press Ctrl+C to close.\n');
  
  await new Promise(() => {});
})();