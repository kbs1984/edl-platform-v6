---
allowed-tools: Write, Bash(date:*), Bash(git status:*), Bash(./scripts/00013_reality-check.sh:*)
description: Generate comprehensive handoff for next session
---

# Generate Session Handoff

## Current Session
Session: $ARGUMENTS

## Final Reality Check
!`./scripts/00013_reality-check.sh --quick 2>&1 | tail -10`

## Uncommitted Work
!`git status --short`

## Current Date/Time
!`date '+%Y-%m-%d %H:%M'`

## Task
Create a comprehensive handoff document named `00[SESSION]_SESSION-[NEXT]-HANDOFF.md` that includes:

1. **Current System State**
   - Database reality (what tables exist, data status)
   - Git reality (what's committed vs uncommitted)
   - Agent consensus scores

2. **Work Completed This Session**
   - Major achievements
   - Files created/modified
   - Problems solved

3. **Critical Issues for Next Session**
   - Uncommitted work that needs attention
   - Failing agents that need fixes
   - Blocked tasks

4. **Next Session Priorities**
   - Ranked list of tasks
   - Required agent checks
   - Success criteria

5. **Lessons Learned**
   - What went well
   - What failed and why
   - Protocol improvements needed

Make the handoff impossible to misunderstand. The next session should be able to start immediately without confusion.