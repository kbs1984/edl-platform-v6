---
created: '2025-08-23'
domain: requirements
priority: P1
purpose: Document p1 user stories - activities & registrar
session: legacy
status: current
title: P1 User Stories - Activities & Registrar
topics:
- requirements
type: specification
based_on:
- reality/snapshot-legacy.md
modified: '2025-08-27'
---

# P1 User Stories - Activities & Registrar

**Extracted From**: Canvas 001-4 (Activity & Registrar Box) and 001-5 (Activity Instance)  
**Priority**: P1 (Essential Features)  
**Session**: 00018  

---

## Activity Creation (Supervisor Perspective)

### US-049: Activity Creation by Supervisor
**As a** Supervisor (teacher/organizer)  
**I want to** create new activities for players  
**So that** I can provide structured learning experiences

**Acceptance Criteria:**
- Activity title and description required
- Activity type selection (Event/Exercise/Training)
- Schedule date and deadline setting
- emCoin cost configuration
- Team vs Individual designation
- Session count configuration (if multi-session)

### US-050: Activity Approval Process
**As a** Supervisor  
**I want to** approve pending activity registrations  
**So that** I can control who participates in my activities

**Acceptance Criteria:**
- View pending registration requests
- See player profiles of requesters
- Approve or deny with reason
- Notification sent to players
- emCoin transaction triggered on approval

### US-051: Activity URL Management
**As a** Supervisor  
**I want to** provide activity URLs when ready  
**So that** players can access the actual activity content

**Acceptance Criteria:**
- URL field becomes available after creation
- URL can be updated until activity starts
- Players notified when URL is available
- URL appears only after registration approved

---

## Activity Registration (Player Perspective)

### US-052: Browse Available Activities
**As a** Player  
**I want to** view upcoming activities  
**So that** I can find relevant learning opportunities

**Acceptance Criteria:**
- List shows upcoming activities
- Filter by type (Event/Exercise/Training)
- Filter by team/individual
- See activity cost in emCoins
- See registration deadline
- See current enrollment count

### US-053: Activity Registration Request
**As a** Player  
**I want to** register for activities  
**So that** I can participate in learning experiences

**Acceptance Criteria:**
- Registration button available before deadline
- emCoin balance check performed
- Registration request sent to supervisor
- Pending status displayed
- Notification when approved/denied

### US-054: Team Activity Registration
**As a** Team Founder  
**I want to** register my team for team activities  
**So that** we can participate together

**Acceptance Criteria:**
- Only founders can register teams
- Team member list shown for confirmation
- Total emCoin cost calculated (per member)
- All members notified of registration
- Team registration status visible to all members

### US-055: Activity Payment Processing
**As a** Player  
**I want to** pay for activities with emCoins  
**So that** I can complete my registration

**Acceptance Criteria:**
- Cost displayed clearly before payment
- Balance check prevents overdraft
- Transaction logged in emCoin history
- Receipt/confirmation provided
- Refund if registration denied

---

## Activity Participation

### US-056: Activity Session Tracking
**As a** Player  
**I want to** track my progress through multi-session activities  
**So that** I know what I've completed and what's next

**Acceptance Criteria:**
- Session counter (e.g., "Session 3 of 5")
- Session descriptions visible
- Completed sessions marked
- Next session requirements shown
- Overall progress percentage

### US-057: Activity Start Notification
**As a** Player  
**I want to** receive notifications about activity timing  
**So that** I don't miss scheduled activities

**Acceptance Criteria:**
- 24-hour advance notification
- 5-minute warning notification
- Activity URL included in notification
- Calendar integration option
- Timezone handling

### US-058: Activity Submission
**As a** Player  
**I want to** submit my work for activities  
**So that** I can complete requirements and receive evaluation

**Acceptance Criteria:**
- Submission form appropriate to activity type
- File upload capabilities
- Text response fields
- Save draft functionality
- Submission confirmation and timestamp

### US-059: Mark Activity Complete
**As a** Player  
**I want to** mark activities as complete  
**So that** I can track my accomplishments

**Acceptance Criteria:**
- Complete button after all requirements met
- Completion timestamp recorded
- Activity moves to history
- Badge/achievement check triggered
- Completion certificate available

---

## Activity Evaluation (Enabler Perspective)

### US-060: Ballot Submission for Activities
**As an** Enabler (judge/evaluator)  
**I want to** submit evaluation ballots  
**So that** I can provide feedback and scores

**Acceptance Criteria:**
- Access to assigned activities only
- Scoring rubric provided
- Written feedback field required
- Claps (recognition) option
- Anonymous or identified options
- Cannot edit after submission

### US-061: Batch Ballot Processing
**As an** Enabler  
**I want to** evaluate multiple participants efficiently  
**So that** I can handle large activities

**Acceptance Criteria:**
- Queue of pending evaluations
- Quick navigation between participants
- Bulk actions for common scores
- Progress tracker
- Auto-save functionality

### US-062: Feedback Delivery
**As an** Enabler  
**I want to** deliver constructive feedback  
**So that** players can learn and improve

**Acceptance Criteria:**
- Structured feedback template
- Positive/improvement sections
- Resource recommendations
- Private vs public feedback options
- Feedback revision period

---

## Activity Management

### US-063: Activity History View
**As a** Player  
**I want to** view my activity history  
**So that** I can track my learning journey

**Acceptance Criteria:**
- Chronological list of past activities
- Filter by type, date, status
- Scores and feedback accessible
- Certificates downloadable
- Statistics summary (completion rate, average score)

### US-064: Activity Analytics Dashboard
**As a** Supervisor  
**I want to** view analytics for my activities  
**So that** I can improve future offerings

**Acceptance Criteria:**
- Enrollment statistics
- Completion rates
- Average scores distribution
- Feedback sentiment analysis
- Player engagement metrics
- Comparative analysis across activities

### US-065: Activity Cancellation
**As a** Supervisor  
**I want to** cancel activities if needed  
**So that** I can handle unexpected situations

**Acceptance Criteria:**
- Cancellation reason required
- All participants notified
- Automatic emCoin refunds
- Activity marked as cancelled (not deleted)
- Option to reschedule

### US-066: Activity Duplication
**As a** Supervisor  
**I want to** duplicate successful activities  
**So that** I can efficiently create similar experiences

**Acceptance Criteria:**
- Copy all activity settings
- New dates/deadlines required
- Option to modify before publishing
- Link to original activity maintained
- Previous participant list available

---

## Activity Types

### US-067: Event Activity Management
**As a** Supervisor  
**I want to** create competitive events  
**So that** players can demonstrate skills

**Acceptance Criteria:**
- Tournament bracket setup
- Real-time result tracking
- Spectator access controls
- Recording capabilities
- Award distribution

### US-068: Exercise Activity Management
**As a** Supervisor  
**I want to** create practice exercises  
**So that** players can build skills

**Acceptance Criteria:**
- Skill level designation
- Prerequisite checking
- Self-paced option
- Attempt limits configuration
- Best score tracking

### US-069: Training Resource Activity
**As a** Supervisor  
**I want to** create training resources  
**So that** players can learn at their own pace

**Acceptance Criteria:**
- Resource library creation
- Sequential learning paths
- Progress bookmarking
- Resource ratings/reviews
- Completion certificates

---

## Integration Stories

### US-070: Activity-Badge Integration
**As a** Player  
**I want to** earn badges through activities  
**So that** I can showcase achievements

**Acceptance Criteria:**
- Badge criteria linked to activities
- Automatic badge awarding
- Progress toward badges visible
- Badge display on profile
- Badge verification system

### US-071: Activity-Team Integration
**As a** Team Member  
**I want to** see team activity participation  
**So that** we can coordinate and support each other

**Acceptance Criteria:**
- Team activity calendar
- Member participation status
- Team achievements display
- Collaborative activity tools
- Team performance metrics

### US-072: Activity-Hall of Game Integration
**As a** Player  
**I want to** outstanding activity performance recognized  
**So that** I can be nominated for Hall of Game

**Acceptance Criteria:**
- Exceptional performance flagging
- Nomination threshold criteria
- Peer nomination option
- Review committee access
- Public recognition display

---

## Total P1 Activity Stories: 24 (US-049 to US-072)

**Next Steps**: 
- Extract P1 stories from Badges (002-3) and Hall of Game (002-4) Canvas files
- Define success criteria for all P0 stories
- Create acceptance test specifications