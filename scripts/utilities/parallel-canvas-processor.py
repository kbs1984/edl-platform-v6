#!/usr/bin/env python3
"""
Parallel Canvas Processor - Uses existing infrastructure
Session 00011 Implementation
Runs multiple Canvas files through existing ObsidianCanvasParser in parallel
"""

import json
import sys
import os
from pathlib import Path
from datetime import datetime
import subprocess
from concurrent.futures import ProcessPoolExecutor, as_completed
import argparse

# Import existing tools
sys.path.append(str(Path(__file__).parent))
from seed_parser import ObsidianCanvasParser

def process_single_canvas(canvas_path: str) -> dict:
    """Process a single Canvas file using existing parser"""
    
    print(f"🔄 Processing: {Path(canvas_path).name}")
    
    # Use existing ObsidianCanvasParser
    parser = ObsidianCanvasParser()
    
    # Read Canvas file
    with open(canvas_path, 'r') as f:
        canvas_json = f.read()
    
    # Parse using existing infrastructure
    result = parser.parse_canvas(canvas_json)
    
    # Add source file info
    result['source_file'] = Path(canvas_path).name
    result['processed_by'] = 'Session 00011'
    
    # Save analysis to docs
    output_dir = Path('docs/canvas-analysis')
    output_dir.mkdir(exist_ok=True)
    
    output_file = output_dir / f"{Path(canvas_path).stem}.analysis.json"
    with open(output_file, 'w') as f:
        json.dump(result, f, indent=2)
    
    # Generate summary report
    generate_summary_report(result, output_dir)
    
    # Use Task Reality Agent to store tasks
    store_in_task_agent(result)
    
    print(f"✅ Completed: {Path(canvas_path).name}")
    return result

def generate_summary_report(analysis: dict, output_dir: Path):
    """Generate markdown summary from analysis"""
    
    canvas_name = analysis['source_file']
    report_file = output_dir / f"{Path(canvas_name).stem}.summary.md"
    
    with open(report_file, 'w') as f:
        f.write(f"# Canvas Analysis: {canvas_name}\n")
        f.write(f"**Processed**: {analysis['metadata']['parsed_at']}\n\n")
        
        # Statistics
        stats = analysis['stats']
        f.write("## Statistics\n")
        f.write(f"- Total Tasks: {stats['total_tasks']}\n")
        f.write(f"- Total Dependencies: {stats['total_dependencies']}\n")
        f.write(f"- Max Dependency Depth: {stats['max_dependency_depth']}\n")
        f.write(f"- Critical Path Length: {stats['critical_path_length']}h\n\n")
        
        # Tasks by priority
        f.write("## Tasks by Priority\n")
        tasks = analysis['tasks']
        p0_tasks = [t for t in tasks.values() if t.get('priority', 2) == 0]
        p1_tasks = [t for t in tasks.values() if t.get('priority', 2) == 1]
        p2_tasks = [t for t in tasks.values() if t.get('priority', 2) == 2]
        
        f.write(f"- P0 (Critical): {len(p0_tasks)} tasks\n")
        f.write(f"- P1 (Important): {len(p1_tasks)} tasks\n")
        f.write(f"- P2 (Normal): {len(p2_tasks)} tasks\n\n")
        
        # Key UI Components
        f.write("## Key Components Identified\n")
        for task_id, task in list(tasks.items())[:10]:
            f.write(f"- {task['description'][:80]}\n")
        
        # Issues found
        if analysis.get('issues'):
            f.write("\n## Issues Found\n")
            for issue in analysis['issues']:
                f.write(f"- **{issue['type']}**: {issue['description']}\n")
    
    print(f"  📄 Report: {report_file}")

def store_in_task_agent(analysis: dict):
    """Store tasks using Task Reality Agent"""
    
    # Import Task Reality Agent
    sys.path.append(str(Path(__file__).parent.parent / 'reality/agent-reality-auditor/task-connector'))
    from connector import TaskRealityAgent
    
    agent = TaskRealityAgent()
    
    # Store each task
    for task_id, task_data in analysis['tasks'].items():
        agent.track_task(
            task_id=f"{analysis['source_file']}_{task_id}",
            session_id='00011',
            depends_on=[f"{analysis['source_file']}_{dep}" for dep in task_data.get('depends_on', [])],
            description=task_data.get('description', ''),
            acceptance_criteria=task_data.get('acceptance_criteria', []),
            priority=task_data.get('priority', 2),
            estimated_hours=task_data.get('estimated_hours', 4.0),
            intent=f"From Canvas: {analysis['source_file']}"
        )
    
    print(f"  💾 Stored {len(analysis['tasks'])} tasks in Task Reality Agent")

def process_all_canvas_files():
    """Process all Canvas files in parallel"""
    
    canvas_dir = Path('seeds')
    canvas_files = list(canvas_dir.glob('*.canvas'))
    
    if not canvas_files:
        print("No Canvas files found in seeds/")
        return
    
    print(f"Found {len(canvas_files)} Canvas files to process")
    print("=" * 50)
    
    # Process in parallel
    max_workers = min(4, len(canvas_files))  # Max 4 parallel processes
    
    with ProcessPoolExecutor(max_workers=max_workers) as executor:
        # Submit all jobs
        future_to_file = {
            executor.submit(process_single_canvas, str(canvas_file)): canvas_file
            for canvas_file in canvas_files
        }
        
        # Collect results as they complete
        results = {}
        for future in as_completed(future_to_file):
            canvas_file = future_to_file[future]
            try:
                result = future.result()
                results[canvas_file.name] = result
            except Exception as e:
                print(f"❌ Error processing {canvas_file.name}: {e}")
    
    print("=" * 50)
    print(f"✅ Processed {len(results)} Canvas files")
    
    # Generate master summary
    generate_master_summary(results)

def generate_master_summary(all_results: dict):
    """Generate a master summary of all Canvas files"""
    
    summary_file = Path('docs/canvas-analysis/MASTER-SUMMARY.md')
    summary_file.parent.mkdir(exist_ok=True)
    
    with open(summary_file, 'w') as f:
        f.write("# Master Canvas Analysis Summary\n")
        f.write(f"**Generated**: {datetime.utcnow().isoformat()}\n")
        f.write(f"**Session**: 00011\n\n")
        
        f.write("## Canvas Files Analyzed\n\n")
        
        total_tasks = 0
        total_hours = 0
        
        for filename, result in all_results.items():
            stats = result.get('stats', {})
            task_count = stats.get('total_tasks', 0)
            hours = stats.get('total_estimated_hours', 0)
            
            total_tasks += task_count
            total_hours += hours
            
            f.write(f"### {filename}\n")
            f.write(f"- Tasks: {task_count}\n")
            f.write(f"- Estimated Hours: {hours}\n")
            f.write(f"- Complexity: {stats.get('max_dependency_depth', 0)} levels deep\n\n")
        
        f.write("## Totals\n")
        f.write(f"- Total Canvas Files: {len(all_results)}\n")
        f.write(f"- Total Tasks Identified: {total_tasks}\n")
        f.write(f"- Total Effort Estimated: {total_hours} hours\n")
    
    print(f"\n📊 Master summary: {summary_file}")

def main():
    parser = argparse.ArgumentParser(description='Process Canvas files in parallel')
    parser.add_argument('--file', help='Process single file', default=None)
    parser.add_argument('--all', action='store_true', help='Process all Canvas files')
    args = parser.parse_args()
    
    if args.file:
        result = process_single_canvas(args.file)
        print(f"Completed: {args.file}")
    elif args.all:
        process_all_canvas_files()
    else:
        print("Use --file <canvas> for single file or --all for all Canvas files")

if __name__ == '__main__':
    main()