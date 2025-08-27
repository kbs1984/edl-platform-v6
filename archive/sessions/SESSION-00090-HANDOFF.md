---
created: '2025-08-27'
domain: reconciliation
implements:
- 00089-ACTION-PLAN.md
priority: P0
purpose: Clean up massive uncommitted changes and restore deployment health
related_to:
- SESSION-00089-LOG.md
- 00089-ACTION-PLAN.md
- 00089-BRANCH-STRATEGY-ANALYSIS.md
session: 00090
status: draft
title: 'Session #00090 Handoff - Execute 546-File Cleanup'
topics:
- git-cleanup
- deployment-fix
- structural-integrity
- technical-debt
type: handoff
---

# Session #00090 Handoff - Execute 546-File Cleanup

**Date**: 2025-08-27  
**From**: Session 00089  
**To**: Session 00090  
**Priority**: P0 - CRITICAL TECHNICAL DEBT  
**Mission Type**: Cleanup & Recovery

---

## 🚨 THE SITUATION

**Session 89 discovered 546 uncommitted files** from Session 86's Reality-First reorganization that was never committed. This is causing:
- Deployment failures on Vercel
- Branch confusion
- Risk of losing valuable work
- Difficulty tracking changes

**Your Mission**: Execute the cleanup plan created by Session 89.

---

## 📊 Current State (As of Session 89 End)

### Git State
```
Branch: pre-reorg-backup-session-66
Uncommitted: 546 files
- 219 Pure renames (R)
- 112 Renamed + Modified (RM)  
- 103 New untracked (??)
- 58 Modified (M)
- 33 Deleted (D)
- 16 Added (A)
- 3 Renamed + Deleted (RD)
- 2 Added + Modified (AM)
```

### Agent Status
- **GitHub**: ✅ Fully operational (use for PR creation)
- **Vercel**: ⚠️ Connected but deployment failing
- **Issue**: Production in ERROR state, missing DATABASE_URL

---

## 🎯 YOUR MISSION - Execute the Cleanup

### Phase 1: Git Cleanup (2-3 hours)

#### Step 1: Safety Backup (5 min)
```bash
# FIRST - Create safety net
git stash -u -m "Session 90 - Complete state backup before cleanup"
git branch backup-session-90-pre-cleanup

# Verify backup
git stash list | head -1
git branch | grep backup-session-90
```

#### Step 2: Remove Cache File (2 min)
```bash
# This shouldn't be tracked
git rm --cached .yaml-index-cache.pkl
echo "*.pkl" >> .gitignore
git add .gitignore
git commit -m "fix(git): Session 90 - Remove cache files from tracking"
```

#### Step 3: Commit Pure Renames (15 min)
```bash
# 219 files - These have NO content changes
git status --short | grep "^R  " | cut -c4- | while IFS= read -r line; do
    if [ -n "$line" ]; then
        git add "$line"
    fi
done

# Verify count before committing
git status --short | grep "^A" | wc -l  # Should be ~219

git commit -m "refactor(structure): Session 86 - Reality-First reorganization (pure renames)"
```

#### Step 4: Commit Renamed+Modified (15 min)
```bash
# 112 files - Renamed AND modified
git status --short | grep "^RM " | cut -c4- | while IFS= read -r line; do
    if [ -n "$line" ]; then
        git add "$line"
    fi
done

git commit -m "refactor(structure): Session 86 - Reality-First reorganization (renames with updates)"
```

#### Step 5: Commit Modifications in Groups (30 min)
```bash
# Review what's modified
git status --short | grep "^ M "

# Group 1: Command files
git add .claude/commands/*.md
git commit -m "docs(commands): Sessions 84-89 - Update Claude commands"

# Group 2: Scripts
git add scripts/*.py scripts/*.sh 2>/dev/null || true
git commit -m "feat(scripts): Sessions 84-89 - Tools and automation updates"

# Group 3: Auth/Dashboard fixes
git add truth-seed/emdash-auth-main/src/**/*.ts* 2>/dev/null || true
git add truth-seed/emdash-dashboard-main/src/**/*.ts* 2>/dev/null || true
git commit -m "fix(apps): Sessions 87-88 - Auth flow and middleware fixes"

# Group 4: Reconciliation work
git add reconciliation/**/*.md reconciliation/**/*.ts* 2>/dev/null || true
git commit -m "feat(reconciliation): Active work updates"

# Group 5: Reality domain
git add reality/**/*.md reality/**/*.py 2>/dev/null || true
git commit -m "docs(reality): Reality domain updates"

# Check remaining
git status --short | grep "^ M "
```

#### Step 6: Handle New Files (30 min)
```bash
# Review untracked
git status --short | grep "^?? " | head -20

# Session files
git add archive/sessions/SESSION-*.md
git commit -m "docs(sessions): Sessions 84-89 - Logs and handoffs"

# Core documents
git add core/00084-*.md core/00085-*.md core/00086-*.md core/00089-*.md 2>/dev/null || true
git commit -m "docs(core): Sessions 84-89 - Core protocols and analysis"

# Archive organization
git add archive/**/*.md 2>/dev/null || true
git commit -m "docs(archive): Historical documentation organization"

# Any SQL files
git add *.sql 2>/dev/null || true
git commit -m "fix(sql): Database fixes and migrations"

# Check remaining
git status --short | grep "^?? "
```

#### Step 7: Handle Deletions (10 min)
```bash
# Review what's being deleted
git status --short | grep "^ D " | head -20

# Stage all deletions
git add -u
git commit -m "cleanup(legacy): Session 86 - Remove relocated files"
```

#### Step 8: Final Cleanup (10 min)
```bash
# Check what's left
git status --short

# If any stragglers, handle them
# Then verify clean state
git status
# Should show: "nothing to commit, working tree clean"
```

---

### Phase 2: Fix Deployment (30 min)

#### Step 1: Check Vercel Configuration
```bash
# Verify auth location
ls -la truth-seed/emdash-auth-main/
ls -la reconciliation/active-work/auth-gateway/

# Check current vercel.json
cat vercel.json
```

#### Step 2: Update Vercel Config if Needed
If auth is in `truth-seed/`:
```bash
cat > vercel.json << 'EOF'
{
  "buildCommand": "cd truth-seed/emdash-auth-main && npm install && npm run build",
  "outputDirectory": "truth-seed/emdash-auth-main/.next",
  "installCommand": "cd truth-seed/emdash-auth-main && npm install",
  "framework": "nextjs"
}
EOF

git add vercel.json
git commit -m "fix(deploy): Session 90 - Update Vercel paths after reorganization"
```

#### Step 3: Add Missing Environment Variables
```bash
# Via Vercel Dashboard or CLI
vercel env add DATABASE_URL production
# Enter the PostgreSQL connection string from Supabase

vercel env add NEXT_PUBLIC_SUPABASE_URL production
# Enter: https://bbrheacetxlnqbibjwsz.supabase.co

vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production  
# Enter: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJicmhlYWNldHhsbnFiaWJqd3N6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ3MjI4MTIsImV4cCI6MjA3MDI5ODgxMn0.fccLx-9NymP8oqHT_-t-ZPZx0hgi8SGfHUJv1WKmwFE
```

---

### Phase 3: Create PR (30 min)

#### Step 1: Push Branch
```bash
# Push all commits
git push origin pre-reorg-backup-session-66
```

#### Step 2: Create Pull Request
```bash
gh pr create \
  --title "Sessions 66-90: Reality-First Reorganization & Critical Fixes" \
  --body "## 🎯 Summary
This PR contains the Reality-First reorganization from Session 86 plus critical fixes from Sessions 84-89.

## 📊 Major Changes
- **File Organization**: 295 files moved to correct domain locations
- **Metadata Fixes**: 91 files with corrected workflow metadata  
- **Auth Fixes**: Profile creation trigger (Session 85)
- **Middleware Fixes**: Auth flow corrections (Sessions 87-88)
- **Protocol Updates**: YAML made mandatory (Session 84)

## 📁 Files Changed
- 219 pure renames (structural organization)
- 112 renamed with modifications
- 103 new files (session deliverables)
- 58 modified files (fixes and updates)
- 33 removed files (relocated content)

## ✅ Testing Checklist
- [ ] Local build passes
- [ ] Auth flow works end-to-end
- [ ] Dashboard accessible after login
- [ ] Onboarding flow completes
- [ ] Vercel deployment succeeds
- [ ] No broken imports

## 🔍 Review Notes
- Large PR due to accumulated uncommitted work
- Primarily organizational changes
- Critical auth fixes included
- Ready for production after review

## 📚 Documentation
- See `core/00089-BRANCH-STRATEGY-ANALYSIS.md` for details
- See `core/00086-REALITY-FIRST-FILE-PROTOCOL.md` for organization rules"
```

---

## ✅ Verification Checklist

### After Each Phase

#### Phase 1 Verification
- [ ] `git status` shows clean tree
- [ ] All commits have descriptive messages
- [ ] No `.pkl` files in git status
- [ ] Commit count reasonable (~10-15 commits)

#### Phase 2 Verification  
- [ ] Vercel dashboard shows environment variables
- [ ] Local build works: `npm run build`
- [ ] vercel.json points to correct directory

#### Phase 3 Verification
- [ ] PR created and visible on GitHub
- [ ] CI checks initiated
- [ ] Description complete
- [ ] Ready for review

---

## 🛠️ Tools & References

### Session 89 Deliverables
1. `core/00089-BRANCH-STRATEGY-ANALYSIS.md` - Detailed analysis
2. `core/00089-GITHUB-VERCEL-FOUNDATION.md` - Workflow foundation
3. `core/00089-ACTION-PLAN.md` - The blueprint you're executing
4. **`core/00089-CLEANUP-TIPS-FOR-90.md`** - Q&A, tips, and troubleshooting guide
5. **`core/00089-QUICK-REFERENCE-CLEANUP.md`** - Keep this open while working!

### Quick Commands
```bash
# Check progress
git status --short | wc -l  # Should decrease as you commit

# Check commit history
git log --oneline -10

# Test deployment state
python3 reality/agent-reality-auditor/vercel-connector/quickstart.py
```

---

## 🚨 If Things Go Wrong

### Restore from Backup
```bash
# If you need to start over
git reset --hard backup-session-90-pre-cleanup
git stash pop
```

### Get Help
- Check Session 89's analysis documents
- Run reality agents for current state
- Create new issue with `gh issue create`

---

## 🎯 Success Criteria

**You'll know you've succeeded when:**
1. `git status` returns "nothing to commit, working tree clean"
2. Vercel deployment shows READY (not ERROR)
3. PR is created and ready for review
4. You can document: "546 files → 0 uncommitted"

---

## 💡 Key Advice from Session 89

1. **Don't Rush** - Take time with each commit batch
2. **Test Frequently** - Run `git status` after each step
3. **Commit Messages Matter** - Keep them descriptive
4. **Use the Agents** - GitHub and Vercel agents are your friends
5. **Document Issues** - Any problems become Session 91's starting point

---

**Mission Priority**: P0 - This cleanup unlocks all future work

**Estimated Time**: 3-4 hours for complete cleanup

**Risk Level**: Low (we have backups)

**Impact**: Critical - Restores project health and deployability

---

*Good luck Session 90! You're cleaning up critical technical debt that will make all future sessions smoother.*