import json
import os
import glob

total_nodes = 0
total_tasks = 0
total_edges = 0
total_groups = 0
other_keys = set()

canvas_files = glob.glob('../requirements/canvas-requirements/canvas-analysis/*.json')

for filepath in canvas_files:
    try:
        with open(filepath, 'r') as f:
            content = f.read()
            json_start = content.find('{')
            if json_start != -1:
                data = json.loads(content[json_start:])
                
                # Count different types
                tasks = len(data.get('tasks', {}))
                edges = len(data.get('edges', []))
                groups = len(data.get('groups', {}))
                
                total_tasks += tasks
                total_edges += edges
                total_groups += groups
                
                # Track all keys
                for key in data.keys():
                    if key not in ['tasks', 'edges', 'groups']:
                        other_keys.add(key)
                        
    except Exception as e:
        print(f"Error: {e}")

print(f"Total tasks: {total_tasks}")
print(f"Total edges: {total_edges}")
print(f"Total groups: {total_groups}")
print(f"Total nodes (tasks + edges + groups): {total_tasks + total_edges + total_groups}")
print(f"Other keys found: {other_keys}")
