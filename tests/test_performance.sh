#!/bin/bash
echo "=== Independent Performance Verification ==="
echo "Time: $(date)"
echo ""

echo "1. GitHub Auth Check (3 runs):"
for i in {1..3}; do
    echo -n "  Run $i: "
    time -p gh auth status 2>&1 | grep -q "Logged in" 2>&1
done

echo -e "\n2. PR List - 5 items (3 runs):"
for i in {1..3}; do
    echo -n "  Run $i: "
    time -p gh pr list --limit 5 2>&1 | wc -l 2>&1
done

echo -e "\n3. Issue List - 10 items (3 runs):"
for i in {1..3}; do
    echo -n "  Run $i: "
    time -p gh issue list --limit 10 2>&1 | wc -l 2>&1
done

echo -e "\n4. Repository Info (3 runs):"
for i in {1..3}; do
    echo -n "  Run $i: "
    time -p gh repo view --json name,description 2>&1 | grep -q "name" 2>&1
done

echo -e "\n5. Workflow Status (3 runs):"
for i in {1..3}; do
    echo -n "  Run $i: "
    time -p gh run list --limit 5 2>&1 | wc -l 2>&1
done
