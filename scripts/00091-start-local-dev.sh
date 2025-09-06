#!/bin/bash
# ---
# session: "00091"
# type: "script"
# status: "active"
# created: "2025-08-28"
# title: "00091-start-local-dev.sh"
# purpose: "Script for start local dev"
# language: "bash"
# category: "session-management"
# topics: ["session-management"]
# priority: "P2"
# domain: "core"
# ---

# Session 00091: Start local development servers
# Evidence-based approach - starting services with proper ports

echo "🚀 Starting Local Development Environment"
echo "========================================="
echo ""
echo "📋 Configuration:"
echo "  Auth Server: http://localhost:3000"
echo "  Dashboard: http://localhost:3002"
echo ""

# Kill any existing processes on our ports
echo "🧹 Cleaning up old processes..."
lsof -ti:3000 | xargs kill -9 2>/dev/null || true
lsof -ti:3002 | xargs kill -9 2>/dev/null || true

# Start auth server
echo "🔐 Starting Auth Server on port 3000..."
cd truth-seed/emdash-auth-main
npm run dev > /tmp/auth-server.log 2>&1 &
AUTH_PID=$!
cd ../..

# Wait for auth to start
sleep 3

# Start dashboard 
echo "📊 Starting Dashboard on port 3002..."
cd truth-seed/emdash-dashboard-main
PORT=3002 npm run dev > /tmp/dashboard.log 2>&1 &
DASHBOARD_PID=$!
cd ../..

echo ""
echo "✅ Services Started:"
echo "  Auth PID: $AUTH_PID (log: /tmp/auth-server.log)"
echo "  Dashboard PID: $DASHBOARD_PID (log: /tmp/dashboard.log)"
echo ""
echo "📝 To view logs:"
echo "  tail -f /tmp/auth-server.log"
echo "  tail -f /tmp/dashboard.log"
echo ""
echo "🛑 To stop services:"
echo "  kill $AUTH_PID $DASHBOARD_PID"
echo ""
echo "🌐 Access points:"
echo "  Login: http://localhost:3000/login"
echo "  Dashboard: http://localhost:3002"
echo ""
echo "⚠️ IMPORTANT: Apply the school search fix in Supabase:"
echo "  Run scripts/00091-fix-school-search-function.sql in SQL Editor"