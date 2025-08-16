#!/bin/bash
# Process all Canvas files independently
# Run this OUTSIDE Claude Code before starting session
# Session 00011 - Created 2025-08-16

echo "Canvas Batch Processor - Session 00011"
echo "======================================="
echo ""

# Check we're in the right directory
if [ ! -d "seeds" ]; then
    echo "ERROR: seeds/ directory not found"
    echo "Please run from edl-platform-v6 directory"
    exit 1
fi

# Create output directories
mkdir -p docs/canvas-analysis
mkdir -p docs/database-schemas
mkdir -p .tasks
mkdir -p logs/canvas-processing

# Log file
LOG_FILE="logs/canvas-processing/$(date +%Y-%m-%d-%H%M%S).log"

echo "Starting processing at $(date)" | tee $LOG_FILE
echo "" | tee -a $LOG_FILE

# Process each Canvas file
for canvas_file in seeds/*.canvas; do
    if [ -f "$canvas_file" ]; then
        basename=$(basename "$canvas_file" .canvas)
        echo "Processing: $basename" | tee -a $LOG_FILE
        
        # Run parser and save outputs
        python3 tools/seed-parser.py \
            --canvas "$canvas_file" \
            --output json \
            --tasks \
            > "docs/canvas-analysis/${basename}.json" 2>> $LOG_FILE
        
        # Check if successful
        if [ $? -eq 0 ]; then
            echo "  ✓ Saved to docs/canvas-analysis/${basename}.json" | tee -a $LOG_FILE
        else
            echo "  ✗ Failed to process $basename" | tee -a $LOG_FILE
        fi
    fi
done

echo "" | tee -a $LOG_FILE
echo "Creating summary report..." | tee -a $LOG_FILE

# Create a summary report
python3 -c "
import json
import os
from pathlib import Path
from datetime import datetime

output_dir = Path('docs/canvas-analysis')
summary_file = output_dir / 'BATCH-SUMMARY.md'

with open(summary_file, 'w') as f:
    f.write('# Canvas Batch Processing Summary\\n')
    f.write(f'**Generated**: {datetime.now().isoformat()}\\n')
    f.write('**Session**: 00011\\n\\n')
    
    f.write('## Files Processed\\n\\n')
    
    total_tasks = 0
    for json_file in sorted(output_dir.glob('*.json')):
        try:
            with open(json_file, 'r') as jf:
                data = json.load(jf)
                tasks = data.get('tasks', {})
                stats = data.get('stats', {})
                
                f.write(f'### {json_file.stem}\\n')
                f.write(f'- Tasks: {len(tasks)}\\n')
                f.write(f'- Dependencies: {stats.get(\"total_dependencies\", 0)}\\n')
                f.write(f'- Complexity: {stats.get(\"max_dependency_depth\", 0)} levels\\n\\n')
                
                total_tasks += len(tasks)
        except:
            f.write(f'### {json_file.stem}\\n')
            f.write(f'- Error reading file\\n\\n')
    
    f.write(f'## Total Tasks Identified: {total_tasks}\\n')

print('Summary saved to docs/canvas-analysis/BATCH-SUMMARY.md')
" | tee -a $LOG_FILE

echo "" | tee -a $LOG_FILE
echo "=======================================" | tee -a $LOG_FILE
echo "Processing complete!" | tee -a $LOG_FILE
echo "" | tee -a $LOG_FILE
echo "Results saved to:" | tee -a $LOG_FILE
echo "  - docs/canvas-analysis/*.json (detailed analysis)" | tee -a $LOG_FILE
echo "  - docs/canvas-analysis/BATCH-SUMMARY.md (summary)" | tee -a $LOG_FILE
echo "  - $LOG_FILE (processing log)" | tee -a $LOG_FILE
echo "" | tee -a $LOG_FILE
echo "You can now start Claude Code and read these files." | tee -a $LOG_FILE