#!/usr/bin/env python3
"""
Quick reference scanner - faster version for initial mapping
"""

import json
import re
from pathlib import Path
from datetime import datetime

def quick_scan():
    """Quick scan for references - simplified for speed"""
    reference_map = {}
    reverse_map = {}
    
    # Get markdown files, excluding problematic directories
    md_files = []
    for pattern in ["*.md", "*/*.md", "*/*/*.md", "*/*/*/*.md"]:
        for f in Path(".").glob(pattern):
            if "node_modules" not in str(f) and ".git" not in str(f):
                md_files.append(f)
    
    print(f"Scanning {len(md_files)} files...")
    
    for i, file_path in enumerate(md_files):
        if i % 50 == 0:
            print(f"  Progress: {i}/{len(md_files)}")
        
        try:
            content = file_path.read_text(encoding='utf-8', errors='ignore')
            
            # Quick pattern search - just markdown links for now
            links = re.findall(r'\[([^\]]+)\]\(([^)]+)\)', content)
            
            refs = set()
            for _, path in links:
                if not path.startswith('http') and '.md' in path:
                    refs.add(path)
            
            if refs:
                reference_map[str(file_path)] = list(refs)
                
        except Exception as e:
            print(f"  Error with {file_path}: {e}")
    
    # Save minimal reference map
    data = {
        "generated": datetime.now().isoformat(),
        "session": "00066",
        "reference_map": reference_map,
        "reverse_map": {},  # Skip for speed
        "stats": {
            "total_files": len(md_files),
            "files_with_refs": len(reference_map),
            "total_references": sum(len(refs) for refs in reference_map.values())
        }
    }
    
    with open("reference-map-00066.json", 'w') as f:
        json.dump(data, f, indent=2)
    
    print(f"\n✅ Quick scan complete!")
    print(f"  Files scanned: {len(md_files)}")
    print(f"  Files with references: {len(reference_map)}")
    print(f"  Total references: {data['stats']['total_references']}")
    print(f"  Saved to: reference-map-00066.json")

if __name__ == "__main__":
    quick_scan()