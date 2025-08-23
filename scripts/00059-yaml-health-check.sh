#!/bin/bash
# YAML Health Check for Session Startup Integration
# Session: 00059
# Purpose: Quick YAML organizational health check for session startup

echo "🔍 YAML Organizational Health Check"
echo "===================================="

# Run the Level 3 FileSystem Agent
python3 reality/agent-filesystem/00059-filesystem-agent-level3.py 2>/dev/null | grep -A 30 "FileSystem Organizational Health Report"

# Quick stats from YAML indexer
echo ""
echo "📊 Quick YAML Stats:"
python3 -c "
import sys
sys.path.append('scripts')
from importlib import import_module
indexer_module = import_module('00059-yaml-indexer')
indexer = indexer_module.YAMLIndexer()
indexer.scan_files()
stats = indexer.get_statistics()
print(f'  • Files with YAML: {stats[\"total_indexed\"]}')
print(f'  • Unique topics: {stats[\"unique_topics\"]}')
print(f'  • Validation errors: {stats[\"validation_errors\"]}')
print(f'  • Cache hit rate: {stats[\"cache_hit_rate\"]:.1f}%')
print(f'  • Performance: {stats[\"total_time\"]:.3f}s')
" 2>/dev/null

# Check for broken references
echo ""
echo "🔗 Cross-Reference Check:"
python3 scripts/00059-yaml-query.py --broken 2>/dev/null | grep -A 5 "broken references"

echo ""
echo "✅ YAML health check complete"