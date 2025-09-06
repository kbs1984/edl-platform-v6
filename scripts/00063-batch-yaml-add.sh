#!/bin/bash
# ---
# session: "00063"
# type: "script"
# status: "active"
# created: "2025-08-28"
# title: "00063-batch-yaml-add.sh"
# purpose: "Script for batch yaml add"
# language: "bash"
# category: "yaml"
# topics: ["yaml"]
# priority: "P2"
# domain: "core"
# ---

# 00063-batch-yaml-add.sh  
# Add YAML frontmatter to multiple directories at once
# Created: Session 00063
# Usage: ./scripts/00063-batch-yaml-add.sh [directory1] [directory2] ...

set -e

if [[ $# -eq 0 ]]; then
    echo "🧹 Batch YAML Addition v1.0"
    echo "=========================="
    echo "Usage: $0 <directory1> [directory2] ..."
    echo "Example: $0 docs migrations requirements/specs"
    exit 1
fi

echo "🧹 Batch YAML Addition v1.0"
echo "=========================="
echo "Adding YAML frontmatter to directories:"

TOTAL_UPDATED=0

for dir in "$@"; do
    if [[ ! -d "$dir" ]]; then
        echo "  ⚠️  SKIP: $dir (directory not found)"
        continue
    fi
    
    echo "  📂 Processing: $dir"
    
    # Use existing YAML add script
    result=$(python3 scripts/00061-add-yaml-frontmatter.py "*.md" --dir "$dir" --all 2>/dev/null | grep "Updated" | grep -o '[0-9]* files' || echo "0 files")
    updated_count=$(echo "$result" | grep -o '^[0-9]*' || echo "0")
    
    echo "    ✅ $result updated"
    TOTAL_UPDATED=$((TOTAL_UPDATED + updated_count))
done

echo
echo "📊 Summary: $TOTAL_UPDATED files updated across all directories"

# Show updated coverage
echo
echo "📈 Updated YAML Coverage:"
./scripts/00062-yaml-compliance-check.sh | grep "Overall Coverage"