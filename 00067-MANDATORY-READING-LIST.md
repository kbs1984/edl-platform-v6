---
session: "00066"
type: "guide"
status: "current"
created: "2025-08-25"
title: "Session 00067 Mandatory Reading List"
purpose: "Ensure Session 67 has complete context before building auto-organization tool"
topics: ["reading-list", "context", "preparation", "session-handoff"]
priority: "P0"
domain: "core"
lifecycle: "ON"
related_to: ["SESSION-00066-HANDOFF.md", "00065-FILE-ORGANIZATION-PROTOCOL.md"]
---

# SESSION 00067 MANDATORY READING LIST

**STOP! Read these documents IN ORDER before doing ANY work.**

## 1. Understanding the Journey (Why We're Here)

### Session 65's Original Vision
**File**: `00065-FILE-ORGANIZATION-PROTOCOL.md` (now in `core/`)
- The complete protocol for file organization
- Decision flow diagram
- Domain-based structure
- **Key insight**: Simple domain-based approach, not complex subdomain system

### Desktop's Critical Intervention  
**File**: `00065-DESKTOP-INTEGRATION-RESPONSE.md`
- 7 critical risks that would have caused disaster
- Why 73% of references would break
- The Observer Effect problem
- Performance considerations
- **Key insight**: Infrastructure MUST come before reorganization

### Lifecycle Management Concept
**File**: `00065-LIFECYCLE-ADDENDUM.md`
- ON/OFF/OBSOLETE classification
- Why lifecycle matters for organization
- Automation possibilities
- **Key insight**: Files have lifecycles, not just locations

## 2. Understanding What Was Built (Session 66's Safety Net)

### The Safety Infrastructure
**File**: `archive/sessions/SESSION-00066-LOG.md`
- Complete record of pivot from disaster to safety
- Tools built and why
- Current metrics and readiness
- **Key insight**: We're at 89% readiness, safe to proceed

### How to Use the Tools
Read the actual tool files (they have comprehensive docstrings):
1. `scripts/00066-reference-mapper.py` - Prevents breaking references
2. `scripts/00066-create-rollback.py` - Makes everything reversible
3. `scripts/00066-migration-readiness.py` - Blocks unsafe operations
4. `scripts/00066-quick-reference-scan.py` - Performance optimization

## 3. Understanding Current Structure

### Project Organization
**File**: `PROJECT-STRUCTURE.md`
- Current directory structure (outdated from Session 16 but useful)
- Where things currently are
- **Key insight**: Structure is outdated, that's why we're reorganizing

### What Needs Moving
**Check these locations**:
```bash
# See what's in session-deliverables
ls -la archive/session-deliverables/phase-*/*.md | head -20

# See what's in root that shouldn't be
ls 000*.md 000*.sql

# Check scripts directory for obsolete files
ls scripts/000[4-5][0-9]-*.py

# Verify core directory exists
ls -la core/
```

## 4. Critical Commands to Run BEFORE Starting

### Verify System State
```bash
# 1. Check migration readiness (MUST be >= 80%)
python3 scripts/00066-migration-readiness.py --check

# 2. Verify rollback capability
python3 scripts/00066-create-rollback.py --verify

# 3. Check reference map exists
ls -la reference-map-00066.json

# 4. Confirm on backup branch
git branch --show-current
# Should show: pre-reorg-backup-session-66
```

### Understand the Data
```bash
# See what YAML domains exist in targets
grep "^domain:" archive/session-deliverables/phase-1/*.md

# Check for pending directory
ls -la pending/ 2>/dev/null || echo "Pending directory doesn't exist yet"

# Count files needing organization
find archive/session-deliverables -name "*.md" | wc -l
```

## 5. Key Principles to Remember

### From Desktop's Analysis
1. **Always dry-run first** - Never execute without testing
2. **Start with 1 file** - Then 5, then 20, then batch
3. **Check references** - Use the mapper before moving
4. **Record everything** - Every move goes in rollback manifest
5. **Maintain git history** - Always use `git mv`, never just `mv`

### From Session 66's Experience  
1. **Infrastructure before reorganization**
2. **Safety before speed**
3. **The 80% rule works** - Don't bypass readiness checks
4. **Small victories** - One successful move proves the system

## 6. Decision Context You Need

### Already Decided
- ✅ Domain-based organization (not complex subdomain)
- ✅ Session prefixes stay on all files
- ✅ Safety infrastructure required
- ✅ Dry-run by default

### You Need to Decide
1. **Add lifecycle during move?** Or separate pass?
2. **Batch size?** Suggest 10 files per transaction
3. **Scripts handling?** Archive obsolete or leave in place?
4. **Create pending/ now?** Or only when needed?
5. **Update references immediately?** Or batch at end?

## 7. Your First Actions (In Order)

```bash
# 1. Confirm you've read everything
echo "I have read all mandatory documents"

# 2. Check system is ready
python3 scripts/00066-migration-readiness.py --check

# 3. Review what needs organizing
ls archive/session-deliverables/phase-1/*.md

# 4. Check one file's YAML
head -20 archive/session-deliverables/phase-1/00021-system-understanding-report.md

# 5. Only THEN start building the tool
touch scripts/00067-auto-organize-files.py
```

## Quick Reference Card

### Import These Tools
```python
from pathlib import Path
import yaml
import subprocess
import sys
sys.path.append('scripts')

from 00066_reference_mapper import ReferenceMapper
from 00066_create_rollback import RollbackManager  
from 00066_migration_readiness import MigrationReadinessScorer
```

### Safety Check Pattern
```python
# ALWAYS do this before operations
scorer = MigrationReadinessScorer()
readiness = scorer.calculate_migration_readiness()
if readiness['overall'] < 80:
    raise Exception(f"Not ready: {readiness['overall']}%")
```

### Move Pattern
```python
# ALWAYS record moves
rollback = RollbackManager()
mapper = ReferenceMapper()

# Simulate first
affected = mapper.simulate_move(old_path, new_path)
print(f"Would affect {affected['affected_count']} files")

# If safe, execute
subprocess.run(['git', 'mv', old_path, new_path])
rollback.record_move(old_path, new_path, affected['affected_files'])
```

## The Bottom Line

Session 66 built the safety net because Desktop warned us we were about to break everything. That safety net is now complete and tested. Your job is to build the auto-organization tool ON TOP of that safety net, not around it or instead of it.

Read the documents, understand the journey, use the tools, and the dangerous reorganization becomes safe and systematic.

---

*If you skip this reading list, you're likely to repeat the mistakes Desktop saved us from.*