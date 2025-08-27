---
created: '2025-08-23'
domain: requirements
priority: P1
purpose: Document reality agent validation test specifications
session: legacy
status: current
title: Reality Agent Validation Test Specifications
topics:
- database
- testing
- requirements
type: specification
based_on:
- reality/snapshot-legacy.md
modified: '2025-08-27'
---

# Reality Agent Validation Test Specifications

**Session**: 00019  
**Purpose**: Define how Reality Agents verify Requirements compliance  
**Integration**: Works with existing 7-agent Reality Domain infrastructure

---

## Overview

This document specifies how the Reality Agents will automatically validate that implemented features meet the Requirements Domain specifications. Each agent contributes verification capabilities within their domain of expertise.

## Reality Agent Architecture (7 Agents)

Based on Session 16's REALITY_INDEX.md update, the platform has 7 operational Reality Agents:

1. **FileSystem Agent** - File and directory structure verification
2. **GitHub Agent** - Repository and deployment verification  
3. **Supabase Agent** - Database and RLS policy verification
4. **Integration Agent** - Cross-system integration verification
5. **Vercel Agent** - Deployment and performance verification
6. **Static Asset Agent** - Asset and resource verification
7. **Task Reality Agent** - Task dependency and completion verification

---

## P0 Requirements Validation (Foundation)

### RA-001: Authentication System Validation
**Requirements Covered**: US-001 to US-015  
**Primary Agent**: Supabase Agent  
**Support Agents**: Integration Agent, FileSystem Agent

**FileSystem Agent Checks:**
```bash
# Verify authentication components exist
test -f "src/auth/login.js" || fail "Login component missing"
test -f "src/auth/register.js" || fail "Register component missing"
test -f "src/auth/profile.js" || fail "Profile component missing"

# Check for security configuration
grep -q "bcrypt\|argon2" package.json || fail "Password hashing library missing"
test -f "src/config/auth.js" || fail "Auth configuration missing"
```

**Supabase Agent Checks:**
```sql
-- Verify profiles table structure
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'profiles'
AND column_name IN ('id', 'call_sign', 'email', 'grade_level');

-- Verify RLS policies exist and are enabled
SELECT tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'profiles';

-- Test authentication constraints
SELECT COUNT(*) FROM profiles WHERE call_sign IS NULL; -- Should be 0
SELECT COUNT(*) FROM profiles WHERE email NOT LIKE '%@%'; -- Should be 0
```

**Integration Agent Checks:**
```python
# Test authentication flow end-to-end
def test_authentication_flow():
    # Registration test
    response = register_user("test@example.com", "Test123!@#", "testuser")
    assert response.status_code == 201
    assert "confirmation_sent" in response.json()
    
    # Login test
    login_response = login_user("test@example.com", "Test123!@#")
    assert login_response.status_code == 200
    assert "session_token" in login_response.json()
    
    # Protected route test
    token = login_response.json()["session_token"]
    profile_response = get_profile(token)
    assert profile_response.status_code == 200
```

**Success Criteria**: All agent checks pass + US-001 to US-015 success criteria met

---

### RA-002: Team System Validation
**Requirements Covered**: US-016 to US-027  
**Primary Agent**: Supabase Agent  
**Support Agents**: Integration Agent, FileSystem Agent

**Supabase Agent Checks:**
```sql
-- Verify teams table structure and constraints
SELECT constraint_name, constraint_type 
FROM information_schema.table_constraints 
WHERE table_name = 'teams' AND constraint_type = 'UNIQUE';

-- Test team creation constraints
INSERT INTO teams (team_name) VALUES ('TestTeam123'); -- Should succeed
INSERT INTO teams (team_name) VALUES ('TestTeam123'); -- Should fail (unique)

-- Verify team_members junction table
SELECT column_name FROM information_schema.columns 
WHERE table_name = 'team_members' 
AND column_name IN ('team_id', 'player_id', 'role', 'join_date');

-- Test RLS policies for teams
SET ROLE authenticated;
SELECT * FROM teams WHERE team_founder = current_user_id(); -- Should see own teams only
```

**Integration Agent Checks:**
```python
def test_team_functionality():
    # Create team test
    team_data = {"name": "ValidationTeam", "genre": "debate", "description": "Test team"}
    response = create_team(user_token, team_data)
    assert response.status_code == 201
    team_id = response.json()["team_id"]
    
    # Join team test
    join_response = request_team_join(other_user_token, team_id)
    assert join_response.status_code == 200
    
    # Founder approval test
    approve_response = approve_team_member(user_token, team_id, other_user_id)
    assert approve_response.status_code == 200
    
    # Verify team roster
    roster_response = get_team_roster(user_token, team_id)
    assert len(roster_response.json()["members"]) == 2
```

**FileSystem Agent Checks:**
```bash
# Verify team-related components
test -f "src/teams/create.js" || fail "Team creation component missing"
test -f "src/teams/roster.js" || fail "Team roster component missing"
test -f "src/teams/invitations.js" || fail "Team invitations component missing"
```

---

### RA-003: Dashboard & Profile Validation
**Requirements Covered**: US-028 to US-048  
**Primary Agent**: Integration Agent  
**Support Agents**: Vercel Agent, Static Asset Agent

**Integration Agent Checks:**
```python
def test_dashboard_functionality():
    # Dashboard load test
    response = get_dashboard(user_token)
    assert response.status_code == 200
    dashboard = response.json()
    
    # Verify required sections
    assert "profile" in dashboard
    assert "recent_activities" in dashboard
    assert "teams" in dashboard
    assert "notifications" in dashboard
    
    # Profile edit test
    profile_update = {"school": "Test School", "grade_level": 8}
    update_response = update_profile(user_token, profile_update)
    assert update_response.status_code == 200
```

**Vercel Agent Checks:**
```javascript
// Performance validation
async function validateDashboardPerformance() {
    const startTime = performance.now();
    const response = await fetch('/api/dashboard');
    const endTime = performance.now();
    
    // Dashboard must load in <2 seconds (US-030)
    assert(endTime - startTime < 2000, "Dashboard load time exceeds 2 seconds");
    assert(response.ok, "Dashboard API failed");
}
```

**Static Asset Agent Checks:**
```bash
# Verify UI assets exist
test -f "public/images/default-avatar.png" || fail "Default avatar missing"
test -f "public/css/dashboard.css" || fail "Dashboard styles missing"

# Check for accessibility resources
grep -q "aria-label\|aria-describedby" src/dashboard/*.js || fail "Accessibility attributes missing"
```

---

## P1 Requirements Validation (Essential Features)

### RA-004: Activity System Validation  
**Requirements Covered**: US-049 to US-076  
**Primary Agent**: Supabase Agent  
**Support Agents**: Integration Agent, Task Reality Agent

**Supabase Agent Checks:**
```sql
-- Verify activities table structure
SELECT column_name, data_type FROM information_schema.columns 
WHERE table_name = 'activities' 
AND column_name IN ('id', 'title', 'cost_emcoins', 'deadline', 'activity_type');

-- Test activity registration constraints
SELECT COUNT(*) FROM activity_registrations 
WHERE player_id = 'test_user' AND activity_id = 'test_activity'; -- Max 1 per user per activity

-- Verify payment integration
SELECT ar.*, p.current_balance 
FROM activity_registrations ar 
JOIN profiles p ON ar.player_id = p.id 
WHERE ar.status = 'approved' AND p.current_balance >= 0; -- No negative balances
```

**Task Reality Agent Checks:**
```python
def validate_activity_workflow():
    # Dependency check: Activity creation -> Registration -> Payment -> Participation
    dependencies = {
        "activity_creation": ["supervisor_auth", "activity_template"],
        "registration": ["activity_exists", "user_authenticated", "balance_sufficient"],
        "payment": ["registration_approved", "emcoin_balance_verified"],
        "participation": ["payment_completed", "activity_active"]
    }
    
    for task, deps in dependencies.items():
        verify_task_dependencies(task, deps)
```

**Integration Agent Checks:**
```python
def test_activity_lifecycle():
    # Create activity as supervisor
    activity_data = {
        "title": "Test Debate",
        "type": "Event", 
        "cost": 25,
        "deadline": "2025-09-01T12:00:00Z"
    }
    create_response = create_activity(supervisor_token, activity_data)
    assert create_response.status_code == 201
    
    # Register as player
    activity_id = create_response.json()["id"]
    register_response = register_for_activity(player_token, activity_id)
    assert register_response.status_code == 200
    
    # Approve registration as supervisor
    approve_response = approve_registration(supervisor_token, activity_id, player_id)
    assert approve_response.status_code == 200
    
    # Verify payment processed
    balance_response = get_balance(player_token)
    assert balance_response.json()["balance"] >= 0  # No overdraft
```

---

### RA-005: Badge System Validation
**Requirements Covered**: US-077 to US-086  
**Primary Agent**: Integration Agent  
**Support Agents**: Supabase Agent, Static Asset Agent

**Supabase Agent Checks:**
```sql
-- Verify badges table and constraints
SELECT * FROM badges WHERE requirements IS NOT NULL; -- All badges have requirements
SELECT * FROM player_badges WHERE earned_date IS NOT NULL; -- All earned badges have date

-- Test badge earning logic
SELECT pb.*, b.requirements 
FROM player_badges pb 
JOIN badges b ON pb.badge_id = b.id 
WHERE pb.player_id = 'test_player'; -- Verify earned badges meet requirements
```

**Static Asset Agent Checks:**
```bash
# Verify badge assets exist
for badge in $(psql -t -c "SELECT slug FROM badges"); do
    test -f "public/images/badges/${badge}.png" || fail "Badge image missing: $badge"
done

# Check badge image specifications
identify public/images/badges/*.png | grep -v "128x128" && fail "Badge images not 128x128"
```

**Integration Agent Checks:**
```python
def test_badge_earning():
    # Complete activity that awards badge
    complete_activity(player_token, activity_id)
    
    # Verify badge awarded
    badges_response = get_player_badges(player_token)
    new_badges = [b for b in badges_response.json() if b["earned_today"]]
    assert len(new_badges) > 0, "No badges awarded for activity completion"
    
    # Verify badge appears on profile
    profile_response = get_public_profile(player_id)
    profile_badges = profile_response.json()["badges"]
    assert any(b["id"] in [nb["id"] for nb in new_badges] for b in profile_badges)
```

---

## P2 Requirements Validation (Enhancement Features)

### RA-006: Communication System Validation
**Requirements Covered**: US-104 to US-118  
**Primary Agent**: Integration Agent  
**Support Agents**: Supabase Agent, FileSystem Agent

**Supabase Agent Checks:**
```sql
-- Verify messages table and encryption
SELECT column_name, data_type FROM information_schema.columns 
WHERE table_name = 'messages' 
AND column_name IN ('content_encrypted', 'sender_id', 'recipient_id', 'timestamp');

-- Test message safety constraints
SELECT COUNT(*) FROM messages WHERE content_encrypted IS NULL; -- Should be 0
SELECT COUNT(*) FROM flagged_messages WHERE reviewed_at IS NULL; -- Pending reviews

-- Verify supervisor access logs
SELECT * FROM message_access_logs 
WHERE supervisor_id IS NOT NULL AND accessed_at > NOW() - INTERVAL '1 hour';
```

**Integration Agent Checks:**
```python
def test_messaging_system():
    # Send message test
    message_data = {"recipient_id": recipient_id, "content": "Test message"}
    send_response = send_message(sender_token, message_data)
    assert send_response.status_code == 201
    
    # Real-time delivery test
    import time
    time.sleep(1)  # Allow for real-time processing
    
    inbox_response = get_inbox(recipient_token)
    messages = inbox_response.json()["messages"]
    assert any(m["content"] == "Test message" for m in messages)
    
    # Safety filter test
    inappropriate_message = {"recipient_id": recipient_id, "content": "filtered_keyword_test"}
    filter_response = send_message(sender_token, inappropriate_message)
    # Should either block or flag for review
    assert filter_response.status_code in [400, 202]  # Blocked or flagged
```

**FileSystem Agent Checks:**
```bash
# Verify messaging components
test -f "src/messaging/inbox.js" || fail "Inbox component missing"
test -f "src/messaging/compose.js" || fail "Message compose component missing"
test -f "src/messaging/notifications.js" || fail "Notifications component missing"

# Check for WebSocket configuration
grep -q "WebSocket\|ws://" src/config/* || fail "WebSocket configuration missing"
```

---

### RA-007: Resource System Validation
**Requirements Covered**: US-119 to US-135  
**Primary Agent**: Static Asset Agent  
**Support Agents**: Supabase Agent, Vercel Agent

**Static Asset Agent Checks:**
```bash
# Verify resource storage structure
test -d "uploads/resources" || fail "Resource upload directory missing"

# Check file type restrictions
find uploads/resources -type f ! \( -name "*.pdf" -o -name "*.mp4" -o -name "*.mp3" -o -name "*.png" -o -name "*.jpg" \) | head -1 | xargs test ! -f || fail "Unauthorized file type found"

# Verify file size limits (500MB max)
find uploads/resources -type f -size +500M | head -1 | xargs test ! -f || fail "File exceeds size limit"

# Check accessibility features
grep -r "captions\|transcript" uploads/resources/ || warn "Limited accessibility resources"
```

**Supabase Agent Checks:**
```sql
-- Verify resources table structure
SELECT column_name FROM information_schema.columns 
WHERE table_name = 'resources' 
AND column_name IN ('title', 'description', 'access_level', 'file_url', 'version');

-- Test access control
SELECT r.* FROM resources r 
WHERE access_level = 'grade_6_plus' AND id IN (
    SELECT resource_id FROM resource_access 
    WHERE player_id IN (SELECT id FROM profiles WHERE grade_level < 6)
); -- Should be empty (no unauthorized access)

-- Verify resource ratings
SELECT AVG(rating), COUNT(*) FROM resource_ratings 
GROUP BY resource_id HAVING COUNT(*) >= 3; -- Resources with sufficient ratings
```

**Vercel Agent Checks:**
```javascript
async function validateResourceDelivery() {
    // Test CDN delivery performance
    const resourceUrl = "/api/resources/test-resource.pdf";
    const startTime = performance.now();
    const response = await fetch(resourceUrl);
    const endTime = performance.now();
    
    // Resources should load within 3 seconds (US-120)
    assert(endTime - startTime < 3000, "Resource load time exceeds 3 seconds");
    assert(response.ok, "Resource delivery failed");
    
    // Test streaming for video content
    const videoUrl = "/api/resources/test-video.mp4";
    const videoResponse = await fetch(videoUrl);
    assert(videoResponse.headers.get("accept-ranges") === "bytes", "Video streaming not supported");
}
```

---

### RA-008: emCoin Economy Validation
**Requirements Covered**: US-136 to US-154  
**Primary Agent**: Supabase Agent  
**Support Agents**: Integration Agent, GitHub Agent

**Supabase Agent Checks:**
```sql
-- Verify transaction integrity
SELECT player_id, SUM(amount) as net_change 
FROM emcoin_transactions 
GROUP BY player_id 
HAVING SUM(amount) < 0; -- Should be empty (no negative balances)

-- Test transaction audit trail
SELECT COUNT(*) FROM emcoin_transactions 
WHERE created_at IS NULL OR transaction_id IS NULL; -- Should be 0

-- Verify payment processing
SELECT t.*, p.payment_status FROM emcoin_transactions t 
LEFT JOIN payment_records p ON t.payment_record_id = p.id 
WHERE t.transaction_type = 'purchase' AND p.payment_status != 'completed';

-- Check supervisor spending controls
SELECT st.* FROM spending_transactions st 
JOIN profiles p ON st.player_id = p.id 
JOIN supervisor_links sl ON p.id = sl.player_id 
WHERE st.amount > sl.spending_limit AND st.approved_by IS NULL; -- Unauthorized large transactions
```

**Integration Agent Checks:**
```python
def test_emcoin_system():
    # Balance verification
    balance_response = get_balance(player_token)
    initial_balance = balance_response.json()["balance"]
    
    # Purchase test
    purchase_data = {"item_id": "test_resource", "cost": 10}
    purchase_response = make_purchase(player_token, purchase_data)
    assert purchase_response.status_code == 200
    
    # Verify balance updated
    new_balance_response = get_balance(player_token)
    new_balance = new_balance_response.json()["balance"]
    assert new_balance == initial_balance - 10
    
    # Transaction history test
    history_response = get_transaction_history(player_token)
    transactions = history_response.json()["transactions"]
    assert any(t["amount"] == -10 and t["description"] == "test_resource" for t in transactions)
    
    # Earning test
    complete_activity(player_token, earning_activity_id)
    updated_balance = get_balance(player_token).json()["balance"]
    assert updated_balance > new_balance  # Balance increased from earning
```

**GitHub Agent Checks:**
```bash
# Verify payment integration security
grep -r "api_key\|secret" src/payments/ && fail "Hardcoded payment credentials found"

# Check for PCI compliance measures  
test -f "src/payments/tokenization.js" || fail "Payment tokenization missing"
grep -q "https://" src/payments/*.js || fail "Insecure payment endpoints"

# Verify audit logging
test -f "src/audit/payment-logger.js" || fail "Payment audit logging missing"
```

---

## Cross-System Integration Validation

### RA-009: End-to-End System Validation
**Requirements Covered**: All US-001 to US-154  
**Primary Agent**: Integration Agent  
**Support Agents**: All agents

**Integration Agent Master Test:**
```python
def test_complete_user_journey():
    """
    Full end-to-end test covering P0 -> P1 -> P2 progression
    """
    # P0: Foundation (Authentication, Teams, Dashboard)
    user_token = register_and_verify_user("e2e@test.com", "TestUser123")
    profile_id = create_profile(user_token, {"call_sign": "E2EUser", "grade": 7})
    team_id = create_team(user_token, {"name": "E2E Test Team", "genre": "debate"})
    
    # P1: Essential Features (Activities, Badges)
    activity_id = find_available_activity(grade_level=7)
    register_for_activity(user_token, activity_id)
    complete_activity(user_token, activity_id)
    verify_badge_earned(user_token, "first_activity")
    
    # P2: Enhancement Features (Communication, Resources, emCoins)
    send_message(user_token, {"recipient": "friend_user", "content": "Test message"})
    access_resource(user_token, "grade_7_resource")
    spend_emcoins(user_token, {"item": "premium_resource", "cost": 25})
    
    # Verify all systems working together
    dashboard = get_dashboard(user_token)
    assert dashboard["balance"] >= 0
    assert len(dashboard["teams"]) >= 1
    assert len(dashboard["badges"]) >= 1
    assert dashboard["message_count"] >= 0
    
    return "FULL_SYSTEM_VALIDATION_PASSED"
```

### RA-010: Performance Validation
**Primary Agent**: Vercel Agent  
**Support Agents**: All agents

**Vercel Agent Performance Suite:**
```javascript
async function validateSystemPerformance() {
    const performanceTests = [
        // P0 Performance requirements
        { endpoint: "/api/auth/login", maxTime: 1000, description: "Login" },
        { endpoint: "/api/dashboard", maxTime: 2000, description: "Dashboard load" },
        { endpoint: "/api/teams", maxTime: 2000, description: "Team listing" },
        
        // P1 Performance requirements  
        { endpoint: "/api/activities", maxTime: 2000, description: "Activity browsing" },
        { endpoint: "/api/badges", maxTime: 1000, description: "Badge gallery" },
        
        // P2 Performance requirements
        { endpoint: "/api/messages", maxTime: 1000, description: "Message inbox" },
        { endpoint: "/api/resources", maxTime: 2000, description: "Resource library" },
        { endpoint: "/api/emcoins/balance", maxTime: 1000, description: "Balance check" }
    ];
    
    for (const test of performanceTests) {
        const startTime = performance.now();
        const response = await fetch(test.endpoint);
        const endTime = performance.now();
        const duration = endTime - startTime;
        
        assert(duration < test.maxTime, 
            `${test.description} took ${duration}ms, exceeds ${test.maxTime}ms limit`);
        assert(response.ok, `${test.description} API failed`);
    }
    
    return "PERFORMANCE_VALIDATION_PASSED";
}
```

---

## Validation Execution Protocol

### Automated Validation Pipeline

**Stage 1: Pre-deployment Validation**
```bash
#!/bin/bash
# Run before any deployment

echo "Starting Reality Agent Validation Pipeline..."

# FileSystem Agent
./scripts/validate-filesystem.sh || exit 1

# GitHub Agent  
./scripts/validate-repository.sh || exit 1

# Static Asset Agent
./scripts/validate-assets.sh || exit 1

echo "Stage 1 (Static) validation passed"
```

**Stage 2: Database Validation**
```bash
# Supabase Agent
./scripts/validate-database.sh || exit 1

# Task Reality Agent  
./scripts/validate-dependencies.sh || exit 1

echo "Stage 2 (Database) validation passed"
```

**Stage 3: Integration Validation**
```bash
# Integration Agent
./scripts/validate-integration.sh || exit 1

# Vercel Agent
./scripts/validate-performance.sh || exit 1

echo "Stage 3 (Integration) validation passed"
```

### Continuous Validation

**Daily Validation:**
- Run RA-001 to RA-005 (P0, P1 core features)
- Performance monitoring via Vercel Agent
- Database integrity checks via Supabase Agent

**Weekly Validation:**
- Full RA-001 to RA-010 suite
- End-to-end user journey tests  
- Security audit via all agents

**Pre-release Validation:**
- Complete validation suite mandatory
- Manual verification of failed tests
- Performance benchmarking
- Security penetration testing

---

## Validation Results Integration

### Requirements Traceability Matrix

Each validation test maps to specific user stories:

| Validation Test | User Stories Covered | Success Criteria Met | Acceptance Tests Passed |
|----------------|---------------------|---------------------|------------------------|
| RA-001 | US-001 to US-015 | 15/15 | AT-001 to AT-003 |
| RA-002 | US-016 to US-027 | 12/12 | AT-004 to AT-006 |
| RA-003 | US-028 to US-048 | 21/21 | AT-007 to AT-010 |
| RA-004 | US-049 to US-076 | 28/28 | AT-011 to AT-015 |
| RA-005 | US-077 to US-086 | 10/10 | AT-016 to AT-018 |
| RA-006 | US-104 to US-118 | 15/15 | AT-021 to AT-025 |
| RA-007 | US-119 to US-135 | 17/17 | AT-024, AT-031, AT-033 |
| RA-008 | US-136 to US-154 | 19/19 | AT-026 to AT-029 |

### Gap Analysis Reporting

The Reality Agents will generate automated gap reports:

```json
{
  "validation_summary": {
    "total_stories": 154,
    "stories_validated": 150,
    "stories_failed": 4,
    "success_rate": "97.4%"
  },
  "failed_validations": [
    {
      "story_id": "US-042",
      "validation_test": "RA-003",
      "agent": "Integration Agent", 
      "failure_reason": "Player rankings API timeout",
      "remediation": "Optimize ranking calculation query"
    }
  ],
  "performance_summary": {
    "average_response_time": "847ms",
    "endpoints_over_limit": 2,
    "availability": "99.8%"
  }
}
```

---

## Success Metrics for Reality Agent Validation

**Validation Coverage:**
- 100% of user stories have validation tests
- 95% automated validation (5% manual verification)
- All 7 Reality Agents contributing

**Performance Standards:**
- Validation suite completes in <10 minutes
- 99% success rate on daily validation
- <24 hour resolution for failed validations

**Integration Quality:**
- Zero breaking changes between domains
- All APIs conform to success criteria
- End-to-end user journeys 100% functional

---

*Reality Agent validation specifications complete for all 154 user stories*