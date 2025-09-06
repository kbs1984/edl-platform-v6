/**
 * Dashboard Test Suite - Standard Puppeteer
 * Session 132 - Validating Dashboard Navigation
 */

const puppeteer = require('puppeteer');

describe('EDL Dashboard Tests', () => {
    let browser;
    let page;
    
    const config = {
        dashboardUrl: 'http://localhost:3001',
        authUrl: 'http://localhost:3000',
        testUser: {
            email: 'test@example.com',
            password: 'TestPass123!'
        }
    };
    
    beforeAll(async () => {
        browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        page = await browser.newPage();
        await page.setViewport({ width: 1366, height: 768 });
    });
    
    afterAll(async () => {
        if (browser) await browser.close();
    });
    
    test('should load dashboard homepage', async () => {
        await page.goto(config.dashboardUrl, {
            waitUntil: 'networkidle2'
        });
        
        const title = await page.title();
        expect(title).toBeTruthy();
        
        // Check for main navigation elements
        const hasNav = await page.$('nav') !== null;
        expect(hasNav).toBe(true);
    });
    
    test('should navigate to different dashboard sections', async () => {
        // Navigate to dashboard
        await page.goto(`${config.dashboardUrl}/dashboard`, {
            waitUntil: 'networkidle2'
        });
        
        // Take screenshot of dashboard
        await page.screenshot({ path: '/tmp/dashboard-main.png' });
        
        // Check for sidebar navigation
        const sidebar = await page.$('[role="navigation"], aside, .sidebar');
        expect(sidebar).toBeTruthy();
        
        // Try to find and click on menu items
        const menuItems = await page.$$('a[href*="/dashboard"], a[href*="/groups"], a[href*="/profile"]');
        console.log(`Found ${menuItems.length} menu items`);
        
        // Click through navigation items if they exist
        for (const item of menuItems.slice(0, 3)) {
            const href = await item.evaluate(el => el.href);
            console.log(`Navigating to: ${href}`);
            await item.click();
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            const currentUrl = page.url();
            console.log(`Current URL: ${currentUrl}`);
        }
    });
    
    test('should handle responsive viewport changes', async () => {
        await page.goto(config.dashboardUrl, {
            waitUntil: 'networkidle2'
        });
        
        // Test mobile viewport
        await page.setViewport({ width: 375, height: 667 });
        await new Promise(resolve => setTimeout(resolve, 500));
        await page.screenshot({ path: '/tmp/dashboard-mobile.png' });
        
        // Test tablet viewport
        await page.setViewport({ width: 768, height: 1024 });
        await new Promise(resolve => setTimeout(resolve, 500));
        await page.screenshot({ path: '/tmp/dashboard-tablet.png' });
        
        // Back to desktop
        await page.setViewport({ width: 1366, height: 768 });
        await new Promise(resolve => setTimeout(resolve, 500));
        await page.screenshot({ path: '/tmp/dashboard-desktop.png' });
        
        console.log('✅ Responsive viewports tested');
    });
    
    test('should interact with user menu', async () => {
        await page.goto(`${config.dashboardUrl}/dashboard`, {
            waitUntil: 'networkidle2'
        });
        
        // Look for user avatar or menu button
        const userMenu = await page.$('[aria-label*="user"], [aria-label*="profile"], button img[alt*="avatar"], button img[alt*="user"]');
        
        if (userMenu) {
            await userMenu.click();
            await new Promise(resolve => setTimeout(resolve, 500));
            
            // Check if dropdown appeared
            const dropdown = await page.$('[role="menu"], .dropdown-menu, .popover');
            expect(dropdown).toBeTruthy();
            
            console.log('✅ User menu interaction successful');
        } else {
            console.log('⚠️ User menu not found - may require login');
        }
    });
});