# EDL Platform Foundation Documentation
## Part 3: Activity Lifecycle & Learning Architecture

### Activity System Overview

The Activity system is the core learning engine of EDL, transforming traditional debate education into structured, gamified experiences with clear progression paths.

### Activity Structure

#### Core Activity Components
**Database**: `BC_Activities`, `DG_InstanceChamber`
**Canvas Reference**: 001-4 Activity & Registrar, 001-5 Activity Instance

**Activity Attributes**:
```javascript
{
  ActivityID: "unique_identifier",
  title: "Resolved: THS Mandatory GMO Labelling",
  activityType: "EMD_DEBATE",
  format: "Asynchronous_2CF",
  startDate: "2024-03-01",
  endDate: "2024-03-31",
  enrollmentCapacity: 8,
  enablerSlots: 3,
  membersFee: 55.00 // in emCoins
}
```

#### The 5-Session Learning Architecture
**Canvas Reference**: 001-5 shows complete session flow

```
Session 1: Lecture I - Foundation
├── Content: Core concepts introduction
├── Task: Outline case draft
├── Duration: 90 minutes
└── Format: Asynchronous video + materials

Session 2: Technical - Skills Building
├── Content: Framework identification
├── Task: Identify arguments and structure
├── Duration: 90 minutes
└── Format: Interactive exercises

Session 3: Lecture II - Advanced Concepts
├── Content: Advanced techniques
├── Task: Finalize case draft
├── Duration: 90 minutes
└── Format: Asynchronous with AI feedback

Session 4: Lecture III - Refinement
├── Content: Polish and strategy
├── Task: Re-edit case submission
├── Duration: 90 minutes
└── Format: Peer review + enabler feedback

Session 5: Synchronous Debate Round
├── Content: Live competition
├── Task: Perform debate + self-report
├── Duration: 2-3 hours
└── Format: Real-time chamber with recording
```

### Registration & Enrollment

#### Registration Flow
**Database**: `BD_Registrations`
**Canvas Reference**: 001-4 Registration sections

```
1. BROWSE Activities
   ├── Filter by Division
   ├── Filter by Genre
   ├── Filter by Date
   └── View vacancy status (e.g., "3 of 8")

2. SELECT Activity
   ├── View details
   ├── Check prerequisites
   ├── Review fee
   └── See enabler assignments

3. REGISTER
   ├── Choose role (if team)
   ├── Request supervisor approval
   ├── Pay fee (emCoins)
   └── Receive confirmation

4. PENDING State
   ├── Awaiting supervisor approval
   ├── Awaiting payment clearance
   ├── Awaiting team formation
   └── 24-hour expiration window

5. CONFIRMED State
   ├── Access to materials
   ├── Calendar integration
   ├── Notification setup
   └── Chamber URL provided
```

#### Participant Management
**Capacity Tracking**:
```
Total Slots: 8 players
├── Slot 1: callSign01 (Confirmed)
├── Slot 2: callSign02 (Confirmed)
├── Slot 3: OPEN
├── Slot 4: Pending (expires in 18h)
├── Slot 5: callSign05 (Confirmed)
├── Slot 6: OPEN
├── Slot 7: Team reservation
└── Slot 8: Team reservation

Enabler Slots: 3 judges
├── Enabler 1: Assigned
├── Enabler 2: Assigned
└── Enabler 3: RECRUITING
```

### Debate Formats & Mechanics

#### Asynchronous EMD Debate 2CF (2 Crossfires)
**Canvas Reference**: 001-5 Activity Instance details

**Format Structure**:
```
PRE-ROUND
├── Coin Toss (determines speaking order)
├── Position Assignment (PRO/CON)
└── Material Review (30 minutes)

ROUND 1: Front-End Speeches
├── PRO: 4-minute constructive
├── CON: 4-minute constructive
└── 2-minute prep time

CROSSFIRE 1
├── 2-minute Q&A session
├── PRO asks first (if won toss)
└── Alternating questions

ROUND 2: Back-End Speeches
├── PRO: 3-minute rebuttal
├── CON: 3-minute final focus
└── Submit 3 questions each

CROSSFIRE 2
├── 2-minute Q&A session
├── Written responses
└── 2-minute time limit per answer

FINAL FOCUS
├── PRO: 2-minute summary
├── CON: 2-minute summary
└── No new arguments allowed
```

### Learning Resources System

#### Resource Architecture
**Database**: `CD_ResourceMaterials`, `DC_ResourceReviews`
**Canvas Reference**: 002-5 Resources Box

**Resource Hierarchy**:
```
Parent Resource (Course)
├── Module 01 (Basics)
│   ├── Video lectures
│   ├── Reading materials
│   ├── Practice exercises
│   └── Assessment quiz
├── Module 02 (Intermediate)
│   ├── Case studies
│   ├── Template documents
│   ├── Peer examples
│   └── AI practice sessions
└── Module 03 (Advanced)
    ├── Strategy guides
    ├── Tournament footage
    ├── Expert analysis
    └── Certification prep
```

#### Resource Access Levels
```sql
-- Access control in CD_ResourceMaterials
accessLevel ENUM:
  'PUBLIC'     -- Free for all users
  'MEMBERS'    -- Requires active subscription
  'PREMIUM'    -- Additional emCoin payment
  'EXCLUSIVE'  -- Special events/achievements only
```

#### Interactive Learning Flow
**Canvas Reference**: 002-5 Module interaction

```
1. ACCESS Module
   ├── Check prerequisites
   └── Verify access level

2. CONSUME Content
   ├── View instructions
   ├── Read/watch materials
   └── Take notes

3. SUBMIT Response
   ├── Text input (essay/analysis)
   ├── File upload (documents)
   └── Wait for processing

4. AI EVALUATION
   ├── Real-time analysis
   ├── Personalized feedback
   ├── Improvement suggestions
   └── Score assignment (1-5)

5. COMPLETION
   ├── Mark as complete
   ├── Unlock next module
   ├── Update progress
   └── Earn badges
```

### AI Integration Layer

#### AI-Powered Features
**Database References**: AI comments in activities, analytics

**Real-Time Feedback**:
```javascript
// AI Analysis Points
{
  thinking: {
    timeManagement: 75,
    organization: 82
  },
  writing: {
    grammar: 90,
    redundancy: 65
  },
  speaking: {
    speechSpeed: 70,
    enunciation: 88
  }
}
```

**Personalized Reports**:
- Strength identification
- Improvement areas
- Comparative analysis
- Progress tracking
- Custom recommendations

### Chamber Instance Management

#### Instance Lifecycle
**Database**: `DG_InstanceChamber`

```
CREATED
├── Generate unique chamber URL
├── Set RSVP deadline
└── Notify participants

WAITING
├── Roll call period
├── Technical checks
└── Material distribution

ACTIVE
├── Live debate session
├── Real-time recording
├── Enabler monitoring
└── Issue reporting capability

POST-SESSION
├── Upload recordings
├── Generate ballots
├── Process AI analysis
└── Distribute reports

ARCHIVED
├── Permanent record
├── Available for review
├── Learning resource
└── Portfolio evidence
```

### Performance Analytics

#### Player Analytics System
**Database**: `BB_playerAnalytics`

**Metrics Tracked**:
```json
{
  "performanceMetrics": {
    "argumentClarity": 0.85,
    "evidenceUsage": 0.72,
    "rebuttalEffectiveness": 0.68,
    "timeManagement": 0.90,
    "crossfirePerformance": 0.75
  },
  "improvementAreas": [
    "Stronger opening statements",
    "More specific evidence citations",
    "Better time allocation in rebuttals"
  ],
  "strengthAreas": [
    "Excellent time management",
    "Clear argument structure",
    "Strong closing summaries"
  ]
}
```

### Ballot System

#### Enabler Ballot Generation
**Database**: `BH_Ballots`

**Ballot Components**:
```
SCORING
├── Team A Score: 0-100
├── Team B Score: 0-100
├── Winner Declaration
└── Score Justification

FEEDBACK
├── Written comments (500+ words)
├── Specific improvements
├── Positive reinforcement
└── Future recommendations

VERIFICATION
├── Enabler signature
├── Timestamp
├── Activity reference
└── Participant confirmation
```

### Activity Discovery & Browsing

#### Activity Registrar View
**Canvas Reference**: 001-4 Registrar grid

```
Filter Options:
├── Division (Village/Lower/Upper/Senior)
├── Genre (EMD Debate/Mock Trial/etc.)
├── Date Range
├── Vacancy Status
├── Fee Range
├── Enabler Availability
└── Team vs Solo

Display Format:
┌─────────────────────────────────────┐
│ Title │ Start │ End │ Fee │ Vacancy │
├───────┼───────┼─────┼─────┼─────────┤
│ GMO   │ 03/01 │ 03/31│ 55 │ 3 of 8  │
│ Climate│ 03/15 │ 04/15│ 60 │ FULL    │
│ AI Ethics│ 04/01│ 05/01│ 55│ 6 of 8  │
└─────────────────────────────────────┘
```

### Quality Assurance

#### Activity Quality Metrics
- Completion rate
- Participant satisfaction
- Enabler ratings
- Learning outcomes
- Repeat enrollment

#### Continuous Improvement
- Post-activity surveys
- Enabler feedback loops
- AI analysis of patterns
- Curriculum adjustments
- Content updates

---

*The Activity Lifecycle and Learning Architecture creates a structured yet flexible framework where traditional debate education transforms into engaging, measurable, and continuously improving learning experiences.*

**Next**: Part 4 - Social Dynamics & Achievement Systems