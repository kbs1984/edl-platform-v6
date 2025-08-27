---
created: '2025-08-27'
domain: core
priority: P0
purpose: Analyze exact patterns of guesswork failures to prevent recurrence
session: 00088
status: current
title: Guesswork Pattern Analysis - Sessions 87 & 88
topics:
- pattern-analysis
- guesswork
- evidence-based
- lessons
type: analysis
---

# Guesswork Pattern Analysis - Breaking the Cycle

## Session 87 Analysis (Successful then Failed)

### Phase 1: Evidence-Based Success (Lines 136-420)
**User Request**: "eliminate guesswork"
**Approach**: Used reality files systematically

```
Line 155: Check reality/00081-request-triggers.md
Line 163: Check reality/00081-request-source-project-triggers.md
Line 169: Check reality/00081-request-functions.md
Line 177: Check reality/00081-request-source-project-functions.md
```

**Result**: ✅ Auth fixed in MINUTES after 37 sessions of failure

### Phase 2: Guesswork Failure (Lines 883-1043)
**Error**: "File is not defined"
**Wrong Approach**: 
```
Line 902: Found new File() constructor
Line 910: "The issue is in the useEffect at line 52"
Line 922: Created fix without checking Node.js version first
```

**What Should Have Been Done**:
1. Check Node.js version (`node --version`)
2. Search for existing File constructor workarounds
3. Check if this error occurred in previous sessions

### Phase 3: Another Guesswork (Lines 1047-1116)
**Error**: "Cannot read properties of null (reading 'length')"
**Response**: Fixed immediately without investigating why it's null

**What Was Missing**:
- Didn't check why schoolSearchResults was null
- Didn't verify if the search API was working
- Just added null checks without addressing root cause

## Session 88 Analysis (Complete Failure)

### Initial Cascade (My Session)
1. **First Error**: "Failed to fetch" with spinning favicon
2. **Guesswork #1**: Modified get-user-info.ts to throw error
3. **Guesswork #2**: Changed layout.tsx redirect logic  
4. **Guesswork #3**: Hardcoded URLs
5. **Result**: HTTP 408 - Made EVERYTHING worse

### The Turning Point
**User**: "It feels like you're doing guesswork, which is exactly what cause 83 to make a mess"

### What Actually Worked (Eventually)
- Checking environment variables
- Looking at package.json for production hostname
- Verifying what ports were actually in use

## Common Guesswork Triggers

### Trigger 1: Vague Error Messages
- "Failed to fetch" → Could be ANYTHING
- "File is not defined" → Environment issue, not code issue
- Response: Jump to first theory instead of investigating

### Trigger 2: Impatience
- Want to fix quickly
- Skip evidence gathering
- Make multiple changes hoping one works

### Trigger 3: Assumption Chain
```
Error → Assume cause → Fix assumed cause → New error → 
Assume that's related → Fix that too → Spiral
```

## The Evidence-Based Success Pattern

### Session 87's Success Formula
1. **Reality Files First**
   ```bash
   cat reality/00081-request-triggers.md
   cat reality/00081-request-functions.md
   ```
   
2. **Compare Reality vs Code**
   - Database has X
   - Code expects Y
   - Fix the mismatch

3. **Minimal Change**
   - One fix: Attach trigger
   - Test
   - One fix: Set header
   - Test
   - DONE

## Specific Anti-Patterns to Avoid

### ❌ DON'T: Chain Assumptions
```typescript
// Session 88's mistake
"Fetch failed" → "Must be school registration" → 
"Must be created_by field" → "Must be middleware" → 
"Must be env vars" → Lost
```

### ✅ DO: Verify Each Step
```typescript
// Session 87's success
"Auth not working" → Check triggers → Missing → 
Fix → Test → Working → Check next issue
```

### ❌ DON'T: Fix Multiple Things
```typescript
// Session 88 changed:
- get-user-info.ts
- layout.tsx
- middleware redirects
- environment variables
// Result: Don't know what broke what
```

### ✅ DO: One Change Per Test
```typescript
// Session 87:
1. Fix trigger → Test → Works
2. Fix header → Test → Works
Done.
```

## Key Diagnostics BEFORE Any Fix

### For "Failed to fetch" errors:
```bash
# Check what's actually running
lsof -i :3000,3001,3002,3003

# Check environment variables
grep "PROTOCOL\|AUTH_URL" .env.local

# Check recent changes
git diff
```

### For "X is not defined" errors:
```bash
# Check runtime environment
node --version
npm list

# Search for previous occurrences
grep -r "is not defined" archive/sessions/

# Check if polyfill needed
```

### For "Cannot read properties of null":
```bash
# Check actual data flow
console.log('Data before error:', variable)

# Check API responses
curl -X POST [endpoint] -d [data]

# Check previous null handling
grep -r "|| \[\]" --include="*.ts" --include="*.tsx"
```

## The 2-Minute Rule

Before making ANY change, spend 2 minutes:
1. Run `git diff` (30 seconds)
2. Query YAML for the error (30 seconds)
3. Check if error exists in transcripts (30 seconds)
4. Check actual state (reality agents) (30 seconds)

If you can't find evidence in 2 minutes, you're about to guess.

## Success Metrics

### Session 87 (Evidence-Based):
- Auth: 2 fixes, 10 minutes, WORKING
- File error: 1 fix, 5 minutes, WORKING
- Null error: 1 fix, 3 minutes, WORKING

### Session 88 (Guesswork):
- Auth redirect: 5+ changes, 30 minutes, BROKE EVERYTHING
- Had to revert most changes
- Created technical debt

## The Universal Truth

**Session 85's Discovery**: Reality files solved in 5 minutes what 37 sessions couldn't

**Why?** Reality shows what IS. Guesswork assumes what SHOULD BE.

**Lesson**: When you see an error, your first instinct is wrong. Check reality first.