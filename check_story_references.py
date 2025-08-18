import glob
import re
import json

# Get some sample node IDs from Canvas files
node_ids = []
canvas_files = glob.glob('../requirements/canvas-requirements/canvas-analysis/*.json')

for filepath in canvas_files[:3]:  # Check first 3 files
    try:
        with open(filepath, 'r') as f:
            content = f.read()
            json_start = content.find('{')
            if json_start != -1:
                data = json.loads(content[json_start:])
                # Get first 5 task IDs
                for task_id in list(data.get('tasks', {}).keys())[:5]:
                    node_ids.append(task_id)
    except:
        pass

print(f"Sample Canvas node IDs found: {len(node_ids)}")
print("First 10 IDs:", node_ids[:10])

# Now search for these in story files
found_references = 0
story_files = glob.glob('../requirements/user-stories/*.md')

for node_id in node_ids:
    for story_file in story_files:
        with open(story_file, 'r') as f:
            if node_id in f.read():
                found_references += 1
                print(f"Found node {node_id} in {story_file}")
                break

print(f"\nTotal node references found in stories: {found_references}")

# Check if stories reference Canvas file names instead
print("\n=== Canvas File References in Stories ===")
canvas_names = ["001-1", "001-2", "001-3", "001-4", "001-5", "002-1", "002-2", "002-3", "002-4", "002-5", "003-2"]

for canvas_name in canvas_names:
    for story_file in story_files:
        with open(story_file, 'r') as f:
            content = f.read()
            if canvas_name in content or canvas_name.replace("-", "") in content:
                # Count occurrences
                count = content.count(canvas_name)
                if count > 0:
                    print(f"{canvas_name} referenced {count} times in {story_file.split('/')[-1]}")
