import glob
import re

story_files = glob.glob('../requirements/user-stories/*.md')
total_stories = 0
file_counts = {}

for filepath in sorted(story_files):
    with open(filepath, 'r') as f:
        content = f.read()
        # Count US-XXX patterns
        stories = re.findall(r'^### US-\d+:', content, re.MULTILINE)
        count = len(stories)
        total_stories += count
        filename = filepath.split('/')[-1]
        file_counts[filename] = count
        print(f"{filename}: {count} stories")

print(f"\nTotal user stories: {total_stories}")

# Find the highest story number
all_numbers = []
for filepath in story_files:
    with open(filepath, 'r') as f:
        content = f.read()
        numbers = re.findall(r'US-(\d+):', content)
        all_numbers.extend([int(n) for n in numbers])

if all_numbers:
    print(f"Highest story number: US-{max(all_numbers)}")
    print(f"Expected stories (1 to {max(all_numbers)}): {max(all_numbers)}")
    
    # Check for gaps
    expected = set(range(1, max(all_numbers) + 1))
    actual = set(all_numbers)
    missing = expected - actual
    if missing:
        print(f"Missing story numbers: {sorted(missing)}")
