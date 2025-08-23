#!/bin/bash
# Session Log Creator - Generates proper constitutional session log
# Usage: ./create-session-log.sh [SESSION_NUMBER] [FOCUS]

SESSION_NUM=${1:-00007}
SESSION_FOCUS=${2:-"Session Work"}
SESSION_FILE="/home/b4sho/edl-projects-with-claude/edl-platform-v6/archive/sessions/SESSION-$SESSION_NUM-LOG.md"
TODAY=$(date +%Y-%m-%d)
TIME=$(date +"%I:%M %p")

if [ -f "$SESSION_FILE" ]; then
    echo "⚠️  Session log already exists: $SESSION_FILE"
    echo "Use session-guard.sh to validate instead"
    exit 1
fi

echo "📝 Creating Session $SESSION_NUM log..."

cat > "$SESSION_FILE" << EOF
---
session: "$SESSION_NUM"
type: "log"
status: "current"
created: "$TODAY"
title: "Session #$SESSION_NUM Log - $SESSION_FOCUS"
purpose: "Document work completed in Session $SESSION_NUM"
topics: ["session-log", "work-tracking"]
priority: "P0"
domain: "core"
---

# Session #$SESSION_NUM Log

**Date**: $TODAY
**Type**: CLI Session  
**Started**: $TIME
**Session Focus**: $SESSION_FOCUS

## System State at Session Start
**Reality Agents**: [X/4] Operational
- FileSystem Agent: [✅/❌] [Status] (Session XX)
- GitHub Agent: [✅/❌] [Status] (Session XX)
- Supabase Agent: [✅/❌] [Status] (Session XX)
- Integration Agent: [✅/❌] [Status] (Session XX)

**System Health**: [X]%
**Integration Debt**: $[X] ([X] missing tests)
**Domains Status**:
- Reality Domain: [✅/❌] [Status] ([X] agents)
- Requirements Domain: [✅/❌] [Status]
- Reconciliation Domain: [✅/❌] [Status]

**Key Metrics**:
- Test Coverage: [X] test files
- Truth Score: [X]%
- Assumption Clarity: [X]%

**Structural Docs**: PROJECT-STRUCTURE.md (Session 06)

## Work Completed (Chronological)

### [Time Range] - [Phase Name]
- **[HH:MM]** [Specific action taken]
- **[HH:MM]** [Deliverable created]
- **[HH:MM]** [Issue resolved]

### [Time Range] - [Phase Name]  
- **[HH:MM]** [Major milestone]
- **[HH:MM]** [System change]

## Final Metrics
- **Deliverables Created**: X components
- **System Health**: X%
- **Issues Resolved**: 
  - [Issue 1]
  - [Issue 2]

## Handoff for Next Session
[Key information for next session]
- **Status**: [Current state]
- **Next Priority**: [What should happen next]
- **Blockers**: [Any impediments]

## Constitutional Compliance
- **Article VII**: Retroactive disclosure included
- **Transparency**: All major work documented
- **Truth Priority**: Honest reconstruction from available sources

**Session $SESSION_NUM Sign-off**: [Brief summary of session success/status]
EOF

echo "✅ Session log created: $SESSION_FILE"
echo "📋 Protocol v2.0 Template includes:"
echo "   - System State at Session Start (NEW!)"
echo "   - Reality Agent operational status"
echo "   - Health metrics and domain status"
echo "   - Proper chronological structure"  
echo "   - Metrics tracking sections"
echo "   - Handoff preparation"
echo ""
echo "🔄 Next steps:"
echo "   1. Run Integration Agent to populate System State"
echo "   2. Fill in actual work completed"
echo "   3. Update timestamps with real reconstruction"
echo "   4. Verify >50 lines for substantial work"
echo "   5. Run session-guard.sh to validate"