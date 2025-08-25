---
created: '2025-08-23'
domain: reconciliation
priority: P1
purpose: Document p0 educational identity gaps analysis
session: '00020'
status: current
title: P0 Educational Identity Gaps Analysis
topics:
- auth
- database
- documentation
type: guide
---

# P0 Educational Identity Gaps Analysis

**Session**: 00020  
**Date**: 2025-08-17  
**Purpose**: Identify gaps between P0 requirements and current reality for educational identity prototype  
**Vision**: Enable students to build academic personas like Cyworld minihompys

---

## Executive Summary

The system has basic infrastructure (database tables, authentication, UI) but lacks the **identity-building soul** that will make EDL the "Cyworld of Education." Students can technically create accounts, but they cannot yet build meaningful academic personas that they'll obsess over like Koreans did with their minihompys.

**Critical Finding**: We have a functional system, not an identity platform.

---

## Gap Analysis by Domain

### 1. Authentication & Onboarding (US-001 to US-015)

#### What Requirements Say
- User registration with email/password
- Profile creation with call_sign
- Login/logout functionality
- Password reset capability
- Supervisor account creation and Player linking

#### What Reality Has
- ✅ Supabase authentication working
- ✅ Gmail signup verified
- ✅ Basic profiles table with RLS
- ✅ Login/logout functional

#### Identity Gaps
- ❌ **No "Welcome to Your Academic Journey" experience**
  - Missing: Onboarding flow that feels like setting up a minihompy
  - Missing: Call_sign uniqueness and personality
  - Missing: Initial customization options
  
- ❌ **No Supervisor-Player identity linking**
  - Missing: Family connection system
  - Missing: Parent pride display
  - Missing: Achievement sharing to supervisors

- ❌ **No identity persistence visualization**
  - Missing: "Your journey continues..." messaging
  - Missing: Progress preservation emphasis
  - Missing: Academic legacy building narrative

### 2. Profile & Dashboard (US-023 to US-033)

#### What Requirements Say
- Player dashboard with profile info
- Achievement display
- Team affiliations
- Activity history
- Resource access

#### What Reality Has
- ✅ Profiles table exists
- ⚠️ Basic data structure only
- ❌ No UI for profile viewing/editing
- ❌ No dashboard implemented

#### Identity Gaps
- ❌ **No "Academic Minihompy" feeling**
  - Missing: Customizable dashboard background
  - Missing: Achievement showcase area
  - Missing: Visitor counter ("Today" views)
  - Missing: Personal motto/status message
  
- ❌ **No identity progression system**
  - Missing: Level/rank display
  - Missing: Experience points
  - Missing: Badge collection gallery
  - Missing: Hall of Game placement

- ❌ **No social proof elements**
  - Missing: Team badges on profile
  - Missing: Recent activities feed
  - Missing: Peer endorsements
  - Missing: Supervisor pride markers

### 3. Teams (US-016 to US-022, US-034 to US-048)

#### What Requirements Say
- Team creation with identity elements
- Role selection (FE/BE/QB)
- Team invitations and collaboration
- Team statistics and achievements

#### What Reality Has
- ✅ Teams table with basic fields
- ✅ Team_members junction table
- ✅ Team_join_requests table
- ⚠️ Basic UI for team creation
- ❌ Not thoroughly tested

#### Identity Gaps
- ❌ **No team identity customization**
  - Missing: Team logos/avatars
  - Missing: Team colors/themes
  - Missing: Team motto/battle cry
  - Missing: Team achievement wall
  
- ❌ **No role identity system**
  - Missing: Role badges (FE/BE/QB)
  - Missing: Role-specific achievements
  - Missing: Role expertise display
  - Missing: Role contribution tracking

- ❌ **No team social dynamics**
  - Missing: Team chat/bulletin board
  - Missing: Team activity feed
  - Missing: Member contribution scores
  - Missing: Team rivalry system

---

## Critical Identity Elements Missing

### 1. The "Today" Counter (Cyworld's Killer Feature)
**Gap**: No visitor tracking or daily engagement metric
**Impact**: Missing the addictive "check your today count" behavior
**Solution**: Implement profile view tracking with daily counter

### 2. Customization Economy
**Gap**: No emCoin system or customization items
**Impact**: No incentive for achievement or engagement
**Solution**: Basic emCoin tracking and simple customization options

### 3. Achievement Gallery
**Gap**: No visual representation of accomplishments
**Impact**: Students can't showcase their journey
**Solution**: Badge system with visual display

### 4. Social Graph
**Gap**: No friend/rival connections beyond teams
**Impact**: Missing social motivation layer
**Solution**: Simple following/connection system

### 5. Personal Space Ownership
**Gap**: Dashboard doesn't feel like "my space"
**Impact**: No emotional attachment to platform
**Solution**: Customizable elements and personal touches

---

## Priority Gaps for Prototype

### Must Have (P0 Identity MVP)
1. **Personal Dashboard** - The academic minihompy
2. **Call_sign Identity** - Unique memorable identity
3. **Team Badges** - Social affiliation display
4. **Achievement Tracking** - At least 3 achievement types
5. **Profile Customization** - At least 1 customizable element

### Should Have (Enhanced Identity)
1. **Today Counter** - Profile view tracking
2. **emCoin Display** - Virtual currency balance
3. **Activity Feed** - Recent accomplishments
4. **Team Identity** - Logos and colors
5. **Role Badges** - FE/BE/QB identity markers

### Could Have (Full Identity)
1. **Victory Themes** - Personal celebration music
2. **Debate Chamber** - Customizable competition space
3. **Hall of Game** - Leaderboard presence
4. **Supervisor Pride** - Parent view of achievements
5. **Resource Library** - Personal learning collection

---

## Technical Gaps

### Database Schema Enhancements Needed
```sql
-- Missing identity fields in profiles
ALTER TABLE profiles ADD COLUMN 
  today_count INTEGER DEFAULT 0,
  total_views INTEGER DEFAULT 0,
  emcoin_balance DECIMAL(10,2) DEFAULT 100.00,
  experience_points INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  motto TEXT,
  theme_color VARCHAR(7),
  avatar_style VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW();

-- Missing achievements table
CREATE TABLE achievements (
  id UUID PRIMARY KEY,
  player_id UUID REFERENCES profiles(id),
  achievement_type VARCHAR(50),
  achievement_name VARCHAR(100),
  earned_date TIMESTAMP,
  emcoin_reward DECIMAL(10,2),
  display_order INTEGER
);

-- Missing profile_views for Today counter
CREATE TABLE profile_views (
  id UUID PRIMARY KEY,
  profile_id UUID REFERENCES profiles(id),
  viewer_id UUID REFERENCES profiles(id),
  viewed_at TIMESTAMP DEFAULT NOW()
);
```

### UI Components Missing
1. Dashboard layout with customizable sections
2. Profile card with achievement badges
3. Team identity display widget
4. Activity feed component
5. Today counter widget
6. emCoin balance display
7. Achievement gallery
8. Call_sign selector with availability check

---

## Recommended Implementation Strategy

### Phase 1: Identity Foundation (Week 1)
1. Enhance profiles table with identity fields
2. Create dashboard UI with personal space feeling
3. Implement call_sign uniqueness and display
4. Add basic customization (theme color)

### Phase 2: Social Identity (Week 2)
1. Implement team badges and display
2. Create achievement system (3 types)
3. Add Today counter functionality
4. Build activity feed

### Phase 3: Economic Identity (Week 3)
1. Implement basic emCoin system
2. Add achievement rewards
3. Create simple customization shop
4. Connect supervisor-player relationships

---

## Success Metrics for Identity

1. **Engagement**: Students check dashboard >1x daily
2. **Customization**: 80% customize at least one element
3. **Social**: Average 2+ team members per player
4. **Achievement**: Average 3+ achievements earned
5. **Retention**: 70% return after first week

---

## Conclusion

The gap is not technical—it's experiential. We have database tables but not digital identity. We have authentication but not belonging. We have teams but not tribes. 

**The path forward**: Transform functional infrastructure into an identity platform where students build academic personas with the same passion Koreans built minihompys.

---

*Next Document: cyworld-features-order.md - Implementation sequence*