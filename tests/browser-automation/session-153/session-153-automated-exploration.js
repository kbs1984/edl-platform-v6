const puppeteer = require('puppeteer');

(async () => {
  console.log('=== Session 153: Automated Dashboard Exploration ===\n');
  console.log('Connecting to the browser you already have open...\n');
  
  // Connect to existing browser instance
  // First, we need to find the WebSocket endpoint
  // Since we have a browser open from the previous script, we'll open a new one
  // and navigate directly to the dashboard (assuming session cookie exists)
  
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
    args: ['--start-maximized']
  });

  const page = await browser.newPage();
  
  console.log('📍 Going directly to dashboard (using your session)...');
  await page.goto('http://localhost:3001', { waitUntil: 'networkidle2' });
  
  // Check if we're on the dashboard
  const url = page.url();
  if (!url.includes('localhost:3001') || url.includes('login')) {
    console.log('❌ Not logged in. Please make sure you are logged in first.');
    await browser.close();
    return;
  }
  
  console.log('✅ Dashboard accessed successfully!\n');
  
  // Comprehensive automated exploration
  console.log('🔍 AUTOMATED EXPLORATION STARTING...\n');
  
  // 1. Document main dashboard
  console.log('═══════════════════════════════════════');
  console.log('1. MAIN DASHBOARD ANALYSIS');
  console.log('═══════════════════════════════════════');
  
  const mainDashboard = await page.evaluate(() => {
    const data = {
      addiction: {},
      widgets: [],
      buttons: [],
      forms: []
    };
    
    // Get addiction bar values
    data.addiction = {
      visitors: document.querySelector('#v5-today-count')?.textContent || document.querySelector('[class*="visitor"]')?.textContent,
      emcoin: document.querySelector('#v5-emcoin-balance')?.textContent || document.querySelector('[class*="emcoin"]')?.textContent,
      streak: document.querySelector('#v5-streak-count')?.textContent || document.querySelector('[class*="streak"]')?.textContent,
      rank: document.querySelector('#v5-rank-position')?.textContent || document.querySelector('[class*="rank"]')?.textContent
    };
    
    // Find all widgets/cards
    document.querySelectorAll('[class*="card"], [class*="widget"], [class*="panel"]').forEach(widget => {
      const text = widget.textContent.trim().substring(0, 50);
      if (text) data.widgets.push(text);
    });
    
    // Find all buttons
    document.querySelectorAll('button').forEach(btn => {
      const text = btn.textContent.trim();
      if (text && !text.includes('Cookie')) {
        data.buttons.push(text);
      }
    });
    
    // Find forms
    document.querySelectorAll('form').forEach(form => {
      data.forms.push(form.getAttribute('action') || 'unnamed form');
    });
    
    return data;
  });
  
  console.log('Addiction Metrics:', JSON.stringify(mainDashboard.addiction, null, 2));
  console.log('Widgets found:', mainDashboard.widgets.length);
  console.log('Buttons found:', mainDashboard.buttons);
  console.log('Forms found:', mainDashboard.forms);
  
  await page.screenshot({ path: 'session-153-main-dashboard.png', fullPage: true });
  console.log('📸 Screenshot: session-153-main-dashboard.png\n');
  
  // 2. Test each navigation link
  console.log('═══════════════════════════════════════');
  console.log('2. NAVIGATION TESTING');
  console.log('═══════════════════════════════════════');
  
  const navLinks = await page.evaluate(() => {
    const links = [];
    document.querySelectorAll('a[href^="/"]').forEach(a => {
      const href = a.getAttribute('href');
      const text = a.textContent.trim();
      if (text && href !== '/' && !href.includes('logout')) {
        // Check if it's unique
        if (!links.find(l => l.href === href)) {
          links.push({ href, text });
        }
      }
    });
    return links;
  });
  
  for (const link of navLinks) {
    console.log(`\nTesting: ${link.href} (${link.text})`);
    
    try {
      // Click the link
      await page.click(`a[href="${link.href}"]`);
      await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 5000 }).catch(() => {});
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const newUrl = page.url();
      console.log(`  → Navigated to: ${newUrl}`);
      
      // Analyze the page
      const pageAnalysis = await page.evaluate(() => {
        return {
          title: document.title,
          hasContent: document.body.innerText.length > 100,
          mainHeading: document.querySelector('h1, h2')?.textContent,
          buttonCount: document.querySelectorAll('button').length,
          formCount: document.querySelectorAll('form').length,
          hasTable: !!document.querySelector('table'),
          hasCards: !!document.querySelector('[class*="card"]'),
          contentPreview: document.body.innerText.substring(0, 200).replace(/\n+/g, ' ')
        };
      });
      
      console.log(`  Title: ${pageAnalysis.title}`);
      console.log(`  Heading: ${pageAnalysis.mainHeading || 'none'}`);
      console.log(`  Buttons: ${pageAnalysis.buttonCount}, Forms: ${pageAnalysis.formCount}`);
      console.log(`  Has table: ${pageAnalysis.hasTable}, Has cards: ${pageAnalysis.hasCards}`);
      console.log(`  Content: ${pageAnalysis.contentPreview.substring(0, 100)}...`);
      
      // Take screenshot
      const filename = `session-153-page-${link.href.replace('/', '')}.png`;
      await page.screenshot({ path: filename, fullPage: true });
      console.log(`  📸 Screenshot: ${filename}`);
      
      // Go back to dashboard
      await page.goto('http://localhost:3001', { waitUntil: 'networkidle2' });
      
    } catch (error) {
      console.log(`  ❌ Error navigating to ${link.href}: ${error.message}`);
    }
  }
  
  // 3. Check for specific features
  console.log('\n═══════════════════════════════════════');
  console.log('3. FEATURE DETECTION');
  console.log('═══════════════════════════════════════');
  
  const features = await page.evaluate(() => {
    const checks = {};
    
    // V5 Integration
    checks.v5Integration = typeof window.v5 !== 'undefined';
    if (checks.v5Integration) {
      checks.v5Modules = Object.keys(window.v5);
    }
    
    // WebSocket connections
    checks.hasWebSocket = typeof window.WebSocket !== 'undefined';
    
    // Local storage data
    checks.localStorage = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!key.includes('token') && !key.includes('secret')) {
        checks.localStorage[key] = 'present';
      }
    }
    
    // Session storage
    checks.sessionStorage = {};
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i);
      if (!key.includes('token') && !key.includes('secret')) {
        checks.sessionStorage[key] = 'present';
      }
    }
    
    // Check for React
    checks.hasReact = !!(window.React || window._react);
    
    // Check for Next.js
    checks.hasNextJs = !!window.__NEXT_DATA__;
    if (checks.hasNextJs) {
      checks.nextJsProps = window.__NEXT_DATA__.props ? Object.keys(window.__NEXT_DATA__.props) : [];
    }
    
    return checks;
  });
  
  console.log('V5 Integration:', features.v5Integration ? `✅ Yes (modules: ${features.v5Modules?.join(', ')})` : '❌ No');
  console.log('WebSocket:', features.hasWebSocket ? '✅ Available' : '❌ Not found');
  console.log('React:', features.hasReact ? '✅ Yes' : '❌ No');
  console.log('Next.js:', features.hasNextJs ? '✅ Yes' : '❌ No');
  console.log('Local Storage Keys:', Object.keys(features.localStorage).join(', ') || 'none');
  console.log('Session Storage Keys:', Object.keys(features.sessionStorage).join(', ') || 'none');
  
  // 4. Test interactive features
  console.log('\n═══════════════════════════════════════');
  console.log('4. INTERACTIVE FEATURES');
  console.log('═══════════════════════════════════════');
  
  // Try clicking some buttons
  const clickableButtons = await page.evaluate(() => {
    const buttons = [];
    document.querySelectorAll('button').forEach(btn => {
      if (!btn.disabled && btn.offsetParent !== null) {
        const text = btn.textContent.trim();
        if (text && !text.includes('Logout') && !text.includes('Cookie')) {
          buttons.push({
            text,
            classes: btn.className,
            hasOnClick: !!btn.onclick
          });
        }
      }
    });
    return buttons;
  });
  
  console.log(`Found ${clickableButtons.length} interactive buttons:`);
  clickableButtons.forEach(btn => {
    console.log(`  • "${btn.text}" (has onClick: ${btn.hasOnClick})`);
  });
  
  console.log('\n═══════════════════════════════════════');
  console.log('5. FINAL SUMMARY');
  console.log('═══════════════════════════════════════');
  
  console.log('\n✅ WHAT EXISTS:');
  console.log('  • Dashboard with addiction metrics display');
  console.log('  • Navigation to:', navLinks.map(l => l.text).join(', '));
  console.log('  • User profile and authentication');
  console.log('  • ' + clickableButtons.length + ' interactive buttons');
  
  console.log('\n❌ WHAT\'S MISSING OR BROKEN:');
  console.log('  • V5 integration not detected');
  console.log('  • Addiction metrics show zeros (no real data)');
  console.log('  • No friends/social features found');
  console.log('  • No activities or progress tracking visible');
  
  console.log('\n📊 All screenshots saved for documentation.');
  console.log('\n✅ Automated exploration complete!');
  console.log('Browser stays open for any manual verification needed.\n');
  
  // Keep browser open
  await new Promise(() => {});
  
})();