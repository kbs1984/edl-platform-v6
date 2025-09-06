---
session: "00147"
type: "technical-specification"
status: "authoritative"
created: "2025-09-03"
title: "V5 Complete Technical Specification - Exact Implementation Details"
purpose: "Document the complete v5 implementation details for accurate v6 integration"
topics: ["v5-extraction", "technical-specs", "state-machines", "addiction-mechanics"]
priority: "P0"
domain: "reconciliation"
based_on: ["v5-extraction-250903.md", "v5-session-responses"]
---

# V5 Complete Technical Specification - Exact Implementation Details

## Executive Summary

This document captures the complete technical implementation from v5, including the critical state-machines.js logic, exact DOM structures, and calibrated configuration values. These specifications enable v6 to faithfully reproduce v5's proven addiction mechanics.

---

## 🔐 The Grey State System

### State Definitions
```javascript
// Complete state machine from v5
const USER_STATES = {
  GREY: 'grey',           // Unverified, limited access
  PENDING: 'pending',     // Awaiting approval
  ACTIVE: 'active',       // Full access
  SUSPENDED: 'suspended', // Temporary restriction  
  INACTIVE: 'inactive'    // No activity for 90 days
};
```

### State Transitions

#### Grey → Pending Triggers
- **Player**: Requests supervisor link
- **Supervisor**: Submits payment
- **Enabler**: Starts certification

#### Pending → Active Triggers
- **Player**: Supervisor approves link (+ 50 emCoins welcome bonus)
- **Supervisor**: Payment clears
- **Enabler**: Completes certification

### Grey State Restrictions
```javascript
// What's BLOCKED in grey state:
const GREY_STATE_BLOCKS = [
  'join_activities',
  'earn_emcoins',     // Except welcome bonus
  'access_teams',
  'send_messages',
  'create_content'
];

// What's ALLOWED:
const GREY_STATE_ALLOWS = [
  'profile_setup',
  'browse_content',
  'request_supervisor'
];
```

---

## 👥 The Sacred 6-Player Limit

### Database Schema
```sql
CREATE TABLE linked_players (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  supervisor_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  player_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'removed')),
  linked_at TIMESTAMPTZ DEFAULT NOW(),
  approved_at TIMESTAMPTZ,
  removed_at TIMESTAMPTZ,
  removal_reason TEXT,
  UNIQUE(player_id), -- Player can only have ONE supervisor
  CHECK (supervisor_id != player_id)
);
```

### Enforcement Logic
```javascript
async function checkPlayerLimit(supervisorId) {
  const { data: linkedCount } = await supabase
    .from('linked_players')
    .select('id')
    .eq('supervisor_id', supervisorId)
    .eq('status', 'active');

  if (linkedCount && linkedCount.length >= 6) {
    throw new Error('Supervisor already has maximum 6 linked players. This ensures quality supervision.');
  }
}
```

### UI Display
```html
<span id="playerCount">4</span>/6 Players
<div class="info-text">
  ℹ️ You can supervise up to 6 players for optimal oversight and support
</div>
```

**Critical Notes**:
- NO waiting list mechanism
- Hard limit with error message
- CASCADE DELETE removes all player data if supervisor removed

---

## 🎯 The Addiction Bar - Exact Implementation

### HTML Structure
```html
<div class="addiction-bar">
  <div class="addiction-item">
    <span class="addiction-icon today-counter">👁️</span>
    <div>
      <div class="addiction-value" id="todayCount">0</div>
      <div class="addiction-label">Today Visitors</div>
    </div>
  </div>
  
  <div class="addiction-item">
    <span class="addiction-icon streak-fire">🔥</span>
    <div>
      <div class="addiction-value" id="streakCount">0</div>
      <div class="addiction-label">Day Streak</div>
    </div>
  </div>
  
  <div class="addiction-item">
    <span class="addiction-icon">🪙</span>
    <div>
      <div class="addiction-value" id="emCoinBalance">0</div>
      <div class="addiction-label">emCoins</div>
    </div>
  </div>
  
  <div class="addiction-item">
    <span class="addiction-icon">🏆</span>
    <div>
      <div class="addiction-value" id="rankPosition">#--</div>
      <div class="addiction-label">Division Rank</div>
    </div>
  </div>
</div>
```

### CSS Implementation
```css
/* IMPORTANT: NOT position: fixed - only in dashboard header */
.addiction-bar {
  display: flex;
  gap: 2rem;
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 0.75rem;
  backdrop-filter: blur(10px);
}

/* Today counter glow animation */
.today-counter {
  animation: glow 2s ease-in-out infinite alternate;
}

@keyframes glow {
  from { text-shadow: 0 0 10px rgba(255, 193, 7, 0.5); }
  to { text-shadow: 0 0 20px rgba(255, 193, 7, 0.8); }
}

/* Streak fire flicker */
.streak-fire {
  animation: flicker 1.5s infinite alternate;
}

@keyframes flicker {
  0%, 100% { transform: scale(1) rotate(-2deg); }
  50% { transform: scale(1.1) rotate(2deg); }
}
```

---

## 🎊 Celebration Mechanics

### Milestone Celebration
```javascript
function celebrateStreakMilestone(days) {
  const fire = document.querySelector('.streak-fire');
  
  // Inline styles for celebration
  fire.style.fontSize = '3rem';  // 2x size
  fire.style.color = 'gold';      // Gold color
  
  // Reset after exactly 3 seconds
  setTimeout(() => {
    fire.style.fontSize = '1.5rem';
    fire.style.color = '';
  }, 3000);
}
```

**Reality Check**:
- NO confetti/particles implemented
- NO audio/sound effects
- NO celebration spam prevention
- Just size and color changes

---

## 💾 LocalStorage Strategy

### Complete Key Schema
```javascript
const LOCAL_STORAGE_KEYS = {
  'user': {},                    // User object
  'today_[date]': 0,            // Today counter per date
  'lastVisit': '2025-09-03',    // Last visit date for streak
  'streak': 0,                  // Current streak count
  'emCoinBalance': 0,           // EmCoin balance (DEMO only)
  'edl_session_token': '',      // Session management
  'edl_session_id': '',         // Session ID
  'edl_session_expires': '',    // Session expiration
  'chamber-theme': 'default'    // Selected theme
};
```

### Critical Issues
- **NO sync strategy** - localStorage is primary until API call
- **NOT tamper-proof** - emCoins editable in localStorage
- **NO conflict resolution** - API overwrites localStorage

---

## 🪙 Complete EmCoin Configuration

### Earn Rates (CALIBRATED - Don't Change!)
```javascript
const EARN_RATES = {
  // Passive engagement
  dailyLogin: 10,
  profileVisit: 2,
  
  // Active participation
  winDebate: 50,
  viralClip: 50,
  friendJoins: 100,
  
  // Streak rewards
  dailyStreak: (streak) => Math.min(streak * 5, 50), // Max 50
  monthlyLeader: 500,
  
  // Limits
  dailyLimit: 500,
  hourlyLimit: 100
};
```

### Variable Reward System
```javascript
const BONUS_CONFIG = {
  bonusChance: 0.15,  // 15% chance
  bonusMultiplier: { 
    min: 1.5, 
    max: 3.0 
  }
};

// Implementation NOT found in v5
// Should be: Math.random() < 0.15 ? baseAmount * (1.5 + Math.random() * 1.5) : baseAmount
```

---

## 🎯 Animation Timings (EXACT)

```javascript
const ANIMATION_TIMINGS = {
  slideDown: 500,        // Bar entrance
  scaleIncrement: 200,   // Today counter bump
  countUpEmcoin: 1800,   // EmCoin counting
  countUpStreak: 1500,   // Streak counting
  countUpToday: 2000,    // Today visitor count
  celebration: 3000,     // Milestone party
  shame: 2000,          // Broken streak
  shake: 500            // Error feedback
};
```

### Count Animation Function
```javascript
function animateValue(id, start, end, duration) {
  const element = document.getElementById(id);
  const range = end - start;
  const increment = range / (duration / 16); // 60fps
  let current = start;
  
  const timer = setInterval(() => {
    current += increment;
    element.textContent = Math.floor(current);
    
    if (current >= end) {
      element.textContent = end;
      clearInterval(timer);
    }
  }, 16);
}
```

---

## ⚠️ Critical Edge Cases & Failures

### What v5 DOESN'T Handle
1. **Streak recovery failure** - No error handling, user loses streak
2. **Timezone changes** - Uses local time, streak breaks on timezone change
3. **Supervisor removes player** - CASCADE DELETE removes ALL data
4. **Negative emCoin balance** - NOT prevented in code
5. **User reset** - No reset mechanism implemented
6. **Celebration spam** - Can trigger multiple celebrations
7. **localStorage tampering** - EmCoins editable by user

### Example of Missing Error Handling
```javascript
// v5's approach - NO error handling
function initStreakTracker() {
  // No try-catch blocks
  // No validation
  // No error recovery
  const lastVisit = localStorage.getItem('lastVisit');
  const streak = parseInt(localStorage.getItem('streak'));
  // Continues assuming everything works...
}
```

---

## 🏗️ What v6 Must Add

### Required Safety Tables
```sql
-- User state tracking
CREATE TABLE user_states (
  user_id UUID PRIMARY KEY REFERENCES profiles(id),
  state TEXT CHECK (state IN ('grey', 'pending', 'active', 'suspended', 'inactive')),
  state_changed_at TIMESTAMPTZ DEFAULT NOW(),
  activated_at TIMESTAMPTZ,
  activated_by UUID REFERENCES profiles(id)
);

-- State transition history
CREATE TABLE state_transitions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id),
  from_state TEXT,
  to_state TEXT,
  reason TEXT,
  transitioned_at TIMESTAMPTZ DEFAULT NOW(),
  transitioned_by UUID REFERENCES profiles(id)
);
```

### Required Error Handling
```javascript
// v6 should add:
try {
  const streak = await calculateStreak(userId);
  if (streak.needsRecovery && user.emcoins >= 100) {
    await offerStreakRecovery(userId);
  }
} catch (error) {
  console.error('Streak calculation failed:', error);
  // Fallback to cached value
  return getCachedStreak(userId);
}
```

---

## ✅ Implementation Checklist

### Phase 1: Foundation
- [ ] Create linked_players table with 6-player constraint
- [ ] Create user_states table for grey system
- [ ] Implement state machine transitions
- [ ] Add supervisor approval flow

### Phase 2: Addiction Bar
- [ ] Copy exact HTML structure
- [ ] Implement CSS animations (glow, flicker)
- [ ] Add localStorage for instant display
- [ ] Wire up countUp animations

### Phase 3: Rewards System
- [ ] Implement exact earn rates
- [ ] Add variable reward calculation
- [ ] Create milestone detection
- [ ] Add celebration triggers

### Phase 4: Edge Cases
- [ ] Add timezone handling
- [ ] Implement streak recovery
- [ ] Prevent negative balances
- [ ] Add error recovery

---

## 🎯 The Formula (Preserved)

**Identity + Progress + FOMO + Instant Gratification = Addiction**

All technical decisions must serve this formula. The exact timings, values, and mechanics documented here have been psychologically calibrated through v5's user testing.

---

*Session 147 - Complete technical extraction for faithful v6 implementation*