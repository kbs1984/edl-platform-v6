---
session: "180"
type: "workflow"
status: "active"
created: "2025-09-06T02:00:00.000Z"
title: "Commit Workflow with MCP/Agent Safeguards"
purpose: "Establish secure commit practices to prevent architectural disasters"
topics: ["git", "workflow", "safeguards", "mcp", "agents"]
priority: "P0"
domain: "core"
---

# Session 180: Commit Workflow with MCP/Agent Safeguards

## The Problem We're Solving
Sessions 167-178 created 14,000 lines of architecturally incompatible code because:
1. No architectural enforcement
2. No regular commit checkpoints
3. No integration validation
4. Recovery took hours of manual cleanup

## The New Workflow

### 1. Daily Commit Checkpoint (MANDATORY)
```bash
# At the end of each session
./scripts/00180-daily-checkpoint.sh [SESSION_NUMBER]

# This script will:
# 1. Run architecture validation
# 2. Check build status
# 3. Create timestamped commit
# 4. Push to feature branch
# 5. Run integration tests
```

### 2. Pre-Commit Architecture Validation
```bash
# .git/hooks/pre-commit
#!/bin/bash

# Check for React hooks in Server Components
if grep -r "useState\|useEffect\|useContext" src/ --include="*.tsx" | grep -v "use client"; then
  echo "❌ ERROR: React hooks found in Server Components!"
  echo "Add 'use client' directive or use Server Component patterns"
  exit 1
fi

# Verify imports resolve
npm run type-check || exit 1

# Check CSS compilation
if [ -d ".next" ]; then
  test -f .next/static/css/app/layout.css || {
    echo "⚠️ WARNING: CSS not compiled"
    rm -rf .next node_modules/.cache
  }
fi
```

### 3. MCP Integration for Commits

#### Using MCP Session Tracking
```typescript
// Every significant change should be tracked
mcp__edl-v6-session__track_deliverable({
  path: "src/components/feature.tsx",
  type: "component",
  description: "Server Component with V5 bridge",
  linesOfCode: 150
})

// Before commit, verify with agents
mcp__reality-server__orchestrate({
  critical_only: false,
  include_performance: true
})
```

#### Automated Commit with MCP
```bash
# New commit workflow using MCP
python3 scripts/00180-mcp-commit.py \
  --session 180 \
  --feature "Recovery checkpoint" \
  --validate-architecture \
  --run-tests
```

### 4. Parallel Batch Safeguards

#### A. Branch Strategy
```bash
# NEVER work directly on master
# Create feature branches with clear naming
git checkout -b session-[NUMBER]-[FEATURE]

# For parallel batches
git checkout -b parallel-batch-[BATCH_NUMBER]-[FEATURE]
```

#### B. Daily Integration (for parallel work)
```bash
# Every 24 hours during parallel batches
./scripts/00180-parallel-integration.sh

# This will:
# 1. Pull all parallel branches
# 2. Attempt merge to integration branch
# 3. Run full test suite
# 4. Report conflicts/issues
# 5. NOT auto-resolve (human review required)
```

#### C. Rollback Strategy
```bash
# Tag working states BEFORE major changes
git tag -a "pre-parallel-batch-3" -m "Working state before batch 3"
git push origin --tags

# Quick rollback if needed
git reset --hard pre-parallel-batch-3
```

### 5. Architecture Enforcement

#### ESLint Configuration
```javascript
// .eslintrc.js
module.exports = {
  overrides: [{
    files: ['src/**/*.tsx', '!src/**/*.client.tsx'],
    rules: {
      'no-restricted-imports': ['error', {
        paths: [{
          name: 'react',
          importNames: ['useState', 'useEffect', 'useContext', 'useReducer'],
          message: 'Server Components cannot use React hooks. Use V5 bridge pattern or add "use client" directive.'
        }]
      }]
    }
  }]
}
```

#### TypeScript Strict Mode
```json
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true
  }
}
```

### 6. Progress Matrix Integration

#### Update After Each Commit
```sql
-- Run after significant features
INSERT INTO platform_progress_matrix (
  feature_name,
  status,
  database_tables,
  ui_components,
  last_validated,
  session_id
) VALUES (
  'Recovery Checkpoint',
  'validated',
  '["all_tables"]'::jsonb,
  '["stub_components"]'::jsonb,
  NOW(),
  '180'
);
```

#### Query Before Starting Work
```bash
# Check what's already done
mcp__supabase-dev__execute_sql "
  SELECT feature_name, status, known_issues 
  FROM platform_progress_matrix 
  WHERE status != 'production'
  ORDER BY priority
"
```

### 7. GitHub PR Workflow

#### Automated PR Creation
```bash
# After daily checkpoint
gh pr create \
  --title "Session $SESSION: $FEATURE" \
  --body "$(python3 scripts/00180-generate-pr-body.py)" \
  --draft \
  --label "session-$SESSION"
```

#### PR Validation Checklist
- [ ] Architecture validation passed
- [ ] Build successful
- [ ] TypeScript no errors
- [ ] CSS compiles
- [ ] Database migrations tested
- [ ] V5 bridge pattern followed
- [ ] No React hooks in Server Components
- [ ] Integration tests pass

### 8. Emergency Recovery Procedures

#### If Build Breaks
```bash
# 1. Don't panic
# 2. Check last known good commit
git log --oneline -10

# 3. Stash current changes
git stash

# 4. Reset to last working
git reset --hard [LAST_GOOD_COMMIT]

# 5. Fix in small increments
git stash pop
# Fix one file at a time
```

#### If CSS Breaks (Tailwind v4 issue)
```bash
# Known issue - Session 156 solution
cd reconciliation/active-work/dashboard
rm -rf .next node_modules/.cache
npm run dev
```

## Implementation Checklist

### Immediate (Session 180)
- [x] Create this workflow document
- [x] Push recovery checkpoint to GitHub
- [ ] Add ESLint rules for Server Components
- [ ] Create daily checkpoint script
- [ ] Update .gitignore properly

### Next Session (181)
- [ ] Implement MCP commit integration
- [ ] Create parallel integration script
- [ ] Add pre-commit hooks
- [ ] Test rollback procedures

### Before Parallel Batch #3
- [ ] Tag current working state
- [ ] Brief all parallel developers on workflow
- [ ] Set up integration branch
- [ ] Schedule daily sync meetings
- [ ] Prepare rollback plan

## Success Metrics
- Zero architectural mismatches in commits
- Daily commits with validation
- Build always passes on master
- Rollback possible within 5 minutes
- No more 14,000 line deletions

## The Golden Rule
**"Commit early, commit often, validate always"**

If you're unsure whether to commit - COMMIT.
If the build might break - DON'T MERGE.
If architecture seems wrong - STOP AND ASK.

---

*Created Session 180 after learning from 14,000 lines of deleted code*
*The best disaster is one that never happens*