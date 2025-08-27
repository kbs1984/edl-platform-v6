#!/bin/bash
echo "=== YAML ADOPTION VERIFICATION ==="
echo "Generated: $(date)"
echo ""
echo "1. Total markdown files (excluding node_modules):"
find . -name "*.md" -type f ! -path "./node_modules/*" ! -path "./.git/*" ! -path "*/node_modules/*" ! -path "*/.roo/*" 2>/dev/null | wc -l

echo ""
echo "2. Files with YAML frontmatter:"
find . -name "*.md" -type f ! -path "./node_modules/*" ! -path "./.git/*" ! -path "*/node_modules/*" ! -path "*/.roo/*" -exec head -1 {} \; 2>/dev/null | grep "^---" | wc -l

echo ""
echo "3. Coverage percentage:"
total=$(find . -name "*.md" -type f ! -path "./node_modules/*" ! -path "./.git/*" ! -path "*/node_modules/*" ! -path "*/.roo/*" 2>/dev/null | wc -l)
with_yaml=$(find . -name "*.md" -type f ! -path "./node_modules/*" ! -path "./.git/*" ! -path "*/node_modules/*" ! -path "*/.roo/*" -exec head -1 {} \; 2>/dev/null | grep "^---" | wc -l)
echo "scale=1; $with_yaml * 100 / $total" | bc
echo "%"

echo ""
echo "4. Session logs with YAML:"
logs_with=$(ls archive/sessions/SESSION-*.md 2>/dev/null | xargs grep -l "^---" 2>/dev/null | wc -l)
logs_total=$(ls archive/sessions/SESSION-*.md 2>/dev/null | wc -l)
echo "$logs_with of $logs_total"

echo ""
echo "5. Archive organization:"
echo "Phase 1 deliverables: $(ls archive/session-deliverables/phase-1/*.md 2>/dev/null | wc -l)"
echo "Phase 2 deliverables: $(ls archive/session-deliverables/phase-2/*.md 2>/dev/null | wc -l)"
echo "Phase 3 deliverables: $(ls archive/session-deliverables/phase-3/*.md 2>/dev/null | wc -l)"

echo ""
echo "6. Tools created by Sessions 62-64:"
echo "Session 62 tools: $(ls -1 scripts/00062-*.{sh,py} 2>/dev/null | wc -l)"
echo "Session 63 tools: $(ls -1 scripts/00063-*.{sh,py} 2>/dev/null | wc -l)"
echo "YAML infrastructure: $(ls -1 scripts/0005[89]-*.py scripts/00061-*.py 2>/dev/null | wc -l)"

echo ""
echo "7. Git verification:"
echo "Recent commits mentioning Sessions 62-64:"
git log --oneline -20 | grep -E "Session 6[234]|session 6[234]|00006[234]" | head -5

echo ""
echo "=== VERIFICATION COMPLETE ==="
