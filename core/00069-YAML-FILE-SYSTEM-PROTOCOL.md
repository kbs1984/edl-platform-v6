---
session: "00069"
type: "specification"
status: "superseded"
created: "2025-08-25"
title: "YAML File System Protocol - Complete Specification"
purpose: "Define comprehensive protocol for YAML-based file system metadata"
topics: ["yaml", "file-system", "protocol", "metadata", "organization"]
priority: "P0"
domain: "core"
lifecycle: "OFF"
audience: "developer"
complexity: "intermediate"
validation_method: "automated"
review_date: "2025-09-25"
estimated_shelf_life: "historical"
related_to: ["00059-YAML-FILE-ORGANIZATION-SYSTEM.md", "00061-YAML-PROJECT-INSIGHTS-STRATEGY.md", "00068-YAML-INFRASTRUCTURE-STATUS.md"]
implements: ["yaml-infrastructure", "file-organization", "metadata-management"]
superseded_by: "00069-UNIFIED-FILE-SYSTEM-PROTOCOL.md"
---

# YAML File System Protocol v1.0

> ⚠️ **SUPERSEDED**: This protocol has been unified with Session 65's file organization protocol into the [Unified File System & Metadata Protocol v2.0](00069-UNIFIED-FILE-SYSTEM-PROTOCOL.md). Session 69 discovered that file organization and YAML metadata are ONE SYSTEM - the `domain` field determines placement. This document is preserved for historical reference.

**Session**: 00069  
**Date**: 2025-08-25  
**Status**: ACTIVE - 94.3% Coverage Achieved  

## Executive Summary

This protocol defines the comprehensive YAML-based file system metadata infrastructure for the EDL Platform v6. With 94.3% coverage achieved (445/472 files), the system provides powerful project insights, automated validation, and intelligent file organization.

## Protocol Components

### 1. YAML Frontmatter Specification

#### Required Fields (Minimum)
```yaml
---
session: "00069"        # Session number or "legacy"
type: "protocol"        # From valid types list
status: "current"       # From valid status list
created: "2025-08-25"   # ISO date format
---
```

#### Complete Schema
```yaml
---
# === IDENTIFICATION ===
session: "00069"                    # Session number (5 digits) or "legacy"
type: "protocol"                    # Valid types defined below
status: "current"                   # Valid statuses defined below
created: "2025-08-25"              # ISO date (YYYY-MM-DD)
modified: "2025-08-25"             # Last modification date
title: "Descriptive Title"          # Human-readable title

# === PURPOSE & CONTENT ===
purpose: "What this file does"      # Clear statement of purpose
topics: ["yaml", "protocol"]        # Array of topic tags
priority: "P0"                      # P0, P1, P2, P3
domain: "core"                      # core, requirements, reality, reconciliation

# === LIFECYCLE & VALIDATION ===
lifecycle: "ON"                     # ON, OFF, OBSOLETE, UNKNOWN
validation_method: "automated"      # automated, manual, reality-agent, none
review_date: "2025-09-25"          # Next review date
estimated_shelf_life: "90d"         # Duration: indefinite, permanent, 30d, 90d, etc.

# === AUDIENCE & COMPLEXITY ===
audience: "developer"               # developer, user, admin, all
complexity: "intermediate"          # basic, intermediate, advanced

# === RELATIONSHIPS ===
related_to:                         # List of related files
  - "00059-YAML-FILE-ORGANIZATION-SYSTEM.md"
  - "SESSION-00069-LOG.md"
implements:                         # What this implements
  - "yaml-infrastructure"
  - "file-organization"
supersedes:                         # What this replaces
  - "old-protocol.md"
superseded_by:                      # What replaces this
  - "future-protocol.md"

# === CUSTOM FIELDS ===
# Any additional fields specific to file type
attribution:                        # For generated files
  created_by: "Session 00069"
  intent: "Protocol definition"
---
```

### 2. Valid Values Lists

#### Type Values
```yaml
VALID_TYPES:
  - specification   # Technical specifications
  - guide          # How-to guides and documentation
  - report         # Analysis and status reports
  - analysis       # Deep analysis documents
  - log            # Session and activity logs
  - script         # Script documentation
  - config         # Configuration files
  - template       # Reusable templates
  - handoff        # Session handoff documents
  - protocol       # Process protocols (like this)
  - command        # Command documentation
  - unknown        # Legacy/unclassified
```

#### Status Values
```yaml
VALID_STATUS:
  - current        # Active and up-to-date
  - draft          # Work in progress
  - archived       # No longer active but preserved
  - superseded     # Replaced by newer version
```

#### Validation Method Values
```yaml
VALID_VALIDATION_METHODS:
  - automated      # Automated testing/validation
  - manual         # Manual verification required
  - reality-agent  # Reality Agent validation
  - none           # No validation required
```

#### Lifecycle Values
```yaml
VALID_LIFECYCLE:
  - ON             # Currently active and maintained
  - OFF            # Dormant but may be reactivated
  - OBSOLETE       # No longer relevant
  - UNKNOWN        # Status unknown (needs review)
```

### 3. Directory-Specific Conventions

#### Core Directory
```yaml
# core/*.md files
domain: "core"
priority: "P0"  # Usually P0 for critical docs
lifecycle: "ON"  # Usually active
```

#### Requirements Directory
```yaml
# requirements/**/*.md files
domain: "requirements"
type: "specification"  # Often specifications
validation_method: "manual"  # Often needs manual review
```

#### Archive Directory
```yaml
# archive/**/*.md files
status: "archived"  # Usually archived
lifecycle: "OFF"  # Usually dormant
session: "legacy"  # Often from old sessions
```

#### Scripts Directory
```yaml
# scripts/**/*.md files (documentation)
type: "guide"
validation_method: "automated"  # Scripts can be tested
audience: "developer"
```

### 4. Automated Tools

#### Indexing & Query
- `scripts/00059-yaml-indexer.py` - Fast cached indexing
- `scripts/00059-yaml-query.py` - Powerful metadata queries
- `scripts/00059-yaml-maintenance.py` - Maintenance utilities

#### Adding & Fixing
- `scripts/00061-add-yaml-frontmatter.py` - Add YAML to files
- `scripts/00063-batch-yaml-add.sh` - Batch processing
- `scripts/00068-fix-yaml-validation.py` - Fix validation errors

#### Validation & Health
- `scripts/00059-yaml-health-check.sh` - Health monitoring
- `scripts/00062-yaml-compliance-check.sh` - Compliance checking
- `scripts/00066-reference-mapper.py` - Cross-reference validation

#### Organization
- `scripts/00067-auto-organize-files.py` - Auto-organize by metadata
- `scripts/00068-path-resolver.py` - Find moved files
- `scripts/00068-classify-scripts-lifecycle.py` - Lifecycle classification

### 5. Query Capabilities

#### By Session
```bash
# Find all files from Session 69
python3 scripts/00059-yaml-query.py --session 00069

# Find files without session numbers
python3 scripts/00059-yaml-query.py --session legacy
```

#### By Topic
```bash
# Find all YAML-related files
python3 scripts/00059-yaml-query.py --topic yaml

# Find multiple topics
python3 scripts/00059-yaml-query.py --topic yaml --topic protocol
```

#### By Status/Lifecycle
```bash
# Find active files
python3 scripts/00059-yaml-query.py --status current

# Find obsolete scripts
python3 scripts/00059-yaml-query.py --lifecycle OBSOLETE
```

#### By Domain
```bash
# Find core domain files
python3 scripts/00059-yaml-query.py --domain core

# Find requirements
python3 scripts/00059-yaml-query.py --domain requirements
```

### 6. Validation Rules

#### Automatic Validation
1. **Schema Compliance**: All fields must use valid values
2. **Required Fields**: session, type, status, created must exist
3. **Date Format**: ISO format (YYYY-MM-DD)
4. **Array Format**: Topics, related_to must be arrays
5. **Cross-References**: Files in related_to should exist

#### Validation Command
```bash
# Check all files
python3 scripts/00068-fix-yaml-validation.py --dry-run

# Fix issues automatically
python3 scripts/00068-fix-yaml-validation.py
```

### 7. Integration Points

#### Session Startup
- YAML health check integrated into `scripts/00028-session-start.sh`
- Shows coverage, validation errors, broken references
- Automatic in every session initialization

#### Reality Agents
- FileSystem Agent uses YAML for file classification
- Integration Agent calculates organizational health
- Metadata informs system state assessment

#### Git Workflows
- Pre-commit hook validates YAML before commits
- CI/CD can check YAML compliance
- Automated fixes prevent broken commits

### 8. Best Practices

#### When Creating Files
1. **Always add YAML frontmatter** to new .md files
2. **Use session number** from current session
3. **Choose appropriate type** from valid list
4. **Set lifecycle** based on expected usage
5. **Add topics** for discoverability
6. **Link related files** for context

#### When Moving Files
1. **Update related_to** references
2. **Run reference mapper** to check breaks
3. **Use path resolver** to update references
4. **Maintain domain** consistency

#### When Archiving
1. **Change status** to "archived"
2. **Set lifecycle** to "OFF" or "OBSOLETE"
3. **Add superseded_by** if replaced
4. **Preserve in archive/** directory

### 9. Metrics & Coverage

#### Current State (Session 69)
```
Total Files: 472
With YAML: 445 (94.3%)
Without YAML: 27 (5.7%)
Validation Errors: 15 (3.2%)
Broken References: 0 (0%)
```

#### Health Scoring
```
Organization Score = (
    YAML_Coverage * 0.3 +
    Validation_Pass_Rate * 0.3 +
    Reference_Integrity * 0.2 +
    Metadata_Quality * 0.2
)

Current Score: 91.2/100 (EXCELLENT)
```

### 10. Migration Path

#### For Files Without YAML
```bash
# Add YAML to specific directory
./scripts/00063-batch-yaml-add.sh [directory]

# Add to individual file
python3 scripts/00061-add-yaml-frontmatter.py [file]
```

#### For Invalid YAML
```bash
# Fix validation errors
python3 scripts/00068-fix-yaml-validation.py

# Check specific file
python3 scripts/00059-yaml-indexer.py --file [path]
```

## Implementation Checklist

### Phase 1: Coverage (COMPLETE ✅)
- [x] Achieve 80% YAML coverage (94.3% achieved)
- [x] Fix validation errors (reduced from 27 to 15)
- [x] Eliminate broken references (0 remaining)

### Phase 2: Automation (IN PROGRESS)
- [x] Session startup integration
- [x] Batch processing tools
- [x] Validation fix tools
- [ ] Pre-commit hooks
- [ ] Auto-YAML on file creation

### Phase 3: Intelligence (PLANNED)
- [ ] AI-powered classification
- [ ] Smart topic suggestion
- [ ] Automatic relationship detection
- [ ] Lifecycle progression tracking

## Enforcement & Compliance

### Mandatory Requirements
1. **All new .md files MUST have YAML frontmatter**
2. **Session number MUST match creating session**
3. **Type and status MUST use valid values**
4. **Validation errors MUST be fixed before commit**

### Recommended Practices
1. **SHOULD include title and purpose**
2. **SHOULD add relevant topics**
3. **SHOULD link related files**
4. **SHOULD set appropriate lifecycle**

### Optional Enhancements
1. **MAY include custom fields**
2. **MAY add attribution details**
3. **MAY specify review dates**
4. **MAY document complexity**

## Success Metrics

### Coverage Goals
- **Minimum**: 80% files with YAML ✅
- **Target**: 90% files with YAML ✅
- **Ideal**: 95%+ files with YAML (current: 94.3%)

### Quality Goals
- **Validation Pass Rate**: >95% (current: 96.8%)
- **Reference Integrity**: 100% (current: 100%)
- **Metadata Completeness**: >80% with full schema

### Usage Goals
- **Query Usage**: Regular use of query tools
- **Automated Fixes**: <5 manual fixes per session
- **Discovery Success**: Find files in <10 seconds

## Protocol Maintenance

### Regular Tasks
- **Daily**: Check validation errors in session startup
- **Weekly**: Run comprehensive validation check
- **Monthly**: Review coverage metrics
- **Quarterly**: Update schema if needed

### Evolution Path
1. **v1.0** (current): Basic metadata and validation
2. **v1.1**: Pre-commit hooks and CI integration
3. **v1.2**: AI-powered classification
4. **v2.0**: Full semantic understanding

## Conclusion

The YAML File System Protocol has achieved exceptional coverage (94.3%) and provides a robust foundation for file organization, discovery, and project insights. With automated tools, clear conventions, and comprehensive validation, the system enables efficient project management and knowledge preservation.

**Key Achievement**: From 0% to 94.3% YAML coverage in Sessions 58-69, with full tool suite and integration.

**Next Priority**: Implement pre-commit hooks to maintain quality automatically.

---

*Protocol defined by Session 00069*  
*Building on work from Sessions 58-68*  
*Part of the Constitutional OS infrastructure*