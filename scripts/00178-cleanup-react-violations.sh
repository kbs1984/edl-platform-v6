#!/bin/bash
# 00178-cleanup-react-violations.sh
# Session 178: Clean up React violations in auth/dashboard areas
# Following the unified cleanup protocol for Sessions 167-173

set -e

echo "╔══════════════════════════════════════════════════════════╗"
echo "║     Session 178: Auth/Dashboard React Violations Cleanup  ║"
echo "╚══════════════════════════════════════════════════════════╝"

# Define archive directory
ARCHIVE_DIR="archive/legacy-react-work/session-178-violations"
mkdir -p $ARCHIVE_DIR

echo ""
echo "🔍 Phase 1: Identifying React Violations"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Count violations before cleanup
ADMIN_DASH_VIOLATIONS=$(grep -r "use client\|useState\|useEffect\|useContext\|useRouter" reconciliation/active-work/admin-dashboard/ --include="*.tsx" --include="*.jsx" 2>/dev/null | grep -v node_modules | grep -v ".next" | wc -l || echo 0)
AUTH_GW_VIOLATIONS=$(grep -r "use client\|useState\|useEffect\|useContext\|useRouter" reconciliation/active-work/auth-gateway/src/ --include="*.tsx" --include="*.jsx" 2>/dev/null | grep -v node_modules | wc -l || echo 0)

echo "📊 Violations Found:"
echo "  • Admin Dashboard: $ADMIN_DASH_VIOLATIONS React files"
echo "  • Auth Gateway: $AUTH_GW_VIOLATIONS React files"
echo "  • Total: $((ADMIN_DASH_VIOLATIONS + AUTH_GW_VIOLATIONS)) violations"

echo ""
echo "📦 Phase 2: Archiving Violating Files"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Archive admin-dashboard React violations
echo "Moving admin-dashboard violations..."
mkdir -p $ARCHIVE_DIR/admin-dashboard
find reconciliation/active-work/admin-dashboard/ \( -name "*.tsx" -o -name "*.jsx" \) \
    -not -path "*/node_modules/*" \
    -not -path "*/.next/*" \
    -exec grep -l "use client\|useState\|useEffect\|useContext\|useRouter" {} \; 2>/dev/null | \
    while read file; do
        relative_path=${file#reconciliation/active-work/admin-dashboard/}
        mkdir -p "$ARCHIVE_DIR/admin-dashboard/$(dirname "$relative_path")"
        mv "$file" "$ARCHIVE_DIR/admin-dashboard/$relative_path"
        echo "  ✓ Archived: $relative_path"
    done

# Archive auth-gateway React violations
echo "Moving auth-gateway violations..."
mkdir -p $ARCHIVE_DIR/auth-gateway
find reconciliation/active-work/auth-gateway/src/ \( -name "*.tsx" -o -name "*.jsx" \) \
    -not -path "*/node_modules/*" \
    -exec grep -l "use client\|useState\|useEffect\|useContext\|useRouter" {} \; 2>/dev/null | \
    while read file; do
        relative_path=${file#reconciliation/active-work/auth-gateway/}
        mkdir -p "$ARCHIVE_DIR/auth-gateway/$(dirname "$relative_path")"
        mv "$file" "$ARCHIVE_DIR/auth-gateway/$relative_path"
        echo "  ✓ Archived: $relative_path"
    done

echo ""
echo "📝 Phase 3: Documenting Cleanup"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Create cleanup log
cat > $ARCHIVE_DIR/CLEANUP-LOG.md << 'EOF'
---
session: "178"
type: "cleanup"
status: "completed"
created: "2025-09-05"
purpose: "Archive React violations from auth/dashboard areas"
topics: ["react", "cleanup", "auth", "dashboard"]
priority: "P0"
---

# Session 178: React Violations Cleanup Report

## Summary
This session archived all React client components from the auth and dashboard areas
to prepare for clean Server Component implementation using recipe patterns.

## Archived Files

### Admin Dashboard Violations:
EOF

echo "### Admin Dashboard Violations:" >> $ARCHIVE_DIR/CLEANUP-LOG.md
ls -la $ARCHIVE_DIR/admin-dashboard/ 2>/dev/null | tail -n +2 >> $ARCHIVE_DIR/CLEANUP-LOG.md || echo "None found" >> $ARCHIVE_DIR/CLEANUP-LOG.md

echo "" >> $ARCHIVE_DIR/CLEANUP-LOG.md
echo "### Auth Gateway Violations:" >> $ARCHIVE_DIR/CLEANUP-LOG.md
ls -la $ARCHIVE_DIR/auth-gateway/ 2>/dev/null | tail -n +2 >> $ARCHIVE_DIR/CLEANUP-LOG.md || echo "None found" >> $ARCHIVE_DIR/CLEANUP-LOG.md

echo "" >> $ARCHIVE_DIR/CLEANUP-LOG.md
echo "## Next Steps" >> $ARCHIVE_DIR/CLEANUP-LOG.md
echo "1. Implement clean auth flow using auth-form recipe" >> $ARCHIVE_DIR/CLEANUP-LOG.md
echo "2. Implement dashboard using dashboard-grid recipe" >> $ARCHIVE_DIR/CLEANUP-LOG.md
echo "3. Use role-selector pattern for role management" >> $ARCHIVE_DIR/CLEANUP-LOG.md
echo "4. All new components must be Server Components by default" >> $ARCHIVE_DIR/CLEANUP-LOG.md

echo ""
echo "✅ Phase 4: Verification"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Verify cleanup
echo "Remaining violations in admin-dashboard:"
REMAINING_ADMIN=$(grep -r "use client\|useState\|useEffect" reconciliation/active-work/admin-dashboard/ --include="*.tsx" --include="*.jsx" 2>/dev/null | grep -v node_modules | grep -v ".next" | wc -l || echo 0)
echo "  • Count: $REMAINING_ADMIN"

echo ""
echo "Remaining violations in auth-gateway:"
REMAINING_AUTH=$(grep -r "use client\|useState\|useEffect" reconciliation/active-work/auth-gateway/src/ --include="*.tsx" --include="*.jsx" 2>/dev/null | grep -v node_modules | wc -l || echo 0)
echo "  • Count: $REMAINING_AUTH"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📊 Success Metrics:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "1. Violations Found: $((ADMIN_DASH_VIOLATIONS + AUTH_GW_VIOLATIONS)) React files"
echo "2. Cleanup Complete: Moved to $ARCHIVE_DIR"
echo "3. Recipe Implementation: Ready to use auth-form, role-selector, dashboard-grid"
echo "4. Validation: $((REMAINING_ADMIN + REMAINING_AUTH)) violations remaining"

if [ $((REMAINING_ADMIN + REMAINING_AUTH)) -eq 0 ]; then
    echo ""
    echo "✅ SUCCESS: All React violations have been cleaned!"
else
    echo ""
    echo "⚠️  WARNING: Some violations remain. Manual review needed."
fi

echo ""
echo "📋 Archive location: $ARCHIVE_DIR"
echo "📋 Cleanup log: $ARCHIVE_DIR/CLEANUP-LOG.md"