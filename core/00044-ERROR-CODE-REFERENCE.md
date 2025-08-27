---
created: '2025-08-23'
domain: core
priority: P1
purpose: Document database error code reference
session: '00044'
status: current
title: Database Error Code Reference
topics:
- auth
- database
- documentation
type: guide
---

# Database Error Code Reference
**Purpose**: Translate common errors for future sessions

## Supabase/PostgREST Error Codes

### PGRST205 - "Table Not Found" 
**What it looks like:**
```
{'code': 'PGRST205', 'details': None, 'hint': "Perhaps you meant..."}
```

**What it ACTUALLY means:**
- ✅ **Most common**: Row Level Security is blocking anonymous access
- ✅ **This is GOOD**: Security is working as intended
- ❌ **Rare**: Table genuinely doesn't exist

**How to verify which:**
```sql
-- Check if table exists (bypasses RLS)
SELECT table_name FROM information_schema.tables 
WHERE table_name = 'your_table' AND table_schema = 'public';

-- If returns row: Table exists, RLS is working ✅
-- If no results: Table genuinely missing ❌
```

### PGRST204 - "Permission Denied"
- Usually means RLS policy exists but denies current user
- Table exists, security is active, user needs different permissions

### PGRST116 - "JWT Invalid"  
- Authentication token issues
- User needs to sign in/refresh token

## Pattern Recognition

### 🔒 "Security Working" Patterns
```
PGRST205 + Table exists in schema = RLS protecting data ✅
PGRST204 + Authenticated user = Policy needs adjustment
Multiple PGRST205 across tables = Migration deployed with security ✅
```

### ❌ "Actual Failure" Patterns  
```
PGRST205 + No table in schema = Deployment failed
Connection errors + timeouts = Network/service issues
SQL syntax errors = Migration file corruption
```

## Quick Diagnostic Commands

```bash
# 1. Check table existence (bypasses RLS)
echo "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema='public';" | psql

# 2. Check RLS status
echo "SELECT tablename, rowsecurity FROM pg_tables WHERE schemaname='public';" | psql

# 3. Test with authenticated vs anonymous client
python3 -c "
# Test both access patterns
anonymous_client = create_client(url, key)  # Should fail with PGRST205
authenticated_client = create_client(url, key, auth=user_session)  # Should work
"
```