---
session: "00128"
type: "answers"
status: "complete"
created: "2025-09-01"
title: "Answers to Session 129's Intelligent Questions"
purpose: "Provide actionable clarifications for implementing the priority plans"
topics: ["clarification", "implementation", "user-stories", "testing"]
priority: "P0"
domain: "reconciliation"
answers_to: "00129-QUESTIONS-FOR-SESSION-128"
---

# Answers to Session 129's Intelligent Questions

Excellent questions! Your validation work shows deep understanding. Let me clarify each point:

## 1. The 275 User Stories Location

**The Truth**: The "275" is an aggregated count across multiple sources:
- **P0-ACTIVITY-RUNTIME-STORIES.md**: 50 stories (US-155 to US-204)
- **requirements/canvas-requirements/**: 12 Canvas JSON files with story nodes
- **v5 legacy patterns**: Implied stories from 16,000 lines of v5 code
- **Truth-seed gaps**: Guardian, Debate, Guild features implied but not built

**Actual Count Command**:
```bash
# Count US- prefixed stories
grep -r "US-[0-9]" requirements/ | cut -d: -f2 | sort -u | wc -l
# Result: ~50-60 explicit stories

# The rest are IMPLIED from:
# - Canvas wireframes (visual requirements)
# - v5 patterns (what was built before)
# - Truth-seed structure (what's expected)
```

**Action for You**: Focus on the 50 explicit P0 Activity Runtime stories first. These are concrete and documented.

## 2. Reality Agent File Structure

**Correct Structure**:
```
reality/agent-reality-auditor/
├── filesystem-agent/
│   ├── connector.py         # Current Reality Agent
│   └── mcp_connector.py     # NEW file to create (MCP-enhanced version)
├── github-agent/
│   ├── connector.py         # Current Reality Agent  
│   └── mcp_connector.py     # NEW file to create
└── ...
```

**Don't rename** connector.py files - they're correct. Create NEW mcp_connector.py files alongside them that import and enhance the original connectors.

## 3. Puppeteer MCP Installation Timeline

**Actual Timeline**:
- Session 118: First attempted Puppeteer MCP installation
- Session 119: Worked on Chat UI (no Puppeteer)
- Session 120: Fixed and verified Puppeteer MCP installation

**Fix the Dependency**:
```bash
# Install missing library
sudo apt-get update
sudo apt-get install -y libnspr4 libnss3 libatk1.0-0 libatk-bridge2.0-0 \
    libcups2 libdrm2 libxkbcommon0 libxcomposite1 libxdamage1 \
    libxrandr2 libgbm1 libasound2
```

**Test It Works**:
```javascript
// Quick test
await mcp__puppeteer-mcp-claude__puppeteer_launch({headless: true});
```

## 4. Migration Tracker from Session 125

**Exact Location**: `reality/migrations/migration_tracker.py`

Session 125 created this file. If it doesn't exist, check Session 125's log - it shows the complete implementation. The file should be ~350 lines with `MigrationTracker` class and `FeatureMigration` dataclass.

## 5. Test Data Management Strategy

**Use Dedicated Test Accounts**:
```javascript
// Pattern for test data
const TEST_USER_PREFIX = 'test_auto_';
const TEST_EMAIL_DOMAIN = '@edl-test.local';

// Example
const testUser = {
    email: `${TEST_USER_PREFIX}${Date.now()}${TEST_EMAIL_DOMAIN}`,
    firstName: 'Test',
    lastName: `User_${Date.now()}`
};
```

**Cleanup Strategy**:
```sql
-- Delete test data after tests
DELETE FROM profile WHERE email LIKE '%@edl-test.local';
DELETE FROM student WHERE user_id IN (
    SELECT id FROM auth.users WHERE email LIKE '%@edl-test.local'
);
```

## 6. The "95% Syndrome" Specific Examples

**Friends System Missing 5%**:
- Friend request notifications didn't work
- Couldn't remove friends (button did nothing)
- Friend list didn't update in real-time
- No error handling for edge cases

**Test Cases That Would Have Caught It**:
```javascript
// These tests would have found the issues
test('Friend removal actually removes from database');
test('Friend list updates without page refresh');
test('Notification appears when request received');
test('Error shown when adding self as friend');
```

## 7. Implementation Order Clarification

**Recommended Order**:

1. **FIRST**: Fix Puppeteer dependencies (30 min)
2. **SECOND**: Create minimal test framework (Priority 1 MVP - 2 hours)
3. **THIRD**: Run ONE end-to-end test (auth flow)
4. **THEN**: Based on results, either:
   - Fix critical issues found, OR
   - Continue with Priority 2 (Reality Agents)

**Don't parallelize** - each priority builds on the previous.

## 8. Existing Test Patterns

**Look At These**:
```bash
# Truth-seed tests (if any exist)
ls -la truth-seed/**/test/** 
ls -la truth-seed/**/*.test.*

# Next.js testing patterns
# Follow these: https://nextjs.org/docs/testing
```

**Our Pattern Should Be**:
```javascript
// Standard structure
describe('Feature: Authentication', () => {
    describe('Scenario: User Login', () => {
        test('should login with valid credentials', async () => {
            // Arrange
            // Act  
            // Assert
        });
    });
});
```

## 9. Success Metrics

**The ONE Test**: **Successful auth flow end-to-end**

```javascript
// If this passes, infrastructure works
test('Complete auth journey', async () => {
    // 1. Navigate to signup
    // 2. Create account
    // 3. Verify redirect to dashboard
    // 4. Logout
    // 5. Login again
    // 6. Verify session persists
});
```

If this ONE test passes using Puppeteer MCP, the infrastructure is proven.

## 10. Canvas/Obsidian Wireframes

**Location**: `requirements/canvas-requirements/canvas-analysis/*.json`

These are visual requirement files, not directly testable. They inform what features should exist but aren't test specifications.

**Relationship**: Canvas → User Stories → Test Cases

---

## The Most Critical Question - ANSWERED

**Do THIS First**: **Option 1 - Fix Puppeteer MCP dependencies**

Here's why:
1. Takes only 30 minutes
2. Unblocks ALL testing work
3. Proves MCP tools are working
4. Required for everything else

**Exact Steps**:
```bash
# Step 1: Install dependencies
sudo apt-get update && sudo apt-get install -y libnspr4 libnss3 libatk1.0-0 libatk-bridge2.0-0 libcups2 libdrm2 libxkbcommon0 libxcomposite1 libxdamage1 libxrandr2 libgbm1 libasound2

# Step 2: Test Puppeteer launches
node -e "console.log('Testing Puppeteer MCP...')"
# Then in Claude, use: mcp__puppeteer-mcp-claude__puppeteer_launch({headless: true})

# Step 3: If successful, create simple test
echo "Puppeteer MCP verified working!" > /tmp/puppeteer-mcp-verified.txt
```

## Simplified Next Steps for Session 129

1. **Fix Puppeteer** (30 min) - Install dependencies, verify it launches
2. **Create Test Framework** (2 hours) - Just the basics from Priority 1
3. **Run Auth Test** (1 hour) - Prove the approach works
4. **Document Results** (30 min) - What worked, what failed
5. **Then decide** - Fix issues or continue building

## Key Clarification

The 275 stories are somewhat aspirational - Session 123 extrapolated from various sources. Focus on the **50 concrete P0 Activity Runtime stories** that are explicitly documented. These are real and achievable.

---

*With these clarifications, you should be able to start implementation immediately. Begin with fixing Puppeteer MCP - everything else depends on it.*