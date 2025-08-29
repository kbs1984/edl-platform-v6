---
session: "00092"
type: "handoff"
status: "current"
created: "2025-08-27"
title: "Session #00092 Handoff - School Registration Button Fix Needed"
purpose: "Guide Session 93 to fix the Register button onClick issue"
topics: ["handoff", "school-registration", "button-onclick", "debugging"]
priority: "P0"
domain: "reconciliation"
fixes_attempted: ["dialogclose-race-condition", "school-name-display", "debouncing", "rls-permissions"]
issues_remaining: ["register-button-onclick", "rls-auth-context"]
---

# Session #00092 Handoff - School Registration Button Fix Needed

**Date**: 2025-08-27
**From**: Session 00092
**To**: Session 00093
**Priority**: P0 - Button onClick blocking entire school registration flow
**Mission Type**: Debug and fix button event handler

---

## 🚨 CRITICAL ISSUE - Register Button Won't Click

The school registration dialog opens, input works, button enables, but **clicking Register does nothing**.

### Current Symptoms
```
✅ Dialog opens
✅ Input field works
✅ Button enables when text entered
❌ Clicking Register button - NO RESPONSE
❌ No console logs from onClick
❌ No server action called
```

---

## 🎯 YOUR MISSION - Fix the Register Button

### The Exact Problem
In `/truth-seed/emdash-dashboard-main/src/components/onboarding/school-search.tsx`:

```javascript
// THIS BUTTON DOESN'T RESPOND TO CLICKS:
<Button
  type="button"
  variant={"primary"}
  onClick={() => {
    console.log("🔧 Frontend: Register button clicked, newSchoolName:", newSchoolName);
    registerNewSchool();
  }}
  disabled={!newSchoolName.trim()}
>
  Register
</Button>
```

### Evidence from Session 92
When user types "edl" in dialog and clicks Register:
- Console shows: `🔧 Frontend: Register button disabled? false newSchoolName: edl`
- Button is ENABLED
- But NO onClick log appears
- NO server action triggered

---

## 🔍 CRITICAL CONTEXT - Work in truth-seed NOT reconciliation!

**IMPORTANT**: The user is running `truth-seed/emdash-dashboard-main/`, NOT `reconciliation/active-work/dashboard/`

All fixes must be applied to:
- `/truth-seed/emdash-dashboard-main/src/components/onboarding/school-search.tsx`
- `/truth-seed/emdash-dashboard-main/src/lib/actions/school-actions.ts`

---

## 🧪 Debugging Strategy

### Test 1: Is ANY onClick working in the dialog?
```javascript
// Add this simple test above the Register button:
<div onClick={() => console.log("TEST: Div clicked!")} style={{cursor: 'pointer'}}>
  Click me to test
</div>
```

### Test 2: Is DialogClose interfering?
The dialog has both Register button and Cancel button with DialogClose. Try:
1. Remove DialogClose from Cancel button temporarily
2. Test if Register button works then

### Test 3: Is the button recreating on each render?
```javascript
// Add a ref to track if button is same instance:
const buttonRef = useRef(null);
// ... then on button:
<Button ref={buttonRef} onClick={() => {
  console.log("Button ref:", buttonRef.current);
  console.log("Click!");
}} ...>
```

### Test 4: Check event listeners in DevTools
1. Right-click the Register button in browser
2. Inspect Element
3. In DevTools, check Event Listeners tab
4. See what's attached to the button

---

## 📊 What Session 92 Already Fixed

### ✅ COMPLETED FIXES (Don't Redo These!)

1. **DialogClose Race Condition** - FIXED
   - Removed DialogClose from Register button
   - Added manual state management

2. **School Name Display** - FIXED
   - Added `setSchoolSearchQuery(newSchoolName)`
   - Name now shows in input after registration

3. **Search Debouncing** - FIXED
   - Added 300ms timeout to prevent spam
   - Reduces server calls

4. **Debugging Logs** - ADDED
   - Frontend state logs working
   - Server action logs ready (but not reached yet)

---

## 🚫 Anti-Guesswork Protocol

### DON'T:
- ❌ Change multiple things at once
- ❌ Assume what's wrong without testing
- ❌ Skip the simple tests (like Test 1 above)
- ❌ Work in reconciliation directory (use truth-seed!)

### DO:
- ✅ Test ONE hypothesis at a time
- ✅ Add console logs to verify each assumption
- ✅ Check browser DevTools Event Listeners
- ✅ Test if problem exists with a plain HTML button

---

## 🔧 Quick Reference

### Files to Edit
```bash
# Component with button issue:
/truth-seed/emdash-dashboard-main/src/components/onboarding/school-search.tsx

# Server action (working but not being reached):
/truth-seed/emdash-dashboard-main/src/lib/actions/school-actions.ts
```

### Current Dev Server
User is running from truth-seed:
- Auth: http://localhost:3000
- Dashboard: http://localhost:3001 or 3002

### To See Current Logs
Browser Console shows:
- `🔧 Frontend:` logs from component
- Terminal shows server-side logs (once button works)

---

## 💡 Most Likely Causes

Based on the symptoms:

1. **Event Propagation Issue** (60% likely)
   - Dialog or parent element stopping propagation
   - Try: `onClick={(e) => { e.stopPropagation(); console.log("clicked"); }}`

2. **Button Variant Issue** (20% likely)  
   - `variant="primary"` might have issues
   - Try: `variant="default"` or remove variant

3. **State Closure Issue** (15% likely)
   - The button might be using stale closure
   - Try: Move registerNewSchool call inline

4. **DialogFooter Issue** (5% likely)
   - DialogFooter might interfere with buttons
   - Try: Move button outside DialogFooter

---

## 🎯 Success Criteria

You'll know you've succeeded when:
1. Clicking Register button shows: `🔧 Frontend: Register button clicked, newSchoolName: [value]`
2. Server logs show: `registerSchoolAction called with: [schoolName]`
3. School gets registered (or at least attempts with RLS error)

---

## 📝 Session 92 Summary for Context

- Continued Session 91's work after API overload
- Found and fixed multiple issues (DialogClose, debouncing, display)
- Discovered user running truth-seed version, not reconciliation
- Copied fixes to correct directory
- Everything works EXCEPT button onClick

The button is SO close to working - it's enabled, styled correctly, but just won't fire onClick!

---

**Remember**: Test the simple things first. Sometimes it's just an event.stopPropagation() issue!