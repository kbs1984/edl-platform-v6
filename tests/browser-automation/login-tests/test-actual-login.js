/**
 * Session 151: Test Actual Login and Discover Elements
 * This will login programmatically and explore the dashboard
 */

const { chromium } = require('playwright');

(async () => {
  console.log('🚀 Starting automated login test...\n');
  
  // Launch browser with UI visible
  const browser = await chromium.launch({
    headless: false,
    slowMo: 500, // Slow so you can see what's happening
  });

  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 }
  });
  
  const page = await context.newPage();
  
  try {
    // Navigate to auth gateway
    console.log('1️⃣ Navigating to Auth Gateway (http://localhost:3000)...');
    await page.goto('http://localhost:3000');
    await page.waitForTimeout(1000);
    
    // Check if already logged in by looking for redirect or dashboard elements
    const url = page.url();
    console.log(`   Current URL: ${url}`);
    
    if (url.includes('localhost:3000')) {
      console.log('2️⃣ On login page, attempting to login...');
      
      // Try to login with test credentials
      // You mentioned "08 tester" - let me try common test credentials
      const testCredentials = [
        { email: 'test@example.com', password: 'password123' },
        { email: '08tester@test.com', password: 'test123' },
        { email: 'tester08@test.com', password: 'test123' },
        { email: 'test8@test.com', password: 'test123' }
      ];
      
      console.log('   Trying test credentials...');
      
      // Fill in email
      await page.fill('input[type="email"], input[name="email"], input[placeholder*="email"]', 'test@example.com');
      await page.waitForTimeout(500);
      
      // Fill in password  
      await page.fill('input[type="password"], input[name="password"], input[placeholder*="password"]', 'password123');
      await page.waitForTimeout(500);
      
      // Click login button
      await page.click('button:has-text("Login")');
      console.log('   Clicked login button, waiting for navigation...');
      
      // Wait for navigation or error
      await page.waitForTimeout(3000);
    }
    
    // Check where we are now
    const newUrl = page.url();
    console.log(`3️⃣ After login attempt, URL: ${newUrl}\n`);
    
    if (newUrl.includes('localhost:3001')) {
      console.log('✅ Successfully reached dashboard!\n');
      console.log('=== DASHBOARD ELEMENT DISCOVERY ===\n');
      
      // Now discover elements on the dashboard
      
      // Get all visible text
      const allText = await page.textContent('body');
      
      // Look for user indicator
      if (allText.includes('08 tester')) {
        console.log('✅ Found "08 tester" on page');
      }
      
      // Find main sections
      console.log('\n📍 Main Page Sections:');
      const mainSections = await page.evaluate(() => {
        const sections = [];
        
        // Look for main, aside, nav, header, footer
        ['main', 'aside', 'nav', 'header', 'footer', '[role="navigation"]', '[role="main"]'].forEach(selector => {
          const els = document.querySelectorAll(selector);
          els.forEach(el => {
            sections.push({
              type: selector,
              classes: el.className,
              hasContent: el.textContent.trim().length > 0
            });
          });
        });
        
        return sections;
      });
      
      mainSections.forEach(section => {
        console.log(`  • ${section.type}: ${section.classes || '(no classes)'} - ${section.hasContent ? 'has content' : 'empty'}`);
      });
      
      // Find navigation items
      console.log('\n🗂️ Navigation Items:');
      const navItems = await page.evaluate(() => {
        return Array.from(document.querySelectorAll('a[href], nav a, [role="navigation"] a')).map(a => ({
          text: a.textContent.trim(),
          href: a.href
        })).filter(a => a.text);
      });
      
      navItems.forEach(item => {
        console.log(`  • ${item.text}: ${item.href}`);
      });
      
      // Look for addiction bar or game elements
      console.log('\n🎮 Addiction/Game Elements:');
      const addictionElements = await page.evaluate(() => {
        const found = [];
        
        // Search for v5-style elements
        document.querySelectorAll('[id*="addiction"], [class*="addiction"], [id*="v5"], [class*="v5"]').forEach(el => {
          found.push({
            selector: el.id ? `#${el.id}` : `.${el.className}`,
            tag: el.tagName,
            text: el.textContent.substring(0, 50)
          });
        });
        
        // Search for EmCoin elements
        document.querySelectorAll('[id*="coin"], [class*="coin"], [id*="emcoin"], [class*="emcoin"]').forEach(el => {
          found.push({
            selector: el.id ? `#${el.id}` : `.${el.className}`,
            tag: el.tagName,
            text: el.textContent.substring(0, 50)
          });
        });
        
        return found;
      });
      
      if (addictionElements.length > 0) {
        addictionElements.forEach(el => {
          console.log(`  ✓ Found: ${el.selector} (${el.tag}): "${el.text}"`);
        });
      } else {
        console.log('  ❌ No addiction bar or EmCoin elements found');
        console.log('  ℹ️ These features may not be implemented yet');
      }
      
      // Get page title and any headings
      console.log('\n📄 Page Content:');
      const pageContent = await page.evaluate(() => {
        return {
          title: document.title,
          h1: Array.from(document.querySelectorAll('h1')).map(h => h.textContent.trim()),
          h2: Array.from(document.querySelectorAll('h2')).map(h => h.textContent.trim())
        };
      });
      
      console.log(`  • Page Title: ${pageContent.title}`);
      if (pageContent.h1.length > 0) {
        console.log(`  • H1 Headings: ${pageContent.h1.join(', ')}`);
      }
      if (pageContent.h2.length > 0) {
        console.log(`  • H2 Headings: ${pageContent.h2.join(', ')}`);
      }
      
      // Take screenshot
      await page.screenshot({ path: 'dashboard-after-login-151.png', fullPage: true });
      console.log('\n📸 Screenshot saved: dashboard-after-login-151.png');
      
    } else {
      console.log('⚠️ Did not reach dashboard. Still on:', newUrl);
      
      // Check for error messages
      const errorMessages = await page.$$eval('[role="alert"], .error, .alert, [class*="error"]', 
        els => els.map(el => el.textContent.trim())
      );
      
      if (errorMessages.length > 0) {
        console.log('\n❌ Error messages found:');
        errorMessages.forEach(msg => console.log(`  • ${msg}`));
      }
    }
    
  } catch (error) {
    console.error('Error during test:', error.message);
  }
  
  console.log('\n=== TEST COMPLETE ===');
  console.log('Browser will stay open for 30 seconds for inspection...');
  await page.waitForTimeout(30000);
  
  await browser.close();
  console.log('Browser closed.');
})();