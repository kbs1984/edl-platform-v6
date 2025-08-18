#!/bin/bash
# Constitutional OS Dashboard - Shell Wrapper
# Session 32 - 2025-08-18

# Make script executable if not already
if [[ ! -x "$0" ]]; then
    chmod +x "$0"
fi

# Set Python path
PYTHON_CMD="python3"

# Script location
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
DASHBOARD_PY="$SCRIPT_DIR/00032-tos-dashboard.py"

# Check if dashboard script exists
if [[ ! -f "$DASHBOARD_PY" ]]; then
    echo "❌ Error: Dashboard script not found at $DASHBOARD_PY"
    exit 1
fi

# Pass all arguments to Python script
$PYTHON_CMD "$DASHBOARD_PY" "$@"