# 📊 SESSION 02.13 SCHEMA TRACKING CATALOG

**Date:** THU Aug 14, 2025  
**Purpose:** Map which code/docs reference which database schema  
**Critical:** Understanding this prevents further confusion  

---

## 🎮 GAMING/CYWORLD SCHEMA (What Frontend Expects)

### Core Tables Expected
```
profiles (plural) - User profiles with roles
├── role: 'player' | 'supervisor' | 'enabler'
├── username, avatar_url, subscription_tier
└── created_at, updated_at

emcoin_wallets - Virtual currency
├── user_id → profiles.id
├── balance, total_earned, total_spent
└── last_transaction_at

emcoin_transactions - Transaction history
├── wallet_id → emcoin_wallets.id
├── amount, type, description
└── created_at

clans - Social groups (like guilds)
├── name, description, avatar_url
├── leader_id → profiles.id
├── member_count, victory_count
└── created_at

victory_themes - Customization options
├── name, css_class, audio_url
├── unlock_level, emcoin_cost
└── is_premium

debate_chambers - Virtual debate rooms
├── activity_id → activities.id
├── current_round, time_remaining
├── player1_id, player2_id → profiles.id
└── status: 'waiting' | 'active' | 'completed'

activities - Debate events
├── name, description, activity_type
├── supervisor_id → profiles.id
├── emcoin_fee, max_players
└── scheduled_at

teams - Supervisor's players
├── supervisor_id → profiles.id
├── name, creation_method
└── created_at

team_members - Team roster
├── team_id → teams.id
├── player_id → profiles.id
└── joined_at

achievements - Unlockable rewards
├── name, description, icon_url
├── unlock_criteria, emcoin_reward
└── rarity_tier

observer_badges - Spectator rewards
├── user_id → profiles.id
├── badge_type, earned_at
└── debate_chamber_id → debate_chambers.id
```

### Files Using Gaming Schema

#### Frontend Pages (19 files, 417 references)
- `/pages/player-dashboard.html` - 46 refs to player, emcoin, achievements
- `/pages/supervisor-dashboard.html` - 89 refs to supervisor, teams, payments
- `/pages/enabler-dashboard.html` - 34 refs to enabler, ballots, earnings
- `/pages/activities/chamber.html` - 53 refs to debate_chambers, victory themes
- `/pages/payments/approve.html` - 47 refs to emcoin transactions
- `/pages/SESSION-01.09-MOBILE-DEBATE-CHAMBER.html` - 25 refs to clans, themes

#### Backend Libraries (10 files, 388 references)
- `/lib/hooks.js` - 131 refs to player/supervisor/enabler roles
- `/lib/state-machines.js` - 135 refs to activity states, player states
- `/lib/supabase-edl.js` - 48 refs to profiles, emcoin_wallets
- `/lib/auth-middleware.js` - 27 refs to role-based access control
- `/lib/activity-lifecycle.js` - 15 refs to activities, registrations
- `/lib/realtime-manager.js` - 11 refs to debate_chambers updates

#### SQL Migration Files (Sessions 01.01-01.15)
- `/docs/SESSION-01.02-DATABASE-MIGRATION-POSTGRESQL-FIXED.sql`
- `/docs/SESSION-01.03-TEST-DATA-FIXED.sql`
- `/docs/SESSION-01.07-RLS-POLICIES.sql`
- `/docs/SESSION-01.08-DEBATE-CHAMBER-SCHEMA.sql`
- `/docs/SESSION-01.13-CYWORLD-DNA-TABLES.sql`

---

## 🎓 EDUCATIONAL SCHEMA (What Actually Exists)

### Core Tables in Database
```
profile (singular!) - User profiles
├── id, username, email
├── created_at, updated_at
└── (NO role field - roles in separate tables)

guardian - Parent/teacher accounts
├── user_id → profile.id
└── (guardian-specific fields)

student - Student accounts
├── user_id → profile.id
└── (student-specific fields)

judge - Judge/evaluator accounts
├── user_id → profile.id
├── referral_user_id → profile.id
└── (judge-specific fields)

school - Educational institutions
├── id, name, address
├── created_by → profile.id
└── created_at

debate_motion - Debate topics
├── id, title, description
├── proposer_id → profile.id
└── created_at

debate_participant - Debate participants
├── debate_id → debate_motion.id
├── user_id → profile.id
└── side: 'proposition' | 'opposition'

debate_speech - Speech records
├── debate_id → debate_motion.id
├── speaker_id → profile.id
├── speech_text, duration
└── created_at

invitation - System invitations
├── inviter_id → profile.id
├── invitee_id → profile.id
├── status, created_at
```

### Files Using Educational Schema

#### SQL Discovery Files (Session 02.12)
- `/docs/SESSION-02.12-REAL-DATABASE-DISCOVERY.sql`
- `/docs/SESSION-02.12-PROFILE-STRUCTURE-DISCOVERY.sql`
- `/docs/SESSION-02.12-CORRECTED-POPULATION-SCRIPT.sql`
- `/docs/SESSION-02.12-ACTUAL-POPULATION-SCRIPT.sql`

#### Migration Attempts (Sessions 02.03-02.04)
- `/docs/SESSION-02.03-SAFEGUARDED-DATABASE-SETUP.sql`
- `/docs/SESSION-02.04-COMPATIBLE-DATABASE-FIX.sql`
- `/docs/SESSION-02.04-DISCOVER-ACTUAL-STRUCTURE.sql`

---

## 🔥 CRITICAL CONFLICTS

### 1. Table Name Mismatch
- Frontend expects: `profiles` (plural)
- Database has: `profile` (singular)
- **Impact**: ALL queries fail

### 2. Role System Completely Different
- Frontend expects: Single `role` field in profiles
- Database has: Separate tables (guardian, student, judge)
- **Impact**: Authentication and authorization broken

### 3. Missing Core Gaming Tables
- Frontend expects: `emcoin_wallets`, `clans`, `victory_themes`
- Database has: NONE of these
- **Impact**: Entire gaming/reward system non-functional

### 4. Different Debate Structure
- Frontend expects: `debate_chambers` with real-time state
- Database has: `debate_motion`, `debate_participant`, `debate_speech`
- **Impact**: Real-time debate experience broken

### 5. Missing Virtual Economy
- Frontend expects: Complete emCoin system
- Database has: No currency system at all
- **Impact**: Payments, rewards, marketplace all broken

---

## 📋 FRONTEND FEATURES REQUIRING BACKEND

### Player Dashboard (`/pages/player-dashboard.html`)
**Expects:**
- `profiles` table with player role
- `emcoin_wallets` for balance display
- `achievements` and `user_achievements` for progress
- `daily_engagement` for streak tracking
- `profile_visitors` for "Today" counter
- `clans` and `clan_memberships` for social features

**Currently:** COMPLETELY BROKEN

### Supervisor Dashboard (`/pages/supervisor-dashboard.html`)
**Expects:**
- `profiles` table with supervisor role
- `teams` and `team_members` for player management
- `linked_players` for 6-player limit enforcement
- `subscriptions` for metaPass management
- `emcoin_transactions` for approval workflows

**Currently:** COMPLETELY BROKEN

### Debate Chamber (`/pages/activities/chamber.html`)
**Expects:**
- `debate_chambers` for real-time state
- `victory_themes` for customization
- `observer_badges` for spectator rewards
- Real-time subscriptions to chamber updates
- `messages` for in-debate chat

**Currently:** COMPLETELY BROKEN

### Mobile Debate Interface (`/pages/SESSION-01.09-MOBILE-DEBATE-CHAMBER.html`)
**Expects:**
- TikTok-style swipe through `debate_chambers`
- `ghost_debates` for AI opponents
- `clip_generation` for viral content
- `wave_surfing` for random discovery

**Currently:** COMPLETELY BROKEN

---

## 🎯 IMPLEMENTATION REQUIREMENTS

### To Make Frontend Work, We Need:

#### Phase 1: Core Tables (CRITICAL)
```sql
-- 1. Rename or create profiles (plural)
CREATE TABLE profiles AS SELECT * FROM profile;

-- 2. Add role system
ALTER TABLE profiles ADD COLUMN role VARCHAR(20) 
  CHECK (role IN ('player', 'supervisor', 'enabler'));

-- 3. Create virtual economy
CREATE TABLE emcoin_wallets (...);
CREATE TABLE emcoin_transactions (...);

-- 4. Create social features
CREATE TABLE clans (...);
CREATE TABLE clan_memberships (...);
CREATE TABLE teams (...);
CREATE TABLE team_members (...);
```

#### Phase 2: Gaming Features
```sql
-- 5. Create customization
CREATE TABLE victory_themes (...);
CREATE TABLE avatar_items (...);

-- 6. Create achievements
CREATE TABLE achievements (...);
CREATE TABLE user_achievements (...);
CREATE TABLE observer_badges (...);

-- 7. Create debate system
CREATE TABLE debate_chambers (...);
CREATE TABLE debate_turns (...);
CREATE TABLE debate_messages (...);
```

#### Phase 3: Supporting Systems
```sql
-- 8. Create engagement tracking
CREATE TABLE daily_engagement (...);
CREATE TABLE profile_visitors (...);
CREATE TABLE user_sessions (...);

-- 9. Create notification system
CREATE TABLE notifications (...);
CREATE TABLE messages (...);
```

---

## 📊 DECISION MATRIX

### Option A: Full Gaming Schema Implementation
**Pros:**
- Frontend works immediately
- Cyworld vision realized
- 16,000 lines of code become functional

**Cons:**
- Complete database rebuild
- Lose any educational structure
- Major migration effort

**Effort:** 8-10 hours

### Option B: Adapter Layer
**Pros:**
- Keep educational core
- Add gaming features gradually
- Less disruptive

**Cons:**
- Complex mapping layer
- Performance overhead
- Maintenance burden

**Effort:** 12-15 hours

### Option C: Hybrid Approach
**Pros:**
- Educational + Gaming coexist
- Views provide compatibility
- Incremental migration

**Cons:**
- Most complex solution
- Potential confusion
- Duplicate data

**Effort:** 15-20 hours

---

## ✅ RECOMMENDED PATH

### Immediate Actions
1. **STOP** using educational schema docs
2. **CREATE** backup of current database
3. **DECIDE** on gaming schema implementation
4. **BUILD** profiles (plural) with roles
5. **IMPLEMENT** core gaming tables

### Migration Strategy
```sql
-- Step 1: Create gaming schema alongside educational
-- Step 2: Migrate any useful data
-- Step 3: Point frontend to gaming tables
-- Step 4: Test core workflows
-- Step 5: Deprecate educational tables
```

### Success Metrics
- [ ] Player can log in and see dashboard
- [ ] Supervisor can manage 6 players
- [ ] Enabler can judge debates
- [ ] EmCoin transactions work
- [ ] Debate chambers function
- [ ] Achievements unlock
- [ ] Real-time updates work

---

## 🚨 CRITICAL REMINDERS

1. **Table naming matters**: `profile` vs `profiles` broke everything
2. **Role system is fundamental**: Single field vs separate tables
3. **Frontend is built for gaming**: Educational schema won't work
4. **Cyworld DNA is core**: Not optional features
5. **Virtual economy drives engagement**: EmCoins are critical

---

*This catalog proves definitively: The frontend expects the gaming/Cyworld schema. The educational database is incompatible.*