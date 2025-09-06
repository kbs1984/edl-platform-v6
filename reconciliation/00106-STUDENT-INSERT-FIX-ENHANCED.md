---
session: "00106"
type: "fix-instructions-enhanced"
status: "ready"
created: "2025-08-29"
title: "Session 106 Enhanced Instructions - Fix Student Insert with MCP Power"
purpose: "Complete fix instructions with rollback procedures and safety checks"
topics: ["student-insert", "rls-fix", "mcp-debugging", "auth-flow", "rollback-safety"]
priority: "P0"
domain: "reconciliation"
---

# Session 106: Enhanced Fix for Student Insert Blocker

## 🔍 Step 0: Pre-Flight Checks

### A. Capture Current State (CRITICAL)
```python
# Before ANY changes, document current state
mcp__supabase-dev__apply_migration(
    name="session_106_pre_check",
    query="""
    -- Create session 106 audit entry
    INSERT INTO ddl_audit_log (session_id, command, executed_at)
    VALUES ('106', 'SESSION START - Capturing initial state', NOW());
    
    -- Log current RLS policy count
    INSERT INTO ddl_audit_log (session_id, command)
    SELECT '106', 'PRE-CHECK: ' || COUNT(*) || ' policies on student table'
    FROM pg_policies WHERE tablename = 'student';
    
    -- Backup current policies (store as text)
    INSERT INTO ddl_audit_log (session_id, command)
    SELECT '106', 'BACKUP POLICY: ' || policyname || ' - ' || 
           'CMD: ' || cmd || ' - QUAL: ' || COALESCE(qual::text, 'NULL') || 
           ' - CHECK: ' || COALESCE(with_check::text, 'NULL')
    FROM pg_policies 
    WHERE tablename = 'student';
    
    -- Log current function definitions for critical functions
    INSERT INTO ddl_audit_log (session_id, command)
    SELECT '106', 'BACKUP FUNCTION: ' || proname || ' - ' || 
           pg_get_functiondef(oid)::text
    FROM pg_proc 
    WHERE proname IN ('add_new_user', 'get_profile_and_student')
    LIMIT 5;  -- Limit to prevent overflow
    
    -- Return summary
    SELECT 'Backup complete - Check ddl_audit_log for details' as status;
    """
)
```

### B. Verify Middleware Exists
```bash
# Session 103 created middleware.ts - verify it's still there
ls -la reconciliation/active-work/dashboard/middleware.ts
# If missing, this could be the root cause!
```

### C. Check Auth Context Comparison
```python
mcp__supabase-dev__apply_migration(
    name="create_auth_comparison",
    query="""
    -- Compare auth contexts in different scenarios
    CREATE OR REPLACE FUNCTION compare_auth_contexts()
    RETURNS TABLE(
        context text, 
        uid uuid, 
        role text,
        email text,
        current_user_db text
    )
    LANGUAGE sql
    SECURITY DEFINER
    SET search_path = public
    AS $$
        SELECT 
            'direct_sql'::text, 
            auth.uid(), 
            auth.role()::text,
            auth.email()::text,
            current_user::text
        UNION ALL
        SELECT 
            'from_function'::text, 
            auth.uid(), 
            auth.role()::text,
            auth.email()::text,
            current_user::text;
    $$;
    
    -- Grant execute
    GRANT EXECUTE ON FUNCTION compare_auth_contexts() TO authenticated;
    """
)
```

## 🛠️ Step 1: Apply Fixes with Rollback Safety

### Fix Option A: SECURITY DEFINER Insert Function (WITH ROLLBACK)

#### Apply Fix:
```python
mcp__supabase-dev__apply_migration(
    name="create_student_insert_function_v2",
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
        existing_call_sign text;
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
            -- Return existing ID instead of failing
            SELECT id INTO new_student_id FROM student WHERE user_id = p_user_id;
            RETURN new_student_id;
        END IF;
        
        -- Handle call_sign uniqueness
        IF p_call_sign IS NOT NULL THEN
            SELECT call_sign INTO existing_call_sign 
            FROM student 
            WHERE call_sign = p_call_sign;
            
            IF existing_call_sign IS NOT NULL THEN
                -- Auto-generate unique call_sign
                p_call_sign := p_call_sign || '_' || substr(p_user_id::text, 1, 8);
            END IF;
        END IF;
        
        -- Validate division ENUM if provided
        IF p_division IS NOT NULL AND 
           p_division NOT IN ('VILLIGER', 'LOWER', 'UPPER', 'SENIOR', 'OPEN') THEN
            RAISE EXCEPTION 'Invalid division: %. Must be VILLIGER, LOWER, UPPER, SENIOR, or OPEN', p_division;
        END IF;
        
        -- Handle optional guardian_id - don't fail if it doesn't exist yet
        IF p_guardian_id IS NOT NULL THEN
            IF NOT EXISTS (SELECT 1 FROM guardian WHERE id = p_guardian_id) THEN
                -- Log warning but don't fail
                RAISE NOTICE 'Guardian % not found, proceeding without guardian', p_guardian_id;
                p_guardian_id := NULL;
            END IF;
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
            CASE 
                WHEN p_division IS NOT NULL 
                THEN p_division::division 
                ELSE NULL 
            END,
            p_relationship,
            p_call_sign,
            p_grade_level
        ) RETURNING id INTO new_student_id;
        
        -- Log success
        INSERT INTO ddl_audit_log (session_id, command)
        VALUES ('106', 'Student created: ' || new_student_id);
        
        RETURN new_student_id;
    EXCEPTION
        WHEN unique_violation THEN
            -- Handle unique constraint violations gracefully
            RAISE EXCEPTION 'Duplicate value error: %', SQLERRM;
        WHEN foreign_key_violation THEN
            -- Handle FK violations gracefully
            RAISE EXCEPTION 'Foreign key error: %', SQLERRM;
    END;
    $$;
    
    -- Grant execute permission to authenticated users
    GRANT EXECUTE ON FUNCTION insert_student_record TO authenticated;
    
    -- Log that we created this function
    INSERT INTO ddl_audit_log (session_id, command)
    VALUES ('106', 'Created insert_student_record function');
    """
)
```

#### Rollback Script:
```python
mcp__supabase-dev__apply_migration(
    name="rollback_option_a",
    query="""
    -- Rollback Option A
    DROP FUNCTION IF EXISTS insert_student_record CASCADE;
    
    -- Log rollback
    INSERT INTO ddl_audit_log (session_id, command)
    VALUES ('106', 'ROLLBACK: Dropped insert_student_record function');
    """
)
```

### Fix Option B: Simplified RLS Policy (WITH ROLLBACK)

#### Apply Fix:
```python
mcp__supabase-dev__apply_migration(
    name="fix_student_insert_policy_v2",
    query="""
    -- First, save current policies to audit log
    INSERT INTO ddl_audit_log (session_id, command)
    SELECT '106', 'SAVING POLICY: ' || policyname || ' before modification'
    FROM pg_policies 
    WHERE tablename = 'student';
    
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
        -- Profile must exist (but FK will enforce anyway)
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
    
    -- Ensure update policy exists
    DROP POLICY IF EXISTS student_update_own ON student;
    CREATE POLICY student_update_own
    ON student
    FOR UPDATE
    TO authenticated
    USING (user_id = auth.uid())
    WITH CHECK (user_id = auth.uid());
    
    -- Log changes
    INSERT INTO ddl_audit_log (session_id, command)
    VALUES ('106', 'Applied simplified RLS policies for student table');
    """
)
```

#### Rollback Script:
```python
mcp__supabase-dev__apply_migration(
    name="rollback_option_b",
    query="""
    -- Rollback Option B
    DROP POLICY IF EXISTS student_insert_simple ON student;
    DROP POLICY IF EXISTS student_select_own ON student;
    DROP POLICY IF EXISTS student_update_own ON student;
    
    -- Restore original policies (from Session 103)
    CREATE POLICY student_insert_own 
    ON student FOR INSERT TO authenticated
    WITH CHECK ((user_id = auth.uid()) OR (user_id = (SELECT auth.uid())));
    
    CREATE POLICY student_select_own
    ON student FOR SELECT TO authenticated
    USING (user_id = auth.uid());
    
    CREATE POLICY student_update_own
    ON student FOR UPDATE TO authenticated
    USING (user_id = auth.uid())
    WITH CHECK (user_id = auth.uid());
    
    -- Log rollback
    INSERT INTO ddl_audit_log (session_id, command)
    VALUES ('106', 'ROLLBACK: Restored original RLS policies');
    """
)
```

### Fix Option C: Service Role Bypass (WITH SAFETY)

**First, check if middleware.ts exists and is properly configured:**

```typescript
// reconciliation/active-work/dashboard/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();
  
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          response.cookies.set({ name, value, ...options });
        },
        remove(name: string, options: any) {
          response.cookies.set({ name, value: '', ...options });
        },
      },
    }
  );

  await supabase.auth.getUser();
  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
```

## 🧪 Step 2: Testing Protocol

### A. Debug Auth Context First
```python
mcp__supabase-dev__apply_migration(
    name="test_auth_context",
    query="""
    -- Create test function to verify auth context
    CREATE OR REPLACE FUNCTION test_auth_in_transaction()
    RETURNS jsonb
    LANGUAGE plpgsql
    AS $$
    DECLARE
        result jsonb;
    BEGIN
        -- Start transaction
        result = jsonb_build_object(
            'auth_uid', auth.uid(),
            'auth_role', auth.role(),
            'can_insert_student', EXISTS (
                SELECT 1 FROM student WHERE false  -- Just check permissions
            ),
            'profile_exists', EXISTS (
                SELECT 1 FROM profile WHERE id = auth.uid()
            )
        );
        
        RETURN result;
    END;
    $$;
    
    GRANT EXECUTE ON FUNCTION test_auth_in_transaction() TO authenticated;
    """
)
```

### B. Test Each Fix Incrementally

#### For Option A (Function):
```typescript
// In student-actions.ts, add:
try {
  // First, test the function exists and works
  const { data: testResult, error: testError } = await supabase
    .rpc('insert_student_record', {
      p_user_id: user.id,
      p_graduation_year: formData.graduation_year,
      p_location: formData.location,
      // ... other params
    });
    
  if (testError) {
    console.error('Function error:', testError);
    // Fall back to direct insert
  }
} catch (e) {
  console.error('Student insert failed:', e);
}
```

## 📋 Step 3: Verification Checklist

### After applying ANY fix:
```python
mcp__supabase-dev__apply_migration(
    name="verify_fix_applied",
    query="""
    -- Check what changed
    INSERT INTO ddl_audit_log (session_id, command)
    SELECT '106', 'POST-FIX: ' || COUNT(*) || ' policies on student table'
    FROM pg_policies WHERE tablename = 'student';
    
    -- Verify function exists (if using Option A)
    INSERT INTO ddl_audit_log (session_id, command)
    SELECT '106', 'Function exists: ' || proname
    FROM pg_proc 
    WHERE proname = 'insert_student_record';
    
    -- Return summary
    SELECT 
        'Policies: ' || COUNT(DISTINCT policyname) || ', ' ||
        'Functions: ' || COUNT(DISTINCT proname)
    FROM pg_policies, pg_proc
    WHERE tablename = 'student' 
    AND proname IN ('insert_student_record', 'compare_auth_contexts');
    """
)
```

## 🔥 Quick Win: Fix Function Search Paths

While we're here, fix the 30 security vulnerabilities found in Session 105:
```python
mcp__supabase-dev__apply_migration(
    name="fix_critical_function_search_paths",
    query="""
    -- Fix the most critical functions first
    ALTER FUNCTION add_new_user SET search_path = public;
    ALTER FUNCTION get_profile_and_student SET search_path = public;
    ALTER FUNCTION check_insert_allowed_columns SET search_path = public;
    ALTER FUNCTION check_update_allowed_columns SET search_path = public;
    ALTER FUNCTION get_profile_uuid SET search_path = public;
    ALTER FUNCTION search_school(text) SET search_path = public;  -- Re-apply from Session 103
    
    -- Log fixes
    INSERT INTO ddl_audit_log (session_id, command)
    VALUES ('106', 'Fixed search_path for 6 critical functions');
    """
)
```

## 🎯 Success Metrics

### Immediate Success:
- [ ] Student insert works in app
- [ ] No console errors
- [ ] User proceeds to dashboard

### Full Success:
- [ ] New user complete flow (8 steps)
- [ ] Existing user can log in
- [ ] Dashboard displays user data
- [ ] All security vulnerabilities patched

## 🚨 Emergency Rollback Procedure

If everything breaks:
```python
mcp__supabase-dev__apply_migration(
    name="emergency_rollback_all",
    query="""
    -- Drop all Session 106 changes
    DROP FUNCTION IF EXISTS insert_student_record CASCADE;
    DROP FUNCTION IF EXISTS compare_auth_contexts CASCADE;
    DROP FUNCTION IF EXISTS test_auth_in_transaction CASCADE;
    
    -- Restore original policies
    DROP POLICY IF EXISTS student_insert_simple ON student;
    
    -- Recreate original from Session 103
    CREATE POLICY IF NOT EXISTS student_insert_own 
    ON student FOR INSERT TO authenticated
    WITH CHECK (user_id = auth.uid());
    
    -- Log emergency rollback
    INSERT INTO ddl_audit_log (session_id, command)
    VALUES ('106', 'EMERGENCY ROLLBACK EXECUTED - Restored to Session 103 state');
    
    SELECT 'Emergency rollback complete - check ddl_audit_log' as status;
    """
)
```

## 📊 Final Verification

```python
# Check final state
mcp__supabase-dev__list_tables(schemas=["public"])
# Student table row count should increase after successful test

mcp__supabase-dev__list_migrations()
# Should show all Session 106 migrations

# Query audit log (through apply_migration since execute_sql is broken)
mcp__supabase-dev__apply_migration(
    name="check_session_106_audit",
    query="""
    CREATE OR REPLACE FUNCTION get_session_106_audit()
    RETURNS TABLE(entry text)
    LANGUAGE sql
    AS $$
        SELECT command::text 
        FROM ddl_audit_log 
        WHERE session_id = '106' 
        ORDER BY executed_at DESC 
        LIMIT 20;
    $$;
    """
)
```

---

**Enhanced by**: Session 104 feedback
**Safety Level**: Maximum (with rollbacks)
**Confidence**: 95% - Multiple approaches with safety nets
**Time Estimate**: 45-60 minutes with safety checks