---
created: '2025-08-21'
domain: core
estimated_shelf_life: indefinite
priority: P0
purpose: Define the organizational structure after Truth Seed adoption pivot
related_to:
- 00042-TRUTH-SEED-ADOPTION-DECISION.md
- requirements/masterplans/AUTH-MASTERPLAN.md
review_date: '2025-09-21'
session: '00041'
status: current
title: Domain Organization Protocol - Truth Seed Architecture
topics:
- architecture
- domains
- organization
- truth-seed
type: specification
---

# Domain Organization Protocol - Truth Seed Architecture
**Created**: Session 00041  
**Date**: 2025-08-21  
**Purpose**: Clarify where work belongs in the three-domain system post-pivot

---

## Core Principle: Clear Domain Boundaries

With the Truth Seed pivot, we must maintain clear separation of concerns:
- **Requirements**: Documents what we NEED
- **Reality**: Documents what EXISTS
- **Reconciliation**: Documents the WORK to bridge gaps

---

## Domain Assignment Rules

### Requirements Domain Contains:
```
requirements/
├── masterplans/
│   ├── AUTH-MASTERPLAN.md          # What auth needs to do
│   ├── DASHBOARD-MASTERPLAN.md     # What dashboard needs to do
│   └── FAT-CLIENT-MASTERPLAN.md    # Future: vanilla JS plans
├── specifications/
│   ├── call-sign-spec.md           # How call signs should work
│   ├── emcoin-spec.md               # Economy system design
│   └── achievement-spec.md         # Gamification design
├── user-stories/
│   └── [existing 275 stories]      # What users need
└── success-criteria/
    └── mvp-criteria.md              # Definition of done
```

**Key Rule**: If it describes "what should be", it goes in Requirements

### Reality Domain Contains:
```
reality/
├── truth-seed-manifest.json         # Inventory of what exists
├── truth-seed/                      # SYMLINK to /truth-seed/
│   ├── emdash-auth-main/           # Working auth gateway
│   ├── emdash-dashboard-main/      # Partial dashboard
│   └── supabase-migration/         # Database state
├── deployed-systems/
│   ├── vercel-deployments.json     # What's live
│   ├── supabase-tables.json        # Current schema
│   └── github-commits.json         # Code history
├── agent-reality-auditor/          # Reality monitoring
│   └── [7 agent connectors]        # Truth verification
└── operational-metrics/
    ├── user-count.json              # Real usage
    ├── system-health.json           # Current state
    └── performance.json             # Actual metrics
```

**Key Rule**: If it exists and works, it goes in Reality

### Reconciliation Domain Contains:
```
reconciliation/
├── active-work/
│   ├── call-sign-implementation/   # WIP: Adding call signs
│   ├── auth-deployment/            # WIP: Deploying auth
│   └── dashboard-completion/       # WIP: Fixing dashboard
├── migration-scripts/
│   ├── add-call-sign-column.sql    # Database changes
│   ├── update-rls-policies.sql     # Security updates
│   └── seed-test-data.sql          # Test data
├── test-results/
│   ├── auth-flow-test.md           # Validation results
│   ├── cookie-sharing-test.md      # Integration tests
│   └── onboarding-test.md          # User flow tests
└── gap-analysis/
    ├── feature-gaps.md              # What's missing
    ├── bug-list.md                  # What's broken
    └── debt-tracker.md              # Technical debt
```

**Key Rule**: If it's actively being worked on, it goes in Reconciliation

---

## Communication Protocols Between Domains

### Requirements → Reality Flow
```json
// requirements/needed-features.json
{
  "feature": "call_sign_system",
  "priority": "P0",
  "spec": "requirements/specifications/call-sign-spec.md"
}

// reality/feature-status.json
{
  "call_sign_system": {
    "exists": false,
    "table_column": false,
    "ui_component": false,
    "verified_by": "supabase-agent"
  }
}
```

### Reality → Reconciliation Flow
```json
// reality/gaps-detected.json
{
  "missing_features": ["call_sign", "achievements"],
  "broken_features": ["team_chat"],
  "performance_issues": ["dashboard_load_time"]
}

// reconciliation/work-queue.json
{
  "priority_1": "call_sign_implementation",
  "priority_2": "fix_team_chat",
  "priority_3": "optimize_dashboard"
}
```

### Reconciliation → Reality Flow
```json
// reconciliation/completed-work.json
{
  "feature": "call_sign_system",
  "status": "complete",
  "tested": true,
  "deployed": true,
  "move_to_reality": true
}

// reality/truth-seed-manifest.json (updated)
{
  "call_sign_system": {
    "exists": true,
    "location": "truth-seed/emdash-dashboard-main/",
    "verified": "2025-08-21"
  }
}
```

---

## Root Directory Reorganization

### Current State (Messy)
```
edl-platform-v6/
├── truth-seed/              # Should be in reality/
├── AUTH-MASTERPLAN.md       # Should be in requirements/
├── DASHBOARD-MASTERPLAN.md  # Should be in requirements/
├── supabase/                # Mixed (some reality, some reconciliation)
└── [various other files]
```

### Proposed Clean State
```
edl-platform-v6/
├── requirements/            # What we need
│   ├── masterplans/        # Strategic documents
│   ├── specifications/     # Detailed specs
│   └── INDEX.md           # Requirements overview
├── reality/                # What exists
│   ├── truth-seed/        # Link to working code
│   ├── agent-reality-auditor/
│   └── INDEX.md           # Reality overview
├── reconciliation/         # Active work
│   ├── active-work/       # Current development
│   ├── gap-analysis/      # What needs doing
│   └── INDEX.md           # Work overview
├── archive/                # Historical record
├── scripts/                # Tools and automation
└── CLAUDE.md              # Session protocol (stays at root)
```

---

## Migration Commands (Session 41 Cleanup)

```bash
# 1. Move masterplans to requirements
mkdir -p requirements/masterplans
mv AUTH-MASTERPLAN.md requirements/masterplans/
mv DASHBOARD-MASTERPLAN.md requirements/masterplans/
mv RESTORATION-MASTERPLAN-V4.md requirements/masterplans/

# 2. Create symlink for truth-seed in reality
ln -s ../truth-seed reality/truth-seed

# 3. Create manifest for reality
cat > reality/truth-seed-manifest.json << 'EOF'
{
  "auth_gateway": {
    "status": "functional",
    "location": "truth-seed/emdash-auth-main/",
    "features": ["email_auth", "oauth", "cookie_sharing"]
  },
  "dashboard": {
    "status": "partial",
    "location": "truth-seed/emdash-dashboard-main/",
    "working": ["onboarding", "routing", "components"],
    "broken": ["call_sign", "judge_dashboard", "guardian_dashboard"]
  },
  "database": {
    "status": "deployed",
    "tables": 36,
    "schemas": ["public", "debate", "chat"],
    "missing": ["call_sign_column"]
  }
}
EOF

# 4. Create reconciliation workspace
mkdir -p reconciliation/active-work/session-42-auth-deployment
mkdir -p reconciliation/active-work/session-43-dashboard-completion

# 5. Update domain INDEX files
echo "Updated $(date)" >> requirements/REQUIREMENTS_INDEX.md
echo "Updated $(date)" >> reality/REALITY_INDEX.md
echo "Created $(date)" >> reconciliation/RECONCILIATION_INDEX.md
```

---

## Benefits of This Organization

### 1. **Clear Ownership**
- Requirements owns "what we need"
- Reality owns "what exists"
- Reconciliation owns "work in progress"

### 2. **Easy Navigation**
- Future sessions know exactly where to look
- No confusion about what's strategic vs operational

### 3. **Progress Tracking**
- Work flows from Requirements → Reconciliation → Reality
- Clear graduation path for completed work

### 4. **Reality Agent Integration**
- Reality Agents monitor reality/ domain
- Can easily diff against requirements/
- Reconciliation shows active gaps

### 5. **Prevents Confusion**
- Masterplans aren't mixed with working code
- WIP isn't confused with production
- Historical work stays in archive/

---

## Domain Communication Manifest

Each domain should maintain a manifest for inter-domain communication:

### requirements/MANIFEST.json
```json
{
  "needed_features": [...],
  "success_criteria": [...],
  "priorities": [...]
}
```

### reality/MANIFEST.json
```json
{
  "existing_features": [...],
  "system_health": 97,
  "verified_by_agents": true
}
```

### reconciliation/MANIFEST.json
```json
{
  "active_work": [...],
  "blocked_items": [...],
  "ready_for_reality": [...]
}
```

---

## Session Handoff Protocol

When ending a session:
1. Update domain manifests
2. Move completed work from reconciliation/ to reality/
3. Update gap analysis in reconciliation/
4. Run Reality Agents to verify state
5. Document in session log

---

## Conclusion

This organization ensures:
- **No confusion** about where work belongs
- **Clear progress** tracking
- **Easy handoffs** between sessions
- **Reality Agents** can monitor effectively
- **Technical debt** is minimized

The Truth Seed pivot requires clear thinking about what exists (Reality) versus what we need (Requirements). This structure enforces that clarity.