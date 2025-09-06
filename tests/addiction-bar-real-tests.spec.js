/**
 * Session 151: Real Addiction Bar Tests
 * Tests for the ACTUAL addiction bar that exists on the dashboard
 */

const { test, expect } = require('@playwright/test');

const TEST_CREDENTIALS = {
  email: 'brian.bumsik.kim+08test@gmail.com',
  password: '16180339*emD'
};

test.describe('Session 151: Real Addiction Bar Tests', () => {
  
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto('http://localhost:3000/login');
    await page.waitForTimeout(1000);
    
    // Fill email using placeholder text
    await page.fill('input[placeholder="Your email"]', TEST_CREDENTIALS.email);
    await page.waitForTimeout(500);
    
    // Fill password using placeholder text
    await page.fill('input[placeholder="Your password"]', TEST_CREDENTIALS.password);
    await page.waitForTimeout(500);
    
    // Click login button
    await page.click('button:has-text("Login")');
    
    // Wait for dashboard
    await page.waitForURL('http://localhost:3001/', { timeout: 10000 });
    await page.waitForTimeout(2000); // Let page fully load
  });
  
  test('Addiction bar is visible and has all elements', async ({ page }) => {
    console.log('🧪 Testing addiction bar visibility...');
    
    // Check main addiction bar exists
    const addictionBar = await page.locator('#v5-addiction-bar');
    await expect(addictionBar).toBeVisible();
    console.log('✅ Addiction bar is visible');
    
    // Check all 4 addiction items exist
    const addictionItems = await page.locator('.v5-addiction-item').all();
    expect(addictionItems.length).toBe(4);
    console.log('✅ All 4 addiction items present');
    
    // Verify each icon is present
    const icons = ['👁️', '🔥', '🪙', '🏆'];
    for (const icon of icons) {
      const iconElement = await page.locator(`.v5-addiction-icon:has-text("${icon}")`);
      await expect(iconElement).toBeVisible();
      console.log(`✅ Icon ${icon} is visible`);
    }
  });
  
  test('EmCoin balance displays correctly', async ({ page }) => {
    console.log('🧪 Testing EmCoin balance...');
    
    // Check EmCoin balance element
    const emCoinBalance = await page.locator('#v5-emcoin-balance');
    await expect(emCoinBalance).toBeVisible();
    
    // Get the current balance
    const balance = await emCoinBalance.textContent();
    console.log(`📊 Current EmCoin balance: ${balance}`);
    
    // Verify it's a number
    expect(balance).toMatch(/^\d+$/);
    console.log('✅ EmCoin balance is a valid number');
  });
  
  test('Streak counter displays correctly', async ({ page }) => {
    console.log('🧪 Testing streak counter...');
    
    // Check streak element
    const streakCount = await page.locator('#v5-streak-count');
    await expect(streakCount).toBeVisible();
    
    // Get current streak
    const streak = await streakCount.textContent();
    console.log(`📊 Current streak: ${streak} days`);
    
    // Verify it's a number
    expect(streak).toMatch(/^\d+$/);
    console.log('✅ Streak is a valid number');
  });
  
  test('Today visitors counter displays correctly', async ({ page }) => {
    console.log('🧪 Testing today visitors...');
    
    // Check today count element
    const todayCount = await page.locator('#v5-today-count');
    await expect(todayCount).toBeVisible();
    
    // Get visitor count
    const visitors = await todayCount.textContent();
    console.log(`📊 Today's visitors: ${visitors}`);
    
    // Verify it's a number
    expect(visitors).toMatch(/^\d+$/);
    console.log('✅ Visitor count is a valid number');
  });
  
  test('Division rank displays correctly', async ({ page }) => {
    console.log('🧪 Testing division rank...');
    
    // Check rank element
    const rankPosition = await page.locator('#v5-rank-position');
    await expect(rankPosition).toBeVisible();
    
    // Get rank
    const rank = await rankPosition.textContent();
    console.log(`📊 Current rank: ${rank}`);
    
    // Rank can be #-- or a number like #1
    expect(rank).toMatch(/^#(\d+|--)/);
    console.log('✅ Rank format is valid');
  });
  
  test('Addiction bar persists on page navigation', async ({ page }) => {
    console.log('🧪 Testing addiction bar persistence...');
    
    // Verify bar is visible initially
    await expect(page.locator('#v5-addiction-bar')).toBeVisible();
    
    // Navigate to different sections
    const navButtons = ['Teams & Guilds', 'Friends', 'Dashboard'];
    
    for (const buttonText of navButtons) {
      console.log(`  Navigating to ${buttonText}...`);
      await page.click(`button:has-text("${buttonText}")`);
      await page.waitForTimeout(1000);
      
      // Check bar is still visible
      await expect(page.locator('#v5-addiction-bar')).toBeVisible();
      console.log(`  ✅ Bar still visible on ${buttonText}`);
    }
    
    console.log('✅ Addiction bar persists across navigation');
  });
  
  test('Addiction bar has correct styling', async ({ page }) => {
    console.log('🧪 Testing addiction bar styling...');
    
    // Check that styles are loaded
    const styles = await page.locator('#v5-addiction-styles');
    await expect(styles).toBeAttached();
    console.log('✅ V5 addiction styles are loaded');
    
    // Check bar positioning (should be fixed)
    const barClasses = await page.locator('#v5-addiction-bar').getAttribute('class');
    expect(barClasses).toContain('fixed');
    console.log('✅ Bar has fixed positioning');
    
    // Check bar is at top of page
    const barBox = await page.locator('#v5-addiction-bar').boundingBox();
    expect(barBox.y).toBeLessThanOrEqual(100); // Should be near top
    console.log('✅ Bar is positioned at top of page');
  });
});