# CRITICAL SCHEMA DISCREPANCY - Session 00015 Discovery

## The Problem

Session 00015 discovered that the database schema deployed in Session 00012 was built on incomplete understanding:

### What Session 00012 Created
Based on partial Canvas analysis, created a simplified schema:
- `profiles` table with `user_id` referencing `auth.users` directly
- `call_sign` field (correctly named but poorly understood)
- Missing the separate `users` table
- Missing many fields from the unified design

### What Should Have Been Created
Per SESSION-00011-UNIFIED-DATABASE-DESIGN.md, the schema should have:
1. **`users` table** - Central auth record (email, auth_id, last_login)
2. **`profiles` table** - Display identity (call_sign, avatar, personality)
3. **Proper separation** - Auth concerns vs identity concerns

## Why This Happened

1. **Context Loss**: Session 00012 didn't review Session 00011's unified design
2. **Assumption Cascade**: Assumed `call_sign` was a mistake (it's not - it's the display name from Canvas)
3. **Incomplete Migration**: Only created 4 tables when 9+ were designed
4. **No Verification**: Deployed without checking against source truth

## The Impact

- Sign-up fails because JavaScript tries to insert `email` into profiles
- Profiles table references `auth.users` but should reference our `users` table
- Missing critical fields like personality_type, school_id, division
- Team creation will fail due to missing relationships

## The Fix Required

### Step 1: Create Missing Users Table
```sql
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    auth_id VARCHAR(255) UNIQUE, -- Links to Supabase auth
    created_at TIMESTAMP DEFAULT NOW(),
    last_login TIMESTAMP,
    is_active BOOLEAN DEFAULT true
);
```

### Step 2: Fix Profiles Table
Either:
- Option A: Alter existing profiles to add missing fields
- Option B: Drop and recreate with proper schema

### Step 3: Update JavaScript
- Create user record on sign-up
- Then create profile with proper call_sign
- Handle the two-step process correctly

## Lessons for Future Sessions

1. **ALWAYS CHECK**: `archive/sessions/SESSION-00011-UNIFIED-DATABASE-DESIGN.md`
2. **NEVER ASSUME**: If something seems weird (like call_sign), investigate WHY
3. **VERIFY SCHEMA**: Before deploying, check against the unified design
4. **DOCUMENT DECISIONS**: When deviating from the plan, document WHY

## The Truth About call_sign

`call_sign` is NOT a mistake. It's the intentional display name from the Canvas wireframes:
- Like a gamertag or username
- Shown throughout the UI as the primary identity
- Separate from email (which is for auth)
- Maximum 50 characters
- Must be unique

## Current State (as of Session 00015)

### What Exists in Supabase
- `profiles` table (incomplete schema)
- `teams` table
- `team_members` table  
- `team_join_requests` table
- All using `auth.users` directly (missing our users table)

### What's Missing
- `users` table
- Proper fields in profiles (avatar, personality, school, etc.)
- All other tables from unified design (activities, messages, etc.)

## Required Reading for Next Session

1. `/archive/sessions/SESSION-00011-UNIFIED-DATABASE-DESIGN.md` - The complete schema
2. `/docs/DATABASE-DESIGN-FROM-CANVAS.md` - The WHY behind each table
3. This document - Understanding what went wrong

## The Meta-Lesson

Building quickly without understanding context creates more work than building slowly with full understanding. The Lightning Stack's speed comes from having the right foundation, not from rushing through implementation.