---
session: "00089"
type: "reference"
status: "current"
created: "2025-08-27"
title: "Quick Reference Card for 546-File Cleanup"
purpose: "Ultra-concise command reference for Session 90's cleanup execution"
topics: ["quick-reference", "commands", "git-cleanup"]
priority: "P0"
domain: "core"
---

# Quick Reference Card - 546 File Cleanup

## 🚀 Essential Commands (Keep This Open!)

### Check Progress
```bash
git status --short | wc -l     # How many files left?
git status --short | cut -c1-2 | sort | uniq -c  # By category
```

### The 5-Phase Commit Pattern

#### 1. Pure Renames (219 files)
```bash
git status --short | grep "^R  " | cut -c4- | while IFS= read -r line; do
    [ -n "$line" ] && git add "$line"
done
git commit -m "refactor(structure): Session 86 - Reality-First reorganization (pure renames)"
```

#### 2. Renamed+Modified (112 files)  
```bash
git status --short | grep "^RM " | cut -c4- | while IFS= read -r line; do
    [ -n "$line" ] && git add "$line"
done
git commit -m "refactor(structure): Session 86 - Reality-First reorganization (renames with updates)"
```

#### 3. Modified Files (58 files)
```bash
# By groups - adjust as needed
git add .claude/commands/*.md
git commit -m "docs(commands): Sessions 84-89 - Update Claude commands"

git add scripts/*.{py,sh} 2>/dev/null || true
git commit -m "feat(scripts): Sessions 84-89 - Tools and automation"

git add truth-seed/*/src/**/*.{ts,tsx} 2>/dev/null || true
git commit -m "fix(apps): Sessions 87-88 - Auth and middleware fixes"
```

#### 4. New Files (103 files)
```bash
git add archive/sessions/SESSION-*.md
git commit -m "docs(sessions): Sessions 84-89 - Logs and handoffs"

git add core/00{084..089}-*.md 2>/dev/null || true
git commit -m "docs(core): Sessions 84-89 - Protocols and analysis"
```

#### 5. Deletions (33 files)
```bash
git add -u  # Stages all deletions
git commit -m "cleanup(legacy): Session 86 - Remove relocated files"
```

### Fix Vercel
```bash
# Check where auth actually is
ls -la truth-seed/emdash-auth-main/ | head -3
ls -la reconciliation/active-work/auth-gateway/ | head -3

# Update vercel.json if needed
cat > vercel.json << 'EOF'
{
  "buildCommand": "cd truth-seed/emdash-auth-main && npm install && npm run build",
  "outputDirectory": "truth-seed/emdash-auth-main/.next",
  "installCommand": "cd truth-seed/emdash-auth-main && npm install",
  "framework": "nextjs"
}
EOF
```

### Create PR
```bash
git push origin pre-reorg-backup-session-66

gh pr create \
  --title "Sessions 66-90: Reality-First Reorganization & Critical Fixes" \
  --body "[Use template from handoff]"
```

## 🔍 Diagnostic Commands

### What's Left?
```bash
# Count by type
git status --short | cut -c1-2 | sort | uniq -c

# See first 10 of each type
for type in "R " "RM" "??" " M" " D"; do
    echo "=== $type ==="
    git status --short | grep "^$type" | head -5
done
```

### Verify Commits
```bash
# What did I just commit?
git show --stat --oneline HEAD

# Last 5 commits
git log --oneline -5

# See file movements in last commit
git show --name-status HEAD | grep "^R"
```

### Test Locally
```bash
# Auth app
cd truth-seed/emdash-auth-main
npm install && npm run build

# Dashboard app  
cd truth-seed/emdash-dashboard-main
npm install && npm run build
```

## 🚨 Common Fixes

### "Pathspec did not match"
```bash
# Use 2>/dev/null || true pattern
git add pattern/*.md 2>/dev/null || true
```

### "Too many arguments"
```bash
# Break into smaller batches
git status --short | grep "PATTERN" | head -50 | cut -c4- | while IFS= read -r line; do
    [ -n "$line" ] && git add "$line"
done
```

### "Lost track"
```bash
# Reset to last commit (keep changes)
git reset --soft HEAD~1

# Or start fresh from backup
git reset --hard backup-session-90-pre-cleanup
git stash pop
```

## 📊 Progress Milestones

| Phase | Files | After Commit | Remaining |
|-------|-------|--------------|-----------|
| Start | 546 | - | 546 |
| Cache | 1 | fix(git) | 545 |
| Pure Renames | 219 | refactor(structure) | 326 |
| Renamed+Mod | 112 | refactor(structure) | 214 |
| Modified | 58 | various | 156 |
| New Files | 103 | docs/feat | 53 |
| Deletions | 33 | cleanup | 20 |
| Stragglers | ~20 | final cleanup | 0 |

## ✅ Success Checklist

- [ ] Started with backup: `git stash -u` and `git branch backup-*`
- [ ] Cache file removed from tracking
- [ ] All renames committed
- [ ] All modifications committed
- [ ] All new files committed
- [ ] All deletions committed
- [ ] `git status` shows clean
- [ ] Vercel config updated
- [ ] Environment variables added
- [ ] PR created
- [ ] Local builds work

## 💡 Remember

1. **IFS= read -r** for filenames with spaces
2. **2>/dev/null || true** for missing files
3. **Commit frequently** - every 50 files max
4. **Test locally** before pushing
5. **Check Session 89's tips** if stuck: `core/00089-CLEANUP-TIPS-FOR-90.md`

---
*Session 90: You're turning chaos into order. This is important work!*