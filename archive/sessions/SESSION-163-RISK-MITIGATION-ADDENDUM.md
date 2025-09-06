---
session: "163"
type: "risk-mitigation"
status: "final"
created: "2025-09-04T12:00:00.000Z"
title: "Risk Mitigation Addendum - Guardrails for Velocity"
purpose: "Address critical risks while maintaining 4-10 features/hour velocity"
topics: ["risk-management", "technical-debt", "quality-standards", "parallel-coordination"]
priority: "P0"
domain: "reconciliation"
extends: ["SESSION-163-FINAL-PARALLEL-BATCH-PROPOSAL.md"]
---

# Risk Mitigation Addendum
## Minimal Guardrails for Maximum Velocity

**Purpose**: Address critical risks identified without sacrificing 4-10 features/hour velocity target

---

## Day 0: Foundation Setup (4 hours total)
*One-time setup to prevent chaos*

### 1. Shared Design System (1 hour)
```typescript
// shared/design-tokens.ts
export const tokens = {
  colors: {
    primary: '#6366f1',    // Indigo for all primary actions
    success: '#10b981',    // Green for achievements
    warning: '#f59e0b',    // Orange for EmCoin
    danger: '#ef4444',     // Red for errors
    addiction: {
      fire: '#f97316',     // 🔥 Orange flame
      coin: '#eab308',     // 🪙 Gold
      eye: '#8b5cf6',      // 👁️ Purple
      trophy: '#facc15'    // 🏆 Yellow
    }
  },
  spacing: {
    xs: '0.5rem',
    sm: '1rem', 
    md: '1.5rem',
    lg: '2rem',
    xl: '3rem'
  },
  borderRadius: {
    default: '0.375rem',
    full: '9999px'
  }
};

// shared/base-components.tsx
export const Card = ({ children, className = '' }) => (
  <div className={`rounded-md border p-4 ${className}`}>{children}</div>
);

export const Button = ({ variant = 'primary', ...props }) => (
  <button className={`px-4 py-2 rounded-md ${variants[variant]}`} {...props} />
);

export const Skeleton = ({ className = '' }) => (
  <div className={`animate-pulse bg-gray-200 rounded-md ${className}`} />
);
```

### 2. API Verification Checklist (1 hour)
```bash
# scripts/verify-apis.ts
const criticalEndpoints = {
  session163: [
    'GET /api/emcoin/balance',
    'GET /api/emcoin/transactions', 
    'POST /api/emcoin/claim-daily'
  ],
  session164: [
    'GET /api/achievements',
    'GET /api/user/achievements',
    'POST /api/achievements/unlock'
  ],
  session165: [
    'GET /api/activities',
    'GET /api/activity/:id',
    'POST /api/activity/register'
  ],
  session166: [
    'GET /api/profile/:id',
    'PUT /api/profile',
    'GET /api/friends'
  ]
};

// Run before each session starts
await verifyEndpoints(criticalEndpoints.session163);
```

### 3. File Ownership Map (30 min)
```markdown
## File Ownership Boundaries

### Session 163 (EmCoin/Addiction)
- `/components/emcoin/*`
- `/components/addiction/*`
- `/hooks/useEmCoin.ts`
- `/lib/emcoin-utils.ts`

### Session 164 (Achievements)
- `/components/achievements/*`
- `/components/badges/*`
- `/hooks/useAchievements.ts`
- `/lib/achievement-utils.ts`

### Session 165 (Activities)
- `/components/activities/*`
- `/components/sessions/*`
- `/hooks/useActivities.ts`
- `/lib/activity-utils.ts`

### Session 166 (Social/Profile)
- `/components/profile/*`
- `/components/social/*`
- `/hooks/useProfile.ts`
- `/lib/social-utils.ts`

### Shared (No Direct Edits - PR Required)
- `/app/layout.tsx`
- `/app/page.tsx`
- `/shared/*`
- `package.json`
- `.env`
```

### 4. Global State Strategy (30 min)
```typescript
// contexts/global-state.tsx
interface GlobalState {
  user: {
    id: string;
    emcoinBalance: number;
    achievementCount: number;
    activityCount: number;
  };
  // Each session can ADD but not MODIFY existing fields
  session163?: { streakDays: number };
  session164?: { unlockedBadges: string[] };
  session165?: { activeActivities: string[] };
  session166?: { friendCount: number };
}

// Simple Zustand store - no complex setup
export const useGlobalStore = create<GlobalState>((set) => ({
  user: { id: '', emcoinBalance: 0, achievementCount: 0, activityCount: 0 },
  updateBalance: (balance) => set((state) => ({ 
    user: { ...state.user, emcoinBalance: balance } 
  }))
}));
```

### 5. Performance Budget (30 min)
```typescript
// performance-budget.ts
export const PERFORMANCE_BUDGET = {
  perSession: {
    bundleSize: '50kb max',
    components: '5 max',
    apiCalls: '3 concurrent max',
    rerenders: 'React.memo on lists',
    intervals: '1 per session max',
    websockets: 'Share single connection'
  },
  perComponent: {
    initialLoad: '<100ms',
    interaction: '<50ms',
    animation: '60fps required'
  }
};
```

### 6. Minimum Quality Standards (30 min)
```typescript
// .eslintrc.js additions
{
  rules: {
    '@typescript-eslint/no-any': 'error',        // No 'any' types
    '@typescript-eslint/no-unused-vars': 'error', // No unused code
    'react/prop-types': 'off',                   // TypeScript handles this
    'no-console': 'warn',                        // Console.log warnings
    'react-hooks/exhaustive-deps': 'warn'        // Hook dependency warnings
  }
}

// Minimum component requirements
interface ComponentRequirements {
  required: {
    loading: boolean;      // Must have loading state
    error: Error | null;   // Must have error state
    typescript: true;      // No .jsx files
  };
  optional: {
    mobile: false;         // Can skip for V1
    a11y: false;          // Can skip for V1
    tests: false;         // Can skip for V1
  };
}
```

---

## Daily Coordination Protocol (15 min/day total)

### Morning Sync (5 min)
```markdown
## Daily Standup Template (Post in Discord/Slack)
Session: [NUMBER]
Yesterday: [What I shipped]
Today: [What I'm building]  
Blockers: [Any API issues or conflicts]
Screenshot: [Latest component visual]
```

### Continuous Integration (Automated)
```yaml
# .github/workflows/parallel-ci.yml
on:
  push:
    branches: [session-163*, session-164*, session-165*, session-166*]
jobs:
  quick-checks:
    runs-on: ubuntu-latest
    timeout-minutes: 5  # Fast feedback
    steps:
      - run: npm run type-check  # TypeScript passes
      - run: npm run lint         # Basic quality
      - run: npm run build        # Builds successfully
```

### End of Day Checkpoint (10 min)
```bash
# Daily merge protocol
git checkout main
git merge session-163-addiction --no-ff
git merge session-164-achievements --no-ff  
git merge session-165-activities --no-ff
git merge session-166-social --no-ff

# Quick performance check
npm run lighthouse -- --performance-only
```

---

## Risk-Aware Component Template

```typescript
// Template for ALL components across sessions
import { useState, useEffect } from 'react';
import { Card, Skeleton } from '@/shared/base-components';
import { useGlobalStore } from '@/contexts/global-state';

export function ComponentName() {
  // Required: Loading and error states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState(null);
  
  // Use global state where needed
  const { user, updateBalance } = useGlobalStore();
  
  useEffect(() => {
    fetchData()
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);
  
  // Required: Handle all states
  if (loading) return <Skeleton className="h-32" />;
  if (error) return <Card>Error: {error.message}</Card>;
  if (!data) return <Card>No data available</Card>;
  
  // Actual component UI
  return (
    <Card>
      {/* Component content */}
    </Card>
  );
}
```

---

## Acceptable Technical Debt Tracking

```markdown
## Technical Debt Log (Update as you ship)

### Session 163
- [ ] AddictionBar: No mobile responsive (2hr fix)
- [ ] EmCoinDisplay: No pagination on transactions (1hr fix)
- [ ] StreakCounter: No timezone handling (2hr fix)

### Session 164  
- [ ] AchievementGrid: No virtualization for 100+ badges (3hr fix)
- [ ] BadgeCard: No keyboard navigation (1hr fix)

### Session 165
- [ ] ActivityCard: No cancellation flow (2hr fix)
- [ ] SessionProgress: No offline support (4hr fix)

### Session 166
- [ ] ProfileEditor: No image cropping (2hr fix)
- [ ] DirectMessages: No message editing (3hr fix)

Total Debt: ~20 hours (5 sessions to pay back)
```

---

## Success Metrics (Updated)

### Velocity Targets (Unchanged)
- 4-10 features/hour
- Daily shipping mandatory
- 15-20 components per batch

### Quality Minimums (New)
- Zero TypeScript 'any' types
- 100% components have loading/error states
- <10 ESLint errors per session
- Builds successfully every commit
- Performance budget maintained

### Coordination Success (New)
- Zero merge conflicts requiring manual resolution
- Daily screenshots shared
- Main branch always buildable
- <5 minute CI feedback loop

---

## The Math Still Works

With these guardrails:
- Day 0 Setup: 4 hours (one-time)
- Daily Coordination: 15 minutes
- Component Template: Saves time (no thinking needed)
- Quality Standards: Prevent future 20-hour debt

**Net Impact on Velocity**: 
- Week 1: -10% (setup cost)
- Week 2+: +20% (fewer bugs, conflicts, rework)

---

## Final Risk Assessment

### 🔴 → 🟡 Risks Now Mitigated
1. **Technical Debt**: Tracked and bounded (~20hrs)
2. **UX Fragmentation**: Shared design tokens
3. **State Chaos**: Simple global store defined

### 🟡 → 🟢 Risks Now Managed  
4. **Canvas Drift**: Daily screenshots
5. **API Assumptions**: Pre-verified checklist
6. **Mock Data Trap**: Use real API shapes

### 🟢 Risks Accepted (As Intended)
7. **No Mobile**: Tracked as debt
8. **No A11y**: Tracked as debt
9. **Limited Testing**: Manual validation

### 🆕 Risks Now Prevented
10. **Merge Conflicts**: File ownership map
11. **Naming Collisions**: Session prefixes if needed
12. **Performance Death**: Budget enforced

---

**Bottom Line**: These guardrails add ~4 hours setup + 15 min/day coordination to prevent ~40 hours of rework. The velocity-first approach remains intact, but with just enough structure to prevent chaos.

**Ready to implement with these safeguards?**