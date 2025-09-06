#!/bin/bash
# ---
# session: "legacy"
# type: "script"
# status: "unknown"
# created: "2025-08-28"
# title: "00013_verify-credentials.sh"
# purpose: "Script for 00013 verify credentials"
# language: "bash"
# category: "verification"
# topics: ["verification"]
# priority: "P2"
# domain: "core"
# ---
# Credential Verification Script - Session 00013
# Ensures all Reality Agents have required credentials

echo "🔐 CREDENTIAL VERIFICATION"
echo "========================="
echo ""

PROJECT_ROOT="$(cd "$(dirname "$0")/.." && pwd)"

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Track status
ALL_GOOD=true
MISSING_COUNT=0

# Load .env if exists
if [ -f "$PROJECT_ROOT/.env" ]; then
    export $(cat "$PROJECT_ROOT/.env" | grep -v '^#' | xargs)
    echo -e "${GREEN}✅ .env file found${NC}"
else
    echo -e "${YELLOW}⚠️  No .env file found${NC}"
    echo "   Copy .env.example to .env and configure"
    ALL_GOOD=false
fi

echo ""
echo "Checking required credentials:"
echo "------------------------------"

# Supabase credentials
echo -n "SUPABASE_URL: "
if [ -n "$SUPABASE_URL" ]; then
    echo -e "${GREEN}✅ Set${NC} (${SUPABASE_URL:0:30}...)"
else
    echo -e "${RED}❌ Missing${NC}"
    ((MISSING_COUNT++))
    ALL_GOOD=false
fi

echo -n "SUPABASE_ANON_KEY: "
if [ -n "$SUPABASE_ANON_KEY" ]; then
    echo -e "${GREEN}✅ Set${NC} (${SUPABASE_ANON_KEY:0:20}...)"
else
    echo -e "${RED}❌ Missing${NC}"
    ((MISSING_COUNT++))
    ALL_GOOD=false
fi

# Optional but recommended
echo ""
echo "Optional credentials:"
echo "--------------------"

echo -n "GITHUB_TOKEN: "
if [ -n "$GITHUB_TOKEN" ]; then
    echo -e "${GREEN}✅ Set${NC}"
elif [ -f "$HOME/.config/gh/hosts.yml" ]; then
    echo -e "${GREEN}✅ GitHub CLI authenticated${NC}"
else
    echo -e "${YELLOW}⚠️  Not set (some features limited)${NC}"
fi

echo -n "VERCEL_TOKEN: "
if [ -n "$VERCEL_TOKEN" ]; then
    echo -e "${GREEN}✅ Set${NC}"
elif [ -f "$HOME/.local/share/com.vercel.cli/auth.json" ]; then
    echo -e "${GREEN}✅ Vercel CLI authenticated${NC}"
else
    echo -e "${YELLOW}⚠️  Not set (deployment features limited)${NC}"
fi

# Check for .env.example
echo ""
if [ ! -f "$PROJECT_ROOT/.env" ] && [ -f "$PROJECT_ROOT/.env.example" ]; then
    echo "📝 To configure credentials:"
    echo "   cp .env.example .env"
    echo "   # Edit .env with your values"
fi

# Summary
echo ""
echo "SUMMARY"
echo "======="

if [ "$ALL_GOOD" = true ]; then
    echo -e "${GREEN}✅ All required credentials configured${NC}"
    echo "🚀 Reality Agents ready to run"
    exit 0
else
    echo -e "${RED}❌ Missing $MISSING_COUNT required credential(s)${NC}"
    echo ""
    echo "🔧 Fix by:"
    echo "1. Copy .env.example to .env"
    echo "2. Add your Supabase project URL and anon key"
    echo "3. These are in your Supabase project settings"
    exit 1
fi