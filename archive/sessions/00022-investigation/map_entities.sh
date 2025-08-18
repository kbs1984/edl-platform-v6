#!/bin/bash

for entity in Teams Activities Players Messages Enablers Resources Supervisors emCoins Badges; do
  echo ""
  echo "Entity: $entity"
  
  # Count mentions
  count=0
  for file in ../requirements/user-stories/*.md; do
    if [ -f "$file" ]; then
      file_count=$(grep -ci "$entity" "$file" 2>/dev/null || echo 0)
      count=$((count + file_count))
    fi
  done
  echo "  Total mentions in stories: $count"
  
  # Count files
  files=0
  for file in ../requirements/user-stories/*.md; do
    if [ -f "$file" ]; then
      if grep -qi "$entity" "$file" 2>/dev/null; then
        files=$((files + 1))
      fi
    fi
  done
  echo "  Found in $files story files"
done
