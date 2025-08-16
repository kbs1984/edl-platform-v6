---
allowed-tools: Bash(grep:*), Bash(ls:*), Bash(cat:*)
description: Verify current session is following protocol
---

# Protocol Compliance Verification

## Check 1: Reality Check Was Run
!`ls -t .metrics/reality-check-latest.json 2>/dev/null | head -1 | xargs -I {} stat -c "%y" {} 2>/dev/null || echo "ERROR: No reality check found"`

## Check 2: Session Log Exists
!`ls -t archive/sessions/SESSION-*-LOG.md | head -1`

## Check 3: Uncommitted Critical Files
!`git status --short | grep -E "CLAUDE\.md|REALITY-STATUS|PROTOCOL" || echo "No critical uncommitted files"`

## Check 4: Agent Consensus Score
!`cat .metrics/reality-check-latest.json 2>/dev/null | grep consensus_score || echo "No consensus score found"`

## Check 5: Last Handoff
!`ls -t *HANDOFF.md 2>/dev/null | head -1 | xargs -I {} head -20 {} 2>/dev/null || echo "No recent handoff found"`

## Task
Evaluate protocol compliance and:
1. ✅ or ❌ each check above
2. Calculate compliance percentage
3. Identify critical violations
4. Provide specific remediation steps
5. Determine if session can proceed

A session CANNOT proceed if:
- No reality check in last hour
- Consensus score <80%
- No session log exists
- Critical files uncommitted

$ARGUMENTS