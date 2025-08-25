---
session: "00071"
type: "guide"
status: "current"
created: "2025-08-26"
title: "File System Quick Start Guide"
purpose: "5-minute guide for new sessions to use the unified file system"
topics: ["quick-start", "file-system", "yaml", "workflow"]
priority: "P0"
domain: "core"
lifecycle: "ON"
related_to: ["00069-UNIFIED-FILE-SYSTEM-PROTOCOL.md", "00070-HANDOFF.md"]
---

# File System Quick Start Guide

**Time to Learn**: 5 minutes  
**Time to Master**: 1 session  
**Created by**: Session 71 after comprehensive testing

## The One Rule That Rules Them All

> **Every file has YAML frontmatter that determines both its metadata AND its physical location.**

The `domain` field in YAML determines where your file lives. That's it. That's the system.

## 5-Step Workflow (With Real Examples)

### Step 1: Create File with YAML

```yaml
# --- (remove the # to use)
session: "00071"        # Your session number
type: "guide"           # What kind of document (see valid types below)
status: "draft"         # Current state: draft/current/archived/superseded
created: "2025-08-26"   # Today's date (ISO format)
domain: "core"          # ⚠️ THIS DETERMINES LOCATION!
# --- (remove the # to use)
# Your content here
```

**Valid types**: specification, guide, report, analysis, log, script, config, template, handoff, protocol, command, unknown

**Valid status**: current, draft, archived, superseded

### Step 2: Stage the File FIRST (Critical!)

```bash
# ⚠️ IMPORTANT: File must be staged before auto-organize can move it
git add your-file.md
```

**Why?** The auto-organize tool uses `git mv` to preserve history. Unstaged files will fail with "not under version control" error.

### Step 3: Auto-Organize (Always Dry Run First!)

```bash
# ALWAYS dry run first to see what will happen
python3 scripts/00067-auto-organize-files.py --dry-run your-file.md

# Output will show:
# 📄 your-file.md:
#    Classification: core/ (Domain is 'core')
#    🔍 Would move to core/

# If correct, execute
python3 scripts/00067-auto-organize-files.py --execute your-file.md
```

### Step 4: Find Files Later

```bash
# By session (your work)
python3 scripts/00059-yaml-query.py --session 00071

# By domain (all core files)
python3 scripts/00059-yaml-query.py --domain core

# By type (all guides)
python3 scripts/00059-yaml-query.py --type guide

# By topic (related content)
python3 scripts/00059-yaml-query.py --topic "file-system"
```

### Step 5: Commit Safely (Hooks Validate Automatically)

```bash
git commit -m "feat: Add quick start guide"

# Hook output:
# 🔍 YAML Pre-commit Validation Hook
# ✅ core/00071-FILE-SYSTEM-QUICK-START.md
# ✅ All YAML validation checks passed!
```

If validation fails, you'll see:
```bash
# ❌ your-file.md: Missing required fields: ['created']
# 🔧 To fix automatically, run:
#   python3 scripts/00068-fix-yaml-validation.py
```

## Domain → Directory Mapping

| Domain | Goes to | Purpose |
|--------|---------|---------|
| `core` | `core/` | Protocols, guides, system docs |
| `reality` | `reality/` | Reality agents, monitoring |
| `requirements` | `requirements/` | User stories, specifications |
| `reconciliation` | `reconciliation/` | Integration work |

## Special Cases (Automatic Placement)

| Type | Always goes to | Named |
|------|----------------|-------|
| `log` | `archive/sessions/` | `SESSION-XXXXX-LOG.md` |
| `handoff` | `archive/sessions/` | `SESSION-XXXXX-HANDOFF.md` |

## Common Issues & Solutions

### Issue: "Git mv failed: not under version control"
**Solution**: Always `git add` your file before running auto-organize

### Issue: Validation passes but commit fails
**Solution**: Check if pre-commit hook has the Session 71 fix (subshell bug)

### Issue: File doesn't move where expected
**Solution**: Check the `domain` field - it overrides everything else

### Issue: Can't validate a single file
**Solution**: The validation script processes directories, not files. Use the query tool to check individual files.

## Tools Cheat Sheet

| Need to... | Use this... |
|------------|-------------|
| Add YAML to existing file | `scripts/00061-add-yaml-frontmatter.py file.md` |
| Fix validation errors | `scripts/00068-fix-yaml-validation.py` |
| Move files to right place | `scripts/00067-auto-organize-files.py --execute file.md` |
| Find files | `scripts/00059-yaml-query.py --session 00071` |
| Check system health | `python3 scripts/00059-yaml-health-check.py` |

## Testing Your Understanding

Try this 2-minute test:
1. Create a file called `test-understanding.md`
2. Add YAML with `domain: "requirements"`
3. Stage it with `git add`
4. Run auto-organize
5. Verify it moved to `requirements/`
6. Query for it by session

If that works, you understand the system!

## What Wasn't Obvious (From Testing)

1. **Files need staging before organize** - Not mentioned in most docs
2. **Validation script is batch-only** - Can't validate single files
3. **Pre-commit hook had a bug** - Fixed in Session 71
4. **The domain field is absolute** - It overrides all other classification logic
5. **Dry run is essential** - Always check before executing moves

## For Edge Cases & Deep Dives

Once comfortable with these basics, see:
- `core/00069-UNIFIED-FILE-SYSTEM-PROTOCOL.md` - Full protocol
- `scripts/00067-auto-organize-files.py --help` - All options
- `core/00065-FILE-ORGANIZATION-PROTOCOL.md` - Historical context (superseded)

## Philosophy

This system emerged from Sessions 58-70 recognizing that:
- File organization and metadata are inseparable
- The domain naturally determines location
- Git history must be preserved
- Validation prevents entropy

**Remember**: The best file system is one that organizes itself. Just add proper YAML, and the system does the rest.

---
*Created Session 71 after testing every edge case*  
*Fixed pre-commit hook bug that would have blocked everyone*  
*This guide is what I wished I had when starting*