---
created: '2025-08-27'
domain: reconciliation
fixes_needed:
- registerSchoolAction-return-value
- school-id-propagation
priority: P0
purpose: Complete the onboarding flow by fixing school registration ID return
related_to:
- SESSION-00087-LOG.md
- 00087-step-3-school-fix.md
session: 00088
status: draft
title: 'Session #00088 Handoff - Fix School Registration Final Step'
topics:
- onboarding
- school-registration
- step-3
- final-fix
type: handoff
---

# Session #00088 Handoff - Fix School Registration Final Step

**Date**: 2025-08-27  
**From**: Session 00087  
**To**: Session 00088  
**Priority**: P0 - User Blocking (Final Issue!)  
**Mission Type**: Bug Fix - School Registration

---

## 🏆 Session 87's Major Victory

**THE AUTH FLOW IS COMPLETELY FIXED!** After 37+ sessions, users can now:
- ✅ Sign up with automatic profile creation
- ✅ Log in without redirect loops
- ✅ Access the dashboard successfully
- ✅ Start the onboarding process

---

## 🎯 THE REMAINING ISSUE

**We're 95% complete!** The only remaining blocker:
- **Problem**: School registration in Step 3 doesn't set schoolId
- **Impact**: Users cannot complete onboarding
- **User Experience**: Click "Register New School" → Enter name → Register → schoolId not set → Can't complete

---

## 📊 Current Onboarding Status

### What's Working
- ✅ Step 1: User type selection
- ✅ Step 2: Profile information (name, username, gender, DOB, image)
- ✅ Step 3: School search displays correctly
- ✅ Step 3: "Register New School" dialog works
- ❌ Step 3: School registration doesn't return/set ID

### The Specific Problem
```javascript
// In school-search.tsx
const registerNewSchool = async () => {
  const res = await registerSchoolAction(newSchoolName);
  if (res && res.id) {  // <-- res.id is likely undefined
    setFormData(prev => ({
      ...prev,
      schoolId: res.id,  // <-- Never gets set
      schoolName: newSchoolName,
    }));
  }
}
```

---

## 🔍 Investigation Needed

### Check 1: What does registerSchoolAction return?
**File**: `truth-seed/emdash-dashboard-main/src/lib/actions/school-actions.ts`
- Look at the `registerSchoolAction` function
- Check what it returns after inserting the school
- It probably returns `{ error }` instead of `{ id, error }`

### Check 2: Database Insert
- Does the school actually get created in the database?
- Is there an ID being generated?
- Check the return statement of the function

### Likely Fix Pattern
```typescript
// PROBABLE CURRENT CODE
export const registerSchoolAction = async (name: string) => {
  const { error } = await supabase
    .from('school')
    .insert({ name });
  
  if (error) return null;
  return true;  // Or something without ID
}

// WHAT IT SHOULD BE
export const registerSchoolAction = async (name: string) => {
  const { data, error } = await supabase
    .from('school')
    .insert({ name })
    .select()  // Add select to get the created record
    .single();
  
  if (error) return null;
  return data;  // Returns the full school object with ID
}
```

---

## 📋 Success Criteria

1. [ ] User can register a new school
2. [ ] School ID is returned from registerSchoolAction
3. [ ] School ID is set in form data
4. [ ] User can complete Step 3
5. [ ] Full onboarding flow works end-to-end

---

## 🎯 Quick Test Path

1. Go to http://localhost:3003/onboarding/step-3
2. Type a school name that doesn't exist
3. Click "Register New School"
4. Enter school name and register
5. **Should**: Set schoolId and allow completion
6. **Currently**: Doesn't set schoolId, shows error

---

## 💡 Session 88 Game Plan

1. **First**: Check `registerSchoolAction` return value
2. **Fix**: Make it return the created school with ID
3. **Test**: Verify school registration sets ID
4. **Complete**: User finishes onboarding successfully
5. **Celebrate**: Full auth + onboarding working! 🎉

---

## 📚 Reference Files

- `truth-seed/emdash-dashboard-main/src/lib/actions/school-actions.ts` - The likely culprit
- `truth-seed/emdash-dashboard-main/src/components/onboarding/school-search.tsx` - Where ID should be set
- `scripts/00087-step-3-school-fix.md` - Previous fix attempts

---

## 🚨 Priority Note

This is the LAST BLOCKER for full onboarding flow. Once this is fixed:
- Auth works completely ✅
- Profile creation works ✅
- Onboarding works ✅
- Users can fully use the platform!

We're literally one return statement away from complete success!

---

**Mission**: Fix registerSchoolAction to return the school ID. That's it. We're that close! 🎯