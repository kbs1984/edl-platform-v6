---
session: "00101"
type: "bug-report"
status: "current"
created: "2025-08-28"
title: "Truth-Seed Bugs Discovered During Integration Testing"
purpose: "Document bugs found in truth-seed source code that need fixing"
topics: ["truth-seed", "bugs", "onboarding", "integration"]
priority: "P0"
domain: "reconciliation"
---

# Truth-Seed Bugs Discovered - Session 101

**Critical Finding**: Truth-seed is not bug-free. It contains several blocking issues that prevent the onboarding flow from working.

---

## 🐛 Bugs Found in Truth-Seed

### Bug 1: File Constructor Browser Incompatibility
**File**: `src/components/onboarding-step-2-form.tsx`
**Line**: 52
**Issue**: Uses `new File()` which isn't available in all browsers
**Impact**: Step 2 crashes with "file is not defined"
**Fix Applied**: Remove File constructor, use image URL directly

### Bug 2: DialogClose Premature Closure
**File**: `src/components/onboarding/school-search.tsx`  
**Line**: 129
**Issue**: `DialogClose` wrapper closes dialog before async action completes
**Impact**: School registration fails silently
**Fix Applied**: Remove DialogClose wrapper from Register button

### Bug 3: RPC Call Syntax Error
**File**: `src/lib/actions/school-actions.ts`
**Line**: 7
**Issue**: `.rpc().select("*")` is invalid - RPC doesn't chain with select
**Impact**: School search throws error
**Fix Applied**: Remove `.select("*")` from RPC call

### Bug 4: Missing Image Validation
**File**: `src/components/onboarding-step-2-form.tsx`
**Line**: 133
**Issue**: Form requires imageFile even when user has existing image
**Impact**: Users with profile images can't proceed
**Fix Applied**: Make imageFile optional when image_path exists

---

## 📋 Database Issues (Not in Truth-Seed)

### Issue 1: School Table Missing RLS
**Impact**: search_school function gets permission denied
**Fix**: Add public read policy to school table
**Session 91**: Already has simplified search_school function

### Issue 2: Missing grade_level Column  
**Impact**: EDL customization incomplete
**Fix**: Added in Session 101

---

## 🎯 Implications

1. **Truth-seed is a starting point, not perfect code**
2. **Bugs exist in the source** and need fixing in active-work
3. **These aren't "ad hoc" fixes** - they're necessary corrections
4. **Future sessions** should check this document first

---

## ✅ Recommendation

Continue fixing bugs as found, but:
1. Document them here
2. Create fix scripts/patches
3. Don't assume truth-seed is correct
4. Test everything before claiming it works

---

**Bottom Line**: We're not deviating from truth-seed - we're fixing it to make it actually work.