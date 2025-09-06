/**
 * Session 151: Inspect Current Logged-In Page
 * This script will connect to Chrome DevTools Protocol to inspect the existing browser
 */

const { chromium } = require('playwright');

(async () => {
  console.log('🔍 Connecting to existing browser session...\n');
  
  try {
    // Connect to existing browser instance via CDP
    // First, let's try with a new page in the same context as your logged-in session
    const browser = await chromium.connectOverCDP('http://localhost:9222');
    
    const contexts = browser.contexts();
    console.log(`Found ${contexts.length} browser context(s)`);
    
    if (contexts.length > 0) {
      const context = contexts[0];
      const pages = context.pages();
      console.log(`Found ${pages.length} page(s) in context`);
      
      // Get the first page (your logged-in dashboard)
      if (pages.length > 0) {
        const page = pages[0];
        const url = page.url();
        console.log(`Current URL: ${url}\n`);
        
        console.log('=== LOGGED-IN PAGE INSPECTION ===\n');
        
        // Check for user name "08 tester"
        try {
          const userElements = await page.$$eval('*', elements => 
            elements.filter(el => el.textContent && el.textContent.includes('08 tester'))
              .map(el => ({
                tag: el.tagName,
                class: el.className,
                text: el.textContent.substring(0, 100)
              }))
          );
          
          if (userElements.length > 0) {
            console.log('✅ Found "08 tester" in elements:');
            userElements.forEach(el => {
              console.log(`  • ${el.tag}${el.class ? `.${el.class}` : ''}: "${el.text}"`);
            });
          }
        } catch (e) {
          console.log('Could not search for user name');
        }
        
        // Get all visible text on the page
        console.log('\n📝 Visible Page Content:');
        const visibleText = await page.evaluate(() => {
          const walker = document.createTreeWalker(
            document.body,
            NodeFilter.SHOW_TEXT,
            {
              acceptNode: function(node) {
                if (node.parentElement.offsetParent !== null && 
                    node.textContent.trim().length > 0) {
                  return NodeFilter.FILTER_ACCEPT;
                }
                return NodeFilter.FILTER_REJECT;
              }
            }
          );
          
          const texts = [];
          let node;
          while (node = walker.nextNode()) {
            const text = node.textContent.trim();
            if (text && !texts.includes(text)) {
              texts.push(text);
            }
          }
          return texts.slice(0, 30); // First 30 unique texts
        });
        
        visibleText.forEach(text => {
          if (text.length < 100) {
            console.log(`  • ${text}`);
          }
        });
        
        // Find all buttons
        console.log('\n🔘 All Buttons on Page:');
        const buttons = await page.evaluate(() => {
          return Array.from(document.querySelectorAll('button')).map(btn => ({
            text: btn.textContent.trim(),
            id: btn.id,
            classes: btn.className,
            onclick: btn.onclick ? 'has onclick' : 'no onclick'
          }));
        });
        
        buttons.forEach(btn => {
          console.log(`  • "${btn.text}" ${btn.id ? `#${btn.id}` : ''} ${btn.classes ? `.${btn.classes}` : ''}`);
        });
        
        // Look for any EmCoin or addiction-related elements
        console.log('\n🎮 Game Elements Search:');
        const gameElements = await page.evaluate(() => {
          const results = [];
          
          // Search for elements by text content
          const searchTerms = ['coin', 'emcoin', 'streak', 'badge', 'achievement', 'level', 'points', 'xp', 'rewards'];
          searchTerms.forEach(term => {
            const elements = Array.from(document.querySelectorAll('*')).filter(el => {
              const text = el.textContent.toLowerCase();
              const id = (el.id || '').toLowerCase();
              const className = (el.className || '').toLowerCase();
              return text.includes(term) || id.includes(term) || className.includes(term);
            }).slice(0, 3);
            
            elements.forEach(el => {
              results.push({
                term: term,
                tag: el.tagName,
                id: el.id,
                class: el.className,
                text: el.textContent.substring(0, 50)
              });
            });
          });
          
          return results;
        });
        
        if (gameElements.length > 0) {
          gameElements.forEach(el => {
            console.log(`  • Found "${el.term}": ${el.tag}${el.id ? `#${el.id}` : ''}${el.class ? `.${el.class}` : ''}`);
          });
        } else {
          console.log('  ❌ No game/addiction elements found');
        }
        
        // Take a screenshot
        const screenshotPath = 'logged-in-dashboard-151.png';
        await page.screenshot({ path: screenshotPath, fullPage: true });
        console.log(`\n📸 Screenshot saved: ${screenshotPath}`);
        
        console.log('\n=== INSPECTION COMPLETE ===');
      }
    }
  } catch (error) {
    console.log('❌ Could not connect via CDP. Trying alternative method...\n');
    
    // Alternative: Use the page you have open by taking a screenshot of current state
    console.log('Please ensure you are on the logged-in dashboard page.');
    console.log('The browser window with "08 tester" should be visible.');
  }
})();