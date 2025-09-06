# 🚀 START HERE - EDL Platform v6 Development

## ⚠️ MANDATORY WORKFLOW (Session 141+)

**YOU MUST FOLLOW**: `core/00141-DEFINITIVE-BUILD-WORKFLOW.md`
**Enforcer**: `./scripts/00141-workflow-enforcer.sh`

## Quick Context (30 seconds)

**Mission**: Build the remaining 80% of the EDL Platform v6
**Status**: 25-30% complete (foundation + some features)
**Speed**: 4-6x faster with DEFINITIVE BUILD WORKFLOW

## First Commands to Run

```bash
# 1. START WITH MCP-INTEGRATED SESSION (MANDATORY)
./scripts/00140-mcp-integrated-session-start.sh [SESSION] "[FEATURE]"

# 2. Follow the 8-phase workflow displayed
./scripts/00141-workflow-enforcer.sh

# 3. Check priorities
cat reconciliation/00136-MISSION-AND-PRIORITIES.md
```

## Current Priority Stack

| Order | Task | Command to Start |
|-------|------|-----------------|
| P0.1 | Fix Guardian empty inserts | `python3 scripts/00136-create-informed-test.py guardian` |
| P0.2 | Add Friends real-time sync | `python3 scripts/00136-create-informed-test.py friends` |
| P0.3 | Build Activity Runtime | `cat requirements/P0-ACTIVITY-RUNTIME-STORIES.md` |

## The MCP Enhanced Workflow (Use This!)

```bash
# For EVERY feature:
1. Research:  python3 scripts/00136-create-informed-test.py [feature]
2. Build:     # Your implementation
3. Validate:  python3 reality/agent-reality-auditor/orchestrator.py
4. Auto-PR:   python3 scripts/00136-auto-pr.py "[Feature Name]" [SESSION]
```

## Why This is 4-6x Faster

- **AI Plans** your implementation (Sequential Thinking)
- **Research** finds patterns automatically (Brave Search)
- **Tests** include best practices (not guesswork)
- **PRs** create themselves with evidence (GitHub MCP)
- **Database** operations 3.2x faster (Supabase MCP)

## Key Documents

1. **Mission & Priorities**: `reconciliation/00136-MISSION-AND-PRIORITIES.md`
2. **MCP Workflow Guide**: `reconciliation/00136-MCP-ENHANCED-WORKFLOW-INTEGRATION.md`
3. **Quick Commands**: `.claude/commands/use-mcp-enhanced-workflow.md`
4. **Session Handoffs**: `archive/sessions/SESSION-*-HANDOFF.md`

## Definition of Done

A feature is complete when:
- ✅ Tests pass
- ✅ Orchestrator validates
- ✅ No 95% syndrome
- ✅ PR created with evidence
- ✅ Health maintained/improved

## Services to Run

```bash
# Terminal 1: Auth Gateway
cd reconciliation/active-work/auth-gateway && npm run dev

# Terminal 2: Dashboard
cd reconciliation/active-work/dashboard && npm run dev

# Terminal 3: Your development
# Use the enhanced workflow!
```

---

**Remember**: Always use the MCP Enhanced Workflow. It's not optional - it's how we achieve 4-6x speed.

*Created by Session 136 - The session that made everything faster*