#!/bin/bash
# Rollback Script for Session 00066
# Generated: 2025-08-25T10:40:23.241764
# 
# This script will undo all file moves performed during reorganization

set -e  # Exit on error

echo "🔄 Starting rollback for Session 00066..."
echo "⚠️  This will undo all file reorganization. Continue? (y/n)"
read -r response
if [[ "$response" != "y" ]]; then
    echo "Rollback cancelled."
    exit 0
fi

# Rollback commands will be appended here

# Rollback: core/00065-FILE-ORGANIZATION-PROTOCOL.md → 00065-FILE-ORGANIZATION-PROTOCOL.md
if [ -f "core/00065-FILE-ORGANIZATION-PROTOCOL.md" ]; then
    git mv "core/00065-FILE-ORGANIZATION-PROTOCOL.md" "00065-FILE-ORGANIZATION-PROTOCOL.md"
    echo "✅ Rolled back: core/00065-FILE-ORGANIZATION-PROTOCOL.md → 00065-FILE-ORGANIZATION-PROTOCOL.md"
else
    echo "⚠️  File not found: core/00065-FILE-ORGANIZATION-PROTOCOL.md"
fi
