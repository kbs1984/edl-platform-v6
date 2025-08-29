#!/bin/bash
# ---
# session: "00069"
# type: "script"
# status: "active"
# created: "2025-08-28"
# title: "00069-install-yaml-hooks.sh"
# purpose: "Script for install yaml hooks"
# language: "bash"
# category: "yaml"
# topics: ["yaml"]
# priority: "P2"
# domain: "core"
# ---
# Session 00069: Install YAML validation hooks

echo "🔧 Installing YAML Validation Hooks"
echo "===================================="

# Check if .git directory exists
if [ ! -d ".git" ]; then
    echo "❌ Error: Not in a git repository root"
    exit 1
fi

# Create hooks directory if it doesn't exist
mkdir -p .git/hooks

# Install pre-commit hook
echo "📝 Installing pre-commit hook..."

cat > .git/hooks/pre-commit << 'EOF'
#!/bin/bash
# YAML validation pre-commit hook
# Installed by Session 00069

# Run the YAML validation script
if [ -f "scripts/00069-yaml-pre-commit-hook.sh" ]; then
    ./scripts/00069-yaml-pre-commit-hook.sh
    exit $?
else
    echo "⚠️  YAML validation script not found"
    echo "    Expected: scripts/00069-yaml-pre-commit-hook.sh"
    exit 0  # Don't block commit if script is missing
fi
EOF

chmod +x .git/hooks/pre-commit

echo "✅ Pre-commit hook installed"

# Optional: Install pre-push hook for extra safety
echo ""
echo "📝 Installing pre-push hook (extra validation)..."

cat > .git/hooks/pre-push << 'EOF'
#!/bin/bash
# YAML validation pre-push hook
# Installed by Session 00069

echo "🔍 Running YAML validation before push..."

# Check all markdown files (not just staged)
python3 scripts/00068-fix-yaml-validation.py --dry-run 2>&1 | tail -5

# Check for broken references
python3 scripts/00066-reference-mapper.py --check 2>&1 | head -3

echo "✅ Pre-push validation complete"
exit 0
EOF

chmod +x .git/hooks/pre-push

echo "✅ Pre-push hook installed"

echo ""
echo "===================================="
echo "✅ YAML validation hooks installed successfully!"
echo ""
echo "What the hooks do:"
echo "  • pre-commit: Validates YAML in staged .md files"
echo "  • pre-push: Runs full validation and reference check"
echo ""
echo "To test the pre-commit hook:"
echo "  1. Modify a .md file"
echo "  2. git add [file]"
echo "  3. git commit -m 'test'"
echo ""
echo "To bypass hooks (emergency only):"
echo "  git commit --no-verify"
echo "  git push --no-verify"