import glob
import re

story_files = glob.glob('../requirements/user-stories/*.md')
canvas_refs = {}

for filepath in story_files:
    filename = filepath.split('/')[-1]
    with open(filepath, 'r') as f:
        content = f.read()
        # Find Canvas references
        refs = re.findall(r'Canvas ([\d\-]+)', content)
        if refs:
            canvas_refs[filename] = list(set(refs))

print("\n=== Canvas References by Story File ===\n")
for filename, refs in sorted(canvas_refs.items()):
    print(f"{filename}:")
    for ref in refs:
        print(f"  - Canvas {ref}")
    print()

# Count Canvas coverage
all_canvas = set()
for refs in canvas_refs.values():
    all_canvas.update(refs)

print(f"Total unique Canvas files referenced: {len(all_canvas)}")
print(f"Canvas files referenced: {sorted(all_canvas)}")

# Check which Canvas files have NO story coverage
expected_canvas = ["001-1", "001-2", "001-3", "001-4", "001-5", 
                  "002-1", "002-2", "002-3", "002-4", "002-5", "003-2"]
missing = set(expected_canvas) - all_canvas
if missing:
    print(f"\nCanvas files with NO story coverage: {sorted(missing)}")
else:
    print("\nAll Canvas files have story coverage!")
