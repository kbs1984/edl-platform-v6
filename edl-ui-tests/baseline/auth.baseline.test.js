/**
 * Authentication Baseline Test
 * Session 133 - Priority 3: Test-First Validation Suite
 * 
 * Establishes ground truth for authentication functionality
 */

const puppeteer = require('puppeteer');
const AuthHelpers = require('../auth-helpers');
const SupabaseValidator = require('../supabase-validator');
const TestCleanup = require('../test-cleanup');

describe('Authentication Baseline Tests', () => {
    let browser;
    let page;
    let authHelpers;
    let validator;
    let cleanup;
    let testResults;
    
    // Track what works and what doesn't
    const baseline = {
        working: [],
        broken: [],
        partial: [],
        notImplemented: [],
        performance: {}
    };
    
    beforeAll(async () => {
        authHelpers = new AuthHelpers();
        validator = new SupabaseValidator();
        cleanup = new TestCleanup();
        cleanup.setDryRun(true); // Don't delete data during baseline
        
        browser = await puppeteer.launch({
            headless: process.env.HEADLESS !== 'false',
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        page = await browser.newPage();
        
        // Set viewport for consistent testing
        await page.setViewport({ width: 1366, height: 768 });
    });
    
    afterAll(async () => {
        if (browser) {
            await browser.close();
        }
        
        // Generate baseline report
        console.log('\n📊 Authentication Baseline Report:');
        console.log('=' .repeat(50));
        console.log('\n✅ Working:');
        baseline.working.forEach(item => console.log(`  - ${item}`));
        console.log('\n❌ Broken:');
        baseline.broken.forEach(item => console.log(`  - ${item}`));
        console.log('\n⚠️ Partial:');
        baseline.partial.forEach(item => console.log(`  - ${item}`));
        console.log('\n🚫 Not Implemented:');
        baseline.notImplemented.forEach(item => console.log(`  - ${item}`));
        console.log('\n⏱️ Performance:');
        Object.entries(baseline.performance).forEach(([key, value]) => {
            console.log(`  - ${key}: ${value}ms`);
        });
    });
    
    describe('Signup Flow', () => {
        test('Student signup page loads', async () => {
            const startTime = Date.now();
            
            try {
                await page.goto('http://localhost:3000/sign-up', {
                    waitUntil: 'networkidle2',
                    timeout: 30000
                });
                
                const title = await page.title();
                const signupForm = await page.$('form');
                
                if (signupForm) {
                    baseline.working.push('Student signup page loads');
                    baseline.performance['signup_page_load'] = Date.now() - startTime;
                } else {
                    baseline.broken.push('Student signup page - no form found');
                }
                
                expect(signupForm).toBeTruthy();
            } catch (error) {
                baseline.broken.push(`Student signup page - ${error.message}`);
                throw error;
            }
        });
        
        test('Student signup form validation', async () => {
            try {
                // Test empty form submission
                const submitButton = await page.$('button[type="submit"]');
                if (submitButton) {
                    await submitButton.click();
                    
                    // Check for validation errors
                    await page.waitForTimeout(1000);
                    const errors = await page.$$('.error, .text-red-500, [role="alert"]');
                    
                    if (errors.length > 0) {
                        baseline.working.push('Form validation on empty submit');
                    } else {
                        baseline.partial.push('Form validation - no visible errors');
                    }
                }
            } catch (error) {
                baseline.broken.push(`Form validation - ${error.message}`);
            }
        });
        
        test('Student signup with valid data', async () => {
            const testUser = authHelpers.generateTestUser();
            const startTime = Date.now();
            
            try {
                await page.goto('http://localhost:3000/sign-up', {
                    waitUntil: 'networkidle2'
                });
                
                // Fill form
                await page.type('input[name="email"]', testUser.email);
                await page.type('input[name="password"]', testUser.password);
                await page.type('input[name="firstName"]', testUser.firstName);
                await page.type('input[name="lastName"]', testUser.lastName);
                
                // Submit
                await page.click('button[type="submit"]');
                
                // Wait for redirect
                await page.waitForNavigation({
                    waitUntil: 'networkidle2',
                    timeout: 10000
                });
                
                const currentUrl = page.url();
                
                if (currentUrl.includes('thank-you')) {
                    baseline.working.push('Student signup flow completes');
                    baseline.performance['signup_complete'] = Date.now() - startTime;
                    
                    // Validate in database
                    const dbUser = await validator.validateUserCreated(testUser.email);
                    if (dbUser) {
                        baseline.working.push('User created in database');
                    } else {
                        baseline.partial.push('User creation - not verified in database');
                    }
                } else {
                    baseline.broken.push(`Signup redirect - went to ${currentUrl}`);
                }
            } catch (error) {
                baseline.broken.push(`Student signup - ${error.message}`);
            }
        });
        
        test('Guardian signup flow', async () => {
            try {
                // Check if guardian option exists
                await page.goto('http://localhost:3000/sign-up');
                
                const guardianOption = await page.$('[data-testid="guardian-option"], input[value="guardian"], label:has-text("Guardian")');
                
                if (guardianOption) {
                    baseline.working.push('Guardian signup option exists');
                    // Test guardian flow...
                } else {
                    baseline.notImplemented.push('Guardian signup option');
                }
            } catch (error) {
                baseline.broken.push(`Guardian signup check - ${error.message}`);
            }
        });
    });
    
    describe('Login Flow', () => {
        let testUser;
        
        beforeAll(async () => {
            // Create a test user for login tests
            testUser = authHelpers.generateTestUser();
            // We assume signup works from previous test
        });
        
        test('Login page loads', async () => {
            const startTime = Date.now();
            
            try {
                await page.goto('http://localhost:3000/login', {
                    waitUntil: 'networkidle2',
                    timeout: 30000
                });
                
                const loginForm = await page.$('form');
                const emailInput = await page.$('input[name="email"]');
                const passwordInput = await page.$('input[name="password"]');
                
                if (loginForm && emailInput && passwordInput) {
                    baseline.working.push('Login page loads with form');
                    baseline.performance['login_page_load'] = Date.now() - startTime;
                } else {
                    baseline.broken.push('Login page - missing form elements');
                }
                
                expect(loginForm).toBeTruthy();
            } catch (error) {
                baseline.broken.push(`Login page - ${error.message}`);
                throw error;
            }
        });
        
        test('Login with invalid credentials', async () => {
            try {
                await page.goto('http://localhost:3000/login');
                
                await page.type('input[name="email"]', 'invalid@example.com');
                await page.type('input[name="password"]', 'wrongpassword');
                await page.click('button[type="submit"]');
                
                // Wait for error message
                await page.waitForTimeout(2000);
                
                const errorMessage = await page.$('.error, .text-red-500, [role="alert"]');
                const currentUrl = page.url();
                
                if (errorMessage && currentUrl.includes('login')) {
                    baseline.working.push('Login error handling');
                } else if (!currentUrl.includes('login')) {
                    baseline.broken.push('Login error - redirected despite invalid credentials');
                } else {
                    baseline.partial.push('Login error - no visible error message');
                }
            } catch (error) {
                baseline.broken.push(`Login error handling - ${error.message}`);
            }
        });
        
        test('Login with valid credentials and redirect', async () => {
            const startTime = Date.now();
            
            try {
                // First create a user
                const testUser = authHelpers.generateTestUser();
                await authHelpers.signup(page, testUser);
                
                // Now try to login
                await page.goto('http://localhost:3000/login');
                await page.type('input[name="email"]', testUser.email);
                await page.type('input[name="password"]', testUser.password);
                await page.click('button[type="submit"]');
                
                // Wait for redirect
                await page.waitForNavigation({
                    waitUntil: 'networkidle2',
                    timeout: 10000
                });
                
                const currentUrl = page.url();
                
                if (currentUrl.includes('localhost:3001')) {
                    baseline.working.push('Login redirects to dashboard');
                    baseline.performance['login_complete'] = Date.now() - startTime;
                } else {
                    baseline.broken.push(`Login redirect - went to ${currentUrl} instead of dashboard`);
                }
            } catch (error) {
                baseline.broken.push(`Login flow - ${error.message}`);
            }
        });
        
        test('Session persistence', async () => {
            try {
                // Refresh page and check if still logged in
                await page.reload();
                await page.waitForTimeout(2000);
                
                const currentUrl = page.url();
                const logoutButton = await page.$('button[aria-label="logout"], a[href*="logout"]');
                
                if (currentUrl.includes('3001') && logoutButton) {
                    baseline.working.push('Session persists after refresh');
                } else if (currentUrl.includes('login')) {
                    baseline.broken.push('Session lost after refresh');
                } else {
                    baseline.partial.push('Session persistence unclear');
                }
            } catch (error) {
                baseline.broken.push(`Session persistence - ${error.message}`);
            }
        });
    });
    
    describe('Logout Flow', () => {
        test('Logout functionality', async () => {
            try {
                const logoutButton = await page.$('button[aria-label="logout"], a[href*="logout"], button:has-text("Logout")');
                
                if (logoutButton) {
                    await logoutButton.click();
                    await page.waitForTimeout(2000);
                    
                    const currentUrl = page.url();
                    
                    if (currentUrl.includes('login') || currentUrl.includes('3000')) {
                        baseline.working.push('Logout redirects to auth gateway');
                    } else {
                        baseline.partial.push(`Logout redirect - went to ${currentUrl}`);
                    }
                } else {
                    baseline.broken.push('Logout button not found');
                }
            } catch (error) {
                baseline.broken.push(`Logout - ${error.message}`);
            }
        });
        
        test('Session cleanup after logout', async () => {
            try {
                // Try to access dashboard after logout
                await page.goto('http://localhost:3001', {
                    waitUntil: 'networkidle2'
                });
                
                const currentUrl = page.url();
                
                if (currentUrl.includes('login') || currentUrl.includes('3000')) {
                    baseline.working.push('Protected routes redirect after logout');
                } else {
                    baseline.broken.push('Can access dashboard after logout');
                }
            } catch (error) {
                baseline.partial.push(`Session cleanup - ${error.message}`);
            }
        });
    });
    
    describe('Password Requirements', () => {
        test('Password validation rules', async () => {
            try {
                await page.goto('http://localhost:3000/sign-up');
                
                // Test weak password
                await page.type('input[name="password"]', '123');
                await page.click('button[type="submit"]');
                await page.waitForTimeout(1000);
                
                const passwordError = await page.$('.error, .text-red-500, [role="alert"]');
                
                if (passwordError) {
                    baseline.working.push('Password strength validation');
                } else {
                    baseline.broken.push('No password validation feedback');
                }
            } catch (error) {
                baseline.broken.push(`Password validation - ${error.message}`);
            }
        });
    });
    
    describe('Password Reset', () => {
        test('Password reset flow', async () => {
            try {
                await page.goto('http://localhost:3000/login');
                
                const resetLink = await page.$('a[href*="reset"], a:has-text("Forgot password")');
                
                if (resetLink) {
                    await resetLink.click();
                    await page.waitForTimeout(2000);
                    
                    const resetForm = await page.$('form');
                    if (resetForm) {
                        baseline.working.push('Password reset page exists');
                    } else {
                        baseline.partial.push('Password reset page - no form');
                    }
                } else {
                    baseline.notImplemented.push('Password reset link');
                }
            } catch (error) {
                baseline.notImplemented.push(`Password reset - ${error.message}`);
            }
        });
    });
});