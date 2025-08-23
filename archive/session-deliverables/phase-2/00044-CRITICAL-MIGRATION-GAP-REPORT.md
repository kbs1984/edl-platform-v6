---
session: "00044"
type: "documentation"
status: "current"
created: "2025-08-23"
title: "🚨 CRITICAL MIGRATION GAP - Session 00046 Discovery"
purpose: "Document 🚨 critical migration gap - session 00046 discovery"
topics: ['auth', 'migration', 'documentation']
priority: "P0"
domain: "core"
---

# 🚨 CRITICAL MIGRATION GAP - Session 00046 Discovery

**Date**: 2025-08-22  
**Discovered During**: Live testing with Brian  
**Impact**: BLOCKS ALL NEW USER SIGNUPS  
**Priority**: 🔴 MUST FIX BEFORE PRODUCTION

---

## The Problem

**Current State**: Migration from Sessions 50-53 created 36 tables but is INCOMPLETE for auth workflow.

**What Happens**:
1. User signs up at auth gateway ✅
2. Supabase creates auth.users record ✅
3. Email confirmation works ✅
4. User logs in ✅
5. Dashboard queries profile table ❌
6. **ERROR**: "Could not find the table 'public.profile' in the schema cache"
7. Dashboard shows 500 error page ❌

---

## Root Cause Analysis

### What We Have (From Migration)
```sql
-- Tables exist:
CREATE TABLE public.profile (
  id uuid,
  email text,
  user_role user_role,
  ...
);

-- RLS exists:
ALTER TABLE public.profile ENABLE ROW LEVEL SECURITY;
```

### What's Missing (Critical Business Logic)
```sql
-- NO trigger to create profile on signup
-- NO function to handle new users
-- NO automatic record creation
```

### Why This Matters
The Next.js dashboard code EXPECTS every authenticated user to have a profile:
```typescript
// src/utils/get-user-info.ts
const { data: profile, error } = await supabase
  .from('profile')
  .select('*')
  .eq('id', id)
  .single()

if (error || !profile) {
  throw new Error(error?.message)  // 💥 This crashes the dashboard
}
```

---

## Complete Solution Required

### 1. Profile Creation Trigger
```sql
-- Function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profile (id, email, user_role, created_at, updated_at)
  VALUES (
    new.id,
    new.email,
    'STUDENT',  -- Default role
    NOW(),
    NOW()
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger on auth.users table
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW 
  EXECUTE FUNCTION public.handle_new_user();
```

### 2. Student Record Creation (If Student Role)
```sql
-- Extended function to also create student record
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  -- Create profile
  INSERT INTO public.profile (id, email, user_role)
  VALUES (new.id, new.email, 'STUDENT');
  
  -- If student, create student record
  INSERT INTO public.student (user_id, location, graduation_year)
  VALUES (new.id, 'Unknown', EXTRACT(YEAR FROM CURRENT_DATE) + 4);
  
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

### 3. RLS Policies (Already exist but verify)
```sql
-- Users can read their own profile
CREATE POLICY "Users can view own profile" ON public.profile
  FOR SELECT USING (auth.uid() = id);

-- Users can update their own profile  
CREATE POLICY "Users can update own profile" ON public.profile
  FOR UPDATE USING (auth.uid() = id);
```

---

## Migration Assessment

### ✅ What Sessions 50-53 Got Right
- All 36 tables created with correct schema
- Foreign key relationships established
- Basic RLS enabled on tables
- Indexes created for performance

### ❌ What's Missing (Business Logic Layer)
- User creation triggers
- Profile initialization logic
- Default value functions
- Cascade deletion rules
- Some RLS policies for cross-table access
- Event triggers for team creation
- Chat room auto-creation triggers

### 📊 Migration Completeness Score
- **Schema Layer**: 100% ✅
- **Business Logic Layer**: ~40% ❌
- **Overall Readiness**: 70%

---

## Immediate Actions Required

### For Current Testing
1. Run `FIX-PROFILE-CREATION.sql` in Supabase SQL Editor
2. This adds the missing trigger and fixes existing users
3. New signups will work correctly after this

### For Production Deployment
1. Audit ALL expected triggers from original emdash platform
2. Add missing business logic functions
3. Test complete user lifecycle:
   - Signup → Profile → Student/Judge/Guardian → Team → Chat
4. Document all required triggers in migration

### For Future Sessions
1. **Lesson**: Schema ≠ Complete Database
2. **Always verify**: Tables + Triggers + Functions + Policies
3. **Test the flow**: Not just individual queries
4. **Check original platform**: What business logic exists there?

---

## Files for Reference

- `FIX-PROFILE-CREATION.sql` - Complete fix with all components
- `reconciliation/active-work/dashboard/src/utils/get-user-info.ts` - Where error occurs
- Session 00046 Log - Live discovery documentation

---

## Impact on Team Coordination

### Team A (Database) - Sessions 44/46
- Must add business logic layer to migration
- Cannot claim "database complete" with just schema
- Need to verify against actual app requirements

### Team B (Frontend) - Sessions 45/47  
- Cannot test without these triggers
- May need to add fallback logic for missing profiles
- Should document expected database behavior

---

## The Bigger Picture

This discovery reveals that our "36-table migration" from Sessions 50-53 was really just a "36-table schema import". The actual working database needs:

1. **Schema** (what we have)
2. **Business Logic** (what we're missing)
3. **Security Policies** (partially there)
4. **Performance Optimizations** (indexes exist)

We're at step 1.5 of 4.

---

**Critical Insight**: The PGRST205 errors we celebrated as "security working" are actually blocking legitimate authenticated access because the business logic layer is missing. The RLS policies exist but the data they're supposed to protect doesn't get created in the first place!

---

*Report created by Session 00046 after live testing revealed critical gap*  
*This must be addressed before any production deployment*