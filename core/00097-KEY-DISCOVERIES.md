---
created: '2025-08-28'
domain: core
priority: P0
purpose: Prevent rediscovery by documenting critical insights
session: 00097
status: current
title: Key Discoveries - Cumulative Learning
topics:
- discoveries
- lessons-learned
- breakthroughs
type: knowledge-base
---

# Key Discoveries - Cumulative Knowledge Base

**Purpose**: Never rediscover what we already learned

## 🔴 CRITICAL DISCOVERIES (P0)

### 1. PGRST205 Error Interpretation (Session 44)
**Discovery**: `PGRST205: Could not find table` means RLS is working, NOT that deployment failed
```
❌ WRONG: "Table doesn't exist"
✅ RIGHT: "Table exists but RLS is blocking access"
```
**Impact**: Wasted 10+ sessions thinking migrations failed when they were actually working

### 2. Truth-Seed Directory Protocol (Session 96)
**Discovery**: Mixing reference with development causes contamination
```
truth-seed/: READ-ONLY reference (NEVER edit)
reconciliation/active-work/: ALL development
```
**Impact**: Resolved Sessions 75-82 confusion permanently

### 3. Scripts CAN Have YAML (Session 97)
**Discovery**: Scripts work fine with YAML in comments
```bash
#!/bin/bash
# ---
# session: "00028"
# type: "script"
# status: "active"
# ---
```
**Impact**: Made 135 scripts discoverable

### 4. Dialog Pattern Was Correct (Session 96)
**Discovery**: Original source using `DialogClose asChild` was right
- We "fixed" something that wasn't broken
- Our fix (onPointerDown) was the bug
**Impact**: Sometimes the source code is smarter than us

## 🟡 IMPORTANT DISCOVERIES (P1)

### 5. Port Configuration (Session 96)
**Discovery**: Dashboard runs on 3001, NOT 3002
```
Auth: localhost:3000
Dashboard: localhost:3001
❌ NOT 3002 (misconfiguration)
```