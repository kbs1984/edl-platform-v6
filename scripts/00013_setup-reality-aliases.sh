#!/bin/bash
# Reality Command Aliases - Session 00013
# Source this file to enable quick reality commands
# Usage: source scripts/00013_setup-reality-aliases.sh

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

# Main reality command
alias reality="$PROJECT_ROOT/scripts/00013_reality"
alias r="$PROJECT_ROOT/scripts/00013_reality"

# Quick shortcuts
alias rs="$PROJECT_ROOT/scripts/00013_reality status"
alias rc="$PROJECT_ROOT/scripts/00013_reality check"
alias ru="$PROJECT_ROOT/scripts/00013_reality update"
alias rcommit="$PROJECT_ROOT/scripts/00013_reality commit"

# Reality check shortcuts
alias rquick="$PROJECT_ROOT/scripts/00013_reality-check.sh --quick"
alias rfull="$PROJECT_ROOT/scripts/00013_reality-check.sh --full"
alias remergency="$PROJECT_ROOT/scripts/00013_reality-check.sh --emergency"

# Other useful shortcuts
alias verify="$PROJECT_ROOT/scripts/00013_verify-credentials.sh"
alias deploy="$PROJECT_ROOT/scripts/00013_deploy-with-verification.sh"
alias conflicts="$PROJECT_ROOT/scripts/00013_resolve-conflicts.sh"

echo "✅ Reality aliases loaded!"
echo ""
echo "Quick commands available:"
echo "  r          - Show reality status"
echo "  rs         - Reality status (same as 'r')"
echo "  rc         - Reality check (run agents)"
echo "  ru         - Update reality status"
echo "  rcommit    - Commit all work"
echo "  rquick     - Quick reality check (30s)"
echo "  rfull      - Full reality check (3-5min)"
echo "  verify     - Verify credentials"
echo "  deploy     - Deploy with verification"
echo ""
echo "Type 'reality help' for full options"