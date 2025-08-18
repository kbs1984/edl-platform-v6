import json
import os
import glob

canvas_files = glob.glob('../requirements/canvas-requirements/canvas-analysis/*.json')

total_all_items = 0
file_details = []

for filepath in canvas_files:
    try:
        with open(filepath, 'r') as f:
            content = f.read()
            json_start = content.find('{')
            if json_start != -1:
                data = json.loads(content[json_start:])
                
                filename = os.path.basename(filepath)
                tasks = len(data.get('tasks', {}))
                edges = len(data.get('edges', []))
                issues = len(data.get('issues', []))
                
                # Check stats structure
                stats = data.get('stats', {})
                
                item_count = tasks + edges + issues
                total_all_items += item_count
                
                if filename == "001-4. needlabel.Activity & Registrar Box.json":
                    print(f"\nDetailed look at {filename}:")
                    print(f"  Tasks: {tasks}")
                    print(f"  Edges: {edges}")  
                    print(f"  Issues: {issues}")
                    print(f"  Stats: {stats}")
                    
    except Exception as e:
        print(f"Error: {e}")

print(f"\nTotal items (tasks + edges + issues): {total_all_items}")

# Also count if we're counting individual task properties
sample_file = '../requirements/canvas-requirements/canvas-analysis/002-1. seed.PlayerID Profile Box.json'
with open(sample_file, 'r') as f:
    content = f.read()
    json_start = content.find('{')
    data = json.loads(content[json_start:])
    
    # Count all individual items
    task_properties = 0
    for task_id, task_data in data.get('tasks', {}).items():
        task_properties += len(task_data.keys())
    
    print(f"\nSample file task property count: {task_properties} properties across {len(data.get('tasks', {}))} tasks")
