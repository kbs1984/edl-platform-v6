---
session: "173"
type: "recipe-request"
status: "ready"
created: "2025-09-05"
title: "Priority Recipe Request List for V5 Session"
purpose: "Request specific UI recipes from v5 to enable implementation of P0 user stories"
topics: ["recipes", "v5-integration", "requests", "implementation"]
priority: "P0"
domain: "requirements"
for: "v5-recipe-extraction-session"
based_on: ["00173-RECIPE-MAP-V1.md"]
validation_tools: ["verify-canvas-mapping.py", "recipe-validator.js"]
---

# 📋 Priority Recipe Request List for V5 Session

**Session**: 173  
**Date**: September 5, 2025  
**Requestor**: V6 Platform Team  
**Target**: V5 Recipe Extraction Session

---

## 🎯 Executive Summary

Based on our Recipe Map analysis of 275 user stories, we need specific V2 recipes to enable implementation. Currently only 8.4% of stories have recipes. The Activity Runtime engine (50 stories) has 0% coverage and is our most critical gap.

---

## 🚨 PRIORITY 1: Activity Runtime Recipes (CRITICAL)
**Impact**: Unlocks 50 P0 stories (47.6% of all P0 stories)  
**Canvas**: `001-5. seed.Activity Instance.canvas`

### 1. session-flow-recipe-v2.md
**Purpose**: Multi-session activity navigation and state management  
**Canvas Nodes**: Extract from 001-5 showing "Session 1 of 5", "Move to S2"  
**Covers User Stories**: US-155, US-156, US-157, US-163, US-164  
**Required Components**:
- Session progress indicator
- Session state persistence
- Navigation between sessions
- Save and resume functionality
- Session completion tracking

### 2. assignment-submission-recipe-v2.md
**Purpose**: In-activity assignment creation and submission  
**Canvas Nodes**: Extract from 001-5 "Assignment: Submit a draft case"  
**Covers User Stories**: US-158, US-159, US-165  
**Required Components**:
- Assignment display within activity
- File upload interface
- Text submission forms
- Citation requirements
- Submission confirmation

### 3. deadline-timer-recipe-v2.md
**Purpose**: Deadline display and enforcement  
**Canvas Nodes**: Extract from 001-5 "Deadline: YYMMDD by TT:TT"  
**Covers User Stories**: US-161, US-162, US-166  
**Required Components**:
- Countdown timer display
- Timezone-aware deadlines
- Extension request interface
- Late submission handling
- Deadline warnings

### 4. question-submission-recipe-v2.md
**Purpose**: Interactive question submission system  
**Canvas Nodes**: Extract from 001-5 "Submit Three Questions"  
**Covers User Stories**: US-160, US-167  
**Required Components**:
- Question entry forms
- Question counter/tracker
- Submission validation
- Response window timer

---

## 🎯 PRIORITY 2: Team Management Recipes
**Impact**: Unlocks 12 P0 stories  
**Canvas**: `002-2. needlabel.Associated Teams Box.canvas`

### 5. team-card-recipe-v2.md
**Purpose**: Team display and overview card  
**Canvas Nodes**: Extract team display nodes from 002-2  
**Covers User Stories**: US-041, US-043, US-044  
**Required Components**:
- Team name and logo
- Member count display
- Team status indicator
- Quick actions menu
- Role-based styling

### 6. team-invite-recipe-v2.md
**Purpose**: Team invitation system  
**Canvas Nodes**: Extract invitation nodes from 002-2  
**Covers User Stories**: US-042, US-045, US-046  
**Required Components**:
- Invite modal/form
- Email/username input
- Role selection
- Invitation status tracking
- Bulk invite support

---

## 🎯 PRIORITY 3: Dashboard Core Recipes
**Impact**: Completes dashboard implementation  
**Canvas**: `002-1. seed.PlayerID Profile Box.canvas`

### 7. profile-card-recipe-v2.md (UPGRADE)
**Purpose**: Complete player profile display  
**Canvas Nodes**: 152f5f791b5529a7, 97721f755ce8f9db  
**Note**: V1 exists, needs V2 upgrade with server components  
**Covers User Stories**: US-021, US-022  
**Required Components**:
- Avatar system
- Profile info display
- Edit functionality
- Linked users display
- State indicators

### 8. dashboard-grid-recipe-v2.md
**Purpose**: Main dashboard layout grid  
**Canvas Nodes**: Extract grid layout from 002-1  
**Covers User Stories**: US-027, US-028  
**Required Components**:
- Responsive grid system
- Card containers
- Section headers
- Mobile-first layout
- Role-based sections

---

## 🎯 PRIORITY 4: Authentication Flow Recipes
**Impact**: Enables complete auth implementation  
**Canvas**: `001-1. num.label.Onboarding&Directory.canvas`

### 9. auth-form-recipe-v2.md
**Purpose**: Login/signup forms  
**Canvas Nodes**: Extract auth nodes from 001-1  
**Covers User Stories**: US-001, US-002  
**Required Components**:
- Email/password inputs
- Form validation
- Error messaging
- Submit handling
- Remember me option

### 10. role-selector-recipe-v2.md
**Purpose**: Role selection interface  
**Canvas Nodes**: Extract role selection from 001-1  
**Covers User Stories**: US-005, US-006  
**Required Components**:
- Role cards (Player/Supervisor/Enabler)
- Visual role indicators
- Selection confirmation
- Role description display

---

## 🎯 PRIORITY 5: Achievement System Recipes
**Impact**: Enables gamification features  
**Canvas**: `002-3. seed.Badges Box.canvas`

### 11. badge-display-recipe-v2.md
**Purpose**: Badge showcase and progress  
**Canvas Nodes**: 387fca1acb041bca from 002-3  
**Covers User Stories**: US-067, US-068, US-069  
**Required Components**:
- Badge grid display
- Earned/available states
- Progress indicators
- Badge details modal
- Rarity indicators

### 12. achievement-notification-recipe-v2.md
**Purpose**: Achievement unlock notifications  
**Canvas Nodes**: Extract notification patterns  
**Covers User Stories**: US-070, US-071  
**Required Components**:
- Toast notifications
- Achievement animation
- Sound effects toggle
- Notification queue

---

## 📝 Recipe Requirements

### All Recipes Must Include:

1. **V2 Template Compliance**
   - Use RECIPE-TEMPLATE-V2.md format
   - Include server component examples
   - NO React hooks or 'use client'
   - Vanilla JS class patterns only

2. **Quality Standards**
   - Minimum 85/100 quality score
   - Pass recipe-validator.js checks
   - Include migration paths from v5
   - Complete edge case handling

3. **Testing Integration**
   - All elements need data-testid attributes
   - Unit test examples
   - E2E test patterns
   - Accessibility compliance

4. **Canvas Alignment**
   - Exact node ID references
   - Position preservation
   - Color scheme matching
   - Visual fidelity verification

---

## 🔄 Validation Process

Each recipe will be validated using:

```bash
# 1. Canvas mapping verification
python3 verify-canvas-mapping.py --recipe [recipe].md --canvas [canvas].canvas

# 2. Architecture compliance check
node recipe-validator.js [recipe].md
# Must return 85+ score with NO React patterns

# 3. Story coverage mapping
python3 scripts/00173-map-recipe-to-stories.py --recipe [recipe].md
```

---

## 📊 Expected Impact

With these 12 recipes:
- **P0 Coverage**: From 11.4% → 68.6%
- **Total Coverage**: From 8.4% → 35.3%
- **Implementable Stories**: From 23 → 97
- **Critical Gaps Closed**: Activity Runtime, Teams, Auth

---

## 🚀 Delivery Format

Please provide recipes in the `v5-recipes-canvas-aligned/` folder with:
- Individual recipe files following V2 template
- Validation reports for each recipe
- Canvas node extraction documentation
- Migration notes from v5 to v6

---

**Thank you for your excellent work on the V2 recipe system! The addiction-bar-recipe-v2.md is exemplary.**

---

**Session 173 Sign-off**  
**Ready for V5 Processing**