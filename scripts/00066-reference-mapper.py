#!/usr/bin/env python3
"""
Session 00066 - Reference Integrity Mapper
Purpose: Map all cross-references BEFORE any file moves to prevent breaking 73% of links
Created: 2025-08-25
Status: Phase 0 Safety Infrastructure

This tool scans all markdown files to build a complete map of cross-references.
It can predict which references would break if a file is moved and provide
the commands needed to fix them.
"""

import os
import re
import json
from pathlib import Path
from typing import Dict, List, Set, Tuple
from collections import defaultdict
import argparse
from datetime import datetime

class ReferenceMapper:
    """Maps and tracks all cross-references in the project"""
    
    def __init__(self, root_dir: str = "."):
        self.root_dir = Path(root_dir)
        self.reference_map: Dict[str, Set[str]] = defaultdict(set)  # file -> files it references
        self.reverse_map: Dict[str, Set[str]] = defaultdict(set)    # file -> files that reference it
        self.broken_refs: List[Tuple[str, str, str]] = []          # (source, broken_ref, reason)
        self.reference_types: Dict[str, List[Dict]] = {             # Track reference types
            'markdown_link': [],      # [text](path)
            'yaml_frontmatter': [],   # related_to, implements, etc.
            'raw_mention': [],        # Plain text file mentions
            'relative_import': []     # Python/JS imports
        }
        
    def scan_all_references(self) -> Dict:
        """Build complete map of all cross-references"""
        print("🔍 Scanning all markdown files for cross-references...")
        
        md_files = list(self.root_dir.rglob("*.md"))
        # Exclude node_modules and .git
        md_files = [f for f in md_files if "node_modules" not in str(f) and ".git" not in str(f)]
        
        print(f"Found {len(md_files)} markdown files to scan")
        
        for file_path in md_files:
            self._scan_file(file_path)
        
        return {
            "total_files": len(md_files),
            "files_with_references": len(self.reference_map),
            "total_references": sum(len(refs) for refs in self.reference_map.values()),
            "files_referenced": len(self.reverse_map)
        }
    
    def _scan_file(self, file_path: Path):
        """Scan a single file for references"""
        try:
            content = file_path.read_text(encoding='utf-8')
            
            # Calculate relative path FIRST (before using it)
            rel_path = file_path.relative_to(self.root_dir)
            
            # Find markdown links: [text](path)
            md_links = re.findall(r'\[([^\]]+)\]\(([^)]+)\)', content)
            
            # Find raw file references (common patterns)
            raw_refs = re.findall(r'(?:^|\s)([\.\/\w-]+\.(?:md|py|sh|sql|json|yaml|yml))', content)
            
            # Find YAML references in frontmatter
            yaml_refs = []
            if content.startswith('---'):
                yaml_section = content.split('---')[1] if len(content.split('---')) > 2 else ""
                yaml_refs = re.findall(r'(?:related_to|implements|superseded_by):\s*\[(.*?)\]', yaml_section)
                # Flatten YAML arrays
                for ref_list in yaml_refs:
                    yaml_refs.extend([r.strip(' "\'') for r in ref_list.split(',')])
            
            # Combine all references and track types
            all_refs = set()
            
            for text, path in md_links:
                if not path.startswith('http'):
                    all_refs.add(path)
                    self.reference_types['markdown_link'].append({
                        'source': str(rel_path),
                        'target': path,
                        'text': text
                    })
            
            for ref in raw_refs:
                if '/' in ref or ref.endswith('.md'):
                    all_refs.add(ref)
                    self.reference_types['raw_mention'].append({
                        'source': str(rel_path),
                        'target': ref
                    })
            
            for ref in yaml_refs:
                if ref and not ref.startswith('['):
                    all_refs.add(ref)
                    self.reference_types['yaml_frontmatter'].append({
                        'source': str(rel_path),
                        'target': ref
                    })
            
            # Store references
            for ref in all_refs:
                self.reference_map[str(rel_path)].add(ref)
                # Try to resolve the reference to build reverse map
                resolved = self._resolve_reference(file_path.parent, ref)
                if resolved:
                    self.reverse_map[str(resolved)].add(str(rel_path))
                    
        except Exception as e:
            print(f"Error scanning {file_path}: {e}")
    
    def _resolve_reference(self, base_dir: Path, ref: str) -> str:
        """Resolve a reference to its actual file path"""
        if ref.startswith('/'):
            # Absolute path from project root
            full_path = self.root_dir / ref[1:]
        else:
            # Relative path
            full_path = (base_dir / ref).resolve()
        
        try:
            rel_path = full_path.relative_to(self.root_dir)
            if full_path.exists():
                return str(rel_path)
        except ValueError:
            # Path is outside project root
            pass
        
        return None
    
    def simulate_move(self, file_path: str, new_location: str) -> Dict:
        """Predict what references would break if a file is moved"""
        affected_files = self.reverse_map.get(file_path, set())
        
        # Calculate how many references would need updating
        updates_needed = []
        for affected_file in affected_files:
            refs = self.reference_map.get(affected_file, set())
            for ref in refs:
                resolved = self._resolve_reference(Path(affected_file).parent, ref)
                if resolved == file_path:
                    updates_needed.append({
                        "file": affected_file,
                        "old_ref": ref,
                        "new_ref": self._calculate_new_reference(affected_file, new_location)
                    })
        
        return {
            "file_to_move": file_path,
            "new_location": new_location,
            "affected_files": list(affected_files),
            "affected_count": len(affected_files),
            "updates_needed": updates_needed,
            "update_count": len(updates_needed)
        }
    
    def _calculate_new_reference(self, from_file: str, to_file: str) -> str:
        """Calculate the new relative reference after a move"""
        from_dir = Path(from_file).parent
        to_path = Path(to_file)
        
        try:
            # Calculate relative path
            rel_path = os.path.relpath(to_path, from_dir)
            return rel_path
        except ValueError:
            # Fallback to absolute path
            return f"/{to_file}"
    
    def find_broken_references(self) -> List[Dict]:
        """Find all currently broken references"""
        broken = []
        
        for source_file, refs in self.reference_map.items():
            for ref in refs:
                if not ref.startswith('http'):
                    resolved = self._resolve_reference(Path(source_file).parent, ref)
                    if not resolved:
                        broken.append({
                            "source": source_file,
                            "broken_ref": ref,
                            "type": "file_not_found"
                        })
        
        return broken
    
    def generate_report(self) -> str:
        """Generate a comprehensive reference report"""
        stats = self.scan_all_references()
        broken = self.find_broken_references()
        
        # Find files with most references
        most_referenced = sorted(
            self.reverse_map.items(),
            key=lambda x: len(x[1]),
            reverse=True
        )[:10]
        
        # Find files with most outgoing references
        most_referencing = sorted(
            self.reference_map.items(),
            key=lambda x: len(x[1]),
            reverse=True
        )[:10]
        
        report = f"""
# Reference Integrity Report
Generated: {datetime.now().isoformat()}
Session: 00066

## Statistics
- Total files scanned: {stats['total_files']}
- Files with outgoing references: {stats['files_with_references']}
- Total references found: {stats['total_references']}
- Files being referenced: {stats['files_referenced']}

## Health Check
- Broken references found: {len(broken)}
- Reference coverage: {stats['files_referenced'] / stats['total_files'] * 100:.1f}%

## Reference Types Breakdown
- Markdown links: {len(self.reference_types['markdown_link'])}
- YAML frontmatter: {len(self.reference_types['yaml_frontmatter'])}
- Raw mentions: {len(self.reference_types['raw_mention'])}
- Relative imports: {len(self.reference_types['relative_import'])}

## Most Referenced Files (Top 10)
"""
        for file, refs in most_referenced:
            report += f"- {file}: {len(refs)} incoming references\n"
        
        report += "\n## Files with Most References (Top 10)\n"
        for file, refs in most_referencing:
            report += f"- {file}: {len(refs)} outgoing references\n"
        
        if broken:
            report += f"\n## ⚠️ Broken References ({len(broken)})\n"
            for b in broken[:20]:  # Show first 20
                report += f"- {b['source']} → {b['broken_ref']}\n"
        
        return report
    
    def save_reference_map(self, output_file: str = "reference-map-00066.json"):
        """Save the reference map for future use"""
        data = {
            "generated": datetime.now().isoformat(),
            "session": "00066",
            "reference_map": {k: list(v) for k, v in self.reference_map.items()},
            "reverse_map": {k: list(v) for k, v in self.reverse_map.items()},
            "stats": {
                "total_files": len(self.reference_map) + len(self.reverse_map),
                "total_references": sum(len(refs) for refs in self.reference_map.values())
            }
        }
        
        with open(output_file, 'w') as f:
            json.dump(data, f, indent=2)
        
        print(f"✅ Reference map saved to {output_file}")
        return output_file


def main():
    parser = argparse.ArgumentParser(description='Map all cross-references in the project')
    parser.add_argument('--scan', action='store_true', help='Scan and build reference map')
    parser.add_argument('--report', action='store_true', help='Generate reference report')
    parser.add_argument('--simulate', nargs=2, metavar=('FROM', 'TO'), 
                       help='Simulate moving a file')
    parser.add_argument('--save', action='store_true', help='Save reference map to JSON')
    parser.add_argument('--check-broken', action='store_true', help='Find broken references')
    
    args = parser.parse_args()
    
    mapper = ReferenceMapper()
    
    if args.scan or args.report or not any(vars(args).values()):
        stats = mapper.scan_all_references()
        print(f"\n📊 Scan complete:")
        print(f"  - Files with references: {stats['files_with_references']}")
        print(f"  - Total references: {stats['total_references']}")
        print(f"  - Files referenced: {stats['files_referenced']}")
    
    if args.report:
        report = mapper.generate_report()
        report_file = "reference-report-00066.md"
        with open(report_file, 'w') as f:
            f.write(report)
        print(f"\n📄 Report saved to {report_file}")
        print(report)
    
    if args.simulate:
        from_file, to_file = args.simulate
        result = mapper.simulate_move(from_file, to_file)
        print(f"\n🔮 Simulating move: {from_file} → {to_file}")
        print(f"  - Affected files: {result['affected_count']}")
        print(f"  - Updates needed: {result['update_count']}")
        if result['affected_files']:
            print("  - Files to update:")
            for f in result['affected_files'][:10]:
                print(f"    • {f}")
    
    if args.save:
        mapper.save_reference_map()
    
    if args.check_broken:
        broken = mapper.find_broken_references()
        if broken:
            print(f"\n⚠️ Found {len(broken)} broken references:")
            for b in broken[:20]:
                print(f"  - {b['source']} → {b['broken_ref']}")
        else:
            print("\n✅ No broken references found!")


if __name__ == "__main__":
    main()