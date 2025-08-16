---
allowed-tools: Write, Bash(python3:*), Bash(git status:*), Bash(date:*)
description: Update reality status file with current truth
---

# Update Reality Status

## Current Database State
!`SUPABASE_URL="https://bbrheacetxlnqbibjwsz.supabase.co" SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJicmhlYWNldHhsbnFiaWJqd3N6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ3MjI4MTIsImV4cCI6MjA3MDI5ODgxMn0.fccLx-9NymP8oqHT_-t-ZPZx0hgi8SGfHUJv1WKmwFE" python3 -c "
from supabase import create_client
client = create_client('https://bbrheacetxlnqbibjwsz.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJicmhlYWNldHhsbnFiaWJqd3N6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ3MjI4MTIsImV4cCI6MjA3MDI5ODgxMn0.fccLx-9NymP8oqHT_-t-ZPZx0hgi8SGfHUJv1WKmwFE')
tables = ['profiles', 'teams', 'team_members', 'team_join_requests']
for t in tables:
    try:
        r = client.table(t).select('*', count='exact').execute()
        print(f'{t}: {len(r.data)} rows')
    except Exception as e:
        print(f'{t}: ERROR - {str(e)[:50]}')
"`

## Git Status
!`git status --short | wc -l` uncommitted files

## Agent Consensus
!`cat .metrics/reality-check-latest.json 2>/dev/null | grep consensus_score || echo "No recent check"`

## Current Time
!`date '+%Y-%m-%d %H:%M'`

## Task
Update the 00013_REALITY-STATUS.md file with:
1. Current database reality (tables, row counts)
2. Version control status (uncommitted work)
3. Agent health scores
4. Any detected discrepancies
5. Recommendations for next session

Preserve the structured format but update all data to reflect current truth.

$ARGUMENTS