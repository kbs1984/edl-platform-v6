---
session: "172"
type: "platform-specification"
status: "authoritative"
created: "2025-09-05"
title: "EDL Platform v6 - Unified Platform Specification and Recipe Catalog"
purpose: "Provide overarching guidance on WHAT to build using Canvas wireframes, V5 patterns, and Brian's architecture as recipes"
topics: ["platform-specification", "recipes", "implementation-guide", "architecture", "requirements"]
priority: "P0"
domain: "requirements"
canonical: true
replaces: ["ad-hoc-implementation-assumptions"]
implements: ["architectural-workflow-revision", "evidence-imperative-protocol"]
references: ["Canvas-wireframes", "V5-integration-specs", "Brian-backend-proposal", "Session-152-architecture"]
---

# EDL Platform v6 - Unified Platform Specification
## Recipe-Based Implementation Guide

**Version**: 1.0  
**Status**: Authoritative Reference  
**Purpose**: Define WHAT to build using proven recipes and patterns

---

## Executive Summary

This document provides the **definitive platform specification** for EDL Platform v6, consolidating three proven recipe sources:
1. **Canvas Wireframes** (11 Obsidian JSON files) - UI/UX specifications
2. **V5 Integration Patterns** (16,000+ lines) - Proven engagement mechanics  
3. **Brian's Backend Architecture** (43+ tables) - Educational platform structure

**Key Principle**: Every implementation must reference a recipe. No guesswork. No assumptions.

---

## 🏗️ Architectural Foundation (Session 152 Authority)

### Technology Stack Matrix

| Layer | Technology | Pattern | Authority |
|-------|-----------|---------|-----------|
| **Auth Gateway** | Next.js 14 Server Components | Server Actions + SSR | Session 152 |
| **Dashboard Core** | Next.js Server Components | V5 Vanilla JS Bridge | Session 152 |
| **Database** | Supabase PostgreSQL | RLS + Triggers | Truth Seed |
| **Real-time** | Supabase Realtime | WebSocket subscriptions | Sessions 109-119 |
| **State Management** | Server Actions | No client state for auth | Session 152 |
| **UI Enhancement** | Vanilla JavaScript | Class-based controllers | V5 Patterns |

### Integration Requirements
- **Server Components by default** (no 'use client' unless justified)
- **V5 vanilla JS bridge** for dashboard interactivity
- **Server Actions** for form submissions
- **data-testid attributes** for all interactive elements

---

## 📚 Recipe Catalog

### Recipe Source 1: Canvas Wireframes (UI Specifications)

#### Available Canvas Files (Recipe IDs)
```
CANVAS-001-1: Onboarding & Directory
CANVAS-001-2: Communication, Messages and Invitations  
CANVAS-001-3: Contact Us Box
CANVAS-001-4: Activity & Registrar Box
CANVAS-001-5: Activity Instance
CANVAS-002-1: PlayerID Profile Box
CANVAS-002-2: Associated Teams Box
CANVAS-002-3: Badges Box
CANVAS-002-4: HoG (Hall of Greatness) Box
CANVAS-002-5: Resources Box
CANVAS-003-2: EmCoin Transactions Box
```

#### How to Use Canvas Recipes
1. **Reference**: Always cite Canvas ID when implementing UI
2. **Extract**: JSON contains layout, components, relationships
3. **Interpret**: Boxes = Components, Lines = Data flow
4. **Implement**: Follow spatial layout exactly

### Recipe Source 2: V5 Integration Patterns (Proven Mechanics)

#### V5 Recipe Categories

##### V5-RECIPE-001: Addiction Mechanics Bar
**Source**: `/pages/player-dashboard.html` lines 303-334
```html
Components: [Visitors Counter, Streak Display, EmCoin Balance, Division Rank]
Pattern: Fixed top bar with real-time updates
Implementation: Server Component + vanilla JS updater
```

##### V5-RECIPE-002: Streak System
**Source**: `/lib/state-machines.js` lines 830-838
```javascript
Milestones: [3, 7, 14, 30, 60, 100, 365 days]
Rewards: Progressive EmCoin bonuses
Badges: Automatic achievement unlocks
```

##### V5-RECIPE-003: EmCoin Economy
**Source**: `/lib/supabase-edl.js` lines 386-484
```sql
Tables: [emcoin_transactions, emcoin_wallets]
Types: [daily_login, achievement, activity_fee, streak_bonus]
Validation: Wallet balance checks, transaction logs
```

##### V5-RECIPE-004: Achievement System
**Source**: `/lib/supabase-edl.js` lines 553-643
```sql
Tables: [achievements, user_achievements]
Categories: [onboarding, streaks, social, academic]
Triggers: Automatic badge award on milestone
```

##### V5-RECIPE-005: State Machines
**Source**: `/lib/state-machines.js` lines 104-134
```javascript
User States: [Grey → Pending → Active]
Activity States: [Draft → Active → Completed → Archived]
Streak States: [Fresh → Building → Milestone → Recovery]
```

### Recipe Source 3: Brian's Backend Architecture (Educational Platform)

#### Brian Recipe Categories

##### BRIAN-RECIPE-001: User System
**Tables**: Users, AC_Players, SE_Supervisors, ED_Enablers
```
UserID → PlayerID/SuperID/EnablerID (one required)
CallSign: Unique identifier across platform
UserTypes: Player (student), Supervisor (guardian), Enabler (educator)
```

##### BRIAN-RECIPE-002: Team System  
**Tables**: Teams, TeamMembers, TeamCommunications
```
Hierarchy: Division → Team → Members
Roles: TeamFounder, TeamMember
Size: 1 Founder + 5 Members maximum
```

##### BRIAN-RECIPE-003: Activity System
**Tables**: Activities, ActivityRegistration, ActivityCompletion
```
Types: Event (competitive), Exercise (practice)
Lifecycle: Registration → Participation → Completion → Scoring
Capacity: Limited slots per activity
```

##### BRIAN-RECIPE-004: Division System
**Tables**: Divisions, DivisionRankings
```
Assignment: Automatic on Summer Solstice
Grouping: By age/grade level
Rankings: Within division competition
```

##### BRIAN-RECIPE-005: Communication System
**Tables**: Communications, Messages, Invitations
```
Communications: System → Users (broadcast)
Messages: User → User (direct)
Invitations: Team → Team (activity coordination)
```

---

## 🎯 Implementation Requirements

### For Every Feature Implementation

#### 1. Recipe Selection (MANDATORY)
```yaml
# In component header or session log
recipes:
  ui: "CANVAS-001-4"  # Activity & Registrar Box
  mechanics: "V5-RECIPE-002"  # Streak System
  backend: "BRIAN-RECIPE-003"  # Activity System
```

#### 2. Architecture Validation
```typescript
// MUST answer before coding:
architecture: {
  componentType: "Server Component",  // or "Client Component" with justification
  stateManagement: "Server Actions",   // or "Vanilla JS" for dashboard
  integrationPattern: "V5 Bridge",     // or "Direct React" if justified
  dataFetching: "SSR",                // or "API Route" with reason
}
```

#### 3. Evidence Gathering
```bash
# Before implementing ANY feature:
python3 scripts/00059-yaml-query.py --topic "[feature]"  # Check existing work
grep -r "[feature]" reconciliation/  # Find implementations
mcp__supabase-dev__list_tables()  # Verify database state
```

---

## 📋 Feature Implementation Mapping

### User Authentication & Onboarding
- **Canvas**: CANVAS-001-1 (Onboarding & Directory)
- **V5**: User state machine (Grey → Pending → Active)
- **Brian**: Users table with UserID/PlayerID structure
- **Implementation**: Server Components + Server Actions

### Dashboard & Profile
- **Canvas**: CANVAS-002-1 (PlayerID Profile Box)
- **V5**: V5-RECIPE-001 (Addiction Mechanics Bar)
- **Brian**: BRIAN-RECIPE-001 (User System)
- **Implementation**: Server Components + V5 vanilla JS bridge

### EmCoin & Rewards
- **Canvas**: CANVAS-003-2 (EmCoin Transactions Box)
- **V5**: V5-RECIPE-003 (EmCoin Economy)
- **Brian**: Reward distribution via achievements
- **Implementation**: Database triggers + Server Components

### Achievement System
- **Canvas**: CANVAS-002-3 (Badges Box)
- **V5**: V5-RECIPE-004 (Achievement System)
- **Brian**: Badge awards for milestones
- **Implementation**: Server Components + vanilla JS animations

### Activity Runtime
- **Canvas**: CANVAS-001-4 & CANVAS-001-5 (Activity boxes)
- **V5**: Activity state machine patterns
- **Brian**: BRIAN-RECIPE-003 (Activity System)
- **Implementation**: Server Components + real-time subscriptions

### Social Features
- **Canvas**: CANVAS-001-2 (Communication)
- **V5**: Friend system patterns
- **Brian**: BRIAN-RECIPE-005 (Communication System)
- **Implementation**: Server Components + WebSocket updates

### Team Management
- **Canvas**: CANVAS-002-2 (Associated Teams Box)
- **V5**: Team collaboration patterns
- **Brian**: BRIAN-RECIPE-002 (Team System)
- **Implementation**: Server Components + Server Actions

---

## 🚫 Anti-Patterns to Avoid

### DO NOT
- ❌ Build features without citing recipe sources
- ❌ Assume technology stack without checking Session 152
- ❌ Create React Client Components for dashboard features
- ❌ Implement without checking existing work via YAML query
- ❌ Deviate from Canvas spatial layouts
- ❌ Ignore V5's proven engagement mechanics
- ❌ Simplify Brian's role-based permissions

### ALWAYS
- ✅ Cite recipe IDs in implementation comments
- ✅ Follow Session 152's architectural authority
- ✅ Use Server Components by default
- ✅ Implement V5 vanilla JS bridge for dashboard
- ✅ Query existing work before building
- ✅ Match Canvas wireframe layouts exactly
- ✅ Preserve V5's gamification elements
- ✅ Maintain Brian's user type distinctions

---

## 📊 Recipe Coverage Matrix

| Feature Area | Canvas Recipe | V5 Recipe | Brian Recipe | Implementation Status |
|-------------|--------------|-----------|--------------|---------------------|
| Authentication | CANVAS-001-1 | State Machine | Users/Players | ✅ 90% Complete |
| Profile Management | CANVAS-002-1 | Profile Extensions | AC_Players | ✅ 85% Complete |
| EmCoin System | CANVAS-003-2 | V5-RECIPE-003 | Rewards | ✅ 95% Complete |
| Achievements | CANVAS-002-3 | V5-RECIPE-004 | Badges | 🔄 Session 168 |
| Activities | CANVAS-001-4/5 | Activity States | Activities | 🔄 Session 169 |
| Social/Friends | CANVAS-001-2 | Friend System | Messages | 🔄 Session 170 |
| Teams | CANVAS-002-2 | Team Patterns | Teams | ⏳ Pending |
| Resources | CANVAS-002-5 | - | Resources | ⏳ Pending |
| Hall of Greatness | CANVAS-002-4 | Rankings | Rankings | ⏳ Pending |

---

## 🔄 Version Control

### Document Updates
- Version 1.0: Initial specification consolidating all recipe sources
- Future versions will add new recipes as discovered
- Each recipe addition requires evidence and verification

### Recipe Additions
To add a new recipe:
1. Provide source file and line numbers
2. Document pattern clearly
3. Show working example
4. Get verification from Reality Agents

---

## 📝 Quick Reference Card

```bash
# For every implementation:

# 1. Find your recipes
CANVAS_ID="CANVAS-001-4"  # Find in archive/legacy-canvas-work/
V5_PATTERN="V5-RECIPE-002"  # Check reconciliation/00138-V5-INTEGRATION-SPECIFICATIONS.md
BRIAN_TABLE="BRIAN-RECIPE-003"  # See requirements/brian-backend-proposal/

# 2. Validate architecture
ARCHITECTURE="Server Components"  # Per Session 152
PATTERN="V5 vanilla JS bridge"  # For dashboard features

# 3. Check existing work
python3 scripts/00059-yaml-query.py --topic "your-feature"

# 4. Implement with citations
// Recipe: CANVAS-001-4 (Activity & Registrar Box)
// Pattern: V5-RECIPE-002 (Streak System)  
// Backend: BRIAN-RECIPE-003 (Activity System)
export default async function ActivityRegistrar() {
  // Server Component implementation
}
```

---

## 🎯 Success Criteria

Implementation is complete when:
- [ ] All recipe sources are cited in code
- [ ] Architecture follows Session 152 authority
- [ ] Canvas layouts are matched exactly
- [ ] V5 mechanics are preserved
- [ ] Brian's data model is implemented
- [ ] Tests verify recipe compliance
- [ ] Reality Agents confirm integration

---

## Conclusion

This platform specification eliminates the guesswork that caused the Session 167-170 crisis. By treating Canvas wireframes, V5 patterns, and Brian's architecture as **recipes**, we ensure consistent, evidence-based implementation.

**Remember**: If you can't cite a recipe, you shouldn't be building it.

---

*Platform Specification v1.0 - The authoritative guide for WHAT to build*
*Created: Session 172 based on evidence from Sessions 138, 152, 166, and architectural revision 171*