#!/usr/bin/env python3
"""
---
session: "00062"
type: "script"
status: "unknown"
created: "2025-08-28"
title: "00062-project-insights.py"
purpose: "Script for project insights"
language: "python"
category: "utility"
topics: ["utility"]
priority: "P2"
domain: "core"
---
"""
"""
Project Insights from YAML Metadata
Session 00062 - Unlock project understanding through metadata analysis
"""

import frontmatter
from pathlib import Path
from collections import defaultdict
from datetime import datetime, timedelta
import json
import sys

class ProjectInsights:
    def __init__(self):
        self.stats = defaultdict(lambda: defaultdict(int))
        self.relationships = defaultdict(list)
        self.timeline = defaultdict(list)
        self.files_with_yaml = 0
        self.files_without_yaml = 0
        
    def scan_project(self):
        """Scan all markdown files and extract metadata"""
        print("Scanning project files...", file=sys.stderr)
        
        for filepath in Path('.').glob('**/*.md'):
            # Skip node_modules and other vendor directories
            if any(part.startswith('.') or part == 'node_modules' for part in filepath.parts):
                continue
                
            try:
                with open(filepath, 'r', encoding='utf-8') as f:
                    post = frontmatter.load(f)
                    if post.metadata:
                        self.files_with_yaml += 1
                        self.process_file(filepath, post.metadata)
                    else:
                        self.files_without_yaml += 1
            except Exception as e:
                # Silently skip problematic files
                pass
                
    def process_file(self, filepath, metadata):
        """Extract insights from metadata"""
        # Track by session
        if 'session' in metadata:
            session = str(metadata['session'])
            self.stats['sessions'][session] += 1
            self.timeline[session].append(str(filepath))
            
        # Track by type
        if 'type' in metadata:
            doc_type = metadata['type']
            self.stats['types'][doc_type] += 1
            
        # Track by domain
        if 'domain' in metadata:
            domain = metadata['domain']
            self.stats['domains'][domain] += 1
            
        # Track by priority
        if 'priority' in metadata:
            priority = metadata['priority']
            self.stats['priorities'][priority] += 1
            
        # Track by status
        if 'status' in metadata:
            status = metadata['status']
            self.stats['status'][status] += 1
            
        # Track topics
        if 'topics' in metadata:
            topics = metadata.get('topics', [])
            if isinstance(topics, list):
                for topic in topics:
                    self.stats['topics'][topic] += 1
            
        # Track relationships
        if 'related_to' in metadata:
            related = metadata.get('related_to', [])
            if isinstance(related, list):
                for rel in related:
                    self.relationships[str(filepath)].append(rel)
                    
        # Track review dates
        if 'review_date' in metadata:
            try:
                review = datetime.strptime(metadata['review_date'], '%Y-%m-%d')
                if review < datetime.now():
                    self.stats['overdue']['reviews'] += 1
            except:
                pass
                
    def generate_report(self):
        """Generate comprehensive insights report"""
        print("=" * 60)
        print("🔍 PROJECT INSIGHTS DASHBOARD")
        print("=" * 60)
        print()
        
        # Coverage overview
        total_files = self.files_with_yaml + self.files_without_yaml
        coverage_percent = (self.files_with_yaml * 100 / total_files) if total_files > 0 else 0
        print("📊 METADATA COVERAGE:")
        print(f"  Files with YAML: {self.files_with_yaml}/{total_files} ({coverage_percent:.1f}%)")
        print(f"  Files without: {self.files_without_yaml}")
        print()
        
        # Session productivity
        if self.stats['sessions']:
            print("📅 SESSION PRODUCTIVITY:")
            session_items = sorted(self.stats['sessions'].items())
            
            # Show last 10 sessions
            recent_sessions = session_items[-10:] if len(session_items) > 10 else session_items
            for session, count in recent_sessions:
                bar = "█" * min(count, 30)  # Cap bar length at 30
                print(f"  Session {session}: {bar} ({count} files)")
            
            # Most productive session
            if session_items:
                most_productive = max(session_items, key=lambda x: x[1])
                print(f"\n  🏆 Most productive: Session {most_productive[0]} ({most_productive[1]} files)")
            print()
        
        # Work distribution by type
        if self.stats['types']:
            print("📊 WORK DISTRIBUTION BY TYPE:")
            for type_name, count in sorted(self.stats['types'].items(), key=lambda x: x[1], reverse=True):
                percent = count * 100 / sum(self.stats['types'].values())
                bar = "▓" * int(percent / 2)  # Visual bar
                print(f"  {type_name:15} {bar} {count:3} ({percent:.1f}%)")
            print()
        
        # Domain focus
        if self.stats['domains']:
            print("🎯 DOMAIN FOCUS:")
            total_domain_files = sum(self.stats['domains'].values())
            for domain, count in sorted(self.stats['domains'].items(), key=lambda x: x[1], reverse=True):
                percent = count * 100 / total_domain_files
                print(f"  {domain:15} {count:3} files ({percent:.1f}%)")
            print()
        
        # Priority distribution
        if self.stats['priorities']:
            print("⚡ PRIORITY DISTRIBUTION:")
            for priority, count in sorted(self.stats['priorities'].items()):
                print(f"  {priority}: {count} files")
            print()
        
        # Document status
        if self.stats['status']:
            print("📈 DOCUMENT STATUS:")
            for status, count in sorted(self.stats['status'].items(), key=lambda x: x[1], reverse=True):
                print(f"  {status:12} {count:3} files")
            print()
        
        # Popular topics
        if self.stats['topics']:
            print("🏷️  TOP TOPICS:")
            top_topics = sorted(self.stats['topics'].items(), key=lambda x: x[1], reverse=True)[:10]
            for topic, count in top_topics:
                print(f"  {topic:20} {count:3} occurrences")
            print()
        
        # Relationship network
        if self.relationships:
            connected_files = len(self.relationships)
            total_connections = sum(len(v) for v in self.relationships.values())
            avg_connections = total_connections/connected_files if connected_files else 0
            
            print(f"🔗 RELATIONSHIP NETWORK:")
            print(f"  Connected files: {connected_files}")
            print(f"  Total connections: {total_connections}")
            print(f"  Average connections: {avg_connections:.1f}")
            
            # Most connected files
            if connected_files > 0:
                most_connected = sorted(self.relationships.items(), key=lambda x: len(x[1]), reverse=True)[:3]
                print("\n  Most connected files:")
                for file, connections in most_connected:
                    print(f"    - {Path(file).name}: {len(connections)} connections")
            print()
        
        # Health metrics
        if self.stats['overdue']['reviews'] > 0:
            print(f"⚠️  MAINTENANCE NEEDED:")
            print(f"  Overdue reviews: {self.stats['overdue']['reviews']} documents")
            print()
        
        # Insights and recommendations
        print("💡 KEY INSIGHTS:")
        
        # Session trends
        if len(self.stats['sessions']) > 5:
            recent_5 = list(self.stats['sessions'].items())[-5:]
            avg_recent = sum(x[1] for x in recent_5) / 5
            older_5 = list(self.stats['sessions'].items())[-10:-5] if len(self.stats['sessions']) > 10 else []
            if older_5:
                avg_older = sum(x[1] for x in older_5) / len(older_5)
                if avg_recent > avg_older * 1.2:
                    print(f"  📈 Productivity trending UP ({avg_recent:.1f} vs {avg_older:.1f} files/session)")
                elif avg_recent < avg_older * 0.8:
                    print(f"  📉 Productivity trending DOWN ({avg_recent:.1f} vs {avg_older:.1f} files/session)")
                else:
                    print(f"  ➡️  Productivity stable (~{avg_recent:.1f} files/session)")
        
        # Documentation gaps
        if self.stats['domains']:
            least_documented = min(self.stats['domains'].items(), key=lambda x: x[1])
            if least_documented[1] < 5:
                print(f"  ⚠️  {least_documented[0]} domain needs more documentation ({least_documented[1]} files)")
        
        # Type balance
        if 'log' in self.stats['types'] and 'guide' in self.stats['types']:
            log_ratio = self.stats['types']['log'] / sum(self.stats['types'].values())
            if log_ratio > 0.5:
                print(f"  📝 Heavy on logs ({log_ratio:.0%}) - consider more guides/specs")
        
        # Review backlog
        if self.stats['overdue']['reviews'] > 5:
            print(f"  🔄 Schedule review session ({self.stats['overdue']['reviews']} overdue)")
        
        # Connection density
        if self.relationships:
            connected_ratio = len(self.relationships) / self.files_with_yaml if self.files_with_yaml else 0
            if connected_ratio < 0.2:
                print(f"  🔗 Low cross-referencing ({connected_ratio:.0%} connected)")
        
        print()
        print("💡 RECOMMENDATIONS:")
        
        # Coverage recommendation
        if coverage_percent < 10:
            print(f"  1. Increase YAML coverage (currently {coverage_percent:.1f}%, target >10%)")
        
        # Domain balance
        if self.stats['domains'] and least_documented[1] < 5:
            print(f"  2. Focus on {least_documented[0]} domain documentation")
        
        # Priority focus
        if 'P2' in self.stats['priorities'] and 'P0' in self.stats['priorities']:
            if self.stats['priorities']['P2'] > self.stats['priorities']['P0']:
                print("  3. Rebalance priority - more P0 work needed")
        
        # Maintenance
        if self.stats['overdue']['reviews'] > 0:
            print(f"  4. Review {self.stats['overdue']['reviews']} overdue documents")
        
        # Connectivity
        if self.relationships and len(self.relationships) < 10:
            print("  5. Improve cross-referencing between documents")
        
        print()
        print("---")
        print("Generated by Session 00062 Project Insights Dashboard")

if __name__ == '__main__':
    insights = ProjectInsights()
    insights.scan_project()
    insights.generate_report()