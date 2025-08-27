---
session: "00088"
type: "protocol"
status: "critical"
created: "2025-08-27"
title: "Anti-Guesswork Protocol - Breaking the Pattern"
purpose: "Prevent recurring guesswork failures that plagued Sessions 83, 87, 88"
topics: ["protocol", "evidence-based", "debugging", "prevention"]
priority: "P0"
domain: "core"
---

# Anti-Guesswork Protocol v1.0

**Critical Pattern Identified**: Sessions keep making the same mistakes
- Session 83: Made guesswork changes, created a mess
- Session 87: Started well with reality files, then guessed at File constructor
- Session 88: Fell into same trap, made 5+ guesswork changes

## The Guesswork Trap Pattern

```
See error → Guess at cause → Change code → New error → 
Guess again → Change more → Compound problems → Lost
```

## MANDATORY EVIDENCE CHECKLIST

### Before ANY Code Change

**STOP AND RUN THESE COMMANDS FIRST:**

```bash
# 1. CHECK REALITY - What's actually deployed?
git status
git diff
ps aux | grep next | grep -v grep
lsof -i :3000,3001,3002,3003

# 2. QUERY YAML - Has this been fixed before?
python3 scripts/00059-yaml-query.py --topic "[error-topic]"
python3 scripts/00059-yaml-query.py --session "00087"

# 3. READ LOGS - What did recent sessions discover?
ls -la archive/sessions/SESSION-*-LOG.md | tail -5
grep -l "[error-message]" archive/sessions/*.md

# 4. CHECK DATABASE REALITY - If auth/data related
python3 reality/agent-reality-auditor/supabase-connector/connector.py --level 2
```

## Evidence-Based Debugging Protocol

### Step 1: Document the Error EXACTLY
```markdown
**Error Message**: [exact error]
**Location**: [file:line]
**User Action**: [what user did]
**Console Output**: [full output]
```

### Step 2: Gather Evidence BEFORE Theorizing
1. **Check if error exists in transcripts**
   ```bash
   grep -r "File is not defined" brian-transcripts/
   ```

2. **Check if solution exists in scripts**
   ```bash
   ls scripts/*87*.{sql,py,md,tsx,ts} 2>/dev/null
   ```

3. **Check current code state**
   ```bash
   git diff [affected-file]
   ```

### Step 3: Test ONE Change at a Time
```javascript
// WRONG - Session 88's approach:
// Changed get-user-info.ts
// Changed layout.tsx  
// Changed redirect logic
// Changed middleware
// Result: Made it worse, HTTP 408

// RIGHT - Session 87's approach:
// 1. Reality files showed trigger missing
// 2. Applied ONLY trigger fix
// 3. Tested
// 4. Reality files showed header missing
// 5. Applied ONLY header fix
// 6. Tested
// Result: Auth completely fixed
```

## Common Guesswork Traps to AVOID

### Trap 1: "This should work"
**Guesswork**: "The created_by field should exist"
**Reality**: Check the actual table structure
```bash
# Don't guess - CHECK:
cat reality/00081-request-profile-table-columns.png
```

### Trap 2: "The error means X"
**Guesswork**: "Fetch error means school registration is broken"
**Reality**: Could be undefined env vars, missing middleware, port issues
```bash
# Don't guess - CHECK ALL:
grep "PROTOCOL\|AUTH_URL" .env.local
cat package.json | grep "dev"
ls src/middleware.ts
```

### Trap 3: "Let me fix multiple things"
**Guesswork**: Fix A, B, C, D all at once
**Reality**: You won't know which fix worked or what broke
```bash
# One change, one test:
1. Make change A
2. Test
3. Git commit if works
4. THEN make change B
```

## Session 87's Success Pattern (COPY THIS)

1. **Used Reality Files First**
   ```bash
   cat reality/00081-request-triggers.md
   cat reality/00081-request-functions.md
   ```
   **Discovery**: add_new_user exists but trigger not attached

2. **Applied Minimal Fix**
   ```sql
   -- Just attached the trigger, nothing else
   CREATE TRIGGER on_auth_user_created
   ```
   **Result**: Profiles working

3. **Checked Reality Again**
   ```typescript
   // Middleware checks for header that doesn't exist
   if (!response.headers.get('x-user-authenticated'))
   ```

4. **Applied Minimal Fix**
   ```typescript
   // Just set the header, nothing else
   response.headers.set('x-user-authenticated', 'true');
   ```
   **Result**: Auth completely fixed

## Emergency Recovery Protocol

If you've already made guesswork changes:

1. **STOP immediately**
2. **Document what you changed**
   ```bash
   git diff > session-changes.diff
   ```
3. **Revert if broken**
   ```bash
   git checkout -- [files-that-broke-things]
   ```
4. **Start over with evidence**

## Integration with Session Startup

### Modified startup script should enforce:
```bash
#!/bin/bash
# scripts/00028-full-startup.sh v2.0

echo "🛑 ANTI-GUESSWORK CHECK"
echo "========================"
echo "Before making ANY changes, have you:"
echo "1. [ ] Checked git diff?"
echo "2. [ ] Queried YAML for existing fixes?"
echo "3. [ ] Read recent session logs?"
echo "4. [ ] Verified reality with agents?"
echo ""
echo "Type 'yes' if all checked, 'no' to gather evidence first:"
read EVIDENCE_CHECK

if [ "$EVIDENCE_CHECK" != "yes" ]; then
    echo "Running evidence gathering..."
    ./scripts/00088-gather-evidence.sh
fi
```

## Success Metrics

- **Session 87**: 2 evidence-based fixes = complete success
- **Session 88**: 5+ guesswork changes = made things worse
- **Goal**: 100% evidence-based changes

## Constitutional Amendment Proposal

Add to Article VII:
> "All code changes MUST be preceded by evidence gathering via reality agents, YAML queries, and git diff. Guesswork-based changes are prohibited."

## Remember

**Session 85's Lesson**: Reality files > 37 sessions of guesswork
**Session 87's Success**: Evidence-based fixes work immediately
**Session 88's Failure**: Guesswork makes things worse

**The tool exists - USE IT:**
- Reality agents
- YAML queries
- Git diff
- Session logs

Don't guess. Check reality. Fix once.