#!/usr/bin/env node
/**
 * Test Utilities for Puppeteer MCP Testing
 * Session 129 - Priority 1 Implementation
 * 
 * Reusable helpers for authentication and navigation
 */

const TEST_CONFIG = {
    authGatewayUrl: process.env.AUTH_GATEWAY_URL || 'http://localhost:3000',
    dashboardUrl: process.env.DASHBOARD_URL || 'http://localhost:3001',
    testEmailDomain: '@gmail.com',
    testUserPrefix: 'brian.bumsik.kim+test_',
    defaultTimeout: 10000,
    navigationTimeout: 30000
};

class TestUtilities {
    /**
     * Generate a unique test user with timestamp
     */
    static generateTestUser() {
        const timestamp = Date.now();
        const randomId = Math.random().toString(36).substring(7);
        
        return {
            email: `${TEST_CONFIG.testUserPrefix}${timestamp}_${randomId}${TEST_CONFIG.testEmailDomain}`,
            password: 'TestPass123!',
            firstName: 'Test',
            lastName: `User_${timestamp}`,
            timestamp,
            randomId
        };
    }
    
    /**
     * Navigate to auth gateway
     */
    static async navigateToAuth(page) {
        console.log(`Navigating to auth gateway: ${TEST_CONFIG.authGatewayUrl}`);
        await page.goto(TEST_CONFIG.authGatewayUrl, { 
            waitUntil: 'networkidle2',
            timeout: TEST_CONFIG.navigationTimeout 
        });
        await page.waitForSelector('body', { 
            timeout: TEST_CONFIG.defaultTimeout 
        });
        return true;
    }
    
    /**
     * Navigate to dashboard
     */
    static async navigateToDashboard(page) {
        console.log(`Navigating to dashboard: ${TEST_CONFIG.dashboardUrl}`);
        await page.goto(TEST_CONFIG.dashboardUrl, { 
            waitUntil: 'networkidle2',
            timeout: TEST_CONFIG.navigationTimeout 
        });
        await page.waitForSelector('body', { 
            timeout: TEST_CONFIG.defaultTimeout 
        });
        return true;
    }
    
    /**
     * Perform login with credentials
     */
    static async login(page, email, password) {
        console.log(`Logging in as: ${email}`);
        
        // Navigate to login page
        await page.goto(`${TEST_CONFIG.authGatewayUrl}/login`, {
            waitUntil: 'networkidle2'
        });
        
        // Wait for and fill email field
        await page.waitForSelector('input[name="email"], input[type="email"], #email', {
            timeout: TEST_CONFIG.defaultTimeout
        });
        await page.type('input[name="email"], input[type="email"], #email', email, {
            delay: 50 // Type like a human
        });
        
        // Fill password field
        await page.waitForSelector('input[name="password"], input[type="password"], #password', {
            timeout: TEST_CONFIG.defaultTimeout
        });
        await page.type('input[name="password"], input[type="password"], #password', password, {
            delay: 50
        });
        
        // Click submit button
        await page.click('button[type="submit"], button[id="login-button"], button:has-text("Login")');
        
        // Wait for navigation
        await page.waitForNavigation({
            waitUntil: 'networkidle2',
            timeout: TEST_CONFIG.navigationTimeout
        });
        
        // Check if we're on dashboard (successful login)
        const url = page.url();
        const loginSuccess = url.includes('dashboard') || !url.includes('login');
        
        if (loginSuccess) {
            console.log('✅ Login successful');
        } else {
            console.log('❌ Login failed - still on login page');
        }
        
        return loginSuccess;
    }
    
    /**
     * Perform signup with user data
     */
    static async signup(page, userData) {
        console.log(`Signing up new user: ${userData.email}`);
        
        // Navigate to signup page
        await page.goto(`${TEST_CONFIG.authGatewayUrl}/sign-up`, {
            waitUntil: 'networkidle2'
        });
        
        // Fill email
        await page.waitForSelector('input[name="email"], input[type="email"], #email', {
            timeout: TEST_CONFIG.defaultTimeout
        });
        await page.type('input[name="email"], input[type="email"], #email', userData.email, {
            delay: 50
        });
        
        // Fill password
        await page.waitForSelector('input[name="password"], input[type="password"], #password', {
            timeout: TEST_CONFIG.defaultTimeout
        });
        await page.type('input[name="password"], input[type="password"], #password', userData.password, {
            delay: 50
        });
        
        // Fill first name if field exists
        const firstNameExists = await page.$('input[name="firstName"], input[name="first_name"], #firstName');
        if (firstNameExists) {
            await page.type('input[name="firstName"], input[name="first_name"], #firstName', userData.firstName, {
                delay: 50
            });
        }
        
        // Fill last name if field exists
        const lastNameExists = await page.$('input[name="lastName"], input[name="last_name"], #lastName');
        if (lastNameExists) {
            await page.type('input[name="lastName"], input[name="last_name"], #lastName', userData.lastName, {
                delay: 50
            });
        }
        
        // Click submit button
        await page.click('button[type="submit"], button[id="signup-button"], button:has-text("Sign Up")');
        
        // Wait for navigation
        await page.waitForNavigation({
            waitUntil: 'networkidle2',
            timeout: TEST_CONFIG.navigationTimeout
        });
        
        // Check if we're on dashboard or onboarding (successful signup)
        const url = page.url();
        const signupSuccess = url.includes('dashboard') || url.includes('onboarding') || !url.includes('sign-up');
        
        if (signupSuccess) {
            console.log('✅ Signup successful');
        } else {
            console.log('❌ Signup failed - still on signup page');
        }
        
        return signupSuccess;
    }
    
    /**
     * Perform logout
     */
    static async logout(page) {
        console.log('Logging out...');
        
        // Try multiple possible logout selectors
        const logoutSelectors = [
            '#logout-button',
            'button:has-text("Logout")',
            'button:has-text("Sign Out")',
            'a:has-text("Logout")',
            'a:has-text("Sign Out")',
            '[data-testid="logout-button"]'
        ];
        
        let logoutClicked = false;
        for (const selector of logoutSelectors) {
            const element = await page.$(selector);
            if (element) {
                await page.click(selector);
                logoutClicked = true;
                break;
            }
        }
        
        if (!logoutClicked) {
            throw new Error('Could not find logout button');
        }
        
        // Wait for navigation back to login
        await page.waitForNavigation({
            waitUntil: 'networkidle2',
            timeout: TEST_CONFIG.navigationTimeout
        });
        
        // Verify we're back at login
        const url = page.url();
        const logoutSuccess = url.includes('login') || url.includes('sign-in');
        
        if (logoutSuccess) {
            console.log('✅ Logout successful');
        } else {
            console.log('⚠️ Logout completed but not on login page');
        }
        
        return logoutSuccess;
    }
    
    /**
     * Check if element exists on page
     */
    static async checkElementExists(page, selector, timeout = 5000) {
        try {
            await page.waitForSelector(selector, { timeout });
            return true;
        } catch {
            return false;
        }
    }
    
    /**
     * Get text content of element
     */
    static async getTextContent(page, selector) {
        try {
            await page.waitForSelector(selector, { 
                timeout: TEST_CONFIG.defaultTimeout 
            });
            return await page.$eval(selector, el => el.textContent);
        } catch (error) {
            console.error(`Failed to get text for selector ${selector}:`, error.message);
            return null;
        }
    }
    
    /**
     * Wait for and click element
     */
    static async waitAndClick(page, selector, timeout = TEST_CONFIG.defaultTimeout) {
        await page.waitForSelector(selector, { timeout });
        await page.click(selector);
        return true;
    }
    
    /**
     * Type text with human-like delay
     */
    static async typeWithDelay(page, selector, text, delay = 50) {
        await page.waitForSelector(selector, { 
            timeout: TEST_CONFIG.defaultTimeout 
        });
        await page.type(selector, text, { delay });
        return true;
    }
    
    /**
     * Take screenshot with timestamp
     */
    static async takeScreenshot(page, name = 'screenshot') {
        const timestamp = Date.now();
        const path = `/tmp/${name}-${timestamp}.png`;
        await page.screenshot({ path, fullPage: true });
        console.log(`📸 Screenshot saved: ${path}`);
        return path;
    }
    
    /**
     * Assert condition with meaningful error
     */
    static assert(condition, message) {
        if (!condition) {
            throw new Error(`Assertion failed: ${message}`);
        }
        return true;
    }
    
    /**
     * Get current timestamp for unique identifiers
     */
    static getTimestamp() {
        return Date.now();
    }
    
    /**
     * Sleep for specified milliseconds
     */
    static async sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    /**
     * Check if services are running
     */
    static async checkServicesRunning() {
        const { exec } = require('child_process');
        const util = require('util');
        const execPromise = util.promisify(exec);
        
        const services = {
            authGateway: false,
            dashboard: false
        };
        
        try {
            // Check auth gateway using curl
            await execPromise('curl -I http://localhost:3000 2>/dev/null | head -n 1');
            services.authGateway = true;
        } catch {
            console.log('⚠️ Auth gateway not responding on port 3000');
        }
        
        try {
            // Check dashboard using curl
            await execPromise('curl -I http://localhost:3001 2>/dev/null | head -n 1');
            services.dashboard = true;
        } catch {
            console.log('⚠️ Dashboard not responding on port 3001');
        }
        
        return services;
    }
}

// Export for use in test files
module.exports = TestUtilities;

// Test configuration export
module.exports.TEST_CONFIG = TEST_CONFIG;