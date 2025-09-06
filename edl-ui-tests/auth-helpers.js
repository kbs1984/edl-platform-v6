/**
 * Authentication Helpers for Standard Puppeteer
 * Session 133 - Refactored from scripts/00129-test-utilities.js
 * 
 * Provides authentication utilities for E2E testing with standard Puppeteer
 */

const puppeteer = require('puppeteer');

class AuthHelpers {
    constructor() {
        this.config = {
            authUrl: process.env.AUTH_GATEWAY_URL || 'http://localhost:3000',
            dashboardUrl: process.env.DASHBOARD_URL || 'http://localhost:3001',
            // Using Gmail + addressing for real emails (Session 129 pattern)
            baseEmail: 'brian.bumsik.kim@gmail.com',
            defaultTimeout: 30000,
            navigationTimeout: 30000
        };
    }

    /**
     * Generate a unique test user with timestamp
     * Uses Gmail + addressing pattern for real email delivery
     */
    generateTestUser() {
        const timestamp = Date.now();
        const randomId = Math.random().toString(36).substring(7);
        const [localPart, domain] = this.config.baseEmail.split('@');
        
        return {
            email: `${localPart}+test_${timestamp}_${randomId}@${domain}`,
            password: 'TestPass123!', // Meets all requirements
            firstName: 'Test',
            lastName: `User_${timestamp}`,
            timestamp,
            randomId
        };
    }

    /**
     * Login with existing credentials
     * Simplified for standard Puppeteer (no MCP-specific patterns)
     */
    async login(page, email, password) {
        console.log(`Logging in as ${email}`);
        
        // Navigate to login page
        await page.goto(`${this.config.authUrl}/login`, {
            waitUntil: 'networkidle2',
            timeout: this.config.navigationTimeout
        });
        
        // Fill login form - simplified for standard Puppeteer
        await page.type('input[name="email"]', email);
        await page.type('input[name="password"]', password);
        
        // Submit form
        await page.click('button[type="submit"]');
        
        // Wait for redirect (Session 130 fix at auth-actions.ts:57)
        await page.waitForNavigation({
            waitUntil: 'networkidle2',
            timeout: this.config.navigationTimeout
        });
        
        const finalUrl = page.url();
        console.log(`Login complete, redirected to: ${finalUrl}`);
        
        return finalUrl;
    }

    /**
     * Sign up a new user
     * Based on sign-up/page.tsx structure
     */
    async signup(page, userData) {
        console.log(`Signing up new user: ${userData.email}`);
        
        // Navigate to sign-up page
        await page.goto(`${this.config.authUrl}/sign-up`, {
            waitUntil: 'networkidle2',
            timeout: this.config.navigationTimeout
        });
        
        // Fill all fields based on sign-up form structure
        await page.type('input[name="email"]', userData.email);
        await page.type('input[name="password"]', userData.password);
        await page.type('input[name="firstName"]', userData.firstName || 'Test');
        await page.type('input[name="lastName"]', userData.lastName || 'User');
        
        // Submit form
        await page.click('button[type="submit"]');
        
        // Wait for redirect to /thank-you (Session 129 discovery)
        await page.waitForNavigation({
            waitUntil: 'networkidle2',
            timeout: this.config.navigationTimeout
        });
        
        const finalUrl = page.url();
        console.log(`Signup complete, redirected to: ${finalUrl}`);
        
        return finalUrl;
    }

    /**
     * Logout from dashboard
     * Based on dashboard sidebar logout button
     */
    async logout(page) {
        console.log('Logging out');
        
        // Look for logout button in sidebar
        const logoutBtn = await page.$('button[aria-label="logout"], button:has-text("Logout"), a[href*="logout"]');
        
        if (logoutBtn) {
            await logoutBtn.click();
            
            // Wait for redirect to auth gateway
            await page.waitForNavigation({
                waitUntil: 'networkidle2',
                timeout: this.config.navigationTimeout
            });
            
            console.log('Logout complete');
            return true;
        }
        
        console.warn('Logout button not found');
        return false;
    }

    /**
     * Wait for dashboard to load after login
     * Verifies user is authenticated and dashboard is ready
     */
    async waitForDashboard(page) {
        console.log('Waiting for dashboard to load');
        
        // Wait for dashboard URL
        await page.waitForFunction(
            url => window.location.href.includes(url),
            { timeout: this.config.defaultTimeout },
            this.config.dashboardUrl
        );
        
        // Wait for key dashboard elements
        await page.waitForSelector('[data-testid="dashboard"], main, .dashboard-container', {
            timeout: this.config.defaultTimeout
        });
        
        console.log('Dashboard loaded successfully');
        return true;
    }

    /**
     * Check if user is authenticated
     * Looks for authentication indicators
     */
    async isAuthenticated(page) {
        try {
            // Check URL is dashboard
            const url = page.url();
            if (!url.includes(this.config.dashboardUrl)) {
                return false;
            }
            
            // Check for user profile or logout button (indicators of auth)
            const authIndicator = await page.$('[data-testid="user-profile"], button[aria-label="logout"], .user-menu');
            return !!authIndicator;
        } catch (error) {
            console.error('Error checking authentication:', error);
            return false;
        }
    }

    /**
     * Get current user info from dashboard
     * Extracts displayed user information
     */
    async getCurrentUser(page) {
        try {
            // Try multiple selectors for user info
            const userInfo = await page.evaluate(() => {
                const nameElement = document.querySelector('[data-testid="user-name"], .user-name, .profile-name');
                const emailElement = document.querySelector('[data-testid="user-email"], .user-email');
                const levelElement = document.querySelector('[data-testid="user-level"], .user-level');
                
                return {
                    name: nameElement ? nameElement.textContent.trim() : null,
                    email: emailElement ? emailElement.textContent.trim() : null,
                    level: levelElement ? levelElement.textContent.trim() : null
                };
            });
            
            return userInfo;
        } catch (error) {
            console.error('Error getting user info:', error);
            return null;
        }
    }

    /**
     * Create and login a new test user
     * Convenience method combining signup and login
     */
    async createAndLoginTestUser(page) {
        const userData = this.generateTestUser();
        
        // Sign up
        await this.signup(page, userData);
        
        // Login with same credentials
        await this.login(page, userData.email, userData.password);
        
        // Wait for dashboard
        await this.waitForDashboard(page);
        
        return userData;
    }
}

module.exports = AuthHelpers;