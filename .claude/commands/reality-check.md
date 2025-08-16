---
allowed-tools: Bash(./scripts/00013_reality-check.sh:*)
description: Run comprehensive reality check with all agents
---

# Comprehensive Reality Check

## Running Reality Agents
!`./scripts/00013_reality-check.sh --full 2>&1`

## Current Working Directory
!`pwd`

## File System Status
!`ls -la | head -20`

## Task
Based on the reality check results:
1. Determine if system is ready for development (consensus >80%)
2. Identify which agents are failing and why
3. Provide specific fixes for any issues found
4. Update the reality status if significant changes detected

$ARGUMENTS