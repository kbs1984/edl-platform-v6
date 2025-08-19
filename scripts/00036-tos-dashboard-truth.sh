#!/bin/bash
# Constitutional OS Dashboard v2.0 - Truth Integrated
# Session 36 Implementation - 2025-08-19
#
# Enhanced wrapper for Truth-integrated Constitutional OS Dashboard
# Provides real metrics from Truth API instead of static placeholders

# Ensure we're in the right directory
cd "$(dirname "$0")/.." || exit 1

# Color output support
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to show usage
show_usage() {
    cat << EOF
╔══════════════════════════════════════════════════════════════╗
║     Constitutional OS Dashboard v2.0 - Truth Integrated       ║
╚══════════════════════════════════════════════════════════════╝

Usage: $0 [OPTIONS]

OPTIONS:
    (no args)     Quick glance view (5 seconds)
    --normal      Normal 30-second view (default for terminals)
    --deep        Deep 5-minute analysis with full Truth details
    --test        Test Truth API connection
    --refresh     Refresh Reality Agents before displaying
    --speed TYPE  Query speed: real_time, operational, archival
    --help        Show this help message

EXAMPLES:
    $0                    # Quick glance
    $0 --normal           # Standard view with Truth metrics
    $0 --deep             # Full analysis with reconciliation
    $0 --refresh --deep   # Refresh agents then deep view
    $0 --speed real_time  # Use real-time cache (5s)

TRUTH FEATURES:
    • Real system health from Reality Agents (not placeholders)
    • Push architecture for live updates
    • Meta-Truth Agent monitoring (who watches the watchers?)
    • Three-speed caching system
    • Educational achievement ledger
    • Evidence chains with confidence intervals

EOF
}

# Parse arguments
REFRESH=false
ARGS=""

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
            ARGS="$ARGS --test-truth"
            shift
            ;;
        --normal|--deep|--speed)
            ARGS="$ARGS $1"
            if [[ "$1" == "--speed" && -n "$2" ]]; then
                ARGS="$ARGS $2"
                shift
            fi
            shift
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

# Run the dashboard
python3 scripts/00036-tos-dashboard-truth.py $ARGS

# Exit code from dashboard
exit $?