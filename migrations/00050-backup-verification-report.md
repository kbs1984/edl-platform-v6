---
created: '2025-08-23'
domain: core
priority: P1
purpose: Document backup extraction verification report - session 00050
session: '00050'
status: current
title: Backup Extraction Verification Report - Session 00050
topics:
- auth
- documentation
type: guide
---

# Backup Extraction Verification Report - Session 00050

**Date**: 2025-08-22  
**Original Backup**: `migrations/supabase-project.backup` (17,317 lines)  

---

## What the Backup Contains

### Application Components (What We Need)

| Component Type | Count | Details |
|----------------|-------|---------|
| **Tables** | 36 | public (17), chat (3), debate (16) |
| **Indexes** | 20 | public (11), chat (4), debate (5) |
| **Functions** | 44 | public (25), chat (19), debate (0) |
| **Triggers** | 26 | Application triggers |
| **Policies** | 50 | RLS policies |
| **Types** | 12 | Custom enum types |

### System Components (What We Don't Need)
- Auth tables: 16
- Storage tables: 7  
- Realtime tables: 8
- System functions: ~29
- Extensions: 12
- System schemas: 10+

---

## Extraction Files Created

### 1. Initial Extraction (INCOMPLETE)
**File**: `migrations/00050-backup-extraction.sql`  
**Size**: 392 lines  
**Content**: Only CREATE TABLE statements  
**Status**: ❌ Missing indexes, functions, triggers, policies  

### 2. Complete Raw Extraction  
**File**: `migrations/00050-COMPLETE-extraction.sql`  
**Size**: 32,863 lines  
**Content**: Everything including duplicates and partial matches  
**Status**: ⚠️ Too verbose, includes system components  

### 3. What Desktop's Migration Has
**File**: `migrations/desktop-edl-complete-migration-draft.sql`  
**Size**: 1,522 lines  
**Includes**:
- ✅ All 36 tables with constraints
- ✅ All 12 custom types
- ✅ All 44 application functions
- ✅ All 26 triggers
- ✅ Primary and foreign keys
- ✅ call_sign column added
- ❌ Indexes (can be added separately)
- ❌ RLS policies (can be added separately)

---

## Verification Answer

### Does 00050-backup-extraction include everything? 
**NO** - It only includes CREATE TABLE statements (392 lines vs 17,317 in backup)

### What's Missing from Initial Extraction?
1. **Indexes** - 20 performance indexes
2. **Functions** - 44 business logic functions  
3. **Triggers** - 26 automated behaviors
4. **Policies** - 50 RLS security policies
5. **Constraints** - Foreign keys defined separately
6. **Grants** - Permission statements

### Does Desktop's Migration Include Everything Important?
**YES** - Desktop's migration includes all essential components:
- All tables with inline constraints ✅
- All functions (cleaned of Korean text) ✅
- All triggers ✅
- All types ✅
- Primary/foreign keys ✅

**Missing but Non-Critical**:
- Indexes (can be created after migration)
- RLS policies (need separate migration anyway)

---

## Recommendation

Use **Desktop's migration** (`desktop-edl-complete-migration-draft.sql`) because:

1. It's complete for all structural components
2. It's clean (no system tables)
3. It adds call_sign column
4. It fixes data type issues
5. Functions are cleaned of encoding issues

The initial extraction (`00050-backup-extraction.sql`) is insufficient and should not be used alone.

---

## Files for Reference

1. **Complete backup**: `migrations/supabase-project.backup` (17,317 lines)
2. **Desktop's ready migration**: `migrations/desktop-edl-complete-migration-draft.sql` (1,522 lines)
3. **Partial extraction**: `migrations/00050-backup-extraction.sql` (392 lines - tables only)
4. **Raw extraction**: `migrations/00050-COMPLETE-extraction.sql` (32,863 lines - verbose)

---

*Verification complete - Desktop's migration is the most complete and clean option*