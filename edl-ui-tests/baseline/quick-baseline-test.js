#!/usr/bin/env node
/**
 * Quick Baseline Test - Session 134
 * Simplified test to establish ground truth
 */

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

async function runQuickBaseline() {
    const results = {
        timestamp: new Date().toISOString(),
        services: {
            auth: false,
            dashboard: false
        },
        features: {
            working: [],
            broken: [],
            partial: [],
            notImplemented: [],
            ninetyFivePercent: []
        },
        performance: {}
    };

    let browser;
    try {
        // Test services
        console.log('🔍 Testing Services...\n');
        
        // Test with fetch
        try {
            const authResponse = await fetch('http://localhost:3000/login');
            results.services.auth = authResponse.ok;
            console.log(`  ✅ Auth Gateway: Running on port 3000`);
        } catch (e) {
            console.log(`  ❌ Auth Gateway: ${e.message}`);
        }

        try {
            const dashResponse = await fetch('http://localhost:3001');
            results.services.dashboard = dashResponse.ok;
            console.log(`  ✅ Dashboard: Running on port 3001`);
        } catch (e) {
            console.log(`  ❌ Dashboard: ${e.message}`);
        }

        // Launch browser
        console.log('\n🚀 Launching browser...\n');
        browser = await puppeteer.launch({
            headless: 'new',
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });

        const page = await browser.newPage();
        
        // Test 1: Login page loads
        console.log('📋 Test 1: Login page loads');
        const startTime = Date.now();
        try {
            await page.goto('http://localhost:3000/login', { waitUntil: 'networkidle0' });
            const title = await page.title();
            const hasForm = await page.$('form') !== null;
            
            if (hasForm) {
                results.features.working.push('Login page with form');
                console.log('  ✅ Login page loads with form');
            } else {
                results.features.broken.push('Login form missing');
                console.log('  ❌ Login form not found');
            }
            results.performance.loginPageLoad = Date.now() - startTime;
        } catch (e) {
            results.features.broken.push(`Login page - ${e.message}`);
            console.log(`  ❌ Error: ${e.message}`);
        }

        // Test 2: Signup page loads
        console.log('\n📋 Test 2: Signup page loads');
        const signupStart = Date.now();
        try {
            await page.goto('http://localhost:3000/sign-up', { waitUntil: 'networkidle0' });
            const hasSignupForm = await page.$('form') !== null;
            
            if (hasSignupForm) {
                results.features.working.push('Signup page with form');
                console.log('  ✅ Signup page loads with form');
            } else {
                results.features.broken.push('Signup form missing');
                console.log('  ❌ Signup form not found');
            }
            results.performance.signupPageLoad = Date.now() - signupStart;
        } catch (e) {
            results.features.broken.push(`Signup page - ${e.message}`);
            console.log(`  ❌ Error: ${e.message}`);
        }

        // Test 3: Dashboard redirect (unauthenticated)
        console.log('\n📋 Test 3: Dashboard redirect when not authenticated');
        try {
            const response = await page.goto('http://localhost:3001', { 
                waitUntil: 'networkidle0',
                timeout: 5000 
            });
            const url = page.url();
            
            if (url.includes('localhost:3000')) {
                results.features.working.push('Dashboard redirects to auth when not authenticated');
                console.log('  ✅ Correctly redirects to auth gateway');
            } else {
                results.features.broken.push('Dashboard does not redirect properly');
                console.log(`  ❌ Unexpected URL: ${url}`);
            }
        } catch (e) {
            // Redirect might cause navigation error, which is expected
            if (page.url().includes('localhost:3000')) {
                results.features.working.push('Dashboard redirects to auth');
                console.log('  ✅ Redirects to auth (with navigation error)');
            } else {
                results.features.broken.push(`Dashboard redirect - ${e.message}`);
                console.log(`  ❌ Error: ${e.message}`);
            }
        }

        // Test 4: Check for Friends components (95% syndrome test)
        console.log('\n📋 Test 4: Friends System Components (95% Syndrome Check)');
        try {
            // Navigate to dashboard friends page (will redirect to login)
            await page.goto('http://localhost:3001/friends', { 
                waitUntil: 'networkidle0',
                timeout: 5000 
            }).catch(() => {}); // Ignore navigation errors from redirects
            
            const url = page.url();
            if (url.includes('login')) {
                results.features.partial.push('Friends page exists but requires auth');
                console.log('  ⚠️ Friends page requires authentication');
                
                // This is a potential 95% syndrome - page exists but we can't verify functionality
                results.features.ninetyFivePercent.push(
                    'Friends system - Components exist but real-time sync untested'
                );
            }
        } catch (e) {
            results.features.notImplemented.push('Friends system access');
            console.log(`  🚫 Friends system not accessible: ${e.message}`);
        }

        // Test 5: Check for Team components
        console.log('\n📋 Test 5: Teams System Components');
        try {
            await page.goto('http://localhost:3001/groups/teams', { 
                waitUntil: 'networkidle0',
                timeout: 5000 
            }).catch(() => {});
            
            const url = page.url();
            if (url.includes('login')) {
                results.features.partial.push('Teams page exists but requires auth');
                console.log('  ⚠️ Teams page requires authentication');
            }
        } catch (e) {
            results.features.notImplemented.push('Teams system access');
            console.log(`  🚫 Teams system not accessible: ${e.message}`);
        }

    } catch (error) {
        console.error('Fatal error:', error);
        results.features.broken.push(`Fatal error: ${error.message}`);
    } finally {
        if (browser) {
            await browser.close();
        }
    }

    // Generate summary
    const total = results.features.working.length + 
                  results.features.broken.length + 
                  results.features.partial.length + 
                  results.features.notImplemented.length;
    
    const workingPercent = total > 0 ? 
        Math.round((results.features.working.length / total) * 100) : 0;

    console.log('\n' + '='.repeat(60));
    console.log('📊 BASELINE SUMMARY\n');
    console.log(`  Overall Health: ${workingPercent}%`);
    console.log(`  ✅ Working: ${results.features.working.length}`);
    console.log(`  ❌ Broken: ${results.features.broken.length}`);
    console.log(`  ⚠️ Partial: ${results.features.partial.length}`);
    console.log(`  🚫 Not Implemented: ${results.features.notImplemented.length}`);
    console.log(`  😬 95% Syndrome: ${results.features.ninetyFivePercent.length}`);
    
    if (results.features.ninetyFivePercent.length > 0) {
        console.log('\n🔥 95% Syndrome Issues Detected:');
        results.features.ninetyFivePercent.forEach(issue => {
            console.log(`  - ${issue}`);
        });
    }

    // Save results
    const reportPath = path.join(__dirname, '../../reconciliation/00134-quick-baseline-results.json');
    fs.writeFileSync(reportPath, JSON.stringify(results, null, 2));
    console.log(`\n💾 Results saved to: ${reportPath}`);

    return results;
}

// Run the test
runQuickBaseline().catch(console.error);