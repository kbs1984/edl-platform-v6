const puppeteer = require('puppeteer');

console.log('=== Session 153: Dashboard Inspection (After Manual Login) ===');
console.log('Please manually log in first, then press Enter to continue...');
console.log('');
console.log('Steps:');
console.log('1. Open browser to http://localhost:3000/login');
console.log('2. Enter email: brian.bumsik.kim+08test@gmail.com');
console.log('3. Enter password: 16180339*emD');
console.log('4. Click Login');
console.log('5. Wait for redirect to dashboard');
console.log('6. Press Enter here to start inspection');
console.log('');

// Wait for user to press Enter
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('Press Enter when you are logged in and see the dashboard...', async () => {
  rl.close();
  
  console.log('\nStarting inspection of logged-in dashboard...\n');
  
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
    args: ['--start-maximized']
  });

  const page = await browser.newPage();
  
  // Navigate directly to dashboard (assuming user is already logged in)
  console.log('📍 Navigating to dashboard...');
  await page.goto('http://localhost:3001', { waitUntil: 'networkidle2' });
  
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  const url = page.url();
  console.log('Current URL:', url);
  
  // Comprehensive dashboard inspection
  console.log('\n════════════════════════════════════════════');
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
    results.basic.isLoggedIn = !window.location.href.includes('/login');
    
    // Addiction Mechanics Bar
    const addictionElements = [
      { id: '#v5-emcoin-balance', name: 'EmCoin Balance', icon: '🪙' },
      { id: '#v5-streak-count', name: 'Streak Count', icon: '🔥' },
      { id: '#v5-today-count', name: 'Today Count', icon: '📊' },
      { id: '#v5-rank-position', name: 'Rank Position', icon: '🏆' }
    ];
    
    for (const elem of addictionElements) {
      const el = document.querySelector(elem.id);
      if (el) {
        results.addiction[elem.name] = {
          value: el.textContent,
          exists: true,
          icon: elem.icon
        };
      } else {
        results.addiction[elem.name] = {
          value: 'NOT FOUND',
          exists: false,
          icon: elem.icon
        };
      }
    }
    
    // Navigation links
    const navLinks = document.querySelectorAll('a[href^="/"]');
    const seenHrefs = new Set();
    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      const text = link.textContent.trim();
      if (text && href !== '/' && !href.includes('logout') && !seenHrefs.has(href)) {
        seenHrefs.add(href);
        results.navigation.push({ 
          href, 
          text,
          clickable: !link.disabled && link.offsetParent !== null
        });
      }
    });
    
    // Check for specific features
    results.features.hasHeader = !!document.querySelector('header, nav, [role="navigation"]');
    results.features.hasSidebar = !!document.querySelector('aside, [class*="sidebar"], [role="complementary"]');
    results.features.hasMainContent = !!document.querySelector('main, [role="main"], [class*="main"]');
    results.features.hasProfileSection = !!document.querySelector('[class*="profile"], [class*="user"], [class*="avatar"]');
    results.features.hasFriendsList = !!document.querySelector('[class*="friend"], [class*="social"]');
    results.features.hasActivityFeed = !!document.querySelector('[class*="activity"], [class*="feed"], [class*="timeline"]');
    results.features.hasV5Integration = typeof window.v5 !== 'undefined';
    
    // Get visible text content
    results.content.mainText = document.body.innerText.substring(0, 1000);
    results.content.hasWelcomeMessage = document.body.innerText.includes('Welcome') || document.body.innerText.includes('Hello');
    results.content.userName = document.querySelector('[class*="user"], [class*="name"], h1, h2')?.textContent || 'Not visible';
    
    // Check for any buttons
    const buttons = document.querySelectorAll('button:not([type="submit"])');
    results.features.buttonCount = buttons.length;
    results.features.buttons = Array.from(buttons).slice(0, 5).map(btn => btn.textContent.trim()).filter(t => t);
    
    return results;
  });
  
  // Display results
  console.log('📋 BASIC INFO');
  console.log('═════════════');
  console.log('Title:', analysis.basic.title);
  console.log('URL:', analysis.basic.url);
  console.log('Logged In:', analysis.basic.isLoggedIn ? '✅ Yes' : '❌ No');
  
  console.log('\n🎮 ADDICTION MECHANICS BAR');
  console.log('══════════════════════════');
  Object.entries(analysis.addiction).forEach(([key, data]) => {
    const status = data.exists ? '✅' : '❌';
    console.log(`${status} ${data.icon} ${key}: ${data.value}`);
  });
  
  console.log('\n🧭 NAVIGATION LINKS');
  console.log('═══════════════════');
  if (analysis.navigation.length > 0) {
    analysis.navigation.forEach(nav => {
      const clickable = nav.clickable ? '✓' : '✗';
      console.log(`  ${clickable} ${nav.href} → "${nav.text}"`);
    });
  } else {
    console.log('  ❌ No navigation links found');
  }
  
  console.log('\n🔧 FEATURES DETECTED');
  console.log('═══════════════════');
  console.log('Header/Nav:', analysis.features.hasHeader ? '✅ Found' : '❌ Missing');
  console.log('Sidebar:', analysis.features.hasSidebar ? '✅ Found' : '❌ Missing');
  console.log('Main Content:', analysis.features.hasMainContent ? '✅ Found' : '❌ Missing');
  console.log('Profile Section:', analysis.features.hasProfileSection ? '✅ Found' : '❌ Missing');
  console.log('Friends List:', analysis.features.hasFriendsList ? '✅ Found' : '❌ Missing');
  console.log('Activity Feed:', analysis.features.hasActivityFeed ? '✅ Found' : '❌ Missing');
  console.log('V5 Integration:', analysis.features.hasV5Integration ? '✅ Active' : '❌ Not found');
  console.log('Interactive Buttons:', analysis.features.buttonCount);
  if (analysis.features.buttons.length > 0) {
    console.log('  Button samples:', analysis.features.buttons.join(', '));
  }
  
  console.log('\n📄 CONTENT PREVIEW');
  console.log('═════════════════');
  console.log('Has Welcome:', analysis.content.hasWelcomeMessage ? '✅ Yes' : '❌ No');
  console.log('User Display:', analysis.content.userName);
  console.log('\nPage Text (first 500 chars):');
  console.log('---');
  console.log(analysis.content.mainText.substring(0, 500));
  console.log('---');
  
  // Take comprehensive screenshots
  console.log('\n📸 TAKING SCREENSHOTS');
  console.log('═══════════════════');
  
  await page.screenshot({ 
    path: 'session-153-dashboard-full.png',
    fullPage: true
  });
  console.log('✓ Full dashboard: session-153-dashboard-full.png');
  
  // Try to navigate to each section
  console.log('\n🔄 TESTING NAVIGATION');
  console.log('═══════════════════');
  
  const pagesToTest = [
    { path: '/friends', name: 'Friends' },
    { path: '/activities', name: 'Activities' },
    { path: '/groups', name: 'Groups' },
    { path: '/progress', name: 'Progress' }
  ];
  
  for (const testPage of pagesToTest) {
    const link = await page.$(`a[href="${testPage.path}"]`);
    if (link) {
      console.log(`\nTesting ${testPage.name}...`);
      await link.click();
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const newUrl = page.url();
      if (newUrl.includes(testPage.path)) {
        console.log(`  ✅ Navigated to ${testPage.name}`);
        
        const pageContent = await page.evaluate(() => ({
          title: document.title,
          hasContent: document.body.innerText.length > 100,
          preview: document.body.innerText.substring(0, 200)
        }));
        
        console.log(`  Title: ${pageContent.title}`);
        console.log(`  Has content: ${pageContent.hasContent ? 'Yes' : 'No'}`);
        
        await page.screenshot({ 
          path: `session-153-${testPage.name.toLowerCase()}.png`
        });
        console.log(`  📸 Screenshot: session-153-${testPage.name.toLowerCase()}.png`);
        
        // Go back to dashboard
        await page.goto('http://localhost:3001');
        await new Promise(resolve => setTimeout(resolve, 1000));
      } else {
        console.log(`  ❌ Could not navigate to ${testPage.name}`);
      }
    } else {
      console.log(`\n❌ ${testPage.name} link not found`);
    }
  }
  
  console.log('\n════════════════════════════════════════════');
  console.log('          INSPECTION COMPLETE!              ');
  console.log('════════════════════════════════════════════\n');
  
  console.log('Browser remains open for manual exploration.');
  console.log('Press Ctrl+C to close.\n');
  
  await new Promise(() => {});
});