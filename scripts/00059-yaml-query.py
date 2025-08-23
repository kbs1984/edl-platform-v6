#!/usr/bin/env python3
"""
YAML Query Interface with Performance Monitoring
Session: 00059
Purpose: Command-line query tool for YAML-indexed files with sub-second performance

Features:
- Multiple query criteria support
- Performance monitoring for all operations
- Relationship discovery
- Cache-aware incremental updates
"""

import argparse
import time
import json
from pathlib import Path
from typing import List, Dict, Any
from datetime import datetime
from collections import defaultdict

# Import our indexer
import sys
sys.path.append(str(Path(__file__).parent))
from importlib import import_module

# Dynamic import to avoid naming issues
indexer_module = import_module('00059-yaml-indexer')
YAMLIndexer = indexer_module.YAMLIndexer


class YAMLQuery:
    """Performance-optimized query interface with monitoring"""
    
    def __init__(self, root_path: str = "."):
        self.root_path = Path(root_path)
        self.performance_log = []
        
        # Initialize indexer with caching
        start = time.time()
        self.indexer = YAMLIndexer(root_path, cache_enabled=True)
        self.init_time = time.time() - start
        
        # Track performance thresholds (from research)
        self.thresholds = {
            250: 0.5,    # Current scale target
            1000: 2.0,   # Next milestone
            10000: 30.0  # Future scale
        }
    
    def measure_performance(func):
        """Decorator to measure query performance"""
        def wrapper(self, *args, **kwargs):
            start = time.time()
            result = func(self, *args, **kwargs)
            elapsed = time.time() - start
            
            # Log performance
            self.performance_log.append({
                'operation': func.__name__,
                'time': elapsed,
                'timestamp': datetime.now().isoformat(),
                'args': str(args)[:100],
                'result_count': len(result) if isinstance(result, list) else 1
            })
            
            return result
        return wrapper
    
    def load_index(self, force_rebuild: bool = False):
        """Load or build the index with incremental updates"""
        start = time.time()
        
        if force_rebuild:
            print("🔄 Forcing full rebuild...")
            self.indexer.cache.clear()
        
        # Scan files (uses cache for unchanged files)
        count = self.indexer.scan_files()
        
        elapsed = time.time() - start
        file_count = self.indexer.stats['files_processed']
        
        # Check against performance thresholds
        expected_time = self.get_expected_time(file_count)
        if elapsed <= expected_time:
            print(f"✅ Indexing performance: {elapsed:.3f}s <= {expected_time}s target")
        else:
            print(f"⚠️ Indexing slower than expected: {elapsed:.3f}s > {expected_time}s target")
        
        return count
    
    def get_expected_time(self, file_count: int) -> float:
        """Get expected time based on file count thresholds"""
        for threshold, target_time in sorted(self.thresholds.items()):
            if file_count <= threshold:
                return target_time
        return 30.0  # Max threshold
    
    @measure_performance
    def query_by_topic(self, topic: str) -> List[Dict]:
        """Query files by topic with performance tracking"""
        return self.indexer.query_by_topic(topic)
    
    @measure_performance
    def query_by_session(self, session: str) -> List[Dict]:
        """Query files by session"""
        return self.indexer.query_by_session(session)
    
    @measure_performance
    def query_by_type(self, doc_type: str) -> List[Dict]:
        """Query files by document type"""
        return self.indexer.query_by_type(doc_type)
    
    @measure_performance
    def query_by_status(self, status: str) -> List[Dict]:
        """Query files by status"""
        return self.indexer.query_by_status(status)
    
    @measure_performance
    def search(self, **criteria) -> List[Dict]:
        """Multi-criteria search"""
        return self.indexer.search(**criteria)
    
    @measure_performance
    def find_relationships(self, filepath: str) -> Dict[str, List[str]]:
        """Discover relationships for a given file"""
        relationships = {
            'implements': [],
            'related_to': [],
            'supersedes': [],
            'superseded_by': [],
            'depends_on': [],
            'depended_by': []
        }
        
        # Get the file's metadata
        rel_path = str(Path(filepath).relative_to(self.root_path))
        if rel_path not in self.indexer.metadata_index:
            return relationships
        
        file_data = self.indexer.metadata_index[rel_path]
        metadata = file_data.get('metadata', {})
        
        # Direct relationships
        for rel_type in ['implements', 'related_to', 'supersedes', 'depends_on']:
            if rel_type in metadata:
                relationships[rel_type] = metadata[rel_type]
        
        # Reverse relationships - find files that reference this one
        for other_path, other_data in self.indexer.metadata_index.items():
            other_meta = other_data.get('metadata', {})
            
            # Check if this file is superseded by another
            if 'supersedes' in other_meta and rel_path in other_meta['supersedes']:
                relationships['superseded_by'].append(other_path)
            
            # Check if this file is depended on by another
            if 'depends_on' in other_meta and rel_path in other_meta['depends_on']:
                relationships['depended_by'].append(other_path)
        
        return relationships
    
    @measure_performance
    def find_broken_references(self) -> List[Dict]:
        """Find broken cross-references in metadata"""
        broken = []
        
        for filepath, file_data in self.indexer.metadata_index.items():
            metadata = file_data.get('metadata', {})
            
            # Check all reference fields
            for field in ['implements', 'related_to', 'supersedes', 'depends_on']:
                if field in metadata:
                    for ref in metadata[field]:
                        # Check if referenced file exists
                        ref_path = self.root_path / ref
                        if not ref_path.exists():
                            broken.append({
                                'file': filepath,
                                'field': field,
                                'broken_reference': ref,
                                'type': 'missing_file'
                            })
        
        return broken
    
    @measure_performance
    def get_topic_evolution(self, topic: str) -> List[Dict]:
        """Track how a topic evolved across sessions"""
        files = self.query_by_topic(topic)
        
        # Group by session and sort
        by_session = defaultdict(list)
        for file in files:
            session = file['metadata'].get('session', 'unknown')
            by_session[session].append(file)
        
        # Build evolution timeline
        evolution = []
        for session in sorted(by_session.keys()):
            evolution.append({
                'session': session,
                'files': len(by_session[session]),
                'titles': [f['metadata'].get('title', 'Untitled') 
                          for f in by_session[session]]
            })
        
        return evolution
    
    def print_performance_report(self):
        """Print detailed performance report"""
        print("\n" + "="*60)
        print("⚡ Performance Report")
        print("="*60)
        
        print(f"\n📊 Initialization:")
        print(f"  • Indexer init time: {self.init_time:.3f}s")
        
        if self.performance_log:
            print(f"\n🔍 Query Performance:")
            for entry in self.performance_log[-10:]:  # Last 10 operations
                print(f"  • {entry['operation']}: {entry['time']*1000:.1f}ms "
                      f"({entry['result_count']} results)")
            
            # Calculate averages
            total_time = sum(e['time'] for e in self.performance_log)
            avg_time = total_time / len(self.performance_log)
            print(f"\n  Average query time: {avg_time*1000:.1f}ms")
            
            # Check against target
            if avg_time < 0.5:
                print(f"  ✅ Sub-500ms average achieved!")
            else:
                print(f"  ⚠️ Average exceeds 500ms target")
    
    def format_results(self, results: List[Dict], limit: int = 10) -> str:
        """Format query results for display"""
        output = []
        
        for i, file in enumerate(results[:limit], 1):
            metadata = file.get('metadata', {})
            output.append(f"\n{i}. {file['path']}")
            output.append(f"   Title: {metadata.get('title', 'N/A')}")
            output.append(f"   Type: {metadata.get('type', 'N/A')}")
            output.append(f"   Session: {metadata.get('session', 'N/A')}")
            output.append(f"   Status: {metadata.get('status', 'N/A')}")
            
            if 'topics' in metadata:
                output.append(f"   Topics: {', '.join(metadata['topics'])}")
        
        if len(results) > limit:
            output.append(f"\n... and {len(results) - limit} more results")
        
        return '\n'.join(output)


def main():
    """Command-line interface for YAML queries"""
    parser = argparse.ArgumentParser(
        description='Query YAML-indexed files with battle-tested performance'
    )
    
    # Query arguments
    parser.add_argument('--topic', help='Find files by topic')
    parser.add_argument('--session', help='Find files by session')
    parser.add_argument('--type', help='Find files by type')
    parser.add_argument('--status', help='Find files by status')
    
    # Advanced operations
    parser.add_argument('--relationships', help='Find relationships for a file')
    parser.add_argument('--broken', action='store_true', 
                       help='Find broken references')
    parser.add_argument('--evolution', help='Track topic evolution')
    
    # Control arguments
    parser.add_argument('--rebuild', action='store_true',
                       help='Force rebuild index')
    parser.add_argument('--performance', action='store_true',
                       help='Show performance report')
    parser.add_argument('--limit', type=int, default=10,
                       help='Limit results shown (default: 10)')
    
    args = parser.parse_args()
    
    # Initialize query interface
    print("🚀 YAML Query Interface - Battle-Tested Performance")
    print("="*60)
    
    query = YAMLQuery()
    
    # Load or rebuild index
    print("\n📁 Loading index...")
    query.load_index(force_rebuild=args.rebuild)
    
    # Execute queries based on arguments
    results = None
    
    if args.topic:
        print(f"\n🔍 Searching for topic: {args.topic}")
        results = query.query_by_topic(args.topic)
    
    elif args.session:
        print(f"\n📅 Searching for session: {args.session}")
        results = query.query_by_session(args.session)
    
    elif args.type:
        print(f"\n📋 Searching for type: {args.type}")
        results = query.query_by_type(args.type)
    
    elif args.status:
        print(f"\n📊 Searching for status: {args.status}")
        results = query.query_by_status(args.status)
    
    elif args.relationships:
        print(f"\n🔗 Finding relationships for: {args.relationships}")
        relationships = query.find_relationships(args.relationships)
        print("\nRelationships found:")
        for rel_type, files in relationships.items():
            if files:
                print(f"  {rel_type}: {', '.join(files)}")
    
    elif args.broken:
        print("\n⚠️ Finding broken references...")
        broken = query.find_broken_references()
        if broken:
            print(f"Found {len(broken)} broken references:")
            for ref in broken[:10]:
                print(f"  • {ref['file']} -> {ref['broken_reference']} ({ref['field']})")
        else:
            print("✅ No broken references found!")
    
    elif args.evolution:
        print(f"\n📈 Tracking evolution of topic: {args.evolution}")
        evolution = query.get_topic_evolution(args.evolution)
        for entry in evolution:
            print(f"\nSession {entry['session']}: {entry['files']} files")
            for title in entry['titles']:
                print(f"  • {title}")
    
    else:
        # Multi-criteria search
        criteria = {}
        if args.topic:
            criteria['topic'] = args.topic
        if args.session:
            criteria['session'] = args.session
        if args.type:
            criteria['type'] = args.type
        if args.status:
            criteria['status'] = args.status
        
        if criteria:
            print(f"\n🎯 Advanced search with criteria: {criteria}")
            results = query.search(**criteria)
        else:
            print("\n💡 No query specified. Use --help for options.")
    
    # Display results if we have them
    if results is not None:
        print(f"\n📊 Found {len(results)} results:")
        print(query.format_results(results, limit=args.limit))
    
    # Show performance report if requested
    if args.performance:
        query.print_performance_report()
    
    # Always show basic performance
    stats = query.indexer.get_statistics()
    print(f"\n⚡ Query completed in {stats['total_time']:.3f}s")
    if stats['cache_hit_rate'] > 0:
        print(f"   Cache hit rate: {stats['cache_hit_rate']:.1f}%")


if __name__ == "__main__":
    main()