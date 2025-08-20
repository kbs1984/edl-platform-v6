-- Session 00040: Verify auth context and test profile creation

-- Check current user context (run while logged in via Dashboard or app)
SELECT auth.uid() as current_user_id, current_user as db_user;

-- Check if any test profiles exist
SELECT 
    call_sign,
    user_id,
    role,
    grade_level,
    created_at
FROM profiles
WHERE call_sign LIKE 'TEST%'
ORDER BY created_at DESC
LIMIT 5;

-- Test direct insert (this will work in SQL Editor with your admin context)
-- But helps verify table structure is correct
INSERT INTO profiles (user_id, call_sign, role, grade_level)
VALUES (
    '9cb530c9-a548-43e8-972a-983924db1e8e',  -- The user we just created
    'TEST_SQL_' || extract(epoch from now())::int,
    'player',
    7
)
ON CONFLICT (user_id) 
DO UPDATE SET 
    call_sign = EXCLUDED.call_sign,
    grade_level = EXCLUDED.grade_level
RETURNING *;

-- If the above INSERT works, the table structure is fine
-- The issue is specifically with RLS policy evaluation

-- Let's check what the policy actually sees
SELECT 
    policyname,
    cmd,
    roles,
    with_check
FROM pg_policies
WHERE tablename = 'profiles'
AND cmd = 'INSERT';