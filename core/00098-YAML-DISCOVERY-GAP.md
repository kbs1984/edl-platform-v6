---
session: "00098"
type: "discovery"
status: "current"
created: "2025-08-28"
title: "YAML Query Gap Discovery - Bash Scripts Not Discoverable"
purpose: "Document critical gap where Session 97's YAMLized bash scripts aren't queryable"
topics: ["yaml", "discovery", "bash", "scripts", "bug", "gap"]
priority: "P0"
domain: "core"
discovered_by: "Session 98 integration work"
affects: ["00059-yaml-query.py", "all bash scripts"]
---

# YAML Query Gap Discovery

## 🚨 Critical Finding

While integrating Session 96's workstation setup with Session 97's YAML work, discovered that **bash scripts with YAML in comments are NOT discoverable** by the query tool.

## The Problem

### Session 97's Approach (Doesn't Work for Queries)
```bash
#!/bin/bash
# ---
# session: "00028"
# type: "script"
# status: "active"
# ---
```

### Python Scripts (Works)
```python
#!/usr/bin/env python3
"""
---
session: "00059"
type: "script"
status: "active"
---
"""
```

## Evidence

When querying for scripts with enhanced metadata:
```bash
# This should find setup scripts but returns 0 bash scripts
python3 scripts/00059-yaml-query.py --topic setup --type script

# Result: Only finds .md files with type: "script", not actual scripts
```

## Impact

- **96 bash scripts YAMLized in Session 97** - ALL invisible to queries
- **SCRIPTS-INDEX.md** - Shows YAMLized scripts but they can't be found
- **Workstation setup** - Can't dynamically discover its own tools
- **Session startup** - Scripts exist but aren't discoverable

## Root Cause

The `00059-yaml-query.py` tool:
1. Looks for YAML frontmatter between `---` markers
2. Skips lines starting with `#` as comments
3. Never sees the YAML in bash script comments

## Solutions

### Option 1: Fix Query Tool (Recommended)
Enhance `00059-yaml-query.py` to:
- Detect bash scripts by shebang
- Parse YAML from comments after shebang
- Handle both formats (comment and raw)

### Option 2: Re-YAMLize Scripts
Convert all bash scripts to use raw YAML:
```bash
#!/bin/bash
---
session: "00028"
type: "script"
---
# Regular script continues
```

### Option 3: Hybrid Approach
- Keep comment format for bash execution safety
- Add secondary parser specifically for bash scripts
- Update cache generation logic

## Temporary Workaround

Until fixed, use filesystem queries:
```bash
# Find scripts directly
ls scripts/00028-*.sh

# Grep for specific metadata
grep -l "topics.*setup" scripts/*.sh
```

## Session 98 Actions Taken

1. ✅ Enhanced metadata for key scripts (but not queryable)
2. ✅ Created intelligent workstation guide
3. ✅ Documented the discovery gap
4. ⏳ Need to fix query tool or re-format scripts

## Priority

**P0 - BLOCKS DISCOVERABILITY**

Without this fix:
- Session 97's work is only 50% effective
- Scripts remain invisible to queries
- Integration of setup + YAML is incomplete

## Next Steps

1. Test if raw YAML breaks bash execution
2. Decide on solution approach
3. Implement fix
4. Re-test all queries
5. Update Session 97's assessment

---

**Key Insight**: YAMLization without queryability is like having a library catalog where the books can't be found on the shelves.