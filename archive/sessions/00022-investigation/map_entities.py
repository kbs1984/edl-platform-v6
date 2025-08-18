import glob
import re

entities = {
    "Teams": 423,
    "Activities": 323, 
    "Players": 230,
    "Messages": 197,
    "Enablers": 105,
    "Resources": 50,
    "Supervisors": 49,
    "emCoins": 33,
    "Badges": 26
}

print("\n=== Entity Mapping: Session 11 → User Stories ===\n")

story_files = glob.glob('../requirements/user-stories/*.md')

for entity, session11_count in entities.items():
    total_mentions = 0
    files_with_entity = 0
    
    for filepath in story_files:
        try:
            with open(filepath, 'r') as f:
                content = f.read()
                # Case insensitive search
                mentions = len(re.findall(entity, content, re.IGNORECASE))
                if mentions > 0:
                    total_mentions += mentions
                    files_with_entity += 1
        except:
            pass
    
    print(f"{entity}:")
    print(f"  Session 11 frequency: {session11_count}")
    print(f"  User story mentions: {total_mentions}")
    print(f"  Found in {files_with_entity} story files")
    print()

# Also check for P0/P1/P2 alignment
print("=== Priority Alignment ===\n")
for priority in ['P0', 'P1', 'P2']:
    files = glob.glob(f'../requirements/user-stories/{priority}-*.md')
    print(f"{priority}: {len(files)} story files found")
