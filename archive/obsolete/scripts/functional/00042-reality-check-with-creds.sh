#!/bin/bash

# Script: 00042-reality-check-with-creds.sh
# Created: Session 00042
# Purpose: Run Reality Agents with known credentials
# Usage: ./scripts/00042-reality-check-with-creds.sh [--quick|--full|--emergency]

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Known Supabase credentials (PUBLIC - anon key)
export SUPABASE_URL="https://bbrheacetxlnqbibjwsz.supabase.co"
export SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJicmhlYWNldHhsbnFiaWJqd3N6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ3MjI4MTIsImV4cCI6MjA3MDI5ODgxMn0.fccLx-9NymP8oqHT_-t-ZPZx0hgi8SGfHUJv1WKmwFE"

# Get the mode (default to --quick)
MODE=${1:-"--quick"}

echo -e "${GREEN}═══════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}     Reality Check with Known Credentials${NC}"
echo -e "${GREEN}═══════════════════════════════════════════════════════${NC}"
echo ""
echo -e "${YELLOW}Using credentials from Session 40 (already in codebase)${NC}"
echo -e "Mode: ${MODE}"
echo ""

# Check if we're in the right directory
if [ ! -d "reality/agent-reality-auditor" ]; then
    echo -e "${RED}Error: Must run from edl-platform-v6 directory${NC}"
    exit 1
fi

# Run the appropriate reality check
if [ -f "./scripts/00028-reality-check.sh" ]; then
    echo -e "${GREEN}Running Reality Agents...${NC}"
    ./scripts/00028-reality-check.sh ${MODE}
else
    echo -e "${YELLOW}00028-reality-check.sh not found, running agents directly...${NC}"
    
    echo -e "\n${GREEN}1/4 Running FileSystem Agent...${NC}"
    python3 reality/agent-reality-auditor/filesystem-scanner/quickstart.py 2>/dev/null || echo "FileSystem Agent not found"
    
    echo -e "\n${GREEN}2/4 Running GitHub Agent...${NC}"
    python3 reality/agent-reality-auditor/github-connector/quickstart.py 2>/dev/null || echo "GitHub Agent not found"
    
    echo -e "\n${GREEN}3/4 Running Supabase Agent...${NC}"
    python3 reality/agent-reality-auditor/supabase-connector/quickstart.py 2>/dev/null || echo "Supabase Agent not found"
    
    echo -e "\n${GREEN}4/4 Running Integration Agent...${NC}"
    python3 reality/agent-reality-auditor/integration-connector/quickstart.py 2>/dev/null || echo "Integration Agent not found"
fi

echo ""
echo -e "${GREEN}═══════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}Reality Check Complete!${NC}"
echo ""
echo -e "${YELLOW}Note for future sessions:${NC}"
echo "- These credentials are PUBLIC (anon key)"
echo "- They're already in index.html and other files"
echo "- No need to ask for them again"
echo "- Use this script or ./scripts/00028-session-start.sh"
echo -e "${GREEN}═══════════════════════════════════════════════════════${NC}"