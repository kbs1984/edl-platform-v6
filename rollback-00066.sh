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

# Rollback: core/00021-system-understanding-report.md → archive/session-deliverables/phase-1/00021-system-understanding-report.md
if [ -f "core/00021-system-understanding-report.md" ]; then
    git mv "core/00021-system-understanding-report.md" "archive/session-deliverables/phase-1/00021-system-understanding-report.md"
    echo "✅ Rolled back: core/00021-system-understanding-report.md → archive/session-deliverables/phase-1/00021-system-understanding-report.md"
else
    echo "⚠️  File not found: core/00021-system-understanding-report.md"
fi

# Rollback: core/00022-scripts-inventory.md → archive/session-deliverables/phase-1/00022-scripts-inventory.md
if [ -f "core/00022-scripts-inventory.md" ]; then
    git mv "core/00022-scripts-inventory.md" "archive/session-deliverables/phase-1/00022-scripts-inventory.md"
    echo "✅ Rolled back: core/00022-scripts-inventory.md → archive/session-deliverables/phase-1/00022-scripts-inventory.md"
else
    echo "⚠️  File not found: core/00022-scripts-inventory.md"
fi

# Rollback: core/00024-CRITICAL-DISCOVERY-SUCCESS.md → archive/session-deliverables/phase-1/00024-CRITICAL-DISCOVERY-SUCCESS.md
if [ -f "core/00024-CRITICAL-DISCOVERY-SUCCESS.md" ]; then
    git mv "core/00024-CRITICAL-DISCOVERY-SUCCESS.md" "archive/session-deliverables/phase-1/00024-CRITICAL-DISCOVERY-SUCCESS.md"
    echo "✅ Rolled back: core/00024-CRITICAL-DISCOVERY-SUCCESS.md → archive/session-deliverables/phase-1/00024-CRITICAL-DISCOVERY-SUCCESS.md"
else
    echo "⚠️  File not found: core/00024-CRITICAL-DISCOVERY-SUCCESS.md"
fi

# Rollback: core/00027-constitutional-remediation-plan.md → archive/session-deliverables/phase-1/00027-constitutional-remediation-plan.md
if [ -f "core/00027-constitutional-remediation-plan.md" ]; then
    git mv "core/00027-constitutional-remediation-plan.md" "archive/session-deliverables/phase-1/00027-constitutional-remediation-plan.md"
    echo "✅ Rolled back: core/00027-constitutional-remediation-plan.md → archive/session-deliverables/phase-1/00027-constitutional-remediation-plan.md"
else
    echo "⚠️  File not found: core/00027-constitutional-remediation-plan.md"
fi

# Rollback: core/00027-session-28-reading-list.md → archive/session-deliverables/phase-1/00027-session-28-reading-list.md
if [ -f "core/00027-session-28-reading-list.md" ]; then
    git mv "core/00027-session-28-reading-list.md" "archive/session-deliverables/phase-1/00027-session-28-reading-list.md"
    echo "✅ Rolled back: core/00027-session-28-reading-list.md → archive/session-deliverables/phase-1/00027-session-28-reading-list.md"
else
    echo "⚠️  File not found: core/00027-session-28-reading-list.md"
fi

# Rollback: core/00030-TOS-ARCHITECTURE.md → archive/session-deliverables/phase-1/00030-TOS-ARCHITECTURE.md
if [ -f "core/00030-TOS-ARCHITECTURE.md" ]; then
    git mv "core/00030-TOS-ARCHITECTURE.md" "archive/session-deliverables/phase-1/00030-TOS-ARCHITECTURE.md"
    echo "✅ Rolled back: core/00030-TOS-ARCHITECTURE.md → archive/session-deliverables/phase-1/00030-TOS-ARCHITECTURE.md"
else
    echo "⚠️  File not found: core/00030-TOS-ARCHITECTURE.md"
fi

# Rollback: core/00031-PHASE-GROW-GUIDE.md → archive/session-deliverables/phase-2/00031-PHASE-GROW-GUIDE.md
if [ -f "core/00031-PHASE-GROW-GUIDE.md" ]; then
    git mv "core/00031-PHASE-GROW-GUIDE.md" "archive/session-deliverables/phase-2/00031-PHASE-GROW-GUIDE.md"
    echo "✅ Rolled back: core/00031-PHASE-GROW-GUIDE.md → archive/session-deliverables/phase-2/00031-PHASE-GROW-GUIDE.md"
else
    echo "⚠️  File not found: core/00031-PHASE-GROW-GUIDE.md"
fi

# Rollback: core/00034-00035-TRUTH-LAYER-SETUP.md → archive/session-deliverables/phase-2/00034-00035-TRUTH-LAYER-SETUP.md
if [ -f "core/00034-00035-TRUTH-LAYER-SETUP.md" ]; then
    git mv "core/00034-00035-TRUTH-LAYER-SETUP.md" "archive/session-deliverables/phase-2/00034-00035-TRUTH-LAYER-SETUP.md"
    echo "✅ Rolled back: core/00034-00035-TRUTH-LAYER-SETUP.md → archive/session-deliverables/phase-2/00034-00035-TRUTH-LAYER-SETUP.md"
else
    echo "⚠️  File not found: core/00034-00035-TRUTH-LAYER-SETUP.md"
fi

# Rollback: core/00031-PHASE-HARVEST-GUIDE.md → archive/session-deliverables/phase-2/00031-PHASE-HARVEST-GUIDE.md
if [ -f "core/00031-PHASE-HARVEST-GUIDE.md" ]; then
    git mv "core/00031-PHASE-HARVEST-GUIDE.md" "archive/session-deliverables/phase-2/00031-PHASE-HARVEST-GUIDE.md"
    echo "✅ Rolled back: core/00031-PHASE-HARVEST-GUIDE.md → archive/session-deliverables/phase-2/00031-PHASE-HARVEST-GUIDE.md"
else
    echo "⚠️  File not found: core/00031-PHASE-HARVEST-GUIDE.md"
fi

# Rollback: core/00044-PROFILE-FIX-SUCCESS-REPORT.md → archive/session-deliverables/phase-2/00044-PROFILE-FIX-SUCCESS-REPORT.md
if [ -f "core/00044-PROFILE-FIX-SUCCESS-REPORT.md" ]; then
    git mv "core/00044-PROFILE-FIX-SUCCESS-REPORT.md" "archive/session-deliverables/phase-2/00044-PROFILE-FIX-SUCCESS-REPORT.md"
    echo "✅ Rolled back: core/00044-PROFILE-FIX-SUCCESS-REPORT.md → archive/session-deliverables/phase-2/00044-PROFILE-FIX-SUCCESS-REPORT.md"
else
    echo "⚠️  File not found: core/00044-PROFILE-FIX-SUCCESS-REPORT.md"
fi

# Rollback: core/00031-PHASE-SEED-GUIDE.md → archive/session-deliverables/phase-2/00031-PHASE-SEED-GUIDE.md
if [ -f "core/00031-PHASE-SEED-GUIDE.md" ]; then
    git mv "core/00031-PHASE-SEED-GUIDE.md" "archive/session-deliverables/phase-2/00031-PHASE-SEED-GUIDE.md"
    echo "✅ Rolled back: core/00031-PHASE-SEED-GUIDE.md → archive/session-deliverables/phase-2/00031-PHASE-SEED-GUIDE.md"
else
    echo "⚠️  File not found: core/00031-PHASE-SEED-GUIDE.md"
fi

# Rollback: core/00044-TEST-AUTH-FLOW-GUIDE.md → archive/session-deliverables/phase-2/00044-TEST-AUTH-FLOW-GUIDE.md
if [ -f "core/00044-TEST-AUTH-FLOW-GUIDE.md" ]; then
    git mv "core/00044-TEST-AUTH-FLOW-GUIDE.md" "archive/session-deliverables/phase-2/00044-TEST-AUTH-FLOW-GUIDE.md"
    echo "✅ Rolled back: core/00044-TEST-AUTH-FLOW-GUIDE.md → archive/session-deliverables/phase-2/00044-TEST-AUTH-FLOW-GUIDE.md"
else
    echo "⚠️  File not found: core/00044-TEST-AUTH-FLOW-GUIDE.md"
fi

# Rollback: core/00036-auth-integration-test.md → archive/session-deliverables/phase-2/00036-auth-integration-test.md
if [ -f "core/00036-auth-integration-test.md" ]; then
    git mv "core/00036-auth-integration-test.md" "archive/session-deliverables/phase-2/00036-auth-integration-test.md"
    echo "✅ Rolled back: core/00036-auth-integration-test.md → archive/session-deliverables/phase-2/00036-auth-integration-test.md"
else
    echo "⚠️  File not found: core/00036-auth-integration-test.md"
fi

# Rollback: core/00044-CURRENT-TEST-STATUS.md → archive/session-deliverables/phase-2/00044-CURRENT-TEST-STATUS.md
if [ -f "core/00044-CURRENT-TEST-STATUS.md" ]; then
    git mv "core/00044-CURRENT-TEST-STATUS.md" "archive/session-deliverables/phase-2/00044-CURRENT-TEST-STATUS.md"
    echo "✅ Rolled back: core/00044-CURRENT-TEST-STATUS.md → archive/session-deliverables/phase-2/00044-CURRENT-TEST-STATUS.md"
else
    echo "⚠️  File not found: core/00044-CURRENT-TEST-STATUS.md"
fi

# Rollback: core/00031-MANUAL-INTERVENTION-PROTOCOL.md → archive/session-deliverables/phase-2/00031-MANUAL-INTERVENTION-PROTOCOL.md
if [ -f "core/00031-MANUAL-INTERVENTION-PROTOCOL.md" ]; then
    git mv "core/00031-MANUAL-INTERVENTION-PROTOCOL.md" "archive/session-deliverables/phase-2/00031-MANUAL-INTERVENTION-PROTOCOL.md"
    echo "✅ Rolled back: core/00031-MANUAL-INTERVENTION-PROTOCOL.md → archive/session-deliverables/phase-2/00031-MANUAL-INTERVENTION-PROTOCOL.md"
else
    echo "⚠️  File not found: core/00031-MANUAL-INTERVENTION-PROTOCOL.md"
fi

# Rollback: core/00032-DASHBOARD-USAGE.md → archive/session-deliverables/phase-2/00032-DASHBOARD-USAGE.md
if [ -f "core/00032-DASHBOARD-USAGE.md" ]; then
    git mv "core/00032-DASHBOARD-USAGE.md" "archive/session-deliverables/phase-2/00032-DASHBOARD-USAGE.md"
    echo "✅ Rolled back: core/00032-DASHBOARD-USAGE.md → archive/session-deliverables/phase-2/00032-DASHBOARD-USAGE.md"
else
    echo "⚠️  File not found: core/00032-DASHBOARD-USAGE.md"
fi

# Rollback: core/00044-CRITICAL-MIGRATION-GAP-REPORT.md → archive/session-deliverables/phase-2/00044-CRITICAL-MIGRATION-GAP-REPORT.md
if [ -f "core/00044-CRITICAL-MIGRATION-GAP-REPORT.md" ]; then
    git mv "core/00044-CRITICAL-MIGRATION-GAP-REPORT.md" "archive/session-deliverables/phase-2/00044-CRITICAL-MIGRATION-GAP-REPORT.md"
    echo "✅ Rolled back: core/00044-CRITICAL-MIGRATION-GAP-REPORT.md → archive/session-deliverables/phase-2/00044-CRITICAL-MIGRATION-GAP-REPORT.md"
else
    echo "⚠️  File not found: core/00044-CRITICAL-MIGRATION-GAP-REPORT.md"
fi

# Rollback: core/00033-CONSTITUTIONAL-ADHERENCE-CHECKLIST.md → archive/session-deliverables/phase-2/00033-CONSTITUTIONAL-ADHERENCE-CHECKLIST.md
if [ -f "core/00033-CONSTITUTIONAL-ADHERENCE-CHECKLIST.md" ]; then
    git mv "core/00033-CONSTITUTIONAL-ADHERENCE-CHECKLIST.md" "archive/session-deliverables/phase-2/00033-CONSTITUTIONAL-ADHERENCE-CHECKLIST.md"
    echo "✅ Rolled back: core/00033-CONSTITUTIONAL-ADHERENCE-CHECKLIST.md → archive/session-deliverables/phase-2/00033-CONSTITUTIONAL-ADHERENCE-CHECKLIST.md"
else
    echo "⚠️  File not found: core/00033-CONSTITUTIONAL-ADHERENCE-CHECKLIST.md"
fi

# Rollback: core/00033-CONSTITUTIONAL-GUARDIAN-LOG.md → archive/session-deliverables/phase-2/00033-CONSTITUTIONAL-GUARDIAN-LOG.md
if [ -f "core/00033-CONSTITUTIONAL-GUARDIAN-LOG.md" ]; then
    git mv "core/00033-CONSTITUTIONAL-GUARDIAN-LOG.md" "archive/session-deliverables/phase-2/00033-CONSTITUTIONAL-GUARDIAN-LOG.md"
    echo "✅ Rolled back: core/00033-CONSTITUTIONAL-GUARDIAN-LOG.md → archive/session-deliverables/phase-2/00033-CONSTITUTIONAL-GUARDIAN-LOG.md"
else
    echo "⚠️  File not found: core/00033-CONSTITUTIONAL-GUARDIAN-LOG.md"
fi

# Rollback: core/00046-MIGRATION-STATUS-GUIDE.md → archive/session-deliverables/phase-2/00046-MIGRATION-STATUS-GUIDE.md
if [ -f "core/00046-MIGRATION-STATUS-GUIDE.md" ]; then
    git mv "core/00046-MIGRATION-STATUS-GUIDE.md" "archive/session-deliverables/phase-2/00046-MIGRATION-STATUS-GUIDE.md"
    echo "✅ Rolled back: core/00046-MIGRATION-STATUS-GUIDE.md → archive/session-deliverables/phase-2/00046-MIGRATION-STATUS-GUIDE.md"
else
    echo "⚠️  File not found: core/00046-MIGRATION-STATUS-GUIDE.md"
fi

# Rollback: core/00044-BUSINESS-LOGIC-INVESTIGATION-PLAN.md → archive/session-deliverables/phase-2/00044-BUSINESS-LOGIC-INVESTIGATION-PLAN.md
if [ -f "core/00044-BUSINESS-LOGIC-INVESTIGATION-PLAN.md" ]; then
    git mv "core/00044-BUSINESS-LOGIC-INVESTIGATION-PLAN.md" "archive/session-deliverables/phase-2/00044-BUSINESS-LOGIC-INVESTIGATION-PLAN.md"
    echo "✅ Rolled back: core/00044-BUSINESS-LOGIC-INVESTIGATION-PLAN.md → archive/session-deliverables/phase-2/00044-BUSINESS-LOGIC-INVESTIGATION-PLAN.md"
else
    echo "⚠️  File not found: core/00044-BUSINESS-LOGIC-INVESTIGATION-PLAN.md"
fi

# Rollback: core/00034-00035-TRUTH-API-SPECIFICATION.md → archive/session-deliverables/phase-2/00034-00035-TRUTH-API-SPECIFICATION.md
if [ -f "core/00034-00035-TRUTH-API-SPECIFICATION.md" ]; then
    git mv "core/00034-00035-TRUTH-API-SPECIFICATION.md" "archive/session-deliverables/phase-2/00034-00035-TRUTH-API-SPECIFICATION.md"
    echo "✅ Rolled back: core/00034-00035-TRUTH-API-SPECIFICATION.md → archive/session-deliverables/phase-2/00034-00035-TRUTH-API-SPECIFICATION.md"
else
    echo "⚠️  File not found: core/00034-00035-TRUTH-API-SPECIFICATION.md"
fi

# Rollback: core/00031-MANUAL-TESTING-CHECKLIST.md → archive/session-deliverables/phase-2/00031-MANUAL-TESTING-CHECKLIST.md
if [ -f "core/00031-MANUAL-TESTING-CHECKLIST.md" ]; then
    git mv "core/00031-MANUAL-TESTING-CHECKLIST.md" "archive/session-deliverables/phase-2/00031-MANUAL-TESTING-CHECKLIST.md"
    echo "✅ Rolled back: core/00031-MANUAL-TESTING-CHECKLIST.md → archive/session-deliverables/phase-2/00031-MANUAL-TESTING-CHECKLIST.md"
else
    echo "⚠️  File not found: core/00031-MANUAL-TESTING-CHECKLIST.md"
fi

# Rollback: core/00036-ENHANCED-DASHBOARD-GUIDE.md → archive/session-deliverables/phase-2/00036-ENHANCED-DASHBOARD-GUIDE.md
if [ -f "core/00036-ENHANCED-DASHBOARD-GUIDE.md" ]; then
    git mv "core/00036-ENHANCED-DASHBOARD-GUIDE.md" "archive/session-deliverables/phase-2/00036-ENHANCED-DASHBOARD-GUIDE.md"
    echo "✅ Rolled back: core/00036-ENHANCED-DASHBOARD-GUIDE.md → archive/session-deliverables/phase-2/00036-ENHANCED-DASHBOARD-GUIDE.md"
else
    echo "⚠️  File not found: core/00036-ENHANCED-DASHBOARD-GUIDE.md"
fi

# Rollback: core/00053-MIGRATION-COMPLETION-CERTIFICATE.md → archive/session-deliverables/phase-3/00053-MIGRATION-COMPLETION-CERTIFICATE.md
if [ -f "core/00053-MIGRATION-COMPLETION-CERTIFICATE.md" ]; then
    git mv "core/00053-MIGRATION-COMPLETION-CERTIFICATE.md" "archive/session-deliverables/phase-3/00053-MIGRATION-COMPLETION-CERTIFICATE.md"
    echo "✅ Rolled back: core/00053-MIGRATION-COMPLETION-CERTIFICATE.md → archive/session-deliverables/phase-3/00053-MIGRATION-COMPLETION-CERTIFICATE.md"
else
    echo "⚠️  File not found: core/00053-MIGRATION-COMPLETION-CERTIFICATE.md"
fi
