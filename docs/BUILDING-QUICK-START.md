---
session: "unknown"
type: "documentation"
status: "current"
created: "2025-08-23"
title: "Quick Start for Building Sessions"
purpose: "Document quick start for building sessions"
topics: ['auth', 'database', 'documentation']
priority: "P1"
domain: "core"
---

# Quick Start for Building Sessions

**Created**: Session 38 Infrastructure Freeze
**Purpose**: Get building features immediately, skip infrastructure

## Start Building in 3 Commands

```bash
# 1. Start your session (6 seconds)
./scripts/00028-session-start.sh 00039

# 2. Verify requirements are ready
./scripts/00036-verify-requirements.sh
# If READY, start coding. If not, check gaps.

# 3. Check health only if something breaks
./scripts/00036-tos-dashboard-truth.sh
```

## P0 First Feature Locations

### Authentication & Identity (US-001 to US-007)
- **Requirements**: `requirements/user-stories/P0-AUTHENTICATION-STORIES.md`
- **Database**: `profiles` table with `call_sign` column ready
- **Build Location**: `auth/create-identity.html` (new file)
- **Story to Start**: US-001 - Player Registration

### Teams (US-008 to US-019)
- **Requirements**: `requirements/user-stories/P0-TEAM-STORIES.md`
- **Database**: `teams`, `team_members`, `team_join_requests` tables ready
- **Existing UI**: `index.html` has team functionality started

### Player Dashboard (US-020 to US-040)
- **Requirements**: `requirements/user-stories/P0-DASHBOARD-PROFILE-STORIES.md`
- **Build Location**: Create new dashboard pages as needed

## Don't Touch (Infrastructure Frozen)

### Leave These Alone
- Reality Agents code (`reality/agents/`)
- Truth API internals (`scripts/00035-truth-api.py`)
- Constitutional OS (`scripts/00031-*.py`, `scripts/00032-*.py`)
- Session automation (`scripts/00028-*.sh`)
- Just BUILD features

### Exception: Only If Broken
If infrastructure actively prevents building:
1. Document the blocker
2. Make minimal fix
3. Document in session log
4. Continue building

## Success = Students Using It

### What Success Looks Like
- ✅ Student creates first call sign
- ✅ Student joins first team
- ✅ Student completes first activity
- ✅ Parent sees child's progress

### What Success Is NOT
- ❌ Perfect infrastructure metrics
- ❌ 100% test coverage
- ❌ All agents operational
- ❌ Optimized performance

## File Naming Convention

All new feature files MUST be prefixed with session number:
- `00039-feature-name.html`
- `scripts/00039-helper.js`
- Enables tracking who built what when

## Quick Troubleshooting

### If Requirements Verification Fails
```bash
python3 scripts/00036-requirement-verifier.py --json
# Shows specific gaps to address
```

### If Database Connection Fails
```bash
# Check credentials are set
echo $SUPABASE_URL
echo $SUPABASE_ANON_KEY
```

### If Nothing Works
```bash
# Check system health
./scripts/00036-tos-dashboard-truth.sh --deep
# But remember: 85% health is good enough to build
```

## The Prime Directive

**Build something a student can use TODAY.**

Not tomorrow. Not after refactoring. Not after optimization.

TODAY.

---

*Stop reading documentation. Start building features. Session 39 awaits.*