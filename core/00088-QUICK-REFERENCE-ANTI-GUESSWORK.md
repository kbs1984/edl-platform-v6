---
created: '2025-08-27'
domain: core
priority: P0
purpose: Immediate checklist when facing any error
session: 00088
status: current
title: "\U0001F6D1 STOP! Anti-Guesswork Quick Reference"
topics:
- quick-reference
- debugging
- evidence-based
type: quick-reference
---

# 🛑 STOP! Before You Change ANY Code

## You See An Error. Your First Instinct Is Wrong.

### ⏱️ 2-MINUTE EVIDENCE CHECK

```bash
# 1. What changed recently? (30 seconds)
git diff
git status

# 2. Has this been fixed before? (30 seconds)
python3 scripts/00059-yaml-query.py --topic "[error-keyword]"
grep -r "[error-message]" archive/sessions/*.md | head -5

# 3. What's actually running? (30 seconds)
ps aux | grep next
lsof -i :3000,3001,3002,3003

# 4. What's the actual state? (30 seconds)
cat reality/latest-*.md | head -20
ls -la truth-seed/*/src/middleware.ts
```

## 🚨 Common Error → Real Cause

| You See | You Think | ACTUAL CAUSE (Sessions 87-88) |
|---------|-----------|--------------------------------|
| "Failed to fetch" | API broken | Undefined env vars (PROTOCOL, AUTH_URL) |
| "File is not defined" | Import missing | Node.js 18 doesn't have File constructor |
| "Cannot read null" | Data missing | Async promise not handled properly |
| Redirect loop | Auth broken | Missing header in middleware |
| HTTP 408 timeout | Server down | Your changes throwing errors |

## ✅ Evidence-Based Fix Process

### Step 1: GATHER EVIDENCE (Not Theories)
```bash
# Run this FIRST:
./scripts/00088-gather-evidence.sh
```

### Step 2: Find Root Cause
- ❌ NOT: "This should work"
- ✅ BUT: "Reality shows X, code expects Y"

### Step 3: ONE Change
- Make ONE change
- Test it
- Commit if works
- ONLY THEN make next change

## 🎯 Session 87's Success Pattern

```bash
# Problem: Auth not working
cat reality/00081-request-triggers.md
# Found: No trigger attached

# Fix: Attach trigger
# Test: Works ✅

# Problem: Redirect loop  
cat truth-seed/*/src/utils/supabase/middleware.ts
# Found: Header never set

# Fix: Set header
# Test: Works ✅

# DONE. 2 fixes, 10 minutes.
```

## ⚠️ Session 88's Failure Pattern

```javascript
// DON'T DO THIS:
"Failed to fetch" 
→ Changed get-user-info.ts
→ Changed layout.tsx  
→ Changed redirects
→ HTTP 408
→ Everything broken
→ 30 minutes wasted
```

## 📊 Reality Check Commands

```bash
# Database reality
python3 reality/agent-reality-auditor/supabase-connector/connector.py --level 2

# File system reality
find . -name "*.ts" -newer archive/sessions/SESSION-00087-LOG.md

# Process reality
netstat -tulpn 2>/dev/null | grep LISTEN

# Git reality
git log --oneline -10
```

## 🔍 Debug Like Session 87

1. **Check Reality First**
   - What IS (not what should be)
   - `reality/*.md` files are truth

2. **Minimal Reproducible Test**
   ```bash
   # Can you reproduce the error?
   curl -X POST http://localhost:3000/api/endpoint
   ```

3. **Fix Exactly What's Broken**
   - Not what you think is broken
   - What evidence shows is broken

## 💡 Remember

- **Session 83**: Guesswork = mess
- **Session 87**: Evidence = success (auth fixed in minutes!)
- **Session 88**: Guesswork = wasted 30 minutes, made it worse

## 🚦 Decision Tree

```
Error Occurs
    ↓
Run evidence gathering
    ↓
Evidence found? → Apply known fix
    ↓ No
Root cause clear? → Fix that specific issue
    ↓ No
STOP. Get more evidence. Do NOT guess.
```

## 📝 If You're About to Type

### These phrases = STOP, you're guessing:
- "This should work"
- "Let me try"
- "Maybe it's"
- "Could be related to"
- "Might fix it"

### These phrases = PROCEED, you have evidence:
- "Reality shows"
- "Git diff confirms"
- "Previous session fixed this with"
- "The error log specifically states"
- "Testing confirms"

---

**PRINT THIS. TAPE IT TO YOUR MONITOR.**

When facing an error, your instinct is wrong.
Check reality. One fix. Test. Repeat.

Sessions that guess: Fail (83, 88)
Sessions that check: Succeed (85, 87)

Choose wisely.