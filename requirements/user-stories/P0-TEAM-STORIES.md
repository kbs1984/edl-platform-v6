---
session: "unknown"
type: "requirements"
status: "current"
created: "2025-08-23"
title: "P0 User Stories - Team Management"
purpose: "Document p0 user stories - team management"
topics: ['requirements']
priority: "P0"
domain: "requirements"
---

# P0 User Stories - Team Management

**Extracted From**: Canvas 002-2 (Associated Teams Box)  
**Priority**: P0 (Core Foundation)  
**Session**: 00017  

---

## Team Creation & Management

### US-016: Team Foundation
**As a** Player  
**I want to** create a team with name, logo, and description  
**So that** I can establish our team identity

**Acceptance Criteria:**
- TeamName must be unique
- Genre selection required (debate, creative writing, etc.)
- Division assignment based on grade levels
- Optional logo upload (image file)
- Team description (max 500 chars)
- Creator becomes TeamFounder
- CreationDate automatically set
- Initial status: "Mates wanted"

### US-017: Team Status Management
**As a** Team Founder  
**I want to** update team status between "Mates wanted" and "Full house"  
**So that** other players know if we're recruiting

**Acceptance Criteria:**
- Only founder can change status
- Status visible in team directory
- Affects visibility in team search
- Notification to team members on change

### US-018: Team Member Roles
**As a** Team Member  
**I want to** select my role (FE, BE, or QB)  
**So that** the team knows my contribution area

**Acceptance Criteria:**
- Role selection during join process
- FE = Front End, BE = Back End, QB = Quarterback
- Free text entry allowed for custom roles
- Role visible to all team members
- Can be updated by member

### US-019: Team Roster Management
**As a** Team Founder  
**I want to** manage team membership  
**So that** I can maintain an active team

**Acceptance Criteria:**
- View all TeamMates with join dates
- Remove inactive members
- Set maximum team size
- Track departure dates
- Transfer founder role if leaving

---

## Team Invitations

### US-020: Send Team Invitation
**As a** Team Member  
**I want to** invite another team to collaborate  
**So that** we can compete or practice together

**Acceptance Criteria:**
- Select receiving team from directory
- Choose activity for collaboration
- Propose date and time
- Add custom message
- InvitationStatus starts as "pending"

### US-021: Receive Team Invitations
**As a** Team Founder  
**I want to** view and respond to team invitations  
**So that** our team can participate in activities

**Acceptance Criteria:**
- Notification of new invitations
- View sender team details
- See proposed activity and time
- Accept or decline option
- Update InvitationStatus accordingly
- AcceptedDate/Time recorded if accepted

### US-022: Recent Invitations Dashboard
**As a** Team Member  
**I want to** see recent team invitations  
**So that** I stay informed about team activities

**Acceptance Criteria:**
- Last 10 invitations visible
- Status clearly shown (pending/accepted/declined)
- Sorted by date (newest first)
- Quick action buttons for pending

---

## Team Discovery & Association

### US-023: Browse Teams Directory
**As a** Player  
**I want to** browse available teams  
**So that** I can find teams to join

**Acceptance Criteria:**
- Filter by genre
- Filter by division
- Filter by status (recruiting or not)
- Search by team name
- View team details before joining

### US-024: Associated Teams Display
**As a** Player  
**I want to** see all my associated teams  
**So that** I can switch between team contexts

**Acceptance Criteria:**
- Grid view of team logos
- Maximum 9 teams shown initially
- Team name on hover
- Click to switch active team
- Join date visible

### US-025: Team Messages
**As a** Team Member  
**I want to** communicate with my team  
**So that** we can coordinate activities

**Acceptance Criteria:**
- Team-wide message board
- Only team members can post
- Messages timestamped
- Notification of new messages
- Supervisors can view (read-only)

---

## Team Analytics

### US-026: Team Rankings
**As a** Team Member  
**I want to** see team rankings  
**So that** I know how we compare to others

**Acceptance Criteria:**
- Rankings by division
- Rankings by genre
- Overall team score
- Individual contribution scores
- Historical ranking trends

### US-027: Team Ballots & Feedback
**As a** Team  
**I want to** receive ballots and feedback  
**So that** we can improve our performance

**Acceptance Criteria:**
- Aggregate team scores
- Individual member feedback
- Enabler comments visible
- Improvement suggestions
- Historical feedback archive

---

## Data Model Requirements

Based on Canvas analysis, the team system requires:

```sql
Teams Table:
- TeamID (primary key)
- TeamName (unique)
- Genre
- DivisionID
- TeamLogo (URL/blob)
- TeamDescription
- TeamFounder (PlayerID)
- CreationDate
- TeamStatus (enum: 'mates_wanted', 'full_house')

TeamMembers Table:
- TeamMateID (primary key)
- TeamID (foreign key)
- PlayerID (foreign key)
- Role (text)
- JoinDate
- DepartDate (nullable)

TeamInvitations Table:
- InvitationID (primary key)
- SenderTeamID
- ReceiverTeamID
- ActivityID
- ProposedDate
- ProposedTime
- MessageCard
- InvitationStatus (enum: 'pending', 'accepted', 'declined')
- AcceptedDate (nullable)
- AcceptedTime (nullable)
```

---

## Priority Notes

Teams are **P0 priority** because:
1. Core differentiator of EDL platform
2. Required for most activities
3. Enables collaborative learning
4. Foundation for competition system

---

*Next: Extract activity stories from Canvas 001-4*