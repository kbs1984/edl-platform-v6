#!/bin/bash

# Session 00029: Reconciliation Bridge Orchestrator
# Part of Truth Operating System (TOS) v1.0
# Purpose: Bridge Requirements and Reality domains to find gaps and generate plans

set -e

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo "╔══════════════════════════════════════════════════════════╗"
echo "║        Reconciliation Bridge v1.0 - TOS Component         ║"
echo "╚══════════════════════════════════════════════════════════╝"
echo ""
echo "Bridging Requirements ↔ Reality domains..."
echo "Timestamp: $(date '+%Y-%m-%d %H:%M:%S')"
echo ""

# Function to check prerequisites
check_prerequisites() {
    local prereqs_met=true
    
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "Checking Prerequisites"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    
    # Check for Reality state
    if [ -f "/tmp/parsed-reality.json" ]; then
        echo -e "  ${GREEN}✓${NC} Reality state found"
    else
        echo -e "  ${RED}✗${NC} Reality state missing - run ./scripts/00028-reality-check.sh"
        prereqs_met=false
    fi
    
    # Check for Requirements state  
    if [ -f "/tmp/requirements/state.json" ]; then
        echo -e "  ${GREEN}✓${NC} Requirements state found"
    else
        echo -e "  ${YELLOW}⚠${NC} Requirements state missing - will generate"
    fi
    
    echo ""
    
    if [ "$prereqs_met" = false ]; then
        echo -e "${RED}❌ Prerequisites not met. Please run Reality check first.${NC}"
        exit 1
    fi
}

# Function to run requirements check if needed
ensure_requirements() {
    if [ ! -f "/tmp/requirements/state.json" ]; then
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        echo "Step 1/4: Extracting Requirements State"
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        
        if ./scripts/00029-requirements-check.sh > /tmp/requirements-check.log 2>&1; then
            echo -e "  ${GREEN}✓${NC} Requirements extracted successfully"
        else
            echo -e "  ${RED}✗${NC} Requirements extraction failed"
            cat /tmp/requirements-check.log
            exit 1
        fi
    else
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        echo "Step 1/4: Requirements State Available"
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        echo -e "  ${GREEN}✓${NC} Using existing Requirements state"
    fi
    echo ""
}

# Function to run gap analysis
run_gap_analysis() {
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "Step 2/4: Analyzing Gaps"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    
    if python3 scripts/00029-gap-analyzer.py > /tmp/gap-analysis.log 2>&1; then
        echo -e "  ${GREEN}✓${NC} Gap analysis complete"
        
        # Extract key metrics
        if [ -f "/tmp/reconciliation/gaps.json" ]; then
            complete=$(grep -oP '"complete": \K\d+' /tmp/reconciliation/gaps.json | head -1)
            partial=$(grep -oP '"partial": \K\d+' /tmp/reconciliation/gaps.json | head -1)
            not_started=$(grep -oP '"not_started": \K\d+' /tmp/reconciliation/gaps.json | head -1)
            
            echo "  📊 Gaps found:"
            echo "     Complete: $complete features"
            echo "     Partial: $partial features"
            echo "     Not Started: $not_started features"
        fi
    else
        echo -e "  ${RED}✗${NC} Gap analysis failed"
        cat /tmp/gap-analysis.log
        exit 1
    fi
    echo ""
}

# Function to generate action plan
generate_action_plan() {
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "Step 3/4: Generating Action Plan"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    
    if python3 scripts/00029-action-planner.py > /tmp/action-plan.log 2>&1; then
        echo -e "  ${GREEN}✓${NC} Action plan generated"
        
        # Extract key metrics
        if [ -f "/tmp/reconciliation/action-plan.json" ]; then
            immediate=$(grep -oP '"actions_immediate": \K\d+' /tmp/reconciliation/action-plan.json)
            hours=$(grep -oP '"total_effort_hours": \K[\d.]+' /tmp/reconciliation/action-plan.json)
            sessions=$(grep -oP '"total_sessions_needed": \K\d+' /tmp/reconciliation/action-plan.json)
            
            echo "  📋 Plan summary:"
            echo "     Immediate actions: $immediate"
            echo "     Total effort: $hours hours"
            echo "     Sessions needed: $sessions"
        fi
    else
        echo -e "  ${RED}✗${NC} Action plan generation failed"
        cat /tmp/action-plan.log
        exit 1
    fi
    echo ""
}

# Function to generate summary report
generate_summary() {
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "Step 4/4: Generating Reconciliation Report"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    
    report_file="/tmp/reconciliation-report-$(date +%Y%m%d-%H%M%S).md"
    
    cat > "$report_file" << EOF
# Reconciliation Report
**Generated**: $(date -Iseconds)
**System**: Truth Operating System v1.0

## Domain Status

### Requirements Domain
$(if [ -f /tmp/requirements/state.json ]; then
    echo "- Completeness: $(grep -oP '"completeness": \K\d+' /tmp/requirements/state.json)%"
    echo "- Total Stories: $(grep -oP '"total": \K\d+' /tmp/requirements/state.json)"
    echo "- P0 Stories: $(grep -oP '"P0": \K\d+' /tmp/requirements/state.json)"
fi)

### Reality Domain  
$(if [ -f /tmp/parsed-reality.json ]; then
    echo "- System Health: $(grep -oP '"overall_health": \K[\d.]+' /tmp/parsed-reality.json)%"
    echo "- Healthy Agents: $(grep -oP '"healthy_agents": \K\d+' /tmp/parsed-reality.json)"
fi)

## Gap Analysis

$(if [ -f /tmp/reconciliation/gaps.json ]; then
    echo "- Complete: $(grep -oP '"complete": \K\d+' /tmp/reconciliation/gaps.json | head -1) features"
    echo "- Partial: $(grep -oP '"partial": \K\d+' /tmp/reconciliation/gaps.json | head -1) features"
    echo "- Not Started: $(grep -oP '"not_started": \K\d+' /tmp/reconciliation/gaps.json | head -1) features"
    echo "- Ready to Build: $(grep -oP '"ready_to_build": \K\d+' /tmp/reconciliation/gaps.json | head -1) features"
fi)

## Action Plan

$(if [ -f /tmp/reconciliation/action-plan.json ]; then
    echo "- Immediate Actions: $(grep -oP '"actions_immediate": \K\d+' /tmp/reconciliation/action-plan.json)"
    echo "- Total Effort: $(grep -oP '"total_effort_hours": \K[\d.]+' /tmp/reconciliation/action-plan.json) hours"
    echo "- Sessions Needed: $(grep -oP '"total_sessions_needed": \K\d+' /tmp/reconciliation/action-plan.json)"
fi)

## Next Steps

1. Review gap analysis in detail: \`/tmp/reconciliation/gaps.json\`
2. Follow action plan: \`/tmp/reconciliation/action-plan.json\`
3. Begin with immediate priority items
4. Track progress using TOS orchestrator

---
*Generated by Reconciliation Bridge v1.0*
EOF
    
    echo -e "  ${GREEN}✓${NC} Report generated: $report_file"
    echo ""
}

# Function to display final summary
display_summary() {
    echo "╔══════════════════════════════════════════════════════════╗"
    echo "║              RECONCILIATION COMPLETE                      ║"
    echo "╚══════════════════════════════════════════════════════════╝"
    echo ""
    
    # Calculate execution time
    end_time=$(date +%s)
    execution_time=$((end_time - start_time))
    
    echo "📊 Reconciliation Summary:"
    echo "   Requirements ↔ Reality bridged successfully"
    echo "   Gaps identified and analyzed"
    echo "   Action plan generated"
    echo ""
    
    echo "📁 Generated Files:"
    echo "   • Requirements: /tmp/requirements/state.json"
    echo "   • Gaps: /tmp/reconciliation/gaps.json"
    echo "   • Action Plan: /tmp/reconciliation/action-plan.json"
    echo "   • Report: /tmp/reconciliation-report-*.md"
    echo ""
    
    echo "⏱️  Execution Time: ${execution_time} seconds"
    echo ""
    
    echo "💡 Next Command:"
    echo "   ./scripts/00029-tos-orchestrator.sh"
    echo ""
    echo "✨ Reconciliation Bridge ready for TOS integration!"
}

# Main execution
start_time=$(date +%s)

# Run reconciliation pipeline
check_prerequisites
ensure_requirements
run_gap_analysis
generate_action_plan
generate_summary
display_summary

exit 0