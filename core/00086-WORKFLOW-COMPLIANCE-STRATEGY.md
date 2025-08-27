---
session: "00086"
type: "strategy"
status: "current"
created: "2025-08-27"
title: "Reality-First Workflow Compliance Strategy"
purpose: "Document strategy for fixing workflow metadata in existing files"
topics: ["workflow", "metadata", "reality-first", "compliance"]
priority: "P0"
domain: "core"
---

# Reality-First Workflow Compliance Strategy

## 📊 Current State Analysis

After reorganizing 295 files by domain, we discovered that **91 files (76% of analyzed)** don't follow the Reality-First workflow principles in their metadata.

### Issues Identified

#### 1. Reality Domain Issues (2 files)
**Problem**: Reality files have `implements` fields  
**Why it's wrong**: Reality captures what IS, not what it implements  
**Fix**: Remove `implements` field from these files

Example files:
- `00077-auth-verification-findings.md` - Has implements: ["AUTH-MASTERPLAN.md"]
- `00085-REALITY-FILES-ENHANCEMENT-SUMMARY.md` - Has implements: ["reality-enhancement"]

#### 2. Requirements Domain Issues (46 files)
**Problem**: Requirements don't reference reality with `based_on`  
**Why it's wrong**: Requirements should emerge FROM reality observations  
**Fix**: Add `based_on` field referencing relevant reality files

Example files:
- All P0/P1/P2 user story files lack reality references
- Specifications missing reality grounding
- These were created before Reality-First principle

#### 3. Reconciliation Domain Issues (43 files)
**Problem**: Reconciliation files don't have `implements` or `fixes`  
**Why it's wrong**: Reconciliation should bridge gap between reality and requirements  
**Fix**: Add `implements` or `fixes` field to show what they address

Example files:
- Migration files without `implements`
- Fix documents without `fixes` 
- Implementation work without requirement references

## 🔄 The Reality-First Workflow

### Correct Flow Pattern

```yaml
# 1. REALITY - What IS
---
domain: "reality"
type: "snapshot"
# NO implements or fixes
---

# 2. REQUIREMENTS - What's NEEDED
---
domain: "requirements"
type: "specification"
based_on: ["reality/snapshot-001.md"]  # ← References reality
# NO implements (requirements don't implement, they specify)
---

# 3. RECONCILIATION - How to BRIDGE
---
domain: "reconciliation"
type: "implementation"
implements: ["requirements/SPEC-001.md"]  # ← Implements requirements
fixes: ["issue-123"]  # ← Or fixes issues found in reality
---
```

## 🛠️ Fix Strategy

### Phase 1: Automatic Fixes (Safe)
These can be automatically applied:

1. **Remove fields from Reality files** (2 files)
   - Delete `implements` field
   - Delete `fixes` field if present

2. **Add placeholder references** (89 files)
   - Requirements: Add `based_on: ["reality/snapshot-{session}.md"]`
   - Reconciliation: Add `implements: ["requirement-to-be-specified"]`

### Phase 2: Manual Enrichment (Thoughtful)
After automatic fixes, manually update placeholders:

1. **Requirements files**: 
   - Find actual reality files they're based on
   - Update placeholder references with real files
   - Or create new reality snapshots if needed

2. **Reconciliation files**:
   - Identify what requirements they implement
   - Link to actual requirement files
   - Or document what issues they fix

## 📝 Implementation Plan

### Step 1: Apply Automatic Fixes
```bash
# Apply the fixes
python3 scripts/00086-fix-workflow-metadata.py --execute

# Result: 91 files will have corrected metadata structure
```

### Step 2: Commit Fixed Structure
```bash
git add -A
git commit -m "fix(session-86): Apply Reality-First workflow metadata fixes"
```

### Step 3: Create Tracking Document
Create a document listing all files with placeholder references that need manual updating.

### Step 4: Gradual Enhancement
As we work with files, replace placeholders with actual references:
- When reading a requirement, find its reality basis
- When reviewing reconciliation, link to requirements
- Document discoveries in reality domain

## 🎯 Benefits of Compliance

### 1. Traceability
- Can trace any implementation back to requirements
- Can trace requirements back to reality observations
- Full audit trail of WHY things exist

### 2. Discovery
- Query all files based on reality observations
- Find all requirements for a domain
- Locate all implementations of a requirement

### 3. Workflow Clarity
- Clear separation of concerns
- No mixed responsibilities
- Predictable file purposes

### 4. Quality Assurance
- Requirements grounded in reality
- Implementations address real needs
- No orphaned solutions

## ⚠️ Important Considerations

### For Legacy Files
Many files predate the Reality-First principle. They were created when:
- Requirements came from Canvas documents
- Reality agents didn't exist yet
- Workflow wasn't formalized

### Placeholder Strategy
Using placeholders like `["requirement-to-be-specified"]` is intentional:
- Maintains valid YAML structure
- Makes files queryable
- Highlights what needs attention
- Better than no references

### Progressive Enhancement
We don't need perfect references immediately:
1. Fix structure first (this session)
2. Add real references when touching files
3. Create missing reality snapshots as needed
4. Eventually achieve full compliance

## ✅ Success Metrics

After applying fixes:
- ✅ 100% of files have correct domain-appropriate fields
- ✅ No reality files claim to implement things
- ✅ All requirements have based_on field (even if placeholder)
- ✅ All reconciliation files have implements/fixes (even if placeholder)
- ⏳ Gradual replacement of placeholders with real references

## 🚀 Next Steps

1. **Execute the fix script** to correct metadata structure
2. **Create reality snapshots** for orphaned requirements
3. **Link reconciliation work** to actual requirements
4. **Document the lineage** as we discover it

The goal isn't perfection immediately, but establishing the correct structure so future work follows the Reality-First workflow naturally.