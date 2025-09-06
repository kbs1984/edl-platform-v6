#!/bin/bash
# ---
# session: "00031"
# type: "script"
# status: "unknown"
# created: "2025-08-28"
# title: "00031-doc-maintenance-check.sh"
# purpose: "Script for doc maintenance check"
# language: "bash"
# category: "verification"
# topics: ["verification"]
# priority: "P2"
# domain: "core"
# ---
# Documentation Maintenance Check Tool
# Session 00031 - Ensures INDEX files and living docs are properly maintained

echo "📚 Documentation Maintenance Check"
echo "Session $(date '+%Y-%m-%d %H:%M')"
echo

# Check if key INDEX files have been updated recently
echo "🔍 INDEX File Update Status:"

check_file_age() {
    local file=$1
    local description=$2
    
    if [ -f "$file" ]; then
        local age_days=$(find "$file" -mtime +7 -print)
        if [ -z "$age_days" ]; then
            echo "  ✅ $description: Updated within 7 days"
        else
            echo "  ⚠️  $description: Last updated >7 days ago"
        fi
    else
        echo "  ❌ $description: FILE MISSING"
    fi
}

check_file_age "SYSTEM-INDEX.md" "System Index"
check_file_age "requirements/REQUIREMENTS_INDEX.md" "Requirements Index"
check_file_age "reality/REALITY_INDEX.md" "Reality Index"
check_file_age "CLAUDE.md" "Session Protocol"

echo
echo "🔄 Living Documentation Status:"
check_file_age "00031-WORKFLOW-BOUNDARIES.md" "Workflow Boundaries"
check_file_age "00031-MANUAL-INTERVENTION-PROTOCOL.md" "Manual Protocol"

echo
echo "📊 Recent Documentation Activity:"
# Show recent changes to key docs
git log --oneline --since="7 days ago" -- "*.md" "*INDEX*" | head -5

echo
echo "💡 Maintenance Reminders:"
echo "  - Update SYSTEM-INDEX.md when adding tools or major changes"
echo "  - Update domain INDEX files when working in specific domains"
echo "  - Version bump 00031-WORKFLOW-BOUNDARIES.md if capabilities change"
echo "  - Add session references with brief descriptions"

echo
echo "📋 Quick INDEX Update Template:"
echo "- **Session 00XXX**: Brief description of changes"