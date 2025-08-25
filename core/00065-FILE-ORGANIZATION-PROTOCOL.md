---
session: "00065"
type: "specification"
status: "current"
created: "2025-08-25"
title: "File System Auto-Organization Protocol"
purpose: "Define automatic file placement and organization based on YAML metadata"
topics: ["file-organization", "yaml", "automation", "protocol"]
priority: "P0"
domain: "core"
audience: "developer"
complexity: "intermediate"
validation_method: "automated"
review_date: "2025-09-25"
estimated_shelf_life: "indefinite"
related_to: ["PROJECT-STRUCTURE.md", "SYSTEM-INDEX.md", "00061-YAML-INDEXING-REQUIREMENTS.md"]
implements: ["file-organization-automation"]
---

# File System Auto-Organization Protocol v1.0

**Session**: 00065  
**Created**: 2025-08-25  
**Status**: Active  
**Purpose**: Establish automatic file placement rules based on YAML metadata

## Executive Summary

This protocol establishes a systematic approach to automatically organize files based on their YAML frontmatter metadata. Files will be placed in appropriate directories based on their `type`, `domain`, and `session` fields, with fallback rules for unclassified files.

## Current State Analysis

### File Distribution (As of Session 65)
- **archive/sessions**: 159 files (logs, handoffs)
- **archive/session-deliverables**: 56 files (by phase)
- **docs**: 6 session-prefixed files
- **migrations**: 11 session files
- **reconciliation**: 23 session files
- **root**: 6 critical files (constitutional guides, masterplans)
- **Total**: ~280 session-prefixed files across project

### Key Findings
1. Session logs and handoffs are well-organized in `archive/sessions/`
2. Session deliverables are split by phase in `archive/session-deliverables/`
3. Many files created in root that should be organized elsewhere
4. No consistent rule for non-log/handoff file placement

## Auto-Organization Rules

### Core Principle
Every session deliverable maintains its session prefix (`00XXX-`) for tracking and attribution, but lives in its functional domain directory for active use.

### Primary Classification Rules

#### 1. Session Logs and Handoffs
```yaml
type: "log" | "handoff"
session: "XXXXX"
```
**Location**: `archive/sessions/SESSION-{session}-{TYPE}.md`
- These are historical records, not active work
- Always go to archive regardless of domain

#### 2. Domain-Based Organization (All Other Session Work)
Based on `domain` field in YAML frontmatter:

| Domain | Location | Description |
|--------|----------|-------------|
| `core` | `core/` | System infrastructure, protocols, critical guides |
| `reality` | `reality/` | Reality agents, monitoring, truth verification |
| `requirements` | `requirements/` | User stories, specifications, acceptance criteria |
| `reconciliation` | `reconciliation/` | Integration, coordination, gap analysis |

**File naming**: `{session}-{descriptive-name}.{ext}`
- Always maintain session prefix for tracking
- Examples:
  - `core/00065-FILE-ORGANIZATION-PROTOCOL.md`
  - `reality/00065-agent-enhancement-spec.md`
  - `requirements/00065-user-story-update.md`

#### 3. Uncertain Classification
```yaml
domain: null | undefined | missing
```
**Location**: `pending/`
- Files that cannot be automatically classified
- Require human review to determine domain
- Generate report of pending files for review

### Subdirectory Organization

Within each domain directory, organize by type:

```
core/
├── protocols/          # System protocols and procedures
├── specifications/     # Technical specifications
├── guides/            # How-to guides and documentation
└── {session}-*.md     # Active session deliverables

reality/
├── agents/            # Reality agent implementations
├── reports/           # Reality check reports
├── specifications/    # Agent specifications
└── {session}-*.md     # Active session deliverables

requirements/
├── user-stories/      # User story documents
├── specifications/    # Requirement specs
├── masterplans/       # Strategic plans
└── {session}-*.md     # Active session deliverables

reconciliation/
├── gap-analysis/      # Gap identification documents
├── integration/       # Integration plans
├── coordination/      # Cross-domain coordination
└── {session}-*.md     # Active session deliverables
```

### Special Cases

#### Root Directory Files
Only these files remain in root (no session prefix required):
- `CLAUDE.md` - Session protocol
- `PROJECT-STRUCTURE.md` - Directory map
- `SYSTEM-INDEX.md` - System registry
- Active masterplans (e.g., `RESTORATION-MASTERPLAN-V3.md`)

#### Scripts Directory
```yaml
type: "script"
```
**Location**: `scripts/{session}-{name}.{ext}`
- All scripts maintain session prefix
- Organized by function within scripts/

#### Templates Directory
```yaml
type: "template"
```
**Location**: `templates/{session}-{name}.md`
- Reusable templates for various purposes

### Fallback Rules (No YAML)

For files without YAML frontmatter:

1. **Check filename patterns**:
   - `SESSION-*-LOG.md` → `archive/sessions/`
   - `SESSION-*-HANDOFF.md` → `archive/sessions/`
   - `00XXX-*.md` → `pending/` (needs classification)

2. **Check content patterns**:
   - Contains "Reality Agent" → `reality/`
   - Contains "User Story" → `requirements/`
   - Contains "Protocol" → `core/protocols/`

3. **Default**: → `pending/`

### Migration from Current State

#### Phase 1: Archive Cleanup
Move from `archive/session-deliverables/` to domain directories:
- Analyze YAML domain field
- Move to appropriate domain directory
- Maintain session prefix

#### Phase 2: Root Cleanup
Files currently in root with session prefixes:
- `00031-CONSTITUTIONAL-OS-GUIDE.md` → `core/00031-CONSTITUTIONAL-OS-GUIDE.md`
- `00031-WORKFLOW-BOUNDARIES.md` → `core/00031-WORKFLOW-BOUNDARIES.md`
- `00042-TRUTH-SEED-ADOPTION-DECISION.md` → `core/00042-TRUTH-SEED-ADOPTION-DECISION.md`

#### Phase 3: Scattered Files
Collect session-prefixed files from various locations and organize by domain.

## Decision Flow Diagram

```
New File Created
    │
    ├─> Has session prefix (00XXX-)?
    │     │
    │     ├─> YES: Continue
    │     └─> NO: Add session prefix first
    │
    ├─> Is it a LOG or HANDOFF?
    │     │
    │     ├─> YES: → archive/sessions/
    │     └─> NO: Continue
    │
    ├─> Has YAML frontmatter?
    │     │
    │     ├─> YES: Check domain field
    │     │     │
    │     │     ├─> domain: "core" → core/
    │     │     ├─> domain: "reality" → reality/
    │     │     ├─> domain: "requirements" → requirements/
    │     │     ├─> domain: "reconciliation" → reconciliation/
    │     │     └─> domain: missing/unknown → pending/
    │     │
    │     └─> NO: → pending/ (needs YAML added)
    │
    └─> File placed and indexes updated
```

## Implementation Strategy

### Phase 1: Detection and Analysis (Session 65)
- [x] Analyze current file distribution
- [x] Design classification rules
- [ ] Build file scanner tool
- [ ] Generate organization report

### Phase 2: Tool Development (Session 65)
- [ ] Create `scripts/00065-auto-organize-files.py`
- [ ] Add dry-run mode for safety
- [ ] Include YAML validation
- [ ] Generate movement manifest

### Phase 3: Integration (Session 66+)
- [ ] Hook into file creation workflows
- [ ] Update session scripts to use protocol
- [ ] Create monitoring dashboard
- [ ] Document in PROJECT-STRUCTURE.md

## File Creation Workflow

### New File Creation Process
```python
1. Create file with YAML frontmatter
2. Run auto-organization tool
3. Tool determines target location
4. Move file to appropriate directory
5. Update relevant INDEX files
6. Commit with organization metadata
```

### Automated Hooks
- Post-session cleanup
- Pre-commit organization check
- Weekly organization audit

## Directory Structure Updates

### Simplified Domain-Based Structure
```
edl-platform-v6/
├── archive/
│   └── sessions/            # ONLY logs and handoffs
├── pending/                 # Files awaiting domain classification
├── core/                    # Core system work (protocols, guides, infrastructure)
│   ├── protocols/
│   ├── specifications/
│   ├── guides/
│   └── 00XXX-*.md          # Active session deliverables
├── reality/                 # Reality domain work
│   ├── agents/
│   ├── reports/
│   ├── specifications/
│   └── 00XXX-*.md          # Active session deliverables
├── requirements/            # Requirements domain work
│   ├── user-stories/
│   ├── specifications/
│   ├── masterplans/
│   └── 00XXX-*.md          # Active session deliverables
├── reconciliation/          # Reconciliation domain work
│   ├── gap-analysis/
│   ├── integration/
│   ├── coordination/
│   └── 00XXX-*.md          # Active session deliverables
├── scripts/                 # All scripts (maintain session prefix)
├── templates/               # Reusable templates
└── [Root files]            # ONLY critical system files (no session prefix)
```

### Key Changes from Current State
1. **Remove** `archive/session-deliverables/` - move contents to domain directories
2. **Create** `pending/` for uncertain files
3. **Create** `core/` for core domain work (currently scattered)
4. **Maintain** session prefixes on ALL deliverables for tracking
5. **Clean** root directory - only critical system files

## Validation Rules

### YAML Requirements
- `session`: Required (5-digit or "legacy"/"multiple")
- `type`: Required (from allowed set)
- `domain`: Required (core/reality/requirements/reconciliation)
- `created`: Required (YYYY-MM-DD format)
- `title`: Required (descriptive)
- `purpose`: Required (clear intent)

### File Naming Conventions
- Session files: `{session}-{description}.{ext}`
- Logs: `SESSION-{session}-LOG.md`
- Handoffs: `SESSION-{session}-HANDOFF.md`
- Deliverables: `{session}-{TITLE-KEBAB-CASE}.md`

## Success Metrics

### Immediate (Session 65)
- [x] Protocol documented and refined with user
- [ ] Tool prototype functional
- [ ] Demonstrate organization on 5+ existing files

### Short-term (Sessions 66-70)
- [ ] All 56 files from `archive/session-deliverables/` reorganized by domain
- [ ] Root directory cleaned (move session-prefixed files to domains)
- [ ] 90% of new files auto-organized to correct domain
- [ ] Zero files in `pending/` after review

### Long-term (Sessions 71-100)
- [ ] Fully automated organization on file creation
- [ ] All session work organized by domain
- [ ] Session tracking via prefix maintained
- [ ] Zero manual intervention needed

## Exception Handling

### Special Cases
1. **Multi-session files**: Use `session: "multiple"`
2. **Legacy files**: Use `session: "legacy"`
3. **External imports**: Place in `external/` with source metadata
4. **Binary files**: Keep in appropriate `assets/` subdirectory

### Conflict Resolution
1. YAML metadata takes precedence
2. Filename patterns as fallback
3. Human review for ambiguous cases
4. Update protocol based on edge cases

## Tool Specifications

### Core Tool: `scripts/00065-auto-organize-files.py`

**Features**:
- Scan for files with/without YAML
- Determine target locations
- Generate movement manifest
- Execute moves (with dry-run)
- Update INDEX files
- Report unclassified files

**Commands**:
```bash
# Analyze current state
python3 scripts/00065-auto-organize-files.py --analyze

# Dry run (show what would move)
python3 scripts/00065-auto-organize-files.py --dry-run

# Execute organization
python3 scripts/00065-auto-organize-files.py --execute

# Watch mode (auto-organize new files)
python3 scripts/00065-auto-organize-files.py --watch
```

## Integration Points

### Session Scripts
- `create-session-log.sh`: Auto-place in archive/sessions/
- `generate-handoff.sh`: Auto-place in archive/sessions/
- Session close: Run auto-organization

### Git Hooks
- Pre-commit: Check file organization
- Post-commit: Update organization metrics

### CI/CD Pipeline
- Validate file placement
- Enforce YAML requirements
- Generate organization reports

## Migration Plan

### Existing Files
1. Files with proper YAML: Auto-organize
2. Files with session prefixes: Semi-auto with review
3. Legacy files: Manual classification over time

### Transition Period
- Keep backups of original locations
- Generate redirect map for moved files
- Update all internal references

## Examples

### Example 1: Creating a new protocol
```yaml
---
session: "00065"
type: "specification"
domain: "core"
---
```
**File**: `00065-NEW-PROTOCOL.md`
**Placement**: `core/00065-NEW-PROTOCOL.md` (or `core/protocols/` if organizing by type)

### Example 2: Reality agent report
```yaml
---
session: "00065"
type: "report"
domain: "reality"
---
```
**File**: `00065-agent-health-report.md`
**Placement**: `reality/00065-agent-health-report.md`

### Example 3: Session log
```yaml
---
session: "00065"
type: "log"
domain: "core"
---
```
**File**: `SESSION-00065-LOG.md`
**Placement**: `archive/sessions/SESSION-00065-LOG.md` (domain ignored for logs)

### Example 4: Missing domain
```yaml
---
session: "00065"
type: "analysis"
# domain field missing!
---
```
**File**: `00065-gap-analysis.md`
**Placement**: `pending/00065-gap-analysis.md` (needs human review)

### Example 5: Multi-domain work
```yaml
---
session: "00065"
type: "specification"
domain: "reconciliation"  # Bridges multiple domains
---
```
**File**: `00065-integration-spec.md`
**Placement**: `reconciliation/00065-integration-spec.md`

## Appendix: YAML Type Values

### Allowed Types
- `specification`: Technical specifications
- `guide`: How-to guides and tutorials
- `report`: Analysis and status reports
- `analysis`: Deep dive investigations
- `log`: Session logs
- `script`: Executable scripts
- `config`: Configuration files
- `template`: Reusable templates
- `handoff`: Session handoff documents
- `architecture`: System design documents

### Allowed Domains
- `core`: System infrastructure
- `reality`: Reality agents and monitoring
- `requirements`: User stories and specs
- `reconciliation`: Integration and coordination

---

*File Organization Protocol v1.0 - Bringing order to innovation*