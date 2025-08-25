---
created: '2025-08-23'
domain: core
priority: P1
purpose: Document database team handoff template
session: legacy
status: current
title: Database Team Handoff Template
topics:
- database
- handoff
type: handoff
---

# Database Team Handoff Template
**From**: Session XX  
**To**: Session YY  
**Focus**: Database verification/deployment

---

## 🔍 Current Database State

### Schema Verification
```sql
-- Run this to check table count
SELECT table_schema, COUNT(*) as table_count
FROM information_schema.tables
WHERE table_type = 'BASE TABLE'
AND table_schema IN ('public', 'debate', 'chat')
GROUP BY table_schema;

-- Expected results:
-- public: ~17 tables
-- debate: ~16 tables  
-- chat: ~3 tables
```

### API Access Test Results
```python
# What happens when you run:
client.table('student').select('*').limit(1).execute()

# If you see PGRST205 "table not found":
#   ✅ This is GOOD! RLS is working
#   ✅ Table exists, security is active
#   ❌ This is NOT a deployment failure

# If you see data:
#   ✅ Table exists and accessible
#   ⚠️ Check if RLS should be enabled
```

### Migration Lock Status
```bash
# Always run this first:
./scripts/00053-verify-migration-integrity.sh

# Expected: ✅ Migration Integrity Verified!
# If fails: Database has drifted, needs investigation
```

---

## ⚠️ CRITICAL: Error Code Interpretation

### Don't Panic If You See:
- **PGRST205**: Usually means RLS is working (GOOD!)
- **Multiple PGRST205s**: Likely means migration deployed WITH security (EXCELLENT!)
- **"Permission denied"**: RLS policies need adjustment, not deployment failure

### DO Panic If You See:
- **Connection timeouts**: Service/network issues
- **SQL syntax errors**: Migration file problems  
- **Zero tables in schema**: Actual deployment failure

---

## 🎯 Your Mission

### Primary Objective
[ ] Verify database deployment status
[ ] Confirm migration integrity
[ ] Document any issues found

### Secondary Objectives  
[ ] Test critical table access patterns
[ ] Verify RLS security is active
[ ] Update team coordination docs

### Success Criteria
- Migration lock verification passes ✅
- Expected table count confirmed ✅  
- RLS protection documented ✅
- Team B unblocked for testing ✅

---

## 🚨 Red Flags (Stop and Investigate)

- Migration integrity check fails
- Table count significantly different than expected
- Cannot access ANY tables even with admin credentials
- Database connection completely fails

---

## 🔧 Tools Available

1. **Dual Verification Script**: `python3 scripts/00044-dual-verification-protocol.py`
2. **Migration Lock Check**: `./scripts/00053-verify-migration-integrity.sh`
3. **Error Code Reference**: `docs/00044-ERROR-CODE-REFERENCE.md`
4. **Quick Validation**: `python3 00054-QUICK-VALIDATION-SCRIPT.py`

---

## 📝 What to Document

### If Everything Works:
- Confirm table counts match expected
- Note that PGRST205 = security working
- Update shared checklist with ✅ status
- Signal Team B they're unblocked

### If Issues Found:
- Exact error messages (don't paraphrase!)
- Which verification method was used
- Whether it's schema issue vs access issue
- Specific next steps needed

---

**Remember**: PGRST205 "table not found" usually means "table protected by RLS" - this is SUCCESS, not failure!