---
session: "00144"
type: "reference"
status: "active"
created: "2025-09-03"
title: "Script Classification Status"
purpose: "Track ON/OFF/OBSOLETE status of all scripts"
topics: ["scripts", "classification", "maintenance", "housekeeping"]
priority: "P0"
domain: "scripts"
---

# Script Classification Status

**Last Updated**: Session 144 (2025-09-03)
**Total Scripts**: 175 (to be verified)
- ON: [counting in progress]
- OFF: [counting in progress]  
- OBSOLETE: [counting in progress]

## Classification Rules

### ON (Active and Needed)
- MCP-related tools
- Reality Agents
- Session starters (00028, 00136, 00140)
- YAML queries and organization
- Progress tracking
- Current workflow tools

### OFF (Temporarily Disabled)
- Performance optimization tools (P2 priority)
- Admin tools (P2 priority)
- Benchmarking scripts
- Non-critical utilities

### OBSOLETE (No Longer Relevant)
- Pre-Session 100 fixes
- Functional-first builders
- Old patches and hotfixes
- Superseded tools
- Early exploration scripts (Sessions 1-50)

## Classification Status

### Critical Scripts to Keep ON
```
00140-mcp-integrated-session-start.sh → ON (current session starter)
00136-enhanced-session-start.sh → ON (MCP workflow)
00136-create-informed-test.py → ON (MCP research)
00136-auto-pr.py → ON (MCP automation)
00028-session-start.sh → ON (fallback starter)
00059-yaml-query.py → ON (CRITICAL query tool)
00062-project-insights.py → ON (project intelligence)
00067-auto-organize-files.py → ON (file organization)
00142-progress-tracker.py → ON (progress tracking)
00142-populate-progress-matrix.py → ON (matrix management)
00142-canvas-requirements-mapper.js → ON (requirements mapping)
```

### Migration Status
- [ ] Early session scripts (000[0-4][0-9]) moved to obsolete
- [ ] Performance scripts moved to OFF
- [ ] Admin scripts moved to OFF
- [ ] ON scripts marked with status header
- [ ] Classification complete

## Notes
Session 144 is performing comprehensive housekeeping per Session 143's plan.