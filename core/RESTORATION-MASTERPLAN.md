---
created: '2025-08-17'
domain: core
estimated_shelf_life: historical-reference
priority: P2
purpose: Restore constitutional order while preserving all valuable work
review_date: '2025-09-17'
session: '00016'
status: superseded
superseded_by:
- RESTORATION-MASTERPLAN-V3.md
title: Three-Domain Restoration Masterplan
topics:
- architecture
- masterplan
- restoration
- three-domains
type: specification
---

# Three-Domain Restoration Masterplan
**Created**: Session 00016  
**Date**: 2025-08-17  
**Purpose**: Restore constitutional order while preserving all valuable work  
**Principle**: Build ON TOP, not rebuild

---

## Executive Summary

We're returning to the constitutional three-domain architecture established in Sessions 01-03, but we're KEEPING all the excellent work from Sessions 04-15. This is an integration and organization effort, not a rebuild.

---

## Current Reality Assessment

### What We Have (Valuable Assets to Keep)

#### Reality Domain (97% Complete)
- ✅ **6 Reality Agents** fully operational
  - FileSystem Agent (Session 03)
  - GitHub Agent (Session 04)  
  - Supabase Agent (Session 02/06)
  - Integration Agent (Session 05)
  - Vercel Agent (Session 08)
  - Static Asset Agent (Session 08)
- ✅ **Task Reality Agent** with dependency tracking (Session 09)
- ✅ **Progressive discovery patterns**
- ✅ **Reality Dashboard** (Session 05)
- ✅ **All tests and validation scripts**

#### Database Infrastructure
- ✅ **4 tables deployed**: profiles, teams, team_members, team_join_requests
- ✅ **14 RLS policies** active and working
- ✅ **Supabase authentication** verified
- ✅ **Migration scripts** from Sessions 12-15

#### UI Implementation  
- ✅ **index.html** with teams functionality
- ✅ **Gmail signup** verified working
- ✅ **Team creation/joining** interface built
- ⚠️ **Needs thorough testing** but foundation exists

#### Documentation Treasury
- ✅ **5-part EDL Foundation** (Session 10)
- ✅ **Canvas analysis** with 7,023 nodes processed
- ✅ **Database design from Canvas** (Session 11)
- ✅ **Strategic Communications** 001A/B/C
- ✅ **All session logs and handoffs**

### What We're Missing (Gaps to Fill)

#### Requirements Domain (0% - Never Built)
- ❌ No REQUIREMENTS_INDEX.md
- ❌ Canvas files not systematically processed
- ❌ No clear success criteria defined
- ❌ User stories not extracted

#### Reconciliation Domain (0% - Never Built)
- ❌ No RECONCILIATION_INDEX.md
- ❌ No gap analysis
- ❌ No action plans
- ❌ No progress tracking

#### Critical Risks
- 🚨 **Massive uncommitted work** from Sessions 05-16
- 🚨 **No systematic testing** of UI claims
- 🚨 **Requirements not traced** to implementation

---

## Restoration Strategy

### Core Principle: Integration, Not Rebuild

We're taking everything built and organizing it into the constitutional structure. No work is discarded. All efforts are preserved and properly catalogued.

### Phase Structure

```
Phase 1: Reality Consolidation (Session 16-17)
├── Commit all work (prevent loss)
├── Update Reality indexes
├── Verify all claims
└── Establish baseline truth

Phase 2: Requirements Extraction (Session 18-19)  
├── Build Requirements Domain structure
├── Process Canvas systematically
├── Extract user stories
└── Define success criteria

Phase 3: Reconciliation Activation (Session 20-21)
├── Build Reconciliation Domain structure
├── Perform gap analysis
├── Create action plans
└── Establish tracking system

Phase 4: Systematic Implementation (Session 22+)
├── Execute reconciliation plans
├── Verify with Reality Agents
├── Track against requirements
└── Maintain constitutional order
```

---

## Detailed Implementation Plan

### Phase 1: Reality Consolidation (IMMEDIATE)

#### Session 16 Tasks (Strategic Coordination)
1. **Create this masterplan** ✅
2. **Commit all uncommitted work**
   ```bash
   git add .
   git commit -m "Session 16: Consolidate Sessions 05-16 work"
   git push
   ```
3. **Update REALITY_INDEX.md** with true current state
4. **Run comprehensive Reality Agent audit**
5. **Test UI claims systematically**

#### Session 17 Tasks (Parallel Coordination)
1. **Review masterplan for agreement**
2. **Create Requirements Domain structure**
3. **Begin Requirements extraction**
4. **Coordinate with Session 16 findings**

### Phase 2: Requirements Extraction (EXPANDED)

#### Critical Insight: User Stories Alone Are Insufficient
Requirements must be COMPLETE before Reconciliation can effectively bridge gaps. This means beyond user stories, we need success criteria, acceptance tests, priorities, and v5 lessons.

#### Tasks for Sessions 18-19
1. **Create Requirements Domain structure**:
   ```
   requirements/
   ├── REQUIREMENTS_INDEX.md
   ├── constitution/          [EXISTING - keep]
   ├── specifications/        [EXISTING - keep]
   ├── canvas-requirements/   [MOVE canvas-analysis here]
   ├── user-stories/         [NEW - extract from Canvas]
   ├── success-criteria/     [NEW - define "done"]
   ├── acceptance-tests/     [NEW - how to verify]
   ├── priority-matrix/      [NEW - P0/P1/P2 rankings]
   ├── constraints/          [NEW - technical/business]
   ├── v5-extraction/        [NEW - lessons & patterns]
   └── validation-tests/     [NEW - Reality Agent checks]
   ```

2. **Process Starter Seed (Canvas + Schema + SEED LOG)**:
   - Move canvas-analysis from docs/ to requirements/
   - Extract user stories from 7,023 nodes
   - Map UI elements to database needs
   - Define user journeys

3. **Extract Complete Requirements**:
   
   **User Stories** (WHO wants WHAT):
   - Format: "As a [role], I want [feature], so that [benefit]"
   - Extract from Canvas JSONs
   - Group by user role (Player/Supervisor/Enabler)
   
   **Success Criteria** (Definition of DONE):
   - Measurable outcomes for each story
   - Example: "Team creation" requires:
     - Team record in database
     - Creator assigned as founder
     - Team visible in UI
     - Join capability enabled
   
   **Acceptance Tests** (HOW to verify):
   - Manual test procedures
   - Automated test specifications
   - Performance benchmarks
   - Reality Agent verification methods
   
   **Priority Matrix** (WHEN to build):
   - P0: Core functionality (auth, teams, profiles)
   - P1: Essential features (activities, badges)
   - P2: Enhancements (real-time, analytics)
   - Based on critical user journey

4. **Process v5 Extraction (The Full Seed)**:
   - Extract working patterns from 16,000 lines frontend
   - Document state management approaches
   - Capture payment/emCoin logic
   - List architectural lessons (what NOT to do)
   - Identify reusable components
   - Document the `profiles` vs `profile` schema lesson

5. **Document Constraints & Dependencies**:
   - Technical constraints (Supabase RLS patterns)
   - Business constraints (child safety requirements)
   - Feature dependencies (what must exist first)
   - Integration requirements

#### The Two-Seed Strategy

**Starter Seed** (What we have now):
- Canvas JSONs (UI requirements)
- Database schema proposal
- SEED LOG (vision and philosophy)
- Basic structure and flow

**Full Seed** (v5 extraction needed):
- Working frontend patterns
- State management solutions
- Payment/emCoin implementation
- Lessons learned (what failed)
- Reusable components

Both seeds are necessary for complete Requirements that enable effective Reconciliation.

### Phase 3: Reconciliation Activation

#### Prerequisites from Phase 2
Before Reconciliation can begin, Requirements must deliver:
- ✅ Complete user stories with success criteria
- ✅ Acceptance tests for verification
- ✅ Priority matrix for sequencing
- ✅ v5 lessons integrated
- ✅ Constraints documented

#### Tasks for Sessions 20-21
1. **Create Reconciliation Domain structure**:
   ```
   reconciliation/
   ├── RECONCILIATION_INDEX.md
   ├── gap-analysis/
   │   ├── requirements-vs-reality.md
   │   ├── missing-features.md
   │   └── technical-debt.md
   ├── action-plans/
   │   ├── immediate-fixes.md
   │   ├── phase-1-plan.md
   │   └── long-term-roadmap.md
   ├── progress-tracking/
   │   ├── session-progress/
   │   └── metrics.md
   └── decisions/
       └── technical-choices.md
   ```

2. **Perform comprehensive gap analysis**:
   - What requirements are met?
   - What requirements are partially met?
   - What requirements are unmet?
   - What was built but not required?

3. **Create prioritized action plans**:
   - P0: Critical fixes (broken features)
   - P1: Core functionality gaps
   - P2: Enhancement opportunities
   - P3: Nice-to-have features

4. **Establish tracking system**:
   - Daily progress updates
   - Weekly reconciliation reviews
   - Metrics dashboard
   - Reality Agent verification

### Phase 4: Systematic Implementation

#### Tasks for Sessions 22+
1. **Execute according to Reconciliation plans**
2. **Each session assigned specific tasks**
3. **Reality Agents verify completion**
4. **Requirements checked off systematically**
5. **No new work without Requirements → Reconciliation approval**

---

## Success Metrics

### Phase 1 Success (Reality)
- ✅ All work committed to git
- ✅ REALITY_INDEX.md reflects truth
- ✅ All Reality Agents reporting
- ✅ UI claims verified or corrected

### Phase 2 Success (Requirements)
- ✅ REQUIREMENTS_INDEX.md created
- ✅ All Canvas processed
- ✅ User stories documented
- ✅ Success criteria defined

### Phase 3 Success (Reconciliation)
- ✅ RECONCILIATION_INDEX.md created
- ✅ Complete gap analysis
- ✅ Action plans created
- ✅ Tracking system operational

### Phase 4 Success (Implementation)
- ✅ Following constitutional process
- ✅ Requirements traced to implementation
- ✅ Reality Agents verify everything
- ✅ Progress visible and tracked

---

## Risk Mitigation

### Identified Risks
1. **Work Loss**: Uncommitted changes could be lost
   - **Mitigation**: IMMEDIATE git commit (Phase 1, Task 1)

2. **Scope Creep**: Adding features not in requirements
   - **Mitigation**: Constitutional enforcement via Reconciliation

3. **Reality Drift**: Implementation not matching requirements
   - **Mitigation**: Reality Agents continuous verification

4. **Session Confusion**: Multiple sessions working at cross purposes
   - **Mitigation**: This masterplan as single source of truth

---

## Session Coordination Protocol

### For Sessions 16-17 (Strategic Coordinators)
- Own this masterplan
- Coordinate implementation sessions
- Verify constitutional compliance
- Track overall progress

### For Sessions 18-19 (Requirements Builders)
- Extract and organize requirements
- Process Canvas files
- Define success criteria
- No implementation work

### For Sessions 20-21 (Reconciliation Builders)
- Analyze gaps
- Create action plans
- Build tracking systems
- No implementation work

### For Sessions 22+ (Implementation Team)
- Execute ONLY from Reconciliation plans
- Verify with Reality Agents
- Update progress tracking
- No unauthorized features

---

## Constitutional Compliance

This masterplan enforces the constitutional order established in Sessions 01-03:

1. **Reality Domain** has veto power (Reality Agents verify all claims)
2. **Requirements Domain** defines what to build (Canvas + user stories)
3. **Reconciliation Domain** bridges gaps (systematic planning)
4. **Real-time logging** enforced (no retroactive deception)
5. **Session tracking** mandatory (progress visible)

---

## Immediate Next Steps

### Session 16 (NOW)
1. ✅ Create this masterplan
2. ⏳ Get Session 17 agreement
3. ⏳ Commit all work
4. ⏳ Begin Reality consolidation

### Session 17 (PARALLEL)
1. ⏳ Review and agree on masterplan
2. ⏳ Begin Requirements structure
3. ⏳ Coordinate findings

### Handoff Protocol
- Session 16 provides Reality baseline
- Session 17 provides Requirements structure
- Sessions 18+ receive specific assignments
- All work traces to this masterplan

---

## References

- **Constitution**: `/DIRECTORY-MAP-CONSTITUTION.md` (v1.3.0)
- **Original Structure**: `/PROJECT-STRUCTURE.md` (Session 06)
- **System Index**: `/SYSTEM-INDEX.md` (Session 01)
- **Session Protocol**: `/SESSION-PROTOCOL.md`
- **Strategic Communications**: `/docs/STRATEGIC-COMMUNICATION-*.md`

---

## Declaration

This masterplan restores constitutional order while preserving all valuable work. We build on top of what exists, we don't tear down. We organize chaos into structure. We trace every action to requirements. We verify everything with Reality.

**The path forward is clear: Integration, not destruction. Organization, not rebuild.**

---

*Session 16 Strategic Coordination*  
*Constitutional Restoration Initiated*