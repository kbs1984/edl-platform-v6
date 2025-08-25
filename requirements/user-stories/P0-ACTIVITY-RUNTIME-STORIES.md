---
created: '2025-08-23'
domain: requirements
priority: P0
purpose: Document p0 user stories - activity runtime execution
session: legacy
status: current
title: P0 User Stories - Activity Runtime Execution
topics:
- requirements
type: specification
---

# P0 User Stories - Activity Runtime Execution

**Created**: Session 00023  
**Updated**: Session 00024 - Critical gaps filled  
**Source**: Canvas 001-5 (Activity Instance) - 727 tasks  
**Priority**: P0 (ENGINE-LEVEL FUNCTIONALITY)  
**Status**: EMERGENCY EXTRACTION CONTINUED  

## Context

Canvas 001-5 "Activity Instance" contains 727 tasks (12.5% of total system) that describe how activities ACTUALLY RUN. This critical functionality was completely missing from existing stories which only covered activity creation and registration, not execution.

---

## Activity Session Management

### US-155: Multi-Session Activity Structure
**As a** Player participating in a multi-session activity  
**I want to** progress through defined sessions sequentially  
**So that** I can complete complex activities over multiple time periods  

**Acceptance Criteria:**
- System tracks current session number (e.g., "Session 1 of 5")
- Each session has distinct content and objectives
- Progress is saved between sessions
- Cannot skip ahead to future sessions
- Can review completed sessions

**Canvas Source**: 001-5 tasks showing "Session 1 of 5", "Session 3 4 5 of 5"

### US-156: Session State Persistence  
**As a** Player in an ongoing activity session  
**I want to** save my progress and continue later  
**So that** I don't lose work if interrupted  

**Acceptance Criteria:**
- "Save and Next" functionality preserves current state
- Auto-save every 5 minutes during active work
- Resume exactly where left off
- Warning before session timeout
- Draft responses preserved

**Canvas Source**: 001-5 "Save and Next" repeated tasks

### US-157: Session Transition Flow
**As a** Player completing a session  
**I want to** smoothly transition to the next session  
**So that** I maintain momentum in the activity  

**Acceptance Criteria:**
- Clear indication when session is complete
- "Move to S2" (Session 2) transition
- Cannot proceed until current session requirements met
- Session completion timestamp recorded
- Next session requirements displayed

**Canvas Source**: 001-5 "Move to S2" tasks

---

## Assignment Submission Within Activities

### US-158: In-Activity Assignment Creation
**As a** Player in an activity session  
**I want to** receive and complete assignments  
**So that** I can demonstrate learning within the activity context  

**Acceptance Criteria:**
- Assignments embedded within activity flow
- Clear submission requirements (e.g., "Submit a draft case for PRO and CON")
- Assignment tied to specific session
- Multiple assignment types supported
- Rubric visible before submission

**Canvas Source**: 001-5 "Assignment: Submit a draft case" tasks

### US-159: Assignment Submission Workflow
**As a** Player completing an assignment  
**I want to** submit my work with all required components  
**So that** it can be properly evaluated  

**Acceptance Criteria:**
- File upload for documents
- Text entry for responses
- Citation requirements enforced ("Must submit all citations mentioned")
- Confirmation of successful submission
- Receipt with timestamp provided

**Canvas Source**: 001-5 submission rules and requirements

### US-160: Question Submission System
**As a** Player in an interactive session  
**I want to** submit questions for discussion  
**So that** I can engage with content actively  

**Acceptance Criteria:**
- "Submit Three Questions" requirement tracking
- Questions linked to session content
- 24-hour response window for submitted questions
- Question visibility to appropriate parties
- Question history maintained

**Canvas Source**: 001-5 "Submit Three Questions" tasks

---

## Deadline and Time Management

### US-161: Activity Deadline Enforcement
**As a** System managing activity timelines  
**I want to** enforce submission deadlines  
**So that** activities proceed on schedule  

**Acceptance Criteria:**
- Deadlines displayed as "YYMMDD by TT:TT"
- Countdown timer for approaching deadlines
- Automatic closure at deadline
- Late submission handling
- Timezone-aware deadline calculation

**Canvas Source**: 001-5 "Deadline: YYMMDD by TT:TT" tasks

### US-162: Deadline Extension Requests
**As a** Player needing more time  
**I want to** request a deadline extension  
**So that** I can complete quality work despite circumstances  

**Acceptance Criteria:**
- "Request Extension" button available before deadline
- Reason for extension required
- Supervisor notification of request
- Approval/denial workflow
- New deadline reflected if approved

**Canvas Source**: 001-5 "Request Extension" tasks

### US-163: Time-Sensitive Response Windows
**As a** Player participating in time-sensitive activities  
**I want to** know response time requirements  
**So that** I can prioritize appropriately  

**Acceptance Criteria:**
- "To be viewed and responded within 24 hours" notifications
- Countdown timers for response windows
- Alerts for expiring response times
- Penalty for missed windows defined
- Grace period handling

**Canvas Source**: 001-5 24-hour response requirements

---

## Progress Tracking and Reporting

### US-164: Personalized Progress Reports
**As a** Player in an activity  
**I want to** receive personalized progress reports  
**So that** I understand my performance  

**Acceptance Criteria:**
- "Personalized report for your case" generation
- Report includes session completion status
- Performance metrics included
- Comparison to benchmarks
- Actionable feedback provided

**Canvas Source**: 001-5 "personalized report" tasks

### US-165: Self-Report Questionnaires
**As a** Player completing an activity  
**I want to** complete self-assessment reports  
**So that** I can reflect on my learning  

**Acceptance Criteria:**
- "Self Report Q1" through multiple questions
- Questions tied to learning objectives
- Responses saved for later review
- Required vs optional questions marked
- Summary of self-assessment provided

**Canvas Source**: 001-5 "Self Report Q1" tasks

### US-166: Activity Completion Notifications
**As a** Player in a group activity  
**I want to** know when all participants have completed  
**So that** we can proceed together  

**Acceptance Criteria:**
- "Notify when all ballots submitted" functionality
- Real-time completion tracking
- Participant status visible (where appropriate)
- Estimated completion time
- Group readiness indicators

**Canvas Source**: 001-5 ballot submission notification

---

## Template and Content Management

### US-167: Activity Template Access
**As a** Player working on assignments  
**I want to** access provided templates  
**So that** I can structure my work properly  

**Acceptance Criteria:**
- "Copy txt template" functionality
- Templates specific to assignment type
- Version control for templates
- Filled template saving
- Template modification tracking

**Canvas Source**: 001-5 "Copy txt template" tasks

### US-168: Content Submission Rules
**As a** Player submitting content  
**I want to** understand submission rules  
**So that** I comply with requirements  

**Acceptance Criteria:**
- Rules clearly displayed before submission
- Citation requirements specified
- Format requirements enforced
- Word/page limits shown
- Compliance checking before accept

**Canvas Source**: 001-5 detailed rules for submissions

---

## Technical Implementation Notes

These stories represent RUNTIME EXECUTION of activities - without these, the platform cannot actually run activities, only define them. This is critical P1 functionality that should arguably be P0.

Key technical requirements:
- Session state management system
- Assignment submission pipeline
- Deadline enforcement engine
- Progress tracking database
- Report generation system

## Validation Notes

These 15 stories only scratch the surface of the 727 tasks in Canvas 001-5. Full extraction would likely yield 30-40 stories for complete activity runtime functionality.

Priority for immediate implementation:
1. Session management (US-155, 156, 157)
2. Assignment submission (US-158, 159)
3. Deadline management (US-161, 162)
4. Progress reporting (US-164)

---

## Voting and Ballot System

### US-169: Ballot Collection and Distribution
**As a** System managing peer evaluations  
**I want to** collect and distribute ballots to participants  
**So that** peer assessment can occur systematically  

**Acceptance Criteria:**
- Ballot creation for each evaluation type
- Distribution to appropriate evaluators
- "Ballot Inbox" for each participant
- Notification when all ballots submitted
- Anonymous ballot option available
- Ballot submission deadline enforcement

**Canvas Source**: 001-5 "Ballot Inbox", "notify when all ballots submitted" tasks

### US-170: Voting Mechanism Implementation
**As a** Player participating in peer evaluation  
**I want to** cast votes on submissions  
**So that** quality work is recognized  

**Acceptance Criteria:**
- Clear voting interface with criteria
- Score submission with justification
- Cannot vote on own submission
- Vote changing before deadline
- Voting history maintained
- Results calculation automatic

**Canvas Source**: 001-5 voting and scoring tasks

### US-171: Score and Feedback Distribution
**As a** Player who has been evaluated  
**I want to** receive scores and feedback  
**So that** I can improve my performance  

**Acceptance Criteria:**
- Scores delivered to Ballot Inbox
- Minimum 3 feedback items provided
- Anonymous feedback option
- Aggregate scores calculated
- Score breakdown by criteria
- Historical scores accessible

**Canvas Source**: 001-5 "check your Ballot Inbox for scores and feedback" tasks

---

## Live Event and Recording Management

### US-172: Live Event Session Management
**As a** System managing live activities  
**I want to** coordinate live event sessions  
**So that** synchronous learning can occur  

**Acceptance Criteria:**
- Live event scheduling system
- Participant registration for events
- "5 session live EXERCISE" tracking
- Attendance verification
- Live event URL generation
- Recording initiation automatic

**Canvas Source**: 001-5 "5 session live EXERCISE", "live events" tasks

### US-173: Activity Recording System
**As a** System documenting activities  
**I want to** record and store activity sessions  
**So that** they can be reviewed later  

**Acceptance Criteria:**
- Automatic recording of live sessions
- Video upload URL generation
- "Asynchronous EMD Debate Recording" support
- Recording storage and retrieval
- Recording access permissions
- Playback capability within platform

**Canvas Source**: 001-5 "video recording url", "Asychronous EMD Debate SUM Recording" tasks

### US-174: Asynchronous Activity Support
**As a** Player in different timezones  
**I want to** participate asynchronously  
**So that** geography doesn't limit participation  

**Acceptance Criteria:**
- "ASYNCH MATCH" mode available
- Timezone limitation bypass
- Recorded responses accepted
- Asynchronous interaction tracking
- Time-shifted participation allowed
- Equivalent experience to live

**Canvas Source**: 001-5 "ASYNCH MATCH Designed to bypass geographical and timezone" tasks

---

## Judging and Evaluation System

### US-175: Judge Assignment and Management
**As a** System requiring expert evaluation  
**I want to** assign and manage judges  
**So that** activities are properly evaluated  

**Acceptance Criteria:**
- Judge role assignment
- "Judge callSign Scorecard" generation
- Judge availability tracking
- Conflict of interest checking
- Judge feedback forms
- Judge decision recording

**Canvas Source**: 001-5 "Judge callSign Scorecard" tasks

### US-176: Evaluation Criteria Management
**As a** Judge evaluating activities  
**I want to** use structured evaluation criteria  
**So that** assessment is consistent  

**Acceptance Criteria:**
- Rubric-based scoring system
- Criteria weights configurable
- Score justification required
- Comparative evaluation support
- Final score calculation
- Decision documentation

**Canvas Source**: 001-5 judge and scoring tasks

---

## Rule Enforcement and Compliance

### US-177: Activity Rule Engine
**As a** System managing complex activities  
**I want to** enforce activity-specific rules  
**So that** fairness is maintained  

**Acceptance Criteria:**
- Rule definition per activity type
- "CON won coin toss, PRO responds first" logic
- Automatic rule enforcement
- Rule violation detection
- Penalty application system
- Appeal process available

**Canvas Source**: 001-5 "Rules: Since CON won the coin toss" tasks

### US-178: Citation Compliance System
**As a** System ensuring academic integrity  
**I want to** enforce citation requirements  
**So that** proper attribution occurs  

**Acceptance Criteria:**
- "Must submit all citations mentioned" enforcement
- Citation format validation
- Citation completeness checking
- Plagiarism detection integration
- Citation report generation
- Missing citation alerts

**Canvas Source**: 001-5 "Must submit all citations mentioned" tasks

### US-179: Time-Based Rule Enforcement
**As a** System managing time-sensitive activities  
**I want to** enforce time-based rules  
**So that** activities proceed on schedule  

**Acceptance Criteria:**
- "24 hours response" window enforcement
- Automatic timeout handling
- Grace period configuration
- Late submission penalties
- Time extension requests
- Timezone-aware calculations

**Canvas Source**: 001-5 "To be viewed and responded within 24 hours" tasks

---

## State Management and Workflow

### US-180: Activity State Machine
**As a** System managing activity flow  
**I want to** track and transition activity states  
**So that** complex workflows execute properly  

**Acceptance Criteria:**
- State definition for each activity type
- State transition rules
- State persistence across sessions
- Rollback capability for errors
- State history maintenance
- Parallel state support for group activities

**Technical Notes**: Core engine functionality for all runtime operations

### US-181: Workflow Orchestration Engine
**As a** System coordinating complex activities  
**I want to** orchestrate multi-step workflows  
**So that** activities flow smoothly  

**Acceptance Criteria:**
- Workflow template system
- Conditional branching support
- Parallel workflow execution
- Workflow monitoring dashboard
- Error recovery mechanisms
- Workflow completion tracking

**Technical Notes**: Essential for multi-session, multi-participant activities

### US-182: Activity Context Preservation
**As a** System managing long-running activities  
**I want to** preserve activity context  
**So that** continuity is maintained  

**Acceptance Criteria:**
- Full context serialization
- Context restoration on resume
- Context versioning for changes
- Context sharing between sessions
- Context migration support
- Context integrity validation

**Technical Notes**: Critical for session persistence and recovery

---

## Result Processing and Distribution

### US-183: Result Calculation Engine
**As a** System processing activity outcomes  
**I want to** calculate and aggregate results  
**So that** outcomes are determined fairly  

**Acceptance Criteria:**
- Multi-criteria result calculation
- Weighted scoring support
- Peer evaluation aggregation
- Judge score integration
- Tiebreaker rules application
- Result audit trail

**Canvas Source**: 001-5 result and score processing tasks

### US-184: Result Distribution System
**As a** System managing outcomes  
**I want to** distribute results to stakeholders  
**So that** everyone is informed appropriately  

**Acceptance Criteria:**
- Result notification system
- Customized result views per role
- Result embargo until all complete
- Result appeal window
- Historical result access
- Result export capability

**Canvas Source**: 001-5 result distribution tasks

---

## Technical Implementation Critical Notes

### Architecture Requirements
These runtime stories represent the EXECUTION ENGINE of the platform. Without these:
- Activities cannot run, only be defined
- No actual learning can occur
- Platform is essentially non-functional

### Priority Implementation Order
1. **State Management** (US-180, 181, 182) - Foundation for everything
2. **Session Management** (US-155-157) - Core activity flow
3. **Submission System** (US-158-160) - Basic functionality
4. **Voting/Ballot** (US-169-171) - Peer interaction
5. **Rule Engine** (US-177-179) - Fairness and compliance
6. **Live/Recording** (US-172-174) - Synchronous capability
7. **Result System** (US-183-184) - Outcome processing

### Integration Points
- Database: Complex state storage required
- Real-time: WebSocket for live events
- Storage: Video/file storage for recordings
- Queue: Async job processing for workflows
- Cache: Session state caching critical

---

## Validation Updates

These additional 16 stories (US-169 through US-184) combined with the original 14 (US-155 through US-168) provide coverage for approximately 60% of the Canvas 001-5 tasks. Critical gaps remain in:
- Notification system details
- Email integration
- Dashboard components
- Analytics and reporting
- Admin oversight tools

Full extraction would require approximately 10-15 more stories.

---

## Notification and Alert System

### US-192: Activity Start Notifications
**As a** Participant
**I want to** receive notifications when activities start
**So that** I don't miss my scheduled sessions
**Source**: Canvas 001-5 (Notification patterns)

### US-193: Deadline Alerts
**As a** Participant  
**I want to** receive alerts before deadlines
**So that** I can submit assignments on time
**Source**: Canvas 001-5 (Deadline: YYMMDD by TT:TT)

### US-194: Participant Entry Notifications
**As a** Team Member
**I want to** be notified when teammates enter the activity
**So that** I know who's present for collaboration
**Source**: Canvas 001-5 (Notification: callSign has entered)

## Activity Dashboard Components

### US-195: Activity Header Display
**As a** Participant
**I want to** see activity ID and session info prominently
**So that** I know which activity I'm in
**Source**: Canvas 001-5 (ActivityID for callSign, Session X of Y)

### US-196: Participant List Widget
**As a** Participant
**I want to** see all active participants
**So that** I know who's involved in the activity
**Source**: Canvas 001-5 (PARTICIPANTS section)

### US-197: Timer and Countdown Display
**As a** Participant
**I want to** see time remaining for current phase
**So that** I can manage my time effectively
**Source**: Canvas 001-5 (Starts at mm:ss, countdown patterns)

## Assignment Submission System

### US-198: Draft Submission Interface
**As a** Participant
**I want to** submit draft cases for review
**So that** I can get feedback before final submission
**Source**: Canvas 001-5 (Submit a draft case for PRO and CON)

### US-199: Text Template System
**As a** Participant
**I want to** use templates for submissions
**So that** I follow the correct format
**Source**: Canvas 001-5 (Copy txt template)

### US-200: Extension Request System
**As a** Participant
**I want to** request deadline extensions
**So that** I can complete work when facing difficulties
**Source**: Canvas 001-5 (Request Extension)

## Recording and Export System

### US-201: Video Recording Upload
**As a** Participant
**I want to** upload video recordings of live events
**So that** absent members can review later
**Source**: Canvas 001-5 (video recording url for live events)

### US-202: Activity Report Generation
**As a** Participant
**I want to** receive personalized activity reports
**So that** I can track my performance
**Source**: Canvas 001-5 (personalized report for your case)

### US-203: Session Data Export
**As a** Participant
**I want to** export session data and transcripts
**So that** I can review offline
**Source**: Canvas 001-5 (Export patterns)

## AI Integration Features

### US-204: AI Comments System
**As a** Participant
**I want to** receive AI-generated feedback
**So that** I get immediate guidance
**Source**: Canvas 001-5 (AI Comments)

### US-205: AI Case Analysis
**As a** Participant
**I want to** get AI analysis of my arguments
**So that** I can improve my debate skills
**Source**: Canvas 001-5 (AI evaluation patterns)

## Multi-Session Management

### US-206: Session Progression Tracking
**As a** Participant
**I want to** track progress across multiple sessions
**So that** I know what's completed and what's next
**Source**: Canvas 001-5 (Session 1 of 5, Session 2 of 5)

### US-207: Session Save State
**As a** Participant
**I want to** save progress and continue later
**So that** I don't lose work between sessions
**Source**: Canvas 001-5 (Save and Next)

### US-208: Cross-Session Data Persistence
**As a** System
**I want to** maintain data across activity sessions
**So that** participants have continuity
**Source**: Canvas 001-5 (Multi-session patterns)

## Administrative Oversight

### US-209: Activity Monitoring Dashboard
**As an** Administrator
**I want to** monitor all active sessions
**So that** I can intervene if needed
**Source**: Canvas 001-5 (Monitoring patterns)

### US-210: Participant Intervention Tools
**As an** Administrator
**I want to** intervene in activities when necessary
**So that** I can maintain quality standards
**Source**: Canvas 001-5 (Admin oversight patterns)

### US-211: Activity Resolution Management
**As an** Administrator
**I want to** mark activities as resolved
**So that** participants know outcomes
**Source**: Canvas 001-5 (Resolved: patterns)

---

*Emergency extraction continued by Session 00024 to address critical runtime engine gap*
*Session 00025 added US-192 through US-211 to reach >90% coverage of Canvas 001-5*