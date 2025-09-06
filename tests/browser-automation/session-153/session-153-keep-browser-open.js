const puppeteer = require('puppeteer');

(async () => {
  console.log('=== Session 153: Browser Testing with Full Visibility ===\n');
  console.log('This browser will STAY OPEN so you can see everything.\n');
  
  const browser = await puppeteer.launch({
    headless: false,  // Visible browser
    defaultViewport: null,
    args: ['--start-maximized'],
    // Don't close on disconnect
    handleSIGINT: false,
    handleSIGTERM: false,
    handleSIGHUP: false
  });

  const page = await browser.newPage();
  
  console.log('📍 Opening login page...');
  await page.goto('http://localhost:3000/login', { waitUntil: 'networkidle2' });
  
  console.log('\n⏳ PLEASE LOG IN MANUALLY');
  console.log('I will wait for you to login...\n');
  
  // Simple wait loop - check every 2 seconds
  let isLoggedIn = false;
  while (!isLoggedIn) {
    await new Promise(resolve => setTimeout(resolve, 2000));
    const currentUrl = page.url();
    
    if (currentUrl.includes('localhost:3001')) {
      isLoggedIn = true;
      console.log('✅ Great! You logged in successfully!\n');
      console.log('Now inspecting the dashboard...\n');
    }
  }
  
  // Give dashboard time to load
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  // Quick inspection
  const data = await page.evaluate(() => {
    const addiction = {
      emcoin: document.querySelector('#v5-emcoin-balance')?.textContent,
      streak: document.querySelector('#v5-streak-count')?.textContent,
      today: document.querySelector('#v5-today-count')?.textContent,
      rank: document.querySelector('#v5-rank-position')?.textContent
    };
    
    const links = [];
    document.querySelectorAll('a[href^="/"]').forEach(a => {
      const href = a.getAttribute('href');
      const text = a.textContent.trim();
      if (text && href !== '/' && !links.find(l => l.href === href)) {
        links.push({ href, text });
      }
    });
    
    return { addiction, links };
  });
  
  console.log('🎮 ADDICTION BAR:');
  console.log('  EmCoin:', data.addiction.emcoin || 'not found');
  console.log('  Streak:', data.addiction.streak || 'not found');
  console.log('  Today:', data.addiction.today || 'not found');
  console.log('  Rank:', data.addiction.rank || 'not found');
  
  console.log('\n🧭 NAVIGATION LINKS:');
  data.links.forEach(link => {
    console.log(`  ${link.href}: ${link.text}`);
  });
  
  console.log('\n' + '═'.repeat(50));
  console.log('THE BROWSER WILL STAY OPEN!');
  console.log('You can manually click around and explore.');
  console.log('I can see what you do and help test things.');
  console.log('═'.repeat(50));
  console.log('\nBrowser is ready for your exploration...');
  console.log('(This script will keep running indefinitely)\n');
  
  // Keep the script running forever
  await new Promise(() => {
    // This promise never resolves, keeping browser open
    console.log('Script is running. Press Ctrl+C twice to force close.\n');
  });
})();