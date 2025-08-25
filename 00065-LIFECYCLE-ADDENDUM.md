---
session: "00065"
type: "specification"
status: "current"
created: "2025-08-25"
title: "File Lifecycle Management - Protocol Addendum"
purpose: "Define how YAML metadata drives file lifecycle and organization"
topics: ["lifecycle", "yaml", "file-organization", "automation"]
priority: "P0"
domain: "core"
lifecycle: "ON"
audience: "developer"
complexity: "intermediate"
validation_method: "automated"
review_date: "2025-08-26"
estimated_shelf_life: "indefinite"
related_to: ["00065-FILE-ORGANIZATION-PROTOCOL.md", "SESSION-00066-HANDOFF.md"]
implements: ["lifecycle-management"]
---

# File Lifecycle Management - Protocol Addendum

**Session**: 00065  
**Created**: 2025-08-25  
**Status**: Proposal for Session 66 Review  
**Purpose**: Leverage YAML metadata for intelligent file lifecycle management

## Executive Summary

This addendum extends the File Organization Protocol by introducing lifecycle management through YAML metadata. Files will be automatically organized not just by domain, but by their lifecycle status (ON/OFF/OBSOLETE), creating a self-organizing, self-cleaning file system.

## Core Concept: YAML-Driven Lifecycle

### New YAML Fields
```yaml
---
session: "00065"
type: "specification"
domain: "core"
lifecycle: "ON"                    # Required: ON | OFF | OBSOLETE
last_used: "2025-08-25"           # Auto-updated when file accessed
usage_count: 15                    # Auto-incremented on access
dependencies: ["00064-*.md"]       # Files that depend on this
superseded_by: null                # If OBSOLETE, what replaced it
obsolete_reason: null              # If OBSOLETE, why
reactivation_potential: null      # If OFF, when might we need it
---
```

## Lifecycle States

### ON - Active Work
```yaml
lifecycle: "ON"
last_used: "2025-08-25"    # Recent activity
usage_count: 15             # Frequently accessed
dependencies: ["00066-implementation.md", "scripts/auto-organize.py"]
```
**Characteristics**:
- Accessed within last 30 days
- Referenced by other ON files
- Part of current workflows
- High usage count

### OFF - Dormant but Valuable
```yaml
lifecycle: "OFF"
last_used: "2025-07-15"    # Not recent
usage_count: 3              # Low usage
reactivation_potential: "Useful for Phase B implementation"
```
**Characteristics**:
- Not accessed in 30-60 days
- No active dependencies
- Contains valuable patterns/ideas
- Marked for potential future use

### OBSOLETE - Historical Record
```yaml
lifecycle: "OBSOLETE"
last_used: "2025-06-01"
superseded_by: "00050-final-extraction.sh"
obsolete_reason: "Based on incorrect database assumptions from Session 44"
```
**Characteristics**:
- Not accessed in 60+ days
- Explicitly superseded
- Based on outdated assumptions
- Kept only for audit trail

## Automated Lifecycle Transitions

### Automatic State Changes
```python
def update_lifecycle(file):
    metadata = read_yaml(file)
    days_since_used = (today - metadata['last_used']).days
    
    if metadata['lifecycle'] == 'ON':
        if days_since_used > 30 and not has_active_dependencies(file):
            suggest_transition(file, 'OFF', 'No recent usage')
    
    elif metadata['lifecycle'] == 'OFF':
        if days_since_used > 90:
            suggest_transition(file, 'OBSOLETE', 'Extended dormancy')
        elif recently_accessed(file):
            suggest_transition(file, 'ON', 'Reactivated by usage')
    
    # OBSOLETE files never auto-transition back
```

### Manual Overrides
```yaml
lifecycle: "ON"
lifecycle_lock: true          # Prevent automatic transitions
lifecycle_lock_reason: "Critical infrastructure - always active"
```

## Directory Organization with Lifecycle

### Flat Structure (Initial)
```
core/
├── 00031-CONSTITUTIONAL-OS-GUIDE.md (ON)
├── 00042-TRUTH-SEED-ADOPTION.md (ON)
├── 00045-old-protocol.md (OFF)
├── 00044-failed-attempt.md (OBSOLETE)
```

### Lifecycle Subdirectories (As Needed)
```
core/
├── ON/                      # Active work (default view)
│   ├── 00031-CONSTITUTIONAL-OS-GUIDE.md
│   └── 00065-FILE-ORGANIZATION-PROTOCOL.md
├── OFF/                     # Hidden but accessible
│   └── 00045-interesting-pattern.md
└── OBSOLETE/                # Archived for history
    └── 00044-wrong-assumptions.md
```

## Implementation Strategy

### Phase 1: Metadata Addition (Session 66)
1. Add `lifecycle: "ON"` to all active files
2. Mark obvious OBSOLETE files (Sessions 44-55 confusion)
3. Default unmarked files to OFF for review

### Phase 2: Automation Tools (Session 66-67)
```python
# Pseudo-code for lifecycle manager
class LifecycleManager:
    def scan_files(self):
        # Check all files with YAML
        # Update last_used based on git history
        # Increment usage_count on access
        # Suggest transitions
    
    def organize_by_lifecycle(self, domain):
        # Move files to lifecycle subdirs
        # Update cross-references
        # Generate migration report
    
    def generate_lifecycle_report(self):
        # Show ON/OFF/OBSOLETE counts
        # List transition candidates
        # Identify broken dependencies
```

### Phase 3: Integration (Session 67+)
- Hook into file access to update usage metrics
- Weekly lifecycle review automation
- Dashboard showing lifecycle health

## Benefits of YAML-Driven Lifecycle

1. **Self-Organizing**: Files automatically migrate based on usage
2. **Self-Documenting**: YAML explains why files are OFF/OBSOLETE
3. **Dependency Aware**: Prevents breaking active systems
4. **Audit Trail**: Preserves history while reducing clutter
5. **Reactivation Ready**: OFF files can easily return to ON

## Questions for Session 66

1. **Subdirectory Approach**: Start flat or create ON/OFF/OBSOLETE subdirs immediately?
2. **Transition Triggers**: 30/60/90 day thresholds reasonable?
3. **Automation Level**: Full auto-transition or just suggestions?
4. **Scripts Directory**: Apply lifecycle to scripts/ first as test case?
5. **Usage Tracking**: Use git history or implement access hooks?

## Immediate Actions for Session 66

1. **Add lifecycle field** to protocol file:
   ```bash
   # This file itself
   lifecycle: "ON"  # We're actively implementing it
   ```

2. **Test on scripts directory** (highest technical debt):
   - Mark ON: Currently used scripts (00028-*, 00063-*)
   - Mark OFF: Might be useful (00031-*, 00036-*)
   - Mark OBSOLETE: Sessions 44-55 attempts

3. **Create lifecycle scanner**:
   ```python
   scripts/00066-lifecycle-scanner.py
   # Scan files, suggest lifecycle states
   # Generate report for human review
   ```

## Success Metrics

### Immediate (Session 66)
- [ ] Lifecycle field added to 20+ files
- [ ] Scripts directory classified (ON/OFF/OBSOLETE)
- [ ] Scanner tool created

### Short-term (Sessions 67-70)
- [ ] 90% of files have lifecycle metadata
- [ ] Automated transition suggestions working
- [ ] OBSOLETE files moved to subdirectories

### Long-term (Sessions 71-100)
- [ ] Self-maintaining file system
- [ ] Zero clutter in active directories
- [ ] Full lifecycle automation

## Example Lifecycle Transitions

### Example 1: Active Protocol
```yaml
# Day 1
lifecycle: "ON"
last_used: "2025-08-25"
usage_count: 1

# Day 45 (no usage)
lifecycle: "OFF"  # Auto-suggested
reactivation_potential: "May need for Phase B"

# Day 120
lifecycle: "OBSOLETE"  # Extended dormancy
superseded_by: "00090-new-protocol.md"
```

### Example 2: Failed Attempt
```yaml
# Created in Session 44
lifecycle: "ON"
domain: "reality"

# Session 50 discovers it's wrong
lifecycle: "OBSOLETE"
obsolete_reason: "Based on incorrect database schema"
superseded_by: "00050-correct-approach.md"
```

## Conclusion

By leveraging our YAML structure for lifecycle management, we create a living, breathing file system that:
- Keeps active work visible and accessible
- Preserves valuable dormant ideas
- Archives mistakes for learning
- Maintains itself over time

This approach solves the clutter problem while preserving our complete history and learning journey.

---

*Ready for Session 66 review and implementation*