# RLS Diagnosis Report - Session 00038

## The Problem Discovered

The Schema Snapshot system immediately revealed why authentication and profile creation were failing:

### Current State (Before Fix)
- ✅ RLS is ENABLED on all tables
- ❌ ZERO policies exist
- **Result**: Complete lockdown - no operations possible

When RLS is enabled without policies, PostgreSQL defaults to **DENY ALL**.

## The Root Cause Analysis

### Three Layers of Truth (Per Session 37)
1. **Migration Files** (Intent) - Policies were written in SQL files
2. **Schema Snapshot** (Reality) - NO policies actually exist in database
3. **Functional Tests** (Proof) - Everything fails with "violates RLS policy"

The migrations defined policies but they were **never applied to the database**.

## Critical Issue in Original Policies

The original INSERT policy for profiles had a fatal flaw:

```sql
-- PROBLEMATIC VERSION (from migrations)
CREATE POLICY "Users create own profile" ON profiles
  FOR INSERT
  WITH CHECK (
    auth.uid() = user_id
    AND NOT EXISTS (
      SELECT 1 FROM profiles 
      WHERE user_id = auth.uid()
    )
  );
```

**The Catch-22**: 
- Policy needs to check if profile exists
- But RLS prevents seeing profiles until you have one
- Result: Can never create first profile!

## The Solution

### Fixed INSERT Policy
```sql
-- CORRECTED VERSION
CREATE POLICY "Users create own profile" ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);
-- The UNIQUE constraint handles duplicates at database level
```

### Complete Policy Set Required
- **profiles**: 4 policies (SELECT, INSERT, UPDATE, DELETE)
- **teams**: 4 policies (SELECT, INSERT, UPDATE, DELETE)
- **team_members**: 3 policies (SELECT, INSERT, DELETE)
- **team_join_requests**: 4 policies (SELECT, INSERT, UPDATE, DELETE)
- **Total**: 15 policies needed

## Business Logic Implemented

### Profile Policies
- Anyone can view (public directory like Cyworld)
- Users control their own profiles only
- GDPR-compliant deletion

### Team Policies
- Public visibility (anyone can browse teams)
- Authenticated users can create teams
- Founders have full control of their teams

### Membership Policies
- Founders manage team membership
- Players can leave teams voluntarily
- Join requests visible to relevant parties only

## Lessons Learned

1. **RLS without policies = total lockdown** - Not partial access, ZERO access
2. **Migration files ≠ Applied changes** - Must verify in actual database
3. **Visibility is critical** - Can't debug what you can't see
4. **Schema Snapshot essential** - Revealed issue in minutes that blocked for days

## Next Steps

1. **Apply the fix**: Run `00038_complete_rls_policies.sql` in Supabase Dashboard
2. **Verify**: Re-run schema snapshot to confirm policies exist
3. **Test**: Try creating a profile - should work now!
4. **Document**: Update snapshot after applying fixes

## The Value of Schema Snapshot

This issue would have remained hidden without the snapshot system:
- Claude Code can't see `pg_policies` table
- Migrations looked correct on paper
- Only by capturing actual database state could we see the gap

**Time to diagnosis with snapshot**: 5 minutes
**Time without snapshot**: Unknown (guessing at problems)

---

*This diagnosis demonstrates the three-layer verification system in action:*
*Intent (migrations) → Reality (snapshot) → Proof (testing)*