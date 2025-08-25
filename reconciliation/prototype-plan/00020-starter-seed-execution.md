---
created: '2025-08-23'
domain: reconciliation
priority: P1
purpose: Document starter seed execution plan
session: '00020'
status: current
title: Starter Seed Execution Plan
topics:
- auth
- database
- documentation
type: guide
---

# Starter Seed Execution Plan

**Session**: 00020  
**Date**: 2025-08-17  
**Purpose**: Technical execution plan for Educational Identity Prototype  
**Foundation**: SEED LOG vision + Canvas wireframes + Database schema  
**Timeline**: 15 days to working prototype

---

## Executive Summary

Transform the existing technical foundation (4 tables, basic auth, simple UI) into a living "Cyworld of Education" where students build academic identities. This plan integrates the three starter seeds into a coherent implementation strategy.

**The Three Seeds**:
1. **SEED LOG**: The vision and philosophy
2. **Canvas JSON**: 431 wireframes with 7,023 nodes
3. **Database Schema**: Existing 4 tables + enhancements

---

## Pre-Implementation Checklist

### What We Have (Reality Check)
- [x] Supabase project with auth working
- [x] 4 tables deployed (profiles, teams, team_members, team_join_requests)
- [x] Basic HTML/JS interface (index.html)
- [x] Gmail signup verified
- [x] Git repository established
- [x] 7 Reality Agents for verification

### What We Need (Gaps to Fill)
- [ ] Identity-focused database enhancements
- [ ] Personal dashboard UI
- [ ] Achievement system
- [ ] emCoin economy basics
- [ ] Today counter mechanism
- [ ] Customization options

---

## Day 1-2: Database Identity Layer

### SQL Migrations to Run
```sql
-- Migration 001: Enhance profiles for identity
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS
  call_sign VARCHAR(50) UNIQUE NOT NULL,
  today_count INTEGER DEFAULT 0,
  total_views INTEGER DEFAULT 0,
  emcoin_balance DECIMAL(10,2) DEFAULT 100.00,
  experience_points INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  motto TEXT,
  theme_color VARCHAR(7) DEFAULT '#4A90E2',
  avatar_style VARCHAR(50) DEFAULT 'default',
  last_active TIMESTAMP DEFAULT NOW(),
  streak_days INTEGER DEFAULT 0;

-- Migration 002: Create achievements table
CREATE TABLE IF NOT EXISTS achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  achievement_type VARCHAR(50) NOT NULL,
  achievement_name VARCHAR(100) NOT NULL,
  achievement_description TEXT,
  earned_date TIMESTAMP DEFAULT NOW(),
  emcoin_reward DECIMAL(10,2) DEFAULT 0,
  experience_reward INTEGER DEFAULT 0,
  rarity VARCHAR(20) DEFAULT 'common',
  display_order INTEGER DEFAULT 0
);

-- Migration 003: Create profile views tracking
CREATE TABLE IF NOT EXISTS profile_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  viewer_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  viewed_at TIMESTAMP DEFAULT NOW(),
  view_date DATE DEFAULT CURRENT_DATE
);

-- Migration 004: Create emcoin transactions
CREATE TABLE IF NOT EXISTS emcoin_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL,
  transaction_type VARCHAR(50) NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Migration 005: Create activity feed
CREATE TABLE IF NOT EXISTS activity_feed (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  activity_type VARCHAR(50) NOT NULL,
  activity_data JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### RLS Policies Required
```sql
-- Profiles: Users can view all, edit own
CREATE POLICY "Profiles viewable by all" ON profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can edit own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Achievements: View all own, view others' public
CREATE POLICY "View own achievements" ON achievements
  FOR SELECT USING (auth.uid() = player_id);

CREATE POLICY "View others achievements" ON achievements
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = achievements.player_id
    )
  );

-- Profile views: Track all views
CREATE POLICY "Track profile views" ON profile_views
  FOR INSERT WITH CHECK (auth.uid() = viewer_id);
```

---

## Day 3-4: Core API Endpoints

### Supabase Edge Functions to Create
```javascript
// 1. check-callsign.ts
export async function handler(req: Request) {
  const { callsign } = await req.json();
  const { data, error } = await supabase
    .from('profiles')
    .select('id')
    .eq('call_sign', callsign)
    .single();
  
  return new Response(
    JSON.stringify({ available: !data }),
    { headers: { "Content-Type": "application/json" } }
  );
}

// 2. complete-profile.ts
export async function handler(req: Request) {
  const { userId, callSign, gradeLevel, themeColor } = await req.json();
  
  // Update profile
  await supabase.from('profiles').update({
    call_sign: callSign,
    grade_level: gradeLevel,
    theme_color: themeColor
  }).eq('id', userId);
  
  // Award first achievement
  await supabase.from('achievements').insert({
    player_id: userId,
    achievement_type: 'identity',
    achievement_name: 'Identity Established',
    achievement_description: 'Created your unique EDL identity',
    emcoin_reward: 100,
    experience_reward: 50,
    rarity: 'common'
  });
  
  // Add to activity feed
  await supabase.from('activity_feed').insert({
    player_id: userId,
    activity_type: 'achievement_earned',
    activity_data: { name: 'Identity Established' }
  });
  
  return new Response(JSON.stringify({ success: true }));
}

// 3. track-profile-view.ts
export async function handler(req: Request) {
  const { profileId, viewerId } = await req.json();
  
  // Record view
  await supabase.from('profile_views').insert({
    profile_id: profileId,
    viewer_id: viewerId
  });
  
  // Update today count
  await supabase.rpc('increment_today_count', { profile_id: profileId });
  
  return new Response(JSON.stringify({ success: true }));
}

// 4. get-activity-feed.ts
export async function handler(req: Request) {
  const { data } = await supabase
    .from('activity_feed')
    .select(`
      *,
      player:player_id(call_sign, theme_color)
    `)
    .order('created_at', { ascending: false })
    .limit(20);
  
  return new Response(JSON.stringify(data));
}
```

---

## Day 5-6: Dashboard UI Implementation

### File Structure
```
/
├── index.html (existing - becomes login)
├── dashboard.html (new - main experience)
├── css/
│   ├── identity.css (new - identity styles)
│   └── dashboard.css (new - layout)
├── js/
│   ├── identity.js (new - identity logic)
│   ├── dashboard.js (new - dashboard controller)
│   └── achievements.js (new - achievement system)
└── assets/
    ├── badges/ (achievement images)
    └── themes/ (customization assets)
```

### dashboard.html Structure
```html
<!DOCTYPE html>
<html>
<head>
  <title>EDL - Your Academic Identity</title>
  <link rel="stylesheet" href="css/identity.css">
  <link rel="stylesheet" href="css/dashboard.css">
</head>
<body>
  <!-- Identity Header -->
  <header class="identity-header">
    <div class="call-sign-display">
      <h1 id="callSign">Loading...</h1>
      <span class="level-badge">Level <span id="level">1</span></span>
    </div>
    <div class="stats-bar">
      <div class="emcoin-display">
        <span class="emcoin-icon">💰</span>
        <span id="emcoinBalance">0</span> emCoins
      </div>
      <div class="today-counter">
        Today: <span id="todayCount">0</span> | 
        Total: <span id="totalViews">0</span>
      </div>
    </div>
  </header>

  <!-- Main Dashboard -->
  <main class="dashboard-container">
    <!-- Profile Card -->
    <section class="profile-card" id="profileCard">
      <div class="avatar-container">
        <div class="avatar" id="avatar"></div>
        <button class="customize-btn">Customize</button>
      </div>
      <div class="profile-info">
        <p class="motto" id="motto">Click to add your motto...</p>
        <div class="achievements-preview">
          <!-- Achievement badges -->
        </div>
      </div>
    </section>

    <!-- Team Section -->
    <section class="team-section">
      <h2>My Team</h2>
      <div id="teamInfo">
        <button id="joinTeamBtn">Join a Team</button>
        <button id="createTeamBtn">Create Team</button>
      </div>
    </section>

    <!-- Activity Feed -->
    <section class="activity-feed">
      <h2>Recent Activity</h2>
      <div id="activityList">
        <!-- Dynamic activity items -->
      </div>
    </section>

    <!-- Achievement Gallery -->
    <section class="achievement-gallery">
      <h2>My Achievements</h2>
      <div class="achievement-grid" id="achievementGrid">
        <!-- Achievement tiles -->
      </div>
    </section>
  </main>

  <script src="js/dashboard.js" type="module"></script>
  <script src="js/identity.js" type="module"></script>
  <script src="js/achievements.js" type="module"></script>
</body>
</html>
```

### Core JavaScript Modules
```javascript
// identity.js - Identity management
import { supabase } from './supabase-client.js';

export class IdentityManager {
  async loadProfile(userId) {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    this.updateUI(data);
    this.trackView(data.id);
    return data;
  }

  updateUI(profile) {
    document.getElementById('callSign').textContent = profile.call_sign;
    document.getElementById('level').textContent = profile.level;
    document.getElementById('emcoinBalance').textContent = profile.emcoin_balance;
    document.getElementById('todayCount').textContent = profile.today_count;
    document.getElementById('totalViews').textContent = profile.total_views;
    
    // Apply theme
    document.documentElement.style.setProperty('--theme-color', profile.theme_color);
  }

  async trackView(profileId) {
    const user = await supabase.auth.getUser();
    if (user && user.id !== profileId) {
      await fetch('/api/track-profile-view', {
        method: 'POST',
        body: JSON.stringify({
          profileId,
          viewerId: user.id
        })
      });
    }
  }
}

// dashboard.js - Main controller
import { IdentityManager } from './identity.js';
import { AchievementSystem } from './achievements.js';

class Dashboard {
  constructor() {
    this.identity = new IdentityManager();
    this.achievements = new AchievementSystem();
  }

  async init() {
    const user = await this.checkAuth();
    if (!user) {
      window.location.href = '/';
      return;
    }

    await this.identity.loadProfile(user.id);
    await this.achievements.loadAchievements(user.id);
    await this.loadActivityFeed();
    
    this.setupEventListeners();
    this.startActivityPolling();
  }

  setupEventListeners() {
    document.getElementById('motto').addEventListener('click', () => {
      this.editMotto();
    });
    
    document.querySelector('.customize-btn').addEventListener('click', () => {
      this.openCustomization();
    });
  }

  startActivityPolling() {
    setInterval(() => this.loadActivityFeed(), 30000);
  }
}

// Initialize on load
new Dashboard().init();
```

---

## Day 7-8: Achievement System

### Achievement Types Implementation
```javascript
// achievements.js
export class AchievementSystem {
  achievements = {
    identity: [
      {
        id: 'pioneer',
        name: 'Pioneer',
        description: 'Among the first to join EDL',
        emcoins: 100,
        xp: 50,
        rarity: 'rare'
      },
      {
        id: 'identity_complete',
        name: 'Identity Established',
        description: 'Completed your profile',
        emcoins: 50,
        xp: 25,
        rarity: 'common'
      }
    ],
    social: [
      {
        id: 'team_player',
        name: 'Team Player',
        description: 'Joined your first team',
        emcoins: 75,
        xp: 40,
        rarity: 'common'
      },
      {
        id: 'popular',
        name: 'Popular',
        description: 'Profile viewed 10 times',
        emcoins: 100,
        xp: 60,
        rarity: 'uncommon'
      }
    ],
    engagement: [
      {
        id: 'daily_visitor',
        name: 'Daily Visitor',
        description: '7 day login streak',
        emcoins: 150,
        xp: 100,
        rarity: 'uncommon'
      }
    ]
  };

  async checkAndAward(userId, trigger) {
    // Check if achievement conditions met
    // Award if earned
    // Update UI
    // Show celebration animation
  }
}
```

---

## Day 9-10: emCoin Economy

### Basic Economy Implementation
```javascript
// emcoin.js
class EmCoinSystem {
  async getBalance(userId) {
    const { data } = await supabase
      .from('profiles')
      .select('emcoin_balance')
      .eq('id', userId)
      .single();
    return data.emcoin_balance;
  }

  async transaction(userId, amount, type, description) {
    // Record transaction
    await supabase.from('emcoin_transactions').insert({
      player_id: userId,
      amount,
      transaction_type: type,
      description
    });

    // Update balance
    await supabase.rpc('update_emcoin_balance', {
      user_id: userId,
      amount_change: amount
    });

    // Update UI
    this.updateBalanceDisplay();
  }

  async purchaseCustomization(userId, itemId, cost) {
    const balance = await this.getBalance(userId);
    if (balance < cost) {
      this.showInsufficientFunds();
      return false;
    }

    await this.transaction(userId, -cost, 'purchase', `Purchased ${itemId}`);
    await this.applyCustomization(userId, itemId);
    return true;
  }
}
```

---

## Day 11-12: Team Identity Features

### Team Enhancement Implementation
```javascript
// teams.js
class TeamIdentity {
  async createTeam(teamData) {
    const team = {
      ...teamData,
      theme_color: teamData.color,
      logo_url: await this.uploadLogo(teamData.logo),
      motto: teamData.motto,
      created_by: this.userId
    };

    const { data } = await supabase
      .from('teams')
      .insert(team)
      .select()
      .single();

    // Award team founder achievement
    await this.awardFounderAchievement();
    
    return data;
  }

  async joinTeam(teamId, role) {
    await supabase.from('team_members').insert({
      team_id: teamId,
      user_id: this.userId,
      role: role, // FE, BE, or QB
      joined_at: new Date()
    });

    // Update profile with team badge
    await this.addTeamBadge(teamId);
  }
}
```

---

## Day 13-14: Polish & Mobile

### Critical Polish Items
```javascript
// Onboarding flow
class Onboarding {
  steps = [
    { id: 'welcome', title: 'Welcome to Your Academic Journey' },
    { id: 'callsign', title: 'Choose Your Identity' },
    { id: 'customize', title: 'Make It Yours' },
    { id: 'achievement', title: 'Your First Achievement!' },
    { id: 'explore', title: 'Explore Your Dashboard' }
  ];

  async start() {
    for (const step of this.steps) {
      await this.showStep(step);
    }
  }
}

// Empty states
const emptyStates = {
  achievements: "Start your journey to earn achievements!",
  team: "Join a team to collaborate with others",
  activity: "Your activity will appear here",
  emcoins: "Complete tasks to earn emCoins"
};

// Loading states
class LoadingManager {
  show(element) {
    element.innerHTML = '<div class="loader">Loading...</div>';
  }
  
  hide(element, content) {
    element.innerHTML = content;
  }
}
```

### Mobile Responsive CSS
```css
/* Mobile-first approach */
.dashboard-container {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
  padding: 1rem;
}

@media (min-width: 768px) {
  .dashboard-container {
    grid-template-columns: 1fr 1fr;
  }
}

@media (min-width: 1024px) {
  .dashboard-container {
    grid-template-columns: 1fr 2fr 1fr;
  }
}

/* Touch-friendly buttons */
button {
  min-height: 44px;
  padding: 12px 24px;
  font-size: 16px;
}
```

---

## Day 15: Launch Preparation

### Pre-Launch Checklist
- [ ] Database migrations deployed
- [ ] RLS policies active
- [ ] API endpoints tested
- [ ] Dashboard fully functional
- [ ] Achievement system working
- [ ] emCoin transactions logging
- [ ] Team features operational
- [ ] Mobile responsive verified
- [ ] Onboarding flow smooth
- [ ] Empty states designed
- [ ] Loading states implemented
- [ ] Error handling complete

### Reality Agent Verification
```bash
# Run full Reality Agent check
cd reality/agent-reality-auditor/integration-connector
python3 connector.py

# Verify specific components
python3 connector.py --check database
python3 connector.py --check ui
python3 connector.py --check auth
```

### Performance Baselines
```javascript
// Measure initial performance
const metrics = {
  firstPaint: performance.timing.responseEnd - performance.timing.fetchStart,
  domReady: performance.timing.domContentLoadedEventEnd - performance.timing.fetchStart,
  pageLoad: performance.timing.loadEventEnd - performance.timing.fetchStart
};

console.log('Performance Metrics:', metrics);
// Target: < 3s total page load
```

---

## Risk Mitigation

### Technical Risks
1. **Supabase rate limits**: Implement caching
2. **Image uploads**: Use placeholder avatars initially
3. **Real-time updates**: Use polling, upgrade later
4. **Browser compatibility**: Test on Chrome/Safari/Firefox

### User Experience Risks
1. **Complex onboarding**: Keep to 5 steps maximum
2. **Confusing UI**: Use familiar patterns
3. **Missing features**: Set expectations clearly
4. **Performance issues**: Lazy load non-critical

---

## Success Criteria for Launch

### Day 1 Success
- [ ] 10 users create accounts
- [ ] 90% complete onboarding
- [ ] 5+ teams created
- [ ] 50+ achievements earned
- [ ] No critical errors

### Week 1 Success
- [ ] 100 registered users
- [ ] 60% daily active
- [ ] 30 teams formed
- [ ] 500 achievements earned
- [ ] 80% customize profile

---

## Post-Launch Iteration Plan

### Immediate (Days 16-20)
- Bug fixes from user feedback
- Performance optimization
- Missing feature requests
- UI/UX improvements

### Short-term (Days 21-30)
- Advanced customization options
- More achievement types
- Team competition features
- Supervisor dashboard

### Medium-term (Month 2)
- Debate activity integration
- Video capabilities
- Advanced emCoin economy
- Hall of Game implementation

---

## Conclusion

This execution plan transforms vision into reality in 15 days. By focusing on identity-building over feature completeness, we create a prototype that students will actually want to use.

**Remember the mission**: We're not building a debate platform. We're building an identity platform where students happen to debate.

**The test of success**: Do students check their EDL dashboard as obsessively as Koreans checked their Cyworld minihompys?

---

*Session 21 will begin implementation following this plan*