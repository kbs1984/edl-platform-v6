---
session: "00138"  
type: "implementation-roadmap"
status: "active"
created: "2025-09-02"
title: "V5→V6 Integration Roadmap - Implementation Priority Stack"
purpose: "Translate v5 specifications into v6 implementation phases"
topics: ["v5-integration", "implementation-plan", "emcoin-priority"]
priority: "P1"
domain: "reconciliation"
based_on: ["00138-V5-INTEGRATION-SPECIFICATIONS.md"]
---

# V5→V6 Integration Roadmap - Implementation Priority Stack

## Executive Summary

With v5's exact specifications captured, we now have a clear roadmap to integrate proven engagement systems into v6's solid backend foundation. This roadmap prioritizes backend tables first (learning from v5's schema mismatch failure).

---

## 🎯 IMMEDIATE PRIORITY: Session 139-140 (Next 2 Sessions)

### Session 139: EmCoin Backend Foundation
**Estimated Time**: 2 hours with MCP Enhanced Workflow  
**Goal**: Create the 4 EmCoin tables that 46+ v5 references depended on

**Database Work**:
```sql
-- Priority order based on v5 dependencies:
1. emcoin_transactions table (most referenced - 15+ times)
2. achievements table (milestone system foundation) 
3. user_achievements table (tracking earned badges)
4. Profile extensions (emcoin_balance, streak_days fields)
```

**Validation**:
- Create test data for streak milestones (3, 7, 14, 30, 100, 365)
- Verify achievement codes work (first_steps, week_warrior, centurion)
- Test emCoin transaction flows
- Confirm RLS policies secure user data

### Session 140: Gaming Mechanics Engine  
**Estimated Time**: 2 hours with MCP Enhanced Workflow
**Goal**: Implement v5's proven streak and achievement logic

**Server Actions**:
```typescript
// Based on v5's state-machines.js patterns:
- calculateDailyStreak() - Daily login tracking
- awardMilestoneRewards() - Streak milestone system
- processEmCoinTransaction() - Transaction handling
- checkAchievementUnlocks() - Badge progression
```

**Testing**:
- Simulate 7-day streak progression 
- Test milestone rewards at each level
- Verify emCoin balance updates
- Test achievement unlock triggers

---

## 🎨 PHASE 2: UI Integration (Sessions 141-143)

### Session 141: The Addiction Mechanics Bar
**Goal**: Implement v5's proven engagement UI
```typescript
// Components to build:
- <AddictionBar /> - Fixed top bar with 4 metrics
- <EmCoinDisplay /> - Real-time balance with animations
- <StreakCounter /> - Fire effect for consecutive days
- <DivisionRank /> - Competitive ranking display
```

### Session 142: Achievement System UI
**Goal**: Badge unlocks and progress tracking
```typescript  
- <AchievementCard /> - Individual badge display
- <ProgressTracker /> - Visual milestone progress
- <UnlockAnimation /> - Celebration effects
- <AchievementHistory /> - Earned badges gallery
```

### Session 143: Dashboard Grid System
**Goal**: v5's modular card-based layout
```typescript
- <DashboardGrid /> - Responsive auto-fit layout
- <HoverCards /> - Transform effects on interaction
- <RealTimeUpdates /> - WebSocket integration
- <ModularWidgets /> - Pluggable component system
```

---

## 🔄 PHASE 3: Advanced Features (Sessions 144-145)

### Session 144: State Machine Integration
**Goal**: Implement v5's lifecycle progression
- User states: Grey → Pending → Active
- Activity states: Draft → Active → Completed → Archived
- Streak recovery mechanics for missed days

### Session 145: Enhanced UX Features  
**Goal**: v5's advanced engagement features
- Theme unlocks (golden_chamber at 30-day streak)
- Victory music triggers (victory_anthem at 100 days)
- Social comparison features
- Title system (EDL Legend at 365 days)

---

## 📊 Integration with Existing v6 Features

### Activity Runtime ENGINE Connection
**Current**: Session 137 built US-155-159 (activity structure)
**Integration**: Connect activity completion to emCoin rewards
```typescript
// Extend existing activity-actions.ts:
completeSession() → awardEmCoins() → checkMilestoneProgress()
```

### Friends System Connection  
**Current**: Real-time WebSocket system works
**Integration**: Social streak comparison and achievement sharing
```typescript
// Extend use-friends.ts:
friendsChannel.on('achievement_unlocked', showCelebration)
```

### Guardian Dashboard Connection
**Current**: Guardian system fixed in Session 135
**Integration**: Parent visibility into child's progress/rewards
```typescript
// Extend guardian-actions.ts:
getChildProgress() → includeEmCoinHistory() → showAchievements()
```

---

## 🎮 Why This Roadmap Will Succeed

### Learning from v5's Failure
1. **Backend First**: Create tables before UI (v5's core mistake)
2. **Exact Schemas**: Use proven v5 table structures, don't improvise
3. **Test with Real Data**: Follow Session 137's validation approach
4. **Avoid 95% Syndrome**: Real-time features added last

### Building on v6's Strengths
1. **Solid Foundation**: Working auth, RLS, proper relationships
2. **MCP Enhanced Workflow**: 4-6x faster implementation
3. **Canvas Wireframes**: Your UI specifications as guides
4. **Proven Velocity**: Session 137 delivered in 45 minutes

### v5's Proven Engagement Metrics
- **46 emCoin references** in dashboard showed high user engagement
- **Streak milestones** created daily login addiction
- **Achievement system** drove completion behaviors  
- **Social comparison** increased competitive participation

---

## 🚀 Success Metrics

### Implementation Velocity
- **Target**: 2-3 sessions per major feature (vs. v5's months)
- **Quality**: No schema mismatches (v5's killer)
- **Engagement**: Daily login rates, achievement unlock rates

### User Experience  
- **Addiction Mechanics**: Daily return rates
- **Social Features**: Friend comparison engagement
- **Progression Systems**: Milestone completion rates
- **Real-time Updates**: No 95% syndrome

---

## 💡 Next Session (139) Checklist

### Before Starting:
- [ ] Load context: `./scripts/context`
- [ ] Review v5 specs: `reconciliation/00138-V5-INTEGRATION-SPECIFICATIONS.md`
- [ ] Use MCP Enhanced Workflow: `./scripts/00136-enhanced-session-start.sh 139`

### Implementation Order:
1. **Create Migration**: EmCoin 4-table structure
2. **Apply via MCP**: Use Supabase dev server  
3. **Create Test Data**: Milestone achievements, sample transactions
4. **Build Server Actions**: Basic emCoin transaction logic
5. **Test End-to-End**: Verify streak calculation works

### Definition of Done:
- [ ] 4 EmCoin tables created with proper RLS
- [ ] Achievement milestones 3,7,14,30,100,365 populated
- [ ] Basic emCoin transaction processing works
- [ ] Test user can earn streak rewards
- [ ] No 95% syndrome (complete before UI)

---

*Session 138 v5→v6 Integration Roadmap*  
*From v5's proven patterns to v6's solid foundation*