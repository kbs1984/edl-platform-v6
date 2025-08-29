---
session: "00100"
type: "task-request"
status: "current"
created: "2025-08-27"
title: "Reality Files YAMLization Request for Session 99"
purpose: "Make reality files discoverable via YAML query system"
topics: ["yaml", "reality-files", "discoverability", "progress-tracking"]
priority: "P1"
domain: "core"
audience: "session-99"
complexity: "simple"
validation_method: "query-test"
review_date: "2025-09-27"
estimated_shelf_life: "session"
implements: ["dual-session-collaboration-protocol", "progress-tracking"]
related_to: ["REALITY-FILES-INDEX.md", "00100-DUAL-SESSION-COLLABORATION-PROTOCOL.md"]
assignee: "session-99"
blocks: ["future-reality-file-queries"]
---

# Reality Files YAMLization Request for Session 99

**Priority**: After UI flow testing is complete  
**Estimated Time**: 15-30 minutes  
**Impact**: Makes critical reality files discoverable via YAML queries

---

## 🎯 The Problem

Session 100 discovered that reality files contain the **most important progress documentation** but are **not discoverable** via YAML queries:

```bash
# This returns 0 results (but should find the reality files):
python3 scripts/00059-yaml-query.py --topic "migration-deployed"
python3 scripts/00059-yaml-query.py --topic "done-batch"
```

**Why This Matters**: Future sessions can't discover what's actually deployed in the database, leading to incorrect implementation plans.

---

## 🔧 What Needs YAMLization

### High Priority Files (Session 99 - please YAMLize these):

#### 1. Migration Deployment Files:
```bash
reality/done-batch-01-foundation.sql
reality/done-batch-02-types.sql  
reality/done-batch-03-tables.sql
reality/done-batch-04-constraints-fixed.sql
reality/done-batch-05-functions-complete.sql
reality/done-batch-06-triggers-fixed.sql
reality/done-batch-07-indexes.sql
reality/done-batch-08-rls-corrected.sql
```

#### 2. Current State Snapshots:
```bash
reality/00081-request-functions.md
reality/00081-request-triggers.md
```

**Note**: Some reality files already have YAML - keep those as-is.

---

## 📝 YAML Template for Session 99

### For Migration Files (done-batch-*.sql):
```yaml
---
session: "[original-session]"
type: "migration-deployed"
status: "applied"
created: "2025-08-27"
title: "Deployed Migration: [batch-name]"
purpose: "Applied database migration - [description]"
topics: ["database", "migration", "reality", "deployed"]
priority: "P0"
domain: "reality"
reality_type: "deployed-migration"
deployment_status: "production"
verified: true
database_components: ["functions", "triggers", "tables"]  # adjust per file
migration_batch: "[batch-number]"
---
```

### For Request/Snapshot Files (request-*.md):
```yaml
---
session: "00081"
type: "reality-snapshot"
status: "reference"
created: "2025-08-27"
title: "[Descriptive Title]"
purpose: "Document [current/source] state of [component]"
topics: ["database", "[component]", "reality", "snapshot"]
priority: "P0"
domain: "reality"
reality_type: "current-state"
source: "supabase-dashboard"
verified_date: "2025-08-27"
snapshot_of: ["functions", "triggers"]  # adjust per file
---
```

---

## 🚀 Implementation Steps for Session 99

### Step 1: Use the YAMLization Tool
```bash
# Add YAML to each file:
python3 scripts/00061-add-yaml-frontmatter.py reality/done-batch-01-foundation.sql
python3 scripts/00061-add-yaml-frontmatter.py reality/done-batch-02-types.sql
# ... continue for all files
```

### Step 2: Fill in Metadata
For each file, customize the YAML frontmatter:
- **session**: Original session that created it (check git log if needed)
- **title**: Descriptive name based on content
- **database_components**: What's actually in the file (tables, functions, triggers, etc.)
- **migration_batch**: Batch number from filename

### Step 3: Test Discoverability
```bash
# After YAMLization, test these queries should return results:
python3 scripts/00059-yaml-query.py --type "migration-deployed"
python3 scripts/00059-yaml-query.py --topic "reality"
python3 scripts/00059-yaml-query.py --reality_type "deployed-migration"
```

### Step 4: Verify Coverage
```bash
# Check what files still need YAML:
find reality/ -name "done-batch*" -o -name "*request*" | \
xargs -I {} python3 scripts/00068-fix-yaml-validation.py --check {}
```

---

## 🎯 Expected Outcome

After YAMLization, future sessions will be able to:

```bash
# Find all deployed migrations:
python3 scripts/00059-yaml-query.py --type "migration-deployed"

# Find current database state:
python3 scripts/00059-yaml-query.py --reality_type "current-state"

# Find specific deployment batches:
python3 scripts/00059-yaml-query.py --migration_batch "05"

# Find reality documentation:
python3 scripts/00059-yaml-query.py --domain "reality"
```

This prevents future sessions from making **Session 100's mistake** of assuming database incompleteness without checking reality files.

---

## 🚨 Why This is P1 Priority

### Current Impact:
- **Session 100** initially gave wrong guidance (apply SQL files already deployed)
- **Reality files invisible** to YAML discovery system
- **Future sessions** will repeat the same mistake

### After YAMLization:
- **Instant discovery** of deployed database state
- **Prevention** of duplicate migration attempts  
- **Accurate guidance** based on ground truth
- **Protocol compliance** with discoverability requirements

---

## 📋 Session 99 Checklist

- [ ] YAMLize all `done-batch-*.sql` files
- [ ] YAMLize `00081-request-*.md` files  
- [ ] Test YAML queries return reality files
- [ ] Verify metadata is accurate
- [ ] Run validation check on added YAML
- [ ] Update Session 100 on completion

**Estimated Time**: 15-30 minutes after UI flow testing  
**Difficulty**: Simple (using existing tools)  
**Impact**: High (prevents future guesswork)

---

This task ensures the **most critical progress documentation** becomes discoverable and prevents Sessions 101+ from falling into the same "database assumption" trap that initially affected Session 100's guidance.

**Session 99**: Please tackle this after completing the UI flow testing - it's a perfect follow-up task that will benefit all future sessions!