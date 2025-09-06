#!/usr/bin/env python3
"""
---
session: "00059"
type: "script"
status: "active"
created: "2025-08-28"
title: "00059-yaml-indexer.py"
purpose: "Production-ready YAML indexer using python-frontmatter with caching"
language: "python"
category: "yaml"
topics: ["yaml"]
priority: "P2"
domain: "core"
---
"""
"""
YAML Indexer with Battle-Tested Patterns
Session: 00059
Purpose: Production-ready YAML indexer using python-frontmatter with caching

Based on patterns from:
- Hugo (13x performance with flat schemas)
- GitHub Docs (JSON Schema validation)
- gray-matter (battle-tested parsing)
"""

import frontmatter
import json
import time
import hashlib
import pickle
from pathlib import Path
from typing import Dict, List, Any, Optional, Set
from datetime import datetime
import jsonschema
from collections import defaultdict

class YAMLIndexer:
    """Production YAML indexer with caching and performance optimization"""
    
    def __init__(self, root_path: str = ".", cache_enabled: bool = True):
        self.root_path = Path(root_path)
        self.cache_enabled = cache_enabled
        self.cache_file = self.root_path / ".yaml-index-cache.pkl"
        self.schema_file = self.root_path / "schemas/00059-yaml-frontmatter-schema.json"
        
        # Performance tracking
        self.stats = {
            'files_processed': 0,
            'cache_hits': 0,
            'cache_misses': 0,
            'validation_errors': 0,
            'parse_time': 0.0,
            'total_time': 0.0
        }
        
        # Load schema for validation
        self.schema = self.load_json_schema()
        
        # Initialize or load cache
        self.cache = self.load_cache() if cache_enabled else {}
        self.file_hashes = {}
        
        # Index storage (flat structure for performance)
        self.metadata_index = {}
        self.topic_index = defaultdict(list)
        self.session_index = defaultdict(list)
        self.type_index = defaultdict(list)
        self.status_index = defaultdict(list)
        
    def load_json_schema(self) -> Optional[Dict]:
        """Load JSON Schema for validation"""
        if self.schema_file.exists():
            with open(self.schema_file, 'r') as f:
                return json.load(f)
        return None
    
    def load_cache(self) -> Dict:
        """Load cached index from disk"""
        if self.cache_file.exists():
            try:
                with open(self.cache_file, 'rb') as f:
                    cache_data = pickle.load(f)
                    print(f"✓ Loaded cache with {len(cache_data)} entries")
                    return cache_data
            except Exception as e:
                print(f"⚠ Cache load failed: {e}")
        return {}
    
    def save_cache(self):
        """Save cache to disk for next run"""
        if self.cache_enabled:
            try:
                with open(self.cache_file, 'wb') as f:
                    pickle.dump(self.cache, f)
                print(f"✓ Saved cache with {len(self.cache)} entries")
            except Exception as e:
                print(f"⚠ Cache save failed: {e}")
    
    def get_file_hash(self, filepath: Path) -> str:
        """Get hash of file's frontmatter for change detection
        Enhanced in Session 98 to handle bash comment YAML
        """
        try:
            # Special handling for bash scripts and SQL files with raw or comment YAML
            if filepath.suffix in ['.sh', '.sql']:
                with open(filepath, 'r', encoding='utf-8') as f:
                    lines = f.readlines()[:50]  # Read first 50 lines max
                    
                    # Handle SQL files with comment YAML
                    if filepath.suffix == '.sql' and lines and lines[0].strip() == '-- ---':
                        yaml_content = []
                        for line in lines[1:]:
                            if line.strip() == '-- ---':
                                break
                            elif line.startswith('--'):
                                # Remove comment prefix and add to YAML
                                yaml_content.append(line[2:].lstrip())
                        if yaml_content:
                            return hashlib.md5(''.join(yaml_content).encode()).hexdigest()
                    # Handle bash scripts
                    elif lines and lines[0].startswith('#!/bin/bash'):
                        # Check for raw YAML (Session 97 format)
                        if len(lines) > 1 and lines[1].strip() == '---':
                            yaml_content = []
                            for line in lines[2:]:
                                if line.strip() == '---':
                                    break
                                yaml_content.append(line)
                            if yaml_content:
                                return hashlib.md5(''.join(yaml_content).encode()).hexdigest()
                        # Check for comment YAML (older format)
                        elif len(lines) > 1 and lines[1].strip() == '# ---':
                            yaml_content = []
                            for line in lines[2:]:
                                if line.strip() == '# ---':
                                    break
                                elif line.startswith('#'):
                                    yaml_content.append(line)
                            if yaml_content:
                                return hashlib.md5(''.join(yaml_content).encode()).hexdigest()
            
            # Standard frontmatter handling
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read(2000)  # Read first 2KB (frontmatter is usually small)
                if '---' in content:
                    # Extract just the frontmatter portion
                    parts = content.split('---')
                    if len(parts) >= 3:
                        frontmatter_content = parts[1]
                        return hashlib.md5(frontmatter_content.encode()).hexdigest()
        except Exception:
            pass
        return hashlib.md5(str(filepath.stat().st_mtime).encode()).hexdigest()
    
    def parse_file(self, filepath: Path) -> Optional[Dict]:
        """Parse a single file using python-frontmatter (battle-tested)
        Enhanced in Session 98 to handle bash scripts with comment YAML
        """
        start_time = time.time()
        
        try:
            # Check cache first
            file_hash = self.get_file_hash(filepath)
            cache_key = str(filepath.relative_to(self.root_path))
            
            if self.cache_enabled and cache_key in self.cache:
                cached_data = self.cache[cache_key]
                if cached_data.get('hash') == file_hash:
                    self.stats['cache_hits'] += 1
                    return cached_data['data']
            
            self.stats['cache_misses'] += 1
            
            # Session 98 Enhancement: Handle bash scripts with comment YAML
            metadata = {}
            content = ""
            has_frontmatter = False
            
            # Check if this is a bash script or SQL file with raw or comment YAML
            if filepath.suffix in ['.sh', '.sql']:
                with open(filepath, 'r', encoding='utf-8') as f:
                    lines = f.readlines()
                    
                    # Handle SQL files with comment YAML (Session 99 addition)
                    if filepath.suffix == '.sql' and lines and lines[0].strip() == '-- ---':
                        # Extract YAML from SQL comments
                        yaml_lines = []
                        content_start = 0
                        
                        for i, line in enumerate(lines[1:], 1):
                            if line.strip() == '-- ---':
                                content_start = i + 1
                                break
                            elif line.startswith('--'):
                                # Remove comment prefix and add to YAML
                                yaml_lines.append(line[2:].lstrip())
                        
                        # Parse the YAML from comments
                        if yaml_lines:
                            try:
                                import yaml
                                yaml_content = ''.join(yaml_lines)
                                metadata = yaml.safe_load(yaml_content)
                                has_frontmatter = True
                                content = ''.join(lines[content_start:])
                            except Exception as e:
                                print(f"⚠ Error parsing SQL YAML in {filepath}: {e}")
                    
                    # Look for bash shebang
                    elif lines and lines[0].startswith('#!/bin/bash'):
                        # Check for raw YAML (Session 97 format)
                        if len(lines) > 1 and lines[1].strip() == '---':
                            # Raw YAML after shebang - extract it
                            yaml_lines = []
                            content_start = 0
                            
                            for i, line in enumerate(lines[2:], 2):
                                if line.strip() == '---':
                                    content_start = i + 1
                                    break
                                yaml_lines.append(line)
                            
                            # Parse the raw YAML
                            if yaml_lines:
                                try:
                                    import yaml
                                    yaml_content = ''.join(yaml_lines)
                                    metadata = yaml.safe_load(yaml_content)
                                    has_frontmatter = True
                                    content = ''.join(lines[content_start:])
                                except Exception as e:
                                    print(f"⚠ Error parsing bash YAML in {filepath}: {e}")
                        
                        # Check for comment YAML (older format)
                        elif len(lines) > 1 and lines[1].strip() == '# ---':
                            # Extract YAML from comments
                            yaml_lines = []
                            in_yaml = False
                            content_start = 0
                            
                            for i, line in enumerate(lines[1:], 1):
                                if line.strip() == '# ---':
                                    if not in_yaml:
                                        in_yaml = True
                                    else:
                                        # End of YAML section
                                        content_start = i + 1
                                        break
                                elif in_yaml and line.startswith('#'):
                                    # Remove comment marker and add to YAML
                                    yaml_line = line[1:].lstrip()
                                    if yaml_line:  # Skip empty comment lines
                                        yaml_lines.append(yaml_line)
                            
                            # Parse the extracted YAML
                            if yaml_lines:
                                try:
                                    import yaml
                                    yaml_content = ''.join(yaml_lines)
                                    metadata = yaml.safe_load(yaml_content)
                                    has_frontmatter = True
                                    content = ''.join(lines[content_start:])
                                except Exception as e:
                                    print(f"⚠ Error parsing bash comment YAML in {filepath}: {e}")
            
            # Check if this is a Python script with docstring YAML
            elif filepath.suffix == '.py':
                with open(filepath, 'r', encoding='utf-8') as f:
                    content_all = f.read()
                    
                    # Look for docstring with YAML
                    if content_all.startswith('#!/usr/bin/env python3') or content_all.startswith('#!/usr/bin/python'):
                        # Find the docstring
                        docstring_start = content_all.find('"""')
                        if docstring_start != -1:
                            docstring_end = content_all.find('"""', docstring_start + 3)
                            if docstring_end != -1:
                                docstring = content_all[docstring_start + 3:docstring_end]
                                
                                # Check if docstring contains YAML
                                if '---' in docstring:
                                    lines = docstring.split('\n')
                                    yaml_lines = []
                                    in_yaml = False
                                    
                                    for line in lines:
                                        if line.strip() == '---':
                                            if not in_yaml:
                                                in_yaml = True
                                            else:
                                                break
                                        elif in_yaml:
                                            yaml_lines.append(line)
                                    
                                    if yaml_lines:
                                        try:
                                            import yaml
                                            yaml_content = '\n'.join(yaml_lines)
                                            metadata = yaml.safe_load(yaml_content)
                                            has_frontmatter = True
                                            content = content_all[docstring_end + 3:]
                                        except Exception as e:
                                            print(f"⚠ Error parsing Python docstring YAML in {filepath}: {e}")
            
            # If not a script or no YAML found, use standard parsing
            if not has_frontmatter:
                post = frontmatter.load(filepath)
                metadata = post.metadata
                content = post.content
                has_frontmatter = bool(post.metadata)
            
            # Build result
            result = {
                'metadata': metadata,
                'content_preview': content[:200] if content else '',
                'path': str(filepath.relative_to(self.root_path)),
                'absolute_path': str(filepath),
                'has_frontmatter': has_frontmatter
            }
            
            # Cache the result
            if self.cache_enabled:
                self.cache[cache_key] = {
                    'hash': file_hash,
                    'data': result,
                    'timestamp': time.time()
                }
            
            self.stats['parse_time'] += (time.time() - start_time)
            return result
            
        except Exception as e:
            print(f"⚠ Error parsing {filepath}: {e}")
            return None
    
    def validate_metadata(self, metadata: Dict, filepath: str = "") -> List[str]:
        """Validate metadata against JSON Schema (GitHub Docs pattern)"""
        errors = []
        
        if not self.schema:
            # Basic validation if schema not loaded
            required = ['session', 'type', 'status', 'created', 'title', 'purpose']
            for field in required:
                if field not in metadata:
                    errors.append(f"Missing required field: {field}")
        else:
            # Full JSON Schema validation
            try:
                jsonschema.validate(metadata, self.schema)
            except jsonschema.ValidationError as e:
                errors.append(f"Schema validation error: {e.message}")
            except Exception as e:
                errors.append(f"Validation error: {str(e)}")
        
        if errors:
            self.stats['validation_errors'] += 1
            if filepath:
                print(f"⚠ Validation errors in {filepath}:")
                for error in errors:
                    print(f"  - {error}")
        
        return errors
    
    def build_indexes(self, file_data: Dict):
        """Build flat indexes for fast querying (Hugo pattern)"""
        metadata = file_data.get('metadata', {})
        path = file_data['path']
        
        # Store in main index
        self.metadata_index[path] = file_data
        
        # Build topic index (flat structure)
        if 'topics' in metadata:
            for topic in metadata['topics']:
                self.topic_index[topic].append(path)
        
        # Build session index
        if 'session' in metadata:
            self.session_index[metadata['session']].append(path)
        
        # Build type index
        if 'type' in metadata:
            self.type_index[metadata['type']].append(path)
        
        # Build status index
        if 'status' in metadata:
            self.status_index[metadata['status']].append(path)
    
    def scan_files(self, pattern: str = "**/*.md", incremental: bool = True) -> int:
        """Scan and index all matching files
        Enhanced in Session 98 to scan scripts too
        """
        start_time = time.time()
        
        # Session 98+99: Scan multiple file types including scripts and SQL
        patterns = ["**/*.md", "**/*.sh", "**/*.py", "**/*.sql"]
        files = []
        for p in patterns:
            files.extend(self.root_path.glob(p))
        
        print(f"\n📊 Scanning {len(files)} files...")
        
        # Process files
        processed = 0
        for filepath in files:
            if filepath.is_file():
                file_data = self.parse_file(filepath)
                if file_data and file_data.get('has_frontmatter'):
                    # Validate if frontmatter exists
                    self.validate_metadata(
                        file_data['metadata'], 
                        file_data['path']
                    )
                    # Build indexes
                    self.build_indexes(file_data)
                    processed += 1
                
                self.stats['files_processed'] += 1
        
        # Save cache for next run
        self.save_cache()
        
        # Calculate stats
        self.stats['total_time'] = time.time() - start_time
        
        return processed
    
    def query_by_topic(self, topic: str) -> List[Dict]:
        """Query files by topic (optimized with flat index)"""
        paths = self.topic_index.get(topic, [])
        return [self.metadata_index[path] for path in paths]
    
    def query_by_session(self, session: str) -> List[Dict]:
        """Query files by session"""
        paths = self.session_index.get(session, [])
        return [self.metadata_index[path] for path in paths]
    
    def query_by_type(self, doc_type: str) -> List[Dict]:
        """Query files by type"""
        paths = self.type_index.get(doc_type, [])
        return [self.metadata_index[path] for path in paths]
    
    def query_by_status(self, status: str) -> List[Dict]:
        """Query files by status"""
        paths = self.status_index.get(status, [])
        return [self.metadata_index[path] for path in paths]
    
    def search(self, **criteria) -> List[Dict]:
        """Advanced search with multiple criteria"""
        results = set(self.metadata_index.keys())
        
        # Apply each criterion as a filter
        if 'topic' in criteria:
            topic_paths = set(self.topic_index.get(criteria['topic'], []))
            results = results.intersection(topic_paths)
        
        if 'session' in criteria:
            session_paths = set(self.session_index.get(criteria['session'], []))
            results = results.intersection(session_paths)
        
        if 'type' in criteria:
            type_paths = set(self.type_index.get(criteria['type'], []))
            results = results.intersection(type_paths)
        
        if 'status' in criteria:
            status_paths = set(self.status_index.get(criteria['status'], []))
            results = results.intersection(status_paths)
        
        # Return full metadata for matching files
        return [self.metadata_index[path] for path in results]
    
    def get_statistics(self) -> Dict:
        """Get performance and index statistics"""
        return {
            **self.stats,
            'total_indexed': len(self.metadata_index),
            'unique_topics': len(self.topic_index),
            'unique_sessions': len(self.session_index),
            'cache_size': len(self.cache),
            'cache_hit_rate': (
                self.stats['cache_hits'] / 
                max(1, self.stats['cache_hits'] + self.stats['cache_misses'])
            ) * 100
        }
    
    def print_summary(self):
        """Print indexing summary with performance metrics"""
        stats = self.get_statistics()
        
        print("\n" + "="*60)
        print("📊 YAML Indexing Complete")
        print("="*60)
        
        print(f"\n✅ Performance Metrics:")
        print(f"  • Total time: {stats['total_time']:.3f} seconds")
        print(f"  • Parse time: {stats['parse_time']:.3f} seconds")
        print(f"  • Files/second: {stats['files_processed']/max(0.001, stats['total_time']):.1f}")
        
        print(f"\n📁 Index Statistics:")
        print(f"  • Files processed: {stats['files_processed']}")
        print(f"  • Files indexed: {stats['total_indexed']}")
        print(f"  • Validation errors: {stats['validation_errors']}")
        
        print(f"\n🏷️ Content Organization:")
        print(f"  • Unique topics: {stats['unique_topics']}")
        print(f"  • Unique sessions: {stats['unique_sessions']}")
        print(f"  • Document types: {len(self.type_index)}")
        
        if self.cache_enabled:
            print(f"\n⚡ Cache Performance:")
            print(f"  • Cache hits: {stats['cache_hits']}")
            print(f"  • Cache misses: {stats['cache_misses']}")
            print(f"  • Hit rate: {stats['cache_hit_rate']:.1f}%")
        
        # Performance target check
        target = 0.5  # 0.5 seconds for 250 files
        if stats['total_time'] <= target:
            print(f"\n🎯 Performance Target: ✅ ACHIEVED ({stats['total_time']:.3f}s <= {target}s)")
        else:
            print(f"\n🎯 Performance Target: ⚠️ MISSED ({stats['total_time']:.3f}s > {target}s)")


def main():
    """Demo the indexer with battle-tested patterns"""
    print("🚀 YAML Indexer - Battle-Tested Implementation")
    print("="*60)
    
    # Initialize indexer with caching
    indexer = YAMLIndexer(cache_enabled=True)
    
    # Scan all markdown files
    indexed_count = indexer.scan_files()
    
    # Print performance summary
    indexer.print_summary()
    
    # Demo queries
    print("\n" + "="*60)
    print("🔍 Query Examples")
    print("="*60)
    
    # Query by topic
    yaml_files = indexer.query_by_topic("yaml")
    if yaml_files:
        print(f"\n📝 Files with topic 'yaml': {len(yaml_files)}")
        for file in yaml_files[:3]:
            print(f"  • {file['path']}: {file['metadata'].get('title', 'No title')}")
    
    # Query by session
    session_files = indexer.query_by_session("00058")
    if session_files:
        print(f"\n📅 Files from session 00058: {len(session_files)}")
        for file in session_files[:3]:
            print(f"  • {file['path']}: {file['metadata'].get('title', 'No title')}")
    
    # Query by type
    spec_files = indexer.query_by_type("specification")
    if spec_files:
        print(f"\n📋 Specification files: {len(spec_files)}")
        for file in spec_files[:3]:
            print(f"  • {file['path']}: {file['metadata'].get('title', 'No title')}")
    
    # Advanced search
    results = indexer.search(status="current", domain="core")
    if results:
        print(f"\n🎯 Current core domain files: {len(results)}")
        for file in results[:3]:
            print(f"  • {file['path']}: {file['metadata'].get('title', 'No title')}")


if __name__ == "__main__":
    main()