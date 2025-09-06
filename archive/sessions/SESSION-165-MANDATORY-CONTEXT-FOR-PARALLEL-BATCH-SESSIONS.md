---
session: "165"
type: "mandatory-context"
status: "final"
created: "2025-09-04T21:30:00.000Z"
title: "Mandatory Context for Parallel Batch Sessions 163-170"
purpose: "Essential reading before starting any parallel batch implementation session"
topics: ["parallel-development", "context-loading", "quick-reference", "api-verification", "implementation-guide"]
priority: "P0"
domain: "core"
required_reading_time: "15 minutes"
---

# MANDATORY CONTEXT FOR PARALLEL BATCH SESSIONS
## Read This First - 15 Minutes to Save 15 Hours

**⚠️ STOP: Do not write any code until you've read this entire document**

---

## Critical Documents to Load (In Order)

### 1. THE DEFINITIVE BUILD WORKFLOW (MANDATORY - 3 min)
```bash
# ⚠️ THIS IS NOT OPTIONAL - ENFORCED BY MCP SESSION TRACKING
Read: core/00141-DEFINITIVE-BUILD-WORKFLOW.md

# The 8-Phase Build Cycle MUST be followed:
# Phase 0: PRE-FLIGHT → Phase 1: START SESSION → Phase 2: REVIEW STATUS
# Phase 3: PLAN FEATURE → Phase 4: RESEARCH → Phase 5: BUILD WITH TESTS
# Phase 6: VALIDATE → Phase 7: AUTO-PR → Phase 8: SESSION CLOSURE
```

### 2. Parallel Batch Strategy (2 min)
```bash
# Primary Strategy Documents
Read: SESSION-163-FINAL-PARALLEL-BATCH-PROPOSAL.md
Read: SESSION-163-RISK-MITIGATION-ADDENDUM.md

# Only if you need deep context (optional):
# SESSION-164-BATCH-1-INVESTIGATION-REPORT.md
# requirements/brian-backend-proposal/database-schema-descriptions.md
```

### 3. Your Session's Canvas Wireframe (2 min)
```bash
# Session 163: archive/legacy-canvas-work/003-2 seed.emCoin Transactions Box.canvas
# Session 164: archive/legacy-canvas-work/002-3. seed.Badges Box.canvas  
# Session 165: archive/legacy-canvas-work/001-4. needlabel.Activity & Registrar Box.canvas
#              archive/legacy-canvas-work/001-5. seed.Activity Instance.canvas
# Session 166: archive/legacy-canvas-work/002-1. seed.PlayerID Profile Box.canvas
#              archive/legacy-canvas-work/001-2. label.Communication, messages and Invitations.canvas
```

### 4. Shared Foundation Code (3 min)
```typescript
// THIS CODE MUST BE CREATED IN DAY 0 SETUP
// Location: /shared/design-tokens.ts
export const tokens = {
  colors: {
    primary: '#6366f1',
    success: '#10b981',
    warning: '#f59e0b',
    danger: '#ef4444',
    addiction: {
      fire: '#f97316',     // 🔥
      coin: '#eab308',     // 🪙
      eye: '#8b5cf6',      // 👁️
      trophy: '#facc15'    // 🏆
    }
  },
  spacing: { xs: '0.5rem', sm: '1rem', md: '1.5rem', lg: '2rem', xl: '3rem' },
  borderRadius: { default: '0.375rem', full: '9999px' }
};

// Location: /shared/base-components.tsx
export { Card, Button, Skeleton, LoadingSpinner, ErrorAlert };

// Location: /contexts/global-state.tsx
export const useGlobalStore = create<GlobalState>((set) => ({
  user: { id: '', emcoinBalance: 0, achievementCount: 0, activityCount: 0 },
  // Your session adds to this, doesn't modify existing
}));
```

---

## Session-Specific Quick Start Guides

### SESSION 163: Addiction Mechanics & EmCoin UI

**Your Mission**: Build the famous 👁️🔥🪙🏆 addiction bar that drives engagement

**Canvas Interpretation**:
- EmCoin Transactions Box shows balance + history + payment info
- Focus on real-time balance updates and transaction display
- Payment info can be simplified for V1

**Brian's Schema Extraction**:
```sql
-- Table 31: DB_emCoinTransactions
-- Key concept: 1.618x multiplier for prepaid (golden ratio!)
-- Table 5-6: Subscriptions/metaPass (skip complex payment flows)
```

**Components to Build** (Priority Order):
1. `<AddictionBar />` - The 👁️🔥🪙🏆 display (2 hours max)
2. `<EmCoinBalance />` - Real-time balance with WebSocket (1 hour)
3. `<TransactionHistory />` - Simple list view (1 hour)
4. `<StreakCounter />` - Fire effects for daily logins (if time)
5. `<DailyBonus />` - Claim button with animation (if time)

**Your API Endpoints** (Verify First!):
```typescript
GET  /api/emcoin/balance        // Returns: { balance: number }
GET  /api/emcoin/transactions   // Returns: { transactions: [...] }
POST /api/emcoin/claim-daily    // Returns: { success: boolean, newBalance: number }
GET  /api/user/streak           // Returns: { days: number, lastLogin: Date }
```

**File Ownership**:
```
/components/emcoin/*
/components/addiction/*  
/hooks/useEmCoin.ts
/lib/emcoin-utils.ts
```

---

### SESSION 164: Achievement System UI

**Your Mission**: Create badge galleries and celebration moments

**Canvas Interpretation**:
- Badges Box shows available/earned states with metadata
- Progress indicators (12, LV.2, 144) suggest gamification levels
- Include visual celebration for unlocks

**Brian's Schema Extraction**:
```sql
-- Table 3: AD_PlayerBadges (tracking earned badges)
-- Table 22: CC_Badges (badge definitions and criteria)
-- Table 7: AH_ScholarshipPool (badges unlock scholarships - skip for V1)
```

**Components to Build** (Priority Order):
1. `<AchievementGrid />` - Visual gallery with lock/unlock states (2 hours)
2. `<BadgeCard />` - Individual badge display with progress (1 hour)
3. `<UnlockToast />` - Celebration notification animation (1 hour)
4. `<ProgressBar />` - Visual completion tracking (if time)
5. `<LeaderboardWidget />` - Top achievers display (if time)

**Your API Endpoints** (Verify First!):
```typescript
GET  /api/achievements           // Returns: { achievements: [...] }
GET  /api/user/achievements      // Returns: { earned: [...], progress: {...} }
POST /api/achievements/unlock    // Returns: { success: boolean, badge: {...} }
GET  /api/achievements/leaderboard // Returns: { top: [...] }
```

**File Ownership**:
```
/components/achievements/*
/components/badges/*
/hooks/useAchievements.ts
/lib/achievement-utils.ts
```

---

### SESSION 165: Activity Runtime UI

**Your Mission**: Multi-session activity management and progress tracking

**Canvas Interpretation**:
- Activity & Registrar Box shows complex participant management
- Activity Instance shows session-by-session progress (1 of 5)
- Focus on progress tracking, skip complex registration flows

**Brian's Schema Extraction**:
```sql
-- Table 12: BC_Activities (activity definitions with types/genres)
-- Table 13: BD_Registrations (RSVP + payment - skip payment for V1)
-- Table 36: DG_InstanceChamber (live activity rooms - simplify to progress)
```

**Components to Build** (Priority Order):
1. `<ActivityCard />` - Display with registration button (2 hours)
2. `<SessionProgress />` - Multi-step tracker (Session 1 of 5) (1.5 hours)
3. `<ActivityDashboard />` - Overview of user's activities (1 hour)
4. `<TeamSelector />` - Quick assignment UI (if time)
5. `<CompletionCertificate />` - Downloadable PDF (if time)

**Your API Endpoints** (Verify First!):
```typescript
GET  /api/activities             // Returns: { activities: [...] }
GET  /api/activity/:id           // Returns: { activity: {...}, sessions: [...] }
POST /api/activity/register      // Returns: { success: boolean, registrationId: string }
GET  /api/user/activities        // Returns: { registered: [...], completed: [...] }
PUT  /api/activity/:id/progress  // Returns: { currentSession: number, total: number }
```

**File Ownership**:
```
/components/activities/*
/components/sessions/*
/hooks/useActivities.ts
/lib/activity-utils.ts
```

---

### SESSION 166: Social & Profile Foundation

**Your Mission**: Complete profile management and basic social features

**Canvas Interpretation**:
- PlayerID Profile Box shows complete user profile structure
- Communication box shows messaging patterns
- Include guardian/supervisor linking concept

**Brian's Schema Extraction**:
```sql
-- Table 2: AC_Players (complete profile with school/grade/division)
-- Table 4: AE_Supervisors (guardian system - simplify for V1)
-- Table 29: CJ_messages (complex threading - use simple chat for V1)
-- Table 34: DE_PlayerPersonality (MBTI/OCEAN - skip for V1)
```

**Components to Build** (Priority Order):
1. `<ProfileEditor />` - Basic fields with image upload (2 hours)
2. `<FriendsList />` - Social connections display (1 hour)
3. `<DirectMessages />` - Simple chat interface (1.5 hours)
4. `<GuardianLink />` - Supervisor connection UI (if time)
5. `<PersonalityProfile />` - MBTI display (skip for V1)

**Your API Endpoints** (Verify First!):
```typescript
GET  /api/profile/:id            // Returns: { profile: {...} }
PUT  /api/profile                // Returns: { success: boolean, profile: {...} }
GET  /api/friends                // Returns: { friends: [...], requests: [...] }
POST /api/friends/request        // Returns: { success: boolean }
GET  /api/messages               // Returns: { conversations: [...] }
POST /api/messages/send          // Returns: { success: boolean, message: {...} }
```

**File Ownership**:
```
/components/profile/*
/components/social/*
/hooks/useProfile.ts
/lib/social-utils.ts
```

---

## Universal Component Template (USE THIS!)

```typescript
import { useState, useEffect } from 'react';
import { Card, Skeleton, ErrorAlert } from '@/shared/base-components';
import { useGlobalStore } from '@/contexts/global-state';
import { tokens } from '@/shared/design-tokens';

export function YourComponentName() {
  // REQUIRED: Loading and error states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState(null);
  
  // Global state access (read-only for other sessions' data)
  const { user, updateBalance } = useGlobalStore();
  
  useEffect(() => {
    fetchYourData()
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);
  
  // REQUIRED: Handle ALL states
  if (loading) return <Skeleton className="h-32" />;
  if (error) return <ErrorAlert message={error.message} />;
  if (!data) return <Card>No data available</Card>;
  
  return (
    <Card>
      {/* Your actual UI here */}
    </Card>
  );
}
```

---

## MANDATORY WORKFLOW ENFORCEMENT (MUST FOLLOW)

### ⚠️ THE 8-PHASE BUILD CYCLE IS NOT OPTIONAL

### Phase 0-1: SESSION START (Automatic)
```bash
# ALWAYS start sessions with MCP-integrated script
./scripts/00140-mcp-integrated-session-start.sh [SESSION] "[FEATURE]"

# Example for Session 163:
./scripts/00140-mcp-integrated-session-start.sh 163 "Addiction Mechanics UI"
```

### Phase 2: REVIEW STATUS WITH YAML QUERIES
```bash
# CRITICAL: Check existing work BEFORE building!
python3 scripts/00059-yaml-query.py --topic "emcoin"       # Session 163
python3 scripts/00059-yaml-query.py --topic "achievement"  # Session 164  
python3 scripts/00059-yaml-query.py --topic "activity"     # Session 165
python3 scripts/00059-yaml-query.py --topic "profile"      # Session 166

# Load dynamic context
./scripts/00138-dynamic-context-loader.sh
```

### Phase 3: PLAN WITH SEQUENTIAL THINKING (5 thoughts minimum)
```javascript
mcp__sequential-thinking__sequentialthinking({
  thought: "Design [COMPONENT] with loading, error, and success states",
  totalThoughts: 5,
  thoughtNumber: 1,
  nextThoughtNeeded: true
})
```

### Phase 4: RESEARCH PATTERNS (Don't skip!)
```javascript
mcp__brave-search__brave_web_search({
  query: "[COMPONENT] Next.js 15 Supabase best practices 2025",
  count: 5
})
```

### Phase 5: BUILD WITH TESTS FIRST
```javascript
// Create baseline test BEFORE coding
describe('[Component]', () => {
  it('renders without error', () => {})
  it('handles loading state', () => {})
  it('handles error state', () => {})
  it('displays data correctly', () => {})
})
```

### Phase 6: VALIDATE INCREMENTALLY (After EACH component!)
```javascript
// Quick validation - run after EVERY component
mcp__reality-server__orchestrate({
  critical_only: true,
  include_performance: true
})

// Track deliverables
mcp__edl-v6-session__track_deliverable({
  path: "components/[domain]/[Component].tsx",
  type: "component",
  linesOfCode: 150
})
```

### Phase 7: AUTO-PR WHEN READY
```bash
python3 scripts/00136-auto-pr.py "[Feature Name]" [SESSION]
```

### Phase 8: SESSION CLOSURE (MANDATORY)
```javascript
mcp__edl-v6-session__end_session({
  summary: "Built [X] components for [FEATURE]",
  accomplishments: ["List what shipped"],
  nextPriorities: ["What's next"],
  honestAssessment: "Any issues or tech debt"
})
```

---

## Pre-Flight Checklist (AFTER WORKFLOW)

### 1. MCP Session Tracking (REQUIRED)
```javascript
// Initialize at session start
mcp__edl-v6-session__start_session({
  sessionId: "[SESSION]",
  focus: "[What you're building]",
  estimatedHours: 2
})

// Add tasks as you work
mcp__edl-v6-session__add_task({
  title: "Build [Component]",
  priority: "high",
  status: "in-progress"
})

// Update when complete
mcp__edl-v6-session__update_task({
  taskId: "Build [Component]",
  status: "completed"
})
```

### 2. Verify Your APIs (5 minutes)
```bash
# Run this script first!
npm run verify-apis -- --session=163  # Change to your session number

# Or manually test each endpoint:
curl http://localhost:3000/api/emcoin/balance
# Should return actual data, not 404
```

### 2. Check File Ownership
```bash
# Ensure you're in YOUR directory
cd components/[your-domain]  # emcoin, achievements, activities, or social

# Never directly edit these without PR:
# - /app/layout.tsx
# - /app/page.tsx  
# - /shared/*
# - package.json
```

### 3. Load Canvas Wireframe
```bash
# Open in Obsidian or read the JSON
cat "archive/legacy-canvas-work/[your-canvas-file].canvas" | jq '.'

# Look for:
# - Component layouts (x, y, width, height)
# - Text content (what to display)
# - Color hints (use our design tokens)
```

### 4. Set Up Your Branch
```bash
git checkout -b session-[NUMBER]-[feature]
# Examples:
# git checkout -b session-163-addiction
# git checkout -b session-164-achievements
```

---

## Critical Success Rules

### ✅ DO THIS:
1. **Ship in 2 hours per component** (timebox aggressively)
2. **Use the template** (don't reinvent)
3. **Follow Canvas loosely** (it's a guide, not law)
4. **Share screenshots** after each component
5. **Merge daily** (even if incomplete)
6. **Ask in Discord** if blocked >30 minutes

### ❌ DON'T DO THIS:
1. **Don't perfect** (ship at 80% quality)
2. **Don't create new backend** (use existing APIs)
3. **Don't skip loading/error states** (required!)
4. **Don't use `any` type** (TypeScript required)
5. **Don't modify other sessions' files** (use PR)
6. **Don't wait for perfect understanding** (build and learn)

---

## Performance Budget (RESPECT THIS!)

```typescript
const YOUR_BUDGET = {
  components: 5,              // Max components per session
  bundleSize: '50kb',        // Max added to bundle
  apiCalls: 3,               // Max concurrent API calls
  rerenders: 'React.memo',   // Required for lists
  intervals: 1,              // Max setInterval per session
  websockets: 'shared',      // Use global connection
  loadTime: '<100ms',        // Component initial render
  animation: '60fps'         // Required for all animations
};
```

---

## Daily Coordination Points

### Morning (5 min)
```markdown
Post in #parallel-batch:
Session: [YOUR NUMBER]
Today: [Component you're building]
Blockers: [Any API issues]
```

### End of Day (10 min)
```bash
# Commit and push
git add .
git commit -m "feat(session-[NUMBER]): [what you built]"
git push

# Merge to main
git checkout main
git merge session-[NUMBER]-[feature] --no-ff
git push

# Post screenshot in Discord
```

---

## Emergency Procedures

### If API Doesn't Exist:
```typescript
// Use mock data but mark it clearly
const MOCK_DATA = {
  // TODO: Replace with real API when available
  balance: 100,
  transactions: []
};
```

### If Canvas is Unclear:
1. Make a decision and document it
2. Follow successful V5 patterns
3. Share screenshot for feedback
4. Don't wait for perfect clarity

### If You Break Main:
```bash
# Revert immediately
git revert HEAD
git push

# Fix on your branch
git checkout session-[NUMBER]-[feature]
# Fix the issue
git push

# Try merge again
```

---

## Technical Debt Log (UPDATE AS YOU SHIP)

When you ship imperfect code (which is fine!), add it here:

```markdown
## Session [NUMBER] Technical Debt
- [ ] ComponentName: Issue description (Xhrs to fix)
- [ ] Example: No mobile responsive (2hrs)
- [ ] Example: No error retry logic (1hr)
```

---

## Questions? Problems?

1. **First**: Check this document again
2. **Second**: Check your Canvas wireframe
3. **Third**: Look at Brian's table for business logic hints
4. **Fourth**: Ask in Discord #parallel-batch
5. **Fifth**: Make a decision and move forward

---

## Final Reminder

**VELOCITY > PERFECTION**

Your goal is to ship working UI components that connect to real APIs and look decent. Not to build perfect, production-ready, fully-tested, accessible, mobile-responsive, internationalized components.

Ship fast. Iterate later. Document debt. Keep building.

**Target: 4-10 features/hour**

Now stop reading and start building! 🚀

---

*Last Updated: Session 165 - September 4, 2025*
*Time to Read: 15 minutes*
*Time Saved by Reading: 15+ hours*