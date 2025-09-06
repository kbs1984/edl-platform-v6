---
session: "00110"
type: "fix-guide"
status: "current"
created: "2025-08-29"
title: "MCP execute_sql Crypto Error - Simple Fix Guide"
purpose: "Eliminate the 'Oh Python' scramble when hitting execute_sql crypto error"
topics: ["mcp-server", "supabase", "crypto-error", "execute-sql"]
priority: "P2"
domain: "reality"
---

# MCP `execute_sql` Crypto Error - Simple Fix Guide

**Problem**: Sessions keep hitting crypto error with `mcp__supabase-dev__execute_sql`, causing confusion and scrambling to remember Python workaround.

**Impact**: Workflow friction, not a blocker but annoying.

---

## 🔴 The Error Pattern

```python
# This fails with crypto error:
mcp__supabase-dev__execute_sql(
    query="SELECT * FROM student WHERE user_id = '...'"
)
# Error: crypto-related failure
```

Sessions then scramble: "Oh right, use Python instead!"

---

## ✅ Immediate Workaround (No Fix Needed)

### For SELECT Queries:
```python
# Instead of execute_sql, use Python:
from supabase import create_client
client = create_client(
    'https://bbrheacetxlnqbibjwsz.supabase.co',
    'eyJ...[anon_key]...'
)
result = client.table('student').select('*').eq('user_id', '...').execute()
```

### For INSERT/UPDATE/DELETE:
```python
# Same pattern:
client.table('student').insert({'name': 'value'}).execute()
client.table('student').update({'field': 'value'}).eq('id', '...').execute()
client.table('student').delete().eq('id', '...').execute()
```

---

## 🔧 The Actual Issue (Confirmed & FIXED!)

**Root Cause**: The Supabase MCP server has a bug - it uses `crypto.randomUUID()` without importing the crypto module in Node.js.

**✅ FIX CONFIRMED BY SESSION 111**: Upgrading to Node v20.19.4 resolved the issue!

**Location**: `/node_modules/@supabase/mcp-server-supabase/dist/chunk-*.js` line ~254
```javascript
// Bug: Missing import
let p = crypto.randomUUID();  // ReferenceError: crypto is not defined
```

### Quick Fix Options:

#### Option 1: Wait for Official Fix
The Supabase team needs to add `import crypto from 'crypto'` to their source code.

#### Option 2: Manual Patch (Not Recommended)
Could manually edit the dist files, but changes would be lost on reinstall.

#### Option 3: Use Community MCP Server
alexander-zuev's Query MCP server doesn't have this bug:
```bash
npm install -g supabase-mcp-server
claude mcp add supabase-query \
  --env DATABASE_URL="postgresql://..." \
  -- supabase-mcp-server
```

---

## 📋 Permanent Documentation Pattern

**Add to CLAUDE.md or session startup docs:**

```markdown
### Data Query Pattern (MCP execute_sql is broken)
For ALL data queries, use Python client, NOT execute_sql:
- SELECT: `client.table().select().execute()`
- INSERT: `client.table().insert().execute()`
- UPDATE: `client.table().update().execute()`
- DELETE: `client.table().delete().execute()`

For DDL (CREATE, ALTER, DROP), continue using:
- `mcp__supabase-dev__apply_migration()`
```

---

## 🎯 Quick Decision Tree

1. **Need to query data?** → Use Python client
2. **Need to modify schema?** → Use apply_migration
3. **Need to check schema?** → Use list_tables
4. **Forget and try execute_sql?** → See #1

---

## Desktop Action Items

If Desktop wants to fix properly:
1. **Check Node version** - Update to v20.x LTS if on v18
2. **Regenerate PAT** - Fresh token often fixes crypto issues
3. **Consider alexander-zuev's Query MCP** - Community server without crypto issues

But honestly, the Python client pattern works perfectly fine. The fix is more about removing friction than enabling new capabilities.