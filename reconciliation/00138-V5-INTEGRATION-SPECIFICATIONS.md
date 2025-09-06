---
session: "00138"
type: "integration-specification"
status: "authoritative"
created: "2025-09-02"
title: "V5 Integration Specifications - Exact Schemas and UI Patterns"
purpose: "Document v5's proven implementations for integration into v6's solid backend"
topics: ["v5-integration", "emcoin-schema", "gaming-mechanics", "ui-patterns"]
priority: "P1"
domain: "reconciliation"
source: "v5 session analysis by user"
verified: "Session 138"
---

# V5 Integration Specifications - Exact Schemas and UI Patterns

## Executive Summary

Session 138 obtained the exact implementation details from v5's working code. This document captures the proven schemas, UI patterns, and gaming mechanics that must be integrated into v6's solid backend foundation.

**Key Insight**: v5 had working 16,000+ lines of frontend with proven engagement mechanics, but failed due to backend schema mismatches. v6 has the solid backend v5 lacked - now we can merge the best of both.

---

## 🗄️ Database Schema Requirements

### EmCoin Economy Tables

#### 1. `emcoin_transactions` Table
**Source**: `/lib/supabase-edl.js` lines 386-484
```sql
CREATE TABLE emcoin_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  to_user uuid REFERENCES auth.users(id),
  from_user uuid REFERENCES auth.users(id), 
  amount integer NOT NULL,
  transaction_type text CHECK (transaction_type IN (
    'daily_login',
    'achievement', 
    'activity_fee',
    'streak_bonus'
  )),
  description text,
  activity_id uuid REFERENCES activity(id),
  created_at timestamptz DEFAULT now()
);
```

#### 2. `achievements` Table  
**Source**: `/lib/supabase-edl.js` lines 553-643
```sql
CREATE TABLE achievements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text UNIQUE NOT NULL,
  name text NOT NULL,
  description text,
  emcoin_reward integer DEFAULT 0,
  category text,
  created_at timestamptz DEFAULT now()
);
```

#### 3. `user_achievements` Table
**Source**: `/lib/supabase-edl.js` lines 593-597  
```sql
CREATE TABLE user_achievements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  achievement_id uuid REFERENCES achievements(id),
  earned_at timestamptz DEFAULT now(),
  UNIQUE(user_id, achievement_id)
);
```

#### 4. Profile Extensions
**Source**: `/lib/supabase-edl.js` lines 82-117
```sql
-- Add to existing profile table:
ALTER TABLE profile ADD COLUMN IF NOT EXISTS emcoin_balance integer DEFAULT 0;
ALTER TABLE profile ADD COLUMN IF NOT EXISTS streak_days integer DEFAULT 0;
ALTER TABLE profile ADD COLUMN IF NOT EXISTS last_login_date date;
```

---

## 🎮 Gaming Mechanics Implementation

### Streak System with Escalating Rewards
**Source**: `/lib/state-machines.js` lines 830-838

```javascript
const STREAK_MILESTONES = {
  3:   { emcoins: 10,   badge: 'streak_starter' },
  7:   { emcoins: 50,   badge: 'week_warrior' },
  14:  { emcoins: 100,  badge: 'fortnight_fighter' },
  30:  { emcoins: 200,  badge: 'monthly_master', theme: 'golden_chamber' },
  60:  { emcoins: 500,  badge: 'bimonthly_boss' },
  100: { emcoins: 1000, badge: 'centurion', music: 'victory_anthem' },
  365: { emcoins: 5000, badge: 'annual_legend', title: 'EDL Legend' }
};
```

### Achievement Codes from v5
**Source**: `/lib/state-machines.js` lines 421-447
- `first_steps` - Complete onboarding
- `week_warrior` - 7-day streak  
- `centurion` - 100-day streak
- `certified_enabler` - Help 5 students

### State Machine Patterns
**Source**: `/lib/state-machines.js` lines 104-134
```javascript
// User Lifecycle: Grey → Pending → Active
// Activity Lifecycle: Draft → Active → Completed → Archived  
// Streak Lifecycle: Fresh → Building → Milestone → Recovery
// Payment Lifecycle: Pending → Processing → Complete → Failed
```

---

## 🎨 UI Patterns and Components

### The "Addiction Mechanics Bar"
**Source**: `/pages/player-dashboard.html` lines 303-334

```html
<div class="addiction-bar">
  <div class="addiction-item">
    <span class="icon">👁️</span>
    <span class="label">Today Visitors</span>
    <span class="value" id="visitors-count">--</span>
  </div>
  <div class="addiction-item">
    <span class="icon">🔥</span>
    <span class="label">Day Streak</span>
    <span class="value" id="streak-count">--</span>
  </div>
  <div class="addiction-item">
    <span class="icon">🪙</span>
    <span class="label">emCoins</span>
    <span class="value" id="emcoin-balance">--</span>
  </div>
  <div class="addiction-item">
    <span class="icon">🏆</span>
    <span class="label">Division Rank</span>
    <span class="value" id="division-rank">--</span>
  </div>
</div>
```

### Dashboard Grid Architecture
**Source**: `/pages/player-dashboard.html` lines 102-285
```css
.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  padding: 1rem;
}

.dashboard-card {
  background: var(--card-bg);
  border-radius: 12px;
  padding: 1.5rem;
  transition: transform 0.2s, box-shadow 0.2s;
}

.dashboard-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0,0,0,0.15);
}
```

### Real-time Update Patterns
**Source**: `/pages/player-dashboard.html` lines 586-1076
```javascript
// WebSocket integration for live updates
const subscriptions = {
  emcoin_balance: supabase.channel('user-emcoins')
    .on('postgres_changes', { table: 'emcoin_transactions' }, updateBalance),
  streak_progress: supabase.channel('user-streaks')  
    .on('postgres_changes', { table: 'profile' }, updateStreak),
  achievements: supabase.channel('user-achievements')
    .on('postgres_changes', { table: 'user_achievements' }, showAchievement)
};
```

---

## 📊 Integration Priority Mapping

### Phase 1: Backend Foundation (P1.1 - EmCoin Economy)
**Estimated**: 2 sessions (4-6 hours with MCP Enhanced Workflow)

1. **Create EmCoin Tables** (Session 139)
   - `emcoin_transactions` with proper foreign keys
   - `achievements` with proven milestone structure
   - `user_achievements` tracking
   - Profile extensions for balance/streak

2. **Implement Core Gaming Logic** (Session 140)
   - Daily login streak tracking
   - Milestone reward system
   - Transaction processing
   - Balance calculations

### Phase 2: UI Integration (P1.2 - Dashboard Widgets)
**Estimated**: 3 sessions (6-9 hours)

1. **Addiction Mechanics Bar** (Session 141)
   - Real-time balance display
   - Streak counter with fire effects
   - Division ranking display
   - Today's visitor count

2. **Achievement System UI** (Session 142)
   - Badge unlock animations
   - Progress tracking bars
   - Milestone celebration effects
   - Achievement history

3. **Dashboard Grid System** (Session 143)
   - Card-based layout with hover effects
   - Responsive breakpoints
   - Modular widget architecture
   - Real-time WebSocket integration

### Phase 3: Advanced Gaming Features (P1.3)
**Estimated**: 2 sessions (4 hours)

1. **State Machine Integration** (Session 144)
   - User lifecycle progression
   - Activity state management
   - Streak recovery mechanics

2. **Enhanced UX Features** (Session 145)
   - Theme unlocks (golden_chamber)
   - Victory music integration
   - Title/badge display system
   - Social comparison features

---

## 🔍 Verification References

### Critical Files from v5 (Exact Line Numbers)

1. **EmCoin Economy Implementation**
   - `/lib/supabase-edl.js` lines 386-484 (EDLEmCoin class)
   - `/lib/state-machines.js` lines 830-838 (milestone definitions)
   - `/pages/player-dashboard.html` lines 320-325 (emCoin display)

2. **Gaming Progression System**
   - `/lib/state-machines.js` lines 817-1117 (StreakStateMachine)
   - `/pages/player-dashboard.html` lines 545-565 (streak celebration)

3. **UI Architecture Patterns**
   - `/pages/player-dashboard.html` lines 102-285 (CSS grid system)
   - `/pages/player-dashboard.html` lines 1145-1439 (modal/component styles)

4. **Achievement/Badge System**
   - `/lib/supabase-edl.js` lines 573-577 (achievement queries)
   - `/pages/SESSION-01.15-ACHIEVEMENT-DASHBOARD.html` lines 1-150

### Verification Commands
```bash
# Find all emCoin references in v5
grep -r "emcoin" /lib/ /pages/ --include="*.js" --include="*.html"

# Find achievement/badge references  
grep -r "achievement\|badge" /lib/ /pages/ --include="*.js" --include="*.html"

# Find state machine implementations
grep -r "StateMachine\|milestone" /lib/ --include="*.js"
```

---

## 🚀 Implementation Strategy

### Why This Integration Will Succeed

1. **v5's Proven Engagement**: 46 emCoin references, addiction mechanics, streak systems
2. **v6's Solid Foundation**: Working auth, proper RLS, table relationships  
3. **Canvas Wireframes**: Your UI specifications guide implementation
4. **MCP Enhanced Workflow**: 4-6x faster implementation speed

### Success Metrics
- **User Engagement**: Daily login streaks, emCoin transactions
- **Feature Adoption**: Achievement unlock rates, milestone completions  
- **System Performance**: Real-time updates without 95% syndrome
- **Implementation Speed**: 2-3 sessions per major feature vs. v5's months

---

## 💡 Key Implementation Notes

### Critical Success Factors
1. **Build backend tables FIRST** - v5's core failure was schema mismatches
2. **Use exact v5 schemas** - Don't improvise, use proven structures
3. **Test with real data** - Follow Session 137's testing approach
4. **Implement real-time last** - Avoid 95% syndrome

### Integration with Existing v6 Features
- **Activity Runtime**: Connect emCoin rewards to activity completion
- **Friends System**: Social comparison of streaks and achievements  
- **Guardian Dashboard**: Parent visibility into child's progress/rewards
- **Chat System**: Achievement announcements and celebrations

---

*Session 138 v5 Integration Specifications*  
*The blueprint for merging v5's proven engagement with v6's solid foundation*