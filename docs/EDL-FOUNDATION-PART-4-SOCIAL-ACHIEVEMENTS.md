# EDL Platform Foundation Documentation
## Part 4: Social Dynamics & Achievement Systems

### Team Formation & Dynamics

#### Team Architecture
**Database**: `BE_Teams`, `BF_TeamMates`
**Canvas Reference**: 002-1 PlayerID Profile, 002-2 Associated Teams

**Team Structure**:
```
Team Composition (Max 6 members)
├── FOUNDER (1 required)
│   ├── Creates team
│   ├── Sets vision
│   ├── Manages roster
│   └── Can transfer ownership
│
├── MATES (up to 5)
│   ├── Role: QB (Quarterback)
│   ├── Role: FE (Front End)
│   ├── Role: BE (Back End)
│   └── Role: Flex positions
│
└── STATUS States
    ├── Seeking Mates (recruiting)
    ├── Full House (complete)
    └── Competition Ready (registered)
```

#### Team Creation Flow
**Canvas Reference**: 001-2 Communication shows team management

```
1. FOUNDER Initiative
   ├── Create team profile
   ├── Set team name
   ├── Upload team logo
   ├── Write description
   └── Pay creation fee (emCoins)

2. RECRUITMENT Phase
   ├── Post vacancy announcements
   ├── Review applications
   ├── Send invitations
   └── Conduct team trials

3. FORMATION Process
   ├── Player applies to team
   ├── Founder reviews profile
   ├── Invitation sent
   ├── Player accepts/declines
   └── Role assignment

4. ACTIVE Team
   ├── Practice sessions
   ├── Activity registration
   ├── Internal competitions
   └── Team achievements
```

#### Team Communication System
**Database**: `BG_Invitations`, `CJ_messages`

**Invitation Workflow**:
```javascript
{
  invitationType: "TEAM_JOIN",
  sender: "TeamFounder_callSign",
  receiver: "Player_callSign",
  message: "Looking for strong FE debater",
  teamDetails: {
    name: "Seoul Seekers",
    division: "Upper",
    currentMembers: 3,
    seekingRoles: ["FE", "BE"]
  },
  status: "PENDING", // → ACCEPTED/DECLINED
  proposedRole: "FE",
  expirationTime: "48 hours"
}
```

### Badge & Achievement System

#### Badge Architecture
**Database**: `CC_Badges`, `AD_PlayerBadges`
**Canvas Reference**: 002-3 Badges Box

**Badge Categories**:
```
PUBLIC Badges (Visible to all)
├── Participation badges
├── Milestone badges
├── Streak badges
└── Special event badges

MEMBER Badges (Team/Division only)
├── Team achievements
├── Role mastery
├── Leadership badges
└── Collaboration badges

EXCLUSIVE Badges (Earned through excellence)
├── Tournament victories
├── Perfect scores
├── Enabler commendations
└── Platform contributions
```

#### Badge Earning Mechanics
```
TRIGGER Events
├── Activity completion
├── Score thresholds
├── Streak maintenance
├── Peer recognition
├── Enabler nomination
└── Special challenges

VALIDATION Process
├── System verification
├── Evidence check
├── Enabler confirmation
└── Award ceremony

DISPLAY Options
├── Profile showcase
├── Dashboard widgets
├── Leaderboard icons
└── Signature badges
```

### Ranking Systems

#### Player Rankings
**Database**: `BJ_PlayerRankings`
**Canvas Reference**: 002-4 Hall of Game structure

**Ranking Algorithm**:
```python
# Simplified ranking calculation
player_rank = (
    (total_wins * 3) +
    (average_score * 2) +
    (consistency_bonus) +
    (participation_points) -
    (total_losses * 0.5)
) / total_events_played

# Division-specific adjustments
if division == "Senior":
    player_rank *= 1.2  # Harder competition
elif division == "Village":
    player_rank *= 0.8  # Entry level
```

**Ranking Tiers**:
```
Division Rankings (Per Division)
├── Diamond (Top 1%)
├── Platinum (Top 5%)
├── Gold (Top 10%)
├── Silver (Top 25%)
├── Bronze (Top 50%)
└── Participant (All others)
```

#### Team Rankings
**Database**: `CA_TeamRankings`

**Team Performance Metrics**:
```javascript
{
  teamScore: {
    wins: 24,
    losses: 6,
    winRate: 0.80,
    averageScore: 87.5,
    highestScore: 96,
    consistency: 0.85
  },
  memberContributions: {
    "callSign1": 0.30,  // 30% of team success
    "callSign2": 0.25,
    "callSign3": 0.20,
    "callSign4": 0.15,
    "callSign5": 0.10
  }
}
```

### Hall of Game (Elite Recognition)

#### Hall of Game Structure
**Database**: `BI_HallOfGame`
**Canvas Reference**: 002-4 HoG detailed view

```
HALL OF GAME LEDGER (Quarterly)
├── VILLAGE Division
│   ├── Player Rankings (Top 10)
│   └── Team Rankings (Top 5)
├── LOWER Division
│   ├── Player Rankings (Top 10)
│   └── Team Rankings (Top 5)
├── UPPER Division
│   ├── Player Rankings (Top 10)
│   └── Team Rankings (Top 5)
└── SENIOR Division
    ├── Player Rankings (Top 10)
    └── Team Rankings (Top 5)
```

#### Hall of Game Benefits
- Automatic activity invitations
- Fee waivers
- Exclusive badge unlocks
- Scholarship eligibility
- Mentor opportunities
- Platform recognition

### Communication & Messaging

#### Communication Architecture
**Database**: `DA_Communications`, `CJ_messages`
**Canvas Reference**: 001-2 Communication system

**Message Types**:
```
SYSTEM Messages
├── Activity notifications
├── Achievement alerts
├── Payment confirmations
└── Platform updates

TEAM Communications
├── Team announcements
├── Practice schedules
├── Strategy discussions
└── Celebration messages

ACTIVITY Messages
├── Enabler feedback
├── Opponent communication
├── Schedule coordination
└── Results notification

SUPERVISOR Updates
├── Performance reports
├── Payment requests
├── Achievement notifications
└── Concern flags
```

#### Communication Privacy Model
```
Player → Player: LIMITED
├── Only within team context
├── Activity-related only
└── Supervisor visible

Player → Enabler: STRUCTURED
├── Through platform only
├── Activity context required
└── Recorded and monitored

Supervisor → All: FULL ACCESS
├── View all communications
├── Direct messaging enabled
└── Override capabilities
```

### Social Features

#### Profile Customization
**Canvas Reference**: 002-1 PlayerID Profile

```
PROFILE Elements
├── Profile Image
├── callSign Display
├── School & Location
├── Team Affiliations
├── Achievement Gallery
├── Personality Display (optional)
├── Victory Theme Music
├── Debate Chamber Theme
└── Signature Quote
```

#### Social Interactions
```
ENGAGEMENT Actions
├── View profiles
├── Send team invites
├── Challenge to debate
├── Endorse skills
├── Share achievements
└── Form study groups

RECOGNITION System
├── Peer commendations
├── Enabler recommendations
├── Team testimonials
├── Activity reviews
└── Resource ratings
```

### Notification System

#### Notification Categories
```
CRITICAL (Immediate)
├── Payment required
├── Registration expiring
├── Activity starting
└── Supervisor action needed

IMPORTANT (Within 1 hour)
├── Team invitation
├── Ballot received
├── Achievement earned
└── Rank change

INFORMATIONAL (Daily digest)
├── Team updates
├── Friend activities
├── New resources
└── Platform news
```

### Relationship Mapping

#### Connection Types
**Database**: Multiple relation fields across tables

```
DIRECT Relationships
├── Supervisor ←→ Players (1:6)
├── Founder ←→ Team (1:1)
├── Player ←→ Teams (N:M)
└── Enabler ←→ Activities (N:M)

INDIRECT Relationships
├── Players via Teams
├── Players via Activities
├── Players via Division
└── Enablers via Certifications

COMPETITIVE Relationships
├── Debate opponents
├── Ranking competitors
├── Division rivals
└── Tournament brackets
```

### Gamification Mechanics

#### Engagement Drivers
```
DAILY Mechanics
├── Login streak counter
├── Daily challenges
├── Practice reminders
└── Progress bars

WEEKLY Cycles
├── Team competitions
├── Ranking updates
├── New activities
└── Achievement reviews

SEASONAL Events
├── Tournaments
├── Special badges
├── Scholarship rounds
└── Hall of Game selection
```

#### Progress Visualization
```
INDIVIDUAL Progress
├── Level progression (1-100)
├── Skill trees
├── Achievement paths
├── Performance graphs
└── Improvement trends

TEAM Progress
├── Team level
├── Collective achievements
├── Synergy metrics
├── Competition ladder
└── Historical performance
```

### Community Building

#### Division Communities
Each division forms its own micro-community:
- Shared challenges
- Peer mentorship
- Division pride
- Internal competitions

#### Genre Communities
Specialized communities around debate types:
- EMD Debate specialists
- Mock Trial enthusiasts
- Model UN participants
- Speech & Drama groups

#### School Communities
School-based affiliations:
- School teams
- Inter-school rivalries
- School championships
- Collective achievements

### Trust & Safety

#### Reputation System
```
TRUST Score Components
├── Activity completion rate
├── Team reliability
├── Payment history
├── Communication quality
├── Peer ratings
└── Enabler feedback
```

#### Safety Mechanisms
- Age-appropriate matching
- Supervised communications
- Report/flag system
- Escalation protocols
- Account restrictions
- Platform moderation

---

*The Social Dynamics and Achievement Systems create a vibrant, competitive, yet safe environment where students build meaningful connections while pursuing academic excellence through gamified learning experiences.*

**Next**: Part 5 - Technical Architecture & Implementation Roadmap