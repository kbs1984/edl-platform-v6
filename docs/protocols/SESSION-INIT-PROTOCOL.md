---
session: "unknown"
type: "protocol"
status: "current"
created: "2025-08-23"
title: "Session Initialization Protocol"
purpose: "Document session initialization protocol"
topics: ['session-log', 'protocol']
priority: "P1"
domain: "core"
---

# Session Initialization Protocol

## For Starting a New Session (e.g., Session 00007)

### 1. Pre-Session Setup
```bash
# Navigate to project root
cd /home/b4sho/edl-projects-with-claude/edl-platform-v6

# Check for handoff document from previous session
ls archive/sessions/SESSION-00007-HANDOFF.md
# If exists, this is your mission brief
```

### 2. First Message to Claude
```
Good [morning/afternoon]. This is Session 00007 and today is [DAY] [Month] [Date], [Year].

Please:
1. Check if session log exists: archive/sessions/SESSION-00007-LOG.md
2. If missing, create it immediately using scripts/create-session-log.sh
3. Review handoff document: archive/sessions/SESSION-00007-HANDOFF.md
4. Run Integration Agent to check current system state
```

### 3. Claude's Required First Actions
Claude will (or should):
1. Check session log existence
2. Create if missing (with constitutional disclosure)
3. Review handoff/guidance documents
4. Check system health via Integration Agent
5. Document system state in session log

### 4. MCP Server Note
**IMPORTANT**: MCP session management servers (edl-program-session, edl-session-management) do NOT create constitutional session logs. They only track internal metadata.

**Options**:
- Keep running: They provide some tracking features
- Stop them: Reduces confusion about what's being logged
- Either way: Always use the file-based session logs in archive/sessions/

### 5. Environment Variables for Agents
When running Reality Agents, you'll need:
```bash
export SUPABASE_URL="https://bbrheacetxlnqbibjwsz.supabase.co"
export SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJicmhlYWNldHhsbnFiaWJqd3N6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ3MjI4MTIsImV4cCI6MjA3MDI5ODgxMn0.fccLx-9NymP8oqHT_-t-ZPZx0hgi8SGfHUJv1WKmwFE"
```

Or provide inline when running commands.

### 6. Quick System Check Commands
```bash
# Check project structure
cat PROJECT-STRUCTURE.md

# Validate session log
./scripts/session-guard.sh 00007

# Check system health
cd reality/agent-reality-auditor/integration-connector
python3 quickstart.py  # or connector.py for full report

# Check Reality Dashboard
cd reality/dashboard
python3 reality_dashboard.py
```

### 7. Session End Protocol
Before ending session:
1. Ensure session log is updated with all work
2. Run session-guard.sh to validate
3. Create handoff document for next session if needed
4. Verify log has >50 lines for substantial work

## Constitutional Requirements
Per Constitution v1.3.0 Article VII:
- All work must be documented in session logs
- Retroactive logging is acceptable if disclosed
- Session logs in archive/sessions/ are the official record
- MCP server logs are NOT constitutional compliance

## The Reality
- **Official Logs**: `/archive/sessions/SESSION-XXXXX-LOG.md`
- **MCP Servers**: Optional metadata tracking only
- **Truth**: File-based logs are the only constitutional record

---

*Last Updated: Session 00006*
*Next Update: After Protocol v2.0 implementation (Session 00007)*