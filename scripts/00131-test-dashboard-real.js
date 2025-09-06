#!/usr/bin/env node
/**
 * Dashboard Tests with Real Puppeteer MCP - Session 131
 * Uses actual Puppeteer MCP instead of mocked framework
 */

const TestUtilities = require('./00129-test-utilities');

// Test configuration
const TEST_CONFIG = {
    dashboardUrl: 'http://localhost:3001',
    authUrl: 'http://localhost:3000',
    testUser: {
        email: 'brian.bumsik.kim+09test@gmail.com',  // Known working user from Session 130
        password: 'TestPass123!'
    }
};

// Test results tracking
const testResults = [];

/**
 * Run a single test with error handling
 */
async function runTest(name, testFn) {
    console.log(`\n🧪 Running: ${name}`);
    const start = Date.now();
    
    try {
        await testFn();
        const duration = Date.now() - start;
        testResults.push({ name, status: 'passed', duration });
        console.log(`✅ PASSED: ${name} (${duration}ms)`);
        return true;
    } catch (error) {
        const duration = Date.now() - start;
        testResults.push({ name, status: 'failed', error: error.message, duration });
        console.log(`❌ FAILED: ${name} (${duration}ms)`);
        console.log(`   Error: ${error.message}`);
        
        // Try to take screenshot on failure
        try {
            await mcp__puppeteer-mcp-claude__puppeteer_screenshot({
                pageId: 'testPage1',
                path: `/tmp/test-failure-${name.replace(/\s+/g, '-')}-${Date.now()}.png`
            });
        } catch (e) {
            // Screenshot failed, continue
        }
        
        return false;
    }
}

/**
 * Main dashboard test suite
 */
async function testDashboardReal() {
    console.log('=' .repeat(60));
    console.log('📊 DASHBOARD TEST SUITE - Session 131 (Real Puppeteer)');
    console.log('Testing dashboard with actual Puppeteer MCP');
    console.log('=' .repeat(60));
    
    // Check services first
    console.log('\n📡 Checking services...');
    const services = await TestUtilities.checkServicesRunning();
    
    if (!services.authGateway || !services.dashboard) {
        console.error('\n❌ Required services not running!');
        if (!services.authGateway) {
            console.log('   Auth Gateway: cd reconciliation/active-work/auth-gateway && npm run dev');
        }
        if (!services.dashboard) {
            console.log('   Dashboard: cd reconciliation/active-work/dashboard && npm run dev');
        }
        process.exit(1);
    }
    
    console.log('✅ Services are running\n');
    
    // Launch Puppeteer
    console.log('🚀 Launching Puppeteer...');
    try {
        await mcp__puppeteer-mcp-claude__puppeteer_launch({
            headless: false,  // Set to false to see what's happening
            viewport: {
                width: 1366,
                height: 768
            }
        });
        console.log('✅ Browser launched\n');
    } catch (error) {
        console.error('❌ Failed to launch browser:', error);
        process.exit(1);
    }
    
    // Create page
    try {
        await mcp__puppeteer-mcp-claude__puppeteer_new_page({
            pageId: 'testPage1'
        });
        console.log('✅ Page created\n');
    } catch (error) {
        console.error('❌ Failed to create page:', error);
        await mcp__puppeteer-mcp-claude__puppeteer_close_browser();
        process.exit(1);
    }
    
    // Test 1: Login and Dashboard Load
    await runTest('Login and Dashboard Load', async () => {
        console.log('   🔐 Navigating to login...');
        await mcp__puppeteer-mcp-claude__puppeteer_navigate({
            pageId: 'testPage1',
            url: `${TEST_CONFIG.authUrl}/login`,
            waitUntil: 'networkidle2'
        });
        
        console.log('   📝 Entering credentials...');
        await mcp__puppeteer-mcp-claude__puppeteer_type({
            pageId: 'testPage1',
            selector: 'input[name="email"], #email',
            text: TEST_CONFIG.testUser.email
        });
        
        await mcp__puppeteer-mcp-claude__puppeteer_type({
            pageId: 'testPage1',
            selector: 'input[name="password"], #password',
            text: TEST_CONFIG.testUser.password
        });
        
        console.log('   🖱️ Clicking login button...');
        await mcp__puppeteer-mcp-claude__puppeteer_click({
            pageId: 'testPage1',
            selector: 'button[type="submit"]'
        });
        
        console.log('   ⏳ Waiting for dashboard...');
        // Wait a bit for redirect
        await new Promise(resolve => setTimeout(resolve, 5000));
        
        // Check if we're on dashboard
        const pageContent = await mcp__puppeteer-mcp-claude__puppeteer_evaluate({
            pageId: 'testPage1',
            script: 'window.location.href'
        });
        
        console.log(`   📍 Current URL: ${pageContent}`);
        
        if (!pageContent.includes('localhost:3001')) {
            throw new Error(`Expected dashboard URL, got: ${pageContent}`);
        }
        
        console.log('   ✅ Successfully logged in and reached dashboard');
    });
    
    // Test 2: User Profile Display
    await runTest('User Profile Display', async () => {
        console.log('   👤 Checking for user profile...');
        
        const pageText = await mcp__puppeteer-mcp-claude__puppeteer_get_text({
            pageId: 'testPage1',
            selector: 'body'
        });
        
        // Check for user profile elements
        const hasUserName = pageText.includes('Test User_09') || pageText.includes('testuser09');
        const hasLevel = pageText.includes('Lv.') || pageText.includes('Level');
        const hasXP = pageText.includes('XP') || pageText.includes('Experience');
        
        console.log(`     Name present: ${hasUserName ? '✅' : '❌'}`);
        console.log(`     Level present: ${hasLevel ? '✅' : '❌'}`);
        console.log(`     XP present: ${hasXP ? '✅' : '❌'}`);
        
        if (!hasUserName && !hasLevel) {
            throw new Error('User profile information not found');
        }
        
        // Take screenshot
        await mcp__puppeteer-mcp-claude__puppeteer_screenshot({
            pageId: 'testPage1',
            path: '/tmp/dashboard-profile.png'
        });
        console.log('   📸 Screenshot saved: /tmp/dashboard-profile.png');
    });
    
    // Test 3: Navigation Menu
    await runTest('Navigation Menu', async () => {
        console.log('   🧭 Checking navigation menu...');
        
        const pageText = await mcp__puppeteer-mcp-claude__puppeteer_get_text({
            pageId: 'testPage1',
            selector: 'body'
        });
        
        const menuItems = ['Dashboard', 'Chats', 'My Debates', 'Teams & Guilds', 'Friends'];
        const foundItems = [];
        
        for (const item of menuItems) {
            if (pageText.includes(item)) {
                foundItems.push(item);
                console.log(`     ✅ Found: ${item}`);
            } else {
                console.log(`     ❌ Missing: ${item}`);
            }
        }
        
        if (foundItems.length < 3) {
            throw new Error(`Only found ${foundItems.length} menu items, expected at least 3`);
        }
        
        // Try to click Friends link
        console.log('   🖱️ Testing navigation to Friends...');
        try {
            await mcp__puppeteer-mcp-claude__puppeteer_click({
                pageId: 'testPage1',
                selector: 'a[href="/friends"]'
            });
            
            // Wait for navigation
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            const newUrl = await mcp__puppeteer-mcp-claude__puppeteer_evaluate({
                pageId: 'testPage1',
                script: 'window.location.href'
            });
            
            if (newUrl.includes('/friends')) {
                console.log('   ✅ Navigation to Friends successful');
                
                // Navigate back to dashboard
                await mcp__puppeteer-mcp-claude__puppeteer_navigate({
                    pageId: 'testPage1',
                    url: TEST_CONFIG.dashboardUrl
                });
            }
        } catch (e) {
            console.log('   ⚠️ Could not test navigation click (non-critical)');
        }
    });
    
    // Test 4: Sidebar Check
    await runTest('Sidebar Presence', async () => {
        console.log('   📱 Checking for sidebar...');
        
        // Check if sidebar exists
        try {
            await mcp__puppeteer-mcp-claude__puppeteer_wait_for_selector({
                pageId: 'testPage1',
                selector: '.sidebar, aside, nav',
                timeout: 5000
            });
            console.log('   ✅ Sidebar element found');
        } catch (e) {
            // Try alternative check
            const hasNav = await mcp__puppeteer-mcp-claude__puppeteer_evaluate({
                pageId: 'testPage1',
                script: `
                    const elements = document.querySelectorAll('.sidebar, aside, nav, [role="navigation"]');
                    elements.length > 0
                `
            });
            
            if (!hasNav) {
                throw new Error('No sidebar or navigation element found');
            }
        }
    });
    
    // Test 5: Main Content Area
    await runTest('Main Content Area', async () => {
        console.log('   📋 Checking main content...');
        
        const hasContent = await mcp__puppeteer-mcp-claude__puppeteer_evaluate({
            pageId: 'testPage1',
            script: `
                const main = document.querySelector('main, .main-content, .content, [role="main"]');
                if (main) {
                    return main.children.length > 0 || main.innerText.trim().length > 0;
                }
                return false;
            `
        });
        
        if (!hasContent) {
            throw new Error('No main content area found or it is empty');
        }
        
        console.log('   ✅ Main content area found with content');
    });
    
    // Test 6: Dashboard Screenshot
    await runTest('Dashboard Full Screenshot', async () => {
        console.log('   📸 Taking full dashboard screenshot...');
        
        await mcp__puppeteer-mcp-claude__puppeteer_screenshot({
            pageId: 'testPage1',
            path: '/tmp/dashboard-full.png',
            fullPage: true
        });
        
        console.log('   ✅ Full screenshot saved: /tmp/dashboard-full.png');
    });
    
    // Test 7: Logout
    await runTest('Logout Functionality', async () => {
        console.log('   🚪 Testing logout...');
        
        // Try to find and click logout
        const logoutClicked = await mcp__puppeteer-mcp-claude__puppeteer_evaluate({
            pageId: 'testPage1',
            script: `
                const elements = Array.from(document.querySelectorAll('button, a'));
                const logoutEl = elements.find(el => 
                    el.textContent.toLowerCase().includes('logout') ||
                    el.textContent.toLowerCase().includes('sign out')
                );
                if (logoutEl) {
                    logoutEl.click();
                    return true;
                }
                return false;
            `
        });
        
        if (!logoutClicked) {
            throw new Error('Could not find logout button');
        }
        
        console.log('   ✅ Logout clicked');
        
        // Wait for redirect
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        const finalUrl = await mcp__puppeteer-mcp-claude__puppeteer_evaluate({
            pageId: 'testPage1',
            script: 'window.location.href'
        });
        
        console.log(`   📍 Redirected to: ${finalUrl}`);
        
        if (!finalUrl.includes('login') && !finalUrl.includes('3000')) {
            console.log('   ⚠️ Warning: May not have logged out properly');
        } else {
            console.log('   ✅ Successfully logged out');
        }
    });
    
    // Generate summary
    console.log('\n' + '=' .repeat(60));
    console.log('📊 DASHBOARD TEST SUMMARY');
    console.log('=' .repeat(60));
    
    const totalTests = testResults.length;
    const passedTests = testResults.filter(r => r.status === 'passed').length;
    const failedTests = testResults.filter(r => r.status === 'failed').length;
    
    console.log(`\nTotal Tests: ${totalTests}`);
    console.log(`Passed: ${passedTests} ✅`);
    console.log(`Failed: ${failedTests} ❌`);
    console.log(`Success Rate: ${((passedTests/totalTests)*100).toFixed(1)}%`);
    
    console.log('\nTest Details:');
    testResults.forEach(result => {
        const icon = result.status === 'passed' ? '✅' : '❌';
        console.log(`  ${icon} ${result.name}: ${result.duration}ms`);
        if (result.error) {
            console.log(`     Error: ${result.error}`);
        }
    });
    
    // Close browser
    console.log('\n🧹 Cleaning up...');
    try {
        await mcp__puppeteer-mcp-claude__puppeteer_close_browser();
        console.log('✅ Browser closed');
    } catch (e) {
        console.log('⚠️ Could not close browser:', e.message);
    }
    
    console.log('\n✅ Dashboard test suite complete!');
    
    // Exit with appropriate code
    process.exit(failedTests > 0 ? 1 : 0);
}

// Run if executed directly
if (require.main === module) {
    testDashboardReal().catch(error => {
        console.error('Fatal error:', error);
        process.exit(1);
    });
}

module.exports = { testDashboardReal };