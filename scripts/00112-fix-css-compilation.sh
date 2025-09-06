#!/bin/bash
---
session: "00112"
type: "script"
status: "current"
created: "2025-08-29"
title: "CSS Compilation Fix Script"
purpose: "Quickly recover from Tailwind v4 compilation failures"
topics: ["css", "tailwind", "recovery", "build-fix"]
priority: "P0"
domain: "core"
---

# CSS Compilation Recovery Script
# For when Tailwind v4 fails to compile

echo "🔧 CSS Compilation Recovery Tool"
echo "================================"
echo "Fixing Tailwind v4 compilation issues..."

cd reconciliation/active-work/dashboard || exit 1

# Step 1: Kill any running dev servers
echo "1. Stopping any running dev servers..."
pkill -f "next dev" 2>/dev/null || true
sleep 2

# Step 2: Clear all caches
echo "2. Clearing build caches..."
rm -rf .next 2>/dev/null
rm -rf node_modules/.cache 2>/dev/null
rm -rf .turbo 2>/dev/null

# Step 3: Verify PostCSS config exists
echo "3. Verifying PostCSS configuration..."
if [ ! -f "postcss.config.js" ]; then
    echo "   ⚠️  Creating postcss.config.js..."
    cat > postcss.config.js << 'EOF'
module.exports = {
  plugins: {
    '@tailwindcss/postcss': {},
  },
};
EOF
fi

# Step 4: Touch CSS file to force recompilation
echo "4. Forcing CSS recompilation..."
touch src/app/globals.css

# Step 5: Check if CSS directory exists
echo "5. Preparing CSS output directory..."
mkdir -p .next/static/css/app 2>/dev/null

# Step 6: Restart dev server
echo "6. Starting dev server..."
echo "   Run: npm run dev"
echo ""
echo "✅ Recovery steps complete!"
echo ""
echo "📋 Manual verification:"
echo "1. Run: npm run dev"
echo "2. Wait for compilation"
echo "3. Check: ls .next/static/css/app/"
echo "4. Look for .css files generated"
echo ""
echo "If CSS still doesn't compile, try:"
echo "  npm install --force"
echo "  Then run this script again"