# EDL Platform Foundation Documentation
## Part 5: Technical Architecture & Implementation Roadmap

### Database Architecture

#### Schema Design Principles
**Source**: EDL database schema.md (480 lines)

**Naming Convention**:
```
Prefix System (Logical Grouping):
A_  - Core User Tables (Users, Players, Supervisors, Enablers)
B_  - Activity & Competition Tables
C_  - Financial & Transaction Tables
D_  - Content & Communication Tables
```

#### Core Database Relationships
```sql
-- User Trinity Foundation
Users (1) ←→ (0..1) AC_Players
Users (1) ←→ (0..1) AE_Supervisors  
Users (1) ←→ (0..1) AI_Enablers

-- Supervisor-Player Linking
AE_Supervisors (1) ←→ (0..6) AC_Players

-- Team Structure
BE_Teams (1) ←→ (1..6) BF_TeamMates
AC_Players (1) ←→ (N) BF_TeamMates

-- Activity Participation
BC_Activities (1) ←→ (N) BD_Registrations
BD_Registrations (N) ←→ (1) Users

-- Financial Flow
AE_Supervisors (1) ←→ (N) DB_emCoinTransactions
AG_metaPassAddOns (1) ←→ (N) DB_emCoinTransactions
```

#### Data Integrity Patterns
```javascript
// Cascade Rules
ON DELETE CASCADE: User deletion removes all related data
ON DELETE RESTRICT: Prevent deletion if dependencies exist
ON UPDATE CASCADE: callSign changes propagate

// Soft Deletes
archived_at: timestamp for logical deletion
is_active: boolean flag for temporary deactivation

// Audit Trail
created_at, updated_at: automatic timestamps
created_by, updated_by: user tracking
change_log: JSON field for history
```

### Canvas-to-Database Mapping

#### Canvas JSON Structure → Database Tables
```
Canvas Node Types → Database Entities:

"text" nodes with color codes:
├── #ffffff (white) → System screens/states
├── #666dd5 (purple) → Enabler elements → AI_Enablers
├── #e633c5 (pink) → Financial elements → AG_metaPassAddOns
├── #a64e4e (red) → Activity elements → BC_Activities
├── #068408 (green) → Badge elements → CC_Badges
├── #a8e4f0 (blue) → Analytics elements → BB_playerAnalytics
├── "3" (orange) → Supervisor elements → AE_Supervisors
├── "4" (green) → Player elements → AC_Players
├── "6" (yellow) → Action buttons → State transitions
```

#### Wireframe Flow → Database Operations
```javascript
// Canvas: Onboarding Flow (001-1)
// Database: User registration sequence

// Step 1: Role Selection (Canvas node)
INSERT INTO Users (email, password) 
RETURNING UserID;

// Step 2: Player Profile (Canvas node)
INSERT INTO AC_Players (
  UserID, firstName, lastName, 
  school, gradYear
);

// Step 3: Personality (Canvas node)  
INSERT INTO DE_PlayerPersonality (
  PlayerID, MBTI, OCEAN, visibility
);

// Step 4: Supervisor Linking (Canvas node)
UPDATE AC_Players 
SET supervisorApproval = 'PENDING'
WHERE PlayerID = ?;
```

### Technology Stack

#### Frontend Architecture
```
Framework: Vanilla JavaScript (as per vision)
├── No build process (direct manipulation)
├── Web Components for reusability
├── CSS Variables for theming
└── Progressive Enhancement

Structure:
/frontend
├── /components     # Reusable UI components
├── /pages         # Route-based pages
├── /lib           # Core libraries
├── /styles        # Global styles
└── /assets        # Static resources
```

#### Backend Architecture
```
Framework: Node.js with Express
├── RESTful API design
├── WebSocket for real-time
├── JWT authentication
└── Rate limiting

Structure:
/backend
├── /api           # API endpoints
├── /models        # Database models
├── /services      # Business logic
├── /middleware    # Auth, validation
└── /utils         # Helper functions
```

#### Database Layer
```
Primary: PostgreSQL (Supabase)
├── Row Level Security (RLS)
├── Real-time subscriptions
├── Built-in auth
└── Auto-generated APIs

Caching: Redis
├── Session management
├── Rate limiting
├── Temporary data
└── Queue management
```

### Implementation Roadmap

#### Phase 0: Foundation (Week 1-2)
```
Database Setup
├── Create all tables from schema
├── Implement relationships
├── Set up RLS policies
└── Seed test data

Authentication System
├── User registration flow
├── Role-based access
├── Session management
└── Password recovery

Basic Navigation
├── Landing pages
├── Dashboard shells
├── Routing system
└── Menu structure
```

#### Phase 1: User Trinity (Week 3-4)
```
Player Implementation
├── Profile creation
├── Personality system
├── Dashboard basics
└── Division assignment

Supervisor Implementation
├── Linked player management
├── Approval workflows
├── Dashboard overview
└── Payment integration

Enabler Implementation
├── Certification system
├── Availability management
├── Basic dashboard
└── Payment info setup
```

#### Phase 2: Economic Engine (Week 5-6)
```
Subscription System
├── Plan selection
├── Payment processing (Toss API)
├── metaPass addon
└── Auto-renewal

emCoin Implementation
├── Conversion system (1:1.618)
├── Transaction logging
├── Balance management
└── Transfer restrictions

Ledger System
├── Real money tracking
├── Virtual currency tracking
├── Audit trail
└── Reporting
```

#### Phase 3: Activity Core (Week 7-9)
```
Activity Management
├── CRUD operations
├── Registration flow
├── Capacity tracking
└── Schedule management

5-Session Structure
├── Session templates
├── Progress tracking
├── Material distribution
└── Completion verification

Chamber System
├── Instance creation
├── URL generation
├── Roll call
└── Recording integration
```

#### Phase 4: Team Dynamics (Week 10-11)
```
Team Formation
├── Creation workflow
├── Logo upload
├── Description system
└── Status management

Member Management
├── Invitation system
├── Role assignment
├── Join/leave flow
└── Team communication

Team Activities
├── Group registration
├── Collective scoring
├── Team rankings
└── Shared achievements
```

#### Phase 5: Achievement Layer (Week 12-13)
```
Badge System
├── Badge definitions
├── Earning triggers
├── Validation logic
└── Display widgets

Ranking System
├── Score calculation
├── Division rankings
├── Update schedules
└── Historical tracking

Hall of Game
├── Selection criteria
├── Quarterly updates
├── Benefits system
└── Public display
```

#### Phase 6: Content & Resources (Week 14-15)
```
Resource Management
├── Upload system
├── Version control
├── Access control
└── Parent-child links

Review System
├── Rating interface
├── Comment system
├── Helpful markers
└── Flag mechanism

AI Integration
├── Content analysis
├── Feedback generation
├── Performance metrics
└── Personalization
```

#### Phase 7: Communication (Week 16-17)
```
Messaging System
├── Direct messages
├── Team channels
├── Activity threads
└── Notifications

Safety Features
├── Content filtering
├── Supervisor visibility
├── Report system
└── Moderation queue
```

#### Phase 8: Polish & Launch (Week 18-20)
```
Performance Optimization
├── Database indexing
├── Query optimization
├── Caching strategy
└── CDN setup

Testing & QA
├── Unit tests
├── Integration tests
├── User acceptance
└── Load testing

Launch Preparation
├── Production deployment
├── Monitoring setup
├── Documentation
└── Training materials
```

### Key Implementation Patterns

#### State Management
```javascript
// Activity State Machine
const ActivityStates = {
  DRAFT: 'draft',
  PUBLISHED: 'published',
  REGISTRATION_OPEN: 'registration_open',
  REGISTRATION_CLOSED: 'registration_closed',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  ARCHIVED: 'archived'
};

// State Transitions
const validTransitions = {
  draft: ['published'],
  published: ['registration_open'],
  registration_open: ['registration_closed', 'in_progress'],
  registration_closed: ['in_progress'],
  in_progress: ['completed'],
  completed: ['archived']
};
```

#### Permission System
```javascript
// Role-Based Permissions
const permissions = {
  player: {
    read: ['own_profile', 'public_activities', 'team_data'],
    write: ['own_profile', 'team_messages'],
    delete: ['own_messages']
  },
  supervisor: {
    read: ['linked_players', 'all_communications', 'financial'],
    write: ['approvals', 'payments'],
    delete: ['linked_player_content']
  },
  enabler: {
    read: ['assigned_activities', 'participant_data'],
    write: ['ballots', 'feedback'],
    delete: []
  }
};
```

#### Real-time Updates
```javascript
// Supabase Real-time Subscriptions
const subscription = supabase
  .from('BD_Registrations')
  .on('INSERT', payload => {
    updateActivityCapacity(payload.new);
  })
  .on('DELETE', payload => {
    releaseActivitySlot(payload.old);
  })
  .subscribe();
```

### Performance Considerations

#### Database Optimization
```sql
-- Critical Indexes
CREATE INDEX idx_players_division ON AC_Players(gradYear);
CREATE INDEX idx_activities_dates ON BC_Activities(startDate, endDate);
CREATE INDEX idx_registrations_status ON BD_Registrations(paymentStatus);
CREATE INDEX idx_rankings_division ON BJ_PlayerRankings(DivisionID, rankingPosition);

-- Materialized Views for Complex Queries
CREATE MATERIALIZED VIEW mv_team_rankings AS
SELECT ... -- Complex ranking calculation
WITH DATA;
REFRESH MATERIALIZED VIEW CONCURRENTLY mv_team_rankings;
```

#### Caching Strategy
```
Cache Levels:
1. Browser Cache (static assets)
2. CDN Cache (images, videos)
3. Application Cache (Redis)
4. Database Cache (query results)

Cache Keys:
- user:{userId}:profile (5 min)
- activity:{activityId}:details (1 hour)
- rankings:{divisionId} (1 day)
- badges:public (1 week)
```

### Security Architecture

#### Authentication Flow
```
1. User Login
   ├── Validate credentials
   ├── Check account status
   ├── Generate JWT token
   └── Set refresh token

2. Request Authorization
   ├── Verify JWT
   ├── Check permissions
   ├── Validate ownership
   └── Log access

3. Session Management
   ├── Token refresh
   ├── Activity tracking
   ├── Timeout handling
   └── Logout cleanup
```

#### Data Protection
```
Encryption:
- Passwords: bcrypt (10 rounds)
- Sensitive data: AES-256
- Communications: TLS 1.3
- Backups: Encrypted at rest

PII Handling:
- Minimal collection
- Purpose limitation
- Access logging
- Deletion rights
```

### Monitoring & Analytics

#### System Metrics
```
Performance:
- Response times
- Database query times
- Cache hit rates
- Error rates

Business:
- User registrations
- Activity completions
- Revenue metrics
- Engagement rates

Health:
- Server resources
- Database connections
- Queue depths
- API limits
```

### Deployment Architecture

#### Infrastructure
```
Production Environment:
├── Load Balancer (AWS ALB)
├── Web Servers (EC2 Auto-scaling)
├── Database (Supabase managed)
├── Cache (ElastiCache)
├── Storage (S3)
├── CDN (CloudFront)
└── Monitoring (CloudWatch)

Development Environment:
├── Local development
├── Staging server
├── Testing database
└── CI/CD pipeline
```

---

*This Technical Architecture and Implementation Roadmap provides a clear path from vision to reality, ensuring that every Canvas wireframe node and database table serves the ultimate goal: creating the Cyworld of education where learning becomes identity.*

**This completes the 5-part EDL Platform Foundation Documentation series.**