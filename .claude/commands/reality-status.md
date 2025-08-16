---
allowed-tools: Bash(git status:*), Bash(cat 00013_REALITY-STATUS.md:*), Bash(python3 reality/agent-reality-auditor/supabase-connector/connector.py:*)
description: Show current reality status and detect discrepancies
---

# Reality Status Check

## Current System State
!`cat 00013_REALITY-STATUS.md 2>/dev/null || echo "No reality status file found"`

## Git Reality
```
!`git status --short | head -10`
```

## Database Reality Check
!`SUPABASE_URL="https://bbrheacetxlnqbibjwsz.supabase.co" SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJicmhlYWNldHhsbnFiaWJqd3N6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ3MjI4MTIsImV4cCI6MjA3MDI5ODgxMn0.fccLx-9NymP8oqHT_-t-ZPZx0hgi8SGfHUJv1WKmwFE" python3 -c "from supabase import create_client; client = create_client('https://bbrheacetxlnqbibjwsz.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJicmhlYWNldHhsbnFiaWJqd3N6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ3MjI4MTIsImV4cCI6MjA3MDI5ODgxMn0.fccLx-9NymP8oqHT_-t-ZPZx0hgi8SGfHUJv1WKmwFE'); tables = ['profiles', 'teams', 'team_members', 'team_join_requests']; [print(f'{t}: EXISTS') for t in tables if client.table(t).select('*', count='exact').execute()]" 2>/dev/null || echo "Database check failed"`

## Task
Analyze the above reality status and:
1. Identify any discrepancies between claimed state and actual state
2. Highlight uncommitted work that needs attention
3. Detect any conflicts between different reality sources
4. Provide actionable recommendations

Focus on truth over assumptions. If agents disagree, apply trust hierarchy: GitHub > FileSystem > Supabase > Vercel.