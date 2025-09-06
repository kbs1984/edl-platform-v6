#!/usr/bin/env node
/**
 * Complete Auth Flow Test - The ONE Critical Test
 * Session 129 - Priority 1 Implementation
 * 
 * If this test passes, the infrastructure is proven!
 */

const PuppeteerTestFramework = require('./00129-puppeteer-test-framework');
const TestUtilities = require('./00129-test-utilities');

/**
 * The ONE test that proves everything works
 * Tests the complete authentication journey:
 * 1. Navigate to signup
 * 2. Create account
 * 3. Verify redirect to dashboard
 * 4. Logout
 * 5. Login again
 * 6. Verify session persists
 */
async function testCompleteAuthJourney() {
    console.log('=' .repeat(60));
    console.log('🎯 COMPLETE AUTH JOURNEY TEST');
    console.log('The ONE test that proves the infrastructure works');
    console.log('=' .repeat(60));
    
    // Check if services are running
    console.log('\n📡 Checking services...');
    const services = await TestUtilities.checkServicesRunning();
    
    if (!services.authGateway) {
        console.error('❌ Auth gateway not running on port 3000');
        console.log('Please start it with:');
        console.log('  cd reconciliation/active-work/auth-gateway && npm run dev');
        return false;
    }
    
    if (!services.dashboard) {
        console.error('❌ Dashboard not running on port 3001');
        console.log('Please start it with:');
        console.log('  cd reconciliation/active-work/dashboard && npm run dev');
        return false;
    }
    
    console.log('✅ Services are running');
    
    // Initialize test framework
    const framework = new PuppeteerTestFramework();
    
    if (!await framework.initialize()) {
        console.error('Failed to initialize test framework');
        return false;
    }
    
    const page = await framework.createPage();
    if (!page) {
        console.error('Failed to create page');
        return false;
    }
    
    // Generate unique test user
    const testUser = TestUtilities.generateTestUser();
    console.log(`\n👤 Test user: ${testUser.email}`);
    
    const results = [];
    
    // Test 1: Navigate to signup page
    results.push(await framework.runTest('Navigate to Signup Page', async (page) => {
        await page.goto(`${TestUtilities.TEST_CONFIG.authGatewayUrl}/sign-up`, {
            waitUntil: 'networkidle2'
        });
        
        const title = await page.title();
        TestUtilities.assert(
            title.toLowerCase().includes('sign') || title.toLowerCase().includes('create'),
            `Should be on signup page, but title is: ${title}`
        );
        
        // Check for email input field
        const emailField = await TestUtilities.checkElementExists(page, 
            'input[name="email"], input[type="email"], #email'
        );
        TestUtilities.assert(emailField, 'Email field should exist');
        
        return { title, emailFieldExists: emailField };
    }));
    
    // Test 2: Create new account
    results.push(await framework.runTest('Create New Account', async (page) => {
        // Fill signup form
        const signupSuccess = await TestUtilities.signup(page, testUser);
        TestUtilities.assert(signupSuccess, 'Signup should succeed');
        
        // Check URL after signup
        const url = page.url();
        TestUtilities.assert(
            url.includes('dashboard') || url.includes('onboarding'),
            `Should redirect after signup, but URL is: ${url}`
        );
        
        return { signupSuccess, redirectUrl: url };
    }));
    
    // Test 3: Verify dashboard loads
    results.push(await framework.runTest('Dashboard Loads After Signup', async (page) => {
        // Wait for dashboard content
        const dashboardExists = await TestUtilities.checkElementExists(page,
            '.dashboard-content, #dashboard, main, [role="main"]',
            10000
        );
        
        if (!dashboardExists) {
            // Take screenshot for debugging
            await TestUtilities.takeScreenshot(page, 'dashboard-not-found');
        }
        
        TestUtilities.assert(dashboardExists, 'Dashboard content should be visible');
        
        // Check for user info or profile indicator
        const userIndicator = await TestUtilities.checkElementExists(page,
            '[data-testid="user-profile"], .user-profile, .user-info, .avatar',
            5000
        );
        
        return { 
            dashboardLoaded: dashboardExists,
            userIndicatorFound: userIndicator 
        };
    }));
    
    // Test 4: Logout
    results.push(await framework.runTest('Logout from Dashboard', async (page) => {
        try {
            const logoutSuccess = await TestUtilities.logout(page);
            TestUtilities.assert(logoutSuccess, 'Should redirect to login after logout');
            
            // Verify we're on login page
            const url = page.url();
            TestUtilities.assert(
                url.includes('login') || url.includes('sign-in'),
                `Should be on login page after logout, but URL is: ${url}`
            );
            
            return { logoutSuccess, loginPageUrl: url };
        } catch (error) {
            // If logout button not found, take screenshot
            await TestUtilities.takeScreenshot(page, 'logout-button-not-found');
            throw error;
        }
    }));
    
    // Test 5: Login with created account
    results.push(await framework.runTest('Login with Created Account', async (page) => {
        const loginSuccess = await TestUtilities.login(page, testUser.email, testUser.password);
        TestUtilities.assert(loginSuccess, 'Login should succeed with created account');
        
        // Verify redirect to dashboard
        const url = page.url();
        TestUtilities.assert(
            url.includes('dashboard') || !url.includes('login'),
            `Should redirect to dashboard after login, but URL is: ${url}`
        );
        
        return { loginSuccess, dashboardUrl: url };
    }));
    
    // Test 6: Session persistence
    results.push(await framework.runTest('Session Persists After Reload', async (page) => {
        // Reload the page
        await page.reload({ waitUntil: 'networkidle2' });
        
        // Check if still on dashboard (not redirected to login)
        const url = page.url();
        const stillLoggedIn = url.includes('dashboard') || !url.includes('login');
        
        TestUtilities.assert(
            stillLoggedIn,
            `Session should persist after reload, but URL is: ${url}`
        );
        
        // Check for dashboard content
        const dashboardStillVisible = await TestUtilities.checkElementExists(page,
            '.dashboard-content, #dashboard, main, [role="main"]',
            5000
        );
        
        return { 
            sessionPersisted: stillLoggedIn,
            dashboardVisible: dashboardStillVisible 
        };
    }));
    
    // Teardown and generate report
    await framework.teardown();
    
    // Calculate results
    const passed = results.filter(r => r.status === 'passed').length;
    const failed = results.filter(r => r.status === 'failed').length;
    const successRate = (passed / results.length * 100).toFixed(1);
    
    // Display final verdict
    console.log('\n' + '=' .repeat(60));
    console.log('🏁 FINAL VERDICT');
    console.log('=' .repeat(60));
    
    if (failed === 0) {
        console.log('🎉 SUCCESS! All tests passed!');
        console.log('✅ Test infrastructure is PROVEN WORKING');
        console.log('✅ Puppeteer MCP integration successful');
        console.log('✅ Auth flow works end-to-end');
        console.log('\n🚀 Ready to expand testing to other features!');
        return true;
    } else {
        console.log('⚠️ PARTIAL SUCCESS');
        console.log(`✅ ${passed}/${results.length} tests passed (${successRate}%)`);
        console.log(`❌ ${failed} test(s) failed`);
        console.log('\nFailed tests need investigation:');
        
        results
            .filter(r => r.status === 'failed')
            .forEach(r => {
                console.log(`  - ${r.test}`);
                console.log(`    Error: ${r.error}`);
                if (r.screenshot) {
                    console.log(`    Screenshot: ${r.screenshot}`);
                }
            });
        
        console.log('\n📋 Next steps:');
        console.log('1. Review screenshots in /tmp/');
        console.log('2. Check service logs for errors');
        console.log('3. Verify database has auth tables');
        console.log('4. Try manual testing to understand failures');
        
        return false;
    }
}

/**
 * Cleanup test data after tests
 */
async function cleanupTestData() {
    console.log('\n🧹 Cleaning up test data...');
    
    try {
        // Note: In real implementation, this would use mcp__supabase-dev__execute_sql
        const queries = [
            `DELETE FROM profile WHERE email LIKE '%@edl-test.local'`,
            `DELETE FROM student WHERE user_id IN (
                SELECT id FROM auth.users WHERE email LIKE '%@edl-test.local'
            )`,
            `DELETE FROM friendship WHERE user_id IN (
                SELECT id FROM auth.users WHERE email LIKE '%@edl-test.local'
            )`,
            `DELETE FROM team_member WHERE user_id IN (
                SELECT id FROM auth.users WHERE email LIKE '%@edl-test.local'
            )`,
            `DELETE FROM auth.users WHERE email LIKE '%@edl-test.local'`
        ];
        
        console.log(`Would clean ${queries.length} tables of test data`);
        // queries.forEach(q => console.log(`  - ${q.substring(0, 50)}...`));
        
        return true;
    } catch (error) {
        console.error('⚠️ Cleanup failed:', error.message);
        return false;
    }
}

// Main execution
if (require.main === module) {
    (async () => {
        try {
            const testSuccess = await testCompleteAuthJourney();
            
            if (testSuccess) {
                await cleanupTestData();
                console.log('\n✅ Test suite completed successfully!');
                process.exit(0);
            } else {
                console.log('\n❌ Test suite completed with failures');
                process.exit(1);
            }
        } catch (error) {
            console.error('\n💥 Unexpected error:', error);
            console.error(error.stack);
            process.exit(2);
        }
    })();
}

// Export for use in other test suites
module.exports = {
    testCompleteAuthJourney,
    cleanupTestData
};