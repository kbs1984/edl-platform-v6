---
created: '2025-08-23'
domain: requirements
priority: P0
purpose: Document p0 acceptance tests - core foundation
session: legacy
status: current
title: P0 Acceptance Tests - Core Foundation
topics:
- auth
- database
- testing
- requirements
type: specification
based_on:
- reality/snapshot-legacy.md
modified: '2025-08-27'
---

# P0 Acceptance Tests - Core Foundation

**Session**: 00018  
**Purpose**: Define acceptance tests for critical P0 user stories  
**Coverage**: 20 essential user stories with detailed test procedures

---

## Authentication Tests

### AT-001: Player Registration Flow
**User Story**: US-001 - Player Registration  
**Test Type**: Manual (initially) / Automated (future)  
**Priority**: Critical

**Preconditions:**
- Test email account available
- Database in clean state
- Email service operational

**Test Steps:**
1. Navigate to registration page
2. Verify all required fields are present
3. Enter invalid email format (test@)
4. Verify real-time validation error appears
5. Enter valid email (test@example.com)
6. Enter weak password (123)
7. Verify password strength indicator shows "weak"
8. Enter strong password (Test123!@#)
9. Verify password strength shows "strong"
10. Submit registration form
11. Check for success message
12. Verify confirmation email received within 30 seconds
13. Check database for new user record
14. Verify password is hashed, not plain text

**Expected Results:**
- Form validates in real-time
- Invalid inputs show clear error messages
- Success message displayed after submission
- Confirmation email delivered promptly
- User record created with hashed password
- User redirected to email verification notice

**Automation Notes:**
- Steps 1-11: Selenium/Playwright
- Step 12: Email API verification
- Steps 13-14: Database assertion

---

### AT-002: Player Login Journey
**User Story**: US-002 - Player Login  
**Test Type**: Manual / Automated  
**Priority**: Critical

**Preconditions:**
- Verified user account exists
- User logged out

**Test Steps:**
1. Navigate to login page
2. Enter invalid email
3. Enter any password
4. Submit form
5. Verify generic error message (not "email not found")
6. Enter valid email
7. Enter wrong password
8. Submit form
9. Verify same generic error message
10. Repeat wrong password 5 times
11. Verify account locked message
12. Wait 15 minutes or use unlock mechanism
13. Enter correct credentials
14. Check "Remember me" checkbox
15. Submit form
16. Verify redirect to dashboard
17. Check session cookie expiry (30 days)
18. Verify refresh token issued

**Expected Results:**
- Failed logins show generic errors (security)
- Account locks after 5 attempts
- Successful login redirects appropriately
- Remember me extends session
- Session tokens properly configured

**Automation Notes:**
- All steps automatable
- Use time manipulation for lockout testing

---

### AT-003: Profile Creation Workflow
**User Story**: US-003 - Player Profile Creation  
**Test Type**: Manual / Automated  
**Priority**: Critical

**Preconditions:**
- User registered and verified
- No profile exists yet

**Test Steps:**
1. Complete email verification
2. Verify automatic redirect to profile creation
3. Enter existing call_sign (test real-time check)
4. Verify "taken" message appears
5. Enter invalid call_sign (e.g., "a", "!@#")
6. Verify validation message
7. Enter valid unique call_sign
8. Select grade level from dropdown
9. Verify only grades 4-12 available
10. Upload invalid file type (.exe)
11. Verify file type error
12. Upload oversized image (>5MB)
13. Verify size error
14. Upload valid image (JPG, <5MB)
15. Verify image preview displays
16. Submit profile form
17. Verify success message
18. Check profile URL uses call_sign
19. Navigate to team page
20. Verify profile visible to team members

**Expected Results:**
- Real-time validation for call_sign
- File upload restrictions enforced
- Profile created successfully
- Profile immediately accessible

**Automation Notes:**
- File upload testing requires special handling
- Real-time validation needs wait conditions

---

## Team Management Tests

### AT-004: Team Creation Process
**User Story**: US-004 - Team Creation  
**Test Type**: Manual / Automated  
**Priority**: High

**Preconditions:**
- User has completed profile
- User has no teams or < 3 teams

**Test Steps:**
1. Navigate to teams section
2. Click "Create Team" button
3. Enter existing team name
4. Verify uniqueness error
5. Enter valid unique team name
6. Select genre from dropdown
7. Enter team description (test character limit)
8. Upload team logo (optional)
9. Submit team creation form
10. Verify success message
11. Check user is TeamFounder role
12. Verify team appears in directory
13. Search for team in directory
14. Verify team found and status shows "Mates wanted"
15. Check team creation count incremented
16. Attempt to create 4th team
17. Verify limit error message

**Expected Results:**
- Team name uniqueness enforced
- Creator becomes founder automatically
- Team immediately visible in directory
- Team creation limit enforced

**Automation Notes:**
- Directory visibility needs polling
- Test data cleanup important

---

### AT-005: Team Join Request Flow
**User Story**: US-005 - Team Joining  
**Test Type**: Manual / Automated  
**Priority**: High

**Preconditions:**
- Team exists with founder
- Test player not in team

**Test Steps:**
1. As Player: Search for team
2. View team details
3. Click "Request to Join"
4. Enter optional message
5. Submit join request
6. Verify pending status shown
7. As Founder: Check notifications
8. Verify join request notification
9. View player profile from request
10. Click "Accept" 
11. Verify member added to roster
12. As Player: Check notifications
13. Verify acceptance notification
14. Navigate to team page
15. Verify access to team resources
16. Check member count updated

**Expected Results:**
- Request creates proper notifications
- Founder can view requester details
- Acceptance updates all relevant data
- New member has immediate access

**Automation Notes:**
- Requires multi-user simulation
- Notification timing needs consideration

---

### AT-006: Logout Security Test
**User Story**: US-006 - Logout  
**Test Type**: Manual / Automated  
**Priority**: High

**Preconditions:**
- User logged in with active session

**Test Steps:**
1. Navigate to secure page (dashboard)
2. Copy current URL
3. Click logout button
4. Verify redirect to login page
5. Check browser storage (localStorage, sessionStorage)
6. Verify auth tokens removed
7. Paste copied URL and navigate
8. Verify redirect to login (not dashboard)
9. Click browser back button
10. Verify cannot access dashboard
11. Check network requests
12. Verify no auth headers sent
13. On another device (if logged in)
14. Verify option to logout all devices
15. Execute logout all
16. Verify all sessions terminated

**Expected Results:**
- Session properly terminated
- No cached credentials remain
- Cannot access protected content
- Multi-device logout functional

**Automation Notes:**
- Browser storage checks need special permissions
- Multi-device testing needs infrastructure

---

## Dashboard Tests

### AT-007: Dashboard Loading Performance
**User Story**: US-030 - Player Dashboard Home  
**Test Type**: Automated  
**Priority**: Critical

**Preconditions:**
- User logged in
- Standard test data loaded

**Test Steps:**
1. Record timestamp before navigation
2. Navigate to dashboard
3. Measure time to first meaningful paint
4. Verify < 2 seconds
5. Check all widgets present
6. Measure time for all widgets loaded
7. Verify < 3 seconds total
8. Check responsive breakpoints:
   - Desktop (1920x1080)
   - Tablet (768x1024)
   - Mobile (375x667)
9. Verify layout adjusts properly
10. Test widget interactions
11. Verify quick actions respond < 1 second
12. Check accessibility:
    - Tab navigation works
    - Screen reader landmarks
    - Contrast ratios pass

**Expected Results:**
- Performance within thresholds
- Responsive on all devices
- Accessible interface

**Automation Notes:**
- Use Lighthouse for performance metrics
- Axe for accessibility testing

---

### AT-008: Real-time Notifications
**User Story**: US-035 - Notification Center  
**Test Type**: Manual / Automated  
**Priority**: High

**Preconditions:**
- Two test users configured
- WebSocket connection available

**Test Steps:**
1. User A: Open dashboard
2. User B: Send message to User A
3. User A: Verify notification appears < 2 seconds
4. Check notification badge updates
5. Click notification
6. Verify navigation to relevant content
7. Mark as read
8. Verify badge count decreases
9. Access notification preferences
10. Disable email notifications
11. User B: Send another message
12. Verify in-app notification still works
13. Verify no email sent
14. Test notification grouping:
    - Generate 5 similar notifications
    - Verify they group together
15. Test clear all function
16. Verify all notifications marked read

**Expected Results:**
- Real-time delivery working
- Preferences respected
- Grouping functional
- Batch operations work

**Automation Notes:**
- WebSocket testing needs special setup
- Email verification through API

---

## Activity Tests

### AT-009: Activity Registration Payment
**User Story**: US-055 - Activity Payment Processing  
**Test Type**: Manual / Automated  
**Priority**: Critical

**Preconditions:**
- Activity with emCoin cost exists
- Player has sufficient balance

**Test Steps:**
1. Navigate to activity listing
2. Select activity with cost (50 emCoins)
3. Verify cost displayed clearly
4. Check current balance shown
5. Click "Register"
6. Verify payment confirmation dialog
7. Confirm payment
8. Check balance updated immediately
9. Verify transaction in history
10. Check registration confirmed
11. Test insufficient funds:
    - Select activity costing more than balance
    - Attempt registration
    - Verify error message
    - Verify no transaction occurred
12. Test refund flow:
    - Register for activity
    - Have supervisor deny registration
    - Verify refund processed
    - Check balance restored

**Expected Results:**
- Payment flow clear and secure
- Balance updates immediately
- Insufficient funds handled gracefully
- Refunds processed automatically

**Automation Notes:**
- Balance manipulation for test scenarios
- Transaction verification important

---

### AT-010: Multi-Session Activity Progress
**User Story**: US-056 - Activity Session Tracking  
**Test Type**: Manual / Automated  
**Priority**: Medium

**Preconditions:**
- Multi-session activity (5 sessions)
- Player registered for activity

**Test Steps:**
1. Navigate to activity page
2. Verify "Session 1 of 5" displayed
3. Complete session 1 requirements
4. Mark session 1 complete
5. Verify progress updates to "Session 2 of 5"
6. Check progress bar shows 20%
7. Navigate away and return
8. Verify progress persisted
9. Complete sessions 2-4
10. Verify each updates correctly
11. On session 5, verify "Final Session" indicator
12. Complete final session
13. Verify activity marked complete
14. Check completion certificate available
15. Verify appears in activity history

**Expected Results:**
- Progress tracked accurately
- State persists across sessions
- Completion properly recorded

**Automation Notes:**
- Session completion may need mocking
- Progress calculation verification

---

## Badge Tests

### AT-011: Badge Progress Tracking
**User Story**: US-074 - Badge Requirement Tracking  
**Test Type**: Manual / Automated  
**Priority**: Medium

**Preconditions:**
- Badge with multiple requirements exists
- Player has partial progress

**Test Steps:**
1. Navigate to badges page
2. Select in-progress badge
3. Verify requirements checklist shown
4. Check completed items marked
5. Verify progress percentage accurate
6. Complete one requirement
7. Return to badge page
8. Verify progress updated
9. Check estimated time to complete
10. Verify next action suggested
11. Complete final requirement
12. Verify badge auto-awarded
13. Check notification received
14. Verify badge in collection
15. Check certificate downloadable

**Expected Results:**
- Progress tracked in real-time
- Auto-award on completion
- Proper notifications sent

**Automation Notes:**
- Requirement completion simulation needed
- Progress calculation testing

---

## Team Communication Tests

### AT-012: Team Message Delivery
**User Story**: US-024 - Team Communication Hub  
**Test Type**: Manual / Automated  
**Priority**: High

**Preconditions:**
- Team with multiple members
- Communication hub enabled

**Test Steps:**
1. Member A: Navigate to team hub
2. Type message
3. Attach file (< 25MB)
4. Send message
5. Verify delivery in < 1 second
6. Member B: Verify message received
7. Check file downloadable
8. Send reply with @mention Member A
9. Member A: Verify notification
10. Test message editing:
    - Edit sent message
    - Verify "edited" indicator
    - Check edit history available
11. Test message deletion:
    - Delete message
    - Verify audit trail entry
    - Check message marked deleted
12. Test search:
    - Search for keyword
    - Verify results accurate
    - Check search highlights

**Expected Results:**
- Real-time message delivery
- File sharing functional
- @mentions trigger notifications
- Audit trail maintained

**Automation Notes:**
- Multi-user coordination required
- File upload testing needed

---

## Security Tests

### AT-013: Role-Based Access Control
**User Story**: US-013 - Role-Based Access  
**Test Type**: Manual / Automated  
**Priority**: Critical

**Preconditions:**
- Users with different roles exist

**Test Steps:**
1. As Player: Try accessing supervisor tools
2. Verify access denied
3. Navigate to allowed sections
4. Verify full access
5. As Supervisor: Access activity creation
6. Verify access granted
7. Try accessing admin panel
8. Verify access denied
9. As Enabler: Access evaluation tools
10. Verify access granted
11. Try creating activities
12. Verify access denied
13. Test role transition:
    - Request role change
    - Admin approves change
    - Verify permissions updated immediately
14. Check audit log for all attempts

**Expected Results:**
- Permissions enforced correctly
- Unauthorized access blocked
- Role changes immediate
- All attempts logged

**Automation Notes:**
- Multiple user sessions needed
- Permission matrix validation

---

## Integration Tests

### AT-014: SSO Authentication Flow
**User Story**: US-014 - Single Sign-On  
**Test Type**: Manual / Automated  
**Priority**: High

**Preconditions:**
- SSO providers configured
- Test accounts available

**Test Steps:**
1. Click "Sign in with Google"
2. Verify redirect to Google OAuth
3. Enter Google credentials
4. Approve permissions
5. Verify redirect back to platform
6. Check profile pre-filled with Google data
7. Complete profile creation
8. Logout
9. Sign in with Google again
10. Verify direct login (no profile creation)
11. Test account linking:
    - Login with email/password
    - Link Google account
    - Logout
    - Login with Google
    - Verify same account accessed
12. Test disconnect:
    - Disconnect Google
    - Verify can still login with password

**Expected Results:**
- SSO flow smooth
- Account linking works
- Disconnect doesn't lock out user

**Automation Notes:**
- OAuth flow testing complex
- May need mock providers

---

## Mobile Tests

### AT-015: Mobile App Offline Mode
**User Story**: US-047 - Mobile App Features  
**Test Type**: Manual  
**Priority**: Medium

**Preconditions:**
- Mobile app installed
- User logged in
- Some data cached

**Test Steps:**
1. Use app online normally
2. View dashboard, activities, badges
3. Enable airplane mode
4. Verify offline indicator shown
5. Navigate to dashboard
6. Verify cached data displays
7. Try to send message
8. Verify queued for sending
9. Make profile edit
10. Verify saved locally
11. Re-enable network
12. Verify sync indicator appears
13. Check message sent
14. Verify profile edit synced
15. Check no data lost

**Expected Results:**
- Offline mode functional
- Data queued for sync
- Sync completes without loss

**Automation Notes:**
- Mobile testing framework needed
- Network simulation required

---

## Accessibility Tests

### AT-016: Screen Reader Navigation
**User Story**: US-048 - Accessibility Features  
**Test Type**: Manual  
**Priority**: High

**Preconditions:**
- Screen reader software available
- Test user trained in screen reader

**Test Steps:**
1. Enable screen reader
2. Navigate to login page
3. Verify form fields announced
4. Tab through interface
5. Verify logical tab order
6. Submit form with keyboard
7. Navigate dashboard
8. Verify landmarks present
9. Check headings hierarchical
10. Test interactive elements:
    - Buttons announce purpose
    - Links describe destination
    - Images have alt text
11. Test dynamic content:
    - Notifications announced
    - Updates communicated
12. Verify skip links work
13. Test color blind mode
14. Verify information not just color

**Expected Results:**
- Full keyboard navigation
- Screen reader compatible
- WCAG 2.1 AA compliant

**Automation Notes:**
- Automated accessibility testing partial
- Manual testing essential

---

## Performance Tests

### AT-017: Load Testing
**User Story**: Platform Scalability  
**Test Type**: Automated  
**Priority**: Critical

**Preconditions:**
- Performance testing environment
- Test data generators ready

**Test Steps:**
1. Simulate 100 concurrent users
2. Measure response times
3. Verify all < 3 seconds
4. Increase to 1,000 users
5. Check response times
6. Monitor server resources
7. Increase to 10,000 users
8. Verify system stable
9. Check for errors
10. Test specific operations:
    - 1,000 simultaneous logins
    - 500 simultaneous registrations
    - 2,000 dashboard loads
11. Monitor database performance
12. Check cache hit rates
13. Verify CDN functioning
14. Test failover scenarios

**Expected Results:**
- Handles 10,000 concurrent users
- Response times acceptable
- No critical failures
- Graceful degradation if needed

**Automation Notes:**
- JMeter or K6 for load testing
- Monitoring infrastructure needed

---

## Data Tests

### AT-018: Data Export Compliance
**User Story**: US-015 - Account Security Settings  
**Test Type**: Manual / Automated  
**Priority**: Medium

**Preconditions:**
- User with substantial data
- Export feature enabled

**Test Steps:**
1. Navigate to privacy settings
2. Request data export
3. Verify confirmation email sent
4. Click confirmation link
5. Verify export processing starts
6. Wait for completion (or check status)
7. Download export file
8. Verify file format (JSON/CSV)
9. Check data completeness:
    - Profile information
    - Activity history
    - Messages
    - Team memberships
    - Badges earned
10. Verify no sensitive data exposed
11. Check other users' data not included
12. Test import to another account
13. Verify data restored correctly

**Expected Results:**
- Export includes all user data
- Format is portable
- Privacy maintained
- Import functional

**Automation Notes:**
- Data validation complex
- May need sampling approach

---

## Recovery Tests

### AT-019: Password Reset Flow
**User Story**: US-011 - Forgot Password  
**Test Type**: Manual / Automated  
**Priority**: High

**Preconditions:**
- User account exists
- Email service operational

**Test Steps:**
1. Click "Forgot Password"
2. Enter email address
3. Submit request
4. Verify email sent < 30 seconds
5. Check email content correct
6. Click reset link
7. Verify link works
8. Enter new password
9. Verify strength requirements enforced
10. Submit new password
11. Try using reset link again
12. Verify link expired (single use)
13. Login with new password
14. Verify successful
15. Check password history:
    - Try setting to recent password
    - Verify rejected

**Expected Results:**
- Reset email prompt
- Link single-use
- Password history enforced
- Can login with new password

**Automation Notes:**
- Email verification needed
- Link expiration testing

---

## End-to-End Tests

### AT-020: Complete User Journey
**User Story**: Multiple - Full User Flow  
**Test Type**: Manual / Automated  
**Priority**: Critical

**Preconditions:**
- Clean test environment
- All services operational

**Test Steps:**
1. Register new account
2. Verify email
3. Create profile
4. Create team
5. Invite other players
6. Register for activity
7. Pay with emCoins
8. Complete activity
9. Earn badge
10. Receive evaluation
11. View dashboard stats
12. Send team message
13. Update profile
14. Check notifications
15. Logout

**Expected Results:**
- Complete flow works seamlessly
- No blocking errors
- Data consistency maintained
- User experience smooth

**Automation Notes:**
- Full E2E suite critical
- Covers integration points

---

## Test Execution Summary

### Coverage Achieved
- **Authentication**: 3 tests (AT-001 to AT-003)
- **Team Management**: 3 tests (AT-004 to AT-006)
- **Dashboard**: 2 tests (AT-007 to AT-008)
- **Activities**: 2 tests (AT-009 to AT-010)
- **Badges**: 1 test (AT-011)
- **Communication**: 1 test (AT-012)
- **Security**: 1 test (AT-013)
- **Integration**: 1 test (AT-014)
- **Mobile**: 1 test (AT-015)
- **Accessibility**: 1 test (AT-016)
- **Performance**: 1 test (AT-017)
- **Data**: 1 test (AT-018)
- **Recovery**: 1 test (AT-019)
- **E2E**: 1 test (AT-020)

**Total Tests**: 20 comprehensive acceptance tests

### Automation Priority
1. **Critical** (Automate First): AT-001, AT-002, AT-007, AT-013, AT-017, AT-020
2. **High** (Automate Second): AT-004, AT-005, AT-006, AT-008, AT-009, AT-012, AT-014, AT-019
3. **Medium** (Automate Later): AT-003, AT-010, AT-011, AT-015, AT-016, AT-018

---

**Document Status**: Complete
**Next Steps**: Document technical constraints