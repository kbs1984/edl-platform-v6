---
session: "00133"
type: "documentation"
status: "current"
created: "2025-09-01"
title: "EDL Platform Test Strategy"
purpose: "Define comprehensive testing approach for EDL Platform"
topics: ["testing", "puppeteer", "e2e", "strategy", "documentation"]
priority: "P0"
domain: "reconciliation"
---

# EDL Platform Test Strategy

## Overview

This document outlines the comprehensive testing strategy for the EDL Platform, focusing on E2E testing with Puppeteer and data validation with Supabase.

## Test Architecture

### Test Levels

1. **Unit Tests** (Component-level)
   - Location: Within each application (`auth-gateway`, `dashboard`)
   - Framework: Jest + React Testing Library
   - Focus: Individual component behavior

2. **Integration Tests** (API-level)
   - Location: `edl-ui-tests/` directory
   - Framework: Jest + Supabase client
   - Focus: Database operations, API endpoints

3. **E2E Tests** (UI-level)
   - Location: `edl-ui-tests/` directory
   - Framework: Jest + Puppeteer (standard, not MCP)
   - Focus: Complete user workflows

## Test Data Management

### Email Strategy
- **Base Email**: `brian.bumsik.kim@gmail.com`
- **Pattern**: Gmail + addressing for unique test accounts
- **Format**: `brian.bumsik.kim+test_[timestamp]_[random]@gmail.com`
- **Benefits**: 
  - Real email delivery (no mocking required)
  - All test emails arrive at single inbox
  - Easy to filter and manage

### Cleanup Strategy
- **Approach**: Batch cleanup after all tests complete
- **Scope**: Remove test users, teams, friendships, activities
- **Timing**: In `afterAll()` hooks
- **Benefits**:
  - Efficient (fewer database calls)
  - Allows debugging of failed tests
  - Prevents test interference

## Test Utilities

### Core Helpers

1. **AuthHelpers** (`auth-helpers.js`)
   - User generation with timestamps
   - Login/logout workflows
   - Session management
   - Dashboard verification

2. **SessionManager** (`session-manager.js`)
   - Browser lifecycle management
   - Multi-user session support
   - Screenshot capture on failure
   - Resource cleanup

3. **SupabaseValidator** (`supabase-validator.js`)
   - Data existence verification
   - Relationship validation
   - Activity tracking
   - Eventual consistency handling

4. **TestCleanup** (`test-cleanup.js`)
   - Batch user deletion
   - Team cleanup
   - Cascade deletion handling
   - Dry-run mode for safety

## Running Tests

### Local Development

```bash
# Navigate to test directory
cd edl-ui-tests

# Run all tests
npm test

# Run specific test suite
npm test login.test.js

# Run with coverage
npm test -- --coverage

# Run in watch mode
npm test -- --watch

# Run with visible browser (debugging)
HEADLESS=false npm test
```

### Environment Variables

```bash
# Required for tests
AUTH_GATEWAY_URL=http://localhost:3000
DASHBOARD_URL=http://localhost:3001
SUPABASE_URL=https://bbrheacetxlnqbibjwsz.supabase.co
SUPABASE_ANON_KEY=[your-anon-key]

# Optional
HEADLESS=false          # Show browser during tests
DRY_RUN=true           # Don't actually delete test data
SLOW_MO=100            # Slow down Puppeteer actions (ms)
```

### CI/CD Pipeline

Tests run automatically on:
- Push to `main`, `develop`, or `feature/*` branches
- Pull requests to `main` or `develop`
- Manual workflow dispatch

GitHub Actions workflow includes:
- Chrome installation
- Service startup (Auth Gateway + Dashboard)
- Parallel test execution
- Screenshot capture on failure
- JUnit XML reporting
- Test result artifacts

## Test Suites

### 1. Authentication Tests (`login.test.js`)
- User registration
- Login flow
- Password validation
- Session persistence
- Logout functionality

### 2. Dashboard Tests (`dashboard.test.js`)
- Initial load after auth
- Navigation menu
- User profile display
- Activity feed
- Responsive design

### 3. Friends Tests (`friends.test.js`)
- Friend request sending
- Request acceptance/rejection
- Friend list display
- Online status
- Friend removal

### 4. Teams Tests (`teams.test.js`)
- Team creation
- Member invitation
- Role management
- Team chat
- Team settings

## Test Execution Order

Recommended sequence for dependencies:

1. **Auth Tests** - Creates initial users
2. **Dashboard Tests** - Verifies authenticated state
3. **Friends Tests** - Requires multiple users
4. **Teams Tests** - Requires users with relationships

## Troubleshooting

### Common Issues

1. **Services not running**
   - Verify Auth Gateway on port 3000
   - Verify Dashboard on port 3001
   - Check `npm run dev` in both directories

2. **Supabase connection fails**
   - Verify SUPABASE_URL and SUPABASE_ANON_KEY
   - Check network connectivity
   - Verify RLS policies allow operations

3. **Tests timeout**
   - Increase timeout in jest.config.js
   - Check service startup time
   - Verify selectors match current UI

4. **Cleanup fails**
   - Check foreign key constraints
   - Verify deletion order (reverse dependency)
   - Use dry-run mode to debug

### Debug Mode

```bash
# Visible browser + slow actions
HEADLESS=false SLOW_MO=250 npm test

# Keep browser open after test
# Add `await page.waitForTimeout(30000)` in test

# Save screenshots on success too
# Add `await page.screenshot({ path: '/tmp/success.png' })`
```

## Best Practices

### Test Writing

1. **Use data-testid attributes** for reliable selectors
2. **Generate unique test data** with timestamps
3. **Clean up after tests** to prevent pollution
4. **Use descriptive test names** for clarity
5. **Group related tests** in describe blocks

### Performance

1. **Reuse browser sessions** when possible
2. **Batch database operations** for efficiency
3. **Run tests in parallel** in CI/CD
4. **Use headless mode** for speed
5. **Minimize waits** - use specific conditions

### Maintenance

1. **Update selectors** when UI changes
2. **Review test data** patterns regularly
3. **Monitor test execution time** trends
4. **Clean up obsolete tests** promptly
5. **Document special cases** clearly

## Migration from Puppeteer MCP

Key differences when migrating tests:

| Puppeteer MCP | Standard Puppeteer |
|---------------|-------------------|
| Complex wait patterns | Simple waits work |
| Form filling issues | Reliable input |
| 37.5% success rate | ~100% success rate |
| Requires special setup | Works out of box |
| Gray text in fields | Text appears correctly |

## Future Enhancements

1. **Visual Regression Testing**
   - Screenshot comparison
   - UI change detection
   - Automated approval workflow

2. **Performance Testing**
   - Page load times
   - API response times
   - Resource usage metrics

3. **Accessibility Testing**
   - WCAG compliance
   - Screen reader compatibility
   - Keyboard navigation

4. **Cross-browser Testing**
   - Firefox support
   - Safari via Playwright
   - Mobile browsers

## Maintenance Schedule

- **Daily**: Monitor CI/CD test results
- **Weekly**: Review test coverage metrics
- **Monthly**: Update test data patterns
- **Quarterly**: Refactor test utilities

## Contact

For test-related questions or issues:
- Check this documentation first
- Review recent test logs in CI/CD
- Consult session logs for implementation details

---

*Last updated: Session 133 - Test infrastructure completion*