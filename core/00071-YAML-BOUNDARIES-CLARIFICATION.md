---
session: "00071"
type: "specification"
status: "current"
created: "2025-08-25"
title: "YAML Boundaries Clarification"
purpose: "Define exactly which files require YAML frontmatter"
topics: ["yaml", "boundaries", "requirements", "clarification"]
priority: "P0"
domain: "core"
lifecycle: "ON"
related_to: ["00069-UNIFIED-FILE-SYSTEM-PROTOCOL.md", "00061-YAML-INDEXING-REQUIREMENTS.md"]
---

# YAML Boundaries Clarification

**Session**: 00071  
**Purpose**: Resolve ambiguity about which files require YAML frontmatter  
**Authority**: Clarifies Session 61 & 69 requirements  

## The Core Principle

**YAML is required for all files WE CREATE AND CONTROL.**

## Files That REQUIRE YAML

### 1. All Session Deliverables
- ✅ Session Logs (`SESSION-*-LOG.md`)
- ✅ Session Handoffs (`SESSION-*-HANDOFF.md`)
- ✅ All session-created documentation
- ✅ All session-created scripts documentation

### 2. All Domain Files We Create
- ✅ `core/*.md` - Protocols, guides, specifications
- ✅ `requirements/*.md` - User stories, specifications
- ✅ `reality/*.md` - Agent documentation
- ✅ `reconciliation/*.md` - Integration documentation

### 3. Command Documentation
- ✅ `.claude/commands/**/*.md` - Command files

## Files That DON'T Require YAML

### 1. External Code
- ❌ `truth-seed/**` - External platform code
- ❌ `node_modules/**` - Package dependencies
- ❌ `.git/**` - Git internals

### 2. Generated Files
- ❌ `*.json` - Data files
- ❌ `*.log` - Log files (not session logs)
- ❌ `*.lock` - Lock files
- ❌ Build artifacts

### 3. Legacy Imports
- ❌ Canvas work imported before Session 58
- ❌ External documentation copied in

### 4. Special Cases
- ❌ `.roo/rules/*.md` - Have incompatible YAML format
- ❌ Example/template content within documentation

## The 97.7% Metric Explained

The "462/473 files" metric is misleading because it only counts:
- Markdown files in our control
- Excludes truth-seed (897 files)
- Excludes node_modules (thousands)

**True Coverage Goal**: 100% of files we create, not all files in repo.

## Implementation Guidelines

### For Pre-commit Hook
The hook should:
1. Check all staged `.md` files
2. Skip files in excluded directories (truth-seed, node_modules)
3. Require YAML for everything else
4. Allow `--no-verify` for special cases

### For Session Logs
**CRITICAL**: Session logs created by ANY method must have YAML:
- Manual: `create-session-log.sh` ✅ (has YAML)
- Automated: `00028-create-session-log.sh` ✅ (NOW has YAML after Session 71 fix)
- Enhanced: `00059-session-start-enhanced.sh` ⚠️ (needs checking)

### For Auto-Organization
Files without YAML in controlled directories should:
1. Get YAML added automatically
2. Be reported for manual review
3. Not break the system

## Enforcement Priority

1. **P0**: New files we create (100% must have YAML)
2. **P1**: Existing session deliverables (retrofit YAML)
3. **P2**: Legacy documentation in our domains
4. **P3**: Nice to have for external code (not required)

## The Truth

Session 61 said "ALL session deliverables MUST have YAML" - this is non-negotiable.
Session 69 said "EVERY file has YAML" - this meant every file we control.

The confusion arose from:
- Automation predating YAML requirements
- Unclear boundaries on external code
- Metrics counting files we don't control

## Action Items

1. ✅ Fix `00028-create-session-log.sh` (Session 71 completed)
2. ✅ Add YAML to Sessions 70-72 logs (Session 71 completed)
3. ⏳ Audit other file-creating scripts
4. ⏳ Update hook with clear exclusions
5. ⏳ Retrofit YAML to pre-Session 60 logs

---

*Session 71 clarification based on investigation of original intent*