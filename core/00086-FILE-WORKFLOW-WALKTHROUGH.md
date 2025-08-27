---
session: "00086"
type: "guide"
status: "current"
created: "2025-08-27"
title: "Complete File Workflow Walkthrough - How Files Are Handled"
purpose: "Demonstrate how files flow through the Reality-First system"
topics: ["workflow", "file-handling", "yaml-metadata", "discovery"]
priority: "P0"
domain: "core"
---

# Complete File Workflow Walkthrough

## 🎯 How My Work from Session 86 Was Handled

Let me walk you through exactly how my files were created, placed, and can be retrieved:

### 1. Files I Created in Session 86

| File | Location | Domain | YAML? | Purpose |
|------|----------|--------|-------|---------|
| `00086-REALITY-FIRST-FILE-PROTOCOL.md` | `core/` | core | ✅ Yes | Protocol document |
| `00086-reorganize-files.py` | `scripts/` | core | ✅ Yes (added) | Tool |
| `00086-REORGANIZATION-REPORT.md` | `core/` | core | ✅ Yes | Report |
| `00086-fix-workflow-metadata.py` | `scripts/` | core | ✅ Yes (added) | Tool |
| `00086-WORKFLOW-COMPLIANCE-STRATEGY.md` | `core/` | core | ✅ Yes | Strategy |
| `00086-WORKFLOW-FIXES-APPLIED.md` | `core/` | core | ✅ Yes | Report |

### 2. Why Each File Went Where It Did

**Protocol files → `core/`**
```yaml
domain: "core"         # This determines location
type: "protocol"       # Infrastructure document
```
- The protocol defines system behavior, so it's infrastructure → `core/`

**Scripts → `scripts/`**
```yaml
domain: "core"         # Core infrastructure tool
type: "tool"           # Script type
lifecycle: "ON"        # Currently active
```
- All executable scripts go in `scripts/` regardless of domain
- The domain field indicates what domain they serve

**Reports → Based on domain context**
```yaml
domain: "core"         # About core infrastructure
type: "report"         # Documentation of work
```
- Reports go to the domain they're reporting about

## 🔄 Complete Reality-First Workflow Example

### Step 1: I Discover Something (Reality)

If I discovered the file organization problem:

```yaml
---
session: "00086"
type: "snapshot"
status: "current"
domain: "reality"      # ← Goes to reality/
reality_type: "filesystem"
---
# File Organization State Snapshot

Current state: 294 files in wrong locations...
```

**Location**: `reality/snapshots/filesystem/00086-file-organization-state.md`

### Step 2: I Define What's Needed (Requirements)

Based on that reality, I create requirements:

```yaml
---
session: "00086"
type: "specification"
domain: "requirements"  # ← Goes to requirements/
based_on: ["reality/snapshots/filesystem/00086-file-organization-state.md"]
priority: "P0"
---
# File Organization Requirements

System MUST have clear file placement rules...
```

**Location**: `requirements/specifications/SPEC-00086-FILE-ORGANIZATION.md`

### Step 3: I Implement Solution (Reconciliation)

To bridge the gap, I create implementation:

```yaml
---
session: "00086"
type: "implementation"
domain: "reconciliation"  # ← Goes to reconciliation/
implements: ["requirements/specifications/SPEC-00086-FILE-ORGANIZATION.md"]
deployment_status: "completed"
---
# File Reorganization Implementation

Created script to reorganize 294 files...
```

**Location**: `reconciliation/00086-file-reorganization-implementation.md`

## 📍 How to Find My Work

### Method 1: YAML Queries (Fastest - 0.15s)

```bash
# Find all my Session 86 work
python3 scripts/00059-yaml-query.py --session 00086

# Find all file organization work
python3 scripts/00059-yaml-query.py --topic file-organization

# Find all protocols I created
python3 scripts/00059-yaml-query.py --type protocol --session 00086

# Find what implements my protocol
python3 scripts/00059-yaml-query.py --implements "00086-REALITY-FIRST-FILE-PROTOCOL.md"
```

### Method 2: Direct Navigation (If you know the type)

- Protocols? → Check `core/`
- Scripts? → Check `scripts/00086-*.py`
- Reports? → Check domain directories for `00086-*REPORT*.md`

### Method 3: Session Log References

```bash
# My session log lists all deliverables
cat archive/sessions/SESSION-00086-LOG.md | grep "Created"
```

## 🎨 Real Example: How Session 86 Actually Worked

### What Actually Happened (Mixed Workflow)

In reality, Session 86 didn't follow pure Reality-First because we started with a handoff from Session 85 that already identified the problem. Here's what actually happened:

1. **Started with Requirements** (from handoff)
   - `SESSION-00086-HANDOFF.md` defined the need
   - Mission: Create file organization protocol

2. **Created Solution** (protocol)
   - `00086-REALITY-FIRST-FILE-PROTOCOL.md` → `core/`
   - Domain: core (infrastructure)

3. **Discovered Reality** (analysis)
   - `00086-reorganize-files.py` analyzed 21,000+ files
   - Found 294 files needing moves

4. **Implemented Fix** (reconciliation)
   - Script moved files
   - Reports documented results

### How It SHOULD Work Going Forward

1. **Reality First**
   ```bash
   # Capture current state
   echo "Current file chaos: 294 misplaced files" > reality/snapshots/00087-file-state.md
   ```

2. **Requirements from Reality**
   ```bash
   # Based on reality, define need
   echo "based_on: ['reality/snapshots/00087-file-state.md']" > requirements/00087-org-need.md
   ```

3. **Reconciliation Implements**
   ```bash
   # Solution references requirement
   echo "implements: ['requirements/00087-org-need.md']" > reconciliation/00087-fix.md
   ```

## 📊 YAML Metadata: The Key to Everything

### Every File Has Metadata

```yaml
---
# WHO created it
session: "00086"         # Session number

# WHAT it is
type: "protocol"         # document type
title: "Reality-First"   # human name

# WHERE it goes
domain: "core"           # ← DETERMINES LOCATION

# WHY it exists
purpose: "Define rules"  # reason for existence
implements: ["spec.md"]  # what it implements
based_on: ["reality.md"] # what it's based on

# WHEN it matters
created: "2025-08-27"    # creation date
status: "current"        # lifecycle state
---
```

### The Domain Field Determines Location

| Domain Value | Physical Location | Purpose |
|--------------|------------------|---------|
| `reality` | `reality/` | Captures what IS |
| `requirements` | `requirements/` | Defines what's NEEDED |
| `reconciliation` | `reconciliation/` | Bridges the gap |
| `core` | `core/` | Infrastructure |

**Special Cases**:
- `type: log` → Always `archive/sessions/`
- `type: script` → Always `scripts/`
- `type: handoff` → Always `archive/sessions/`

## 🔍 Discovery: How to Find Anything

### The Power of YAML Queries

```bash
# "What auth work exists?"
python3 scripts/00059-yaml-query.py --topic auth

# "What's incomplete?"
python3 scripts/00059-yaml-query.py --status incomplete

# "What did Session 85 do?"
python3 scripts/00059-yaml-query.py --session 00085

# "What implements the AUTH-MASTERPLAN?"
python3 scripts/00059-yaml-query.py --implements AUTH-MASTERPLAN.md

# "What fixes auth issues?"
python3 scripts/00059-yaml-query.py --fixes auth
```

### Query Performance
- Cache hit rate: 99.6%
- Average query time: 0.15 seconds
- Can search 1400+ files instantly

## ✅ Session 86 YAML Compliance

### Initially Missed
My Python scripts initially didn't have YAML metadata in docstrings.

### Fixed During Session
Added YAML to both scripts:
- ✅ `00086-reorganize-files.py` - Added YAML in docstring
- ✅ `00086-fix-workflow-metadata.py` - Added YAML in docstring

### Result
**100% of Session 86 deliverables now have YAML metadata**

## 🎯 Key Takeaways

1. **YAML is MANDATORY** - Every deliverable needs metadata
2. **Domain determines location** - The `domain` field decides where files go
3. **Session numbers track work** - All files start with `00086-`
4. **Queries find everything** - 0.15s to find any file by any criteria
5. **Workflow is enforced** - Reality → Requirements → Reconciliation

## 📚 How Future Sessions Will Work

### Session 87 Example

1. **Start with Reality Check**
   ```bash
   ./scripts/00028-session-start.sh 00087
   # Captures reality automatically
   ```

2. **Query Existing Work**
   ```bash
   python3 scripts/00059-yaml-query.py --topic [focus]
   # Find what already exists
   ```

3. **Create Files with Metadata**
   ```yaml
   ---
   session: "00087"
   domain: "reality"  # Start here
   type: "snapshot"
   ---
   ```

4. **Auto-organize if Needed**
   ```bash
   python3 scripts/00067-auto-organize-files.py --execute [file]
   # Moves file based on metadata
   ```

5. **Files Are Discoverable**
   - Anyone can query by session, topic, type, status
   - Cross-references link related work
   - Workflow is traceable

---

This is how the Reality-First workflow ensures every piece of work is properly captured, organized, and discoverable!