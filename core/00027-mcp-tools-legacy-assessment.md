---
created: '2025-08-23'
domain: core
priority: P1
purpose: 'Document session 00027: mcp tools legacy assessment'
session: '00027'
status: current
title: 'Session 00027: MCP Tools Legacy Assessment'
topics:
- documentation
type: guide
---

# Session 00027: MCP Tools Legacy Assessment
**Created**: 2025-08-18 | Hour 3
**Purpose**: Document MCP session management tools as legacy from v5 system

## Critical Discovery

**MCP tools log to v5 directory** (`edl-platform-v5/session-logs/`) while we're working in v6.
This confirms they are **legacy tools that need v6 adaptation**, not integration.

## MCP Tools Inventory

### 1. edl-session-management
**Location**: `.claude/mcp-servers/edl-session-management/`
**Current Behavior**:
- Logs to wrong directory (v5 instead of v6)
- Creates JSON files that bloat over time
- Not integrated with v6 session protocol
- Tracks session metadata but not actual work

**Functions Available**:
- `start_session` - Creates session log (wrong location)
- `end_session` - Closes session with summary
- `log_failure` - Documents failures
- `check_integrity` - Verifies session documentation

**Why Not Integrated**:
- Wrong directory structure (v5 vs v6)
- JSON format doesn't match v6 markdown logs
- No awareness of Reality Agents
- No constitutional compliance checking

### 2. edl-program-session
**Location**: `.claude/mcp-servers/edl-program-session/`
**Current Behavior**:
- Appears to track program-level work
- Also logs to v5 directory
- Duplicates some session management functions

**Why Not Integrated**:
- Redundant with edl-session-management
- v5 directory structure
- No clear value add for v6

## Problems with Current MCP Tools

### 1. Directory Mismatch
```
MCP logs to: /home/b4sho/edl-projects-with-claude/edl-platform-v5/session-logs/
We work in: /home/b4sho/edl-projects-with-claude/edl-platform-v6/archive/sessions/
```

### 2. Format Mismatch
```
MCP creates: SESSION-00.27-LOG.md (dots in number)
We use: SESSION-00027-LOG.md (no dots)
```

### 3. Content Mismatch
- MCP tracks minimal metadata
- v6 logs need comprehensive system state
- MCP doesn't know about Reality Agents
- MCP doesn't enforce constitutional requirements

### 4. JSON Bloat Issue
- MCP tools create accumulating JSON
- Grows unbounded over sessions
- No cleanup or archival process
- Performance degradation over time

## What MCP Tools SHOULD Do (v6 Requirements)

### Ideal Session Management Tool:
```python
class V6SessionManager:
    def start_session(self, number: int, focus: str):
        # 1. Create log in correct location
        # 2. Run Reality Agents automatically
        # 3. Check for handoffs
        # 4. Verify constitutional compliance
        # 5. Load context from previous sessions
        # 6. Generate system state report
        
    def track_deliverable(self, filename: str):
        # 1. Enforce session prefix
        # 2. Add to session log
        # 3. Update INDEX files
        
    def end_session(self):
        # 1. Check all deliverables have prefixes
        # 2. Generate handoff document
        # 3. Update all INDEX files
        # 4. Commit to git
        # 5. Run final Reality check
```

## Adaptation Strategy for Session 28

### Option 1: Abandon MCP, Build Fresh
**Pros**: 
- Clean slate, no legacy issues
- Designed for v6 from ground up
- Can use Reality Agents natively

**Cons**:
- More work to build
- Lose any MCP integrations

### Option 2: Fork and Fix MCP Tools
**Pros**:
- Leverage existing code
- Keep MCP integration points

**Cons**:
- Inherit technical debt
- May be harder than starting fresh
- JSON bloat issue remains

### Option 3: Wrapper Approach (RECOMMENDED)
**Pros**:
- Use MCP for what it does well (tracking)
- Add v6-specific automation on top
- Gradual migration path

**Cons**:
- Some redundancy
- Two systems to maintain initially

## Recommended Implementation Plan

### Phase 1 (Session 28): Build v6 Automation
- Ignore MCP tools for now
- Build native v6 session automation
- Use Reality Agents directly
- Create proper file attribution

### Phase 2 (Session 29): Wrapper Integration
- Create adapter between MCP and v6
- Map MCP data to v6 format
- Redirect MCP logs to v6 directory

### Phase 3 (Session 30+): Gradual Migration
- Replace MCP functions with v6 natives
- Maintain compatibility layer
- Eventually deprecate MCP tools

## Key Insights

### Why MCP Tools Weren't Integrated:
1. **Discovery timing** - Found late in process
2. **Wrong directory** - v5 vs v6 incompatibility  
3. **JSON bloat** - Performance concerns
4. **Limited value** - Don't solve real problems
5. **No Reality Agent awareness** - Can't do reality checks

### What This Means:
- MCP tools are NOT broken
- They're just for the wrong system (v5)
- Adaptation needed, not integration
- Build v6-native automation first

## Constitutional Implications

MCP tools don't enforce Article VII requirements:
- No session prefix enforcement
- No deliverable tracking
- No handoff generation
- No INDEX updates

This makes them constitutionally inadequate for v6.

## Recommendation for Session 28

**DON'T waste time trying to integrate MCP tools as-is.**

Instead:
1. Build v6-native session automation using Reality Agents
2. Create file attribution enforcement
3. Automate constitutional compliance
4. Consider MCP adapter later if needed

The fact that MCP logs to v5 is a **feature, not a bug** - it keeps legacy separate from our clean v6 implementation.

---

*MCP tools are legacy v5 infrastructure that need complete adaptation, not simple integration*