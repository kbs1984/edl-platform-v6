---
created: '2025-08-23'
domain: core
priority: P1
purpose: "Document \U0001F680 migration ready - session 00050"
session: '00050'
status: draft
title: "\U0001F680 MIGRATION READY - Session 00050"
topics:
- migration
- documentation
type: guide
---

# 🚀 MIGRATION READY - Session 00050

**Status**: ✅ READY FOR EXECUTION  
**Migration File**: `migrations/desktop-edl-complete-migration-draft.sql`  
**Verified Against**: 53 JSON files from truth-seed project  
**Date**: 2025-08-22  

---

## Verification Summary

✅ **All 36 application tables**: Correctly defined  
✅ **Call sign column**: Added to student table  
✅ **Type conversions**: All fixed (uuid_generate_v4 → gen_random_uuid, etc.)  
✅ **Reserved word handling**: "group" column properly quoted  
✅ **Schema organization**: chat, debate, public schemas correct  
✅ **System tables**: Correctly excluded (managed by Supabase)  

**NO FIXES REQUIRED** - Desktop's draft is 100% ready!

---

## How to Execute Migration

### Option A: Via Supabase Dashboard (Recommended for large migration)

1. Go to: https://supabase.com/dashboard/project/bbrheacetxlnqbibjwsz/sql/new
2. Copy the contents of `migrations/desktop-edl-complete-migration-draft.sql`
3. Paste into SQL Editor
4. Click "Run" 
5. Monitor for any errors

### Option B: Via Supabase CLI

```bash
# If migration is too large for dashboard
supabase db push --db-url "postgresql://postgres:[password]@db.bbrheacetxlnqbibjwsz.supabase.co:5432/postgres"
```

### Option C: Split Migration (if needed)

If the file is too large, split into phases:
1. Types and schemas
2. Tables without constraints
3. Primary keys
4. Foreign keys
5. Indexes

---

## Post-Migration Checklist

After running the migration:

1. **Verify with Reality Agents**:
```bash
SUPABASE_URL="https://bbrheacetxlnqbibjwsz.supabase.co" \
SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJicmhlYWNldHhsbnFiaWJqd3N6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ3MjI4MTIsImV4cCI6MjA3MDI5ODgxMn0.fccLx-9NymP8oqHT_-t-ZPZx0hgi8SGfHUJv1WKmwFE" \
python3 reality/agent-reality-auditor/supabase-connector/quickstart.py
```

2. **Check table count**:
```sql
SELECT COUNT(*) FROM information_schema.tables 
WHERE table_schema IN ('public', 'chat', 'debate');
-- Should return: 36
```

3. **Verify call_sign column**:
```sql
SELECT column_name FROM information_schema.columns 
WHERE table_name = 'student' AND column_name = 'call_sign';
-- Should return: call_sign
```

---

## Next Steps After Migration

1. **Deploy Auth Gateway**:
   - Update environment variables in truth-seed/emdash-auth-main
   - Fix hardcoded project ID (line 21)
   - Deploy to Vercel

2. **Deploy Dashboard**:
   - Update environment variables in truth-seed/emdash-dashboard-main
   - Ensure call sign selection page is integrated
   - Deploy to Vercel

3. **Test Full Flow**:
   - Sign up new user
   - Email verification
   - Login
   - Call sign selection
   - Dashboard access

---

## Important Notes

- Database is currently EMPTY and ready for migration
- No old 4-table system to clean up
- Migration includes all relationships and constraints
- RLS policies will need to be added separately (not in this migration)

---

## Files Involved

- **Migration SQL**: `migrations/desktop-edl-complete-migration-draft.sql`
- **Verification Script**: `scripts/00050-verify-migration-assumptions.py`
- **Verification Report**: `migrations/00050-migration-verification-report.md`
- **Source Data**: `truth-seed/supabase-migration/*.json` (53 files)

---

*Migration verified and ready - Session 00050*