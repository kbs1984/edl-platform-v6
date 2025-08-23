---
session: "unknown"
type: "documentation"
status: "current"
created: "2025-08-23"
title: "🔒 MANDATORY Pre-Session Security Checklist"
purpose: "Document 🔒 mandatory pre-session security checklist"
topics: ['auth', 'database', 'session-log', 'documentation']
priority: "P1"
domain: "reconciliation"
---

# 🔒 MANDATORY Pre-Session Security Checklist
**Created**: Session 00045 (Prevention Protocol)  
**Purpose**: Prevent RLS/Database confusion for ALL future sessions

---

## ⚠️ READ THIS BEFORE ANY DATABASE WORK

**If you're working with the emdash/truth-seed database, you MUST understand this:**

### 🎯 Critical Mental Shift Required

**OLD thinking**: Working database = all queries succeed  
**NEW reality**: Secure database = unauthorized queries properly BLOCKED

---

## ✅ Security Mindset Checklist

Before starting ANY database work, confirm:

- [ ] **I understand PGRST205 = SUCCESS**  
  "Could not find table" usually means RLS is protecting data correctly

- [ ] **I will NOT test sensitive tables with anonymous client**  
  Anonymous queries SHOULD be blocked on protected tables

- [ ] **I will use authenticated client after user signup**  
  Test the real user flow, not administrative backdoors

- [ ] **I know RLS blocking access is DESIRED behavior**  
  Enterprise security means unauthorized access fails

---

## 🧪 Correct Testing Protocol

### ❌ WRONG Approach (Will Cause Panic):
```python
# This will fail with PGRST205 and you'll think database is broken
client = createClient(url, anonKey)
await client.from('student').select('*')  # BLOCKED BY RLS
# Result: "Database deployment failed!"
```

### ✅ CORRECT Approach (Will Show Success):
```python
# Step 1: Verify table exists at schema level
# Use information_schema queries or admin client

# Step 2: Test security is working (expect blocks)
client = createClient(url, anonKey)
try:
    await client.from('student').select('*')
    console.log("❌ SECURITY ISSUE: Anonymous access succeeded!")
except (error) {
    if (error.includes('PGRST205')) {
        console.log("✅ SECURITY WORKING: RLS blocked access")
    }
}

# Step 3: Test authenticated access (should work)
await client.auth.signUp({email, password})
await client.from('student').select('*')  # Should work after auth
```

---

## 🚨 Red Flags - Don't Do These Things

- ❌ **Seeing PGRST205 and declaring "database broken"**
- ❌ **Testing sensitive data with anonymous client**  
- ❌ **Panicking when RLS blocks unauthorized access**
- ❌ **Assuming "can't query" = "doesn't exist"**
- ❌ **Escalating to "database crisis" without testing authentication**

---

## 🔍 Standard Verification Steps

### Step 1: Schema Existence Check
```sql
-- In Supabase SQL Editor (this will work)
SELECT table_name, table_schema 
FROM information_schema.tables 
WHERE table_name IN ('student', 'profile', 'team');
```

### Step 2: Security Verification
```bash
# Run this script to test correctly
python3 scripts/00055-test-database-access.sh
```

### Step 3: Authenticated Testing
Only after confirming:
- ✅ Tables exist in schema
- ✅ RLS is blocking anonymous access
- Then test with authenticated user

---

## 📖 Expected "Error" Messages

**These are SUCCESS indicators, not problems:**

| Error Code | Message | What It Really Means |
|------------|---------|---------------------|
| PGRST205 | "Could not find table" | RLS is protecting the table ✅ |
| 42501 | "Insufficient privileges" | Security policies working ✅ |
| 42P01 | "Relation does not exist" | Check schema + RLS combination |

---

## 🎯 When to Escalate vs Self-Resolve

### ✅ Handle Yourself:
- PGRST205 on sensitive tables (expected)
- Anonymous queries blocked (correct behavior)
- Need to test with authenticated client

### ⚠️ Escalate If:
- Tables missing from information_schema
- Authenticated queries fail after proper signup
- Complete system unresponsive
- Schema corruption detected

---

## 🛠️ Available Tools

### Testing Scripts:
- `scripts/00055-test-database-access.sh` - RLS-aware testing
- `00054-QUICK-VALIDATION-SCRIPT.py` - Database state verification

### Documentation:
- `docs/00044-ERROR-CODE-REFERENCE.md` - Error code meanings
- `CLAUDE.md` - Database Verification Protocol section

### Emergency Contacts:
- Database issues: Sessions 44, 53 (database authorities)
- RLS policy questions: Check migration documentation first

---

## 🏆 Success Indicators

You're on the right track when:
- ✅ Anonymous queries properly blocked
- ✅ Schema shows tables exist  
- ✅ Authenticated queries succeed
- ✅ You interpret blocks as security success

---

## 📋 Quick Self-Assessment

Before starting work, answer:
1. **Do I expect PGRST205 on protected tables?** (Should be YES)
2. **Will I test anonymous access first?** (Should be YES, expect blocks)
3. **Do I have authenticated testing ready?** (Should be YES)
4. **Will I panic if RLS blocks access?** (Should be NO)

If any answer is wrong, re-read this checklist!

---

**🔐 Remember: In production systems, security working correctly often looks like "errors" to inexperienced eyes. Your job is to distinguish between security success and actual failures.**

---

*Prevention protocol created by Session 00045*  
*Based on real confusion experienced by Sessions 44-47*  
*Save future sessions from RLS panic!*