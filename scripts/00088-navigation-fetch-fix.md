---
created: '2025-08-27'
domain: reconciliation
fixes:
- navigation-fetch-error
- undefined-redirect-url
priority: P0
purpose: Fix navigation between onboarding steps failing with fetch error
related_to:
- 00088-school-registration-fix.md
session: 00088
status: current
title: Navigation Fetch Error Fix - Environment Variables
topics:
- navigation
- environment-variables
- fetch-error
- onboarding
type: fix
---

# Session 00088 - Navigation Fetch Error Fix

## Problem
When clicking the "Back" button in Step 3 to navigate to Step 2, the browser showed:
- Spinner in favicon
- Console error: "Error: Failed to fetch"
- Stack trace pointing to router-reducer and fetch-server-response

## Root Cause Analysis

### Investigation Path
1. Initially thought it was related to school registration changes
2. Removed non-existent `created_by` field from school insert
3. But error persisted - realized it was navigation, not data mutation

### Real Cause Found
In `get-user-info.ts`, when auth check fails, it redirects to:
```typescript
redirect(`${process.env.PROTOCOL}${process.env.AUTH_URL}`)
```

But these environment variables didn't exist:
- `process.env.PROTOCOL` → undefined
- `process.env.AUTH_URL` → undefined
- Result: redirect to `undefinedundefined` → fetch error

## Solution Applied

### Fixed Environment Variable Usage
```typescript
// BEFORE: Using undefined env vars
redirect(`${process.env.PROTOCOL}${process.env.AUTH_URL}`)

// AFTER: Using actual defined env var with fallback
redirect(process.env.NEXT_PUBLIC_AUTH_URL || 'http://localhost:3000')
```

## Why This Fixes Navigation

1. When navigating to `/onboarding/step-2`, the page calls `getProfile()`
2. If auth session expired or has issues, it tries to redirect
3. Previously: Redirect URL was malformed → fetch error
4. Now: Redirects properly to auth server at localhost:3000

## Testing
1. Navigate to Step 3: http://localhost:3001/onboarding/step-3
2. Click "← Back" button
3. Should navigate to Step 2 without fetch errors
4. If not authenticated, should redirect to localhost:3000 properly

## Additional Fix
Also removed `created_by` field from school registration as the school table doesn't have this column.

## Files Modified
- `truth-seed/emdash-dashboard-main/src/utils/get-user-info.ts` - Fixed redirect URL
- `truth-seed/emdash-dashboard-main/src/lib/actions/school-actions.ts` - Removed non-existent column
- `truth-seed/emdash-dashboard-main/src/app/layout.tsx` - Fixed redirect URL in root layout

---

**Key Learning**: Always check that environment variables actually exist before using them in critical paths like authentication redirects!