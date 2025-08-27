---
session: "00089"
type: "guide"
status: "current"
created: "2025-08-27"
title: "Session 89's Tips and Insights for Session 90's Cleanup"
purpose: "Practical guidance and anticipated Q&A for the 546-file cleanup"
topics: ["git-cleanup", "troubleshooting", "tips", "common-issues"]
priority: "P0"
domain: "core"
related_to: ["SESSION-00090-HANDOFF.md", "00089-ACTION-PLAN.md"]
---

# Session 89's Tips and Insights for Session 90's Cleanup

**From**: Session 89's experience investigating the situation
**To**: Session 90 executing the cleanup
**Purpose**: Answer anticipated questions and provide hard-won insights

## 🎯 Quick Reference for Common Queries

### Q: "How do I know which files are pure renames vs modified?"
```bash
# Pure renames show as "R  " (R + two spaces)
git status --short | grep "^R  " | head -5

# Renamed AND modified show as "RM " 
git status --short | grep "^RM " | head -5

# The difference matters for commit batching!
```

### Q: "What if the rename detection is wrong?"
```bash
# Check git's rename detection threshold
git config diff.renameLimit  # Default is often too low

# Increase it temporarily for better detection
git config diff.renameLimit 9999

# This helps git recognize moves as renames, not delete+add
```

### Q: "How can I verify my commits are correct?"
```bash
# After each commit, check what you actually committed
git show --stat --oneline HEAD

# To see file movements in a commit
git show --name-status HEAD | grep "^R"

# To verify count matches expectation
git show --stat HEAD | tail -1
# Should show something like: "219 files changed, 0 insertions(+), 0 deletions(-)"
```

## 💡 Insights from My Investigation

### 1. The Cache File Gotcha
**Issue**: `.yaml-index-cache.pkl` keeps reappearing
**Why**: Python scripts regenerate it automatically
**Solution**: 
```bash
# Don't just remove it, ignore it properly
echo "*.pkl" >> .gitignore
echo "*.pyc" >> .gitignore  
echo "__pycache__/" >> .gitignore

# Then remove from tracking
git rm --cached .yaml-index-cache.pkl
```

### 2. The Rename Pattern
I discovered the 219 "pure renames" are mostly from Session 86's domain reorganization:
- `archive/sessions/X.md` → `core/X.md` (documentation)
- `supabase/` → `core/config/supabase/` (configuration)
- Various files → domain-specific directories

**Tip**: These are SAFE to commit as one batch because they have zero content changes.

### 3. The RM Files Are Trickier
The 112 "RM" files were renamed AND modified. Many are:
- Files that moved AND got YAML frontmatter added
- Scripts that moved AND got updated
- Documentation that moved AND got corrections

**Tip**: Review these more carefully - they might contain important fixes.

## 🔍 How to Query and Discover Issues

### Finding Specific File Types
```bash
# Find all Python files in uncommitted changes
git status --short | grep "\.py$"

# Find all SQL files
git status --short | grep "\.sql$"

# Find all session-related files
git status --short | grep -i session

# Find files from specific sessions
git status --short | grep "00086\|00087\|00088"
```

### Using YAML Queries Before Committing
```bash
# Find what implements specific masterplans
python3 scripts/00059-yaml-query.py --implements AUTH-MASTERPLAN.md

# Check for broken references after reorganization
python3 scripts/00059-yaml-query.py --broken

# Find incomplete work that might be affected
python3 scripts/00059-yaml-query.py --status incomplete
```

### Checking Impact of Deletions
```bash
# Before deleting, check if any files reference them
for file in $(git status --short | grep "^ D " | cut -c4-); do
    echo "Checking references to: $file"
    grep -r "$file" --include="*.md" --include="*.ts" --include="*.tsx" . 2>/dev/null | head -3
done
```

## ⚠️ Common Pitfalls I Discovered

### 1. Shell Script Quote Handling
The `while read` loop can fail with filenames containing spaces:
```bash
# BAD - Breaks with spaces
git status --short | grep "^R  " | cut -c4- | while read line; do
    git add "$line"  # Still breaks!
done

# GOOD - Handles spaces properly
git status --short | grep "^R  " | cut -c4- | while IFS= read -r line; do
    if [ -n "$line" ]; then
        git add "$line"
    fi
done
```

### 2. The 2>/dev/null Pattern
When adding groups of files, some might not exist:
```bash
# This prevents "pathspec did not match" errors
git add scripts/*.py scripts/*.sh 2>/dev/null || true
git add core/00084-*.md 2>/dev/null || true
```

### 3. Vercel Path Confusion
I found the vercel.json points to `reconciliation/active-work/auth-gateway` but:
- Auth is actually in `truth-seed/emdash-auth-main/`
- Dashboard is in `truth-seed/emdash-dashboard-main/`

**Check both locations before updating vercel.json!**

## 🎯 Strategic Batching Advice

### Order Matters!
1. **Pure renames first** - Easiest, no risk
2. **RM files second** - Need review but straightforward
3. **Modified files by domain** - Group related changes
4. **New files by type** - Sessions, docs, scripts
5. **Deletions last** - Verify nothing depends on them

### Commit Message Patterns That Work
```bash
# For structural changes
"refactor(structure): Session 86 - [specific change]"

# For fixes
"fix(auth|deploy|yaml): Session XX - [what was fixed]"

# For new features/docs
"feat(domain): Session XX - [what was added]"

# For cleanup
"cleanup(legacy): Session 86 - [what was removed]"
```

## 🚨 If Session 90 Gets Stuck

### "Too many files, git add fails"
```bash
# Break it down further
git status --short | grep "^R  " | head -50 | cut -c4- | while IFS= read -r line; do
    [ -n "$line" ] && git add "$line"
done
# Commit these 50, then repeat
```

### "Not sure if reorganization is correct"
```bash
# Check the file's YAML frontmatter
head -20 [file-path] | grep "domain:"
# The domain field should match the directory it's in
```

### "Deployment still failing after fixes"
```bash
# Check build locally first
cd truth-seed/emdash-auth-main
npm install
npm run build

# If it fails locally, fix before pushing
```

### "Lost track of what's committed"
```bash
# See recent commits
git log --oneline -10

# See what's still uncommitted by category
git status --short | cut -c1-2 | sort | uniq -c

# Generate a progress report
echo "Progress: $(git status --short | wc -l) files remaining"
```

## 📊 Reality Check Commands

### Before Starting
```bash
# Verify starting point
git status --short | wc -l  # Should be 546
git branch --show-current   # Should be pre-reorg-backup-session-66
```

### During Process
```bash
# Track progress
watch -n 5 'git status --short | wc -l'  # Updates every 5 seconds

# Verify commits are clean (no unintended changes)
git diff --stat HEAD~1
```

### After Completion
```bash
# Final verification
git status  # Should be clean
git log --oneline --graph -15  # Should show logical progression
gh pr checks  # Should pass (if PR created)
```

## 🎁 Bonus: Quick Verification Script

Create this as `verify-cleanup.sh`:
```bash
#!/bin/bash
echo "=== Cleanup Verification ==="
echo "Branch: $(git branch --show-current)"
echo "Uncommitted: $(git status --short | wc -l) files"
echo "Recent commits: $(git log --oneline -5 | wc -l)"
echo ""
echo "By category:"
git status --short | cut -c1-2 | sort | uniq -c || echo "✅ Working tree clean!"
echo ""
echo "Vercel status:"
python3 reality/agent-reality-auditor/vercel-connector/quickstart.py 2>&1 | grep -E "state|ERROR|READY"
```

## 💭 Final Wisdom

1. **Take breaks** - 546 files is mentally taxing
2. **Commit often** - Better to have too many commits than too few
3. **Test locally** - Especially after the modified files batch
4. **Use the tools** - The reality agents are there to help
5. **Document oddities** - Anything weird becomes Session 91's context

Remember: Session 86 did EXCELLENT work with the Reality-First reorganization. Your job is just to commit it properly. The reorganization itself is sound - I verified this during my investigation.

Good luck Session 90! You've got this! 🚀