#!/usr/bin/env python3

"""
00063-project-trends.py
Project trends and analytics over time
Created: Session 00063
Usage: python3 scripts/00063-project-trends.py [--days 7]
"""

import sys
import json
import subprocess
from collections import defaultdict
from datetime import datetime, timedelta
from pathlib import Path

def get_yaml_files():
    """Get all files with YAML frontmatter"""
    yaml_files = []
    
    for md_file in Path(".").rglob("*.md"):
        if md_file.is_file():
            try:
                content = md_file.read_text()
                if content.startswith("---\n"):
                    # Extract YAML
                    yaml_end = content.find("\n---\n", 4)
                    if yaml_end > 0:
                        yaml_content = content[4:yaml_end]
                        yaml_data = {}
                        for line in yaml_content.split('\n'):
                            if ':' in line:
                                key, value = line.split(':', 1)
                                yaml_data[key.strip()] = value.strip().strip('"')
                        yaml_files.append((md_file, yaml_data))
            except:
                pass
    
    return yaml_files

def analyze_session_trends(yaml_files):
    """Analyze trends by session"""
    session_metrics = defaultdict(lambda: {"files": 0, "types": [], "priorities": []})
    
    for file_path, yaml_data in yaml_files:
        session = yaml_data.get("session", "unknown")
        if session != "unknown":
            session_metrics[session]["files"] += 1
            if "type" in yaml_data:
                session_metrics[session]["types"].append(yaml_data["type"])
            if "priority" in yaml_data:
                session_metrics[session]["priorities"].append(yaml_data["priority"])
    
    return session_metrics

def analyze_time_trends(yaml_files):
    """Analyze trends over time"""
    date_metrics = defaultdict(lambda: {"created": 0, "modified": 0})
    
    for file_path, yaml_data in yaml_files:
        created = yaml_data.get("created")
        modified = yaml_data.get("modified")
        
        if created:
            date_metrics[created]["created"] += 1
        if modified:
            date_metrics[modified]["modified"] += 1
    
    return date_metrics

def analyze_domain_distribution(yaml_files):
    """Analyze domain distribution"""
    domain_counts = defaultdict(int)
    domain_priorities = defaultdict(list)
    
    for file_path, yaml_data in yaml_files:
        domain = yaml_data.get("domain", "unknown")
        priority = yaml_data.get("priority", "unknown")
        
        domain_counts[domain] += 1
        if priority != "unknown":
            domain_priorities[domain].append(priority)
    
    return domain_counts, domain_priorities

def calculate_productivity_trend(session_metrics):
    """Calculate productivity trends"""
    recent_sessions = []
    
    # Get numeric sessions
    for session, metrics in session_metrics.items():
        try:
            session_num = int(session)
            if 50 <= session_num <= 63:  # Recent sessions
                recent_sessions.append((session_num, metrics["files"]))
        except:
            pass
    
    recent_sessions.sort()
    
    if len(recent_sessions) >= 3:
        # Calculate trend
        first_half = sum(m[1] for m in recent_sessions[:len(recent_sessions)//2])
        second_half = sum(m[1] for m in recent_sessions[len(recent_sessions)//2:])
        
        if first_half > 0:
            trend = ((second_half - first_half) / first_half) * 100
            return trend
    
    return 0

def main():
    print("📊 PROJECT TRENDS ANALYSIS")
    print("=" * 60)
    print(f"Generated: {datetime.now().isoformat()}")
    print()
    
    # Get all YAML files
    yaml_files = get_yaml_files()
    print(f"📁 Total files with YAML: {len(yaml_files)}")
    print()
    
    # Session trends
    session_metrics = analyze_session_trends(yaml_files)
    
    print("📈 SESSION PRODUCTIVITY TRENDS:")
    print("-" * 40)
    
    # Show last 10 sessions
    numeric_sessions = []
    for session, metrics in session_metrics.items():
        try:
            session_num = int(session)
            numeric_sessions.append((session_num, metrics))
        except:
            pass
    
    numeric_sessions.sort(reverse=True)
    
    for session_num, metrics in numeric_sessions[:10]:
        bar = "█" * min(metrics["files"], 20)
        print(f"  Session {session_num:05d}: {bar} ({metrics['files']} files)")
    
    # Calculate trend
    trend = calculate_productivity_trend(session_metrics)
    if trend > 0:
        print(f"\n  📈 Trend: +{trend:.1f}% (increasing productivity)")
    elif trend < 0:
        print(f"\n  📉 Trend: {trend:.1f}% (decreasing productivity)")
    else:
        print(f"\n  ➡️  Trend: Stable")
    
    # Time trends
    print()
    print("📅 ACTIVITY OVER TIME:")
    print("-" * 40)
    
    date_metrics = analyze_time_trends(yaml_files)
    sorted_dates = sorted(date_metrics.keys(), reverse=True)[:7]
    
    for date in sorted_dates:
        metrics = date_metrics[date]
        created_bar = "🟢" * min(metrics["created"], 10)
        modified_bar = "🔵" * min(metrics["modified"], 10)
        print(f"  {date}: {created_bar}{modified_bar} (C:{metrics['created']} M:{metrics['modified']})")
    
    # Domain distribution
    print()
    print("🎯 DOMAIN FOCUS TRENDS:")
    print("-" * 40)
    
    domain_counts, domain_priorities = analyze_domain_distribution(yaml_files)
    
    for domain in sorted(domain_counts.keys(), key=lambda x: domain_counts[x], reverse=True):
        count = domain_counts[domain]
        percentage = (count / len(yaml_files)) * 100
        bar = "▓" * int(percentage / 5)
        
        # Calculate P0 percentage
        priorities = domain_priorities[domain]
        p0_count = priorities.count("P0")
        p0_pct = (p0_count / len(priorities) * 100) if priorities else 0
        
        print(f"  {domain:15s} {bar:20s} {percentage:5.1f}% (P0: {p0_pct:.0f}%)")
    
    # Type distribution trends
    print()
    print("📝 DOCUMENT TYPE TRENDS:")
    print("-" * 40)
    
    type_counts = defaultdict(int)
    for file_path, yaml_data in yaml_files:
        doc_type = yaml_data.get("type", "unknown")
        type_counts[doc_type] += 1
    
    for doc_type in sorted(type_counts.keys(), key=lambda x: type_counts[x], reverse=True)[:8]:
        count = type_counts[doc_type]
        percentage = (count / len(yaml_files)) * 100
        bar = "▓" * int(percentage / 3)
        print(f"  {doc_type:15s} {bar:20s} {count:3d} ({percentage:5.1f}%)")
    
    # Key insights
    print()
    print("💡 KEY INSIGHTS:")
    print("-" * 40)
    
    # Most productive session
    if numeric_sessions:
        most_productive = max(numeric_sessions, key=lambda x: x[1]["files"])
        print(f"  🏆 Most productive: Session {most_productive[0]:05d} ({most_productive[1]['files']} files)")
    
    # Coverage growth
    total_files = len(list(Path(".").rglob("*.md")))
    coverage = (len(yaml_files) / total_files) * 100 if total_files > 0 else 0
    print(f"  📊 YAML Coverage: {coverage:.1f}% ({len(yaml_files)}/{total_files} files)")
    
    # Domain balance
    if domain_counts:
        core_pct = (domain_counts.get("core", 0) / len(yaml_files)) * 100
        if core_pct > 70:
            print(f"  ⚠️  Core-heavy: {core_pct:.0f}% in core domain (consider balance)")
        else:
            print(f"  ✅ Balanced: {core_pct:.0f}% in core domain")
    
    # Recent activity
    today = datetime.now().strftime('%Y-%m-%d')
    today_activity = date_metrics.get(today, {"created": 0, "modified": 0})
    if today_activity["created"] + today_activity["modified"] > 10:
        print(f"  🔥 High activity today: {today_activity['created'] + today_activity['modified']} files touched")
    
    print()
    print("=" * 60)

if __name__ == "__main__":
    main()