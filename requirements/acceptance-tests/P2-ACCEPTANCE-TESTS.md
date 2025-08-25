---
created: '2025-08-23'
domain: requirements
priority: P2
purpose: Document p2 acceptance tests - enhancement features
session: legacy
status: current
title: P2 Acceptance Tests - Enhancement Features
topics:
- testing
- requirements
type: specification
---

# P2 Acceptance Tests - Enhancement Features

**Session**: 00019  
**Purpose**: Define acceptance tests for critical P2 user stories  
**Coverage**: 15 comprehensive tests for enhancement features

---

## Communication & Messaging Tests

### AT-021: Direct Messaging Flow
**User Story**: US-104 - Send Direct Message  
**Test Type**: Manual / Automated  
**Priority**: High

**Preconditions:**
- Two test user accounts created
- Both users logged in different sessions
- Users have established profiles

**Test Steps:**
1. Navigate to messages section as User A
2. Click "New Message" button
3. Start typing recipient name (User B)
4. Verify type-ahead shows matches after 2 characters
5. Select User B from dropdown
6. Enter message text (test boundaries: 1, 499, 500, 501 chars)
7. Verify character counter updates in real-time
8. Attempt to send 501 character message
9. Verify error message about limit
10. Reduce to 500 characters
11. Click Send
12. Verify "Sent" status appears
13. Switch to User B session
14. Verify notification appears within 2 seconds
15. Open message
16. Verify "Read" status updates for User A
17. As Supervisor, view linked player's messages
18. Verify audit log entry created

**Expected Results:**
- Type-ahead responsive and accurate
- Character limit enforced at 500
- Real-time status updates work
- Supervisor access logged
- Messages encrypted in database

**Automation Notes:**
- Use Selenium for UI interactions
- WebSocket monitoring for real-time updates
- Database verification for encryption

---

### AT-022: Team Invitation Workflow
**User Story**: US-107, US-109 - Team Invitations  
**Test Type**: Manual / Automated  
**Priority**: High

**Preconditions:**
- Two teams created with founders
- Activity available for collaboration
- Both team founders logged in

**Test Steps:**
1. As Team A founder, navigate to Team Invitations
2. Click "Create Invitation"
3. Search and select Team B
4. Select activity type from dropdown
5. Add first proposed date/time
6. Add second proposed date/time (required minimum)
7. Enter custom message (test template variables)
8. Save as draft
9. Verify draft auto-saves every 30 seconds
10. Preview invitation
11. Send invitation
12. Verify confirmation modal appears
13. Confirm send
14. Note invitation ID generated
15. Switch to Team B founder session
16. Verify notification received within 1 minute
17. Open invitation
18. Review proposed dates
19. Select preferred date option
20. Add response message
21. Accept invitation
22. Verify Team A receives acceptance notification
23. Check invitation status updated to "Accepted"

**Expected Results:**
- Draft saves automatically
- Minimum 2 date options enforced
- Notifications delivered promptly
- Status updates immediately
- Both teams can track invitation

---

### AT-023: Notification Center Management
**User Story**: US-113, US-114 - Notifications  
**Test Type**: Manual / Automated  
**Priority**: Medium

**Preconditions:**
- User with multiple notification types
- Some read, some unread
- Notification preferences configured

**Test Steps:**
1. Navigate to Notification Center
2. Verify unread count badge shows correct number
3. Verify categories visible (message, invitation, activity, system)
4. Filter by "Messages" category
5. Verify only message notifications shown
6. Click "Mark All Read"
7. Verify all notifications in view marked read
8. Verify badge count updates
9. Navigate to Preferences
10. Toggle off "Email notifications" for messages
11. Send test message to user
12. Verify in-app notification appears
13. Verify no email sent (check logs)
14. Set quiet hours (current time + 5 minutes)
15. Wait for quiet period
16. Send another test message
17. Verify no immediate notification
18. After quiet hours end, verify notification appears

**Expected Results:**
- Filtering works correctly
- Bulk operations complete quickly
- Preferences immediately applied
- Quiet hours respected

---

## Resource Management Tests

### AT-024: Resource Upload and Access
**User Story**: US-123, US-120 - Resource Management  
**Test Type**: Manual / Automated  
**Priority**: High

**Preconditions:**
- Supervisor account with upload permissions
- PDF and video files ready for upload
- Player account for access testing

**Test Steps:**
1. As Supervisor, navigate to Resource Upload
2. Click "Upload Resource"
3. Select PDF file (test: 10MB file)
4. Enter title (required field)
5. Leave description empty
6. Attempt to submit
7. Verify validation error for description
8. Enter description
9. Set genre and difficulty level
10. Add 3 tags
11. Set access level to "Grade 6+"
12. Click Upload
13. Verify progress bar updates
14. Verify preview generates after upload
15. Submit for publishing
16. As Player (Grade 5), search for resource
17. Verify resource not visible (access restricted)
18. As Player (Grade 7), search for resource
19. Find and click resource
20. Verify details page loads
21. Click Download
22. Verify download starts immediately
23. Check viewing progress tracked

**Expected Results:**
- Required fields validated
- Upload progress accurate
- Access restrictions enforced
- Downloads work immediately
- Progress tracking functional

---

### AT-025: Support Ticket Lifecycle
**User Story**: US-129, US-130 - Support System  
**Test Type**: Manual / Automated  
**Priority**: Medium

**Preconditions:**
- User account with issue to report
- Support agent account available

**Test Steps:**
1. Click "Help" or "Support" button
2. Select "Submit Ticket"
3. Choose category "Technical Issue"
4. Set priority "High"
5. Enter description (minimum 50 characters)
6. Attach screenshot (5MB file)
7. Submit ticket
8. Verify ticket number displayed (format: YYYY-MM-DDDD)
9. Check email for confirmation (within 1 minute)
10. Navigate to "My Tickets"
11. Verify ticket appears with "Open" status
12. As support agent, access ticket queue
13. Verify high priority ticket at top
14. Open ticket
15. Add response
16. Change status to "In Progress"
17. As user, verify notification received
18. View agent response
19. Add additional information
20. As agent, resolve ticket
21. As user, provide satisfaction rating
22. Attempt to reopen ticket
23. Verify reopen successful

**Expected Results:**
- Ticket number generated correctly
- Email confirmation sent
- Priority affects queue order
- Status updates reflected immediately
- Reopen available for 30 days

---

## emCoin Transaction Tests

### AT-026: emCoin Activity Payment Flow
**User Story**: US-142, US-139 - Activity Payments  
**Test Type**: Manual / Automated  
**Priority**: Critical

**Preconditions:**
- Player with 100 emCoin balance
- Activity costing 50 emCoins available
- Activity costing 150 emCoins available

**Test Steps:**
1. View current balance (100 emCoins)
2. Navigate to Activities
3. Find activity costing 50 emCoins
4. Verify cost displayed clearly
5. Click Register
6. Verify payment confirmation shows amount
7. Confirm payment
8. Verify success message
9. Check balance updated to 50 emCoins
10. Verify transaction in history
11. Find activity costing 150 emCoins
12. Attempt to register
13. Verify "Insufficient Balance" message
14. Verify suggests ways to earn coins
15. Complete the 50-coin activity
16. Verify reward credited (e.g., 25 coins)
17. Check balance now 75 coins
18. Verify transaction shows earned amount

**Expected Results:**
- Balance validates before payment
- Clear messaging for insufficient funds
- Transactions recorded immediately
- Earnings credited after completion

---

### AT-027: Team emCoin Pool Management
**User Story**: US-144 - Team Contribution Pool  
**Test Type**: Manual / Automated  
**Priority**: Medium

**Preconditions:**
- Team with 3 members including founder
- Each member has emCoins
- Team activity requiring payment

**Test Steps:**
1. As team member, view team wallet (0 coins)
2. Click "Contribute to Team"
3. Enter amount (25 coins)
4. Confirm contribution
5. Verify personal balance reduced
6. Verify team wallet shows 25 coins
7. As another member, contribute 30 coins
8. Verify team wallet now 55 coins
9. View contribution history
10. Verify both contributions listed with timestamps
11. As non-founder, attempt withdrawal
12. Verify "Founder approval required" message
13. As founder, register team for activity (50 coins)
14. Use team wallet for payment
15. Verify payment successful
16. Check team wallet reduced to 5 coins
17. Verify usage log shows activity payment
18. All members verify transaction visible

**Expected Results:**
- Contributions tracked per member
- Only founder can approve usage
- All members see transactions
- History maintained 90 days

---

### AT-028: Daily Login Streak Rewards
**User Story**: US-140 - Daily Login Rewards  
**Test Type**: Manual / Automated  
**Priority**: Low

**Preconditions:**
- User account with login history
- Current streak: 5 days
- Known timezone setting

**Test Steps:**
1. Login on day 6
2. Verify streak counter shows "6 days"
3. Verify bonus credited within 10 seconds
4. Check amount increases from day 5
5. Navigate to calendar view
6. Verify last 6 days marked
7. Logout
8. Wait until after midnight (user timezone)
9. Login on day 7
10. Verify streak continues (7 days)
11. Skip day 8 completely
12. Login on day 9
13. Verify streak reset to 1
14. Check calendar shows gap
15. Use streak recovery option
16. Verify streak restored to 8
17. Verify recovery not available again this month

**Expected Results:**
- Streak counts consecutive days
- Timezone handling correct
- Reset after missed day
- Recovery works once per month
- Calendar accurately reflects history

---

### AT-029: Supervisor emCoin Purchase
**User Story**: US-147, US-148 - Supervisor Purchases  
**Test Type**: Manual / Automated  
**Priority**: High

**Preconditions:**
- Supervisor with 3 linked players
- Valid payment method configured
- Test payment processor in sandbox mode

**Test Steps:**
1. As Supervisor, navigate to "Buy emCoins"
2. View current conversion rate ($1 = 100 emCoins)
3. Select amount ($10 = 1000 emCoins)
4. Choose distribution: "Equal to all linked players"
5. Verify shows 333 coins per player (3 players)
6. Proceed to payment
7. Enter test credit card
8. Complete purchase
9. Verify receipt generated with tax info
10. Check each linked player received 333 coins
11. View distribution confirmation
12. Navigate to spending monitor
13. See all linked player balances
14. Set spending limit for Player 1 (50 coins/week)
15. As Player 1, attempt to spend 60 coins
16. Verify transaction blocked
17. Verify Supervisor receives approval request
18. As Supervisor, approve transaction
19. Verify Player 1 can complete purchase

**Expected Results:**
- Payment processes securely
- Distribution accurate to players
- Receipts include tax information
- Spending limits enforced
- Approval workflow functions

---

## Integration Tests

### AT-030: Cross-Feature Message Safety
**User Story**: US-116, US-117 - Message Safety  
**Test Type**: Manual / Automated  
**Priority**: Critical

**Preconditions:**
- Keyword filter configured with test words
- Supervisor linked to test player
- Moderation queue accessible

**Test Steps:**
1. As Player A, send message with filtered keyword
2. Verify message flagged immediately
3. Check message quarantined (not delivered)
4. Verify Supervisor notified within 1 minute
5. As Supervisor, view flagged message
6. Review context
7. Approve message as false positive
8. Verify message delivered to recipient
9. As Player B, send genuinely inappropriate message
10. Verify high-severity flag triggered
11. Check immediate supervisor alert
12. As Supervisor, confirm violation
13. Verify message permanently blocked
14. Check reporter identity protected in logs
15. Export communication history
16. Verify PDF includes flagged messages
17. Verify export logged in audit trail

**Expected Results:**
- Filtering catches configured keywords
- Supervisors notified appropriately
- False positives can be overridden
- Audit trail complete
- Exports include all relevant data

---

### AT-031: Resource to Activity Integration
**User Story**: Multiple - Resource/Activity Integration  
**Test Type**: End-to-End / Manual  
**Priority**: Medium

**Preconditions:**
- Activity created requiring specific resources
- Resources uploaded and tagged
- Player registered for activity

**Test Steps:**
1. As Supervisor, create activity
2. Link 3 required resources
3. Set prerequisite viewing of resources
4. As Player, register for activity
5. Verify registration shows "Prerequisites pending"
6. Navigate to required resources
7. View first resource completely
8. Verify progress tracked (1 of 3)
9. View remaining resources
10. Return to activity
11. Verify prerequisites now complete
12. Verify registration status active
13. Complete activity
14. Verify recommended resources shown
15. Check resources tagged with activity

**Expected Results:**
- Prerequisites block registration
- Progress tracked accurately
- Recommendations relevant
- Integration seamless

---

### AT-032: Team Communication with Notifications
**User Story**: US-111, US-115 - Team Communications  
**Test Type**: Manual / Automated  
**Priority**: High

**Preconditions:**
- Team with 5 active members
- Team founder logged in
- Members have various notification settings

**Test Steps:**
1. As founder, create team announcement
2. Mark as "Urgent"
3. Enter message text
4. Schedule for 5 minutes future
5. Confirm broadcast
6. Wait for scheduled time
7. Verify all 5 members receive notification
8. Check push notifications sent for urgent
9. As member with email enabled, check email
10. As member with quiet hours, verify respected
11. Check delivery confirmation shows 5/5
12. As member, post reply to announcement
13. Verify thread created
14. Other members verify notification of reply
15. Pin important announcement
16. Verify pinned at top of board
17. Verify maximum 5 pins enforced

**Expected Results:**
- Scheduled broadcast accurate timing
- Urgent triggers push notifications
- Delivery tracking accurate
- Threading works correctly
- Pin limit enforced

---

### AT-033: Accessibility Compliance Test
**User Story**: US-134 - Accessibility Features  
**Test Type**: Manual with Tools  
**Priority**: High

**Preconditions:**
- Screen reader software installed
- Keyboard navigation enabled
- High contrast mode available

**Test Steps:**
1. Enable screen reader
2. Navigate to login using only keyboard
3. Verify all form fields announced
4. Login using keyboard only
5. Navigate to Resources
6. Find video resource
7. Verify closed captions available
8. Enable captions
9. Verify sync with audio
10. Find audio resource
11. Verify transcript link present
12. Open transcript
13. Switch to high contrast mode
14. Verify contrast ratio ≥4.5:1
15. Increase font size to 150%
16. Verify layout remains functional
17. Test tab order through page
18. Verify logical flow
19. Test skip navigation links
20. Run automated accessibility scan
21. Verify WCAG 2.1 AA compliance

**Expected Results:**
- Screen reader fully functional
- Keyboard navigation complete
- Captions/transcripts available
- Contrast ratios compliant
- Font sizing maintains usability
- No critical accessibility errors

---

### AT-034: Multi-language Content Access
**User Story**: US-135 - Multi-language Support  
**Test Type**: Manual / Automated  
**Priority**: Low

**Preconditions:**
- Platform supports English and Spanish
- Resources available in both languages
- User browser set to Spanish

**Test Steps:**
1. Access platform with Spanish browser
2. Verify auto-detects Spanish
3. Verify UI elements in Spanish
4. Navigate to Resources
5. Verify Spanish resources prioritized
6. Search in Spanish terms
7. Verify results relevant
8. Switch language to English manually
9. Verify switch completes in <2 seconds
10. Verify all UI elements update
11. Find resource only in English
12. Request Spanish translation
13. Verify request logged
14. As community translator, submit translation
15. Verify review queue updated
16. As moderator, review translation
17. Approve translation
18. Verify Spanish version now available

**Expected Results:**
- Auto-detection accurate
- UI fully translated
- Language switch fast
- Translation workflow functional
- Community contributions reviewed

---

### AT-035: End-to-End New User Journey
**User Story**: Multiple - Complete User Journey  
**Test Type**: End-to-End / Manual  
**Priority**: Critical

**Preconditions:**
- Clean test environment
- All P0, P1, P2 features available

**Test Steps:**
1. Register new player account
2. Verify email and create profile
3. Set grade level and interests
4. Join existing team via code
5. View team members and communication board
6. Register for first activity (free)
7. Access required resources
8. Complete activity
9. Earn first emCoins
10. Receive badge for completion
11. Use emCoins for premium resource
12. Send message to team member
13. Create support ticket for help
14. Receive daily login bonus
15. View personal dashboard analytics
16. Set notification preferences
17. Participate in team activity
18. Receive and provide peer feedback
19. Check progress toward next badge
20. Log out successfully

**Expected Results:**
- Complete journey without blockers
- All features accessible as designed
- Progressive disclosure works
- No confusing user experience
- Performance acceptable throughout

---

## Test Coverage Summary

**P2 Features Tested:**
- Communication & Messaging: 3 tests
- Resources & Support: 3 tests  
- emCoin Economy: 4 tests
- Integration & Cross-cutting: 5 tests

**Total P2 Acceptance Tests: 15**

**Automation Priority:**
1. Critical: Payment flows, Safety features
2. High: Core messaging, Resource access
3. Medium: Support tickets, Team features
4. Low: Streak rewards, Multi-language

---

*These 15 acceptance tests provide comprehensive coverage of P2 enhancement features*