---
session: "00142"
type: "canon"
status: "authoritative"
created: "2025-09-02"
title: "Recovery Canon - What To Do When Things Break"
purpose: "Define recovery procedures, rollback strategies, and solutions to known issues"
topics: ["recovery", "error-handling", "rollback", "debugging", "solutions"]
priority: "P0"
domain: "core"
canonical: true
immutable: true
---

# 🚨 Recovery Canon - What To Do When Things Break

## Purpose
This canon provides authoritative recovery procedures for all known failure modes and general strategies for unknown failures. When something breaks, this is your first reference.

---

## 🔴 CRITICAL: Known Failures & Solutions

### 1. Guardian Duplicate Prevention Bug (FIXED Session 143)
**Symptoms**: 
- Guardian form submission fails on retry
- UNIQUE constraint violation errors  
- Parents stuck in onboarding after refresh/retry

**Root Cause**: Missing check for existing guardian record before insert
- Database has UNIQUE constraint on user_id
- Re-submissions cause duplicate key violations

**Immediate Fix**:
```typescript
// reconciliation/active-work/dashboard/src/lib/actions/guardian-actions.ts
// Check for existing record first
const { data: existingGuardian } = await supabase
  .from("guardian")
  .select("id")
  .eq("user_id", user.id)
  .single();

// Only insert if not exists
if (!existingGuardian) {
  const { error: guardianError } = await supabase
    .from("guardian")
    .insert({
      id: user.id,
      user_id: user.id,
      payment_method: null,
      billing_address: null
    });
    
  if (guardianError) return { status: "error", message: guardianError.message};
}
```

**Recovery Steps**:
1. Fix the insertion code as above
2. Find affected users: `SELECT * FROM auth.users WHERE id NOT IN (SELECT user_id FROM guardian)`
3. Manually create guardian records for affected users
4. Test with: `npm run test:guardian-flow`

**Prevention**: Always validate insertions have data before executing

---

### 2. Friends System No Real-time Updates
**Symptoms**:
- Friend requests don't appear until page refresh
- Status changes not reflected immediately
- Chat messages delayed

**Root Cause**: Missing Supabase subscription setup

**Immediate Fix**:
```typescript
// Add to reconciliation/active-work/dashboard/src/hooks/use-friends.ts
useEffect(() => {
  const channel = supabase
    .channel('friend-requests')
    .on('postgres_changes', 
      { event: '*', schema: 'public', table: 'friendship' },
      (payload) => {
        console.log('Friend update:', payload)
        // Refetch friends list
        fetchFriends()
      }
    )
    .subscribe()
  
  return () => {
    supabase.removeChannel(channel)
  }
}, [])
```

**Recovery Steps**:
1. Add subscription code to all real-time components
2. Test with two browser sessions
3. Verify WebSocket connection in Network tab
4. Check Supabase Realtime logs

---

### 3. MCP Server Connection Failures
**Symptoms**:
- "MCP server not found" errors
- Automation commands fail
- Session start incomplete

**Root Cause**: Claude Code needs restart after server changes

**Immediate Fix**:
1. Save all work
2. Restart Claude Code completely
3. Re-run session start: `./scripts/00140-mcp-integrated-session-start.sh`

**Fallback Mode**:
```bash
# If MCP fails, use manual commands:
python3 scripts/00142-progress-tracker.py 142 summary
python3 reality/agent-reality-auditor/orchestrator.py
```

---

### 4. 95% Syndrome (Near Perfect But Not)
**Symptoms**:
- Reality health shows 95-99%
- Subtle issues remain
- "Feels broken" despite high scores

**Root Cause**: Edge cases not covered in validation

**Immediate Fix**:
1. Run deep validation: `python3 reality/agent-reality-auditor/orchestrator.py --deep`
2. Check Progress Matrix for known issues
3. Review session logs for warnings
4. Test edge cases manually

**Common 95% Issues**:
- Missing error boundaries
- Incomplete loading states
- Race conditions in async code
- Missing null checks

---

## 🔄 General Recovery Procedures

### When Build Breaks (Can't compile/run)

```bash
# 1. Check what changed
git status
git diff

# 2. Verify dependencies
npm install
npm run build

# 3. Check for type errors
npm run typecheck

# 4. Reset if needed
git stash
npm run dev

# 5. If still broken, check Reality
python3 reality/agent-reality-auditor/filesystem/quickstart.py
```

### When Database Corrupted

```bash
# 1. Check current state
mcp__supabase-dev__list_tables

# 2. Verify migrations
ls core/config/supabase/migrations/*.sql

# 3. Re-run migrations if needed
for f in core/config/supabase/migrations/*.sql; do
  mcp__supabase-dev__apply_migration --file "$f"
done

# 4. Restore from Progress Matrix
mcp__supabase-dev__execute_sql "SELECT * FROM platform_progress_matrix"
```

### When Session Confused (Lost context)

```bash
# 1. Query YAML for truth
python3 scripts/00059-yaml-query.py --session "00142"

# 2. Check Progress Matrix
python3 scripts/00142-progress-tracker.py 142 summary

# 3. Read last handoff
cat archive/sessions/SESSION-*-HANDOFF.md | tail -200

# 4. Re-establish with fresh start
./scripts/00140-mcp-integrated-session-start.sh 142
```

### When Vision Lost (Why are we building this?)

```bash
# 1. Read the SEED LOGs
cat core/SEED-LOG-V5-GENESIS.md
cat core/SEED-LOG-V6-EVOLUTION.md

# 2. Review Cyworld mapping
grep -A 10 "Cyworld Mapping" archive/sessions/SESSION-00141-HANDOFF.md

# 3. Check Philosophy Canon
cat core/PHILOSOPHY-CANON.md

# 4. Remember: Identity expression > Functionality
```

---

## ↩️ Rollback Strategies

### Feature Rollback
```typescript
// 1. Add feature flag
const FEATURES = {
  NEW_FEATURE: process.env.ENABLE_NEW_FEATURE === 'true'
}

// 2. Conditionally render
{FEATURES.NEW_FEATURE && <NewComponent />}

// 3. Disable if broken
ENABLE_NEW_FEATURE=false npm run dev
```

### Database Rollback
```sql
-- Every migration needs a DOWN script
-- Example: Rolling back progress matrix
DROP TABLE IF EXISTS platform_progress_matrix CASCADE;
DROP FUNCTION IF EXISTS update_updated_at_column();

-- Re-run previous migration
\i core/config/supabase/migrations/00141_previous.sql
```

### Code Rollback
```bash
# 1. Find last working commit
git log --oneline -10

# 2. Create branch from good commit
git checkout -b recovery-branch <commit-hash>

# 3. Cherry-pick good changes
git cherry-pick <good-commit>

# 4. Force push if needed (CAREFUL!)
git push --force-with-lease origin <branch>
```

---

## 🔍 Debugging Workflows

### Frontend Issues
```javascript
// 1. Add debug logging
console.log('[DEBUG]', { state, props, error })

// 2. Use React DevTools
// 3. Check Network tab for API calls
// 4. Verify Supabase responses

// 5. Common fixes:
- Clear localStorage
- Hard refresh (Ctrl+Shift+R)
- Check auth token expiry
- Verify RLS policies
```

### Backend Issues
```sql
-- 1. Check RLS policies
SELECT * FROM pg_policies WHERE tablename = 'your_table';

-- 2. Test as anon user
SET ROLE anon;
SELECT * FROM your_table; -- Should fail with RLS

-- 3. Check triggers
SELECT * FROM pg_trigger WHERE tgname LIKE '%your_table%';

-- 4. Verify functions
\df *your_function*
```

### Integration Issues
```bash
# 1. Test Reality Agents
python3 reality/agent-reality-auditor/orchestrator.py

# 2. Check MCP servers
ps aux | grep mcp

# 3. Verify ports
netstat -tuln | grep -E '3000|3001'

# 4. Test Supabase connection
curl https://bbrheacetxlnqbibjwsz.supabase.co/rest/v1/
```

---

## 📊 Health Check Commands

### Quick Health Check
```bash
# One command to rule them all
python3 << 'EOF'
import subprocess
import json

checks = {
    "Database": "mcp__supabase-dev__execute_sql('SELECT COUNT(*) FROM profile')",
    "Progress": "python3 scripts/00142-progress-tracker.py 142 summary",
    "Reality": "python3 reality/agent-reality-auditor/orchestrator.py --quick",
    "Frontend": "curl -s http://localhost:3001 | grep -q 'EDL'",
}

for name, cmd in checks.items():
    try:
        result = subprocess.run(cmd, shell=True, capture_output=True)
        status = "✅" if result.returncode == 0 else "❌"
        print(f"{status} {name}")
    except:
        print(f"❌ {name} - Failed to run")
EOF
```

### Deep Health Analysis
```bash
# Full system validation
./scripts/00114-validate-environment.sh
python3 reality/agent-reality-auditor/orchestrator.py --deep
mcp__supabase-dev__get_advisors(type="security")
```

---

## 🚑 Emergency Contacts

### When All Else Fails

1. **Check Session Logs**: 
   - `archive/sessions/SESSION-*-LOG.md`
   - Look for similar issues in past sessions

2. **Query YAML Knowledge Base**:
   ```bash
   python3 scripts/00059-yaml-query.py --topic "error recovery"
   python3 scripts/00059-yaml-query.py --type "fix"
   ```

3. **Review Implementation Reports**:
   - `reconciliation/00*-*-REPORT.md`
   - Contains solutions to past problems

4. **Check GitHub Issues**:
   ```bash
   mcp__github-server__search_issues(q="repo:anthropics/claude-code error")
   ```

---

## 🎯 Recovery Principles

### The Four Laws of Recovery

1. **Evidence Over Assumptions**
   - Always verify actual state
   - Never guess at problems
   - Query, don't assume

2. **Incremental Over Big Bang**
   - Fix one thing at a time
   - Test after each change
   - Commit working states

3. **Rollback Over Forward**
   - When in doubt, revert
   - Known working > potentially better
   - Can always re-attempt

4. **Document Over Silence**
   - Log what broke
   - Record what fixed it
   - Update this canon

---

## 📝 Post-Recovery Checklist

After fixing any issue:

- [ ] Run Reality Agent validation
- [ ] Update Progress Matrix with fix
- [ ] Document in session log
- [ ] Add to known issues if new
- [ ] Create test to prevent recurrence
- [ ] Update this canon if needed
- [ ] Commit with clear message
- [ ] Track deliverable in MCP

---

*This canon is your lifeline when things break. Trust it, follow it, and update it when you learn new recovery patterns.*

**Session 142 Implementation** - Recovery Canon established for system resilience.