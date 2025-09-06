---
session: "00097"
type: "assessment"
status: "current"
created: "2025-08-28"
title: "Scripts Directory YAMLization Assessment"
purpose: "Document the need to add YAML metadata to 135 scripts for discoverability"
topics: ["scripts", "yaml", "metadata", "discoverability", "technical-debt"]
priority: "P0"
domain: "core"
metrics:
  total_scripts: 135
  yaml_coverage: 0
  deprecated_identified: 3
  duplication_categories: 5
recommendations:
  - "Add YAML to top 10 critical scripts"
  - "Create SCRIPTS-INDEX.md registry"
  - "Archive obsolete migration scripts"
  - "Add lifecycle status to all scripts"
breakthrough: "Discovered scripts CAN have YAML - assumption was wrong"
---

# Scripts Directory YAMLization Assessment

**Session**: 00097  
**Date**: 2025-08-28  
**Critical Discovery**: Scripts CAN and SHOULD have YAML frontmatter!

## 📊 Current State

### The Numbers
- **Total Files**: 135 (122 session-prefixed, 13 non-prefixed)
- **YAML Coverage**: 0% (ZERO scripts have YAML frontmatter!)
- **Deprecated Scripts**: 3 identified, likely many more
- **Duplication Categories**: 5+ (startup, verification, yaml, test, migration)

### Top Sessions by Script Count
- Session 28: 10 scripts (startup confusion origin)
- Session 87: 7 scripts  
- Session 50: 7 scripts
- Session 59: 7 scripts (YAML tools)

## 🚨 Critical Issues

### 1. Zero YAML Coverage
**Impact**: Scripts are invisible to our query system
- Can't discover: "What script handles X?"
- Can't check: "Is this deprecated?"
- Can't find: "What replaced this script?"

### 2. Startup Script Confusion (Known Issue)
```
00028-full-startup.sh         # DEPRECATED by Session 94
00028-session-startup.sh      # DEPRECATED by Session 94
00059-session-start-enhanced.sh # DEPRECATED by Session 94
00028-session-start.sh        # ✅ CANONICAL v2.0
00028-session-start-original.sh # Status unknown
```

### 3. Massive Duplication Without Context

#### Verification Scripts (9+ variants)
No way to know which verifies what or when to use each

#### YAML Management Scripts (13 variants)  
Multiple tools with overlapping functionality

#### Migration Scripts (Sessions 40-55)
Obsolete after Session 53 completion but still present

## 🎯 Proposed Solution: YAMLization

### Phase 1: Design Script YAML Schema
```yaml
---
session: "00028"           # Creating session
type: "script"            # Always "script" for scripts/
status: "active"          # active|deprecated|obsolete|experimental
created: "2025-01-15"     
modified: "2025-08-27"    
purpose: "Run reality agents and generate reports"
language: "bash"          # bash|python|sql
category: "automation"    # automation|verification|yaml|migration|test
replaces: []             # Scripts this replaces
replaced_by: null        # Script that replaces this
dependencies:            # Other scripts it needs
  - "00028-reality-check.sh"
usage: "./scripts/00028-session-start.sh [session-num] '[focus]'"
topics: ["session-startup", "reality-agents", "automation"]
priority: "P0"           # How critical is this script
domain: "core"           # Which domain it serves
---
```

### Phase 2: Top 10 Critical Scripts to YAMLize First

1. **00028-session-start.sh** - Canonical startup (P0)
2. **00059-yaml-query.py** - Query system (P0)
3. **00028-reality-check.sh** - Reality agents (P0)
4. **00088-gather-evidence.sh** - Anti-guesswork (P0)
5. **create-session-log.sh** - Session logging (P0)
6. **00061-add-yaml-frontmatter.py** - Add YAML tool (P0)
7. **structure-check.sh** - System structure (P1)
8. **session-guard.sh** - Protocol validation (P1)
9. **00032-tos-dashboard.sh** - TOS dashboard (P1)
10. **00069-yaml-pre-commit-hook.sh** - Git hooks (P1)

### Phase 3: Create Scripts Registry
```
scripts/SCRIPTS-INDEX.md
```
Auto-generated from YAML metadata, showing:
- Active scripts by category
- Deprecated with replacements
- Obsolete for removal

### Phase 4: Archive Obsolete
```
scripts/obsolete/
  └── migration-era/  # Sessions 40-55
  └── deprecated/     # Replaced scripts
```

## 📈 Expected Benefits

1. **Discoverability**: Query scripts by purpose, status, session
2. **Clarity**: Know which scripts are current vs deprecated
3. **Relationships**: See what replaces what
4. **Cleanup**: Identify safe-to-remove scripts
5. **Documentation**: Self-documenting through metadata

## 🔥 Why This Matters

Scripts are the **most-used but least-discoverable** files:
- Every session uses scripts
- But no way to find the right one
- Leading to duplication and confusion
- Wasting time every session

## 💡 Implementation Approach

### Step 1: Add YAML to Top 10 (15 minutes)
Using our existing tool:
```bash
python3 scripts/00061-add-yaml-frontmatter.py scripts/00028-session-start.sh
```

### Step 2: Batch Process Remaining (30 minutes)
```bash
for script in scripts/000*.sh scripts/000*.py; do
  python3 scripts/00061-add-yaml-frontmatter.py "$script"
done
```

### Step 3: Generate Registry (5 minutes)
```bash
python3 scripts/00059-yaml-query.py --type script > scripts/SCRIPTS-INDEX.md
```

### Step 4: Archive Obsolete (10 minutes)
Based on YAML status fields

## 🎬 Next Action

Start with adding YAML to the #1 most critical script:
**00028-session-start.sh** - The canonical session startup

This will prove the concept and immediately make our most-used script discoverable.