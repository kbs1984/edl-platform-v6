---
session: "00098"
type: "guide"
status: "current"
created: "2025-08-28"
title: "Intelligent Workstation Setup Guide - YAML-Enhanced"
purpose: "Merge Session 96's workstation setup with Session 97's YAML discoverability for intelligent self-discovering setup"
topics: ["workstation", "setup", "development", "yaml", "discovery", "intelligent"]
priority: "P0"
domain: "reality"
audience: "developer"
complexity: "simple"
validation_method: "manual"
review_date: "2025-09-28"
estimated_shelf_life: "indefinite"
enhances: ["00096-WORKSTATION-SETUP-GUIDE.md"]
uses: ["00059-yaml-query.py", "00028-session-start.sh"]
breakthrough: "Setup guide that can discover its own tools dynamically"
---

# Intelligent Workstation Setup Guide
**Session 98 Enhancement**: Combining Session 96's setup + Session 97's YAML discovery

## 🎯 The Intelligence: Self-Discovering Setup

This guide can now find its own tools! Thanks to Session 97's YAMLization work, all setup scripts are discoverable.

### 🔍 Discover Setup Tools Dynamically

```bash
# Find all setup-related scripts (thanks to Session 98 metadata updates)
python3 scripts/00059-yaml-query.py --topic setup

# Find all startup scripts
python3 scripts/00059-yaml-query.py --topic startup

# Find canonical scripts
python3 scripts/00059-yaml-query.py --status active --priority P0
```

## 📋 Quick Setup (From Session 96)

### 1️⃣ Session Initialization (Automated)

```bash
# The canonical startup script (now discoverable!)
./scripts/00028-session-start.sh

# This automatically:
# - Runs Reality Agents
# - Creates session log
# - Checks YAML health
# - Loads context
# - Shows system state
```

### 2️⃣ Development Servers

```bash
# Terminal 1 - Auth Gateway (Port 3000)
cd reconciliation/active-work/auth-gateway
npm install
npm run dev

# Terminal 2 - Dashboard (Port 3001)
cd reconciliation/active-work/dashboard
npm install
npm run dev
```

### 3️⃣ Access Points

- **Auth**: http://localhost:3000/login
- **Dashboard**: http://localhost:3001
- **Onboarding**: After login → redirects to :3001/onboarding

## 🔧 Intelligent Tool Discovery

### Find Available Tools By Category

```bash
# Session management tools
python3 scripts/00059-yaml-query.py --category automation

# Verification tools
python3 scripts/00059-yaml-query.py --category verification

# YAML tools
python3 scripts/00059-yaml-query.py --topic yaml

# Reality agents
python3 scripts/00059-yaml-query.py --topic reality-agents
```

### Find Tools By Priority

```bash
# Critical P0 tools only
python3 scripts/00059-yaml-query.py --priority P0 --type script

# Active tools only (not deprecated)
python3 scripts/00059-yaml-query.py --status active --type script
```

### Find Tools By Session

```bash
# All Session 28 automation tools
python3 scripts/00059-yaml-query.py --session 00028 --type script

# Recent tools from last 10 sessions
for i in {088..098}; do
  python3 scripts/00059-yaml-query.py --session 000$i --type script
done
```

## 📁 Directory Structure (From Session 96)

```
edl-platform-v6/
├── truth-seed/              # READ-ONLY reference (NEVER edit)
│   ├── emdash-auth-main/    # Original auth (reference only)
│   └── emdash-dashboard-main/# Original dashboard (reference only)
│
├── reconciliation/active-work/ # ALL DEVELOPMENT HERE
│   ├── auth-gateway/        # Port 3000 (was truth-seed)
│   └── dashboard/           # Port 3001 (was truth-seed)
│
└── scripts/                 # 100% YAMLized (Session 97)
    ├── 00028-session-start.sh # Canonical startup
    ├── 00059-yaml-query.py    # Query any file
    └── SCRIPTS-INDEX.md       # Full registry
```

## 🚀 Power Features (New in Session 98)

### Self-Documentation
```bash
# Find all workstation setup docs
python3 scripts/00059-yaml-query.py --topic workstation

# Find what implements workstation setup
python3 scripts/00059-yaml-query.py --implements workstation-setup

# Find setup fixes from past sessions
python3 scripts/00059-yaml-query.py --fixes port-confusion
python3 scripts/00059-yaml-query.py --fixes directory-confusion
```

### Troubleshooting Helper
```bash
# Find all fixes related to setup issues
python3 scripts/00059-yaml-query.py --type fix --topic setup

# Find session logs about setup problems
python3 scripts/00059-yaml-query.py --type log --topic setup

# Find what replaced deprecated setup scripts
python3 scripts/00059-yaml-query.py --replaces "00028-full-startup.sh"
```

### Script Health Check
```bash
# See overall YAML health
./scripts/00059-yaml-health-check.sh

# Find scripts with unknown status (need review)
python3 scripts/00059-yaml-query.py --status unknown --type script

# Find deprecated scripts to avoid
python3 scripts/00059-yaml-query.py --status deprecated --type script
```

## ✅ Setup Verification Checklist

Using intelligent queries to verify:

```bash
# 1. Check canonical scripts exist
python3 scripts/00059-yaml-query.py --canonical true

# 2. Verify active development tools
python3 scripts/00059-yaml-query.py --status active --priority P0

# 3. Check for blocking issues
python3 scripts/00059-yaml-query.py --status blocked

# 4. Find incomplete work needing attention
python3 scripts/00059-yaml-query.py --status incomplete
```

## 🎓 Key Learnings Incorporated

### From Session 96:
- **Truth-seed = READ-ONLY**: Never edit or run from truth-seed/
- **Port 3001 NOT 3002**: Dashboard is always on 3001
- **Dialog fix**: Original patterns often correct

### From Session 97:
- **100% Script YAMLization**: All scripts now discoverable
- **Query before building**: Always check existing work
- **21% reduction**: Obsolete scripts archived

### From Session 98:
- **Intelligent discovery**: Setup guide finds its own tools
- **Metadata enhancement**: Scripts have better topics
- **Self-documenting**: Guide can update itself with queries

## 🔮 Future Enhancement Ideas

1. **Auto-generate setup commands** from YAML queries
2. **Version detection** - query for latest versions automatically
3. **Dependency graph** - use relationships to find required tools
4. **Health dashboard** - real-time setup status from queries

## 📚 References

- Original Setup: `reality/00096-WORKSTATION-SETUP-GUIDE.md`
- Script Registry: `scripts/SCRIPTS-INDEX.md`
- YAML Query Docs: `scripts/00059-yaml-query.py --help`
- Session 97 Analysis: `scripts/00097-SCRIPTS-YAMLIZATION-ASSESSMENT.md`

---

**The Intelligence**: This guide doesn't hardcode script paths - it discovers them! As scripts evolve, the queries will always find the current canonical versions.