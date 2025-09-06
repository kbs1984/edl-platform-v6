---
auto_generated: true
created: '2025-08-28'
domain: core
generation_command: python3 scripts/00097-generate-scripts-index.py
priority: P0
purpose: Central registry of all scripts showing status, purpose, and relationships
session: 00097
status: current
title: Scripts Registry - Authoritative Index
topics:
- scripts
- registry
- automation
- index
type: guide
---

# Scripts Registry - Authoritative Index

**Generated**: 2025-08-28  
**Session**: 00097  
**Status**: First manual version (automation coming)

## 📊 Statistics
- **Total Scripts**: 135
- **YAMLized**: 14 (10.4%)
- **Active**: 9
- **Deprecated**: 5
- **Unknown Status**: 121

## ✅ ACTIVE SCRIPTS (Use These)

### 🚀 Session Startup
| Script | Purpose | Priority |
|--------|---------|----------|
| **00140-mcp-integrated-session-start.sh** | MCP-integrated session startup v3.0 (Session 140) | P0 |
| **00028-session-start.sh** | Legacy session startup v2.0 (use if MCP unavailable) | P1 |
| **00028-session-start-mcp-addon.sh** | Add MCP tracking to existing session | P2 |

### 🔍 YAML & Metadata
| Script | Purpose | Priority |
|--------|---------|----------|
| **00059-yaml-query.py** | Query files by YAML metadata | P0 |
| **00061-add-yaml-frontmatter.py** | Add YAML frontmatter to files | P0 |

### 🔬 Reality & Verification
| Script | Purpose | Priority |
|--------|---------|----------|
| **00028-reality-check.sh** | Run reality agents for ground truth | P0 |
| **00088-gather-evidence.sh** | Anti-guesswork evidence gathering | P0 |

### 📝 Session Management
| Script | Purpose | Priority |
|--------|---------|----------|
| **create-session-log.sh** | Create constitutional session logs | P1 |
| **session-guard.sh** | Validate protocol compliance | P1 |
| **structure-check.sh** | Check system structure | P1 |

### 🛠️ Development Tools
| Script | Purpose | Priority |
|--------|---------|----------|
| **00032-tos-dashboard.sh** | Truth Over Speed dashboard | P1 |
| **00069-yaml-pre-commit-hook.sh** | Git pre-commit YAML validation | P2 |

## 🔴 DEPRECATED SCRIPTS (Do Not Use)

| Script | Replaced By | Reason |
|--------|-------------|---------|
| **00028-full-startup.sh** | 00028-session-start.sh | Features merged into canonical v2.0 |
| **00028-session-startup.sh** | 00028-session-start.sh | Missing anti-guesswork and YAML health |
| **00028-session-start-original.sh** | 00028-session-start.sh | Original preserved for reference only |
| **00059-session-start-enhanced.sh** | 00028-session-start.sh | YAML features merged into canonical |
| **create-session-log.sh** | 00028-create-session-log.sh | Duplicate functionality |

## ⚠️ UNKNOWN STATUS (Need Review)

These 121 scripts haven't been YAMLized yet and need status determination:

### High Priority to Review (Session 40-55 Migration Era)
- 00040-verify-auth-context.sql
- 00040-verify-rls-policies.py
- 00050-verify-completeness.py
- 00050-verify-migration-assumptions.py
- 00053-verify-migration-integrity.sh
- (Many more migration-related scripts)

### Session 87 Scripts (7 total)
- Check if any are still needed

### YAML Tools (Need consolidation)
- 00058-yaml-query-demo.py
- 00059-yaml-maintenance.py
- 00059-yaml-indexer.py
- 00063-batch-yaml-add.sh
- 00068-fix-yaml-validation.py

## 🎯 Next Actions

1. **Immediate**: Continue YAMLizing remaining scripts
2. **Short-term**: Archive obsolete migration scripts
3. **Medium-term**: Consolidate duplicate functionality
4. **Long-term**: Automate this index generation

## 🔧 How to Update This Registry

### Add YAML to a Script
```bash
python3 scripts/00061-add-yaml-frontmatter.py scripts/YOUR-SCRIPT.sh
```

### Query Scripts
```bash
# Find all active scripts
python3 scripts/00059-yaml-query.py --type script --status active

# Find deprecated scripts
python3 scripts/00059-yaml-query.py --type script --status deprecated

# Find scripts by category
python3 scripts/00059-yaml-query.py --type script --category automation
```

### Regenerate This Index (Coming Soon)
```bash
python3 scripts/00097-generate-scripts-index.py > scripts/SCRIPTS-INDEX.md
```

---

*Note: This is the first version of the registry. As more scripts get YAMLized, this will become more comprehensive and eventually auto-generated.*