---
allowed-tools: Bash(python3 reality/agent-reality-auditor/*/connector.py:*)
description: Run all Reality Agents and generate comprehensive report
---

# Run All Reality Agents

## FileSystem Agent
!`python3 reality/agent-reality-auditor/filesystem-connector/connector.py 2>&1 | grep -E "status|confidence|discoveries" | head -5`

## GitHub Agent  
!`python3 reality/agent-reality-auditor/github-connector/connector.py 2>&1 | grep -E "status|confidence" | head -5`

## Supabase Agent
!`SUPABASE_URL="https://bbrheacetxlnqbibjwsz.supabase.co" SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJicmhlYWNldHhsbnFiaWJqd3N6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ3MjI4MTIsImV4cCI6MjA3MDI5ODgxMn0.fccLx-9NymP8oqHT_-t-ZPZx0hgi8SGfHUJv1WKmwFE" python3 reality/agent-reality-auditor/supabase-connector/connector.py --level 2 2>&1 | grep -E "tables|status|confidence" | head -5`

## Integration Agent
!`python3 reality/agent-reality-auditor/integration-connector/connector.py 2>&1 | grep -E "HEALTH|Consensus|Critical" | head -10`

## Task
Analyze all agent reports and:
1. Calculate overall consensus score
2. Identify any conflicts between agents
3. Apply trust hierarchy to resolve conflicts (GitHub > FileSystem > Supabase > Vercel)
4. Generate actionable recommendations
5. Determine if system is ready for development

$ARGUMENTS