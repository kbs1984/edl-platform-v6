---
session: "169"
type: "revision-requirements"
status: "critical"
created: "2025-09-05T09:15:00.000Z"
title: "Session 169 Revision Requirements - Activity Runtime Components"
purpose: "Document specific revisions needed for workflow compliance and production readiness"
topics: ["activity-runtime", "workflow-violations", "import-fixes", "validation-requirements"]
priority: "P0"
domain: "reconciliation"
severity: "high"
estimated_hours: 2
---

# SESSION 169 REVISION REQUIREMENTS
## Critical Actions for Follow-up Session

**⚠️ IMPORTANT**: This session created 4 Activity Runtime components but violated several workflow requirements. This document provides exact steps for remediation.

---

## 1. WORKFLOW VIOLATIONS TO ADDRESS

### 🔴 Phase 4: Research Patterns (MISSING)
**Location**: Should have occurred before building each component
**Evidence**: No `mcp__brave-search__brave_web_search` calls in session log

**REQUIRED ACTIONS**:
```javascript
// For EACH component, research best practices:
mcp__brave-search__brave_web_search({
  query: "React session progress tracker component best practices 2025",
  count: 3
})

mcp__brave-search__brave_web_search({
  query: "Activity dashboard React TypeScript patterns",
  count: 3
})

mcp__brave-search__brave_web_search({
  query: "Team role selector UI component patterns",
  count: 3
})

mcp__brave-search__brave_web_search({
  query: "Quiz content management React components",
  count: 3
})
```

**Why This Matters**: Research prevents reinventing patterns and ensures we use current best practices.

---

### 🔴 Phase 6: Incremental Validation (VIOLATED)
**Location**: After EACH component creation
**Evidence**: Validation only attempted after ALL components

**REQUIRED ACTIONS**:
```bash
# After EACH component, run:
cd /home/b4sho/edl-projects-with-claude/edl-platform-v6/reconciliation/active-work/dashboard

# 1. Check TypeScript compilation for specific component
npx tsc --noEmit --skipLibCheck src/components/activities/session-progress.tsx

# 2. Check imports are valid
grep -n "import.*from" src/components/activities/session-progress.tsx

# 3. Run Reality Server validation
mcp__reality-server__orchestrate({
  critical_only: true,
  include_performance: true
})

# Repeat for EACH component before moving to next
```

**Why This Matters**: Catching errors early prevents compound problems.

---

### 🔴 Phase 7: Auto-PR Creation (NOT DONE)
**Location**: End of session
**Evidence**: No PR created

**REQUIRED ACTIONS**:
```bash
# From the dashboard directory:
cd /home/b4sho/edl-projects-with-claude/edl-platform-v6/reconciliation/active-work/dashboard

# Stage the new components
git add src/components/activities/session-progress.tsx
git add src/components/activities/activity-dashboard.tsx
git add src/components/activities/team-role-selector.tsx
git add src/components/activities/session-content.tsx

# Create auto-PR
python3 /home/b4sho/edl-projects-with-claude/edl-platform-v6/scripts/00136-auto-pr.py "Activity Runtime Components" 169
```

**Why This Matters**: PRs provide evidence and enable review.

---

## 2. IMPORT ERRORS TO FIX

### 🟡 Issue 1: SelectItem Import Error
**File**: `src/components/activities/activity-discovery.tsx`
**Line**: Import statement (around line 11)
**Error**: `'SelectItem' is not exported from '@/components/ui/select'`

**FIX REQUIRED**:
```typescript
// WRONG (current):
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// CORRECT (should be):
import { 
  Select, 
  SelectContent, 
  SelectItem,  // Verify this export exists in the select component
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';

// OR if SelectItem doesn't exist, check the actual export:
// Navigate to: src/components/ui/select.tsx
// Verify actual exports and update import
```

**Verification Steps**:
1. Check actual exports: `grep "export" src/components/ui/select.tsx`
2. Update import to match actual exports
3. Test: `npx tsc --noEmit src/components/activities/activity-discovery.tsx`

---

### 🟡 Issue 2: createClient Import Error  
**File**: `src/app/(user-pages)/activities/[id]/register/page.tsx`
**Line**: 2
**Error**: `Module '"@/utils/supabase/server"' has no exported member 'createClient'`

**FIX REQUIRED**:
```typescript
// WRONG (current):
import { createClient } from "@/utils/supabase/server";

// INVESTIGATE first:
// 1. Check what's actually exported from server utils
grep -n "export" src/utils/supabase/server.ts

// LIKELY CORRECT (based on pattern):
import { createServerClient } from "@/utils/supabase/server";
// OR
import { createClient } from "@/utils/supabase/client";  // for client components
```

**Why**: Server components need different Supabase client initialization than client components.

---

## 3. MISSING CONFIGURATION

### 🟡 Missing npm Scripts
**File**: `package.json`
**Issue**: No `type-check` script

**ADD TO package.json**:
```json
{
  "scripts": {
    "type-check": "tsc --noEmit --skipLibCheck",
    "lint": "next lint",
    "lint:fix": "next lint --fix"
  }
}
```

**Then run**:
```bash
npm run type-check
# Should complete without errors for new components
```

---

### 🟡 ESLint Configuration Issue
**Error**: `Failed to load config "next/core-web-vitals"`

**FIX REQUIRED**:
```bash
# Install missing ESLint config
npm install --save-dev eslint-config-next

# Verify .eslintrc.json has:
{
  "extends": ["next/core-web-vitals"]
}
```

---

## 4. VALIDATION REQUIREMENTS

### Component Integration Tests Needed

**Create test file**: `src/components/activities/__tests__/integration.test.tsx`

```typescript
import { render, screen, waitFor } from '@testing-library/react';
import { SessionProgress } from '../session-progress';
import { ActivityDashboard } from '../activity-dashboard';
import { TeamRoleSelector } from '../team-role-selector';
import { SessionContent } from '../session-content';

describe('Activity Runtime Components', () => {
  const mockProps = {
    activityId: 'test-123',
    userId: 'user-456',
    sessionNumber: 1
  };

  it('SessionProgress renders without crashing', async () => {
    render(<SessionProgress {...mockProps} />);
    await waitFor(() => {
      expect(screen.getByText(/loading/i)).toBeInTheDocument();
    });
  });

  it('ActivityDashboard renders without crashing', async () => {
    render(<ActivityDashboard userId={mockProps.userId} />);
    await waitFor(() => {
      expect(screen.getByText(/loading/i)).toBeInTheDocument();
    });
  });

  it('TeamRoleSelector renders without crashing', async () => {
    render(<TeamRoleSelector {...mockProps} />);
    await waitFor(() => {
      expect(screen.getByText(/loading/i)).toBeInTheDocument();
    });
  });

  it('SessionContent renders without crashing', async () => {
    render(<SessionContent {...mockProps} />);
    await waitFor(() => {
      expect(screen.getByText(/loading/i)).toBeInTheDocument();
    });
  });
});
```

**Run tests**:
```bash
npm test -- --testPathPattern=activities
```

---

## 5. EVIDENCE COLLECTION REQUIRED

### Before Marking Complete, Collect:

1. **Screenshot Evidence**:
```bash
# Start dev server
npm run dev

# Navigate to each component and screenshot:
# http://localhost:3000/activities (uses ActivityDashboard)
# http://localhost:3000/activities/test/session/1 (uses SessionProgress)
# Save screenshots to: archive/sessions/SESSION-169-EVIDENCE/
```

2. **Build Success Evidence**:
```bash
# Full build must pass
npm run build > archive/sessions/SESSION-169-build-output.txt 2>&1
tail -20 archive/sessions/SESSION-169-build-output.txt
# Should show "✓ Compiled successfully"
```

3. **TypeScript Validation Evidence**:
```bash
# Each component must pass TypeScript
for file in session-progress activity-dashboard team-role-selector session-content; do
  echo "Checking $file.tsx..."
  npx tsc --noEmit src/components/activities/$file.tsx
done
```

---

## 6. RECOMMENDED EXECUTION ORDER

### Follow-up Session Should:

1. **FIRST** - Fix Import Errors (30 min)
   - Fix SelectItem import in activity-discovery.tsx
   - Fix createClient import in register/page.tsx
   - Verify all imports resolve correctly

2. **SECOND** - Add Missing Configuration (15 min)
   - Add type-check script to package.json
   - Fix ESLint configuration
   - Verify npm run type-check works

3. **THIRD** - Validate Each Component (45 min)
   - Run TypeScript check on each component
   - Run build to verify no compilation errors
   - Test each component renders without errors

4. **FOURTH** - Collect Evidence (20 min)
   - Screenshot each component running
   - Save build success output
   - Document TypeScript validation

5. **FIFTH** - Create PR (10 min)
   - Use auto-PR script
   - Include evidence in PR description
   - Reference this revision document

---

## 7. SUCCESS CRITERIA

The revision is complete when:

✅ All import errors are resolved
✅ npm run build completes successfully  
✅ npm run type-check passes without errors
✅ Each component has been individually validated
✅ Screenshot evidence collected for all 4 components
✅ PR created with evidence using auto-PR script
✅ MCP session properly closed with end_session

---

## 8. CRITICAL NOTES FOR NEXT SESSION

### ⚠️ DO NOT:
- Skip any validation step
- Make assumptions about imports - verify actual exports
- Proceed if TypeScript errors exist
- Close session without PR

### ✅ DO:
- Follow this document step-by-step
- Collect evidence at each stage
- Test incrementally after each fix
- Use Reality Server validation after fixes
- Document any additional issues found

---

## Component Locations (Verified)

All components successfully created at:
- `/src/components/activities/session-progress.tsx` (540 lines)
- `/src/components/activities/activity-dashboard.tsx` (620 lines)
- `/src/components/activities/team-role-selector.tsx` (745 lines)
- `/src/components/activities/session-content.tsx` (850 lines)

Git status: All 4 files show as untracked (??) and ready to be committed.

---

**Estimated Time to Complete Revisions**: 2 hours
**Priority**: P0 - Must complete before other sessions can integrate
**Blocker for**: Sessions 167, 168, 170 (parallel batch coordination)

---

*Document created by Session 169 for follow-up remediation*
*Implements Evidence Imperative Protocol per SESSION-145*