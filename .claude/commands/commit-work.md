---
allowed-tools: Bash(git status:*), Bash(git add:*), Bash(git commit:*), Bash(git diff:*)
description: Intelligently commit current work with proper attribution
---

# Commit Current Work

## Current Changes
!`git status --short`

## Detailed Diff (First 100 lines)
!`git diff HEAD | head -100`

## Task
Based on the changes above:
1. Group related changes logically
2. Create descriptive commit message following conventional commits
3. Include session attribution
4. Commit the work

If there are many unrelated changes, suggest splitting into multiple commits.

Commit message should follow format:
```
<type>(<scope>): <description>

- Detail 1
- Detail 2

Session: <session-number>
```

$ARGUMENTS