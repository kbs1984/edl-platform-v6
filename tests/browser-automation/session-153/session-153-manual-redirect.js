const puppeteer = require('puppeteer');

console.log('=== Session 153: Manual Redirect After Login ===');
console.log('The login IS working - we just need to manually follow the redirect!\n');

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
    args: ['--start-maximized']
  });

  const page = await browser.newPage();
  
  console.log('1. Opening login page...');
  await page.goto('http://localhost:3000/login', { waitUntil: 'networkidle2' });
  
  console.log('2. Filling form (text will be gray but it works!)...');
  await page.type('[data-testid="email"]', 'brian.bumsik.kim+08test@gmail.com', { delay: 50 });
  await page.type('[data-testid="password"]', '16180339*emD', { delay: 50 });
  
  console.log('3. Submitting form...');
  await page.click('button[type="submit"]');
  
  console.log('4. Waiting for backend to process...');
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  console.log('5. Manually navigating to dashboard since redirect isn\'t followed...');
  await page.goto('http://localhost:3001', { waitUntil: 'networkidle2' });
  
  console.log('6. Waiting for dashboard to load...');
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  const url = page.url();
  console.log('\n📍 Current URL:', url);
  
  // Now inspect the dashboard
  console.log('\n📊 Dashboard Inspection:\n');
  
  const dashboardAnalysis = await page.evaluate(() => {
    const results = {
      title: document.title,
      url: window.location.href,
      addiction: {},
      navigation: [],
      v5: typeof window.v5 !== 'undefined',
      pageContent: document.body.innerText.substring(0, 500)
    };
    
    // Check addiction bar
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
    
    // Check navigation links
    const navLinks = document.querySelectorAll('a[href^="/"]');
    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      const text = link.textContent.trim();
      if (text && href !== '/' && !href.includes('logout')) {
        results.navigation.push({ href, text });
      }
    });
    
    // Check for any visible components
    results.hasHeader = !!document.querySelector('header, nav, [role="navigation"]');
    results.hasSidebar = !!document.querySelector('aside, [role="complementary"], .sidebar');
    results.hasMainContent = !!document.querySelector('main, [role="main"], .main-content');
    
    return results;
  });
  
  console.log('Page Title:', dashboardAnalysis.title);
  console.log('Page URL:', dashboardAnalysis.url);
  console.log('');
  
  console.log('🎮 Addiction Mechanics:');
  Object.entries(dashboardAnalysis.addiction).forEach(([key, value]) => {
    const icon = value !== 'NOT FOUND' ? '✅' : '❌';
    console.log(`  ${icon} ${key}: ${value}`);
  });
  
  console.log('\n🧭 Navigation Links Found:');
  if (dashboardAnalysis.navigation.length > 0) {
    dashboardAnalysis.navigation.forEach(nav => {
      console.log(`  • ${nav.href}: ${nav.text}`);
    });
  } else {
    console.log('  ❌ No navigation links found');
  }
  
  console.log('\n📦 Page Structure:');
  console.log('  Header/Nav:', dashboardAnalysis.hasHeader ? '✅ Found' : '❌ Not found');
  console.log('  Sidebar:', dashboardAnalysis.hasSidebar ? '✅ Found' : '❌ Not found');
  console.log('  Main Content:', dashboardAnalysis.hasMainContent ? '✅ Found' : '❌ Not found');
  console.log('  V5 Integration:', dashboardAnalysis.v5 ? '✅ Found' : '❌ Not found');
  
  console.log('\n📄 Page Content Preview:');
  console.log(dashboardAnalysis.pageContent);
  
  // Take screenshot
  await page.screenshot({ 
    path: 'session-153-dashboard-actual.png',
    fullPage: true
  });
  console.log('\n📸 Screenshot saved: session-153-dashboard-actual.png');
  
  // Try navigating to different pages
  console.log('\n🔄 Testing Navigation:');
  
  const pagesToTest = ['/friends', '/activities', '/groups', '/progress'];
  
  for (const testPage of pagesToTest) {
    console.log(`\nTrying to navigate to ${testPage}...`);
    
    const navLink = await page.$(`a[href="${testPage}"]`);
    if (navLink) {
      await navLink.click();
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const newUrl = page.url();
      if (newUrl.includes(testPage)) {
        console.log(`  ✅ Successfully navigated to ${testPage}`);
        
        // Check page content
        const pageInfo = await page.evaluate(() => {
          return {
            title: document.title,
            bodyText: document.body.innerText.substring(0, 200)
          };
        });
        
        console.log(`  Title: ${pageInfo.title}`);
        console.log(`  Content: ${pageInfo.bodyText.substring(0, 100)}...`);
        
        // Screenshot this page
        await page.screenshot({ 
          path: `session-153-${testPage.substring(1)}.png`,
          fullPage: true
        });
        console.log(`  📸 Screenshot saved: session-153-${testPage.substring(1)}.png`);
        
        // Go back to dashboard for next test
        await page.goto('http://localhost:3001', { waitUntil: 'networkidle2' });
      } else {
        console.log(`  ❌ Could not navigate to ${testPage}`);
      }
    } else {
      console.log(`  ❌ Link to ${testPage} not found`);
    }
  }
  
  console.log('\n✅ Inspection complete!');
  console.log('Browser stays open for manual exploration.');
  console.log('Press Ctrl+C to close.');
  
  await new Promise(() => {});
  
})();