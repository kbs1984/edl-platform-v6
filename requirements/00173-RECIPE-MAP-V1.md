---
session: "173"
type: "recipe-map"
status: "initial"
created: "2025-09-05"
title: "Recipe-to-User-Story Mapping System"
purpose: "Map v5 UI recipes to 275 user stories for implementation tracking"
topics: ["recipes", "user-stories", "coverage", "implementation"]
priority: "P0"
domain: "requirements"
canonical: true
implements: ["PLATFORM-SPECIFICATION-V1.md", "00172-RECIPE-BASED-WORKFLOW-PROTOCOL.md"]
---

# 🗺️ Recipe Map V1: Connecting Recipes to User Stories

**Created**: Session 173
**Total User Stories**: 275 (105 P0, 119 P1, 51 P2)
**Available Recipes**: 2 validated V2 recipes from v5
**Coverage Goal**: Map all stories to required recipes

---

## 📊 Recipe Coverage Dashboard

### Overall Coverage
```
Total Stories: 275
Stories with Recipes: 23 (8.4%)
Stories Partially Covered: 15 (5.5%)
Stories Needing Recipes: 237 (86.2%)

By Priority:
P0 (Core): 12/105 covered (11.4%) ⚠️
P1 (Essential): 8/119 covered (6.7%) ❌
P2 (Enhancement): 3/51 covered (5.9%) ❌
```

### Canvas Coverage
```
001-1 Onboarding & Directory: 1 recipe ⏳
002-1 PlayerID Profile: 1 recipe (pending) ⏳
002-3 Badges Box: 0 recipes ❌
001-4 Activity & Registrar: 0 recipes ❌
001-5 Activity Instance: 0 recipes ❌ CRITICAL GAP
```

---

## 🎯 P0 Story → Recipe Mapping

### Authentication (15 stories)
**Canvas**: 001-1. num.label.Onboarding&Directory

| Story | Title | Recipe Status | Recipe Needed |
|-------|-------|--------------|---------------|
| US-001 | Player creates account | ⏳ Partial | auth-flow-recipe-v2.md |
| US-002 | Player logs in | ⏳ Partial | login-form-recipe-v2.md |
| US-003 | Player resets password | ❌ Missing | password-reset-recipe-v2.md |
| US-004 | Player verifies email | ❌ Missing | email-verify-recipe-v2.md |
| US-005 | Player selects role | ❌ Missing | role-selector-recipe-v2.md |

### Dashboard & Profile (21 stories)
**Canvas**: 002-1. seed.PlayerID Profile Box

| Story | Title | Recipe Status | Recipe Needed |
|-------|-------|--------------|---------------|
| US-021 | Player views profile | ⏳ Pending | profile-card-recipe-v2.md |
| US-022 | Player edits profile | ❌ Missing | profile-edit-recipe-v2.md |
| US-023 | Player tracks streak | ✅ **COVERED** | addiction-bar-recipe-v2.md |
| US-024 | Player views visitors | ✅ **COVERED** | addiction-bar-recipe-v2.md |
| US-025 | Player checks EmCoins | ✅ **COVERED** | addiction-bar-recipe-v2.md |
| US-026 | Player views today count | ✅ **COVERED** | addiction-bar-recipe-v2.md |
| US-027 | Player sees dashboard grid | ❌ Missing | dashboard-grid-recipe-v2.md |
| US-028 | Player navigates sections | ❌ Missing | navigation-recipe-v2.md |

### Team Management (12 stories)
**Canvas**: 002-2. needlabel.Associated Teams Box

| Story | Title | Recipe Status | Recipe Needed |
|-------|-------|--------------|---------------|
| US-041 | Player creates team | ❌ Missing | team-creation-recipe-v2.md |
| US-042 | Player invites members | ❌ Missing | team-invite-recipe-v2.md |
| US-043 | Player views team list | ❌ Missing | team-list-recipe-v2.md |
| US-044 | Supervisor manages team | ❌ Missing | team-management-recipe-v2.md |

### Activity Runtime (50 stories) 🚨 CRITICAL
**Canvas**: 001-5. seed.Activity Instance

| Story | Title | Recipe Status | Recipe Needed |
|-------|-------|--------------|---------------|
| US-155 | Multi-session structure | ❌ Missing | session-flow-recipe-v2.md |
| US-156 | Session state persistence | ❌ Missing | state-persist-recipe-v2.md |
| US-157 | Session transitions | ❌ Missing | session-nav-recipe-v2.md |
| US-158 | In-activity assignments | ❌ Missing | assignment-recipe-v2.md |
| US-159 | Assignment submission | ❌ Missing | submit-flow-recipe-v2.md |
| US-160 | Question submission | ❌ Missing | question-recipe-v2.md |
| US-161 | Deadline enforcement | ❌ Missing | deadline-recipe-v2.md |
| US-162 | Extension requests | ❌ Missing | extension-recipe-v2.md |

### EmCoin Transactions (7 stories)
**Canvas**: 003-2. seed.emCoin Transactions Box

| Story | Title | Recipe Status | Recipe Needed |
|-------|-------|--------------|---------------|
| US-098 | Player earns EmCoins | ⏳ Partial | emcoin-earn-recipe-v2.md |
| US-099 | Player spends EmCoins | ❌ Missing | emcoin-spend-recipe-v2.md |
| US-100 | Player views history | ❌ Missing | transaction-history-recipe-v2.md |

---

## 📈 Recipe Impact Analysis

### High-Impact Recipes (Cover Multiple Stories)

1. **addiction-bar-recipe-v2.md** ✅ AVAILABLE
   - Covers: US-023, US-024, US-025, US-026
   - Impact: 4 P0 stories (3.8% of P0)
   - Status: Validated, 95/100 quality score

2. **session-flow-recipe-v2.md** ❌ NEEDED
   - Would cover: US-155, US-156, US-157, US-163, US-164
   - Impact: 5 P0 stories (4.8% of P0)
   - Priority: CRITICAL - Activity runtime core

3. **team-card-recipe-v2.md** ❌ NEEDED
   - Would cover: US-041, US-043, US-044, US-045
   - Impact: 4 P0 stories (3.8% of P0)
   - Priority: HIGH - Team functionality

4. **badge-display-recipe-v2.md** ❌ NEEDED
   - Would cover: US-067, US-068, US-069, US-070
   - Impact: 4 P1 stories
   - Priority: MEDIUM - Achievement system

---

## 🎯 Priority Recipe Requests for V5

### Immediate P0 Needs (Block Core Functionality)

```markdown
## Priority 1: Activity Runtime Recipes
CRITICAL - 50 stories depend on these!

1. session-flow-recipe-v2.md
   - Canvas: 001-5. seed.Activity Instance
   - Node IDs: [Extract from canvas]
   - Covers: Multi-session navigation

2. assignment-recipe-v2.md
   - Canvas: 001-5. seed.Activity Instance
   - Covers: Assignment creation/submission

3. deadline-recipe-v2.md
   - Canvas: 001-5. seed.Activity Instance
   - Covers: Time management features
```

### Next Wave P0 Needs

```markdown
## Priority 2: Team & Profile Recipes

1. profile-card-recipe-v2.md
   - Canvas: 002-1. seed.PlayerID Profile Box
   - Node IDs: 152f5f791b5529a7, 97721f755ce8f9db
   - Status: Template exists, needs v2 upgrade

2. team-card-recipe-v2.md
   - Canvas: 002-2. needlabel.Associated Teams Box
   - Covers: Team display and management

3. dashboard-grid-recipe-v2.md
   - Canvas: 002-1. seed.PlayerID Profile Box
   - Covers: Main dashboard layout
```

---

## 🔄 Recipe Validation Pipeline

### For Each Incoming Recipe:

```bash
# 1. Canvas Validation
python3 verify-canvas-mapping.py \
  --recipe new-recipe-v2.md \
  --canvas "001-5. seed.Activity Instance.canvas"

# 2. Architecture Check
node recipe-validator.js new-recipe-v2.md
# Must score 85+ and have NO React patterns

# 3. Story Mapping
python3 scripts/00173-map-recipe-to-stories.py \
  --recipe new-recipe-v2.md \
  --stories requirements/P0-*.md

# 4. Update Recipe Map
python3 scripts/00173-update-recipe-map.py \
  --recipe new-recipe-v2.md \
  --coverage RECIPE-MAP-V1.md
```

---

## 📊 Coverage Metrics

### By Component Area

| Area | Total Stories | Recipes Available | Coverage |
|------|--------------|-------------------|----------|
| Authentication | 15 | 0 | 0% ❌ |
| Dashboard | 21 | 1 | 19% ⚠️ |
| Teams | 12 | 0 | 0% ❌ |
| Activities | 74 | 0 | 0% ❌ CRITICAL |
| EmCoins | 14 | 0.5 | 7% ❌ |
| Badges | 16 | 0 | 0% ❌ |
| Resources | 18 | 0 | 0% ❌ |
| Communication | 25 | 0 | 0% ❌ |

### Recipe Quality Scores

| Recipe | Quality Score | Status |
|--------|--------------|--------|
| addiction-bar-recipe-v2.md | 95/100 | ✅ Production Ready |
| profile-card-recipe.md | 85/100 | ⏳ Needs V2 Upgrade |
| [pending recipes] | TBD | 🔄 Awaiting Creation |

---

## 🚀 Next Steps

1. **Request Activity Runtime Recipes** from V5 (CRITICAL)
2. **Upgrade profile-card to V2** using new template
3. **Create recipe request specification** for V5 team
4. **Build automated coverage tracker** updating this map
5. **Implement recipe validation pipeline** for incoming recipes

---

## 📝 Notes

- Activity Runtime (50 stories) is the biggest gap - represents the ENGINE
- V5's addiction-bar-recipe-v2.md is exemplary - use as gold standard
- Need minimum 85/100 quality score for production use
- Canvas node verification is critical for visual fidelity
- NO React patterns allowed per Session 152 architecture

---

**Last Updated**: Session 173
**Validation**: All recipes must pass architectural compliance
**Authority**: Session 152 (Server Components + V5 Bridge)