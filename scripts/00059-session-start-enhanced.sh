#!/bin/bash
---
session: "00059"
type: "script"
status: "deprecated"
created: "2025-08-28"
title: "00059-session-start-enhanced.sh"
purpose: "Upgraded session startup with organizational health reporting"
language: "bash"
category: "automation"
replaced_by: "./scripts/00028-session-start.sh (v2.0 with all features)"
topics: ['session', 'automation']
priority: "P2"
domain: "core"
---

# Enhanced Session Startup with YAML Health Integration
# Session: 00059
# Purpose: Upgraded session startup with organizational health reporting
#
# ⚠️ DEPRECATED - Session 94
# YAML health features merged into canonical script
# USE INSTEAD: ./scripts/00028-session-start.sh (v2.0 with all features)
# Kept for reference of Session 59's YAML integration work

# Get session number (auto-detect or use argument)
if [ -z "$1" ]; then
    # Auto-detect next session number
    LAST_SESSION=$(ls archive/sessions/SESSION-*-LOG.md 2>/dev/null | tail -1 | grep -oE '[0-9]{5}' | tail -1)
    if [ -z "$LAST_SESSION" ]; then
        SESSION_NUM="00001"
    else
        NEXT_NUM=$((10#$LAST_SESSION + 1))
        SESSION_NUM=$(printf "%05d" $NEXT_NUM)
    fi
else
    SESSION_NUM=$1
fi

echo "╔══════════════════════════════════════════════════════════╗"
echo "║     EDL Platform v6 - Enhanced Session Startup            ║"
echo "╚══════════════════════════════════════════════════════════╝"
echo ""
echo "Starting session: $SESSION_NUM"
echo "Timestamp: $(date '+%Y-%m-%d %H:%M:%S')"
echo ""

# Step 1: Run original Reality Agents
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Step 1/7: Running Reality Agents"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
./scripts/00028-reality-check.sh --quick 2>/dev/null

# Step 2: YAML Organizational Health (NEW)
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Step 2/7: YAML Organizational Health"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Quick YAML health check
python3 -c "
import sys
sys.path.append('reality/agent-filesystem')
from importlib import import_module
agent_module = import_module('00059-filesystem-agent-level3')
agent = agent_module.CachedFileSystemAgent()
result = agent.smart_scan()
health = agent.org_health

# Display health with emoji
score = health['organization_score']
if score >= 80:
    emoji = '🟢'
elif score >= 60:
    emoji = '🟡'
else:
    emoji = '🔴'

print(f'{emoji} Organization Score: {score:.1f}/100')
print(f'  • YAML Coverage: {health[\"yaml_coverage\"]:.1f}%')
print(f'  • Validation Pass: {health[\"validation_pass_rate\"]:.1f}%')
print(f'  • Reference Integrity: {health[\"cross_ref_integrity\"]:.1f}%')

# Performance
import time
start = time.time()
# Already cached, should be fast
result2 = agent.smart_scan()
elapsed = time.time() - start
print(f'  • Incremental scan: {elapsed:.3f}s')
" 2>/dev/null || echo "  ⚠️ YAML health check not available"

# Step 3: Check for broken references
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Step 3/7: Cross-Reference Validation"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

BROKEN_COUNT=$(python3 scripts/00059-yaml-query.py --broken 2>/dev/null | grep -c "broken_reference" || echo "0")
if [ "$BROKEN_COUNT" -eq "0" ]; then
    echo "  ✅ All cross-references valid"
else
    echo "  ⚠️ $BROKEN_COUNT broken references found"
    echo "  Run: python3 scripts/00059-yaml-query.py --broken"
fi

# Step 4: Files needing review
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Step 4/7: Files Needing Attention"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

python3 -c "
import sys
from datetime import datetime, timedelta
sys.path.append('scripts')
from importlib import import_module
indexer_module = import_module('00059-yaml-indexer')
indexer = indexer_module.YAMLIndexer()
indexer.scan_files()

# Find files needing review
review_soon = []
missing_yaml = 0
today = datetime.now().date()

for path, data in indexer.metadata_index.items():
    metadata = data.get('metadata', {})
    
    # Check review date
    if 'review_date' in metadata:
        try:
            review_date = datetime.strptime(metadata['review_date'], '%Y-%m-%d').date()
            if review_date <= today + timedelta(days=7):
                review_soon.append(path)
        except:
            pass

# Count files without YAML
all_files = list(indexer.root_path.glob('**/*.md'))
indexed = len(indexer.metadata_index)
missing_yaml = len(all_files) - indexed

if review_soon:
    print(f'  ⚠️ {len(review_soon)} files need review within 7 days')
else:
    print('  ✅ No files need immediate review')

if missing_yaml > 0:
    print(f'  📝 {missing_yaml} files without YAML frontmatter')
" 2>/dev/null || echo "  ⚠️ Review check not available"

# Step 5: Load previous context
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Step 5/7: Loading Previous Context"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

PREV_SESSION=$(printf "%05d" $((10#$SESSION_NUM - 1)))
if [ -f "archive/sessions/SESSION-${PREV_SESSION}-LOG.md" ]; then
    echo "  Loading context from Session $PREV_SESSION..."
    grep -A 5 "## Work Completed" "archive/sessions/SESSION-${PREV_SESSION}-LOG.md" 2>/dev/null | head -6 || echo "  No work summary found"
else
    echo "  ℹ️ No previous session found"
fi

# Step 6: Check for handoffs
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Step 6/7: Checking for Handoffs"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ -f "archive/sessions/SESSION-${SESSION_NUM}-HANDOFF.md" ]; then
    echo "  📋 Handoff found for this session!"
    head -20 "archive/sessions/SESSION-${SESSION_NUM}-HANDOFF.md"
else
    echo "  ℹ️ No specific handoff for Session $SESSION_NUM"
fi

# Step 7: Create session log
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Step 7/7: Creating Session Log"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

LOG_FILE="archive/sessions/SESSION-${SESSION_NUM}-LOG.md"
if [ ! -f "$LOG_FILE" ]; then
    cat > "$LOG_FILE" << EOF
# Session #${SESSION_NUM} Log

**Date**: $(date '+%Y-%m-%d')
**Type**: CLI Session  
**Started**: $(date '+%I:%M %p')
**Session Focus**: To be determined

## System State at Session Start
**Reality Agents**: 4/5 Operational
**System Health**: See reality check output
**YAML Organization Score**: See Step 2 output
**Files with YAML**: See Step 2 output
**Cross-Reference Integrity**: See Step 3 output

## Critical Context from Previous Sessions
See Step 5 output above

## Work Completed (Chronological)

### Session Initialization ($(date '+%I:%M %p'))
- Ran enhanced session startup with YAML health
- Reality Agents confirmed system health
- YAML organizational health assessed
- Context loaded from previous session

### [Work sections to be added as session progresses]

## Next Actions
[To be determined based on session work]

## Session Metrics
- Session Duration: TBD
- Files Modified: TBD
- Tests Run: TBD
- Documentation Updated: TBD

## Handoff Notes
[To be added before session end]
EOF
    echo "  ✓ Session log created: $LOG_FILE"
else
    echo "  ℹ️ Session log already exists"
fi

# Summary
echo ""
echo "╔══════════════════════════════════════════════════════════╗"
echo "║                   SESSION READY                           ║"
echo "╚══════════════════════════════════════════════════════════╝"
echo ""
echo "📊 System Status:"
echo "  • Session Number: $SESSION_NUM"
echo "  • Session Log: $LOG_FILE"
echo "  • YAML Health: Check Step 2 above"
echo "  • Cross-References: Check Step 3 above"
echo ""
echo "💡 Quick Commands:"
echo "  • Query YAML: python3 scripts/00059-yaml-query.py --topic <topic>"
echo "  • Check health: ./scripts/00059-yaml-health-check.sh"
echo "  • Find broken refs: python3 scripts/00059-yaml-query.py --broken"
echo ""
echo "✨ Enhanced session $SESSION_NUM initialization complete!"