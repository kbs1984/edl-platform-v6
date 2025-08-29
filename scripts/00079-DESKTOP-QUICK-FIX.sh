#!/bin/bash
# ---
# session: "00079"
# type: "script"
# status: "unknown"
# created: "2025-08-28"
# title: "00079-DESKTOP-QUICK-FIX.sh"
# purpose: "Script for DESKTOP QUICK FIX"
# language: "bash"
# category: "fixes"
# topics: ["fixes"]
# priority: "P2"
# domain: "core"
# ---
# Session 00079: Desktop's WSL2 Quick Fix for Auth Dependencies
# Based on Desktop Claude's WSL2-specific guidance

echo "🔧 Executing Desktop's Quick Fix for WSL2 npm issues"
echo "=================================================="

# Verify we're in the right place
if [[ $(pwd) != *"truth-seed/emdash-auth-main"* ]]; then
    echo "❌ Wrong directory. Run this from truth-seed/emdash-auth-main"
    exit 1
fi

echo "📍 Current directory: $(pwd)"
echo "🧹 Cleaning with sudo (Desktop's WSL2 solution)..."

# Desktop's recommended sequence
sudo rm -rf node_modules package-lock.json

echo "👤 Resetting ownership to $USER..."
sudo chown -R $USER:$USER .

echo "📦 Installing with Desktop's recommended flags..."
npm install --legacy-peer-deps --no-audit

echo ""
echo "✅ If successful, start the auth app with:"
echo "   npm run dev"
echo ""
echo "🎯 Expected result: Auth app on http://localhost:3000"
echo "   Ready for Sessions 77 & 78 verification!"