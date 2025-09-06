#!/bin/bash

echo "=== GITHUB OPERATIONS BENCHMARK ==="
echo "Date: $(date)"
echo "Location: $(pwd)"
echo ""

# Test multiple GitHub operations with timing
echo -e "\n1. PR List Operations (10 items):"
for i in {1..3}; do
    echo "Run $i:"
    time gh pr list --limit 10 2>&1 | head -5
    echo ""
done

echo -e "\n2. Issue List Operations (10 items):"
for i in {1..3}; do
    echo "Run $i:"
    time gh issue list --limit 10 2>&1 | head -5
    echo ""
done

echo -e "\n3. Repository View Operations (JSON):"
for i in {1..3}; do
    echo "Run $i:"
    time gh repo view --json name,description 2>&1
    echo ""
done

echo -e "\n4. Full Reality Agent Discovery (Level 3):"
for i in {1..2}; do
    echo "Run $i:"
    cd /home/b4sho/edl-projects-with-claude/edl-platform-v6/reality/agent-reality-auditor/github-connector
    time python3 connector.py --level 3 2>&1 | tail -5
    echo ""
done

echo -e "\n5. Branch List Operations:"
for i in {1..3}; do
    echo "Run $i:"
    time gh api repos/:owner/:repo/branches --paginate=false --jq '.[].name' 2>&1 | head -5
    echo ""
done

echo -e "\n6. Workflow/Actions Status:"
for i in {1..3}; do
    echo "Run $i:"
    time gh run list --limit 5 2>&1 | head -5
    echo ""
done

echo "=== BENCHMARK COMPLETE ===">