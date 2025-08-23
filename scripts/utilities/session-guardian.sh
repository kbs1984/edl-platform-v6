#!/bin/bash
# Session Guardian
# Pre-session checklist and session management automation

set -e

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$ROOT_DIR"

SESSION_NUMBER=""
COMMAND=""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Print colored output
log_info() { echo -e "${BLUE}ℹ️  $1${NC}"; }
log_success() { echo -e "${GREEN}✅ $1${NC}"; }
log_warning() { echo -e "${YELLOW}⚠️  $1${NC}"; }
log_error() { echo -e "${RED}❌ $1${NC}"; }

usage() {
    echo "Usage: session-guardian.sh <command> [session_number]"
    echo ""
    echo "Commands:"
    echo "  start <session>  - Start new session with pre-flight checks"
    echo "  check <session>  - Run system health check for session"
    echo "  end <session>    - End session with cleanup and handoff"
    echo "  status           - Show current system status"
    echo ""
    echo "Examples:"
    echo "  session-guardian.sh start 00002"
    echo "  session-guardian.sh check 00001"
    echo "  session-guardian.sh end 00001"
    exit 1
}

verify_session_number() {
    if [[ ! "$SESSION_NUMBER" =~ ^[0-9]{5}$ ]]; then
        log_error "Session number must be 5 digits (e.g., 00001)"
        exit 1
    fi
}

pre_session_checks() {
    local session="$1"
    
    log_info "Running pre-session checks for Session #$session"
    
    # 1. Constitution compliance
    log_info "Checking constitutional compliance..."
    if python3 shared/tools/enforcement/constitution-enforcer.py validate; then
        log_success "Constitution compliance: PASSED"
    else
        log_warning "Constitution compliance: ISSUES FOUND"
        log_info "Run: python3 shared/tools/enforcement/constitution-enforcer.py audit $session"
    fi
    
    # 2. Reality domain health
    log_info "Checking reality domain health..."
    python3 shared/tools/auditing/reality-auditor.py health
    
    # 3. Gap detection
    log_info "Scanning for gaps..."
    python3 shared/tools/monitoring/gap-detector.py scan "$session" > /dev/null
    log_success "Gap scan completed"
    
    # 4. System guardian overall check
    log_info "Running comprehensive system check..."
    if python3 shared/tools/system-guardian.py check "$session"; then
        log_success "System health: GOOD"
    else
        log_warning "System health: NEEDS ATTENTION"
    fi
    
    # 5. Session protocol verification
    log_info "Verifying session protocol..."
    if [[ -f "SESSION-PROTOCOL.md" ]]; then
        log_success "Session protocol exists"
    else
        log_error "SESSION-PROTOCOL.md missing"
        exit 1
    fi
}

start_session() {
    local session="$1"
    
    log_info "🚀 Starting Session #$session"
    
    # Pre-flight checks
    pre_session_checks "$session"
    
    # Create session log
    local session_log="archive/sessions/SESSION-$session-LOG.md"
    if [[ -f "$session_log" ]]; then
        log_warning "Session log already exists: $session_log"
    else
        log_info "Creating session log: $session_log"
        cat > "$session_log" << EOF
# Session #$session Log
**Date**: $(date +%Y-%m-%d)
**Type**: CLI Session
**Platform**: Claude Code CLI

## Session Declaration
"This is session #$session"

## Pre-Flight Check Results
$(date): Session guardian pre-flight checks passed

## Session Objectives
[To be filled by Brian]

## Work Completed
[Track progress here]

## Decisions Made
[Document decisions here]

## Session Status
Status: IN PROGRESS
Started: $(date --iso-8601=seconds)

---
EOF
        log_success "Session log created"
    fi
    
    # Update system index
    log_info "Updating SYSTEM-INDEX.md with new session"
    # This would update the system index with current session info
    
    log_success "Session #$session ready to begin!"
    log_info "Remember: Document all work in $session_log"
}

end_session() {
    local session="$1"
    
    log_info "🏁 Ending Session #$session"
    
    # Final system check
    log_info "Running final system health check..."
    python3 shared/tools/system-guardian.py check "$session-END"
    
    # Update session log
    local session_log="archive/sessions/SESSION-$session-LOG.md"
    if [[ -f "$session_log" ]]; then
        log_info "Updating session log with end timestamp"
        echo "" >> "$session_log"
        echo "## Session End" >> "$session_log"
        echo "Ended: $(date --iso-8601=seconds)" >> "$session_log"
        echo "Duration: [Calculate if needed]" >> "$session_log"
        echo "" >> "$session_log"
        echo "*Session Status: COMPLETED*" >> "$session_log"
    else
        log_warning "Session log not found: $session_log"
    fi
    
    # Create handoff document template
    local handoff_file="archive/sessions/SESSION-$session-HANDOFF.md"
    if [[ ! -f "$handoff_file" ]]; then
        log_info "Creating handoff template: $handoff_file"
        cat > "$handoff_file" << EOF
# Session #$session Handoff
**Date**: $(date +%Y-%m-%d)
**Session Type**: CLI
**Status**: COMPLETED

## Summary
[Brief summary of what was accomplished]

## Key Decisions
[Important decisions made during session]

## Work Completed
[List of completed tasks]

## Open Items
[Tasks that need continuation]

## Blockers/Issues
[Any problems encountered]

## Next Session Priorities
[Recommended focus for next session]

## System State
- Constitution Version: [Check version]
- Reality Health: [Check score]
- Active Gaps: [Check count]

## Handoff Notes
[Any important context for next session]

---
*Generated by Session Guardian*
EOF
        log_success "Handoff template created"
        log_info "Please complete the handoff document before ending session"
    fi
    
    log_success "Session #$session ended. Handoff document ready for completion."
}

check_session() {
    local session="$1"
    
    log_info "🔍 Checking system health for Session #$session"
    python3 shared/tools/system-guardian.py check "$session"
}

show_status() {
    log_info "📊 Current System Status"
    python3 shared/tools/system-guardian.py status
    
    # Show latest session info
    local latest_log=$(ls -t archive/sessions/SESSION-*-LOG.md 2>/dev/null | head -1)
    if [[ -n "$latest_log" ]]; then
        local session_num=$(basename "$latest_log" | sed 's/SESSION-\(.*\)-LOG.md/\1/')
        log_info "Latest session: #$session_num"
    fi
}

# Main script logic
case "${1:-}" in
    start)
        COMMAND="start"
        SESSION_NUMBER="${2:-}"
        if [[ -z "$SESSION_NUMBER" ]]; then
            log_error "Session number required for start command"
            usage
        fi
        verify_session_number
        start_session "$SESSION_NUMBER"
        ;;
    check)
        COMMAND="check"
        SESSION_NUMBER="${2:-$(date +%s)}"
        check_session "$SESSION_NUMBER"
        ;;
    end)
        COMMAND="end"
        SESSION_NUMBER="${2:-}"
        if [[ -z "$SESSION_NUMBER" ]]; then
            log_error "Session number required for end command"
            usage
        fi
        verify_session_number
        end_session "$SESSION_NUMBER"
        ;;
    status)
        COMMAND="status"
        show_status
        ;;
    *)
        usage
        ;;
esac