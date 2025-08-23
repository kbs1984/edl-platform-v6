---
session: "00053"
type: "documentation"
status: "current"
created: "2025-08-23"
title: "PostgREST v13.0.0 Update - Critical Changes"
purpose: "Document postgrest v13.0.0 update - critical changes"
topics: ['auth', 'documentation']
priority: "P0"
domain: "reconciliation"
---

# PostgREST v13.0.0 Update - Critical Changes

**Session**: 00053  
**Date**: 2025-08-22  
**Impact**: High - Changes our error handling strategy

## 🚨 Breaking Change: PGRST205 Now Definitive

### Old Understanding (Pre-v13.0.0)
- PGRST205 could mean EITHER:
  - Table doesn't exist
  - RLS is blocking access
- This ambiguity caused confusion and defensive coding

### New Reality (v13.0.0+)
- **PGRST205 = Table DOES NOT exist** (HTTP 404)
- **42501 = RLS blocking access** (HTTP 403/401)
- **Empty result = RLS filtering** (HTTP 200)

## 📊 Updated Error Interpretation Matrix

| Error Code | HTTP Status | Definitive Meaning | Action Required |
|------------|-------------|-------------------|-----------------|
| **PGRST205** | 404 | Table doesn't exist | Run migration / Fix table name |
| **42501** | 403/401 | RLS blocking access | Check policies / Use service role |
| **No error** | 200 | Empty due to RLS filter | Normal - no rows match policy |
| **PGRST301** | 401 | JWT error | Re-authenticate |
| **42P01** | 500 | PostgreSQL table missing | Database issue |

## 🔄 Service Role Key Migration

### Critical Deadline: November 1, 2025

**Old Format**: JWT-based keys
```
service_role: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**New Format**: Secret keys
```
service_role: sb_secret_abc123def456...
```

### Key Benefits of New Format
1. **Auto-rejects browser requests** - Can't accidentally expose
2. **Better rotation** - Easier key management
3. **Enhanced audit** - Better tracking

## 🛠️ Recommended Patterns

### 1. Smart Error Diagnosis

```typescript
async function diagnoseAccessError(tableName: string, error: any) {
  // v13.0.0+ makes this simple
  if (error.code === 'PGRST205') {
    return { 
      issue: 'TABLE_NOT_FOUND', 
      action: 'Table literally does not exist - check migration',
      certainty: 'DEFINITIVE'
    }
  }
  
  if (error.code === '42501') {
    return { 
      issue: 'RLS_BLOCKING', 
      action: 'Table exists but RLS prevents access',
      certainty: 'DEFINITIVE'
    }
  }
  
  return { issue: 'UNKNOWN', error }
}
```

### 2. Security Definer Functions

Instead of exposing service keys, use DB functions with elevated privileges:

```sql
-- Run once in database
CREATE OR REPLACE FUNCTION check_table_exists(table_name text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = table_name
  );
END;
$$;
```

Then call from client:
```typescript
const { data } = await supabase.rpc('check_table_exists', { 
  table_name: 'student' 
})
```

### 3. Community Tool Integration

**Supabase Backup System** (Raihan-Sharif):
- Complete schema extraction
- Works with RLS enabled
- No setup required
- Includes policies, triggers, views

**Supabase MCP Server** (Official):
```bash
npx -y @supabase/mcp-server-supabase@latest \
  --project-ref bbrheacetxlnqbibjwsz \
  --features=database,docs \
  --read-only
```

## 🔧 Migration Path for Our Codebase

### Immediate Changes Needed:

1. **Update Error Interpretation**
   - PGRST205 = Deployment issue, not security
   - Stop treating it as "RLS working"

2. **Add Security Definer Functions**
   - Deploy the functions to database
   - Use RPC calls instead of service keys for introspection

3. **Prepare for Key Migration**
   - Plan for November 2025 deadline
   - New keys will auto-block browser requests

### Testing Updates:

```typescript
describe('PostgREST v13 Error Handling', () => {
  it('PGRST205 means table missing', async () => {
    const result = await supabase
      .from('fake_table')
      .select('*')
    
    expect(result.error?.code).toBe('PGRST205')
    expect(interpretation.isDeploymentIssue).toBe(true)
    expect(interpretation.isSecurityBlock).toBe(false)
  })
  
  it('42501 means RLS blocking', async () => {
    const result = await supabase
      .from('protected_table')
      .select('*')
    
    expect(result.error?.code).toBe('42501')
    expect(interpretation.isSecurityBlock).toBe(true)
  })
})
```

## 📚 References

- [PostgREST v13.0.0 Release Notes](https://github.com/PostgREST/postgrest/releases/tag/v13.0.0)
- [Supabase Service Key Migration](https://supabase.com/docs/guides/platform/service-key-migration)
- [Supabase Backup System](https://github.com/Raihan-Sharif/supabase-backup)
- [Supabase MCP Server](https://github.com/supabase/mcp-server-supabase)

## ⚡ Action Items

- [ ] Update all PGRST205 error handlers
- [ ] Deploy security definer functions
- [ ] Document new error codes for team
- [ ] Plan service key migration before Nov 2025
- [ ] Integrate Supabase Backup System
- [ ] Test with PostgREST v13.0.0+

---

*This changes everything about how we handle "table not found" errors!*