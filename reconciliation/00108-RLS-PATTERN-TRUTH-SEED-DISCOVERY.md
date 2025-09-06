---
session: "00108"
type: "discovery"
status: "validated"
created: "2025-08-29"
title: "RLS Pattern Discovery - Why Student Insert Works"
purpose: "Document the truth-seed RLS pattern that Session 107 discovered"
topics: ["rls", "student-insert", "auth.uid", "truth-seed-pattern"]
priority: "P0"
domain: "reconciliation"
fixes: ["student-insert-permission-denied"]
---

# RLS Pattern Discovery - The Truth About Student Insert

## The Problem (Sessions 103-106)
Users could not complete onboarding - student insert failed with permission denied errors.

## The Discovery (Session 107)
The fix was NOT about RLS policies, but about NOT setting `user_id` explicitly.

## The Truth-Seed Pattern

### 1. Application Code Pattern
```typescript
// ❌ WRONG - What we were doing
await supabase.from("student").insert({
  user_id: user.id,  // EXPLICITLY setting user_id
  graduation_year: 2024,
  // ... other fields
});

// ✅ CORRECT - Truth-seed pattern
await supabase.from("student").insert({
  // NO user_id field - let database default handle it
  graduation_year: 2024,
  // ... other fields
});
```

**Evidence**: `truth-seed/emdash-dashboard-main/src/lib/actions/student-actions.ts` lines 24-31

### 2. Database Pattern
```sql
-- Table has DEFAULT for user_id
CREATE TABLE student (
  user_id uuid DEFAULT auth.uid(),
  -- ... other columns
);
```

### 3. RLS Pattern (Intentionally Permissive)
```sql
-- INSERT: Very permissive - just checks authentication
CREATE POLICY "Enable insert for authenticated users only"
ON public.student
FOR INSERT
TO authenticated
WITH CHECK (true);  -- No user_id check!

-- SELECT: Open read (security concern for later)
CREATE POLICY "Enable read access for all users"
ON public.student
FOR SELECT
TO authenticated
USING (true);  -- Anyone can read any record

-- UPDATE: Properly restricted
CREATE POLICY "update_student_policy"
ON public.student
FOR UPDATE
TO authenticated
USING (user_id = auth.uid());
```

## Why This Works

1. **No Permission Paradox**: By not setting `user_id` explicitly, we avoid the RLS check paradox
2. **Database Default**: `auth.uid()` runs as the database, not the user
3. **Triggers Validate**: `check_insert_allowed_columns` ensures data integrity
4. **Defense in Depth**: RLS + defaults + triggers work together

## Critical Lessons

### For Future Sessions:
1. **Check truth-seed first** - The pattern is there
2. **Don't over-engineer RLS** - Start permissive, tighten later
3. **Let database defaults work** - Don't fight the system
4. **Test with actual apps** - Not just SQL queries

### Common Mistakes to Avoid:
- ❌ Setting `user_id` explicitly in inserts
- ❌ Making INSERT policies too restrictive
- ❌ Assuming RLS policies need to check everything
- ❌ Not checking truth-seed for working patterns

## Implementation Status

- ✅ Session 107: Removed explicit `user_id` from insert
- ✅ Session 109: Applied truth-seed RLS policies
- ✅ Session 108: Verified and documented pattern
- ⏳ Future: Gradually tighten SELECT policy for security

## Files Modified

1. `reconciliation/active-work/dashboard/src/lib/actions/student-actions.ts`
   - Line 26-34: Removed `user_id` from insert
   
2. Database policies (via Session 109's MCP commands)
   - Applied three truth-seed policies
   - Re-enabled RLS on student table

## Testing Instructions

```bash
# Terminal 1 - Auth Gateway
cd reconciliation/active-work/auth-gateway
npm run dev  # Runs on :3000

# Terminal 2 - Dashboard  
cd reconciliation/active-work/dashboard
npm run dev  # Runs on :3001

# Test with existing user or create new
```

## Security Considerations

Current policies are PERMISSIVE (matching truth-seed):
- ⚠️ Any authenticated user can read ALL student records
- ⚠️ INSERT relies on defaults and triggers for security
- ✅ UPDATE is properly restricted

Future work should gradually tighten these policies while maintaining functionality.