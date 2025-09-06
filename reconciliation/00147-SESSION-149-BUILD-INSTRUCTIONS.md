---
session: "00147"
type: "build-instructions"
status: "mandatory"
created: "2025-09-03"
title: "Session 149 Build Instructions - Complete Addiction Loop & Puppeteer Testing"
purpose: "Provide complete context and instructions for Session 149 to finish addiction mechanics"
topics: ["build-instructions", "addiction-testing", "puppeteer", "state-machine"]
priority: "P0"
domain: "reconciliation"
handoff_from: "Session 148"
---

# Session 149 Build Instructions - Complete Addiction Loop & Puppeteer Testing

## 🎯 Session 149 Mission

**Primary Goal**: Complete the addiction loop implementation and validate psychological impact using Puppeteer testing with existing test users.

**Status from Session 148**: Core addiction mechanics ✅ COMPLETE. Variable rewards ✅ WORKING. Real data ✅ CONNECTED.

---

## 📚 Critical Context Loading (Load in Order)

### 1. Load Session 147's Foundation Work
```bash
cat reconciliation/00147-MANDATORY-CONTEXT-FOR-BUILD-SESSIONS.md
cat reconciliation/00147-V5-COMPLETE-TECHNICAL-SPECIFICATION.md
cat reconciliation/00147-V5-INTEGRATION-IMPLEMENTATION-PLAN.md
```

### 2. Review Session 148's Completed Work
```bash
cat reconciliation/00148-ADDICTION-BAR-IMPLEMENTATION-REPORT.md
cat reconciliation/00148-FOLLOW-UP-PSYCHOLOGY-FIXES.md
```

### 3. Check Current Implementation Status
```bash
# Verify Session 148's files exist:
ls reconciliation/active-work/dashboard/public/v5-engine/
ls reconciliation/active-work/dashboard/src/components/addiction/

# Check database tables:
mcp__supabase-dev__list_tables(schemas=["public"])
```

---

## 🚀 Phase A: State Machine UI Implementation (45 minutes)

### What's Missing from Session 148
Session 148 created the database tables but didn't build the UI for state transitions.

### Task 1: Grey State User Interface (15 minutes)
Create: `src/components/auth/grey-state-handler.tsx`

```typescript
// Show different UI based on user state
interface GreyStateProps {
  userState: 'grey' | 'pending' | 'active';
  onRequestSupervisor?: () => void;
}

// Grey users see: "Request Supervisor" button + explanation
// Pending users see: "Awaiting Approval" status + progress
// Active users see: Full dashboard access
```

### Task 2: Supervisor Approval Flow (20 minutes)
Create: `src/app/(user-pages)/supervisor/approve-players/page.tsx`

```typescript
// List pending player requests
// One-click approval (triggers 50 EmCoin welcome bonus)
// Shows "4/6 Players" count
// Enforces 6-player limit in UI
```

### Task 3: Welcome Bonus Trigger (10 minutes)
Create database function to auto-award 50 EmCoins on approval:

```sql
-- Trigger when linked_players.status changes to 'active'
CREATE OR REPLACE FUNCTION trigger_welcome_bonus()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'active' AND OLD.status = 'pending' 
     AND NOT NEW.welcome_bonus_paid THEN
    -- Award 50 EmCoins
    -- Mark bonus as paid
    -- Log transaction
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

---

## 🧪 Phase B: Puppeteer Addiction Testing (1 hour)

### Why Puppeteer Testing?
We can programmatically test the addiction mechanics with existing test users without needing human validation.

### Test Users Available in Supabase
```sql
-- Check existing test users:
SELECT id, email, name FROM auth.users 
WHERE email LIKE '%test%' OR email LIKE '%demo%'
LIMIT 5;
```

### Task 4: Create Addiction Test Suite (30 minutes)
Create: `tests/addiction-mechanics.puppeteer.js`

```javascript
// Test the 0-10 second addiction hook
describe('V5 Addiction Mechanics', () => {
  test('Dopamine trigger < 2 seconds', async () => {
    // Load dashboard
    // Measure time to first animation
    // Verify < 2000ms
    // Check all 4 pillars animate
  });

  test('Variable rewards trigger surprise', async () => {
    // Simulate actions that earn EmCoins
    // Check console for "BONUS!" messages
    // Verify celebrations trigger
    // Test 15% probability over 20 trials
  });

  test('Real data creates ownership', async () => {
    // Verify EmCoin balance matches database
    // Check today visitor count increments
    // Confirm streak calculation accuracy
  });

  test('LocalStorage provides instant display', async () => {
    // Clear cache, reload page
    // Measure time to first display
    // Verify < 500ms before API call
  });
});
```

### Task 5: Psychological Validation Tests (20 minutes)
```javascript
// Advanced addiction tests
test('FOMO generation', async () => {
  // Check if visitor count creates curiosity
  // Verify streak anxiety at 20+ hours
  // Test milestone celebration timing
});

test('Persistent addiction bar', async () => {
  // Navigate between pages
  // Verify bar stays visible and updates
  // Check cross-page state persistence
});
```

### Task 6: Performance Validation (10 minutes)
```javascript
test('Animation performance', async () => {
  // Monitor frame rate during animations
  // Verify 60fps maintenance
  // Check memory usage during counting
});
```

---

## 📊 Phase C: Results Analysis & Documentation (30 minutes)

### Task 7: Generate Test Results (15 minutes)
```bash
npm run test:addiction  # Run the Puppeteer tests
```

Expected output:
- Dopamine timing: < 2000ms ✅
- Variable rewards: 15% frequency ✅
- Performance: 60fps maintained ✅
- Psychological hooks: FOMO generated ✅

### Task 8: Create Validation Report (15 minutes)
Document:
1. Test results with screenshots
2. Performance metrics
3. Psychological impact validation
4. Any issues found
5. Comparison with Session 144's failed approach

---

## 🔧 Implementation Details

### Database Functions to Create
```sql
-- From Session 148's plan:
1. calculate_user_streak(p_user_id UUID)
2. record_profile_visit(p_profile_id UUID, p_visitor_id UUID)
3. award_daily_bonus(p_user_id UUID)
4. validate_emcoin_update(p_user_id UUID, p_amount NUMERIC)
```

### Server Actions Needed
```typescript
// These may already exist from Session 148:
1. requestSupervisorLink()
2. approvePendingPlayer()
3. calculateStreak()
4. awardWelcomeBonus()
```

---

## ⚠️ Critical Success Criteria

### Technical Validation
- [ ] Grey state UI prevents restricted actions
- [ ] Supervisor approval flow works end-to-end
- [ ] Welcome bonus awards correctly (50 EmCoins)
- [ ] All Puppeteer tests pass

### Psychological Validation  
- [ ] Dopamine hit occurs < 2 seconds after page load
- [ ] Variable rewards create surprise dopamine
- [ ] Real data creates ownership feeling
- [ ] Persistence creates omnipresent addiction

### Performance Validation
- [ ] 60fps during animations
- [ ] < 500ms to first display
- [ ] No memory leaks during testing

---

## 🚨 What NOT to Change

### Sacred Values (DO NOT MODIFY)
```javascript
// From config.js - these are psychologically calibrated:
countUpEmcoin: 1800     // Exactly 1.8 seconds
celebration: 3000       // Exactly 3 seconds  
dailyLogin: 10         // Base reward amount
maxLinkedPlayers: 6    // Sacred supervision limit
```

### Architecture (DO NOT CHANGE)
- Keep hybrid approach (Next.js + vanilla JS)
- Don't convert to pure React
- Preserve LocalStorage caching strategy
- Maintain global persistence model

---

## 📋 Testing Strategy with Existing Users

### Available Test Users
Check Supabase auth.users table for test accounts. Use these for automated testing.

### Puppeteer Test Scenarios
1. **New User Journey**: Grey → Request → Approval → First dopamine
2. **Daily User**: Login → Check addiction bar → Earn rewards
3. **Streak User**: Multiple days → Milestone celebration
4. **Variable Rewards**: Multiple actions → Bonus triggers

### Test Data to Capture
- Time to first dopamine hit
- Variable reward frequency
- Animation performance metrics
- User state transition success rate
- Cross-page persistence validation

---

## 🎯 Expected Session 149 Deliverables

### Code Files
1. `grey-state-handler.tsx` - State-based UI
2. `approve-players/page.tsx` - Supervisor flow
3. Database functions for state transitions
4. `addiction-mechanics.puppeteer.js` - Test suite

### Documentation
1. Puppeteer test results with screenshots
2. Performance benchmarks
3. Psychological validation report
4. State machine UI documentation

### Validation
1. All addiction mechanics working end-to-end
2. Puppeteer tests proving psychological impact
3. Performance meeting 60fps requirement
4. Complete user flow validation

---

## 🔥 The Ultimate Test

At the end of Session 149, we should be able to say:

> "A test user can load the dashboard, experience dopamine within 2 seconds, feel ownership of their progress, get surprised by bonus rewards, and want to check their stats again tomorrow."

**If Puppeteer tests confirm this psychological loop works, the v5 integration is complete!**

---

*Session 149: Complete the addiction formula and prove it works* ✅