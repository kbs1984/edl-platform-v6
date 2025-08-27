#!/bin/bash
# Session 00079: Start local development servers
# Purpose: Start auth and dashboard apps locally for testing

echo "🚀 Starting EDL Local Development Environment"
echo "============================================"

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check current directory
if [ ! -d "truth-seed" ]; then
    echo -e "${RED}Error: Must run from project root${NC}"
    exit 1
fi

echo -e "${YELLOW}📋 Configuration:${NC}"
echo "  Auth App: http://localhost:3000"
echo "  Dashboard: http://localhost:3001"
echo ""

# Start Auth App
echo -e "${YELLOW}Starting Auth App...${NC}"
cd truth-seed/emdash-auth-main

# Check if node_modules exists properly
if [ ! -d "node_modules/.bin" ]; then
    echo "Installing auth dependencies..."
    npm install --legacy-peer-deps
fi

# Start with plain localhost (avoiding domain resolution issues)
echo "Running: npm run dev (modified for localhost)"
npx next dev -p 3000 &
AUTH_PID=$!
echo -e "${GREEN}✅ Auth app starting on port 3000 (PID: $AUTH_PID)${NC}"

cd ../..

# Start Dashboard App  
echo -e "${YELLOW}Starting Dashboard App...${NC}"
cd truth-seed/emdash-dashboard-main

# Dashboard already has dependencies installed
echo "Running: npm run dev (modified for localhost)"
npx next dev -p 3001 &
DASHBOARD_PID=$!
echo -e "${GREEN}✅ Dashboard starting on port 3001 (PID: $DASHBOARD_PID)${NC}"

cd ../..

echo ""
echo -e "${GREEN}🎉 Development servers starting!${NC}"
echo ""
echo "📋 Next Steps:"
echo "1. Wait ~30 seconds for servers to fully start"
echo "2. Visit http://localhost:3000 to test auth"
echo "3. Visit http://localhost:3001 to test dashboard"
echo ""
echo "To stop servers:"
echo "  kill $AUTH_PID $DASHBOARD_PID"
echo ""
echo "Process IDs saved to .dev-pids"
echo "$AUTH_PID" > .dev-pids
echo "$DASHBOARD_PID" >> .dev-pids

# Keep script running
echo "Press Ctrl+C to stop both servers..."
wait