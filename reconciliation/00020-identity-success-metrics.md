---
created: '2025-08-23'
domain: reconciliation
priority: P1
purpose: Document educational identity success metrics
session: '00020'
status: current
title: Educational Identity Success Metrics
topics:
- documentation
type: guide
implements:
- requirement-to-be-specified
modified: '2025-08-27'
---

# Educational Identity Success Metrics

**Session**: 00020  
**Date**: 2025-08-17  
**Purpose**: Define measurable criteria for educational identity building success  
**Framework**: Inspired by Cyworld's engagement metrics

---

## Core Thesis

Success is not measured by features built or tests passed, but by whether students are building meaningful academic identities. Like Cyworld users who checked their minihompys multiple times daily, EDL students should feel compelled to nurture their academic personas.

---

## Primary Identity Metrics (The Big 5)

### 1. Daily Active Identity (DAI)
**What It Measures**: Students actively building their academic persona daily

**Key Indicators**:
- Login frequency (target: >1x daily)
- Dashboard visits (target: >3x daily)
- Profile updates (target: 1x weekly)
- Today counter checks (target: >2x daily)

**Success Threshold**: 60% of registered users are DAI

**How to Measure**:
```sql
SELECT COUNT(DISTINCT user_id) as daily_active
FROM user_sessions
WHERE date = CURRENT_DATE
AND actions_count > 3;
```

### 2. Identity Investment Score (IIS)
**What It Measures**: Depth of personal investment in academic persona

**Key Indicators**:
- Profile completion (100% = 10 points)
- Customizations made (each = 5 points)
- Achievement count (each = 3 points)
- Team membership (yes = 10 points)
- Motto/status set (yes = 5 points)

**Success Threshold**: Average IIS > 35 points

**How to Measure**:
```javascript
const IIS = 
  (profileFields / totalFields) * 10 +
  (customizations * 5) +
  (achievements * 3) +
  (hasTeam ? 10 : 0) +
  (hasMotto ? 5 : 0);
```

### 3. Social Identity Connections (SIC)
**What It Measures**: How connected students feel through their identity

**Key Indicators**:
- Team members connected
- Profile views received
- Profile views given
- Activity feed interactions
- Supervisor linkage

**Success Threshold**: Average 5+ connections per user

**How to Measure**:
```sql
SELECT AVG(
  team_connections + 
  profile_interactions + 
  supervisor_links
) as avg_connections
FROM user_social_metrics;
```

### 4. Identity Expression Rate (IER)
**What It Measures**: How actively students express their academic identity

**Key Indicators**:
- Achievements earned per week
- emCoins earned per week
- Customizations purchased
- Status updates frequency
- Role identity claimed

**Success Threshold**: 3+ expressions per week

**How to Measure**:
```javascript
const weeklyExpressions = 
  achievementsThisWeek +
  (emCoinsEarned > 0 ? 1 : 0) +
  customizationsPurchased +
  statusUpdates +
  (roleSelected ? 1 : 0);
```

### 5. Identity Persistence Score (IPS)
**What It Measures**: Long-term commitment to academic persona

**Key Indicators**:
- Account age
- Consecutive day streaks
- Return rate after absence
- Profile evolution over time
- Achievement progression

**Success Threshold**: 70% still active after 30 days

**How to Measure**:
```sql
SELECT 
  COUNT(CASE WHEN last_active > DATE_SUB(NOW(), INTERVAL 7 DAY) THEN 1 END) / 
  COUNT(*) * 100 as retention_rate
FROM profiles
WHERE created_at < DATE_SUB(NOW(), INTERVAL 30 DAY);
```

---

## Secondary Identity Metrics

### Engagement Depth Metrics

#### Time Investment
- Average session duration (target: >10 minutes)
- Total weekly time (target: >60 minutes)
- Time per identity action (target: intentional, not rushed)

#### Feature Adoption
- % using customization (target: 80%)
- % with team affiliation (target: 70%)
- % with achievements (target: 90%)
- % with supervisor link (target: 40%)

#### Identity Quality
- Call_sign uniqueness score
- Profile completeness percentage
- Achievement diversity index
- Customization sophistication level

### Social Dynamics Metrics

#### Team Identity Health
- Teams with 3+ active members (target: 60%)
- Team achievement rate
- Team interaction frequency
- Team identity markers adopted

#### Peer Recognition
- Profile views per user
- Achievement celebrations
- Team invitations sent/received
- Positive interactions ratio

#### Competitive Identity
- Leaderboard participation
- Level progression rate
- Role expertise development
- Hall of Game aspirations

### Economic Identity Metrics

#### Virtual Economy Health
- emCoin circulation velocity
- Average wallet balance
- Transaction frequency
- Purchase diversity

#### Value Perception
- emCoins earned vs spent ratio
- Customization item demand
- Achievement reward satisfaction
- Economic goal setting

---

## Cyworld Comparison Benchmarks

### What Made Cyworld Addictive (Our Targets)

| Cyworld Metric | Cyworld Achievement | EDL Target |
|----------------|-------------------|------------|
| Daily visits | 5+ times | 3+ times |
| Today counter checks | 10+ times | 5+ times |
| Customization rate | 95% | 80% |
| Social connections | 50+ ilchon | 10+ team/peers |
| Monthly time | 20+ hours | 10+ hours |
| Retention (6 months) | 85% | 70% |

---

## Implementation Measurement Plan

### Phase 1: Identity Foundation (Days 1-3)
**Measure**:
- Call_sign selection rate (target: 95%)
- Time to first customization (target: <5 minutes)
- First achievement earn rate (target: 100%)
- Dashboard return rate (target: 80% day 2)

### Phase 2: Social Catalyst (Days 4-6)
**Measure**:
- Team join/create rate (target: 60%)
- First profile view (target: 90% receive one)
- Activity feed engagement (target: 50% click)
- Today counter awareness (target: 70% check)

### Phase 3: Economic Identity (Days 7-9)
**Measure**:
- emCoin balance checks (target: daily)
- First purchase rate (target: 40%)
- Achievement pursuit (target: 2+ attempted)
- Economic goal setting (target: 30% save for item)

### Phase 4: Competitive Spirit (Days 10-12)
**Measure**:
- Level progression (target: 50% reach level 2)
- Role selection (target: 40% choose role)
- Leaderboard checks (target: 30% view)
- Competition participation (target: 20% engage)

---

## Data Collection Strategy

### Automatic Tracking
```javascript
// Every user action logged
trackEvent('identity_action', {
  user_id: userId,
  action_type: 'customization',
  action_detail: 'theme_color_change',
  timestamp: Date.now(),
  session_id: sessionId
});
```

### Daily Calculations
```sql
-- Run at midnight
INSERT INTO identity_metrics_daily
SELECT 
  DATE(NOW()) as metric_date,
  COUNT(DISTINCT user_id) as DAI,
  AVG(investment_score) as avg_IIS,
  AVG(connection_count) as avg_SIC,
  AVG(expression_count) as avg_IER,
  SUM(CASE WHEN days_active > 30 THEN 1 ELSE 0 END) / COUNT(*) as IPS
FROM user_metrics;
```

### Weekly Reports
```javascript
// Generate identity health report
const weeklyReport = {
  period: 'Week of X',
  DAI_trend: '+15%',
  new_identities: 47,
  avg_investment: 42,
  top_achievements: ['Pioneer', 'Team Player', 'First Win'],
  retention_rate: '73%'
};
```

---

## Success Criteria Thresholds

### Minimum Viable Identity (Week 1)
- [ ] 50% DAI rate
- [ ] 25+ average IIS
- [ ] 3+ connections per user
- [ ] 2+ expressions per week
- [ ] 60% day-7 retention

### Healthy Identity Ecosystem (Month 1)
- [ ] 60% DAI rate
- [ ] 35+ average IIS
- [ ] 5+ connections per user
- [ ] 3+ expressions per week
- [ ] 70% day-30 retention

### Thriving Identity Platform (Month 3)
- [ ] 70% DAI rate
- [ ] 50+ average IIS
- [ ] 10+ connections per user
- [ ] 5+ expressions per week
- [ ] 75% month-3 retention

---

## Warning Indicators

### Identity Crisis Signals
- DAI drops below 40%
- IIS average below 20
- Team creation rate <30%
- Customization rate <50%
- Day-3 retention <50%

### Intervention Triggers
- Send "missed you" notifications after 3 days
- Offer free customization after 1 week inactive
- Team invitation prompts for solo players
- Achievement hints for stuck players
- Supervisor alerts for inactive students

---

## The North Star Metric

**Identity Obsession Score (IOS)**

```
IOS = (DAI * 0.3) + (IIS * 0.2) + (SIC * 0.2) + (IER * 0.2) + (IPS * 0.1)
```

**Target IOS**: 70+ indicates students are successfully building academic identities

---

## Validation Methods

### Qualitative Validation
- User interviews: "Tell me about your EDL profile"
- Observation: Watch students interact with platform
- Surveys: "How attached are you to your EDL identity?"
- Social proof: Are students talking about EDL outside platform?

### Behavioral Validation
- Voluntary return rate (no prompts needed)
- Feature request patterns (asking for more customization)
- Time spent on identity vs functional features
- Sharing behavior (showing profiles to others)

---

## Conclusion

Success isn't measured by perfect code or complete features. Success is measured by whether students wake up thinking about their EDL identity, check their Today counter during lunch, and feel proud showing their academic persona to others.

**The Ultimate Test**: Would students be upset if their EDL identity disappeared? If yes, we've succeeded in creating the Cyworld of Education.

---

*Next Document: starter-seed-execution.md - Technical implementation plan*