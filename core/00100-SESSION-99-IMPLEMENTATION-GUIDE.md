---
session: "00100"
type: "guide"
status: "current"
created: "2025-08-27"
title: "Session 99 Implementation Guide - Truth-Seed Foundation"
purpose: "Provide specific guidance for Session 99's database and auth fixes"
topics: ["implementation", "guidance", "database", "auth", "profile-triggers"]
priority: "P0"
domain: "reconciliation"
audience: "session-99"
complexity: "intermediate"
validation_method: "manual"
review_date: "2025-09-27"
estimated_shelf_life: "session"
implements: ["dual-session-collaboration-protocol"]
related_to: ["SESSION-00100-ANALYSIS.md", "00100-DUAL-SESSION-COLLABORATION-PROTOCOL.md"]
---

# Session 99 Implementation Guide

**Research Support**: Session 100  
**Implementation**: Session 99  
**Verification**: Human  
**Protocol**: Dual Session Collaboration v1.0

---

## 🎯 CRITICAL UPDATE: Database is COMPLETE!

**STOP - DO NOT RUN ANY SQL!** 

Session 100's reality file analysis reveals:
- ✅ `add_new_user` function IS deployed
- ✅ `on_auth_user_created` trigger IS attached  
- ✅ `call_sign` column IS in student table
- ✅ `search_school` function IS working
- ✅ All 36 truth-seed tables deployed

**The database foundation is PRODUCTION-READY!**

## 📋 Session 99 Task Priority List

### Priority 1: UI Flow Testing (IMMEDIATE)
The issue is **frontend/integration**, not database. Focus on:

### Priority 2: Reality Files YAMLization (FOLLOW-UP - 15 mins)
**After UI testing**: See `core/00100-REALITY-FILES-YAMLIZATION-REQUEST.md`
- Make reality files discoverable via YAML queries
- Prevent future sessions from repeating Session 100's initial database assumption mistake
- Simple task using existing YAMLization tools

---

### ACTUAL Implementation Priority:

### STEP 1: Test Current Flow (CRITICAL)
**Start both services and test what actually breaks:**

```bash
# Terminal 1:
cd reconciliation/active-work/auth-gateway && npm run dev  # :3000

# Terminal 2:  
cd reconciliation/active-work/dashboard && npm run dev     # :3001

# Test signup at localhost:3000/sign-up
# Report EXACTLY what happens (success? errors? where it stops?)
```

**Expected Result**: New user signups will automatically create profile records

---

### STEP 2: School Search Function (P0)
**Problem**: search_school() function requires pg_trgm extension  
**Solution**: Apply Session 91's simplified version

```bash
# File to apply:
scripts/00091-fix-school-search-function.sql

# What this fixes:
- Replaces similarity() with ILIKE pattern matching
- Removes pg_trgm dependency
- Enables school search in onboarding step 3
```

**Expected Result**: School search will return results in onboarding

---

### STEP 3: EDL-Specific Database Columns (P1)
**Problem**: call_sign and grade_level columns missing from student table  
**Solution**: Add EDL columns

```sql
-- Run in Supabase SQL Editor:
ALTER TABLE student ADD COLUMN IF NOT EXISTS call_sign VARCHAR(50);
ALTER TABLE student ADD COLUMN IF NOT EXISTS grade_level VARCHAR(20);

-- Optional: Add constraint for unique call_sign
ALTER TABLE student ADD CONSTRAINT unique_call_sign UNIQUE (call_sign);
```

**Expected Result**: Onboarding step 2 can save call_sign and grade_level

---

### STEP 4: School Registration Return Fix (P1)
**Problem**: registerSchoolAction not returning {id, name} properly  
**Solution**: Modify school-actions.ts

**File to check**: `reconciliation/active-work/dashboard/src/lib/actions/school-actions.ts`

**Look for this pattern in registerSchoolAction:**
```typescript
// WRONG (Session 88 discovery):
return data; // Returns array

// CORRECT (Session 88 fix):
return data[0]; // Returns {id, name} object
// OR use .single() in the query
```

**Expected Result**: School registration will properly set school_id

---

### STEP 5: Middleware Header Fix (P1)  
**Problem**: Missing x-user-authenticated header  
**Solution**: Apply Session 87's middleware fix

**File to check**: `reconciliation/active-work/dashboard/src/utils/supabase/middleware.ts`

**Ensure this header is set:**
```typescript
// Add this in middleware where user is verified:
response.headers.set('x-user-authenticated', 'true');
```

**Expected Result**: Dashboard pages will load properly for authenticated users

---

## 🔧 Implementation Commands Reference

### Testing Between Steps
```bash
# After each step, test these:

# Step 1 verification:
# - Sign up new user at localhost:3000/sign-up  
# - Check if profile created in Supabase Dashboard

# Step 2 verification:
# - Go to onboarding step 3
# - Try searching for a school
# - Should return results

# Step 3 verification:
# - Complete step 2 with call_sign
# - Check if call_sign saved in student table

# Steps 4-5 verification:
# - Complete full onboarding flow
# - Should reach dashboard without errors
```

### Supabase Dashboard Access
```bash
URL: https://supabase.com/dashboard/project/bbrheacetxlnqbibjwsz
Location: SQL Editor tab for running SQL commands
Tables: Check profile, student, school tables for data
```

### Development Server Commands  
```bash
# Terminal 1 - Auth Gateway:
cd reconciliation/active-work/auth-gateway
npm run dev # Port 3000

# Terminal 2 - Dashboard:  
cd reconciliation/active-work/dashboard
npm run dev # Port 3001

# Testing URLs:
# Signup: http://localhost:3000/sign-up
# Login: http://localhost:3000/login  
# Dashboard: http://localhost:3001
```

---

## 🐛 Expected Issues & Solutions

### Issue: "Function add_new_user already exists"
```sql
-- Solution: Replace existing function
DROP FUNCTION IF EXISTS public.add_new_user();
-- Then rerun the 00081-COMPLETE-fix-add-new-user.sql
```

### Issue: "Trigger already exists"  
```sql
-- Solution: Replace existing trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
-- Then recreate the trigger
```

### Issue: Profile creation still not working
**Check this sequence:**
1. Function exists: `SELECT * FROM pg_proc WHERE proname = 'add_new_user';`
2. Trigger exists: `SELECT * FROM pg_trigger WHERE tgname = 'on_auth_user_created';`  
3. Trigger attached to auth.users table
4. Function has no syntax errors

### Issue: School search returns no results
**Check this:**
1. search_school function exists
2. School table has data: `SELECT * FROM school LIMIT 5;`
3. Function has proper permissions granted

### Issue: Can't save call_sign  
**Check this:**
1. student table has call_sign column: `\d student` 
2. RLS policies allow UPDATE on student table
3. User has student record created

---

## 📊 Success Criteria

### After Step 1 (Profile Trigger):
- [ ] New user signup creates profile automatically
- [ ] No redirect loops on auth pages
- [ ] Profile data visible in Supabase Dashboard

### After Step 2 (School Search):
- [ ] School search returns results in step 3
- [ ] Can select schools from search results
- [ ] No JavaScript errors in browser console

### After Steps 3-5 (Complete Flow):
- [ ] Full signup → onboarding → dashboard works  
- [ ] Call sign saves properly
- [ ] School registration completes
- [ ] Dashboard loads without middleware errors

### Final Success State:
- [ ] **Human verification**: Complete user flow tested manually
- [ ] **Documentation**: Progress docs updated with successes  
- [ ] **Handoff**: Next priorities identified for Sessions 101+

---

## 🚨 When to Ask for Help

### From Session 100 (Research):
- "What does this error mean?"
- "I'm getting unexpected results from X"  
- "This fix didn't work as expected"
- "Need guidance on next debugging step"

### From Human (Verification):
- "I've completed steps 1-3, ready for testing"
- "Step X appears to work, need confirmation"
- "Getting errors but can't determine cause"

### Stop Work If:
- Database becomes inaccessible
- Core auth completely broken  
- Unsure about irreversible changes
- **When in doubt, ask first!**

---

## 📚 Quick Reference Files

### SQL Fixes Ready to Apply:
- `scripts/00081-COMPLETE-fix-add-new-user.sql` - Profile creation
- `scripts/00091-fix-school-search-function.sql` - School search

### Code Files to Review:
- `reconciliation/active-work/dashboard/src/lib/actions/school-actions.ts` - Return values
- `reconciliation/active-work/dashboard/src/utils/supabase/middleware.ts` - Headers

### Session Documentation:
- `archive/sessions/SESSION-00100-ANALYSIS.md` - Complete gap analysis  
- `scripts/00088-complete-onboarding-success.md` - Session 88's success story

---

**Ready to implement!** Session 100 will monitor progress and provide real-time guidance as you work through each step.

Remember: The goal is not perfection, but **verified progress** toward a working truth-seed foundation.