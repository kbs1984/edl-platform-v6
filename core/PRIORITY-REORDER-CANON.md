---
session: "00143"
type: "canon"
status: "authoritative"
created: "2025-09-02"
title: "Priority Reorder Canon - Cyworld-Driven Development Priorities"
purpose: "Redefine build priorities based on identity and engagement rather than functional completion"
topics: ["priorities", "canon", "cyworld", "engagement", "reorder"]
priority: "P0"
domain: "core"
canonical: true
---

# Priority Reorder Canon - Cyworld-Driven Development Priorities

## The Fundamental Shift

### ❌ OLD (Functional) Priority System
```yaml
P0: Basic functionality works
P1: Nice features added
P2: Polish and optimization
```

### ✅ NEW (Cyworld) Priority System
```yaml
P0: Identity & Daily Engagement Hooks
P1: Social Validation & Virtual Economy
P2: Functional Completion & Admin Tools
```

---

## The New Priority Framework

### 🔴 P0: IDENTITY HOOKS (Build These First)
**Definition**: Features that make students want to check EDL daily and express themselves

#### P0.0: Critical Blockers (Fix Immediately)
1. **Guardian Bug** (blocks ALL revenue)
   - Location: `guardian-actions.ts` line 17
   - Impact: Parents can't pay = No economy
   - Time: 5 minutes

#### P0.1: Daily Check Drivers
2. **Visitor Tracking / Today Counter**
   - "Who viewed my profile today?"
   - Daily reset creates FOMO
   - Time: 1 hour

3. **Profile Customization Basic**
   - Themes/colors/backgrounds
   - Personal tagline/status
   - Time: 2 hours

4. **EmCoin Wallet Display**
   - Current balance visible
   - Recent transactions
   - Time: 1 hour

#### P0.2: Achievement Display
5. **Trophy Showcase**
   - Latest achievements visible
   - Rarity indicators
   - Social comparison
   - Time: 2 hours

6. **Activity Feed**
   - "Your friend just won..."
   - "New achievement unlocked"
   - Real-time updates
   - Time: 2 hours

### 🟡 P1: SOCIAL ECONOMY (Build These Second)
**Definition**: Features that create social dynamics and virtual economy

#### P1.1: Virtual Economy Foundation
7. **EmCoin Transaction Engine**
   - Send/receive between users
   - Activity participation fees
   - Reward distributions
   - Time: 3 hours

8. **Achievement Rewards System**
   - Milestone = EmCoins
   - First place = Bonus
   - Streak rewards
   - Time: 2 hours

9. **EmCoin Shop (Basic)**
   - Buy themes/decorations
   - Purchase badges
   - Unlock features
   - Time: 3 hours

#### P1.2: Social Validation
10. **Friend Real-time Updates**
    - WebSocket subscriptions
    - Online status
    - Activity notifications
    - Time: 2 hours

11. **Team Competition Display**
    - Leaderboards
    - Team rankings
    - Guild battles
    - Time: 2 hours

12. **Judge Feedback Showcase**
    - Public endorsements
    - Skill ratings
    - Judge comments visible
    - Time: 1 hour

### 🟢 P2: FUNCTIONAL COMPLETION (Build These Last)
**Definition**: Features that make the platform complete but don't drive daily engagement

#### P2.1: Core Functionality
13. **Activity Management** ✅ (Already 97% complete)
14. **Debate Submission Flow**
15. **Bracket Generation**
16. **Result Tabulation**

#### P2.2: Admin Tools
17. **Admin Dashboard**
18. **Moderation Tools**
19. **Financial Reports**
20. **User Management**

#### P2.3: Advanced Features
21. **AI Judge Assistant**
22. **Advanced Analytics**
23. **Bulk Operations**
24. **API for External Tools**

---

## Current State Analysis (From Progress Matrix)

### What We Built Wrong (Functional First)
```yaml
Completed:
- Activity Runtime Engine (P2 in Cyworld terms)
- Basic authentication (necessary but not engaging)
- Guardian system (broken, blocking economy)

Missing (The Cyworld Magic):
- Zero customization options
- No visitor tracking
- No EmCoin implementation
- No achievement display
- No social feeds
```

### The Painful Truth
**We're 58% "complete" on P0 functional, but 0% complete on P0 Cyworld**

---

## Implementation Order for Session 143+

### Immediate (Today)
1. ✅ Philosophy Canon (DONE)
2. ✅ Priority Canon (THIS DOCUMENT)
3. Fix Guardian Bug (5 min)
4. EmCoin Backend Tables (2 hrs)
5. Visitor Tracking (1 hr)

### Tomorrow (Session 144)
6. Profile Customization
7. EmCoin Wallet Display
8. Trophy Showcase

### This Week
9. Activity Feed
10. EmCoin Transactions
11. Friend Real-time

---

## Decision Criteria

### When Choosing What to Build Next, Ask:

#### The Cyworld Test (Score 0-10)
1. **Daily Check Impact**: Will this make students visit daily? (0-10)
2. **Show-off Factor**: Will students show this to friends? (0-10)
3. **Identity Expression**: Does this help express who they are? (0-10)
4. **Social Validation**: Do others see and react to this? (0-10)
5. **Virtual Economy**: Does this involve EmCoins? (0-10)

**Build Order**: Highest total score first

### Example Scoring

**Visitor Counter**: 10+10+8+10+0 = **38/50** ✅ BUILD NOW
**Advanced Reports**: 0+0+0+0+0 = **0/50** ❌ BUILD LATER
**Profile Themes**: 8+10+10+8+5 = **41/50** ✅ BUILD NOW
**Bracket Generation**: 2+3+1+5+2 = **13/50** ❌ BUILD LATER

---

## The Cyworld Features We're Missing (Priority Order)

### Must Have for Launch
1. **Today Counter** - The addictive daily check
2. **Profile Themes** - Identity through customization
3. **EmCoin Balance** - Virtual worth display
4. **Friend Activity** - Social engagement
5. **Achievement Gallery** - Progress showcase

### Nice to Have
6. **Background Music** - Personal soundtrack
7. **Guestbook** - Social interaction
8. **Mini-games** - EmCoin earning
9. **Gifts System** - Social currency
10. **Profile Badges** - Status symbols

---

## Migration Strategy

### From Current Progress Matrix
```sql
-- Update all current P0 items that are purely functional
UPDATE platform_progress_matrix 
SET priority = 'P2'
WHERE priority = 'P0' 
  AND feature_name NOT IN ('Authentication', 'Guardian Onboarding Fix');

-- Elevate Cyworld features to P0
UPDATE platform_progress_matrix
SET priority = 'P0'
WHERE feature_name IN (
  'Profile Customization',
  'EmCoin System',
  'Achievement Display',
  'Friend Features',
  'Visitor Tracking'
);
```

---

## Success Metrics Redefined

### Old Metrics (Functional)
- Features completed: X/36 ❌
- Tests passing: 100% ❌
- Code coverage: X% ❌

### New Metrics (Engagement)
- Daily active users 📈
- Average daily checks per user 📱
- EmCoin transactions per day 💰
- Profile customizations made 🎨
- Friend connections created 👥
- **Cyworld Magic Index: X%** ✨

---

## The North Star Reminder

Every feature decision must pass the **Cyworld Test**:
> "Would a Korean teenager in 2005 have paid money to customize this?"

If yes, it's P0.
If maybe, it's P1.
If no, it's P2.

---

## Immediate Action Items

1. **Fix Guardian Bug** - Unblocks economy (5 min)
2. **Create EmCoin tables** - Foundation for engagement (2 hrs)
3. **Add visitor tracking** - First daily hook (1 hr)
4. **Update Progress Matrix** - Reflect new priorities (30 min)
5. **Start Profile Customization** - Identity expression (2 hrs)

---

*"The best educational platform is one students can't stop checking"* 🌟

**This canon supersedes all previous priority frameworks. Build for identity, not functionality.**