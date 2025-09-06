---
session: "166"
type: "component-specifications"
status: "ready"
created: "2025-09-05"
title: "Component Specifications for Sessions 167-170 - Batch 1 Core UI Completion"
purpose: "Define exact WHAT to build for parallel sessions to complete missing 60-70% of Batch 1"
topics: ["ui-components", "specifications", "parallel-development", "batch-1-completion"]
priority: "P0"
domain: "core"
sessions: ["167", "168", "169", "170"]
verification_complete: true
---

# SESSION 166: COMPONENT SPECIFICATIONS FOR SESSIONS 167-170
## Completing Batch 1 Core UI Sprint (Missing 60-70%)

**Coordinator**: Session 166  
**Status**: Ready for Implementation  
**Context**: Platform verification shows ~30-40% completion of Batch 1. These specifications define the exact missing components.

---

## ⚠️ CRITICAL CONTEXT FOR ALL SESSIONS

### What Already Exists (DO NOT REBUILD):
```typescript
// EXISTING COMPONENTS - Import and use these
/components/emcoin/
  ├── emcoin-display.tsx         // Basic balance display
  ├── emcoin-balance-display.tsx // Enhanced balance
  └── transaction-history.tsx     // Transaction list

/components/achievements/
  └── badge-gallery.tsx           // Basic gallery (needs enhancement)

/components/activities/
  ├── activity-discovery.tsx      // Browse activities
  └── activity-registration.tsx   // Register for activities

/components/profile/
  ├── profile-display.tsx         // Basic profile view
  ├── profile-customization.tsx   // Edit profile
  ├── visitor-counter.tsx         // Basic visitor count
  └── visitor-tracker.tsx         // Track visits

/components/addiction/
  ├── sidebar-metrics.tsx         // Basic metrics display
  └── v5-bridge.tsx               // V5 engine bridge (temporary)
```

### Required Reading Before Starting:
1. **HOW to Build**: `SESSION-165-MANDATORY-CONTEXT-FOR-PARALLEL-BATCH-SESSIONS.md`
2. **Strategy**: `SESSION-163-FINAL-PARALLEL-BATCH-PROPOSAL.md`
3. **WHAT to Build**: This document

---

## SESSION 167: ADDICTION MECHANICS COMPLETION
**Focus**: Complete the addiction bar and engagement mechanics  
**Canvas**: `archive/legacy-canvas-work/003-2 seed.emCoin Transactions Box.canvas`

### 🎯 PRIORITY 1: Complete Addiction Bar (2 hours)

#### Component: `<AddictionBar />`
**Path**: `/components/addiction/addiction-bar.tsx`
**Purpose**: The famous 👁️🔥🪙🏆 bar that drives daily engagement

```typescript
interface AddictionBarProps {
  position?: 'top' | 'sidebar';
  compact?: boolean;
}

// MUST INCLUDE:
// 1. 👁️ Visitor count (integrate existing visitor-tracker.tsx)
// 2. 🔥 Streak counter (NEW - implement below)
// 3. 🪙 EmCoin balance (integrate existing emcoin-display.tsx)
// 4. 🏆 Achievement count (NEW - query user_achievements)
```

**Integration Requirements**:
- Import and compose existing components
- Add hover tooltips showing details
- Animate number changes with react-spring
- Update in real-time via Supabase subscriptions

**Visual Spec from Canvas**:
- Horizontal layout on desktop, stacked on mobile
- Each metric in colored bubble (use design tokens)
- Pulsing animation on milestones

### 🎯 PRIORITY 2: Streak Counter (1.5 hours)

#### Component: `<StreakCounter />`
**Path**: `/components/addiction/streak-counter.tsx`
**API Endpoint**: Create `/api/user/streak`

```typescript
interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastLoginDate: string;
  todayLoggedIn: boolean;
}

// Visual Requirements:
// - Fire emoji 🔥 grows with streak (1-2 days: small, 3-6: medium, 7+: large)
// - Shake animation on new day login
// - "Day X" counter below fire
// - Lost streak shows grey fire with "Start Again" CTA
```

**Database Query**:
```sql
-- You need to track login dates
-- Consider adding to user_states or creating login_streak table
SELECT 
  COUNT(DISTINCT DATE(created_at)) as login_days,
  MAX(created_at)::date = CURRENT_DATE as logged_in_today
FROM user_activity_log  -- May need to create this
WHERE user_id = auth.uid()
  AND created_at >= CURRENT_DATE - INTERVAL '30 days'
```

### 🎯 PRIORITY 3: Daily Bonus Claim (1 hour)

#### Component: `<DailyBonusButton />`
**Path**: `/components/addiction/daily-bonus-button.tsx`
**API Endpoint**: Use existing `/api/emcoin/claim-daily`

```typescript
interface DailyBonusState {
  canClaim: boolean;
  nextClaimTime?: Date;
  todaysAmount: number;
  streakBonus: number;
}

// Visual Requirements:
// - Glowing button when claimable
// - Countdown timer when not claimable
// - Coin shower animation on claim
// - Show bonus amount (increases with streak)
```

**Integration**:
- Check `emcoin_wallets.last_daily_bonus` field
- Use `daily_bonus_config` table for amounts
- Trigger EmCoin balance update animation

### 🎯 PRIORITY 4: Achievement Counter Widget (1 hour)

#### Component: `<AchievementCounter />`
**Path**: `/components/addiction/achievement-counter.tsx`

```typescript
// Simple counter showing:
// - Total achievements earned
// - Recent achievement (last 24h)
// - Progress to next achievement
// - Click opens full badge-gallery.tsx
```

### 📋 Session 167 Deliverables Checklist:
- [ ] `addiction-bar.tsx` - Unified 👁️🔥🪙🏆 display
- [ ] `streak-counter.tsx` - Daily login tracking with fire
- [ ] `daily-bonus-button.tsx` - Claimable daily rewards
- [ ] `achievement-counter.tsx` - Quick achievement stats
- [ ] API: `/api/user/streak` endpoint
- [ ] Database: Login tracking mechanism

---

## SESSION 168: ACHIEVEMENT SYSTEM COMPLETION
**Focus**: Complete badge and achievement UI components  
**Canvas**: `archive/legacy-canvas-work/002-3. seed.Badges Box.canvas`

### 🎯 PRIORITY 1: Individual Badge Cards (2 hours)

#### Component: `<BadgeCard />`
**Path**: `/components/achievements/badge-card.tsx`
**Enhance Existing**: `badge-gallery.tsx` currently shows a basic grid

```typescript
interface BadgeCardProps {
  achievement: Achievement;
  earned: boolean;
  progress?: number;
  showcasePosition?: number;
}

// States to handle:
// 1. Locked (greyscale, show requirements)
// 2. In Progress (show progress bar)
// 3. Earned (full color, show date earned)
// 4. Showcased (special border/glow)
```

**Visual Requirements from Canvas**:
- Hexagonal or shield shape (not just squares)
- Rarity border colors (common: grey, rare: blue, epic: purple, legendary: gold)
- Progress ring around locked badges
- Hover shows detailed requirements

### 🎯 PRIORITY 2: Achievement Unlock Animation (1.5 hours)

#### Component: `<UnlockCelebration />`
**Path**: `/components/achievements/unlock-celebration.tsx`
**Trigger**: Global event bus when achievement earned

```typescript
interface UnlockEvent {
  achievement: Achievement;
  emcoinReward: number;
  isFirstTime: boolean;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

// Animation sequence:
// 1. Screen flash matching rarity color
// 2. Badge slides in from top
// 3. Confetti explosion (legendary only)
// 4. EmCoin counter animates up
// 5. Auto-dismiss after 5 seconds
```

**Integration**:
- Use `framer-motion` for animations
- Play sound effect (if user enabled)
- Queue multiple unlocks
- Save to `user_achievements` table

### 🎯 PRIORITY 3: Progress Tracking Components (1.5 hours)

#### Component: `<AchievementProgress />`
**Path**: `/components/achievements/achievement-progress.tsx`

```typescript
// Visual progress indicators for different requirement types:
// - Count-based: "5/10 Debates Won" (progress bar)
// - Streak-based: "Day 3 of 7" (calendar dots)
// - Score-based: "850/1000 Points" (circular progress)
// - Special: Custom UI per achievement
```

#### Component: `<MilestoneTracker />`
**Path**: `/components/achievements/milestone-tracker.tsx`

```typescript
// Shows next 3 achievable milestones
// Sorted by closest to completion
// "You're 2 debates away from..." motivational text
```

### 🎯 PRIORITY 4: Leaderboard Widget (1 hour)

#### Component: `<AchievementLeaderboard />`
**Path**: `/components/achievements/achievement-leaderboard.tsx`

```typescript
// Mini leaderboard showing:
// - Top 5 achievement holders
// - Your rank
// - Friends' ranks (if friends system active)
// Focus on total achievement count + rarity points
```

### 📋 Session 168 Deliverables Checklist:
- [ ] `badge-card.tsx` - Individual badge display with states
- [ ] `unlock-celebration.tsx` - Achievement unlock animations
- [ ] `achievement-progress.tsx` - Progress indicators
- [ ] `milestone-tracker.tsx` - Next achievements to earn
- [ ] `achievement-leaderboard.tsx` - Competitive ranking
- [ ] Enhance existing `badge-gallery.tsx` to use new BadgeCard

---

## SESSION 169: ACTIVITY RUNTIME COMPLETION
**Focus**: Complete activity session management UI  
**Canvas**: `archive/legacy-canvas-work/001-5. seed.Activity Instance.canvas`

### 🎯 PRIORITY 1: Session Progress Tracker (2 hours)

#### Component: `<SessionProgress />`
**Path**: `/components/activities/session-progress.tsx`
**Purpose**: Multi-step progress indicator "Session 1 of 5"

```typescript
interface SessionProgressProps {
  activityId: string;
  currentSession: number;
  totalSessions: number;
  sessionStatuses: Array<'completed' | 'current' | 'upcoming' | 'locked'>;
}

// Visual requirements from Canvas:
// - Horizontal stepper on desktop
// - Numbered circles connected by lines
// - Checkmark for completed
// - Pulsing for current
// - Lock icon for locked sessions
```

**Database Integration**:
```sql
-- Use existing tables:
-- activity_session (all sessions)
-- session_progress (user's progress)
-- activity_instance (user's enrollment)
```

### 🎯 PRIORITY 2: Activity Dashboard (2 hours)

#### Component: `<ActivityDashboard />`
**Path**: `/components/activities/activity-dashboard.tsx`
**Purpose**: Overview of all user's activities

```typescript
interface DashboardSections {
  activeActivities: Activity[];    // Currently enrolled
  upcomingDeadlines: Assignment[]; // Due within 7 days
  completedActivities: Activity[]; // Finished
  recommendedActivities: Activity[]; // Not enrolled
}

// Layout:
// - Grid of activity cards
// - Filter by status/category
// - Sort by deadline/progress
// - Quick actions (continue, submit, review)
```

### 🎯 PRIORITY 3: Team/Role Selector (1 hour)

#### Component: `<TeamRoleSelector />`
**Path**: `/components/activities/team-role-selector.tsx`
**Canvas Reference**: Shows FE/BE/QB role selection

```typescript
interface TeamRole {
  role: 'frontend' | 'backend' | 'quarterback';
  description: string;
  spotsAvailable: number;
  teammates?: Profile[];
}

// Visual:
// - Card selection interface
// - Show current teammates
// - Role descriptions from Canvas
// - Lock after selection deadline
```

### 🎯 PRIORITY 4: Session Content Display (1.5 hours)

#### Component: `<SessionContent />`
**Path**: `/components/activities/session-content.tsx`

```typescript
interface SessionContentProps {
  sessionData: {
    title: string;
    content: any; // JSON from activity_session
    objectives: string[];
    resources?: Resource[];
  };
  allowEdit: boolean;
}

// Render content types:
// - Rich text (markdown)
// - Video embeds
// - Quiz questions
// - File downloads
// - External links
```

### 📋 Session 169 Deliverables Checklist:
- [ ] `session-progress.tsx` - Multi-step session tracker
- [ ] `activity-dashboard.tsx` - User's activity overview
- [ ] `team-role-selector.tsx` - Team formation UI
- [ ] `session-content.tsx` - Display session materials
- [ ] Integration with existing `activity-discovery.tsx`
- [ ] Integration with existing `activity-registration.tsx`

---

## SESSION 170: SOCIAL & PROFILE COMPLETION
**Focus**: Complete social features and profile enhancements  
**Canvas**: `archive/legacy-canvas-work/001-2. label.Communication, messages and Invitations.canvas`

### 🎯 PRIORITY 1: Friends List Component (2 hours)

#### Component: `<FriendsList />`
**Path**: `/components/social/friends-list.tsx`
**Database**: Use existing `friendship` table

```typescript
interface FriendsListProps {
  view: 'grid' | 'list';
  showOnlineStatus?: boolean;
  allowActions?: boolean;
}

// Features:
// - Online/offline indicators
// - Last seen time
// - Quick message button
// - Remove friend option
// - Mutual friends count
// - Search/filter friends
```

**States to Handle**:
```typescript
type FriendshipStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'EXPIRED' | 'CANCELLED';

// Different UI for:
// - Pending sent requests
// - Pending received requests  
// - Active friendships
// - Blocked users (future)
```

### 🎯 PRIORITY 2: Direct Messaging Interface (2 hours)

#### Component: `<DirectMessageChat />`
**Path**: `/components/social/direct-message-chat.tsx`
**Database**: Use existing `direct_messages` table

```typescript
interface ChatProps {
  recipientId: string;
  showHeader?: boolean;
  maxHeight?: string;
}

// Core features:
// - Real-time message updates (Supabase subscription)
// - Typing indicators
// - Read receipts (use read_at field)
// - Message input with emoji picker
// - Auto-scroll to bottom
// - Load more on scroll up
```

**Message Bubble Component**:
```typescript
// Different styles for:
// - Sent messages (right aligned, colored)
// - Received messages (left aligned, grey)
// - System messages (centered, subtle)
// - Timestamps on hover
```

### 🎯 PRIORITY 3: Friend Request Management (1 hour)

#### Component: `<FriendRequests />`
**Path**: `/components/social/friend-requests.tsx`

```typescript
interface RequestsProps {
  type: 'sent' | 'received' | 'all';
  compact?: boolean;
}

// UI Requirements:
// - Accept/Reject buttons for received
// - Cancel button for sent
// - Expire countdown timer
// - Mutual friends indicator
// - One-click accept all (with confirmation)
```

### 🎯 PRIORITY 4: Social Activity Feed (1.5 hours)

#### Component: `<SocialActivityFeed />`  
**Path**: `/components/social/activity-feed.tsx`

```typescript
interface ActivityItem {
  type: 'achievement' | 'friend_added' | 'activity_complete' | 'profile_update';
  user: Profile;
  timestamp: Date;
  data: any;
}

// Show recent activities from friends:
// - "X earned [Achievement Name]"
// - "X and Y are now friends"  
// - "X completed [Activity Name]"
// - "X updated their profile"
```

### 🎯 PRIORITY 5: Guardian Link System (If Time)

#### Component: `<GuardianLinkRequest />`
**Path**: `/components/social/guardian-link.tsx`
**Database**: Use `linked_players` table

```typescript
// Simplified version for V1:
// - Send link request by email
// - Show pending status
// - Display when linked
// - 6-player limit enforcement
```

### 📋 Session 170 Deliverables Checklist:
- [ ] `friends-list.tsx` - Display and manage friends
- [ ] `direct-message-chat.tsx` - Real-time messaging
- [ ] `friend-requests.tsx` - Request management
- [ ] `activity-feed.tsx` - Social updates
- [ ] `guardian-link.tsx` - Guardian connection (optional)
- [ ] API: Friend request endpoints
- [ ] WebSocket: Real-time message subscriptions

---

## INTEGRATION REQUIREMENTS

### Shared State Management
All sessions should add to the global store without modifying others' sections:

```typescript
// /contexts/global-state.tsx
interface GlobalState {
  // Session 167 adds:
  addiction: {
    streakCount: number;
    visitorCount: number;
    dailyBonusAvailable: boolean;
  };
  
  // Session 168 adds:
  achievements: {
    totalEarned: number;
    recentUnlock?: Achievement;
    showcaseIds: string[];
  };
  
  // Session 169 adds:
  activities: {
    activeCount: number;
    nextDeadline?: Date;
    currentSession?: SessionInfo;
  };
  
  // Session 170 adds:
  social: {
    friendCount: number;
    unreadMessages: number;
    pendingRequests: number;
  };
}
```

### Event Bus for Cross-Component Communication

```typescript
// /lib/event-bus.ts
// Session 167-170 all use this for notifications

eventBus.emit('achievement.unlocked', achievementData);
eventBus.emit('emcoin.earned', { amount, source });
eventBus.emit('friend.request.received', userData);
eventBus.emit('activity.completed', activityData);
```

### Shared Design Tokens (Already Defined)

```typescript
// /shared/design-tokens.ts
// All sessions must use these colors/spacing
// DO NOT create new color definitions
```

---

## API ENDPOINTS TO VERIFY

Before building, each session MUST verify their APIs exist:

### Session 167 APIs:
```bash
curl http://localhost:3000/api/user/streak
curl http://localhost:3000/api/emcoin/claim-daily
curl http://localhost:3000/api/user/visitors/today
```

### Session 168 APIs:
```bash
curl http://localhost:3000/api/achievements
curl http://localhost:3000/api/user/achievements
curl http://localhost:3000/api/achievements/leaderboard
```

### Session 169 APIs:
```bash
curl http://localhost:3000/api/activities
curl http://localhost:3000/api/user/activities  
curl http://localhost:3000/api/activity/[id]/progress
```

### Session 170 APIs:
```bash
curl http://localhost:3000/api/friends
curl http://localhost:3000/api/friends/requests
curl http://localhost:3000/api/messages
```

---

## SUCCESS CRITERIA

Each session is complete when:

1. ✅ All priority components built (at least P1-P3)
2. ✅ Components have loading/error/empty states
3. ✅ Integration with existing components works
4. ✅ Real data displays (not mock data)
5. ✅ No TypeScript errors
6. ✅ No console errors/warnings
7. ✅ Screenshots posted in Discord
8. ✅ PR created with evidence

---

## COORDINATION TOUCHPOINTS

### Before Starting (Each Session):
1. Read this spec completely
2. Check what other sessions have pushed
3. Verify your APIs exist
4. Post in Discord: "Session X starting [Component Name]"

### When Blocked:
1. Check if another session has the piece you need
2. Use mock data temporarily but mark with TODO
3. Post blocker in Discord immediately
4. Continue with next priority item

### End of Day:
1. Push whatever you have (even incomplete)
2. Post screenshot of progress
3. List any blockers or integration needs
4. Update this doc if specs need clarification

---

## QUESTIONS TO ASK COORDINATOR (Session 166)

Before implementing, each session should ask about:
- Specific Canvas interpretation questions
- API endpoint details if not working
- Integration approach with existing components
- Priority adjustments based on dependencies
- Design token usage for new patterns

---

**Document Status**: Ready for Review  
**Next Step**: Sessions 167-170 read all three documents and ask clarification questions  
**Expected Outcome**: 60-70% missing components completed in parallel execution

*Remember: Build what's specified here, using the HOW from the other documents. When in doubt, ask first, build second.*