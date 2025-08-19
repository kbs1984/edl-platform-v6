#!/bin/bash
# Constitutional OS Dashboard v2.1 - Enhanced Truth Details
# Session 36 Enhancement - 2025-08-19
#
# Wrapper for enhanced Truth-integrated Constitutional OS Dashboard
# Provides detailed views of all dashboard sections

# Ensure we're in the right directory
cd "$(dirname "$0")/.." || exit 1

# Color output support
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Function to show usage
show_usage() {
    cat << EOF
╔══════════════════════════════════════════════════════════════╗
║   Constitutional OS Dashboard v2.1 - Enhanced Truth Details   ║
╚══════════════════════════════════════════════════════════════╝

Usage: $0 [OPTIONS]

BASIC OPTIONS:
    (no args)     Quick glance view (5 seconds)
    --normal      Normal 30-second view (default for terminals)
    --deep        Deep 5-minute analysis with full Truth details
    --verbose     Show ALL detailed sections (comprehensive view)
    --help        Show this help message

DETAIL OPTIONS (can combine multiple):
    --detail health   Show health breakdown with 5 dimensions
    --detail agents   Show agent details with last run times
    --detail meta     Show Meta-Truth monitoring details
    --detail events   Show enhanced event stream with context
    --detail all      Show all detailed sections (same as --verbose)

TRUTH OPTIONS:
    --test        Test Truth API connection
    --refresh     Refresh Reality Agents before displaying
    --speed TYPE  Query speed: real_time, operational, archival

EXAMPLES:
    $0                           # Quick glance
    $0 --normal                  # Standard view
    $0 --verbose                 # Everything in detail
    $0 --normal --detail health  # Normal view + health details
    $0 --detail agents --detail meta  # Multiple detail sections
    $0 --refresh --verbose       # Refresh then show all details

ENHANCED FEATURES IN v2.1:
    • Health breakdown showing 5 dimensions (sync, complete, etc.)
    • Agent last run times and data volumes
    • Meaningful event descriptions with context
    • Meta-Truth self-monitoring report
    • Historical health trending
    • Agent communication matrix
    • Event rate and latency metrics

DETAIL SECTIONS EXPLAINED:
    health  - Shows synchronization, completeness, consistency scores
    agents  - Shows when each agent last ran and what data it processed
    meta    - Shows who watches the watchers (self-monitoring)
    events  - Shows event stream with icons and formatted messages

EOF
}

# Parse arguments
REFRESH=false
PYTHON_ARGS=""
DETAIL_SECTIONS=""

while [[ $# -gt 0 ]]; do
    case $1 in
        --help|-h)
            show_usage
            exit 0
            ;;
        --refresh|-r)
            REFRESH=true
            shift
            ;;
        --test)
            PYTHON_ARGS="$PYTHON_ARGS --test-truth"
            shift
            ;;
        --normal|--deep|--verbose)
            PYTHON_ARGS="$PYTHON_ARGS $1"
            shift
            ;;
        --detail)
            if [[ -n "$2" && ! "$2" =~ ^-- ]]; then
                PYTHON_ARGS="$PYTHON_ARGS --detail $2"
                DETAIL_SECTIONS="$DETAIL_SECTIONS $2"
                shift 2
            else
                echo -e "${RED}Error: --detail requires a section name${NC}"
                echo "Valid sections: health, agents, meta, events, all"
                exit 1
            fi
            ;;
        --speed)
            if [[ -n "$2" && ! "$2" =~ ^-- ]]; then
                PYTHON_ARGS="$PYTHON_ARGS --speed $2"
                shift 2
            else
                echo -e "${RED}Error: --speed requires a value${NC}"
                echo "Valid speeds: real_time, operational, archival"
                exit 1
            fi
            ;;
        *)
            echo -e "${RED}Unknown option: $1${NC}"
            show_usage
            exit 1
            ;;
    esac
done

# Refresh Reality Agents if requested
if [ "$REFRESH" = true ]; then
    echo -e "${BLUE}🔄 Refreshing Reality Agents...${NC}"
    ./scripts/00028-reality-check.sh --quick
    echo
fi

# Check if Truth API is available
if ! python3 -c "import sys; sys.path.append('scripts'); exec(open('scripts/00035-truth-api.py').read(), {'__name__': '__main__'})" 2>/dev/null; then
    echo -e "${YELLOW}⚠️  Truth API not fully initialized. Some features may be limited.${NC}"
fi

# Show which details are being displayed
if [[ -n "$DETAIL_SECTIONS" ]]; then
    echo -e "${CYAN}📊 Showing detailed sections:${DETAIL_SECTIONS}${NC}"
    echo
fi

# Run the enhanced dashboard
python3 scripts/00036-tos-dashboard-enhanced.py $PYTHON_ARGS

# Exit code from dashboard
exit $?