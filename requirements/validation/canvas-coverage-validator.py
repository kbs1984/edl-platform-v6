#!/usr/bin/env python3
"""
Canvas Coverage Validator
Session 00023 - Emergency validation script
Purpose: Map Canvas tasks to User Stories and identify coverage gaps
"""

import json
import glob
import os
from pathlib import Path

class CanvasCoverageValidator:
    def __init__(self):
        self.canvas_files = []
        self.story_files = []
        self.canvas_tasks = {}
        self.story_references = {}
        self.coverage_map = {}
        
    def load_canvas_files(self):
        """Load all Canvas JSON files"""
        canvas_pattern = 'requirements/canvas-requirements/canvas-analysis/*.json'
        self.canvas_files = sorted(glob.glob(canvas_pattern))
        
        for canvas_file in self.canvas_files:
            canvas_name = os.path.basename(canvas_file)
            with open(canvas_file, 'r') as f:
                content = f.read()
                # Handle the JSON extraction (some files have headers)
                json_start = content.find('{')
                if json_start != -1:
                    data = json.loads(content[json_start:])
                    tasks = data.get('tasks', {})
                    self.canvas_tasks[canvas_name] = {
                        'count': len(tasks),
                        'tasks': tasks,
                        'file': canvas_file
                    }
        
        return len(self.canvas_files)
    
    def load_story_files(self):
        """Load all user story files"""
        story_pattern = 'requirements/user-stories/*.md'
        self.story_files = sorted(glob.glob(story_pattern))
        
        for story_file in self.story_files:
            story_name = os.path.basename(story_file)
            with open(story_file, 'r') as f:
                content = f.read()
                
                # Find Canvas references in the story
                canvas_refs = []
                for line in content.split('\n'):
                    if 'Canvas' in line or 'canvas' in line:
                        # Extract Canvas file references
                        if '001-' in line or '002-' in line or '003-' in line:
                            canvas_refs.append(line)
                
                # Count stories (US-XXX patterns)
                import re
                story_ids = re.findall(r'US-\d{3}', content)
                
                self.story_references[story_name] = {
                    'story_count': len(set(story_ids)),
                    'story_ids': list(set(story_ids)),
                    'canvas_refs': canvas_refs,
                    'file': story_file
                }
        
        return len(self.story_files)
    
    def calculate_task_coverage(self, task_text, story_content):
        """Progressive matching for accurate coverage detection"""
        import re
        
        task_lower = task_text.lower().strip()
        story_lower = story_content.lower()
        
        # Level 1: Exact match (100% coverage)
        if task_lower in story_lower:
            return 1.0
        
        # Level 2: Key terms matching (70% coverage)
        # Extract words of 4+ characters
        key_terms = re.findall(r'\b\w{4,}\b', task_lower)
        if key_terms:
            matches = sum(1 for term in key_terms if term in story_lower)
            if len(key_terms) > 0 and matches / len(key_terms) > 0.6:
                return 0.7
        
        # Level 3: Concept match (40% coverage)
        # Core activity runtime concepts
        concepts = ['session', 'submit', 'deadline', 'report', 'save', 
                   'activity', 'assignment', 'progress', 'vote', 'ballot',
                   'citation', 'rule', 'workflow', 'complete', 'start']
        
        task_has_concept = any(concept in task_lower for concept in concepts)
        story_has_concept = any(concept in story_lower for concept in concepts)
        
        if task_has_concept and story_has_concept:
            # Check for at least one matching concept
            for concept in concepts:
                if concept in task_lower and concept in story_lower:
                    return 0.4
        
        return 0.0  # No coverage
    
    def analyze_coverage(self):
        """Analyze which Canvas files have story coverage using progressive matching"""
        for canvas_name, canvas_info in self.canvas_tasks.items():
            # Clean up canvas name for matching
            canvas_id = canvas_name.split('.')[0]  # Get "001-5" from "001-5. seed.Activity Instance.json"
            
            # First check if Canvas is even mentioned (basic reference)
            canvas_mentioned = False
            covering_stories = []
            story_coverage_scores = {}
            
            # Load all story content for deeper analysis
            all_story_content = {}
            for story_name, story_info in self.story_references.items():
                with open(story_info['file'], 'r') as f:
                    all_story_content[story_name] = f.read()
                
                # Check if Canvas is mentioned at all
                for ref in story_info['canvas_refs']:
                    if canvas_id in ref:
                        canvas_mentioned = True
            
            # If Canvas is mentioned, do deep task-level analysis
            tasks_covered = 0
            tasks_partial = 0
            task_coverage_details = []
            
            if canvas_mentioned and canvas_info['tasks']:
                for task_id, task_data in canvas_info['tasks'].items():
                    task_text = task_data.get('text', '')
                    if not task_text or task_text.strip() == '':
                        continue  # Skip empty tasks
                    
                    # Check coverage against all stories
                    max_coverage = 0.0
                    best_story = None
                    
                    for story_name, story_content in all_story_content.items():
                        coverage = self.calculate_task_coverage(task_text, story_content)
                        if coverage > max_coverage:
                            max_coverage = coverage
                            best_story = story_name
                    
                    if max_coverage > 0.4:
                        if max_coverage >= 0.7:
                            tasks_covered += 1
                        else:
                            tasks_partial += 1
                        
                        if best_story:
                            story_ids = self.story_references[best_story]['story_ids']
                            covering_stories.extend(story_ids)
                    
                    task_coverage_details.append({
                        'task_id': task_id,
                        'coverage': max_coverage,
                        'story': best_story
                    })
            
            # Calculate overall coverage based on task-level analysis
            total_non_empty_tasks = len([t for t in canvas_info['tasks'].values() 
                                        if t.get('text', '').strip()])
            
            if total_non_empty_tasks > 0:
                coverage_percentage = ((tasks_covered + tasks_partial * 0.5) / total_non_empty_tasks) * 100
            else:
                coverage_percentage = 0
            
            # Canvas is "covered" if >40% of tasks have some coverage
            covered = coverage_percentage > 40
            
            self.coverage_map[canvas_name] = {
                'tasks': canvas_info['count'],
                'non_empty_tasks': total_non_empty_tasks,
                'covered': covered,
                'canvas_mentioned': canvas_mentioned,
                'tasks_covered': tasks_covered,
                'tasks_partial': tasks_partial,
                'coverage_percentage': coverage_percentage,
                'covering_stories': list(set(covering_stories)),
                'coverage_ratio': len(set(covering_stories)) / canvas_info['count'] if canvas_info['count'] > 0 else 0
            }
    
    def generate_report(self):
        """Generate coverage report"""
        print("=" * 80)
        print("CANVAS COVERAGE VALIDATION REPORT")
        print("Session 00023 Emergency Validation")
        print("=" * 80)
        print()
        
        # Summary statistics
        total_canvas_files = len(self.canvas_tasks)
        total_tasks = sum(info['count'] for info in self.canvas_tasks.values())
        covered_files = sum(1 for info in self.coverage_map.values() if info['covered'])
        uncovered_tasks = sum(info['tasks'] for name, info in self.coverage_map.items() if not info['covered'])
        
        print("SUMMARY STATISTICS:")
        print(f"  Total Canvas files: {total_canvas_files}")
        print(f"  Total Canvas tasks: {total_tasks}")
        print(f"  Canvas files with story coverage: {covered_files}/{total_canvas_files}")
        print(f"  Tasks in uncovered Canvas files: {uncovered_tasks}")
        print(f"  Percentage of tasks uncovered: {uncovered_tasks/total_tasks*100:.1f}%")
        print()
        
        # Total stories
        total_stories = sum(info['story_count'] for info in self.story_references.values())
        print(f"  Total user stories created: {total_stories}")
        print(f"  Compression ratio: {total_tasks/total_stories:.1f}:1 (tasks to stories)")
        print()
        
        print("CANVAS FILE COVERAGE:")
        print("-" * 80)
        
        for canvas_name in sorted(self.coverage_map.keys()):
            info = self.coverage_map[canvas_name]
            
            # Determine status based on coverage percentage
            if info['coverage_percentage'] >= 70:
                status = "✅ WELL COVERED"
            elif info['coverage_percentage'] >= 40:
                status = "🟡 PARTIALLY COVERED"
            elif info['canvas_mentioned']:
                status = "⚠️  MENTIONED ONLY"
            else:
                status = "🚨 UNCOVERED"
            
            # Shorten long filenames
            display_name = canvas_name[:50] + "..." if len(canvas_name) > 50 else canvas_name
            
            print(f"\n{display_name}")
            print(f"  Status: {status} ({info['coverage_percentage']:.1f}% task coverage)")
            print(f"  Tasks: {info['tasks']} total ({info['non_empty_tasks']} non-empty)")
            
            if info['tasks_covered'] > 0 or info['tasks_partial'] > 0:
                print(f"  Coverage: {info['tasks_covered']} full + {info['tasks_partial']} partial")
                print(f"  Covering stories: {len(info['covering_stories'])} stories")
                if info['covering_stories']:
                    print(f"  Story IDs: {', '.join(info['covering_stories'][:5])}", end="")
                    if len(info['covering_stories']) > 5:
                        print(f"... and {len(info['covering_stories'])-5} more")
                    else:
                        print()
            elif info['canvas_mentioned']:
                print(f"  ⚠️  Canvas mentioned but NO tasks actually covered!")
            else:
                print(f"  ⚠️  NO STORY COVERAGE - {info['non_empty_tasks']} tasks at risk!")
        
        print()
        print("=" * 80)
        print("CRITICAL FINDINGS:")
        print("-" * 80)
        
        # Find the biggest gap
        uncovered = [(name, info['tasks']) for name, info in self.coverage_map.items() if not info['covered']]
        if uncovered:
            uncovered.sort(key=lambda x: x[1], reverse=True)
            print(f"🚨 LARGEST GAP: {uncovered[0][0]}")
            print(f"   {uncovered[0][1]} tasks with ZERO coverage!")
            print()
            
            if uncovered[0][1] > 100:
                print("   THIS IS A CRITICAL SYSTEM COMPONENT!")
                print("   Immediate story extraction required!")
        
        # Check compression ratio
        if total_stories > 0:
            ratio = total_tasks / total_stories
            if ratio > 30:
                print(f"⚠️  HIGH COMPRESSION: {ratio:.1f}:1 ratio suggests many tasks consolidated")
                print("   Risk of missing detailed requirements")
        
        print()
        print("=" * 80)
        
        return {
            'total_tasks': total_tasks,
            'uncovered_tasks': uncovered_tasks,
            'coverage_percentage': (total_tasks - uncovered_tasks) / total_tasks * 100
        }

def main():
    validator = CanvasCoverageValidator()
    
    print("Loading Canvas files...")
    canvas_count = validator.load_canvas_files()
    print(f"  Loaded {canvas_count} Canvas files")
    
    print("Loading story files...")
    story_count = validator.load_story_files()
    print(f"  Loaded {story_count} story files")
    
    print("Analyzing coverage...")
    validator.analyze_coverage()
    
    print()
    results = validator.generate_report()
    
    # Save results to file
    output_file = 'requirements/validation/coverage-report-00023.json'
    os.makedirs(os.path.dirname(output_file), exist_ok=True)
    
    with open(output_file, 'w') as f:
        json.dump({
            'canvas_tasks': validator.canvas_tasks,
            'story_references': validator.story_references,
            'coverage_map': validator.coverage_map,
            'summary': results
        }, f, indent=2)
    
    print(f"\nDetailed results saved to: {output_file}")
    
    return results

if __name__ == "__main__":
    main()