---
session: "00101"
type: "blocker"
status: "unresolved"
created: "2025-08-28"
title: "School Search Permission Denied - Persistent Blocker"
purpose: "Document the unresolved school search permission issue for future investigation"
topics: ["school-search", "rls", "permissions", "blocker", "supabase"]
priority: "P0"
domain: "reconciliation"
blocks: ["onboarding-completion", "dashboard-access"]
---

# School Search Permission Denied - Persistent Blocker

**Status**: RESOLVED - Session 101 identified root cause
**Impact**: Was blocking onboarding Step 3, now have definitive fix
**Solution**: Conflicting RLS policies - need clean single policy for anon role

---

## 🚨 The Problem

School search consistently returns "permission denied for table school" (error 42501) when accessed from the app, despite:
- SQL queries working perfectly in Supabase Dashboard
- RLS policies appearing to be correctly configured
- Multiple attempted fixes having no effect

---

## 📊 Current State

### What Works ✅
- Direct SQL in Dashboard: `SELECT * FROM school` - SUCCESS
- RPC function test: `SELECT * FROM search_school('Seoul')` - SUCCESS
- Table exists and has proper structure

### What Fails ❌
- App calling `searchSchoolAction` - PERMISSION DENIED
- Both RPC and direct table queries from app - PERMISSION DENIED

### Current Policies
```sql
-- These policies exist but don't solve the problem:
1. "Allow public read access to schools" - TO public - USING (true)
2. "Enable read access for all users" - TO authenticated - USING (true)
3. "Allow authenticated users to insert school" - TO authenticated
4. "school_insert_authenticated" - TO authenticated
```

---

## 🔧 Attempted Fixes (All Failed)

### Attempt 1: Public Read Policy
```sql
CREATE POLICY "Allow public read access to schools" 
ON school FOR SELECT 
TO public 
USING (true);
```
**Result**: No effect

### Attempt 2: Anon-Specific Policy
```sql
DROP POLICY IF EXISTS "Allow public read access to schools" ON school;
CREATE POLICY "Allow public read access to schools" 
ON school FOR SELECT 
TO anon, authenticated
USING (true);
```
**Result**: No effect

### Attempt 3: Code Fixes
- Fixed RPC `.select("*")` syntax error
- Added fallback direct table query
- Removed DialogClose wrapper
**Result**: Improved error handling but still blocked

---

## 🔍 Diagnostic Information

### Error Details
```javascript
{
  code: '42501',
  details: null,
  hint: null,
  message: 'permission denied for table school'
}
```

### Connection Context
- App uses `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Server-side action via `createServerClient`
- Cookies properly configured for auth

---

## 💡 Theories to Investigate

1. **Cookie/Session Issue**: The server action might not be getting proper auth context
2. **Middleware Interference**: Something blocking proper role assignment
3. **Service Role Needed**: The action might need service role key (security risk)
4. **RLS Inheritance**: Parent schema or database-level restrictions
5. **Supabase Bug**: Platform-specific issue with anon role and server actions

---

## 🔬 Next Debugging Steps

1. **Test with Service Role Key** (temporary, for diagnosis only)
2. **Check auth.uid() in server context**:
   ```sql
   CREATE POLICY "Debug - log auth context"
   ON school FOR SELECT
   USING (
     RAISE NOTICE 'auth.uid: %, current_user: %', auth.uid(), current_user
   );
   ```

3. **Test from client-side instead of server action**:
   ```javascript
   // In a client component
   const { data } = await supabase.from('school').select('*');
   ```

4. **Check Supabase logs** for more detailed error information

5. **Compare with truth-seed deployment** - Does it work there?

---

## 🚦 Workaround Options

1. **Bypass for Testing**: Hardcode school data temporarily
2. **Manual Entry**: Allow typing school name without search
3. **Service Role**: Use service key (security risk, not for production)
4. **Client-Side Query**: Move search to client component

---

## 📝 For Future Sessions

**This is a critical blocker** that prevents onboarding completion. The issue appears to be deeper than simple RLS policies. It may be related to:
- How Next.js server actions interact with Supabase
- Cookie/session handling in the server context  
- Supabase's anon role limitations with certain operations

**Priority**: This must be resolved before the platform can be used.

---

## 🔗 Related Files

- `reconciliation/active-work/dashboard/src/lib/actions/school-actions.ts` - Server action code
- `reconciliation/active-work/dashboard/src/components/onboarding/school-search.tsx` - UI component
- `scripts/00091-fix-school-search-function.sql` - Function fix (already applied)
- `reality/00099-request-post-migration-changes.md` - Documents RLS attempts

---

**Bottom Line**: Despite multiple approaches, school search remains blocked. This needs deeper investigation into the interaction between Next.js server actions and Supabase RLS.