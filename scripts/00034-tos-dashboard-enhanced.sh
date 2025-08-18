#!/bin/bash
# Enhanced Constitutional OS Dashboard with Reality Agent View
# Session 34 - 2025-08-19

# Script location
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Check for --agents flag
if [[ "$1" == "--agents" ]]; then
    # Show dedicated Reality Agent view
    echo "Launching Reality Agent Status Viewer..."
    python3 "$SCRIPT_DIR/00034-reality-status.py" "${@:2}"
elif [[ "$1" == "--agents-full" ]]; then
    # Show full Reality Agent analysis
    python3 "$SCRIPT_DIR/00034-reality-status.py" --full
elif [[ "$1" == "--refresh-agents" ]]; then
    # Refresh agents then show status
    python3 "$SCRIPT_DIR/00034-reality-status.py" --refresh --full
else
    # Default to regular dashboard with agent summary
    DASHBOARD_PY="$SCRIPT_DIR/00032-tos-dashboard.py"
    
    # Check if dashboard exists
    if [[ ! -f "$DASHBOARD_PY" ]]; then
        echo "❌ Error: Dashboard script not found at $DASHBOARD_PY"
        exit 1
    fi
    
    # Pass to regular dashboard
    python3 "$DASHBOARD_PY" "$@"
    
    # If normal or deep view, show agent summary
    if [[ "$1" == "--normal" ]] || [[ "$1" == "--deep" ]]; then
        echo ""
        echo "📡 Reality Agent Quick Status:"
        echo "────────────────────────────────"
        python3 "$SCRIPT_DIR/00034-reality-status.py" --json 2>/dev/null | python3 -c "
import sys, json
try:
    data = json.load(sys.stdin)
    operational = data.get('operational_agents', 0)
    total = data.get('total_agents', 0)
    health = data.get('consensus_health', 'Unknown')
    print(f'  Operational: {operational}/{total} agents')
    print(f'  Consensus Health: {health}%')
    print(f'  For details: ./scripts/00034-tos-dashboard-enhanced.sh --agents')
except:
    print('  Run --agents for Reality Agent status')
"
    fi
fi