---
session: "00062"
type: "command"
status: "current"
created: "2025-08-23"
title: "Project Insights Command"
purpose: "Quick access to project insights from YAML metadata"
topics: ["insights", "analytics", "metadata", "yaml", "project-management"]
priority: "P1"
domain: "core"
related_to: ["00062-project-insights.py", "00059-yaml-query.py", "00062-yaml-compliance-check.sh"]
---

# Get Project Insights

Quick commands to understand project state through YAML metadata.

## View Project Insights Dashboard

```bash
python3 scripts/00062-project-insights.py
```

Shows:
- Session productivity metrics
- Work distribution by type/domain/priority
- Relationship networks
- Maintenance needs
- Trend analysis

## Check YAML Compliance

```bash
./scripts/00062-yaml-compliance-check.sh
```

Shows:
- Overall coverage percentage
- Category breakdowns (logs, handoffs, deliverables)
- Recently modified files missing YAML
- Health assessment

## Query Files by Metadata

### By Session
```bash
# All files from a specific session
python3 scripts/00059-yaml-query.py --session 00062

# Recent sessions
python3 scripts/00059-yaml-query.py --session "0006*"
```

### By Type
```bash
# Find all architecture documents
python3 scripts/00059-yaml-query.py --type architecture

# Find all logs
python3 scripts/00059-yaml-query.py --type log

# Find all handoffs
python3 scripts/00059-yaml-query.py --type handoff
```

### By Priority
```bash
# Find all P0 items
python3 scripts/00059-yaml-query.py --priority P0

# Find all P1 items
python3 scripts/00059-yaml-query.py --priority P1
```

### By Domain
```bash
# Find all core domain files
python3 scripts/00059-yaml-query.py --domain core

# Find all requirements files
python3 scripts/00059-yaml-query.py --domain requirements
```

### By Status
```bash
# Find current/active files
python3 scripts/00059-yaml-query.py --status current

# Find deprecated files
python3 scripts/00059-yaml-query.py --status deprecated
```

### Files Needing Review
```bash
# Find overdue reviews
python3 scripts/00059-yaml-query.py --overdue
```

## Organizational Health

```bash
# Full health check with recommendations
python3 scripts/00059-yaml-indexer.py --health

# Quick organizational score
python3 scripts/00059-yaml-indexer.py --health | grep "Overall Organization Score"
```

## Add YAML to Files

```bash
# Add to specific pattern
python3 scripts/00061-add-yaml-frontmatter.py "SESSION-*-LOG.md" --dir archive/sessions --all

# Dry run first
python3 scripts/00061-add-yaml-frontmatter.py "*.md" --dry-run
```

## Combined Insights

```bash
# Quick project status
echo "=== PROJECT STATUS ==="
./scripts/00062-yaml-compliance-check.sh | head -10
echo ""
echo "=== TOP INSIGHTS ==="
python3 scripts/00062-project-insights.py 2>/dev/null | grep -A 5 "KEY INSIGHTS"
```

## Tips

1. **Coverage Target**: Aim for >50% YAML coverage for good insights
2. **Regular Updates**: Run insights after each session to track trends
3. **Cross-References**: Use `related_to` field to connect documents
4. **Review Dates**: Set realistic review dates to track maintenance

---

*Session 00062 - Making documentation visible through metadata*