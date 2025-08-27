---
session: "00084"
type: "guide"
status: "current"
created: "2025-08-27"
title: "YAML Query System - Quick Reference Card"
purpose: "Quick reference for YAML query commands to prevent duplicate work"
topics: ["yaml", "query", "reference", "commands", "productivity"]
priority: "P0"
domain: "core"
lifecycle: "ON"
---

# 🚀 YAML QUERY QUICK REFERENCE
**Performance**: 0.15s queries | 99.6% cache hit rate | 1583+ indexed files

## 🔴 MANDATORY: Start Every Session With These

```bash
# 1. Find ALL existing work on your topic
python3 scripts/00059-yaml-query.py --topic "auth"

# 2. Find incomplete work needing attention  
python3 scripts/00059-yaml-query.py --topic "auth" --status incomplete

# 3. Check recent sessions for related work
python3 scripts/00059-yaml-query.py --session "0008*" --topic "auth"
```

## 📋 Common Query Patterns

### By Topic
```bash
# Find all auth work
python3 scripts/00059-yaml-query.py --topic auth

# Find database migrations
python3 scripts/00059-yaml-query.py --topic migration

# Find profile creation issues
python3 scripts/00059-yaml-query.py --topic profile
```

### By Status
```bash
# Find incomplete work
python3 scripts/00059-yaml-query.py --status incomplete

# Find blocked items
python3 scripts/00059-yaml-query.py --status blocked

# Find completed fixes
python3 scripts/00059-yaml-query.py --type fix --status completed
```

### By Session
```bash
# What did Session 44 do?
python3 scripts/00059-yaml-query.py --session 00044

# All work from Sessions 80-89
python3 scripts/00059-yaml-query.py --session "0008*"
```

### By Type
```bash
# Find all fixes
python3 scripts/00059-yaml-query.py --type fix

# Find all handoffs
python3 scripts/00059-yaml-query.py --type handoff

# Find all logs
python3 scripts/00059-yaml-query.py --type log
```

### By Implementation
```bash
# What implements AUTH-MASTERPLAN?
python3 scripts/00059-yaml-query.py --implements AUTH-MASTERPLAN.md

# What implements the dashboard?
python3 scripts/00059-yaml-query.py --implements DASHBOARD-MASTERPLAN.md
```

## 📊 Project Intelligence

```bash
# Hot topics being worked on
python3 scripts/00062-project-insights.py --hot-topics

# Work velocity and productivity
python3 scripts/00062-project-insights.py --velocity

# Timeline of recent work
python3 scripts/00062-project-insights.py --timeline

# Session productivity comparison
python3 scripts/00062-project-insights.py --session 00074 00075 00076
```

## 🔍 Advanced Queries

```bash
# Find broken references
python3 scripts/00059-yaml-query.py --broken

# Combined filters (topic + status + type)
python3 scripts/00059-yaml-query.py --topic auth --status incomplete --type fix

# Limit results
python3 scripts/00059-yaml-query.py --topic database --limit 5

# Check relationships
python3 scripts/00059-yaml-query.py --relationships AUTH-MASTERPLAN.md
```

## ⚡ Performance Comparison

| Method | Time | Cache | Cross-refs |
|--------|------|-------|------------|
| YAML Query | 0.15s | 99.6% | ✅ Yes |
| Grep | 2-5s | None | ❌ No |
| Find | 1-3s | None | ❌ No |
| Manual | 30s+ | None | ❌ No |

## 🎯 Common Mistakes to Avoid

```bash
# ❌ DON'T start working without querying first
# ❌ DON'T use grep/find for metadata searches
# ❌ DON'T manually read through session logs
# ❌ DON'T assume work doesn't exist

# ✅ DO query before creating new files
# ✅ DO check for incomplete related work
# ✅ DO use project insights for trends
# ✅ DO leverage the 0.15s query speed
```

## 💡 Pro Tips

1. **Query first, code second** - Always check existing work
2. **Use wildcards** - `--session "0008*"` matches 00080-00089
3. **Combine filters** - Topic + status + type for precision
4. **Check incomplete** - Find work that needs finishing
5. **Trust the cache** - 99.6% hit rate means instant results

## 🚨 Session 84 Discovery

Sessions 74-84 **forgot this system existed** and wasted time:
- Manually searching for files
- Rediscovering existing solutions
- Missing cross-references
- Not finding Session 44's fixes quickly

**Don't repeat this mistake!**

---
*Keep this reference handy. Query speed: 0.15s. Manual search: 30s+. Choose wisely.*