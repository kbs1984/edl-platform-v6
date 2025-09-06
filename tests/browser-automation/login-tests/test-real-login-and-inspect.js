/**
 * Session 151: Real Login and Dashboard Inspection
 * This will actually login and document what's on the dashboard
 */

const { chromium } = require('playwright');

(async () => {
  console.log('🚀 Starting Real Login and Dashboard Inspection...\n');
  
  // Launch browser with UI visible
  const browser = await chromium.launch({
    headless: false,
    slowMo: 300, // Slow enough to see what's happening
  });

  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 }
  });
  
  const page = await context.newPage();
  
  try {
    // Step 1: Navigate to Auth Gateway
    console.log('📍 Step 1: Navigating to Auth Gateway...');
    await page.goto('http://localhost:3000/login');
    await page.waitForTimeout(1000);
    
    // Step 2: Fill in login credentials
    console.log('📝 Step 2: Filling login form...');
    
    // Use the test account that exists
    const testEmail = 'brian.bumsik.kim+08test@gmail.com';
    console.log(`   Email: ${testEmail}`);
    
    // Fill email
    await page.fill('input[type="email"], input[placeholder*="email" i], input[name="email"]', testEmail);
    await page.waitForTimeout(500);
    
    // Fill password - using the correct password
    const testPassword = '16180339*emD'; // Correct password provided by user
    await page.fill('input[type="password"], input[placeholder*="password" i], input[name="password"]', testPassword);
    await page.waitForTimeout(500);
    
    console.log('   Password: [hidden]');
    
    // Step 3: Submit the form
    console.log('🔐 Step 3: Attempting login...');
    
    // Try to submit by pressing Enter
    await page.keyboard.press('Enter');
    
    // Wait for navigation or error
    console.log('   Waiting for response...');
    await page.waitForTimeout(3000);
    
    // Check current URL
    const currentUrl = page.url();
    console.log(`   Current URL: ${currentUrl}`);
    
    if (currentUrl.includes('localhost:3001')) {
      console.log('✅ Successfully logged in and reached dashboard!\n');
      
      // Step 4: Inspect Dashboard
      console.log('=== DASHBOARD INSPECTION ===\n');
      
      // Wait for page to fully load
      await page.waitForTimeout(2000);
      
      // Get page title
      const pageTitle = await page.title();
      console.log(`📄 Page Title: ${pageTitle}`);
      
      // Look for user information
      console.log('\n👤 User Information:');
      const userInfo = await page.evaluate(() => {
        const texts = [];
        document.querySelectorAll('*').forEach(el => {
          if (el.textContent && (
            el.textContent.includes('08') || 
            el.textContent.includes('test') ||
            el.textContent.includes('brian')
          )) {
            const text = el.textContent.trim();
            if (text.length < 100 && !texts.includes(text)) {
              texts.push(text);
            }
          }
        });
        return texts.slice(0, 5);
      });
      userInfo.forEach(text => console.log(`  • ${text}`));
      
      // Check for main navigation items
      console.log('\n🗂️ Navigation Elements:');
      const navItems = await page.$$eval('nav a, aside a, [role="navigation"] a', links => 
        links.map(a => ({
          text: a.textContent.trim(),
          href: a.href
        })).filter(a => a.text)
      );
      navItems.forEach(item => console.log(`  • ${item.text}`));
      
      // Look for addiction/game elements
      console.log('\n🎮 Addiction/EmCoin Elements:');
      const addictionElements = await page.evaluate(() => {
        const found = [];
        
        // Search for specific elements
        const selectors = [
          '[id*="emcoin"]', '[class*="emcoin"]',
          '[id*="coin"]', '[class*="coin"]',
          '[id*="addiction"]', '[class*="addiction"]',
          '[id*="streak"]', '[class*="streak"]',
          '[id*="badge"]', '[class*="badge"]',
          '[id*="achievement"]', '[class*="achievement"]',
          '[id*="level"]', '[class*="level"]',
          '[id*="xp"]', '[class*="xp"]',
          '[id*="progress"]', '[class*="progress"]'
        ];
        
        selectors.forEach(selector => {
          try {
            const els = document.querySelectorAll(selector);
            els.forEach(el => {
              if (!found.some(f => f.element === el)) {
                found.push({
                  selector: selector,
                  id: el.id,
                  class: el.className,
                  tag: el.tagName,
                  text: el.textContent ? el.textContent.substring(0, 50) : '',
                  element: el
                });
              }
            });
          } catch (e) {}
        });
        
        return found.map(f => ({
          selector: f.selector,
          id: f.id,
          class: f.class,
          tag: f.tag,
          text: f.text
        }));
      });
      
      if (addictionElements.length > 0) {
        console.log('  ✅ Found addiction/game elements:');
        addictionElements.forEach(el => {
          console.log(`    • ${el.tag}${el.id ? '#' + el.id : ''}${el.class ? '.' + el.class.split(' ')[0] : ''}: "${el.text}"`);
        });
      } else {
        console.log('  ❌ No addiction/EmCoin elements found - features not implemented yet');
      }
      
      // Check for main content areas
      console.log('\n📊 Main Content Areas:');
      const contentAreas = await page.evaluate(() => {
        const areas = [];
        
        // Check for main sections
        ['main', 'aside', 'header', 'footer', '[role="main"]', '.dashboard', '.content'].forEach(selector => {
          const el = document.querySelector(selector);
          if (el) {
            areas.push({
              selector: selector,
              hasContent: el.textContent.trim().length > 0,
              childCount: el.children.length
            });
          }
        });
        
        return areas;
      });
      contentAreas.forEach(area => {
        console.log(`  • ${area.selector}: ${area.childCount} children, ${area.hasContent ? 'has content' : 'empty'}`);
      });
      
      // Get all headings to understand page structure
      console.log('\n📝 Page Headings:');
      const headings = await page.$$eval('h1, h2, h3', els => 
        els.map(el => ({
          level: el.tagName,
          text: el.textContent.trim()
        }))
      );
      headings.forEach(h => console.log(`  • ${h.level}: ${h.text}`));
      
      // Look for any buttons or interactive elements
      console.log('\n🔘 Interactive Elements:');
      const buttons = await page.$$eval('button, [role="button"]', btns => 
        btns.map(btn => btn.textContent.trim()).filter(text => text)
      );
      buttons.forEach(btnText => console.log(`  • Button: "${btnText}"`));
      
      // Take a comprehensive screenshot
      await page.screenshot({ path: 'dashboard-logged-in-full-inspection.png', fullPage: true });
      console.log('\n📸 Full dashboard screenshot saved: dashboard-logged-in-full-inspection.png');
      
      // Final assessment
      console.log('\n=== ASSESSMENT ===');
      console.log('✅ Successfully logged into dashboard');
      
      if (addictionElements.length === 0) {
        console.log('⚠️ Addiction mechanics NOT found - need to implement:');
        console.log('  • EmCoin display');
        console.log('  • Addiction bar');
        console.log('  • Streak counter');
        console.log('  • Achievement badges');
      } else {
        console.log('✅ Found some game elements - need to verify functionality');
      }
      
    } else if (currentUrl.includes('localhost:3000')) {
      console.log('❌ Login failed - still on auth page');
      
      // Check for error messages
      const errors = await page.$$eval('.error, [role="alert"], [class*="error"]', 
        els => els.map(el => el.textContent.trim())
      );
      
      if (errors.length > 0) {
        console.log('Error messages:');
        errors.forEach(err => console.log(`  • ${err}`));
      }
      
      console.log('\n⚠️ The password might be different. Please provide the correct password.');
    }
    
  } catch (error) {
    console.error('Error during inspection:', error.message);
  }
  
  console.log('\n=== INSPECTION COMPLETE ===');
  console.log('Browser will stay open for manual inspection...');
  console.log('Press Ctrl+C to close when done.');
  
  // Keep browser open
  await new Promise(() => {});
})();