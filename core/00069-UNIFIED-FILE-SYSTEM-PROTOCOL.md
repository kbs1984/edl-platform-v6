---
session: "00069"
type: "specification"
status: "current"
created: "2025-08-25"
title: "Unified File System & Metadata Protocol v2.0"
purpose: "Single authoritative protocol for file organization and metadata"
topics: ["file-system", "yaml", "organization", "metadata", "unified-protocol"]
priority: "P0"
domain: "core"
lifecycle: "ON"
audience: "developer"
complexity: "intermediate"
validation_method: "automated"
review_date: "2025-09-25"
estimated_shelf_life: "indefinite"
related_to: ["PROJECT-STRUCTURE.md", "SYSTEM-INDEX.md"]
supersedes: ["00065-FILE-ORGANIZATION-PROTOCOL.md", "00069-YAML-FILE-SYSTEM-PROTOCOL.md"]
implements: ["file-organization", "metadata-management", "discovery-system"]
---

# Unified File System & Metadata Protocol v2.0

**Session**: 00069  
**Status**: AUTHORITATIVE - Supersedes Sessions 65 & 69 separate protocols  
**Coverage**: 97.7% files with metadata (462/473)

## Executive Summary

This unified protocol combines Session 65's file organization rules with Session 69's YAML metadata specifications into a single, coherent system. Files are organized by their metadata, and metadata enables both organization and discovery.

## Core Principle

**Every file has YAML frontmatter that determines both its metadata AND its physical location.**

## The Unified System

### 1. File Lifecycle

```
File Creation → Add YAML → Auto-Organize → Validate → Commit
      ↓            ↓            ↓            ↓          ↓
   Named      Metadata    Domain-based   Schema    Git history
   00XXX-     defines     placement      check     preserved
              location
```

### 2. YAML Schema (Required Fields)

```yaml
---
# MINIMUM REQUIRED (determines everything else)
session: "00069"        # Session number or "legacy"
type: "protocol"        # Determines subdirectory
status: "current"       # Lifecycle state
created: "2025-08-25"   # Creation date
domain: "core"          # DETERMINES PRIMARY LOCATION

# RECOMMENDED
title: "Descriptive Title"
purpose: "Clear purpose statement"
topics: ["tag1", "tag2"]
priority: "P0"          # P0, P1, P2, P3

# OPTIONAL BUT VALUABLE
lifecycle: "ON"         # ON, OFF, OBSOLETE, UNKNOWN
validation_method: "automated"
related_to: ["file1.md", "file2.md"]
---
```

### 3. Organization Rules

The `domain` and `type` fields determine file placement:

#### Primary Organization (by domain)

| Domain | Location | Description |
|--------|----------|-------------|
| `core` | `core/` | Infrastructure, protocols, critical guides |
| `reality` | `reality/` | Reality agents, monitoring, verification |
| `requirements` | `requirements/` | User stories, specifications |
| `reconciliation` | `reconciliation/` | Integration, coordination |

#### Special Cases (type overrides domain)

| Type | Location | Naming |
|------|----------|--------|
| `log` | `archive/sessions/` | `SESSION-{session}-LOG.md` |
| `handoff` | `archive/sessions/` | `SESSION-{session}-HANDOFF.md` |
| `script` | `scripts/` | `{session}-{name}.{ext}` |
| `template` | `templates/` | `{name}-template.md` |

#### Subdirectory Organization (within domains)

```
core/
├── protocols/        # type: "protocol"
├── specifications/   # type: "specification"
├── guides/          # type: "guide"
└── *.md            # Other types stay in root of domain
```

### 4. File Naming Convention

```
{session}-{DESCRIPTIVE-NAME}.{ext}
00069-UNIFIED-FILE-SYSTEM-PROTOCOL.md
```

- Always maintain session prefix for tracking
- Use CAPS-KEBAB-CASE for importance
- Descriptive names for clarity

### 5. Decision Flow

```
New File
    ↓
Has YAML? → NO → Add YAML first (required)
    ↓ YES
Is type "log" or "handoff"? → YES → archive/sessions/
    ↓ NO
Check domain field → Place in domain directory
    ↓
Check type field → Place in subdirectory if applicable
    ↓
Validate YAML → Fix any errors
    ↓
Update references → Ensure no broken links
```

## Valid Values Reference

### Types
```yaml
- specification   # Technical specs
- guide          # How-to guides
- report         # Analysis reports
- analysis       # Deep analysis
- log            # Session logs
- script         # Script docs
- config         # Configuration
- template       # Reusable templates
- handoff        # Session handoffs
- protocol       # Process protocols
- command        # Command docs
- unknown        # Unclassified
```

### Status
```yaml
- current        # Active and up-to-date
- draft          # Work in progress
- archived       # No longer active
- superseded     # Replaced by newer
```

### Domains
```yaml
- core           # System infrastructure
- reality        # Reality agents
- requirements   # User requirements
- reconciliation # Integration work
```

### Lifecycle
```yaml
- ON             # Currently active
- OFF            # Dormant
- OBSOLETE       # No longer relevant
- UNKNOWN        # Needs review
```

## Tool Suite

### Organization Tools
- `scripts/00067-auto-organize-files.py` - Implements organization rules
- `scripts/00066-reference-mapper.py` - Updates references after moves
- `scripts/00068-path-resolver.py` - Finds moved files

### Metadata Tools
- `scripts/00061-add-yaml-frontmatter.py` - Adds YAML to files
- `scripts/00068-fix-yaml-validation.py` - Fixes validation errors
- `scripts/00063-batch-yaml-add.sh` - Batch YAML addition

### Query Tools
- `scripts/00059-yaml-indexer.py` - Fast indexed search
- `scripts/00059-yaml-query.py` - Query by any field
- `scripts/00059-yaml-maintenance.py` - Cache management

### Validation Tools
- `scripts/00069-yaml-pre-commit-hook.sh` - Pre-commit validation
- `scripts/00062-yaml-compliance-check.sh` - Compliance reports
- `scripts/00059-yaml-health-check.sh` - Health monitoring

## Integration Points

### Session Startup
```bash
./scripts/00028-session-start.sh
# Automatically shows:
# - YAML coverage percentage
# - Validation errors
# - Broken references
# - Organization health score
```

### Git Workflows
```bash
# Pre-commit hook validates YAML
git commit # Runs validation automatically

# Pre-push hook checks everything
git push # Full validation before push
```

### File Creation
```bash
# Create with proper metadata
cat > 00070-NEW-FILE.md << EOF
---
session: "00070"
type: "guide"
status: "draft"
created: "2025-08-26"
domain: "core"
---
# Content
EOF

# Auto-organize based on metadata
python3 scripts/00067-auto-organize-files.py --execute 00070-NEW-FILE.md

# Validate
python3 scripts/00068-fix-yaml-validation.py
```

## Migration Path

### For Existing Files

1. **Add YAML if missing** (3% of files)
   ```bash
   ./scripts/00063-batch-yaml-add.sh [directory]
   ```

2. **Fix validation errors** (15 files remaining)
   ```bash
   python3 scripts/00068-fix-yaml-validation.py
   ```

3. **Organize by domain** (if needed)
   ```bash
   python3 scripts/00067-auto-organize-files.py --execute [file]
   ```

## Best Practices

### DO
- ✅ Add YAML frontmatter to EVERY new .md file
- ✅ Set domain field to determine location
- ✅ Use valid values from lists above
- ✅ Maintain session prefixes
- ✅ Run validation before commits

### DON'T
- ❌ Create files without YAML
- ❌ Move files manually (use tools)
- ❌ Break references (check first)
- ❌ Ignore validation errors
- ❌ Mix archive and active work

## Success Metrics

```yaml
Current State (Session 69):
  Files with YAML: 97.7% (462/473)
  Valid YAML: 96.8% (447/462)
  Correct Location: ~85% (estimated)
  Broken References: 0
  Query Speed: <1 second
  
Target State:
  Files with YAML: >99%
  Valid YAML: >99%
  Correct Location: 100%
  Broken References: 0
  Full Automation: Yes
```

## Common Patterns

### Creating a Protocol
```yaml
---
session: "00070"
type: "protocol"      # → Will go in core/protocols/
domain: "core"        # → Primary location
status: "draft"
created: "2025-08-26"
---
```

### Creating a Session Log
```yaml
---
session: "00070"
type: "log"          # → Overrides domain, goes to archive/sessions/
domain: "core"       # → Ignored for logs
status: "current"
created: "2025-08-26"
---
```

### Creating a Reality Agent Spec
```yaml
---
session: "00070"
type: "specification"
domain: "reality"     # → Goes to reality/specifications/
status: "draft"
created: "2025-08-26"
---
```

## Enforcement

### Automated (via hooks)
- Pre-commit: Validates YAML in staged files
- Pre-push: Full validation sweep
- Session startup: Shows health metrics

### Manual (via discipline)
- Always add YAML first
- Use valid values only
- Check references before moving
- Validate before committing

## Why Unified?

**The protocols are inseparable because:**
1. Organization DEPENDS on metadata (domain field)
2. Metadata DETERMINES location (domain → directory)
3. Tools READ metadata to organize files
4. Queries FIND files regardless of location
5. One system, not two separate ones

**This unified protocol eliminates confusion by providing ONE authoritative source for both organization and metadata.**

---

*Unified Protocol v2.0 by Session 00069*  
*Incorporating Session 65's organization rules*  
*Building on Sessions 58-68 infrastructure*  
*Part of Constitutional OS file management*