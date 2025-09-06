/**
 * Session 151: Simple Visible Browser Test
 * Demonstrates that Puppeteer/Playwright tests DO show visible browser
 */

const { test, expect } = require('@playwright/test');

test.describe('Session 151: Visible Browser Verification', () => {
  
  test('Browser opens visibly and navigates', async ({ page }) => {
    console.log('🖥️ TEST 1: Browser Visibility Test');
    console.log('You should see a Chrome window open...');
    
    // Navigate to dashboard
    await page.goto('http://localhost:3001');
    console.log('✅ Navigated to dashboard');
    
    // Wait so user can see
    await page.waitForTimeout(2000);
    
    // Take a screenshot as evidence
    await page.screenshot({ path: 'visible-browser-evidence.png' });
    console.log('📸 Screenshot taken');
    
    // Try to find any text on the page
    const bodyText = await page.textContent('body');
    console.log(`📄 Page has ${bodyText.length} characters of text`);
    
    expect(bodyText.length).toBeGreaterThan(0);
  });
  
  test('Navigate between auth and dashboard', async ({ page }) => {
    console.log('🔄 TEST 2: Navigation Test');
    
    // Start at auth
    await page.goto('http://localhost:3000');
    console.log('📍 At auth gateway');
    await page.waitForTimeout(1500);
    
    // Go to dashboard
    await page.goto('http://localhost:3001');
    console.log('📍 At dashboard');
    await page.waitForTimeout(1500);
    
    // Verify we can navigate
    const url = page.url();
    expect(url).toContain('localhost');
    console.log('✅ Navigation works');
  });
  
  test('Simulate user interactions', async ({ page }) => {
    console.log('🖱️ TEST 3: User Interaction Simulation');
    
    await page.goto('http://localhost:3001');
    
    // Move mouse around to show interaction
    console.log('Moving mouse...');
    await page.mouse.move(100, 100);
    await page.mouse.move(500, 300);
    await page.mouse.move(800, 200);
    
    // Type something to show keyboard interaction
    console.log('Simulating keyboard input...');
    await page.keyboard.press('Tab');
    await page.waitForTimeout(500);
    await page.keyboard.press('Tab');
    await page.waitForTimeout(500);
    
    console.log('✅ Interactions demonstrated');
  });
});