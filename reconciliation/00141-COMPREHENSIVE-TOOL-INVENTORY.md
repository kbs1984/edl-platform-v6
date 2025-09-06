---
session: "00141"
type: "tool-inventory"
status: "active"
created: "2025-09-02"
title: "Comprehensive Tool Inventory - Never Overlook Existing Resources"
purpose: "Central reference to prevent forgetting about existing tools during development"
topics: ["tools", "scripts", "automation", "inventory", "reference"]
priority: "P0"
domain: "reconciliation"
canonical: true
---

# Comprehensive Tool Inventory - Never Overlook Existing Resources

## 🚨 PRIMARY CONCERN ADDRESSED
**"Overlooking tools that exist because I forgot to explicitly reference them"**

This document ensures every available tool is catalogued and easily discoverable.

---

## 🚀 SESSION START & CONTEXT TOOLS

### Core Session Management
| Script | Purpose | When to Use |
|--------|---------|-------------|
| `00028-session-start.sh` | Traditional session start with Reality Agents | Every session start |
| **`00140-mcp-integrated-session-start.sh`** | MCP-enhanced session with tracking | **PREFERRED - Use this!** |
| `00136-load-context.sh` | Quick context loader (30 seconds) | When you need quick priorities |
| `00138-dynamic-context-loader.sh` | Dynamic priority updates | Check current work status |

### Enhanced Workflow (4-6x Speed)
| Script | Purpose | Command Example |
|--------|---------|-----------------|
| **`00136-enhanced-session-start.sh`** | AI planning with Sequential Thinking | `./scripts/00136-enhanced-session-start.sh 141` |
| **`00136-create-informed-test.py`** | Research patterns, create tests | `python3 scripts/00136-create-informed-test.py guardian` |
| **`00136-auto-pr.py`** | Auto-create PR with evidence | `python3 scripts/00136-auto-pr.py "Feature Name" 141` |

---

## 🧪 TESTING & VALIDATION TOOLS

### Performance & Benchmarks
| Script | Purpose | When to Use |
|--------|---------|-------------|
| `00126-benchmark-runner.sh` | Run performance benchmarks | Validate MCP improvements |
| `00126-mcp-performance-benchmark.py` | Test MCP server performance | Check speed gains |
| `00127-complete-mcp-integration-test.py` | Full MCP integration test | Verify all servers working |
| `00127-mcp-performance-validation.py` | Validate performance claims | Confirm 4-6x improvements |

### Auth & Dashboard Testing
| Script | Purpose | Status |
|--------|---------|--------|
| `00129-test-auth-flow.js` | Test authentication flow | ✅ Working |
| `00129-test-auth-flow-local.js` | Local auth testing | ✅ Working |
| `00131-test-dashboard.js` | Dashboard functionality tests | ⚠️ Puppeteer issues |
| `00131-test-dashboard-real.js` | Real dashboard tests | ⚠️ Puppeteer issues |

### Feature Discovery
| Script | Purpose | Output |
|--------|---------|--------|
| `00133-discover-features.js` | Discover all platform features | JSON feature map |
| `00133-simple-feature-discovery.js` | Quick feature scan | Simple feature list |

---

## 🔧 YAML & QUERY TOOLS

### Core Query System
| Script | Purpose | Example |
|--------|---------|---------|
| **`00059-yaml-query.py`** | Query YAML metadata | `python3 scripts/00059-yaml-query.py --session "00141"` |
| `00114-validate-environment.sh` | Validate environment setup | Check before deployment |

---

## 🚢 DEPLOYMENT & ENVIRONMENT

### Deployment Scripts
| Script | Purpose | Environment |
|--------|---------|-------------|
| `00114-deploy-both.sh` | Deploy auth + dashboard | Production |
| `00114-safe-deploy-protocol.sh` | Safe deployment process | Production |
| `00114-check-environment.sh` | Check environment variables | All |
| `00114-diagnose-auth-failure.sh` | Debug auth issues | Troubleshooting |

---

## 📊 REALITY AGENTS & ORCHESTRATION

### Core Orchestration
| Tool | Location | Purpose |
|------|----------|---------|
| **Orchestrator** | `reality/agent-reality-auditor/orchestrator.py` | Full system validation |
| Agent Gateway | `reality/agent-reality-auditor/agent_gateway.py` | Agent communication |
| MCP Connector | `reality/agent-reality-auditor/supabase-connector/mcp_enhanced_connector.py` | MCP integration |

### Individual Agents
1. **FileSystem Agent** - File structure validation
2. **GitHub Agent** - Repository status
3. **Supabase Agent** - Database health
4. **Integration Agent** - Cross-system validation
5. **Task Connector** - Task tracking
6. **Test Infrastructure** - Test validation
7. **Migration Tracker** - Database migrations

---

## 🎯 MCP SERVERS (Model Context Protocol)

### Installed & Configured
| Server | Purpose | Functions Available |
|--------|---------|-------------------|
| **edl-v6-session** | Session management | start_session, add_task, track_deliverable, end_session |
| **supabase-dev** | Database operations | execute_sql, apply_migration, list_tables |
| **github-server** | GitHub operations | create_pr, push_files, search_code |
| **brave-search** | Web search | brave_web_search, brave_local_search |
| **sequential-thinking** | AI planning | sequentialthinking |
| **puppeteer-mcp** | Browser automation | ⚠️ Abandoned (Session 131) |

---

## 📁 KEY DOCUMENTATION

### Mission & Strategy
| Document | Purpose | Location |
|----------|---------|----------|
| **MISSION & PRIORITIES** | Central mission reference | `reconciliation/00136-MISSION-AND-PRIORITIES.md` |
| **V6 VISION BIG PICTURE** | Complete platform context | `reconciliation/00123-V6-VISION-BIG-PICTURE.md` |
| **MCP WORKFLOW GUIDE** | Enhanced workflow details | `reconciliation/00136-MCP-ENHANCED-WORKFLOW-INTEGRATION.md` |

### Implementation Guides
| Document | Session | Purpose |
|----------|---------|---------|
| V5 Integration Specs | 138 | `reconciliation/00138-V5-INTEGRATION-SPECIFICATIONS.md` |
| V5 Integration Roadmap | 138 | `reconciliation/00138-V5-INTEGRATION-ROADMAP.md` |
| Activity Runtime Report | 137 | `reconciliation/00137-ACTIVITY-RUNTIME-BATCH1-IMPLEMENTATION-REPORT.md` |

---

## 🔄 WORKFLOW CHECKLIST (Never Forget!)

### Starting Any Feature
```bash
# 1. ALWAYS start with context
./scripts/00140-mcp-integrated-session-start.sh [SESSION] 

# 2. Check what exists
python3 scripts/00059-yaml-query.py --topic "[feature]"

# 3. Research patterns FIRST
python3 scripts/00136-create-informed-test.py [feature]

# 4. After implementation, validate
python3 reality/agent-reality-auditor/orchestrator.py

# 5. Create PR with evidence
python3 scripts/00136-auto-pr.py "[Feature]" [SESSION]
```

### Quick Commands Reference
```bash
# Need priorities?
cat reconciliation/00136-MISSION-AND-PRIORITIES.md

# Need context?
./scripts/00136-load-context.sh

# Need to search existing work?
python3 scripts/00059-yaml-query.py --session "00[SESSION]"

# Need to test?
python3 scripts/00136-create-informed-test.py [feature]

# Need system health?
python3 reality/agent-reality-auditor/orchestrator.py
```

---

## ⚠️ COMMON OVERSIGHTS TO AVOID

1. **Forgetting MCP Enhanced Workflow** - Always use 00136 scripts for 4-6x speed
2. **Not checking YAML first** - Query existing work before building
3. **Skipping orchestrator validation** - Always validate before PR
4. **Missing context loading** - Start sessions with proper context
5. **Ignoring Reality Agents** - They catch 95% syndrome early

---

## 📌 STICKY REMINDERS

- **Guardian System**: Fix empty `.insert({})` at line 17
- **Friends Real-Time**: Add WebSocket sync (UI is complete)
- **Activity Runtime**: Batch 1 done, Batch 2-10 ready to build
- **EmCoin Backend**: 46 references need tables (specs in Session 138)
- **V5 UI Patterns**: Specs available, not yet implemented

---

*This document should be referenced at the start of every session to ensure no tools are overlooked.*