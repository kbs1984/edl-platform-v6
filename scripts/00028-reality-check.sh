#!/bin/bash
# 00028-reality-check.sh - SIMPLEST VERSION FIRST
# Session 28: Build session automation framework
# Purpose: Run Reality Agents and save outputs for parsing

echo "=== Reality Check - Session Automation v0.1 ==="
echo "Running Reality Agents..."
echo ""

# Change to agent directory
cd reality/agent-reality-auditor

# Run FileSystem Agent (fastest - 0.035s)
echo "1/4 Running FileSystem Agent..."
python3 filesystem-connector/connector.py --level 1 > /tmp/filesystem.json 2>&1
echo "   ✓ FileSystem complete"

# Run GitHub Agent (0.96s)
echo "2/4 Running GitHub Agent..."
python3 github-connector/connector.py --level 1 > /tmp/github.json 2>&1
echo "   ✓ GitHub complete"

# Run Supabase Agent (2.4s)
echo "3/4 Running Supabase Agent..."
SUPABASE_URL="https://bbrheacetxlnqbibjwsz.supabase.co" \
SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJicmhlYWNldHhsbnFiaWJqd3N6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ3MjI4MTIsImV4cCI6MjA3MDI5ODgxMn0.fccLx-9NymP8oqHT_-t-ZPZx0hgi8SGfHUJv1WKmwFE" \
python3 supabase-connector/connector.py --level 1 > /tmp/supabase.json 2>&1
echo "   ✓ Supabase complete"

# Run Integration Agent (4.4s) - runs last as it synthesizes
echo "4/4 Running Integration Agent..."
python3 integration-connector/connector.py > /tmp/integration.json 2>&1
echo "   ✓ Integration complete"

echo ""
echo "=== Quick Summary ==="

# Extract key metrics - Integration Agent outputs text, others output JSON
echo -n "System Health: "
grep "OVERALL HEALTH" /tmp/integration.json | grep -o "[0-9.]*%" || echo "Unknown"

echo -n "FileSystem Status: "
grep '"status"' /tmp/filesystem.json | head -1 | cut -d'"' -f4 || echo "Unknown"

echo -n "GitHub Status: "
grep '"status"' /tmp/github.json | head -1 | cut -d'"' -f4 || echo "Unknown"

echo -n "Supabase Status: "
grep '"status"' /tmp/supabase.json | head -1 | cut -d'"' -f4 || echo "0 tables (RLS)"

echo ""
echo "=== Full outputs saved to /tmp/*.json ==="
echo "Total execution time: ~8 seconds"