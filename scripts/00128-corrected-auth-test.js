#!/usr/bin/env node
/**
 * Corrected Auth Flow Test - Using Actual Running Ports
 * Session 128 - Running with ports 3000 (auth) and 3001 (dashboard)
 */

// Import Puppeteer test framework
const PuppeteerTestFramework = require('./00129-puppeteer-test-framework');

// Corrected configuration
const TEST_CONFIG = {
    authGatewayUrl: 'http://localhost:3000',  // Actual auth port
    dashboardUrl: 'http://localhost:3001',    // Actual dashboard port
    testEmailDomain: '@edl-test.local',
    testUserPrefix: 'test_auto_'
};

// Generate test user
function generateTestUser() {
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(2, 8);
    return {
        email: `${TEST_CONFIG.testUserPrefix}${timestamp}_${randomStr}${TEST_CONFIG.testEmailDomain}`,
        password: 'TestPass123!',
        firstName: 'Test',
        lastName: `User_${timestamp}`
    };
}

async function runCorrectedAuthTest() {
    console.log('🎯 CORRECTED AUTH JOURNEY TEST');
    console.log('Using actual running ports:');
    console.log(`  Auth Gateway: ${TEST_CONFIG.authGatewayUrl}`);
    console.log(`  Dashboard: ${TEST_CONFIG.dashboardUrl}`);
    console.log('=' .repeat(60));
    
    // Check services are actually running
    console.log('\n📡 Checking services...');
    const { exec } = require('child_process');
    const util = require('util');
    const execPromise = util.promisify(exec);
    
    try {
        await execPromise('curl -s http://localhost:3000');
        console.log('✅ Auth gateway running on port 3000');
    } catch (error) {
        console.error('❌ Auth gateway not responding on port 3000');
        return false;
    }
    
    try {
        await execPromise('curl -s http://localhost:3001');
        console.log('✅ Dashboard running on port 3001');
    } catch (error) {
        console.error('❌ Dashboard not responding on port 3001');
        return false;
    }
    
    console.log('✅ Services are running\n');
    
    // Initialize test framework
    const framework = new PuppeteerTestFramework();
    
    try {
        // Initialize browser using MCP
        console.log('🚀 Launching browser via Puppeteer MCP...');
        await framework.initialize();
        console.log('✅ Browser launched successfully\n');
        
        // Create new page
        const pageId = 'authTestPage';
        await framework.createPage(pageId);
        const page = framework.pages[pageId];
        
        if (!page) {
            throw new Error('Failed to create page');
        }
        
        // Generate test user
        const testUser = generateTestUser();
        console.log(`👤 Test user: ${testUser.email}\n`);
        
        const results = [];
        
        // Test 1: Navigate to signup page
        console.log('🧪 Test 1: Navigate to Signup Page');
        try {
            await page.goto(`${TEST_CONFIG.authGatewayUrl}/sign-up`, {
                waitUntil: 'networkidle2',
                timeout: 30000
            });
            
            const url = page.url();
            console.log(`   Current URL: ${url}`);
            
            if (url.includes('sign-up') || url.includes('signup')) {
                console.log('✅ PASSED: Successfully navigated to signup page\n');
                results.push({ test: 'Navigate to Signup', status: 'passed' });
            } else {
                throw new Error(`Unexpected URL: ${url}`);
            }
        } catch (error) {
            console.error(`❌ FAILED: ${error.message}\n`);
            results.push({ test: 'Navigate to Signup', status: 'failed', error: error.message });
            
            // Take screenshot on failure
            await page.screenshot({ 
                path: `/tmp/auth-test-failure-signup-nav-${Date.now()}.png`,
                fullPage: true 
            });
        }
        
        // Test 2: Fill signup form and submit
        console.log('🧪 Test 2: Create New Account');
        try {
            // Wait for form elements
            await page.waitForSelector('input[name="email"], input[type="email"]', { timeout: 5000 });
            
            // Find and fill email field
            const emailSelector = await page.evaluate(() => {
                const emailInput = document.querySelector('input[name="email"]') || 
                                  document.querySelector('input[type="email"]');
                return emailInput ? (emailInput.name ? `input[name="${emailInput.name}"]` : 'input[type="email"]') : null;
            });
            
            if (!emailSelector) {
                throw new Error('Email input not found');
            }
            
            await page.type(emailSelector, testUser.email, { delay: 50 });
            console.log(`   Entered email: ${testUser.email}`);
            
            // Find and fill password field
            const passwordSelector = await page.evaluate(() => {
                const passInput = document.querySelector('input[name="password"]') || 
                                 document.querySelector('input[type="password"]');
                return passInput ? (passInput.name ? `input[name="${passInput.name}"]` : 'input[type="password"]') : null;
            });
            
            if (!passwordSelector) {
                throw new Error('Password input not found');
            }
            
            await page.type(passwordSelector, testUser.password, { delay: 50 });
            console.log(`   Entered password: ********`);
            
            // Find and click submit button
            const submitButton = await page.evaluate(() => {
                const buttons = Array.from(document.querySelectorAll('button'));
                const submitBtn = buttons.find(btn => 
                    btn.type === 'submit' || 
                    btn.textContent.toLowerCase().includes('sign up') ||
                    btn.textContent.toLowerCase().includes('create')
                );
                return submitBtn ? buttons.indexOf(submitBtn) : -1;
            });
            
            if (submitButton === -1) {
                throw new Error('Submit button not found');
            }
            
            // Click submit and wait for navigation
            const buttons = await page.$$('button');
            await buttons[submitButton].click();
            console.log('   Clicked submit button');
            
            // Wait for navigation or error message
            await page.waitForNavigation({ 
                waitUntil: 'networkidle2',
                timeout: 10000 
            }).catch(() => {
                console.log('   No navigation occurred, checking for errors...');
            });
            
            const newUrl = page.url();
            console.log(`   New URL: ${newUrl}`);
            
            // Check if we're on dashboard or still on signup (error)
            if (newUrl.includes('dashboard') || newUrl.includes('onboarding')) {
                console.log('✅ PASSED: Account created successfully\n');
                results.push({ test: 'Create Account', status: 'passed' });
            } else if (newUrl.includes('sign-up') || newUrl.includes('signup')) {
                // Check for error messages
                const errorText = await page.evaluate(() => {
                    const errors = document.querySelectorAll('.error, .alert, [role="alert"]');
                    return Array.from(errors).map(e => e.textContent).join(' ');
                });
                throw new Error(`Signup failed. Still on signup page. Errors: ${errorText}`);
            } else {
                console.log(`⚠️ Unexpected redirect to: ${newUrl}`);
                results.push({ test: 'Create Account', status: 'partial', note: `Redirected to ${newUrl}` });
            }
        } catch (error) {
            console.error(`❌ FAILED: ${error.message}\n`);
            results.push({ test: 'Create Account', status: 'failed', error: error.message });
            
            // Take screenshot on failure
            await page.screenshot({ 
                path: `/tmp/auth-test-failure-signup-${Date.now()}.png`,
                fullPage: true 
            });
        }
        
        // Test 3: Check if on dashboard
        console.log('🧪 Test 3: Verify Dashboard Access');
        try {
            const currentUrl = page.url();
            
            if (currentUrl.includes('dashboard')) {
                // Wait for dashboard content
                await page.waitForSelector('body', { timeout: 5000 });
                
                // Check for dashboard elements
                const hasDashboard = await page.evaluate(() => {
                    const text = document.body.innerText.toLowerCase();
                    return text.includes('dashboard') || 
                           text.includes('welcome') || 
                           text.includes('profile');
                });
                
                if (hasDashboard) {
                    console.log('✅ PASSED: Dashboard loaded successfully\n');
                    results.push({ test: 'Dashboard Access', status: 'passed' });
                } else {
                    throw new Error('Dashboard page loaded but no dashboard content found');
                }
            } else {
                throw new Error(`Not on dashboard. Current URL: ${currentUrl}`);
            }
        } catch (error) {
            console.error(`❌ FAILED: ${error.message}\n`);
            results.push({ test: 'Dashboard Access', status: 'failed', error: error.message });
        }
        
        // Generate summary
        console.log('\n' + '=' .repeat(60));
        console.log('📊 TEST RESULTS SUMMARY');
        console.log('=' .repeat(60));
        
        const passed = results.filter(r => r.status === 'passed').length;
        const failed = results.filter(r => r.status === 'failed').length;
        const partial = results.filter(r => r.status === 'partial').length;
        
        console.log(`✅ Passed: ${passed}`);
        console.log(`❌ Failed: ${failed}`);
        if (partial > 0) console.log(`⚠️ Partial: ${partial}`);
        console.log(`📈 Success Rate: ${(passed / results.length * 100).toFixed(1)}%\n`);
        
        // Detailed results
        console.log('Detailed Results:');
        results.forEach((result, index) => {
            const icon = result.status === 'passed' ? '✅' : 
                        result.status === 'failed' ? '❌' : '⚠️';
            console.log(`${index + 1}. ${icon} ${result.test}: ${result.status.toUpperCase()}`);
            if (result.error) console.log(`   Error: ${result.error}`);
            if (result.note) console.log(`   Note: ${result.note}`);
        });
        
        // Final verdict
        console.log('\n🏁 FINAL VERDICT');
        console.log('=' .repeat(60));
        
        if (failed === 0) {
            console.log('🎉 SUCCESS! All critical tests passed!');
            console.log('✅ Test infrastructure is PROVEN WORKING');
            console.log('✅ Puppeteer MCP integration successful');
            console.log('✅ Basic auth flow works');
            console.log('\n🚀 Ready to expand testing to other features!');
            return true;
        } else if (passed > 0) {
            console.log('⚠️ PARTIAL SUCCESS: Some tests passed');
            console.log('✅ Puppeteer MCP is working');
            console.log('⚠️ Auth flow has issues that need fixing');
            console.log('\nSee screenshots in /tmp/ for debugging');
            return false;
        } else {
            console.log('❌ FAILURE: No tests passed');
            console.log('Check screenshots in /tmp/ for debugging');
            return false;
        }
        
    } catch (error) {
        console.error('\n❌ Critical error:', error.message);
        return false;
    } finally {
        // Clean up
        await framework.teardown();
        console.log('\n✅ Browser closed');
    }
}

// Main execution
if (require.main === module) {
    (async () => {
        try {
            const success = await runCorrectedAuthTest();
            process.exit(success ? 0 : 1);
        } catch (error) {
            console.error('Unexpected error:', error);
            process.exit(1);
        }
    })();
}

module.exports = { runCorrectedAuthTest, TEST_CONFIG };