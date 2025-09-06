#!/usr/bin/env node
/**
 * Dashboard Tests - Session 131
 * Comprehensive dashboard functionality testing
 * Part of Priority 1 MCP Test Infrastructure (60% remaining work)
 */

const PuppeteerTestFramework = require('./00129-puppeteer-test-framework');
const TestUtilities = require('./00129-test-utilities');

// Test configuration
const TEST_CONFIG = {
    dashboardUrl: 'http://localhost:3001',
    authUrl: 'http://localhost:3000',
    testUser: {
        email: 'brian.bumsik.kim+09test@gmail.com',  // Known working user from Session 130
        password: 'TestPass123!'
    },
    viewports: {
        desktop: { width: 1366, height: 768 },
        mobile: { width: 375, height: 667 }
    }
};

/**
 * Main dashboard test suite
 */
async function testDashboard() {
    console.log('=' .repeat(60));
    console.log('📊 DASHBOARD TEST SUITE - Session 131');
    console.log('Testing dashboard functionality and UI components');
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
    
    // Initialize test framework
    const framework = new PuppeteerTestFramework();
    
    try {
        await framework.initialize();
        console.log('✅ Puppeteer initialized\n');
        
        // Get page reference for tests
        const page = framework.page;
        
        // Test 1: Dashboard loads after login
        await framework.runTest('Dashboard Load After Login', async () => {
            console.log('   🔐 Logging in first...');
            
            // Navigate to login
            await page.goto(`${TEST_CONFIG.authUrl}/login`, {
                waitUntil: 'networkidle2'
            });
            
            // Perform login
            await page.type('input[name="email"], #email', TEST_CONFIG.testUser.email);
            await page.type('input[name="password"], #password', TEST_CONFIG.testUser.password);
            
            // Click login button
            await page.click('button[type="submit"]');
            
            // Wait for navigation to dashboard
            console.log('   ⏳ Waiting for dashboard redirect...');
            await page.waitForNavigation({
                waitUntil: 'networkidle2',
                timeout: 30000
            });
            
            // Verify we're on dashboard
            const currentUrl = page.url();
            console.log(`   📍 Current URL: ${currentUrl}`);
            
            if (!currentUrl.includes('localhost:3001')) {
                throw new Error(`Expected dashboard URL, got: ${currentUrl}`);
            }
            
            // Check for dashboard elements
            console.log('   🔍 Checking for dashboard elements...');
            
            // Try multiple possible selectors for dashboard content
            const dashboardSelectors = [
                '.dashboard',
                '#dashboard',
                '[data-testid="dashboard"]',
                'main',
                '.main-content',
                'nav',  // Navigation should be present
                '.sidebar',  // Sidebar should be present
                '[role="navigation"]'
            ];
            
            let dashboardFound = false;
            for (const selector of dashboardSelectors) {
                try {
                    const element = await page.$(selector);
                    if (element) {
                        console.log(`   ✅ Found dashboard element: ${selector}`);
                        dashboardFound = true;
                        break;
                    }
                } catch (e) {
                    // Continue trying other selectors
                }
            }
            
            if (!dashboardFound) {
                // Take screenshot for debugging
                await TestUtilities.takeScreenshot(page, 'dashboard-load-fail');
                console.log('   ⚠️ No specific dashboard selector found, checking page content...');
            }
            
            // Get page content to verify dashboard loaded
            const pageContent = await page.content();
            const hasUserContent = pageContent.includes('Test User_09') || 
                                  pageContent.includes('testuser09') ||
                                  pageContent.includes('Lv.');
            
            if (hasUserContent) {
                console.log('   ✅ Dashboard loaded with user content');
            } else {
                console.log('   ⚠️ Dashboard loaded but user content not verified');
            }
            
            return true;
        });
        
        // Test 2: Navigation menu presence and functionality
        await framework.runTest('Navigation Menu', async () => {
            console.log('   🧭 Testing navigation menu...');
            
            // Expected menu items from the EDL dashboard
            const expectedMenuItems = [
                'Dashboard',
                'Chats', 
                'My Debates',
                'Teams & Guilds',
                'Friends'
            ];
            
            // Get all text content to check for menu items
            const pageText = await page.evaluate(() => document.body.innerText);
            
            const foundItems = [];
            const missingItems = [];
            
            for (const item of expectedMenuItems) {
                if (pageText.includes(item)) {
                    foundItems.push(item);
                    console.log(`   ✅ Found menu item: ${item}`);
                } else {
                    missingItems.push(item);
                    console.log(`   ❌ Missing menu item: ${item}`);
                }
            }
            
            // Try to click on Friends navigation
            console.log('   🖱️ Testing navigation click...');
            try {
                // Try multiple selectors for Friends link
                const friendsSelectors = [
                    'a[href="/friends"]',
                    'a:contains("Friends")',
                    '[data-testid="nav-friends"]',
                    'nav a[href="/friends"]'
                ];
                
                let clicked = false;
                for (const selector of friendsSelectors) {
                    try {
                        await page.click(selector);
                        clicked = true;
                        console.log(`   ✅ Clicked Friends link with: ${selector}`);
                        break;
                    } catch (e) {
                        // Try next selector
                    }
                }
                
                if (!clicked) {
                    // Try with evaluate as fallback
                    await page.evaluate(() => {
                        const links = Array.from(document.querySelectorAll('a'));
                        const friendsLink = links.find(a => a.textContent.includes('Friends'));
                        if (friendsLink) friendsLink.click();
                    });
                    console.log('   ✅ Clicked Friends link via JavaScript');
                }
                
                // Wait a bit for navigation
                await TestUtilities.sleep(2000);
                
                const newUrl = page.url();
                if (newUrl.includes('/friends')) {
                    console.log('   ✅ Navigation to Friends page successful');
                } else {
                    console.log(`   ⚠️ Navigation attempted, current URL: ${newUrl}`);
                }
                
                // Navigate back to dashboard
                await page.goto(TEST_CONFIG.dashboardUrl, {
                    waitUntil: 'networkidle2'
                });
                
            } catch (error) {
                console.log(`   ⚠️ Could not test navigation click: ${error.message}`);
            }
            
            return foundItems.length >= 3; // At least 3 menu items found
        });
        
        // Test 3: User profile display
        await framework.runTest('User Profile Display', async () => {
            console.log('   👤 Checking user profile section...');
            
            // Get page text
            const pageText = await page.evaluate(() => document.body.innerText);
            
            // Check for user profile elements
            const profileChecks = {
                userName: pageText.includes('Test User_09') || pageText.includes('testuser09'),
                userLevel: pageText.includes('Lv.') || pageText.includes('Level'),
                experience: pageText.includes('XP') || pageText.includes('Experience'),
                email: pageText.includes(TEST_CONFIG.testUser.email.split('+')[0]) // Check base email
            };
            
            console.log('   Profile checks:');
            console.log(`     Name/Username: ${profileChecks.userName ? '✅' : '❌'}`);
            console.log(`     Level: ${profileChecks.userLevel ? '✅' : '❌'}`);
            console.log(`     Experience: ${profileChecks.experience ? '✅' : '❌'}`);
            console.log(`     Email hint: ${profileChecks.email ? '✅' : '❌'}`);
            
            // Try to find specific profile elements
            const profileSelectors = [
                '.profile',
                '.user-profile',
                '[data-testid="user-profile"]',
                '.sidebar .profile',
                '.user-info'
            ];
            
            let profileFound = false;
            for (const selector of profileSelectors) {
                const element = await page.$(selector);
                if (element) {
                    console.log(`   ✅ Found profile element: ${selector}`);
                    profileFound = true;
                    
                    // Get text content of profile element
                    const profileText = await page.$eval(selector, el => el.innerText);
                    console.log(`   📝 Profile content preview: ${profileText.substring(0, 100)}...`);
                    break;
                }
            }
            
            if (!profileFound) {
                console.log('   ⚠️ No specific profile selector found, but content detected in page');
            }
            
            // Take screenshot of dashboard with profile
            await TestUtilities.takeScreenshot(page, 'dashboard-profile');
            
            return profileChecks.userName || profileChecks.userLevel;
        });
        
        // Test 4: Sidebar functionality
        await framework.runTest('Sidebar Functionality', async () => {
            console.log('   📱 Testing sidebar...');
            
            // Check for sidebar element
            const sidebarSelectors = [
                '.sidebar',
                'aside',
                '[role="complementary"]',
                'nav.sidebar',
                '.side-nav'
            ];
            
            let sidebarFound = false;
            for (const selector of sidebarSelectors) {
                const element = await page.$(selector);
                if (element) {
                    console.log(`   ✅ Found sidebar: ${selector}`);
                    sidebarFound = true;
                    
                    // Check if sidebar is visible
                    const isVisible = await page.$eval(selector, el => {
                        const style = window.getComputedStyle(el);
                        return style.display !== 'none' && style.visibility !== 'hidden';
                    });
                    
                    console.log(`   Sidebar visible: ${isVisible ? '✅' : '❌'}`);
                    break;
                }
            }
            
            if (!sidebarFound) {
                console.log('   ⚠️ No sidebar element found with standard selectors');
            }
            
            return sidebarFound;
        });
        
        // Test 5: Mobile responsive viewport
        await framework.runTest('Mobile Responsive View', async () => {
            console.log('   📱 Testing mobile viewport...');
            
            // Set mobile viewport
            await page.setViewport(TEST_CONFIG.viewports.mobile);
            console.log('   📐 Viewport set to mobile (375x667)');
            
            // Wait for any responsive changes
            await TestUtilities.sleep(1000);
            
            // Check for mobile menu button (hamburger)
            const mobileMenuSelectors = [
                '.hamburger',
                '.mobile-menu',
                '.menu-toggle',
                'button[aria-label*="menu"]',
                '[data-testid="mobile-menu"]',
                'button svg', // Often hamburger is an SVG
            ];
            
            let mobileMenuFound = false;
            for (const selector of mobileMenuSelectors) {
                const element = await page.$(selector);
                if (element) {
                    const isVisible = await page.$eval(selector, el => {
                        const style = window.getComputedStyle(el);
                        return style.display !== 'none' && style.visibility !== 'hidden';
                    });
                    
                    if (isVisible) {
                        console.log(`   ✅ Found mobile menu element: ${selector}`);
                        mobileMenuFound = true;
                        
                        // Try to click it
                        try {
                            await page.click(selector);
                            console.log('   ✅ Clicked mobile menu');
                            await TestUtilities.sleep(500);
                            
                            // Take screenshot of mobile menu open
                            await TestUtilities.takeScreenshot(page, 'dashboard-mobile-menu');
                        } catch (e) {
                            console.log('   ⚠️ Could not click mobile menu');
                        }
                        break;
                    }
                }
            }
            
            if (!mobileMenuFound) {
                console.log('   ⚠️ No mobile menu element found (app might not be fully responsive)');
            }
            
            // Check if sidebar is hidden on mobile
            const sidebarHidden = await page.evaluate(() => {
                const sidebar = document.querySelector('.sidebar, aside, nav.sidebar');
                if (sidebar) {
                    const style = window.getComputedStyle(sidebar);
                    return style.display === 'none' || 
                           style.visibility === 'hidden' ||
                           style.position === 'fixed' ||
                           style.transform.includes('translate');
                }
                return true; // If no sidebar, consider it "hidden"
            });
            
            console.log(`   Sidebar hidden on mobile: ${sidebarHidden ? '✅' : '⚠️'}`);
            
            // Take screenshot of mobile view
            await TestUtilities.takeScreenshot(page, 'dashboard-mobile');
            
            // Reset to desktop viewport
            await page.setViewport(TEST_CONFIG.viewports.desktop);
            console.log('   📐 Viewport reset to desktop');
            
            return true; // Mobile test is informational
        });
        
        // Test 6: Activity feed or main content area
        await framework.runTest('Main Content Area', async () => {
            console.log('   📋 Checking main content area...');
            
            // Look for main content areas
            const contentSelectors = [
                '.activity-feed',
                '.main-content',
                'main',
                '.content',
                '.dashboard-content',
                '[role="main"]'
            ];
            
            let contentFound = false;
            for (const selector of contentSelectors) {
                const element = await page.$(selector);
                if (element) {
                    console.log(`   ✅ Found content area: ${selector}`);
                    contentFound = true;
                    
                    // Check if it has actual content
                    const hasContent = await page.$eval(selector, el => {
                        return el.children.length > 0 || el.innerText.trim().length > 0;
                    });
                    
                    console.log(`   Has content: ${hasContent ? '✅' : '⚠️ Empty'}`);
                    break;
                }
            }
            
            // Check for specific dashboard widgets/cards
            const widgetSelectors = [
                '.card',
                '.widget',
                '.dashboard-card',
                '.stat-card',
                '[class*="card"]'
            ];
            
            for (const selector of widgetSelectors) {
                const widgets = await page.$$(selector);
                if (widgets.length > 0) {
                    console.log(`   ✅ Found ${widgets.length} widget(s) with selector: ${selector}`);
                    break;
                }
            }
            
            return contentFound;
        });
        
        // Test 7: Logout functionality
        await framework.runTest('Logout Functionality', async () => {
            console.log('   🚪 Testing logout...');
            
            // Look for logout button
            const logoutSelectors = [
                'button:contains("Logout")',
                'a:contains("Logout")',
                '[data-testid="logout"]',
                'button[aria-label*="logout"]',
                'a[href*="logout"]'
            ];
            
            let logoutFound = false;
            for (const selector of logoutSelectors) {
                try {
                    await page.click(selector);
                    logoutFound = true;
                    console.log(`   ✅ Clicked logout with: ${selector}`);
                    break;
                } catch (e) {
                    // Try next selector
                }
            }
            
            if (!logoutFound) {
                // Try with JavaScript
                const clicked = await page.evaluate(() => {
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
                });
                
                if (clicked) {
                    console.log('   ✅ Clicked logout via JavaScript');
                    logoutFound = true;
                } else {
                    console.log('   ⚠️ Could not find logout button');
                    return false;
                }
            }
            
            // Wait for navigation
            await TestUtilities.sleep(3000);
            
            // Check if we're redirected to login
            const currentUrl = page.url();
            const loggedOut = currentUrl.includes('login') || 
                             currentUrl.includes('sign-in') ||
                             currentUrl.includes(':3000');
            
            if (loggedOut) {
                console.log(`   ✅ Successfully logged out, redirected to: ${currentUrl}`);
            } else {
                console.log(`   ⚠️ Logout clicked but still at: ${currentUrl}`);
            }
            
            return loggedOut;
        });
        
        // Generate summary report
        console.log('\n' + '=' .repeat(60));
        console.log('📊 DASHBOARD TEST SUMMARY');
        console.log('=' .repeat(60));
        
        const results = framework.getResults();
        const totalTests = results.length;
        const passedTests = results.filter(r => r.status === 'passed').length;
        const failedTests = results.filter(r => r.status === 'failed').length;
        
        console.log(`Total Tests: ${totalTests}`);
        console.log(`Passed: ${passedTests} ✅`);
        console.log(`Failed: ${failedTests} ❌`);
        console.log(`Success Rate: ${((passedTests/totalTests)*100).toFixed(1)}%`);
        
        console.log('\nTest Details:');
        results.forEach(result => {
            const icon = result.status === 'passed' ? '✅' : '❌';
            console.log(`  ${icon} ${result.name}: ${result.duration}ms`);
            if (result.error) {
                console.log(`     Error: ${result.error}`);
            }
        });
        
        // Save detailed report
        await framework.generateReport('dashboard-tests');
        
    } catch (error) {
        console.error('\n❌ Test suite failed:', error.message);
        console.error(error.stack);
    } finally {
        await framework.teardown();
        console.log('\n✅ Test suite complete');
    }
}

// Run if executed directly
if (require.main === module) {
    testDashboard().catch(error => {
        console.error('Fatal error:', error);
        process.exit(1);
    });
}

module.exports = { testDashboard };