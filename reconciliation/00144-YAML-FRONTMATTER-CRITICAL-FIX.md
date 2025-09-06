---
session: "00144"
type: "critical-fix"
status: "complete"
created: "2025-09-03"
title: "Critical Fix - Uncommented YAML Frontmatter in Bash Scripts"
purpose: "Document and fix the critical issue where YAML frontmatter was not commented in bash scripts"
topics: ["critical-fix", "bash", "yaml", "scripts", "session-145-discovery"]
priority: "P0"
domain: "reconciliation"
fixes: ["00028-session-start.sh", "00028-reality-check.sh", "00028-full-startup.sh", "00028-session-start-original.sh", "00028-session-startup.sh"]
---

# Critical Fix - Uncommented YAML Frontmatter in Bash Scripts

## Issue Discovered by Session 145

Session 145 tried to run `./scripts/00028-session-start.sh` and encountered errors:
```bash
./scripts/00028-session-start.sh: line 2: ---: command not found
./scripts/00028-session-start.sh: line 3: session:: command not found
```

## Root Cause Analysis

### The Problem
When YAML frontmatter was added to bash scripts, it was NOT properly commented out. Bash was trying to execute YAML metadata as shell commands.

### Example of the Issue
```bash
#!/bin/bash
---                    # ← Bash tries to execute this as a command
session: "00028"       # ← Bash sees "session:" as a command
type: "script"         # ← Bash sees "type:" as a command
---                    # ← Another invalid command
```

### Why This Happened
The scripts originally had bash code. When YAML frontmatter was added (likely for metadata tracking), it was inserted directly after the shebang without being wrapped in a comment block.

## Scripts Affected

Five scripts had uncommented YAML frontmatter:
1. `00028-session-start.sh` - **PRIMARY SESSION STARTER** (most critical)
2. `00028-reality-check.sh` - Reality agent runner
3. `00028-full-startup.sh` - Full startup integration (deprecated)
4. `00028-session-start-original.sh` - Original implementation (deprecated)
5. `00028-session-startup.sh` - Session startup orchestrator (deprecated)

## The Fix Applied

Wrapped all YAML frontmatter in bash multiline comment blocks using the `: '...'` syntax:

### Before (BROKEN):
```bash
#!/bin/bash
---
session: "00028"
type: "script"
---
```

### After (FIXED):
```bash
#!/bin/bash
: '
---
session: "00028"
type: "script"
---
'
```

## Verification

All fixed scripts now pass bash syntax validation:
```bash
scripts/00028-session-start.sh: ✅ Valid
scripts/00028-reality-check.sh: ✅ Valid
scripts/00028-full-startup.sh: ✅ Valid
scripts/00028-session-start-original.sh: ✅ Valid
scripts/00028-session-startup.sh: ✅ Valid
```

## Impact Assessment

### Severity: CRITICAL
- The primary session starter was broken
- This prevented Session 145 from initializing properly
- All sessions would have been affected going forward

### Recovery: COMPLETE
- All affected scripts fixed
- Syntax validated
- Session 145 can now proceed normally

## Lessons Learned

1. **YAML in bash scripts must be commented** - Either use `#` for each line or wrap in `: '...'`
2. **Test scripts after adding metadata** - A simple `bash -n` check would have caught this
3. **Critical infrastructure requires extra care** - 00028-session-start.sh is used by every session

## Prevention

For future YAML frontmatter additions to bash scripts, use one of these patterns:

### Option 1: Hash Comments
```bash
#!/bin/bash
# ---
# session: "00XXX"
# type: "script"
# ---
```

### Option 2: Multiline Comment (Used in Fix)
```bash
#!/bin/bash
: '
---
session: "00XXX"
type: "script"
---
'
```

### Option 3: HERE Document (Alternative)
```bash
#!/bin/bash
: <<'YAML'
---
session: "00XXX"
type: "script"
---
YAML
```

## Conclusion

This critical issue has been fully resolved. All affected scripts now have properly commented YAML frontmatter and are functioning correctly. Session 145 and all future sessions can now use the session start infrastructure without errors.

**The key lesson**: Metadata is valuable, but it must not break the actual functionality of the scripts it describes.