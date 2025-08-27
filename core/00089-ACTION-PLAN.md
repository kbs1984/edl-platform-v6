---
session: "00089"
type: "plan"
status: "current"
created: "2025-08-27"
title: "Session 00089 Action Plan - Structural Integrity Recovery"
purpose: "Concrete action plan for managing 546 uncommitted changes and fixing deployment"
topics: ["action-plan", "git", "deployment", "structural-integrity"]
priority: "P0"
domain: "core"
---

# Session 00089 Action Plan - Structural Integrity Recovery

**Date**: 2025-08-27  
**Mission**: Clean up 546 uncommitted changes and restore deployment health

## 📊 Current State Summary

### Git State
- **Branch**: `pre-reorg-backup-session-66` 
- **Uncommitted**: 546 files (219 renames, 112 rename+modify, 103 new, 58 modified, 33 deleted)
- **Divergence**: 10 commits ahead of master (Sessions 67-71)

### Agent Status
- **GitHub**: ✅ Fully operational (8/8 checks, ADMIN access)
- **Vercel**: ⚠️ Connected but deployment failing
- **Issue**: Production deployment in ERROR state

### Root Causes
1. Session 86's Reality-First reorganization never committed
2. Vercel deployment pointing to moved files
3. Missing DATABASE_URL in Vercel environment

## 🎯 Immediate Action Items

### Phase 1: Git Cleanup (Priority: CRITICAL)

#### Step 1: Remove Cache File from Tracking
```bash
# This file shouldn't be tracked
git rm --cached .yaml-index-cache.pkl
echo "*.pkl" >> .gitignore
git add .gitignore
git commit -m "fix(git): Session 89 - Remove cache files from tracking"
```

#### Step 2: Commit Pure Renames (219 files)
```bash
# Add all pure rename operations (no content changes)
git status --short | grep "^R  " | cut -c4- | while read line; do
    git add "$line"
done
git commit -m "refactor(structure): Session 86 - Reality-First reorganization (pure renames)"
```

#### Step 3: Commit Renamed + Modified Files (112 files)
```bash
# Add renamed files that also have modifications
git status --short | grep "^RM " | cut -c4- | while read line; do
    git add "$line"
done
git commit -m "refactor(structure): Session 86 - Reality-First reorganization (renames with updates)"
```

#### Step 4: Commit Content Modifications (58 files)
```bash
# Review modified files first
git status --short | grep "^ M " | cut -c4-

# Add in logical groups (example groupings)
git add .claude/commands/*.md
git commit -m "docs(commands): Session 89 - Update Claude commands"

git add scripts/*.py scripts/*.sh
git commit -m "feat(scripts): Sessions 84-89 - New tools and fixes"

git add truth-seed/emdash-*/src/**
git commit -m "fix(apps): Session 87-88 - Auth flow and middleware fixes"
```

#### Step 5: Handle New Files (103 files)
```bash
# Review untracked files
git status --short | grep "^?? " | cut -c4-

# Add session deliverables
git add archive/sessions/SESSION-*
git commit -m "docs(sessions): Sessions 84-89 - Session logs and handoffs"

# Add new core documents
git add core/00084-*.md core/00085-*.md core/00086-*.md core/00089-*.md
git commit -m "docs(core): Sessions 84-89 - Core documentation and protocols"
```

#### Step 6: Handle Deletions (33 files)
```bash
# Review deletions
git status --short | grep "^ D " | cut -c4-

# Add deletions
git add -u
git commit -m "cleanup(legacy): Session 86 - Remove relocated legacy files"
```

### Phase 2: Deployment Fix (Priority: HIGH)

#### Step 1: Fix Vercel Configuration
```bash
# Check if auth-gateway is in right place
ls -la reconciliation/active-work/auth-gateway/

# If moved, update vercel.json
cat > vercel.json << 'EOF'
{
  "buildCommand": "cd truth-seed/emdash-auth-main && npm install && npm run build",
  "outputDirectory": "truth-seed/emdash-auth-main/.next",
  "installCommand": "cd truth-seed/emdash-auth-main && npm install",
  "framework": "nextjs"
}
EOF

git add vercel.json
git commit -m "fix(deploy): Session 89 - Update Vercel paths after reorganization"
```

#### Step 2: Add Missing Environment Variables
```bash
# Use Vercel CLI or dashboard to add:
DATABASE_URL=postgresql://[from-supabase]
NEXT_PUBLIC_SUPABASE_URL=https://bbrheacetxlnqbibjwsz.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Or via CLI:
vercel env add DATABASE_URL production
vercel env add NEXT_PUBLIC_SUPABASE_URL production
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production
```

### Phase 3: Branch Management (Priority: MEDIUM)

#### Option A: Clean PR to Master
```bash
# After all commits
gh pr create \
  --title "Sessions 66-89: Reality-First Reorganization & Fixes" \
  --body "## Major Changes
  - Reality-First file reorganization (Session 86)
  - YAML metadata enhancement
  - Auth flow fixes (Session 85)
  - Profile creation trigger
  - Middleware fixes (Sessions 87-88)
  
  ## Files Changed
  - 295 files reorganized by domain
  - 91 files with fixed metadata
  - New session deliverables
  
  ## Testing
  - [ ] Local build passes
  - [ ] Auth flow works
  - [ ] Dashboard accessible
  - [ ] Vercel deployment succeeds"
```

#### Option B: Feature Branch Strategy
```bash
# Create feature branch
git checkout -b feature/reality-first-reorg

# Cherry-pick only stable commits
git cherry-pick [commit-hashes]

# Create targeted PR
```

## 📋 Verification Checklist

### After Git Cleanup
- [ ] `git status --short | wc -l` returns 0
- [ ] All commits have descriptive messages
- [ ] No cache files in git status

### After Deployment Fix
- [ ] Vercel shows READY state
- [ ] Production URL accessible
- [ ] Environment variables set
- [ ] Auth flow works end-to-end

### After Branch Management
- [ ] PR created with description
- [ ] CI checks passing
- [ ] Ready for review/merge

## 🚨 Risk Mitigation

### Before Starting
```bash
# Create safety backup
git stash -u -m "Session 89 - Complete state backup"
git branch backup-session-89-pre-cleanup
```

### During Process
- Commit after each logical group
- Test build after major changes
- Keep commit messages consistent

### If Things Go Wrong
```bash
# Restore from backup
git checkout backup-session-89-pre-cleanup
git stash pop
```

## 📊 Success Metrics

1. **Git Health**
   - Zero uncommitted files ✅
   - Clear commit history ✅
   - Ready for PR/merge ✅

2. **Deployment Health**
   - Vercel deployment succeeds ✅
   - Production accessible ✅
   - No ERROR states ✅

3. **Process Health**
   - Foundation documented ✅
   - Agents integrated ✅
   - Workflow sustainable ✅

## 🎯 Next Session Guidance

After completing this cleanup:

1. **Session 90**: 
   - Start with clean git state
   - Continue Session 88's onboarding work
   - Use new commit discipline

2. **Ongoing**:
   - Commit every 50 files max
   - Run deployment check before push
   - Use GitHub/Vercel agents for monitoring

## 📚 Deliverables from Session 89

1. **Analysis**: `core/00089-BRANCH-STRATEGY-ANALYSIS.md`
2. **Foundation**: `core/00089-GITHUB-VERCEL-FOUNDATION.md`
3. **Action Plan**: `core/00089-ACTION-PLAN.md` (this file)
4. **Clean Git State**: 546 files properly committed
5. **Fixed Deployment**: Vercel working again

---

**Time Estimate**: 2-3 hours for complete cleanup
**Risk Level**: Medium (have backups)
**Impact**: High (restores project health)