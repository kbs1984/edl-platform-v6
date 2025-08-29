---
session: "00106"
type: "fix-instructions"
status: "ready"
created: "2025-08-29"
title: "Session 106 Instructions - Fix Student Insert with MCP Power"
purpose: "Leverage MCP server to diagnose and fix the student insert permission issue"
topics: ["student-insert", "rls-fix", "mcp-debugging", "auth-flow"]
priority: "P0"
domain: "reconciliation"
---

# Session 106: Fix Student Insert Blocker with MCP Server

## 🎯 Mission
Fix the final blocker preventing auth → dashboard flow completion. Session 103 fixed school search but hit a mysterious student insert permission issue. Now with MCP server power, we can diagnose and fix this properly.

## 📊 Current Situation

### What Works ✅
1. **School Search**: FIXED with SECURITY DEFINER (Session 103)
2. **Auth Flow**: Steps 1-6 working
3. **Manual SQL Insert**: Works when executed directly
4. **MCP Server**: Full DDL access available (Session 104-105)

### What's Broken ❌
- **Student Form Submission**: "permission denied for table student"
- Manual SQL with same data works
- App insert with same user fails
- Indicates auth context mismatch

### Current Database State (via MCP):
- `student` table: **RLS enabled**, 13 rows
- `profile` table: **RLS enabled**, 18 rows  
- `school` table: **RLS enabled**, 5 rows
- All tables have proper foreign key relationships

## 🔍 Step 1: Diagnose with MCP

### A. Check Current RLS Policies
```python
# Since execute_sql has crypto error, use apply_migration to query
mcp__supabase-dev__apply_migration(
    name="debug_student_policies",
    query="""
    -- Create temporary function to debug policies
    CREATE OR REPLACE FUNCTION debug_student_policies()
    RETURNS TABLE(
        policy_name text,
        command text,
        using_expr text,
        check_expr text
    )
    LANGUAGE sql
    SECURITY DEFINER
    AS $$
        SELECT 
            policyname::text,
            cmd::text,
            qual::text as using_expr,
            with_check::text as check_expr
        FROM pg_policies 
        WHERE tablename = 'student'
        ORDER BY policyname;
    $$;
    
    -- Call it to see results (won't work but creates the function)
    SELECT * FROM debug_student_policies();
    """
)
```

### B. Test Auth Context in Server Action
Create a debug function to verify auth context:
```python
mcp__supabase-dev__apply_migration(
    name="create_auth_debug_function",
    query="""
    CREATE OR REPLACE FUNCTION debug_auth_context()
    RETURNS jsonb
    LANGUAGE plpgsql
    SECURITY DEFINER
    AS $$
    DECLARE
        result jsonb;
    BEGIN
        result = jsonb_build_object(
            'auth_uid', auth.uid(),
            'auth_role', auth.role(),
            'auth_email', auth.email(),
            'current_user', current_user,
            'session_user', session_user
        );
        RETURN result;
    END;
    $$;
    """
)
```

## 🛠️ Step 2: Apply Fixes with MCP

### Fix Option A: Nuclear Option - SECURITY DEFINER Insert Function
```python
mcp__supabase-dev__apply_migration(
    name="create_student_insert_function",
    query="""
    -- Create SECURITY DEFINER function for student insert
    CREATE OR REPLACE FUNCTION insert_student_record(
        p_user_id uuid,
        p_graduation_year bigint,
        p_location text,
        p_school_id uuid DEFAULT NULL,
        p_guardian_id uuid DEFAULT NULL,
        p_division text DEFAULT NULL,
        p_relationship text DEFAULT NULL,
        p_call_sign text DEFAULT NULL,
        p_grade_level integer DEFAULT NULL
    )
    RETURNS uuid
    LANGUAGE plpgsql
    SECURITY DEFINER
    SET search_path = public
    AS $$
    DECLARE
        new_student_id uuid;
    BEGIN
        -- Verify the user is authenticated and matches the user_id
        IF auth.uid() IS NULL OR auth.uid() != p_user_id THEN
            RAISE EXCEPTION 'Unauthorized: User must be authenticated and inserting own record';
        END IF;
        
        -- Verify profile exists
        IF NOT EXISTS (SELECT 1 FROM profile WHERE id = p_user_id) THEN
            RAISE EXCEPTION 'Profile must exist before creating student record';
        END IF;
        
        -- Check for existing student record
        IF EXISTS (SELECT 1 FROM student WHERE user_id = p_user_id) THEN
            RAISE EXCEPTION 'Student record already exists for this user';
        END IF;
        
        -- Insert the student record
        INSERT INTO student (
            user_id,
            graduation_year,
            location,
            school_id,
            guardian_id,
            division,
            relationship_with_guardian,
            call_sign,
            grade_level
        ) VALUES (
            p_user_id,
            p_graduation_year,
            p_location,
            p_school_id,
            p_guardian_id,
            p_division::division,
            p_relationship,
            p_call_sign,
            p_grade_level
        ) RETURNING id INTO new_student_id;
        
        RETURN new_student_id;
    END;
    $$;
    
    -- Grant execute permission to authenticated users
    GRANT EXECUTE ON FUNCTION insert_student_record TO authenticated;
    """
)
```

### Fix Option B: Simplified RLS Policy
```python
mcp__supabase-dev__apply_migration(
    name="fix_student_insert_policy",
    query="""
    -- Drop existing problematic policies
    DROP POLICY IF EXISTS student_insert_own ON student;
    DROP POLICY IF EXISTS student_insert_authenticated ON student;
    
    -- Create a clean, simple insert policy
    CREATE POLICY student_insert_simple
    ON student
    FOR INSERT
    TO authenticated
    WITH CHECK (
        -- User can only insert their own record
        user_id = auth.uid()
        -- Profile must exist (foreign key will enforce this anyway)
        AND EXISTS (
            SELECT 1 FROM profile 
            WHERE id = auth.uid()
        )
    );
    
    -- Ensure select policy exists for verification
    DROP POLICY IF EXISTS student_select_own ON student;
    CREATE POLICY student_select_own
    ON student
    FOR SELECT
    TO authenticated
    USING (user_id = auth.uid());
    """
)
```

### Fix Option C: Temporary Service Role Bypass
If all else fails, modify the server action to use service role:
```typescript
// In student-actions.ts
import { createClient } from '@supabase/supabase-js';

// Create service role client for student insert only
const serviceClient = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!, // Add to .env.local
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

// Use for insert, but validate user first
const { data: user } = await supabase.auth.getUser();
if (!user) throw new Error('Not authenticated');

// Insert with service role client
const { data, error } = await serviceClient
  .from('student')
  .insert({
    user_id: user.user.id,
    // ... other fields
  });
```

## 🧪 Step 3: Test the Fix

### A. Test via Server Action
After applying one of the fixes above, test the actual form submission:
1. Start both apps (auth on :3000, dashboard on :3001)
2. Sign up new user or use existing
3. Complete onboarding flow
4. Monitor console for errors

### B. Verify with MCP
```python
# Check if student record was created
mcp__supabase-dev__list_tables(schemas=["public"])
# Look for increased row count in student table

# If using the SECURITY DEFINER function:
mcp__supabase-dev__apply_migration(
    name="test_student_insert_function",
    query="""
    -- Test the function (will fail but shows it exists)
    SELECT insert_student_record(
        auth.uid(),
        2025,
        'Test Location',
        NULL, NULL, NULL, NULL, 'test_call_sign', NULL
    );
    """
)
```

## 📋 Step 4: Complete Integration Test

Once student insert is fixed:

### Full 8-Step Test
1. **Apps Start**: ✅ (already working)
2. **Sign Up**: ✅ (use new email)
3. **Email Verify**: ✅ (check email)
4. **Login**: ✅ (redirects to dashboard)
5. **Step 1**: ✅ (select Student role)
6. **Step 2**: ✅ (basic info form)
7. **Step 3**: ✅ School search + **Student insert**
8. **Dashboard**: Should load with user data!

## 🎯 Success Criteria

The auth → dashboard flow is complete when:
- [ ] New user can sign up
- [ ] Email verification works
- [ ] Onboarding completes without errors
- [ ] Student record is created in database
- [ ] Dashboard loads with user's data
- [ ] No console errors

## 💡 Additional MCP Debugging Tools

### Check for Triggers
```python
mcp__supabase-dev__apply_migration(
    name="check_student_triggers",
    query="""
    CREATE OR REPLACE FUNCTION list_student_triggers()
    RETURNS TABLE(trigger_name text, event text, timing text)
    LANGUAGE sql
    SECURITY DEFINER
    AS $$
        SELECT 
            tgname::text as trigger_name,
            CASE 
                WHEN tgtype & 4 = 4 THEN 'INSERT'
                WHEN tgtype & 8 = 8 THEN 'DELETE'
                WHEN tgtype & 16 = 16 THEN 'UPDATE'
                ELSE 'UNKNOWN'
            END as event,
            CASE
                WHEN tgtype & 2 = 2 THEN 'BEFORE'
                ELSE 'AFTER'
            END as timing
        FROM pg_trigger
        WHERE tgrelid = 'student'::regclass
        AND tgname NOT LIKE 'RI_%';  -- Exclude foreign key triggers
    $$;
    """
)
```

### Fix Function Search Paths (Session 105 finding)
```python
# Fix the 30 functions with mutable search paths
mcp__supabase-dev__apply_migration(
    name="fix_function_search_paths",
    query="""
    -- Fix critical auth functions
    ALTER FUNCTION add_new_user(text, text, text) SET search_path = public;
    ALTER FUNCTION get_profile_and_student(uuid) SET search_path = public;
    ALTER FUNCTION check_insert_allowed_columns() SET search_path = public;
    ALTER FUNCTION check_update_allowed_columns() SET search_path = public;
    -- Add more as needed from the security advisor list
    """
)
```

## 🚀 Recommended Approach

1. **Start with Fix Option A** (SECURITY DEFINER function)
   - Most reliable, bypasses RLS complexity
   - Still maintains security checks
   - Easy to test and rollback

2. **If that fails, try Fix Option B** (Simplified RLS)
   - Cleaner policy structure
   - Easier to debug

3. **Last resort: Fix Option C** (Service role)
   - Guaranteed to work
   - Less secure, use temporarily
   - Plan to migrate back to RLS later

## 📝 Notes for Session 106

- MCP server eliminates the "please run this SQL" friction
- Can iterate quickly on fixes
- All DDL operations are tracked via migration history
- Use `mcp__supabase-dev__list_migrations()` to see what was applied
- Remember: execute_sql has crypto error, use apply_migration for everything

## 🎉 Expected Outcome

By the end of Session 106:
- Student insert issue RESOLVED
- Full auth → dashboard flow WORKING
- All 8 integration steps PASSING
- Ready to deploy to production!

---

**MCP Power Level**: Maximum 🚀
**Confidence**: High - we have direct database control
**Time Estimate**: 30-60 minutes to complete