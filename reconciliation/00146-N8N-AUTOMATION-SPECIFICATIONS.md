---
session: "00146"
type: "automation-specifications"
status: "ready-for-implementation"
created: "2025-09-03"
title: "n8n Workflow Automation Specifications - Living Progress & Build Quality"
purpose: "Define n8n workflows to automate progress tracking, enforce evidence-based development, and orchestrate addiction mechanics"
topics: ["n8n", "automation", "progress-matrix", "workflow", "orchestration"]
priority: "P0"
domain: "reconciliation"
implements: ["EVIDENCE-IMPERATIVE-PROTOCOL.md", "PRIORITY-REORDER-CANON.md"]
estimated_hours: "12-16 total across all parts"
---

# n8n Workflow Automation Specifications

## Executive Summary

n8n will serve as the orchestration layer that transforms our manual processes into automated workflows, enforcing the Evidence Imperative Protocol while maintaining the Living Progress Matrix. This specification defines workflows that save hundreds of hours while preventing no-guesswork violations.

**Core Philosophy**: Automation should enforce truth, not bypass it.

---

## 📚 MANDATORY READING LIST (Evidence-Based Context)

### Before ANY n8n Implementation, Read These IN ORDER:

#### 1. Core Philosophy & Protocols
```bash
# Understand WHY we automate
cat core/PHILOSOPHY-CANON.md                        # Identity Over Function
cat core/PRIORITY-REORDER-CANON.md                  # Cyworld priorities
cat core/00145-EVIDENCE-IMPERATIVE-PROTOCOL.md      # No guesswork enforcement

# Understand WHAT we're automating
cat reconciliation/00141-LIVING-PROGRESS-MATRIX-SYSTEM.md  # Progress tracking design
cat reconciliation/00143-PRIORITY-ALIGNMENT-VALIDATION.md   # What "complete" means
```

#### 2. Technical Architecture
```bash
# Understand the hybrid approach
cat reconciliation/00146-HYBRID-ARCHITECTURE-STRATEGY.md  # Next.js + vanilla
cat reconciliation/00147-V5-INTEGRATION-IMPLEMENTATION-PLAN.md  # v5 extraction plan

# Check current infrastructure
mcp__supabase-dev__execute_sql(query="SELECT * FROM platform_progress_matrix LIMIT 1")
mcp__supabase-dev__list_tables(schemas=["public"])
```

#### 3. Current State Verification
```bash
# What's actually built?
python3 scripts/00059-yaml-query.py --status implemented
python3 scripts/00059-yaml-query.py --status validated

# What Reality Agents exist?
ls reality/agent-reality-auditor/*/connector.py

# What MCP servers are available?
cat ~/.claude.json | jq '.mcpServers | keys'
```

#### 4. V5 Sacred Constraints
```bash
# From v5 extraction docs - understand what MUST be preserved:
- 6-player supervisor limit (safety constraint)
- Grey state system (unverified → active flow)
- Daily reset at midnight (addiction mechanic)
- Exact timings: 1.8s count, 3s celebration, 2s shame
```

---

## 🏗️ PART 1: Progress Matrix Automation (4 hours)

### Objective
Automatically update `platform_progress_matrix` table when features are completed, validated, or deployed.

### Prerequisites
- [ ] n8n instance running (Docker or cloud)
- [ ] Read all mandatory context above
- [ ] Verify platform_progress_matrix table exists
- [ ] GitHub webhook access
- [ ] Supabase service role key (for writes)

### Workflow 1.1: Feature Completion Tracker

#### Trigger
GitHub webhook on PR merge to main branch

#### Input Schema
```json
{
  "action": "closed",
  "pull_request": {
    "merged": true,
    "title": "feat: Implement addiction bar",
    "number": 123,
    "body": "Implements: US-155\nCanvas: 001-1\nSession: 147",
    "merge_commit_sha": "abc123"
  }
}
```

#### Workflow Steps
```yaml
1. Extract Metadata:
   - Parse PR body for: user_story, canvas_id, session
   - Extract feature_name from PR title
   - Get files changed from GitHub API

2. Validate Evidence:
   - Check: Did tests pass? (GitHub Actions status)
   - Check: Does feature exist in code? (grep validation)
   - Check: Are there UI components? (check file paths)
   
3. Run Reality Validation:
   HTTP POST to localhost:3002/reality/validate
   {
     "feature": "{{ feature_name }}",
     "commit": "{{ merge_commit_sha }}"
   }
   
4. Update Progress Matrix:
   IF validation_score > 90% THEN:
     Supabase Update:
     UPDATE platform_progress_matrix
     SET status = 'implemented',
         reality_health = {{ validation_score }},
         implemented_by = array_append(implemented_by, {{ session }}),
         pr_numbers = array_append(pr_numbers, {{ pr_number }}),
         database_tables = {{ extracted_tables }},
         ui_components = {{ extracted_components }},
         last_validated = NOW()
     WHERE feature_name = {{ feature_name }}
   
5. Canvas Completion Check:
   Query all features with same canvas_id
   IF all are 'implemented' or 'validated' THEN:
     Send notification: "Canvas {{ canvas_id }} complete!"
     
6. Discord/Slack Notification:
   "✅ Feature '{{ feature_name }}' completed by Session {{ session }}
    Reality Health: {{ validation_score }}%
    Canvas Progress: {{ canvas_completion }}%"
```

#### Error Handling
```javascript
ON ERROR:
  - Log to n8n error table
  - Send alert: "Manual review needed for {{ feature_name }}"
  - Set status = 'needs_review' in progress matrix
  - DO NOT mark as complete without evidence
```

### Workflow 1.2: Daily Progress Report

#### Trigger
Cron: "0 9 * * *" (9 AM daily)

#### Workflow Steps
```yaml
1. Query Progress Statistics:
   SELECT 
     COUNT(*) FILTER (WHERE status = 'validated') as completed,
     COUNT(*) FILTER (WHERE status = 'in_progress') as active,
     COUNT(*) FILTER (WHERE status = 'not_started') as pending,
     COUNT(*) as total
   FROM platform_progress_matrix

2. Calculate Velocity:
   - Features completed this week
   - Average time per feature
   - Projected completion date

3. Identify Blockers:
   SELECT * FROM platform_progress_matrix
   WHERE status = 'in_progress' 
   AND updated_at < NOW() - INTERVAL '3 days'

4. Generate Report:
   Post to Discord/Slack with:
   - Progress percentages
   - Velocity metrics
   - Blocked features list
   - Today's priorities
```

---

## 🎮 PART 2: Addiction Mechanics Orchestration (3 hours)

### Objective
Automate daily resets, streak tracking, and achievement processing to maintain psychological engagement.

### Prerequisites
- [ ] Part 1 completed and tested
- [ ] EmCoin tables verified (Session 143 created these)
- [ ] User state tables created (grey state system)
- [ ] Visitor tracking tables verified

### Workflow 2.1: Daily Reset Engine

#### Trigger
Cron: "0 0 * * *" (Midnight UTC)

#### Workflow Steps
```yaml
1. Reset Visitor Counters:
   UPDATE profile_visitors
   SET today_count = 0,
       yesterday_count = today_count
   WHERE true;
   
2. Process Streak Continuations:
   WITH last_activity AS (
     SELECT user_id, MAX(created_at) as last_seen
     FROM activity_sessions
     WHERE created_at > NOW() - INTERVAL '48 hours'
     GROUP BY user_id
   )
   UPDATE user_profiles
   SET streak_days = CASE 
     WHEN last_seen > NOW() - INTERVAL '24 hours' 
     THEN streak_days + 1
     ELSE 0
   END;

3. Check Milestone Achievements:
   FOR EACH user WITH streak_days IN (3, 7, 14, 30, 100, 365):
     - Award milestone achievement
     - Grant EmCoin bonus (streak_days * 5)
     - Trigger celebration notification
     
4. Process At-Risk Streaks:
   SELECT * FROM user_profiles
   WHERE streak_days >= 7
   AND user_id NOT IN (
     SELECT user_id FROM activity_sessions
     WHERE created_at > NOW() - INTERVAL '20 hours'
   );
   
   FOR EACH at_risk_user:
     Send push notification: "Your {{ streak_days }} day streak is at risk!"

5. Update Leaderboards:
   REFRESH MATERIALIZED VIEW visitor_leaderboard;
   REFRESH MATERIALIZED VIEW streak_leaderboard;
   REFRESH MATERIALIZED VIEW emcoin_leaderboard;

6. Award Daily Login Bonus:
   FOR EACH user who logged in yesterday:
     INSERT INTO emcoin_transactions (
       user_id, amount, type, description
     ) VALUES (
       user_id, 10, 'daily_bonus', 'Daily login bonus'
     );
```

### Workflow 2.2: Achievement Processor

#### Trigger
- Webhook from any feature completion
- OR every 5 minutes for batch processing

#### Workflow Steps
```yaml
1. Check Achievement Conditions:
   SELECT * FROM achievement_rules
   WHERE NOT EXISTS (
     SELECT 1 FROM user_achievements 
     WHERE user_achievements.achievement_id = achievement_rules.id
     AND user_achievements.user_id = {{ current_user }}
   );

2. Evaluate Each Rule:
   FOR EACH unearned achievement:
     Execute rule.condition_query
     IF condition met:
       - Award achievement
       - Grant EmCoin reward
       - Update progress matrix
       - Trigger notification

3. Special Achievements:
   - "Early Bird": First 100 users to complete feature
   - "Speed Demon": Complete activity in < 5 minutes
   - "Perfectionist": 100% score on 10 activities
   - "Social Butterfly": 50+ unique visitors

4. Broadcast Social Proof:
   Post to activity feed:
   "🏆 {{ username }} just earned {{ achievement_name }}!"
```

---

## 🔒 PART 3: Evidence Enforcement Workflows (3 hours)

### Objective
Automatically enforce the Evidence Imperative Protocol, preventing no-guesswork violations.

### Prerequisites
- [ ] Parts 1-2 operational
- [ ] Read core/00145-EVIDENCE-IMPERATIVE-PROTOCOL.md
- [ ] GitHub API access configured
- [ ] Reality Agents accessible

### Workflow 3.1: Pre-Deletion Guardian

#### Trigger
GitHub PR or commit that deletes files

#### Workflow Steps
```yaml
1. Detect Deletion Intent:
   Parse git diff for deleted files
   
2. Evidence Gathering:
   FOR EACH file_to_delete:
     a. Search for references:
        grep -r "{{ filename }}" --exclude-dir=node_modules
     
     b. Check import statements:
        grep -r "from.*{{ filename }}" 
        grep -r "import.*{{ filename }}"
     
     c. Check YAML metadata:
        python3 scripts/00059-yaml-query.py --topic "{{ filename }}"
     
     d. Check session logs:
        grep -r "{{ filename }}" archive/sessions/

3. Decision Logic:
   IF references_found > 0:
     - Block deletion
     - Comment on PR with evidence
     - Require manual review
   ELSE:
     - Allow deletion
     - Log evidence of non-usage
     
4. Audit Trail:
   INSERT INTO automation_decisions (
     type: 'deletion_prevention',
     file: {{ filename }},
     evidence: {{ search_results }},
     decision: {{ blocked/allowed }},
     timestamp: NOW()
   );
```

### Workflow 3.2: Completion Validator

#### Trigger
Any attempt to mark feature as "complete" or "validated"

#### Workflow Steps
```yaml
1. Gather Evidence:
   - Does the code exist? (file presence)
   - Do tests pass? (test results)
   - Is it deployed? (Vercel status)
   - Is it accessible? (HTTP check)
   - Reality Agent consensus? (> 90%)

2. Psychology Tests (for addiction features):
   - Does animation complete in 1.8s?
   - Is addiction bar visible in < 2s?
   - Does celebration last exactly 3s?
   
3. Validation Decision:
   required_evidence = [
     'code_exists',
     'tests_pass', 
     'deployed',
     'reality_consensus'
   ]
   
   IF all evidence present:
     Allow status = 'validated'
   ELSE:
     Set status = 'implemented' (not validated)
     List missing evidence

4. Create Validation Report:
   Generate markdown report with:
   - Evidence collected
   - Tests performed
   - Screenshots (if UI feature)
   - Reality Agent scores
   - Missing requirements
```

---

## 🔄 PART 4: Session Orchestration (2 hours)

### Objective
Automate session handoffs and context preservation.

### Prerequisites
- [ ] Parts 1-3 stable
- [ ] MCP session server configured
- [ ] Git access for session commits

### Workflow 4.1: Session Handoff Generator

#### Trigger
- Timer: After 4 hours of session activity
- Manual: Session end command
- Automatic: On critical milestone

#### Workflow Steps
```yaml
1. Gather Session Work:
   - Git commits in session
   - Files modified
   - Features completed
   - Tests written
   - Documentation updated

2. Reality Check:
   Run all Reality Agents
   Calculate health delta

3. Generate Handoff:
   CREATE handoff document with:
   - Work completed
   - Current state
   - Next priorities
   - Known blockers
   - Context needed

4. Update Progress:
   - Update SESSION-LEDGER.md
   - Create next session log
   - Archive current session

5. Notify Next Session:
   Post to channel:
   "Session {{ number }} complete.
    Handoff: {{ handoff_url }}
    Priority: {{ next_priority }}"
```

---

## 🚀 PART 5: Integration & Monitoring (2 hours)

### Objective
Connect all workflows and add monitoring/alerting.

### Prerequisites
- [ ] Parts 1-4 implemented
- [ ] Monitoring dashboard available
- [ ] Alert channels configured

### Workflow 5.1: Health Monitor

#### Trigger
Every 5 minutes

#### Workflow Steps
```yaml
1. Check Workflow Health:
   - Are all workflows running?
   - Any failed executions?
   - Queue lengths normal?

2. Check Integration Points:
   - GitHub webhooks responding?
   - Supabase accessible?
   - Reality Agents online?
   - Vercel deployments working?

3. Performance Metrics:
   - Average workflow execution time
   - Success/failure rates
   - Queue processing speed

4. Alert on Issues:
   IF any component unhealthy:
     - Send immediate alert
     - Log to error table
     - Attempt auto-recovery
     - Escalate if not resolved
```

### Workflow 5.2: Feedback Loop

#### Trigger
Weekly on Mondays

#### Workflow Steps
```yaml
1. Analyze Automation Performance:
   - Time saved vs manual
   - Errors prevented
   - Features completed
   - Violations caught

2. Identify Improvements:
   - Frequently failing workflows
   - Manual overrides needed
   - Missing automation points

3. Generate Report:
   "Weekly Automation Report:
    ✅ {{ features_automated }} features processed
    ⏰ {{ hours_saved }} hours saved
    🛡️ {{ violations_prevented }} guesswork violations prevented
    📈 {{ velocity_improvement }}% velocity increase"
```

---

## 📊 Success Metrics

### Quantitative
- 0 manual progress matrix updates needed
- < 1 minute from PR merge to matrix update
- 100% of deletions checked for evidence
- 100% of completions validated
- < 5% workflow failure rate

### Qualitative
- No more "I forgot to update progress"
- No more "Was this already built?"
- No more "Why was this deleted?"
- Automatic enforcement of sacred constraints
- Perfect session handoffs every time

---

## 🔧 Technical Requirements

### n8n Setup
```bash
# Docker deployment
docker run -d \
  --name n8n \
  -p 5678:5678 \
  -v n8n_data:/home/node/.n8n \
  -e N8N_BASIC_AUTH_ACTIVE=true \
  -e N8N_BASIC_AUTH_USER=admin \
  -e N8N_BASIC_AUTH_PASSWORD=[secure] \
  n8nio/n8n

# Required nodes:
- HTTP Request (for APIs)
- Postgres (for Supabase)
- GitHub
- Cron
- Discord/Slack
- Code (for custom logic)
```

### Environment Variables
```env
# n8n needs access to:
SUPABASE_URL=https://bbrheacetxlnqbibjwsz.supabase.co
SUPABASE_SERVICE_ROLE_KEY=[secure - for writes]
GITHUB_TOKEN=[with repo access]
DISCORD_WEBHOOK_URL=[for notifications]
REALITY_AGENT_URL=http://localhost:3002
```

### Integration Points
```yaml
Incoming webhooks:
  - GitHub: PR events, push events
  - Vercel: Deployment events
  - Manual: Feature completion triggers

Outgoing connections:
  - Supabase: Database updates
  - GitHub API: Code verification
  - Reality Agents: Validation
  - Discord/Slack: Notifications
  - Email: Critical alerts
```

---

## ⚠️ Critical Warnings

### DO NOT
- Skip evidence gathering to "save time"
- Mark features complete without validation
- Delete files without checking usage
- Override Reality Agent rejections
- Disable workflows without documentation

### ALWAYS
- Verify evidence before any decision
- Log all automation decisions
- Maintain audit trail
- Test workflows in staging first
- Monitor for edge cases

---

## 📚 Additional Context

### Why n8n Over Other Options
- Visual workflow builder (truth through transparency)
- Self-hosted (data sovereignty)
- Extensive integrations
- Code nodes for complex logic
- Version control friendly

### Expected ROI
- Setup time: 12-16 hours total
- Time saved per week: 20+ hours
- Errors prevented: 90% reduction
- Velocity increase: 30-40%

### Next Steps After Implementation
1. Monitor for one week
2. Tune thresholds based on data
3. Add more sophisticated validations
4. Expand to more automation points
5. Create custom n8n nodes for Reality Agents

---

*This specification enforces Truth Over Speed through automation that requires evidence, not bypasses it.*