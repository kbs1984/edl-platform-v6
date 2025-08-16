---
allowed-tools: Bash(./scripts/00013_reality-check.sh:*), Bash(cat 00013_REALITY-STATUS.md:*), Bash(ls archive/sessions/SESSION-*:*), Bash(./scripts/create-session-log.sh:*)
description: Complete session initialization following Protocol v2.2
---

# Session Start Protocol v2.2

## Step 1: Reality Baseline
!`./scripts/00013_reality-check.sh --quick 2>&1 | tail -20`

## Step 2: Current Reality Status
!`cat 00013_REALITY-STATUS.md 2>/dev/null | grep -A 5 "CURRENT TRUTH" || echo "No status file found"`

## Step 3: Check Session Log
!`ls -t archive/sessions/SESSION-*-LOG.md 2>/dev/null | head -1`

## Step 4: Uncommitted Work Check
!`git status --short | wc -l` files uncommitted

## Task
1. Verify reality check shows READY status (>80% consensus)
2. If not READY, identify and fix blockers before proceeding
3. Create session log if missing using: ./scripts/create-session-log.sh
4. Document system state in the log
5. Confirm protocol compliance

Session Number: $ARGUMENTS

DO NOT proceed with any development until reality baseline is established.