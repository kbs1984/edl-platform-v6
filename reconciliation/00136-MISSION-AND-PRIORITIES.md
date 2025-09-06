---
session: "00136"
type: "mission-document"
status: "authoritative"
created: "2025-09-02"
title: "EDL Platform v6 Mission and Priorities - What We're Building"
purpose: "Central reference for all future sessions to understand the mission and priorities"
topics: ["mission", "priorities", "context", "roadmap", "platform-status"]
priority: "P0"
domain: "reconciliation"
canonical: true
replaces: ["scattered context across sessions"]
---

# EDL Platform v6 Mission and Priorities

## 🎯 The Mission

**Build the remaining 80% of the EDL Platform v6** - an educational debate and learning platform for students, with guardian oversight and judge participation.

### Platform Status
- **20% Complete**: Foundation from truth-seed (Session 42 adoption)
- **80% Remaining**: 275 user stories to implement
- **Infrastructure**: ✅ Complete (Priority 1-3 from Sessions 128-134)
- **Ready to Build**: Session 137+ can deliver features at 4-6x speed

---

## 🔥 Current Priority Stack

### IMMEDIATE (Sessions 137-140)
| Priority | Feature | Why | Status | Session |
|----------|---------|-----|--------|---------|
| **P0.1** | Guardian System | Unblocks onboarding | 🔴 Empty `.insert({})` | 137 |
| **P0.2** | Friends Real-Time | Fixes 95% syndrome | 🟡 Partial implementation | 138 |
| **P0.3** | Activity Runtime ENGINE | Core platform feature | 🔴 No infrastructure | 139-145 |

### SHORT-TERM (Sessions 141-150)
| Priority | Feature | Stories | Impact |
|----------|---------|---------|--------|
| **P1.1** | EmCoin Economy | 7 stories | Engagement system |
| **P1.2** | Badges System | 16 stories | Achievement tracking |
| **P1.3** | Debate UI | UI needed | Core functionality |
| **P1.4** | Guilds System | DB ready, no UI | Team features |

### LONG-TERM (Sessions 151+)
| Priority | Feature | Stories | Status |
|----------|---------|---------|--------|
| **P2.1** | HOGs System | 15 stories | Not started |
| **P2.2** | Activity Registrar | 30 stories | Not started |
| **P2.3** | Communication | 13 stories | Partial (chat exists) |
| **P2.4** | Resources | 30 stories | Not started |

---

## 📊 Domain Organization

### Reality Domain (Infrastructure) ✅
**Status**: 97% Complete
**Purpose**: Validation and monitoring
**Components**:
- 7 Reality Agents (operational)
- Orchestrator with 95% syndrome detection
- MCP Enhanced Connectors

### Requirements Domain (What to Build) 📋
**Status**: Fully documented
**Key Files**:
- `requirements/P0-ACTIVITY-RUNTIME-STORIES.md` - 50 priority stories
- `requirements/V5-LESSONS-AND-PATTERNS.md` - Patterns to integrate
- `requirements/REQUIREMENTS_INDEX.md` - All 275 stories

### Reconciliation Domain (Active Development) 🔨
**Status**: Where we build
**Structure**:
```
reconciliation/active-work/
├── auth-gateway/     # Port 3000 ✅ Working
├── dashboard/        # Port 3001 ✅ Working (needs features)
└── admin-dashboard/  # Admin panel (basic)
```

### Truth-Seed Domain (Reference) 📚
**Status**: READ-ONLY reference
**Purpose**: Original implementation to learn from
**Rule**: NEVER edit, only read for patterns

---

## 🚀 How Future Sessions Should Approach Work

### 1. Context Loading (5 minutes)
```bash
# Start with enhanced session (AI planning)
./scripts/00136-enhanced-session-start.sh [SESSION_NUMBER]

# Check this document for priorities
cat reconciliation/00136-MISSION-AND-PRIORITIES.md

# Review previous session handoff
cat archive/sessions/SESSION-[PREVIOUS]-HANDOFF.md
```

### 2. Priority Selection
Look at the **Current Priority Stack** above:
- Always work on lowest P0.X number first
- Complete current priority before moving to next
- Use "Definition of Done" below

### 3. Implementation Approach
```bash
# Use MCP Enhanced Workflow for EVERY feature:
1. Research patterns: python3 scripts/00136-create-informed-test.py [feature]
2. Write test first (TDD)
3. Implement feature
4. Run orchestrator validation
5. Auto-create PR: python3 scripts/00136-auto-pr.py "[Feature]" [SESSION]
```

---

## ✅ Definition of Done

A feature is ONLY complete when:

1. **Database**: Tables created/updated via MCP
2. **Backend**: API endpoints working
3. **Frontend**: UI components rendering
4. **Tests**: Baseline tests passing
5. **Validation**: Orchestrator health maintained/improved
6. **95% Check**: No syndrome detected
7. **PR**: Created with evidence via automation

---

## 📈 Progress Tracking

### Completed Features ✅
- Authentication system (truth-seed)
- Basic profiles and teams
- Chat infrastructure (Session 119)
- Friends system UI (95% - missing real-time)
- Test infrastructure (Priority 3)
- Reality Agent Orchestration (Priority 2)
- MCP Infrastructure (Priority 1)

### In Progress 🔄
- Guardian system (empty inserts need fixing)
- Friends real-time (WebSocket implementation needed)

### Not Started 🔴
- Activity Runtime ENGINE (50 stories)
- EmCoin economy
- Badges system
- Debate UI
- HOGs system
- Activity Registrar
- Resources system

---

## 🎯 Success Metrics

### Per Session Targets
- **Features Completed**: 5-10 (was 2-3)
- **Health Improvement**: +5-10%
- **Zero 95% Syndrome**: No partial features
- **Time to PR**: <1 hour per feature

### Platform Completion
- **Current**: ~20% complete
- **Target**: 100% by Session 200
- **Velocity Needed**: ~2% per session
- **Stories per Session**: ~3-5 stories

---

## 🔧 Technical Context

### Running Services
```bash
# Auth Gateway (Port 3000)
cd reconciliation/active-work/auth-gateway && npm run dev

# Dashboard (Port 3001)  
cd reconciliation/active-work/dashboard && npm run dev

# Admin Dashboard (Port 3002)
cd reconciliation/active-work/admin-dashboard && npm run dev
```

### Database
- **Supabase Project**: bbrheacetxlnqbibjwsz
- **Tables**: 21 exist, ~15 needed for full platform
- **MCP Access**: Use `mcp__supabase-dev__` functions

### Key Technologies
- **Frontend**: Next.js 14 App Router, TypeScript, Tailwind
- **Backend**: Supabase (Auth, DB, Realtime)
- **Testing**: Puppeteer (standard, not MCP)
- **Monitoring**: Reality Agents + Orchestrator

---

## 🚨 Critical Patterns to Maintain

### 1. Evidence-Based Development
- NO guesswork
- Query YAML for existing work
- Check Reality Agents
- Validate with orchestrator

### 2. Test-First Development
- Write baseline test BEFORE implementation
- Research patterns with Brave Search
- Include 95% syndrome checks

### 3. Incremental Delivery
- Complete one feature fully before starting next
- No "95% complete" features
- PR after each feature

### 4. MCP Acceleration
- Use Supabase MCP for ALL database operations
- Use GitHub MCP for PR creation
- Use Sequential Thinking for planning
- Use Brave Search for patterns

---

## 📚 Essential Reading for New Sessions

1. **This Document** - Mission and priorities
2. **Session 123 V6 Vision** - `reconciliation/00123-V6-VISION-BIG-PICTURE.md`
3. **MCP Workflow** - `reconciliation/00136-MCP-ENHANCED-WORKFLOW-INTEGRATION.md`
4. **Quick Commands** - `.claude/commands/use-mcp-enhanced-workflow.md`
5. **Previous Handoff** - `archive/sessions/SESSION-[PREVIOUS]-HANDOFF.md`

---

## 🎮 Quick Start Checklist

- [ ] Read this document for mission/priorities
- [ ] Run enhanced session start for AI planning
- [ ] Pick lowest P0.X priority from stack
- [ ] Create research-driven test
- [ ] Implement feature using MCP
- [ ] Validate with orchestrator
- [ ] Auto-create PR with evidence
- [ ] Update session log
- [ ] Create handoff for next session

---

## Platform Vision

By Session 200, the EDL Platform v6 will be a complete educational platform where:
- Students engage in structured debates and activities
- Guardians monitor and support their children
- Judges evaluate and provide feedback
- Teams collaborate on challenges
- EmCoin economy drives engagement
- Badges recognize achievements
- The platform runs at scale with MCP optimization

**We're 20% there. Let's build the remaining 80% at 4-6x speed.**

---

*Mission Document v1.0 - Session 136*
*The authoritative source for what we're building and why*