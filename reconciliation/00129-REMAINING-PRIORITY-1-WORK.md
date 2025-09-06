---
session: "00129"
type: "implementation-plan"
status: "in-progress"
created: "2025-09-01"
title: "Remaining 65% of Priority 1 MCP Test Infrastructure"
purpose: "Document and plan the remaining work for complete Priority 1 implementation"
topics: ["testing", "mcp", "implementation", "expansion"]
priority: "P0"
domain: "reconciliation"
continues: ["00128-PRIORITY-1-MCP-TEST-INFRASTRUCTURE-PLAN"]
---

# Remaining 65% of Priority 1 MCP Test Infrastructure

## What We've Completed (35%)

### ✅ Done by Session 129
1. **Puppeteer MCP Fixed** - Dependencies installed, verified working
2. **Basic Test Framework** - Core runner with error handling
3. **Test Utilities** - Helper functions for auth, navigation
4. **Auth Flow Test** - 6-step journey test ready
5. **MCP Integration Verified** - Can launch, navigate, capture

### ✅ Validated by Session 128
- Auth system works with real emails
- Redirect flow confirmed: Signup → /thank-you → Email verification
- User creation in Supabase verified

## Remaining Work (65%)

Based on Session 128's Priority 1 plan, here's what still needs implementation:

### 1. Fix Test Configuration for Real Emails (30 minutes)

#### Update Test Utilities for Valid Emails
```javascript
// File: scripts/00129-test-utilities.js (UPDATE)
static generateTestUser(baseEmail = null) {
    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substring(7);
    
    if (baseEmail) {
        // Use Gmail + addressing for real email testing
        const [localPart, domain] = baseEmail.split('@');
        return {
            email: `${localPart}+test_${timestamp}_${randomId}@${domain}`,
            password: 'TestPass123!',  // Meets requirements
            firstName: 'Test',
            lastName: `User_${timestamp}`,
            timestamp,
            randomId
        };
    } else {
        // Fallback for local testing (won't work with real auth)
        return {
            email: `test_auto_${timestamp}_${randomId}@example.com`,
            password: 'TestPass123!',
            firstName: 'Test',
            lastName: `User_${timestamp}`,
            timestamp,
            randomId
        };
    }
}
```

### 2. Expand Test Coverage (4-5 hours)

#### 2.1 Friends System Tests
```javascript
// File: scripts/00129-test-friends-flow.js (CREATE)
async function testFriendsSystem() {
    // Test the "95% syndrome" features
    const tests = [
        'Send friend request',
        'Accept friend request', 
        'Reject friend request',
        'Remove friend',
        'Friend list updates in real-time',
        'Friend request notifications'
    ];
    
    // Implementation using Puppeteer MCP
    // This addresses Session 117's Friends work
}
```

#### 2.2 Team System Tests
```javascript
// File: scripts/00129-test-teams-flow.js (CREATE)
async function testTeamsSystem() {
    const tests = [
        'Create team',
        'Join team with code',
        'Leave team',
        'Team member list',
        'Team chat (if implemented)'
    ];
}
```

#### 2.3 Dashboard Tests
```javascript
// File: scripts/00129-test-dashboard.js (CREATE)
async function testDashboard() {
    const tests = [
        'Dashboard loads after login',
        'Navigation menu works',
        'Profile section displays',
        'Widgets load correctly',
        'Responsive on mobile viewport'
    ];
}
```

### 3. MCP Multi-Tool Integration (2 hours)

#### 3.1 Integrate Supabase MCP for Data Validation
```javascript
// File: scripts/00129-mcp-integration.js (CREATE)
class MCPIntegration {
    async validateUserCreated(email) {
        // Use mcp__supabase-dev__execute_sql
        const query = `
            SELECT id, email, created_at, email_confirmed_at
            FROM auth.users
            WHERE email = '${email}'
        `;
        const result = await mcp__supabase_dev__execute_sql({ query });
        return result.data.length > 0;
    }
    
    async cleanupTestData(emailPattern) {
        // Use mcp__supabase-dev__execute_sql for cleanup
        const queries = [
            `DELETE FROM profile WHERE email LIKE '${emailPattern}'`,
            `DELETE FROM friendship WHERE user_id IN (
                SELECT id FROM auth.users WHERE email LIKE '${emailPattern}'
            )`,
            // ... more cleanup queries
        ];
    }
}
```

#### 3.2 Add Error Research with Brave MCP
```javascript
async function researchError(errorMessage) {
    // Use mcp__brave-search__brave_web_search
    const query = `Supabase auth "${errorMessage}" solution`;
    const results = await mcp__brave_search__brave_web_search({ 
        query, 
        count: 5 
    });
    return results;
}
```

### 4. Test Pipeline Automation (2 hours)

#### 4.1 Automated Test Runner
```bash
#!/bin/bash
# File: scripts/00129-run-all-tests.sh (CREATE)

echo "🧪 EDL Platform Test Suite v1.0"
echo "================================"

# Check services
echo "Checking services..."
lsof -i :3001,3002 | grep LISTEN || {
    echo "❌ Services not running!"
    echo "Start with:"
    echo "  cd reconciliation/active-work/auth-gateway && npm run dev"
    echo "  cd reconciliation/active-work/dashboard && npm run dev"
    exit 1
}

# Run test suites
echo "Running auth tests..."
node scripts/00129-test-auth-flow.js || exit 1

echo "Running dashboard tests..."
node scripts/00129-test-dashboard.js || exit 1

echo "Running friends tests..."
node scripts/00129-test-friends-flow.js || exit 1

echo "Running team tests..."
node scripts/00129-test-teams-flow.js || exit 1

# Generate report
echo "Generating test report..."
node scripts/00129-generate-report.js

echo "✅ Test suite complete!"
```

#### 4.2 Test Report Generator
```javascript
// File: scripts/00129-generate-report.js (CREATE)
class TestReporter {
    generateMarkdownReport(results) {
        // Create comprehensive test report
        // Include screenshots, metrics, recommendations
    }
    
    generateJSONReport(results) {
        // Machine-readable format for CI/CD
    }
    
    uploadToGitHub(report) {
        // Use mcp__github-server__create_issue
        // Create issue with test failures
    }
}
```

### 5. Performance Testing (1 hour)

#### 5.1 Page Load Metrics
```javascript
// File: scripts/00129-performance-tests.js (CREATE)
async function testPerformance() {
    const metrics = await page.evaluate(() => {
        const perfData = performance.getEntriesByType('navigation')[0];
        return {
            domContentLoaded: perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart,
            loadComplete: perfData.loadEventEnd - perfData.loadEventStart,
            firstPaint: performance.getEntriesByName('first-paint')[0]?.startTime,
            firstContentfulPaint: performance.getEntriesByName('first-contentful-paint')[0]?.startTime
        };
    });
    
    // Assert performance thresholds
    assert(metrics.domContentLoaded < 3000, 'Page should load in under 3s');
}
```

## Implementation Priority Order

### Phase 1: Fix Configuration (NOW - 30 min)
1. Update test utilities for real emails
2. Add password validation
3. Test with Session 130's execution

### Phase 2: Core Feature Tests (2-3 hours)
1. Dashboard tests (most basic)
2. Friends system tests (known issues)
3. Team tests (if time permits)

### Phase 3: Integration (1-2 hours)
1. Supabase MCP for data validation
2. Cleanup functions
3. Error research capabilities

### Phase 4: Automation (1-2 hours)
1. Test runner script
2. Report generation
3. CI/CD hooks

## Success Metrics

### MVP Completion (Minimum 65%)
- [ ] Real email configuration works
- [ ] Dashboard tests implemented
- [ ] Friends tests implemented
- [ ] Basic Supabase integration
- [ ] Test runner script

### Full Completion (100%)
- [ ] All feature tests implemented
- [ ] Multi-MCP tool integration
- [ ] Performance testing
- [ ] Automated reporting
- [ ] CI/CD ready

## Time Estimate

- **Already Complete**: 2 hours 5 minutes (35%)
- **Remaining MVP**: 4-5 hours (65%)
- **Full Implementation**: 6-8 hours (100%)

## Next Immediate Actions

1. **Update test utilities** with real email support
2. **Create dashboard test** as simplest expansion
3. **Wait for Session 130** to validate auth test
4. **Expand to Friends tests** based on Session 117 work

---

*This plan completes the remaining 65% of Priority 1, building on Session 129's foundation and Session 128's discoveries.*