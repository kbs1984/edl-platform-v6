---
session: "00147"
type: "handoff-guide"
status: "mandatory"
created: "2025-09-03"
title: "Mandatory Context for Build Sessions 148-149 - V5 Integration"
purpose: "Provide exact context loading sequence for sessions implementing v5 integration"
topics: ["context-loading", "v5-integration", "build-guide", "handoff"]
priority: "P0"
domain: "reconciliation"
---

# Mandatory Context for Build Sessions 148-149 - V5 Integration

## 🚨 CRITICAL: Load These Documents IN ORDER

### 1️⃣ Philosophy & Priorities (READ FIRST)
```bash
cat core/PRIORITY-REORDER-CANON.md                          # P0 = Identity/Engagement
cat reconciliation/00143-PRIORITY-ALIGNMENT-VALIDATION.md   # Cyworld priorities confirmed
```

### 2️⃣ The V5 Analysis (Session 147's Work)
```bash
# Complete v5 extraction with psychological mechanics
cat v5-extraction-250903.md                                 # 693 lines of proven patterns

# Session 147's technical documentation
cat reconciliation/00147-V5-COMPLETE-TECHNICAL-SPECIFICATION.md    # EXACT implementation
cat reconciliation/00147-V5-INTEGRATION-IMPLEMENTATION-PLAN.md     # Phase-by-phase plan
```

### 3️⃣ Architecture Strategy
```bash
cat reconciliation/00146-HYBRID-ARCHITECTURE-STRATEGY.md    # Next.js + Vanilla JS overlay
```

### 4️⃣ Current Database State
```bash
# Check what Session 143 already built
mcp__supabase-dev__list_tables(schemas=["public"])

# Verify EmCoin tables exist
mcp__supabase-dev__execute_sql(query="
  SELECT table_name 
  FROM information_schema.tables 
  WHERE table_schema = 'public' 
  AND table_name LIKE '%emcoin%' OR table_name LIKE '%achievement%' 
  OR table_name LIKE '%visitor%' OR table_name LIKE '%profile_customization%'
")
```

### 5️⃣ Session 144's Failed Components
```bash
# Review what NOT to repeat
ls reconciliation/active-work/dashboard/src/components/emcoin/
ls reconciliation/active-work/dashboard/src/components/profile/
# These components were built in isolation without understanding the addiction system
```

---

## 📋 Implementation Checklist for Sessions

### Session 148: Foundation & Addiction Bar
**Priority**: Create the persistent addiction mechanics

#### Required Tables to Create
```sql
-- MISSING - Must create these first:
CREATE TABLE linked_players (...)  -- See technical spec for exact schema
CREATE TABLE user_states (...)     -- Grey state system
```

#### Phase 1: Extract V5 Files
```bash
# Create directory for v5 engine
mkdir -p reconciliation/active-work/dashboard/public/v5-engine/

# Need to create these files based on specs:
- addiction-bar.js    # Use HTML/CSS from technical spec
- animations.js       # Use exact timings from spec
- config.js          # Use calibrated values from spec
- state-machines.js  # Grey state logic from spec
```

#### Phase 2: Modify Layout
```typescript
// app/layout.tsx - Add addiction bar mount point
<div id="v5-addiction-bar" className="fixed top-0 w-full z-50" />
```

#### Phase 3: Create Bridge
```typescript
// Data flow between React and vanilla JS
// See HYBRID-ARCHITECTURE-STRATEGY.md lines 147-169
```

### Session 149: Rewards & Customization
**Priority**: Complete the engagement loop

#### Implement Core Mechanics
1. Daily login bonus (10 EmCoins)
2. Streak system (with 24-hour at-risk)
3. Milestone celebrations (3-second duration)
4. Achievement unlocks
5. Profile customization UI

---

## ⚠️ Critical Warnings

### What v5 Had Wrong (Don't Copy)
```javascript
// ❌ NO error handling
// ❌ NO localStorage tamper protection
// ❌ NO timezone handling
// ❌ NO negative balance prevention
// ❌ NOT globally persistent (only dashboard)
```

### What Session 144 Did Wrong (Don't Repeat)
```javascript
// ❌ Built components in isolation
// ❌ No automatic animations on page load
// ❌ No localStorage for instant display
// ❌ Didn't understand complete addiction loop
```

### Sacred Constraints (MUST Preserve)
```javascript
// ✅ 6-player limit per supervisor
// ✅ Grey → Pending → Active state flow
// ✅ Exact animation timings (1.8s, 3s, 2s)
// ✅ Calibrated EmCoin values (10, 50, streak*5)
// ✅ 15% variable reward chance
```

---

## 🎯 Success Metrics

### Technical Validation
```javascript
describe('Addiction Mechanics', () => {
  it('displays addiction bar within 500ms');
  it('triggers animations within 2 seconds');
  it('persists across ALL pages');
  it('celebrates milestones for exactly 3 seconds');
  it('maintains 60fps during animations');
});
```

### Psychological Validation
- Users check daily (addiction loop working)
- Streak anxiety present (FOMO generation)
- Instant gratification (< 2 second dopamine)
- Social validation (today counter creates pride)

---

## 📚 Quick Reference

### Key Values (DON'T CHANGE)
```javascript
dailyLogin: 10
winDebate: 50  
dailyStreak: (streak) => Math.min(streak * 5, 50)
celebrationDuration: 3000
shameDuration: 2000
countUpEmcoin: 1800
```

### Key Concepts
- **Hybrid Architecture**: Next.js structure + vanilla JS psychology
- **0-10 Second Hook**: Dopamine within 2 seconds or fail
- **Four Pillars**: Today/Streak/EmCoins/Rank always visible
- **Grey State**: Everyone starts restricted

---

## 🚀 Session 148 Should Start With

1. Run reality check to verify database state
2. Create missing linked_players and user_states tables
3. Set up v5-engine directory structure
4. Modify root layout.tsx for global addiction bar
5. Test persistence across pages

## 🎯 Session 149 Should Complete

1. Wire up all reward mechanics
2. Implement achievement system
3. Add profile customization
4. Create celebration effects
5. Full validation suite

---

## 📞 If Questions Arise

The complete technical details are in:
- `00147-V5-COMPLETE-TECHNICAL-SPECIFICATION.md` (exact implementation)
- `00147-V5-INTEGRATION-IMPLEMENTATION-PLAN.md` (phased approach)
- `00146-HYBRID-ARCHITECTURE-STRATEGY.md` (integration method)

Session 147 has analyzed everything - follow the specs exactly for psychological fidelity.

---

*The addiction formula: Identity + Progress + FOMO + Instant Gratification = Addiction*

**Build for addiction, not functionality.**