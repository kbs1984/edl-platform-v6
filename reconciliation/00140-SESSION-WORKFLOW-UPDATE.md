---
session: "00140"
type: "workflow-update"
status: "active"
created: "2025-09-02"
title: "Session Workflow Update - MCP Integration"
purpose: "Document the new MCP-integrated session workflow"
topics: ["workflow", "mcp", "session-management", "protocol-update"]
priority: "P0"
domain: "core"
updates: ["CLAUDE.md", "SCRIPTS-INDEX.md", "session-workflow"]
---

# Session Workflow Update - MCP Integration

## 🚨 IMPORTANT CHANGE - Session 140

The session startup workflow has been upgraded to include MCP (Model Context Protocol) session management, providing better tracking, automatic handoffs, and unified task management.

## New Workflow (Effective Session 141+)

### 1. Prerequisites
- Claude Code must have been restarted to activate MCP servers
- Verify server available: `grep "edl-v6-session" ~/.claude.json`

### 2. Start Session

**Primary Method (MCP-Integrated):**
```bash
./scripts/00140-mcp-integrated-session-start.sh 141 "Your Focus"
```

This runs:
- All Reality Agents
- YAML queries
- Context loading
- Session log creation
- **NEW**: MCP session tracking setup

### 3. Initialize MCP Tracking

After startup, in Claude:
```javascript
// Start MCP session tracking
mcp__edl-v6-session__start_session({
  sessionId: "141",
  focus: "EmCoin UI Integration",
  estimatedHours: 2
})
```

### 4. Track Work Throughout Session

```javascript
// Add tasks
mcp__edl-v6-session__add_task({
  title: "Create EmCoin dashboard",
  priority: "high"
})

// Update task status
mcp__edl-v6-session__update_task({
  taskId: "TASK-1",
  status: "completed"
})

// Track deliverables
mcp__edl-v6-session__track_deliverable({
  path: "components/emcoin-dashboard.tsx",
  type: "component",
  linesOfCode: 250
})

// Log failures (Truth Over Speed)
mcp__edl-v6-session__log_failure({
  what: "Initial API integration failed",
  impact: "Minor - fixed with retry logic",
  lesson: "Always add retry mechanisms"
})
```

### 5. End Session

```javascript
// End with automatic handoff generation
mcp__edl-v6-session__end_session({
  summary: "Implemented EmCoin UI dashboard with real-time updates",
  accomplishments: [
    "Created dashboard component",
    "Added real-time WebSocket integration",
    "Implemented achievement animations"
  ],
  nextPriorities: [
    "Add EmCoin transfer functionality",
    "Implement achievement notifications"
  ],
  honestAssessment: "Dashboard complete but needs performance optimization"
})
```

This automatically:
- Updates session log
- Creates SESSION-141-HANDOFF.md
- Records metrics
- Documents failures

## Legacy Workflow (If MCP Unavailable)

If Claude hasn't been restarted or MCP is unavailable:

```bash
# Use traditional startup
./scripts/00028-session-start.sh 141 "Your Focus"

# Optionally add MCP commands for later
./scripts/00028-session-start-mcp-addon.sh 141
```

## Benefits of MCP Integration

1. **Unified Tracking**: Single source of truth for session management
2. **Automatic Documentation**: Handoffs created automatically
3. **Task Management**: Built-in task tracking with status updates
4. **Metrics Collection**: Automatic tracking of deliverables and LOC
5. **Truth Over Speed**: Integrated failure logging
6. **No Manual Updates**: Session log updated automatically

## Migration Guide

### For Existing Sessions
- Session 140 and earlier: Continue using existing logs
- Session 141+: Use MCP-integrated workflow

### Updated Core Documents
- **CLAUDE.md**: Updated to v3.0 with MCP workflow
- **SCRIPTS-INDEX.md**: 00140 script now P0 priority
- **Session scripts**: New MCP-integrated version available

## MCP Server Details

**Server Name**: `edl-v6-session`
**Location**: `/home/b4sho/mcp-servers/edl-v6-session/`
**Config**: Added to `~/.claude.json` globally

**Available Functions**:
- `start_session` - Initialize session
- `add_task` - Add tasks
- `update_task` - Update status
- `log_progress` - Log progress
- `track_deliverable` - Track files
- `log_failure` - Document failures
- `list_tasks` - List all tasks
- `check_session_integrity` - Verify completeness
- `end_session` - End with handoff

## Quick Reference Card

```bash
# Start new session
./scripts/00140-mcp-integrated-session-start.sh 142 "Activity Runtime"

# In Claude, after restart:
mcp__edl-v6-session__start_session({sessionId: "142", focus: "Activity Runtime"})
# ... work ...
mcp__edl-v6-session__end_session({summary: "...", accomplishments: [...]})
```

## Troubleshooting

**"MCP server not found"**
- Restart Claude Code
- Check config: `grep "edl-v6-session" ~/.claude.json`
- If missing: `python3 /home/b4sho/mcp-servers/update-claude-config.py`

**"Old servers still showing"**
- Run update script to remove legacy servers
- Restart Claude Code

**"Can't call MCP functions"**
- Ensure Claude Code has been restarted
- Check server running: New terminal should show MCP servers

---

*Session 140 - Workflow upgraded to MCP v3.0*