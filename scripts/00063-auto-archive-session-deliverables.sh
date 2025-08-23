#!/bin/bash

# 00063-auto-archive-session-deliverables.sh
# Automatically archive new session deliverables to appropriate phase directories
# Created: Session 00063
# Usage: ./scripts/00063-auto-archive-session-deliverables.sh [--dry-run]

set -e

DRY_RUN=false
if [[ "$1" == "--dry-run" ]]; then
    DRY_RUN=true
    echo "🔍 DRY RUN MODE - No files will be moved"
fi

echo "🗂️  Auto-Archive Session Deliverables v1.0"
echo "========================================"

# Ensure archive structure exists
mkdir -p archive/session-deliverables/{phase-1,phase-2,phase-3}

# Define files that should NEVER be archived (stay in root)
KEEP_IN_ROOT=(
    "00031-CONSTITUTIONAL-OS-GUIDE.md"
    "00031-WORKFLOW-BOUNDARIES.md" 
    "00042-TRUTH-SEED-ADOPTION-DECISION.md"
)

echo "📋 Files that stay in root:"
for file in "${KEEP_IN_ROOT[@]}"; do
    echo "  ✅ $file"
done
echo

# Find all session deliverable files in root (00XXX-*.md)
SESSION_FILES=($(find . -maxdepth 1 -name "00[0-9][0-9][0-9]-*.md" | sed 's|^\./||' | sort))

if [[ ${#SESSION_FILES[@]} -eq 0 ]]; then
    echo "✅ No session deliverables found in root directory"
    exit 0
fi

echo "📦 Session deliverables found in root:"
for file in "${SESSION_FILES[@]}"; do
    echo "  📄 $file"
done
echo

# Function to check if file should stay in root
should_keep_in_root() {
    local file=$1
    for keep_file in "${KEEP_IN_ROOT[@]}"; do
        if [[ "$file" == "$keep_file" ]]; then
            return 0
        fi
    done
    return 1
}

# Function to determine phase based on session number
get_phase() {
    local file=$1
    local session_num=$(echo "$file" | grep -o '^00[0-9][0-9][0-9]' | sed 's/^0*//')
    
    if [[ $session_num -le 30 ]]; then
        echo "phase-1"
    elif [[ $session_num -le 50 ]]; then
        echo "phase-2"
    else
        echo "phase-3"
    fi
}

# Process each file
MOVED_COUNT=0
KEPT_COUNT=0
SKIPPED_COUNT=0

for file in "${SESSION_FILES[@]}"; do
    if should_keep_in_root "$file"; then
        echo "  📌 KEEP: $file (critical guide)"
        ((KEPT_COUNT++))
        continue
    fi
    
    phase=$(get_phase "$file")
    destination="archive/session-deliverables/$phase/$file"
    
    if [[ -f "$destination" ]]; then
        echo "  ⚠️  SKIP: $file (already archived)"
        ((SKIPPED_COUNT++))
        continue
    fi
    
    if [[ "$DRY_RUN" == "true" ]]; then
        echo "  🔄 WOULD MOVE: $file → $phase/"
    else
        mv "$file" "archive/session-deliverables/$phase/"
        echo "  ✅ MOVED: $file → $phase/"
    fi
    ((MOVED_COUNT++))
done

echo
echo "📊 Summary:"
echo "  Moved: $MOVED_COUNT files"
echo "  Kept in root: $KEPT_COUNT files"
echo "  Skipped (already archived): $SKIPPED_COUNT files"
echo

if [[ "$DRY_RUN" == "false" && $MOVED_COUNT -gt 0 ]]; then
    echo "🎯 Archive structure updated successfully!"
    echo "📂 Current archive status:"
    echo "  Phase 1 (01-30): $(ls archive/session-deliverables/phase-1/ | wc -l) files"
    echo "  Phase 2 (31-50): $(ls archive/session-deliverables/phase-2/ | wc -l) files" 
    echo "  Phase 3 (51+):   $(ls archive/session-deliverables/phase-3/ | wc -l) files"
fi

echo "✨ Auto-archive complete!"