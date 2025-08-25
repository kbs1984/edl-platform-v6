#!/bin/bash
# Session 00069: YAML validation pre-commit hook
# Prevents commits with invalid YAML frontmatter

set -e

echo "🔍 YAML Pre-commit Validation Hook (Session 00069)"
echo "=================================================="

# Get list of staged markdown files
STAGED_FILES=$(git diff --cached --name-only --diff-filter=ACM | grep "\.md$" || true)

if [ -z "$STAGED_FILES" ]; then
    echo "✅ No markdown files to validate"
    exit 0
fi

echo "📋 Checking $(echo "$STAGED_FILES" | wc -l) staged markdown files..."

# Create temp file for validation results
TEMP_FILE=$(mktemp)
ERRORS_FOUND=0

# Check each staged file
for FILE in $STAGED_FILES; do
    # Skip if file doesn't exist (deleted)
    if [ ! -f "$FILE" ]; then
        continue
    fi
    
    # Check if file has YAML frontmatter
    if ! head -1 "$FILE" | grep -q "^---$"; then
        echo "⚠️  $FILE: Missing YAML frontmatter"
        echo "$FILE: Missing YAML frontmatter" >> "$TEMP_FILE"
        ERRORS_FOUND=$((ERRORS_FOUND + 1))
        continue
    fi
    
    # Extract YAML frontmatter (only between first two --- markers)
    YAML_CONTENT=$(head -50 "$FILE" | sed -n '/^---$/,/^---$/p' | sed '1d;$d')
    
    # Check for required fields using Python
    RESULT=$(echo "$YAML_CONTENT" | python3 -c "
import yaml
import sys

try:
    data = yaml.safe_load(sys.stdin.read())
    
    # Check required fields
    required = ['session', 'type', 'status', 'created']
    missing = [f for f in required if f not in data]
    
    if missing:
        print(f'Missing required fields: {missing}')
        sys.exit(1)
    
    # Check valid values
    valid_types = ['specification', 'guide', 'report', 'analysis', 'log', 
                   'script', 'config', 'template', 'handoff', 'protocol', 
                   'command', 'unknown']
    if data.get('type') not in valid_types:
        print(f'Invalid type: {data.get(\"type\")}')
        sys.exit(1)
    
    valid_status = ['current', 'draft', 'archived', 'superseded']
    if data.get('status') not in valid_status:
        print(f'Invalid status: {data.get(\"status\")}')
        sys.exit(1)
    
    print('OK')
except Exception as e:
    print(f'YAML parse error: {e}')
    sys.exit(1)
" 2>&1 || true)
    if [ "$RESULT" != "OK" ]; then
        echo "❌ $FILE: $RESULT"
        echo "$FILE: $RESULT" >> "$TEMP_FILE"
        ERRORS_FOUND=$((ERRORS_FOUND + 1))
    else
        echo "✅ $FILE"
    fi
done

echo ""
echo "=================================================="

# Check if we found any errors
if [ $ERRORS_FOUND -gt 0 ]; then
    echo "❌ Found $ERRORS_FOUND YAML validation errors!"
    echo ""
    echo "📋 Errors found:"
    cat "$TEMP_FILE"
    echo ""
    echo "🔧 To fix automatically, run:"
    echo "  python3 scripts/00068-fix-yaml-validation.py"
    echo ""
    echo "Or fix manually and stage the changes."
    rm "$TEMP_FILE"
    exit 1
else
    echo "✅ All YAML validation checks passed!"
    rm "$TEMP_FILE"
    exit 0
fi