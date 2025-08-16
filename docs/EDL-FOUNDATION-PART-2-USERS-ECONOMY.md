# EDL Platform Foundation Documentation
## Part 2: User Trinity & Economic Engine

### The User Trinity Model

#### Overview
EDL operates on a three-sided marketplace model where each user type has distinct roles, motivations, and value exchanges. This trinity creates a self-sustaining ecosystem.

### 🟢 Players (Students)

#### Identity & Profile
**Database Tables**: `Users`, `AC_Players`, `DE_PlayerPersonality`

**Core Attributes**:
- **PlayerID**: Unique identifier
- **callSign**: Chosen username (changeable with history tracking)
- **School & Location**: Geographic and institutional placement
- **Grade Year**: Determines division assignment (G4-12)
- **Personality Profile**: MBTI and OCEAN models for matching

#### Division Placement
**Canvas Reference**: 002-4 HoG Box shows division structure
**Database**: `AJ_Division` table

| Division | Grades | Years | Korean Context |
|----------|--------|-------|---------------|
| Village | 4-5 | 2032-2031 | Elementary |
| Lower | 6-7 | 2030-2029 | Middle School |
| Upper | 8-9 | 2028-2027 | Middle School |
| Senior | 10-12 | 2026-2024 | High School |

#### Player Journey States
1. **Grey State**: Pending supervisor verification
2. **Active State**: Full dashboard access
3. **Team State**: Member of team(s)
4. **Competition State**: Enrolled in activities

#### Personality System
**Canvas Reference**: 001-1 Onboarding shows MBTI/OCEAN selection
**Database**: `DE_PlayerPersonality` with visibility controls

**MBTI Components**:
- Attitude: E/I (Extraversion/Introversion)
- Perception: S/N (Sensing/Intuition)
- Judgment: T/F (Thinking/Feeling)
- Lifestyle: J/P (Judging/Perceiving)

**OCEAN Model (Big 5)**:
- Openness (score 0-100)
- Conscientiousness (score 0-100)
- Extraversion (score 0-100)
- Agreeableness (score 0-100)
- Neuroticism (score 0-100)

**Visibility Options**:
- Hidden (default)
- Associates only
- All users

### 🟠 Supervisors (Parents/Guardians)

#### Identity & Authority
**Database Tables**: `Users`, `AE_Supervisors`

**Core Capabilities**:
- Link up to 6 Players
- Manage metaPass subscriptions
- Approve/reject expenditures
- View all player communications
- Access performance analytics

#### Subscription Management
**Canvas Reference**: 001-1 shows subscription flow
**Database**: `AF_Subscriptions`, `AG_metaPassAddOns`

**Subscription Tiers**:
```
Base Plans:
- 3 months: 330 USD
- 12 months: 989 USD

metaPass AddOn:
- Additional: 890 USD
- Converts to: 1,440 emCoins (1.618x multiplier)
```

#### Supervisor Dashboard Elements
1. **Linked Players Grid**: 2x3 layout showing all managed players
2. **Financial Overview**: Subscription status, emCoin balance
3. **Activity Tracker**: Registration pending/approved/rejected
4. **Performance Metrics**: Aggregated analytics across players
5. **Communication Hub**: Recent messages and team invitations

### 🟣 Enablers (Judges/Facilitators)

#### Identity & Certification
**Database Tables**: `Users`, `AI_Enablers`, `BA_EnablerCertifications`

**Core Functions**:
- Provide expert feedback through ballots
- Facilitate debate activities
- Earn emCoins for services
- Maintain certification status

#### Certification System
**Database**: `CB_Certifications`, `BA_EnablerCertifications`

**Certification Levels**:
- Entry Level: Basic facilitation
- Advanced: Complex debate formats
- Expert: Tournament judging
- Master: Trainer of trainers

#### Enabler Economics
**Payment Flow**:
1. Submit ballot for activity
2. Ballot reviewed by system
3. Payment processed in emCoins
4. Monthly payout to bank account

### The Economic Engine

#### Virtual Currency: emCoin

**Core Design**:
- **Exchange Rate**: 1 USD = 1.618 emCoins (Golden Ratio!)
- **Symbol**: ₑ (proposed)
- **Decimal Places**: 2 (like traditional currency)

#### Currency Flow Architecture

```
INFLOW (USD → emCoin)
├── Supervisor Subscriptions
│   ├── Base subscription
│   └── metaPass AddOn
├── Direct Purchase
└── Scholarship Donations

CIRCULATION (emCoin → emCoin)
├── Activity Fees
├── Resource Purchase
├── Customization Items
├── Badge Unlocks
└── Team Creation

OUTFLOW (emCoin → USD)
├── Enabler Payments
├── Content Creator Royalties
└── Scholarship Disbursements
```

#### Transaction Types
**Database**: `DB_emCoinTransactions`, `CE_Ledger`

**Credit Transactions**:
- Subscription deposits
- Direct purchases
- Earned from judging
- Scholarship awards
- Refunds

**Debit Transactions**:
- Activity enrollment
- Resource access
- Customization purchases
- Team creation fees
- Transfer to other users

#### Financial Safety Mechanisms

**Approval Workflows**:
1. **Player Requests** → Supervisor Approval → Transaction
2. **Auto-Approval Limits**: Set by supervisor
3. **Cooling Period**: 24-hour hold on large transactions
4. **Audit Trail**: Complete transaction history

**Database Implementation**:
```sql
-- AG_metaPassAddOns table tracks:
- amountPrepaid (USD deposited)
- emCoinDeposit (converted amount)
- balance (current balance)
- quotaPerQuarter (spending limits)
- scholarshipPoolDonation (social good)
```

### Scholarship System

#### Pool Formation
**Database**: `AH_ScholarshipPool`, `CG_ScholarshipRecipients`

**Sources**:
- Supervisor donations (optional add-on)
- Corporate sponsorships
- Platform allocation
- Tournament prizes

#### Distribution Criteria
- Merit-based (performance)
- Need-based (financial aid eligibility)
- Participation-based (consistency)
- Innovation-based (content creation)

### Economic Incentive Alignment

#### For Players
- **Earn**: Achievements, content creation, peer tutoring
- **Spend**: Activities, customization, resources
- **Save**: For premium events, team creation

#### For Supervisors
- **Invest**: In children's education
- **Control**: Spending limits and approvals
- **Track**: ROI through performance metrics

#### For Enablers
- **Earn**: Predictable income from judging
- **Grow**: Higher certification = higher rates
- **Flexibility**: Work from home, own schedule

### User State Transitions

#### Registration Flow (Canvas 001-1)
```
PUBLIC → Role Selection
         ├── PLAYER → Supervisor Auth → Grey State → Active
         ├── SUPERVISOR → Payment → Verification → Active
         └── ENABLER → Certification → Verification → Active
```

#### Verification States
**Grey Dashboard** (Pending):
- Limited functionality
- Displays pending status
- Shows required actions

**Active Dashboard** (Verified):
- Full feature access
- Transaction capability
- Communication enabled

### Privacy & Safety Architecture

#### Child Protection
- All player communications visible to supervisors
- Age-appropriate content filtering
- Restricted direct messaging
- Team communications monitored

#### Financial Protection
- No direct player-to-player transfers
- Supervisor approval requirements
- Transaction limits
- Complete audit trail

#### Data Protection
- Personality data privacy controls
- Optional visibility settings
- GDPR compliance structure
- Right to deletion

---

*The User Trinity and Economic Engine create a self-sustaining ecosystem where educational value translates directly to economic value, driving engagement through aligned incentives.*

**Next**: Part 3 - Activity Lifecycle & Learning Architecture