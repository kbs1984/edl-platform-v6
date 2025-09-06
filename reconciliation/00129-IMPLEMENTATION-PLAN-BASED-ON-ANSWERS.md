---
session: "00129"
type: "implementation-plan"
status: "ready"
created: "2025-09-01"
title: "Session 129 Implementation Plan - Puppeteer MCP and Test Infrastructure"
purpose: "Execute Priority 1 based on Session 128's clarifications"
topics: ["puppeteer", "testing", "mcp", "implementation"]
priority: "P0"
domain: "reconciliation"
implements: ["00128-PRIORITY-1-MCP-TEST-INFRASTRUCTURE-PLAN"]
based_on: ["00128-ANSWERS-FOR-SESSION-129"]
---

# Session 129 Implementation Plan - Puppeteer MCP and Test Infrastructure

## Key Discoveries from Validation

### ✅ VERIFIED: The 275 User Stories ARE Real!
```bash
# Actual count command that works:
grep -r "US-[0-9]" requirements/ | cut -d: -f2 | grep -o "US-[0-9]*" | sort -u | wc -l
# Result: 275

# They're distributed across:
- P0-ACTIVITY-RUNTIME-STORIES.md (63 stories)
- P0-AUTHENTICATION-STORIES.md
- P0-DASHBOARD-PROFILE-STORIES.md
- P1-ACTIVITY-REGISTRAR-STORIES.md
- P1-BADGE-STORIES.md
- P2-RESOURCE-STORIES.md
- And more...
```

### Canvas Files Located
- **Path**: `requirements/canvas-requirements/canvas-analysis/`
- **Count**: 12 JSON files
- **Purpose**: Visual wireframes that informed the US-XXX stories

### Session 128's Critical Guidance
1. **Fix Puppeteer FIRST** - Everything depends on it
2. **Focus on 50 P0 stories** - Not all 275 at once
3. **Don't rename connector.py** - Create new mcp_connector.py alongside
4. **Use test email pattern** - `test_auto_*@edl-test.local`

## Implementation Steps

### Step 1: Fix Puppeteer MCP Dependencies (30 minutes)

#### 1.1 Install Missing Libraries
```bash
sudo apt-get update && sudo apt-get install -y \
    libnspr4 \
    libnss3 \
    libatk1.0-0 \
    libatk-bridge2.0-0 \
    libcups2 \
    libdrm2 \
    libxkbcommon0 \
    libxcomposite1 \
    libxdamage1 \
    libxrandr2 \
    libgbm1 \
    libasound2
```

#### 1.2 Verify Puppeteer Launches
```javascript
// Test using MCP tool
await mcp__puppeteer-mcp-claude__puppeteer_launch({
    headless: true
});

// If successful, create verification file
echo "Puppeteer MCP verified: $(date)" > /tmp/puppeteer-verified.txt
```

### Step 2: Create Minimal Test Framework (2 hours)

#### 2.1 Core Framework Structure
```javascript
// File: scripts/00129-puppeteer-test-framework.js
const PuppeteerTestFramework = {
    browser: null,
    page: null,
    
    async initialize() {
        // Use MCP to launch browser
        this.browser = await mcp__puppeteer-mcp-claude__puppeteer_launch({
            headless: true,
            viewport: { width: 1366, height: 768 }
        });
        return this.browser;
    },
    
    async runTest(testName, testFunction) {
        console.log(`Running: ${testName}`);
        try {
            const result = await testFunction(this.page);
            console.log(`✅ PASSED: ${testName}`);
            return { test: testName, status: 'passed', result };
        } catch (error) {
            console.log(`❌ FAILED: ${testName}`);
            await this.captureFailure(testName, error);
            return { test: testName, status: 'failed', error: error.message };
        }
    },
    
    async captureFailure(testName, error) {
        const timestamp = Date.now();
        const screenshotPath = `/tmp/test-failure-${timestamp}.png`;
        
        if (this.page) {
            await this.page.screenshot({ 
                path: screenshotPath, 
                fullPage: true 
            });
        }
        
        // Log failure details
        const failureLog = {
            test: testName,
            error: error.message,
            stack: error.stack,
            screenshot: screenshotPath,
            timestamp: new Date().toISOString()
        };
        
        console.error('Failure captured:', failureLog);
        return failureLog;
    },
    
    async teardown() {
        if (this.browser) {
            await this.browser.close();
        }
    }
};
```

#### 2.2 Test Utilities
```javascript
// File: scripts/00129-test-utilities.js
const TEST_CONFIG = {
    authGatewayUrl: 'http://localhost:3001',
    dashboardUrl: 'http://localhost:3002',
    testEmailDomain: '@edl-test.local',
    testUserPrefix: 'test_auto_'
};

const TestUtilities = {
    generateTestUser() {
        const timestamp = Date.now();
        return {
            email: `${TEST_CONFIG.testUserPrefix}${timestamp}${TEST_CONFIG.testEmailDomain}`,
            password: 'TestPass123!',
            firstName: 'Test',
            lastName: `User_${timestamp}`
        };
    },
    
    async navigateToAuth(page) {
        await page.goto(TEST_CONFIG.authGatewayUrl);
        await page.waitForSelector('body');
    },
    
    async login(page, email, password) {
        await page.goto(`${TEST_CONFIG.authGatewayUrl}/login`);
        await page.type('input[name="email"]', email);
        await page.type('input[name="password"]', password);
        await page.click('button[type="submit"]');
        await page.waitForNavigation();
    },
    
    async signup(page, userData) {
        await page.goto(`${TEST_CONFIG.authGatewayUrl}/sign-up`);
        await page.type('input[name="email"]', userData.email);
        await page.type('input[name="password"]', userData.password);
        await page.click('button[type="submit"]');
        await page.waitForNavigation();
    }
};
```

### Step 3: The ONE Critical Test - Auth Flow (1 hour)

```javascript
// File: scripts/00129-test-auth-flow.js
async function testCompleteAuthJourney() {
    const framework = new PuppeteerTestFramework();
    await framework.initialize();
    
    const testUser = TestUtilities.generateTestUser();
    const results = [];
    
    // Test 1: Navigate to signup
    results.push(await framework.runTest('Navigate to Signup', async (page) => {
        await page.goto(`${TEST_CONFIG.authGatewayUrl}/sign-up`);
        const title = await page.title();
        assert(title.includes('Sign Up'), 'Should be on signup page');
    }));
    
    // Test 2: Create account
    results.push(await framework.runTest('Create New Account', async (page) => {
        await page.type('input[name="email"]', testUser.email);
        await page.type('input[name="password"]', testUser.password);
        await page.click('button[type="submit"]');
        await page.waitForNavigation({ timeout: 10000 });
        const url = page.url();
        assert(url.includes('dashboard'), 'Should redirect to dashboard');
    }));
    
    // Test 3: Verify redirect to dashboard
    results.push(await framework.runTest('Dashboard Loads', async (page) => {
        await page.waitForSelector('.dashboard-content', { timeout: 5000 });
        const content = await page.$('.dashboard-content');
        assert(content, 'Dashboard content should be visible');
    }));
    
    // Test 4: Logout
    results.push(await framework.runTest('Logout', async (page) => {
        await page.click('#logout-button');
        await page.waitForNavigation();
        const url = page.url();
        assert(url.includes('login'), 'Should redirect to login');
    }));
    
    // Test 5: Login again
    results.push(await framework.runTest('Login with Created Account', async (page) => {
        await page.type('input[name="email"]', testUser.email);
        await page.type('input[name="password"]', testUser.password);
        await page.click('button[type="submit"]');
        await page.waitForNavigation();
        const url = page.url();
        assert(url.includes('dashboard'), 'Should login successfully');
    }));
    
    // Test 6: Verify session persists
    results.push(await framework.runTest('Session Persistence', async (page) => {
        await page.reload();
        await page.waitForSelector('.dashboard-content');
        const url = page.url();
        assert(url.includes('dashboard'), 'Should stay logged in after reload');
    }));
    
    await framework.teardown();
    
    // Generate report
    const passed = results.filter(r => r.status === 'passed').length;
    const failed = results.filter(r => r.status === 'failed').length;
    
    console.log('\n📊 Test Results:');
    console.log(`✅ Passed: ${passed}`);
    console.log(`❌ Failed: ${failed}`);
    console.log(`📈 Success Rate: ${(passed / results.length * 100).toFixed(1)}%`);
    
    // If this test passes, infrastructure is proven!
    if (failed === 0) {
        console.log('\n🎉 SUCCESS: Test infrastructure is working!');
        return true;
    } else {
        console.log('\n⚠️ FAILURES: See screenshots in /tmp/');
        return false;
    }
}
```

### Step 4: Test Data Cleanup (30 minutes)

```javascript
// File: scripts/00129-cleanup-test-data.js
async function cleanupTestData() {
    // Use Supabase MCP to clean test data
    const queries = [
        `DELETE FROM profile WHERE email LIKE '%@edl-test.local'`,
        `DELETE FROM student WHERE user_id IN (
            SELECT id FROM auth.users WHERE email LIKE '%@edl-test.local'
        )`,
        `DELETE FROM auth.users WHERE email LIKE '%@edl-test.local'`
    ];
    
    for (const query of queries) {
        try {
            await mcp__supabase-dev__execute_sql({ query });
            console.log(`✅ Cleaned: ${query.substring(0, 30)}...`);
        } catch (error) {
            console.log(`⚠️ Cleanup failed: ${error.message}`);
        }
    }
}
```

## Success Criteria

### Minimum Success (Must Have)
- [ ] Puppeteer MCP launches without dependency errors
- [ ] Can navigate to auth pages
- [ ] Can type into form fields
- [ ] Can click buttons
- [ ] Screenshots captured on failure

### Full Success (Nice to Have)
- [ ] Complete auth flow test passes
- [ ] Test data cleanup works
- [ ] Test report generated
- [ ] All 6 auth subtests pass

## Time Allocation

| Task | Estimated | Purpose |
|------|-----------|---------|
| Fix Puppeteer dependencies | 30 min | Unblock everything |
| Create test framework | 2 hours | Reusable foundation |
| Implement auth test | 1 hour | Prove approach works |
| Test and debug | 30 min | Fix issues |
| Document results | 30 min | Handoff to next session |
| **Total** | **4.5 hours** | **MVP Test Infrastructure** |

## Risk Mitigation

### If Puppeteer Won't Work
1. Try with `headless: false` to see errors
2. Check if Chrome/Chromium installed: `which chromium-browser`
3. Try manual browser path: `executablePath: '/usr/bin/chromium-browser'`
4. Worst case: Document blockers for next session

### If Auth Test Fails
1. Check if services running: `lsof -i :3001,3002`
2. Verify database has auth tables: `mcp__supabase-dev__list_tables`
3. Try manual testing to understand issue
4. Document specific failure points

## Next Steps After Success

Once the auth test passes:
1. Expand to test Friends system (the "95% syndrome" example)
2. Test Team creation
3. Begin Priority 2: MCP-enable Reality Agents
4. Run against all 50 P0 Activity Runtime stories

## Key Insight

Session 128 was right: **Fix Puppeteer first, then everything flows**. The 275 stories are real (I verified!), but we focus on the 50 P0 stories initially. The test infrastructure will prevent future "95% syndrome" issues.

---

*This plan transforms Session 128's architectural vision into concrete implementation steps with clear success metrics.*