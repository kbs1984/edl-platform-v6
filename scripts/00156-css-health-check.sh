#!/bin/bash

# CSS Health Check Script
# Quick check if CSS compilation is working

echo "🔍 CSS Health Check"
echo "==================="

check_css_health() {
  local app_name=$1
  local app_dir=$2
  local port=$3
  
  echo ""
  echo "Checking $app_name..."
  
  # Check if .next directory exists
  if [ ! -d "$app_dir/.next" ]; then
    echo "  ⚠️  Build directory doesn't exist - run 'npm run dev' first"
    return 1
  fi
  
  # Check for CSS files
  css_count=$(find "$app_dir/.next/static/css" -name "*.css" 2>/dev/null | wc -l)
  
  if [ "$css_count" -gt 0 ]; then
    echo "  ✅ Found $css_count CSS files"
    
    # If dev server is running, check HTTP
    if lsof -i:$port > /dev/null 2>&1; then
      if curl -sf "http://localhost:$port/_next/static/css/app/layout.css" > /dev/null 2>&1; then
        echo "  ✅ CSS is being served correctly"
      else
        echo "  ❌ CSS files exist but getting 404 errors!"
        echo "  💡 Fix: cd $app_dir && npm run dev:safe"
      fi
    else
      echo "  ℹ️  Dev server not running on port $port"
    fi
  else
    echo "  ❌ No CSS files found!"
    echo "  💡 Fix: cd $app_dir && rm -rf .next node_modules/.cache && npm run dev"
  fi
}

# Check both apps
check_css_health "Auth Gateway" "reconciliation/active-work/auth-gateway" 3000
check_css_health "Dashboard" "reconciliation/active-work/dashboard" 3001

echo ""
echo "==================="
echo "Quick Fix Commands:"
echo ""
echo "If CSS is broken, use the new safe commands:"
echo "  Auth Gateway: cd reconciliation/active-work/auth-gateway && npm run dev:safe"
echo "  Dashboard:    cd reconciliation/active-work/dashboard && npm run dev:safe"
echo ""
echo "Or use normal dev (now auto-clears .next):"
echo "  npm run dev"
echo ""