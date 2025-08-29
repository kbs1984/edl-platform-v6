#!/usr/bin/env python3
"""
---
session: "00058"
type: "script"
status: "unknown"
created: "2025-08-28"
title: "00058-yaml-query-demo.py"
purpose: "Script for yaml query demo"
language: "python"
category: "yaml"
topics: ["yaml"]
priority: "P2"
domain: "core"
---
"""
"""
YAML File Organization Query Demo

Demonstrates how the YAML indexing system would work for file discovery
and cross-referencing.
"""

import os
import yaml
import glob
from typing import Dict, List, Any
from datetime import datetime

class YAMLFileIndex:
    def __init__(self, root_path: str = "."):
        self.root_path = root_path
        self.files_metadata = {}
        self.scan_files()
    
    def scan_files(self):
        """Scan all markdown files and extract YAML frontmatter"""
        pattern = os.path.join(self.root_path, "**/*.md")
        for file_path in glob.glob(pattern, recursive=True):
            try:
                metadata = self.extract_frontmatter(file_path)
                if metadata:
                    rel_path = os.path.relpath(file_path, self.root_path)
                    self.files_metadata[rel_path] = metadata
            except Exception as e:
                print(f"Error processing {file_path}: {e}")
    
    def extract_frontmatter(self, file_path: str) -> Dict[str, Any]:
        """Extract YAML frontmatter from a markdown file"""
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            if content.startswith('---\n'):
                parts = content.split('\n---\n', 1)
                if len(parts) >= 2:
                    yaml_content = parts[0][4:]  # Remove first '---\n'
                    return yaml.safe_load(yaml_content)
            return None
        except Exception:
            return None
    
    def query_by_topic(self, topic: str) -> List[str]:
        """Find all files containing a specific topic"""
        results = []
        for file_path, metadata in self.files_metadata.items():
            topics = metadata.get('topics', [])
            if topic.lower() in [t.lower() for t in topics]:
                results.append(file_path)
        return sorted(results)
    
    def query_by_session(self, session: str) -> List[str]:
        """Find all files from a specific session"""
        results = []
        for file_path, metadata in self.files_metadata.items():
            if metadata.get('session') == session:
                results.append(file_path)
        return sorted(results)
    
    def query_by_status(self, status: str) -> List[str]:
        """Find all files with specific status"""
        results = []
        for file_path, metadata in self.files_metadata.items():
            if metadata.get('status') == status:
                results.append(file_path)
        return sorted(results)
    
    def find_related(self, file_path: str) -> Dict[str, List[str]]:
        """Find all files related to the given file"""
        if file_path not in self.files_metadata:
            return {}
        
        metadata = self.files_metadata[file_path]
        related = {
            'related_to': metadata.get('related_to', []),
            'implements': metadata.get('implements', []),
            'supersedes': metadata.get('supersedes', []),
            'depends_on': metadata.get('depends_on', []),
            'topic_overlap': []
        }
        
        # Find files with overlapping topics
        file_topics = set(metadata.get('topics', []))
        for other_file, other_meta in self.files_metadata.items():
            if other_file != file_path:
                other_topics = set(other_meta.get('topics', []))
                overlap = file_topics & other_topics
                if len(overlap) >= 2:  # 2+ shared topics
                    related['topic_overlap'].append(other_file)
        
        return related
    
    def get_topic_evolution(self, topic: str) -> List[Dict]:
        """Show how a topic evolved across sessions"""
        topic_files = []
        for file_path, metadata in self.files_metadata.items():
            topics = metadata.get('topics', [])
            if topic.lower() in [t.lower() for t in topics]:
                topic_files.append({
                    'file': file_path,
                    'session': metadata.get('session', 'unknown'),
                    'created': metadata.get('created', ''),
                    'title': metadata.get('title', 'No title'),
                    'purpose': metadata.get('purpose', '')
                })
        
        # Sort by session
        return sorted(topic_files, key=lambda x: x['session'])
    
    def health_check(self) -> Dict[str, Any]:
        """Check the health of the YAML metadata system"""
        total_files = len(self.files_metadata)
        files_with_yaml = len([f for f in self.files_metadata if self.files_metadata[f]])
        
        # Check for required fields
        required_fields = ['session', 'type', 'status', 'created', 'title', 'purpose']
        files_missing_fields = []
        
        for file_path, metadata in self.files_metadata.items():
            missing = []
            for field in required_fields:
                if field not in metadata:
                    missing.append(field)
            if missing:
                files_missing_fields.append({
                    'file': file_path,
                    'missing_fields': missing
                })
        
        return {
            'total_files': total_files,
            'yaml_compliance': f"{files_with_yaml}/{total_files} ({100*files_with_yaml/total_files:.1f}%)" if total_files > 0 else "0/0 (0%)",
            'files_missing_required_fields': len(files_missing_fields),
            'missing_field_details': files_missing_fields[:5]  # Show first 5
        }

def main():
    print("🗃️  YAML File Organization System - Query Demo")
    print("=" * 60)
    
    # Initialize the index
    index = YAMLFileIndex()
    
    # Health check
    health = index.health_check()
    print(f"\n📊 System Health:")
    print(f"   Total files scanned: {health['total_files']}")
    print(f"   YAML compliance: {health['yaml_compliance']}")
    print(f"   Missing required fields: {health['files_missing_required_fields']}")
    
    # Demo queries
    print(f"\n🔍 Demo Queries:")
    
    # Query by topic
    org_files = index.query_by_topic("organization")
    print(f"\n   Files about 'organization' ({len(org_files)} found):")
    for file_path in org_files[:3]:  # Show first 3
        metadata = index.files_metadata[file_path]
        print(f"     • {file_path}")
        print(f"       Session {metadata.get('session', 'N/A')}: {metadata.get('title', 'No title')}")
    
    # Query by session
    session_58_files = index.query_by_session("00058")
    print(f"\n   Session 00058 files ({len(session_58_files)} found):")
    for file_path in session_58_files:
        metadata = index.files_metadata[file_path]
        print(f"     • {file_path}")
        print(f"       {metadata.get('type', 'unknown')} - {metadata.get('title', 'No title')}")
    
    # Show topic evolution
    print(f"\n📈 Topic Evolution Example:")
    if org_files:
        evolution = index.get_topic_evolution("organization")
        print(f"   'organization' topic evolution ({len(evolution)} files):")
        for entry in evolution[:3]:  # Show first 3
            print(f"     Session {entry['session']}: {entry['title']}")
    
    # Show relationships
    if org_files:
        sample_file = org_files[0]
        related = index.find_related(sample_file)
        print(f"\n🔗 Relationships for '{sample_file}':")
        for rel_type, files in related.items():
            if files:
                print(f"     {rel_type}: {len(files)} files")

if __name__ == "__main__":
    main()