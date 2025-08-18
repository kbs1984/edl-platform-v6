#!/usr/bin/env python3
"""
Traceability Matrix Builder
Created: Session 00026
Purpose: Map Canvas tasks to user stories for complete coverage verification

Usage: python3 traceability-matrix.py [--export-json] [--canvas-file CANVAS]
"""

import json
import re
import glob
import argparse
from pathlib import Path
from typing import Dict, List, Tuple, Any

class TraceabilityMatrix:
    def __init__(self):
        self.canvas_dir = "requirements/canvas-requirements/canvas-analysis"
        self.stories_dir = "requirements/user-stories"
        self.canvas_data = {}
        self.story_data = {}
        self.traceability_map = []
        
    def load_canvas_files(self) -> None:
        """Load all Canvas JSON files and extract tasks"""
        print("Loading Canvas files...")
        
        for canvas_file in glob.glob(f"{self.canvas_dir}/*.json"):
            canvas_name = Path(canvas_file).stem
            print(f"  Loading {canvas_name}")
            
            try:
                with open(canvas_file, 'r') as f:
                    content = f.read()
                    # Handle files that may start with text before JSON
                    json_start = content.find('{')
                    if json_start != -1:
                        data = json.loads(content[json_start:])
                        tasks = data.get('tasks', {})
                        
                        # Filter non-empty tasks
                        non_empty_tasks = {}
                        for task_id, task in tasks.items():
                            task_text = task.get('text', '').strip()
                            if task_text:  # Only non-empty tasks
                                non_empty_tasks[task_id] = {
                                    'text': task_text,
                                    'position': task.get('position'),
                                    'canvas_file': canvas_name
                                }
                        
                        self.canvas_data[canvas_name] = non_empty_tasks
                        print(f"    {len(non_empty_tasks)} non-empty tasks")
                        
            except Exception as e:
                print(f"    Error loading {canvas_file}: {e}")
    
    def load_story_files(self) -> None:
        """Load all user story files"""
        print("Loading story files...")
        
        for story_file in glob.glob(f"{self.stories_dir}/*.md"):
            file_name = Path(story_file).stem
            print(f"  Loading {file_name}")
            
            try:
                with open(story_file, 'r') as f:
                    content = f.read()
                    
                    # Extract stories using regex
                    story_pattern = r'### (US-\d+):(.*?)(?=### US-|\Z)'
                    matches = re.findall(story_pattern, content, re.DOTALL)
                    
                    for story_id, story_content in matches:
                        # Extract priority from filename
                        priority = "P0" if "P0-" in file_name else ("P1" if "P1-" in file_name else "P2")
                        
                        # Extract Canvas references
                        canvas_refs = re.findall(r'Canvas (\d+-\d+)', story_content)
                        canvas_refs.extend(re.findall(r'(\d+-\d+[^"]*\.json)', story_content))
                        
                        self.story_data[story_id] = {
                            'content': story_content.strip(),
                            'priority': priority,
                            'file': file_name,
                            'canvas_references': list(set(canvas_refs))
                        }
                        
            except Exception as e:
                print(f"    Error loading {story_file}: {e}")
        
        print(f"  Total stories loaded: {len(self.story_data)}")
    
    def build_traceability_map(self) -> None:
        """Build the traceability matrix"""
        print("Building traceability matrix...")
        
        for story_id, story_info in self.story_data.items():
            story_content = story_info['content'].lower()
            
            # For each Canvas file this story might relate to
            for canvas_name, tasks in self.canvas_data.items():
                # Check if this story explicitly references this Canvas
                canvas_refs = story_info['canvas_references']
                explicitly_referenced = any(ref in canvas_name for ref in canvas_refs)
                
                for task_id, task_info in tasks.items():
                    task_text = task_info['text'].lower()
                    
                    # Calculate coverage score
                    coverage_score = self._calculate_coverage_score(
                        story_content, task_text, explicitly_referenced
                    )
                    
                    if coverage_score > 0.3:  # Only include meaningful matches
                        self.traceability_map.append({
                            'canvas_file': canvas_name,
                            'task_id': task_id,
                            'task_text': task_info['text'][:100] + "..." if len(task_info['text']) > 100 else task_info['text'],
                            'story_id': story_id,
                            'story_priority': story_info['priority'],
                            'coverage_score': round(coverage_score, 2),
                            'coverage_type': self._get_coverage_type(coverage_score),
                            'explicit_reference': explicitly_referenced
                        })
        
        # Sort by coverage score descending
        self.traceability_map.sort(key=lambda x: x['coverage_score'], reverse=True)
        print(f"  Created {len(self.traceability_map)} traceability mappings")
    
    def _calculate_coverage_score(self, story_content: str, task_text: str, explicit_ref: bool) -> float:
        """Calculate how well a story covers a task (0.0 to 1.0)"""
        
        # Bonus for explicit Canvas reference
        score = 0.2 if explicit_ref else 0.0
        
        # Key terms matching
        task_words = set(re.findall(r'\b\w+\b', task_text.lower()))
        story_words = set(re.findall(r'\b\w+\b', story_content.lower()))
        
        if task_words:
            word_overlap = len(task_words.intersection(story_words)) / len(task_words)
            score += word_overlap * 0.6
        
        # Exact phrase matching
        if len(task_text) > 10:
            if task_text in story_content:
                score += 0.3
            elif any(phrase in story_content for phrase in task_text.split() if len(phrase) > 4):
                score += 0.1
        
        return min(score, 1.0)
    
    def _get_coverage_type(self, score: float) -> str:
        """Convert score to coverage type"""
        if score >= 0.7:
            return "full"
        elif score >= 0.5:
            return "partial"
        else:
            return "concept"
    
    def generate_coverage_report(self) -> Dict[str, Any]:
        """Generate coverage report by Canvas file"""
        report = {
            'total_canvas_files': len(self.canvas_data),
            'total_stories': len(self.story_data),
            'total_mappings': len(self.traceability_map),
            'canvas_coverage': {}
        }
        
        for canvas_name, tasks in self.canvas_data.items():
            total_tasks = len(tasks)
            covered_tasks = set()
            
            for mapping in self.traceability_map:
                if mapping['canvas_file'] == canvas_name and mapping['coverage_score'] >= 0.5:
                    covered_tasks.add(mapping['task_id'])
            
            coverage_pct = (len(covered_tasks) / total_tasks * 100) if total_tasks > 0 else 0
            
            report['canvas_coverage'][canvas_name] = {
                'total_tasks': total_tasks,
                'covered_tasks': len(covered_tasks),
                'coverage_percentage': round(coverage_pct, 1),
                'status': 'WELL_COVERED' if coverage_pct >= 80 else 'PARTIALLY_COVERED' if coverage_pct >= 50 else 'POORLY_COVERED'
            }
        
        return report
    
    def export_json(self, filename: str = None) -> None:
        """Export traceability matrix to JSON"""
        if not filename:
            filename = "requirements/validation/traceability-matrix-00026.json"
        
        export_data = {
            'metadata': {
                'generated_by': 'Session 00026',
                'total_canvas_files': len(self.canvas_data),
                'total_stories': len(self.story_data),
                'total_mappings': len(self.traceability_map)
            },
            'traceability_matrix': self.traceability_map,
            'coverage_report': self.generate_coverage_report()
        }
        
        with open(filename, 'w') as f:
            json.dump(export_data, f, indent=2)
        
        print(f"Traceability matrix exported to: {filename}")
    
    def print_summary(self) -> None:
        """Print summary of traceability analysis"""
        report = self.generate_coverage_report()
        
        print("\n" + "="*60)
        print("TRACEABILITY MATRIX SUMMARY")
        print("="*60)
        print(f"Total Canvas files: {report['total_canvas_files']}")
        print(f"Total user stories: {report['total_stories']}")
        print(f"Total task-story mappings: {report['total_mappings']}")
        print()
        
        print("CANVAS FILE COVERAGE:")
        print("-" * 40)
        for canvas_name, coverage in report['canvas_coverage'].items():
            status_icon = "✅" if coverage['status'] == 'WELL_COVERED' else "🟡" if coverage['status'] == 'PARTIALLY_COVERED' else "❌"
            print(f"{status_icon} {canvas_name}")
            print(f"    {coverage['covered_tasks']}/{coverage['total_tasks']} tasks ({coverage['coverage_percentage']}%)")
        
        print("\nMatrix foundation created successfully!")

def main():
    parser = argparse.ArgumentParser(description='Build traceability matrix for Canvas tasks to user stories')
    parser.add_argument('--export-json', action='store_true', help='Export matrix to JSON file')
    parser.add_argument('--canvas-file', help='Analyze specific Canvas file only')
    
    args = parser.parse_args()
    
    matrix = TraceabilityMatrix()
    
    print("TRACEABILITY MATRIX BUILDER")
    print("=" * 30)
    
    matrix.load_canvas_files()
    matrix.load_story_files()
    matrix.build_traceability_map()
    
    if args.export_json:
        matrix.export_json()
    
    matrix.print_summary()

if __name__ == "__main__":
    main()