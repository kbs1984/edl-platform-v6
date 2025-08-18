import json
import os
import glob

total_tasks = 0
file_counts = {}

canvas_files = glob.glob('../requirements/canvas-requirements/canvas-analysis/*.json')

for filepath in canvas_files:
    try:
        with open(filepath, 'r') as f:
            content = f.read()
            # Skip the "Parsing Obsidian Canvas..." line if present
            json_start = content.find('{')
            if json_start != -1:
                data = json.loads(content[json_start:])
                task_count = len(data.get('tasks', {}))
                filename = os.path.basename(filepath)
                file_counts[filename] = task_count
                total_tasks += task_count
    except Exception as e:
        print(f"Error processing {filepath}: {e}")

# Sort by filename
for filename in sorted(file_counts.keys()):
    print(f"{filename}: {file_counts[filename]} tasks")

print(f"\nTotal tasks across all files: {total_tasks}")
print(f"Number of Canvas files: {len(file_counts)}")
