/**
 * Session 151: Diagnose Navigation Blocking Issue
 * Test why buttons can't be clicked
 */

const { chromium } = require('playwright');

(async () => {
  console.log('🔍 Diagnosing navigation blocking issue...\n');
  
  const browser = await chromium.launch({
    headless: false,
    slowMo: 500,
  });

  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 }
  });
  
  const page = await context.newPage();
  
  // Navigate to login
  console.log('📍 Going to login page...');
  await page.goto('http://localhost:3000/login');
  
  console.log('Please log in manually...\n');
  
  // Wait for manual login
  while (true) {
    await page.waitForTimeout(1000);
    const url = page.url();
    if (url.includes('localhost:3001')) {
      console.log('✅ Login detected!\n');
      break;
    }
  }
  
  await page.waitForTimeout(3000);
  
  console.log('='.repeat(60));
  console.log('NAVIGATION DIAGNOSTICS');
  console.log('='.repeat(60));
  
  // 1. Find all buttons
  console.log('\n1️⃣ Finding all buttons...');
  const buttons = await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    return btns.map(btn => ({
      text: btn.textContent.trim(),
      visible: btn.offsetParent !== null,
      disabled: btn.disabled,
      zIndex: window.getComputedStyle(btn).zIndex,
      position: window.getComputedStyle(btn).position,
      display: window.getComputedStyle(btn).display,
      clickable: !btn.disabled && btn.offsetParent !== null
    }));
  });
  
  console.log(`Found ${buttons.length} buttons:`);
  buttons.forEach(btn => {
    console.log(`  • "${btn.text}": visible=${btn.visible}, disabled=${btn.disabled}, z-index=${btn.zIndex}, clickable=${btn.clickable}`);
  });
  
  // 2. Check addiction bar z-index
  console.log('\n2️⃣ Checking addiction bar layering...');
  const addictionBarInfo = await page.evaluate(() => {
    const bar = document.querySelector('#v5-addiction-bar');
    if (bar) {
      const styles = window.getComputedStyle(bar);
      return {
        exists: true,
        zIndex: styles.zIndex,
        position: styles.position,
        pointerEvents: styles.pointerEvents,
        dimensions: bar.getBoundingClientRect()
      };
    }
    return { exists: false };
  });
  
  console.log('Addiction bar info:', addictionBarInfo);
  
  // 3. Try to find Friends button specifically
  console.log('\n3️⃣ Analyzing Friends button specifically...');
  const friendsButtonInfo = await page.evaluate(() => {
    // Try multiple selectors
    const selectors = [
      'button:has-text("Friends")',
      'button[text*="Friends"]',
      'button'
    ];
    
    let friendsBtn = null;
    const allButtons = Array.from(document.querySelectorAll('button'));
    for (const btn of allButtons) {
      if (btn.textContent.includes('Friends')) {
        friendsBtn = btn;
        break;
      }
    }
    
    if (friendsBtn) {
      const rect = friendsBtn.getBoundingClientRect();
      const styles = window.getComputedStyle(friendsBtn);
      
      // Check what's at the button's position
      const elementAtPoint = document.elementFromPoint(rect.left + rect.width/2, rect.top + rect.height/2);
      
      return {
        found: true,
        text: friendsBtn.textContent,
        position: rect,
        visible: friendsBtn.offsetParent !== null,
        display: styles.display,
        visibility: styles.visibility,
        opacity: styles.opacity,
        zIndex: styles.zIndex,
        pointerEvents: styles.pointerEvents,
        elementAtPosition: elementAtPoint ? elementAtPoint.tagName + (elementAtPoint.id ? '#' + elementAtPoint.id : '') : 'none',
        isBlockedBy: elementAtPoint !== friendsBtn ? 'YES - blocked by ' + (elementAtPoint?.tagName || 'unknown') : 'NO'
      };
    }
    return { found: false };
  });
  
  console.log('Friends button analysis:', friendsButtonInfo);
  
  // 4. Check what's blocking clicks
  console.log('\n4️⃣ Checking for overlaying elements...');
  const overlayingElements = await page.evaluate(() => {
    const elements = [];
    const all = document.querySelectorAll('*');
    all.forEach(el => {
      const styles = window.getComputedStyle(el);
      const zIndex = parseInt(styles.zIndex) || 0;
      if (styles.position === 'fixed' || styles.position === 'absolute') {
        if (zIndex > 10) { // High z-index elements
          elements.push({
            tag: el.tagName,
            id: el.id,
            class: el.className,
            zIndex: zIndex,
            position: styles.position
          });
        }
      }
    });
    return elements.sort((a, b) => b.zIndex - a.zIndex);
  });
  
  console.log('High z-index elements:');
  overlayingElements.forEach(el => {
    console.log(`  • ${el.tag}${el.id ? '#' + el.id : ''}: z-index=${el.zIndex}, position=${el.position}`);
  });
  
  // 5. Try alternative click methods
  console.log('\n5️⃣ Testing alternative click methods...');
  
  // Method A: Force click
  console.log('  Trying force click...');
  try {
    await page.click('button:has-text("Friends")', { force: true, timeout: 5000 });
    console.log('  ✅ Force click worked!');
  } catch (e) {
    console.log('  ❌ Force click failed:', e.message);
  }
  
  // Method B: JavaScript click
  console.log('  Trying JavaScript click...');
  try {
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const friendsBtn = btns.find(b => b.textContent.includes('Friends'));
      if (friendsBtn) {
        friendsBtn.click();
        return true;
      }
      return false;
    });
    console.log('  ✅ JavaScript click worked!');
  } catch (e) {
    console.log('  ❌ JavaScript click failed:', e.message);
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('DIAGNOSIS COMPLETE');
  console.log('='.repeat(60));
  
  console.log('\nBrowser staying open for 30 seconds...');
  await page.waitForTimeout(30000);
  
  await browser.close();
})();