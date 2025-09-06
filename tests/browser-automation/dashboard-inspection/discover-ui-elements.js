/**
 * Session 151: Discover UI Elements After Login
 * This script connects to the existing browser and discovers available elements
 */

const { chromium } = require('playwright');

(async () => {
  console.log('🔍 Discovering UI elements on logged-in page...\n');
  
  // Launch browser and navigate to dashboard
  const browser = await chromium.launch({
    headless: false,
    slowMo: 100,
  });

  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 }
  });
  
  const page = await context.newPage();
  
  // Navigate directly to dashboard (assuming already logged in via cookies)
  console.log('📍 Navigating to dashboard...');
  await page.goto('http://localhost:3001');
  await page.waitForTimeout(3000);
  
  console.log('=== ELEMENT DISCOVERY REPORT ===\n');
  
  // Check for user info
  const userName = await page.textContent('body').then(text => {
    if (text.includes('08 tester')) {
      console.log('✅ User logged in as: 08 tester');
      return '08 tester';
    }
    return null;
  });

  // Try to find EmCoin related elements
  console.log('\n🪙 EmCoin Elements:');
  const emCoinSelectors = [
    '#emCoinBalance',
    '[data-testid="emcoin-balance"]',
    '.emcoin-balance',
    'text=/\\d+\\s*(emcoins?|coins?)/i',
    '[class*="coin"]',
    '[id*="coin"]'
  ];
  
  for (const selector of emCoinSelectors) {
    try {
      const element = await page.$(selector);
      if (element) {
        const text = await element.textContent();
        console.log(`  ✓ Found: ${selector} = "${text}"`);
      }
    } catch (e) {
      // Silently skip
    }
  }
  
  // Try to find addiction bar elements
  console.log('\n📊 Addiction Bar Elements:');
  const addictionSelectors = [
    '#v5-addiction-bar',
    '[data-testid="addiction-bar"]',
    '.addiction-bar',
    '[class*="addiction"]',
    '[class*="progress"]',
    '[class*="streak"]',
    '[id*="streak"]'
  ];
  
  for (const selector of addictionSelectors) {
    try {
      const element = await page.$(selector);
      if (element) {
        const text = await element.textContent();
        console.log(`  ✓ Found: ${selector} = "${text}"`);
      }
    } catch (e) {
      // Silently skip
    }
  }
  
  // Find all buttons on the page
  console.log('\n🔘 Interactive Buttons:');
  const buttons = await page.$$('button');
  for (const button of buttons) {
    const text = await button.textContent();
    const testId = await button.getAttribute('data-testid');
    const id = await button.getAttribute('id');
    if (text && text.trim()) {
      console.log(`  ✓ Button: "${text.trim()}"${testId ? ` [data-testid="${testId}"]` : ''}${id ? ` [id="${id}"]` : ''}`);
    }
  }
  
  // Find profile/avatar elements
  console.log('\n👤 Profile Elements:');
  const profileSelectors = [
    '[class*="avatar"]',
    '[class*="profile"]',
    '[alt*="avatar"]',
    '[alt*="profile"]',
    'img[src*="avatar"]'
  ];
  
  for (const selector of profileSelectors) {
    try {
      const elements = await page.$$(selector);
      if (elements.length > 0) {
        console.log(`  ✓ Found ${elements.length} element(s) matching: ${selector}`);
      }
    } catch (e) {
      // Silently skip
    }
  }
  
  // Check page structure
  console.log('\n📄 Page Structure:');
  const mainContent = await page.$('main');
  if (mainContent) {
    console.log('  ✓ Main content area found');
  }
  
  const sidebar = await page.$('[class*="sidebar"], aside');
  if (sidebar) {
    console.log('  ✓ Sidebar found');
  }
  
  const nav = await page.$('nav, [class*="nav"]');
  if (nav) {
    console.log('  ✓ Navigation found');
  }
  
  // Get all text content to understand what's on the page
  console.log('\n📝 Page Content Summary:');
  const bodyText = await page.textContent('body');
  const lines = bodyText.split('\n').map(l => l.trim()).filter(l => l.length > 0);
  const uniqueLines = [...new Set(lines)].slice(0, 20);
  uniqueLines.forEach(line => {
    if (line.length < 50) {
      console.log(`  • ${line}`);
    }
  });
  
  // Take a screenshot for reference
  const screenshotPath = 'dashboard-logged-in-session-151.png';
  await page.screenshot({ path: screenshotPath, fullPage: true });
  console.log(`\n📸 Screenshot saved: ${screenshotPath}`);
  
  console.log('\n=== DISCOVERY COMPLETE ===');
  console.log('Browser will stay open. Press Ctrl+C when done.');
  
  // Keep browser open
  await new Promise(() => {});
})();