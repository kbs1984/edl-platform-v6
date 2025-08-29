#!/usr/bin/env python3
"""
---
session: "00066"
type: "script"
status: "unknown"
created: "2025-08-28"
title: "00066-migration-readiness.py"
purpose: "Ensure we're ACTUALLY ready before attempting any bulk operations"
language: "python"
category: "utility"
topics: ["utility"]
priority: "P2"
domain: "core"
---
"""
"""
Session 00066 - Migration Readiness Scorer
Purpose: Ensure we're ACTUALLY ready before attempting any bulk operations
Created: 2025-08-25
Status: Phase 0 Safety Infrastructure

Based on Desktop's critical insight: No bulk operations until 80% ready!
"""

import os
import json
import subprocess
from pathlib import Path
from datetime import datetime
from typing import Dict, Tuple
import argparse

class MigrationNotReady(Exception):
    """Raised when migration readiness is below threshold"""
    pass

class MigrationReadinessScorer:
    """Calculates if we're ready for migration"""
    
    def __init__(self, threshold: int = 80):
        self.threshold = threshold
        self.scores = {}
        self.details = {}
        self.file_count = 0
        
    def check_reference_map(self) -> int:
        """Check if reference map is complete"""
        score = 0
        details = []
        
        # Check if reference map exists
        if Path("reference-map-00066.json").exists():
            score += 40
            details.append("✅ Reference map exists")
            
            # Check if it's recent (within last hour)
            mtime = Path("reference-map-00066.json").stat().st_mtime
            age_hours = (datetime.now().timestamp() - mtime) / 3600
            if age_hours < 1:
                score += 30
                details.append("✅ Reference map is fresh")
            else:
                details.append(f"⚠️ Reference map is {age_hours:.1f} hours old")
            
            # Check if it has content
            with open("reference-map-00066.json", 'r') as f:
                data = json.load(f)
                if data.get("reference_map"):
                    score += 30
                    ref_count = data["stats"]["total_references"]
                    details.append(f"✅ Contains {ref_count} references")
                else:
                    details.append("❌ Reference map is empty")
        else:
            details.append("❌ No reference map found")
            details.append("  Run: python3 scripts/00066-reference-mapper.py --scan --save")
        
        self.details["reference_map"] = details
        return min(score, 100)
    
    def verify_rollback_capability(self) -> int:
        """Check if rollback is possible"""
        score = 0
        details = []
        
        # Check for rollback manifest
        if Path("rollback-manifest-00066.json").exists():
            score += 30
            details.append("✅ Rollback manifest exists")
            
            with open("rollback-manifest-00066.json", 'r') as f:
                manifest = json.load(f)
                
                # Check for backup branch
                if manifest.get("backup_branch"):
                    score += 20
                    details.append(f"✅ Backup branch: {manifest['backup_branch']}")
                else:
                    details.append("❌ No backup branch recorded")
                
                # Check for checksums
                if manifest.get("checksums"):
                    score += 20
                    count = len(manifest["checksums"])
                    details.append(f"✅ {count} file checksums recorded")
                else:
                    details.append("❌ No file checksums")
        else:
            details.append("❌ No rollback manifest")
            details.append("  Run: python3 scripts/00066-create-rollback.py --prepare")
        
        # Check for rollback script
        if Path("rollback-00066.sh").exists():
            score += 20
            details.append("✅ Rollback script ready")
        else:
            details.append("❌ No rollback script")
        
        # Check git status
        git_status = subprocess.run(
            ["git", "status", "--porcelain"],
            capture_output=True,
            text=True
        ).stdout
        
        if not git_status:
            score += 10
            details.append("✅ Clean git status")
        else:
            uncommitted = len(git_status.strip().split('\n'))
            details.append(f"⚠️ {uncommitted} uncommitted files")
        
        self.details["rollback"] = details
        return min(score, 100)
    
    def benchmark_cache_speed(self) -> int:
        """Check if caching/performance is adequate"""
        score = 0
        details = []
        
        # Check for YAML cache
        if Path(".yaml-index-cache.pkl").exists():
            score += 40
            size_mb = Path(".yaml-index-cache.pkl").stat().st_size / (1024 * 1024)
            details.append(f"✅ YAML cache exists ({size_mb:.1f} MB)")
            
            # Check cache age
            mtime = Path(".yaml-index-cache.pkl").stat().st_mtime
            age_hours = (datetime.now().timestamp() - mtime) / 3600
            if age_hours < 24:
                score += 30
                details.append(f"✅ Cache is recent ({age_hours:.1f} hours old)")
            else:
                details.append(f"⚠️ Cache is stale ({age_hours:.1f} hours old)")
        else:
            details.append("❌ No YAML cache found")
        
        # Count total files to assess scale
        md_count = len(list(Path(".").rglob("*.md")))
        self.file_count = md_count  # Store for timing estimate
        if md_count < 500:
            score += 30
            details.append(f"✅ Manageable file count ({md_count} files)")
        elif md_count < 1000:
            score += 20
            details.append(f"⚠️ Medium file count ({md_count} files)")
        else:
            score += 10
            details.append(f"⚠️ Large file count ({md_count} files) - performance risk")
        
        self.details["cache_performance"] = details
        return min(score, 100)
    
    def check_conflicts_resolved(self) -> int:
        """Check if domain conflicts are resolved"""
        score = 0
        details = []
        
        # Check for pending directory
        if not Path("pending").exists():
            score += 30
            details.append("✅ No pending directory yet (good for fresh start)")
        else:
            pending_files = list(Path("pending").rglob("*.md"))
            if len(pending_files) == 0:
                score += 30
                details.append("✅ Pending directory empty")
            else:
                details.append(f"⚠️ {len(pending_files)} files in pending")
        
        # Check for core directory existence
        if not Path("core").exists():
            score += 35
            details.append("✅ Core directory not created yet (clean slate)")
        else:
            details.append("⚠️ Core directory already exists")
        
        # Check for domain metadata in sample files
        sample_files = list(Path("archive/session-deliverables").rglob("*.md"))[:5]
        domains_found = 0
        for f in sample_files:
            try:
                content = f.read_text()
                if "domain:" in content:
                    domains_found += 1
            except:
                pass
        
        if domains_found == len(sample_files):
            score += 35
            details.append(f"✅ All {len(sample_files)} sample files have domain metadata")
        else:
            missing = len(sample_files) - domains_found
            details.append(f"⚠️ {missing}/{len(sample_files)} files missing domain metadata")
        
        self.details["conflicts"] = details
        return min(score, 100)
    
    def verify_backup_integrity(self) -> int:
        """Verify backup mechanisms are in place"""
        score = 0
        details = []
        
        # Check for backup branch
        result = subprocess.run(
            ["git", "branch", "--list", "pre-reorg-backup*"],
            capture_output=True,
            text=True
        )
        
        if result.stdout.strip():
            score += 40
            branches = result.stdout.strip().split('\n')
            details.append(f"✅ Backup branch exists: {branches[0].strip()}")
        else:
            details.append("❌ No backup branch")
            details.append("  Run: git checkout -b pre-reorg-backup-session-66")
        
        # Check for restore points (git tags)
        result = subprocess.run(
            ["git", "tag", "--list", "restore_point*"],
            capture_output=True,
            text=True
        )
        
        if result.stdout.strip():
            score += 30
            tags = result.stdout.strip().split('\n')
            details.append(f"✅ Restore point: {tags[-1]}")
        else:
            details.append("⚠️ No restore points")
        
        # Check disk space for operations
        import shutil
        usage = shutil.disk_usage(".")
        free_gb = usage.free / (1024**3)
        if free_gb > 1:
            score += 30
            details.append(f"✅ Adequate disk space ({free_gb:.1f} GB free)")
        else:
            details.append(f"❌ Low disk space ({free_gb:.1f} GB free)")
        
        self.details["backup"] = details
        return min(score, 100)
    
    def estimate_migration_time(self, file_count: int = None) -> str:
        """Estimate how long migration will take"""
        # Based on benchmarks: ~50 files/second with reference updates
        # But more realistically ~10 files/second with all safety checks
        if file_count is None:
            file_count = self.file_count if self.file_count else 450
        
        # Different rates for different operations
        scan_rate = 100  # files/second for scanning
        move_rate = 10   # files/second for safe moves with checks
        
        scan_time = file_count / scan_rate
        move_time = file_count / move_rate
        total_seconds = scan_time + move_time
        
        if total_seconds < 60:
            return f"{total_seconds:.0f} seconds"
        elif total_seconds < 3600:
            return f"{total_seconds/60:.1f} minutes"
        else:
            return f"{total_seconds/3600:.1f} hours"
    
    def calculate_migration_readiness(self) -> Dict:
        """Calculate overall migration readiness"""
        print("🔍 Calculating migration readiness...")
        
        scores = {
            'reference_map_complete': self.check_reference_map(),
            'rollback_tested': self.verify_rollback_capability(),
            'cache_performance': self.benchmark_cache_speed(),
            'conflict_resolution': self.check_conflicts_resolved(),
            'backup_verified': self.verify_backup_integrity()
        }
        
        overall = sum(scores.values()) / len(scores)
        
        weakest_link = min(scores, key=scores.get)
        strongest = max(scores, key=scores.get)
        
        return {
            'overall': overall,
            'details': scores,
            'ready': overall >= self.threshold,
            'weakest_link': weakest_link,
            'weakest_score': scores[weakest_link],
            'strongest': strongest,
            'strongest_score': scores[strongest],
            'threshold': self.threshold,
            'component_details': self.details,
            'estimated_time': self.estimate_migration_time(),
            'file_count': self.file_count
        }
    
    def generate_report(self, readiness: Dict) -> str:
        """Generate detailed readiness report"""
        report = f"""
# Migration Readiness Report
Session: 00066
Generated: {datetime.now().isoformat()}
Threshold: {readiness['threshold']}%

## Overall Score: {readiness['overall']:.1f}%
Status: {'✅ READY FOR MIGRATION' if readiness['ready'] else '❌ NOT READY - MORE PREPARATION NEEDED'}

## Migration Timing Estimate
- Files to process: {readiness.get('file_count', 'Unknown')}
- Estimated time: {readiness.get('estimated_time', 'Unknown')}
- Processing rate: ~10 files/second (with safety checks)

## Component Scores
"""
        for component, score in readiness['details'].items():
            status = "✅" if score >= 80 else "⚠️" if score >= 60 else "❌"
            report += f"- {component}: {status} {score}%\n"
        
        report += f"\n## Weakest Component: {readiness['weakest_link']} ({readiness['weakest_score']}%)\n"
        report += f"## Strongest Component: {readiness['strongest']} ({readiness['strongest_score']}%)\n"
        
        report += "\n## Detailed Analysis\n"
        for component, details in readiness['component_details'].items():
            report += f"\n### {component.replace('_', ' ').title()}\n"
            for detail in details:
                report += f"  {detail}\n"
        
        if not readiness['ready']:
            report += "\n## ⚠️ Actions Required\n"
            report += "You must address the following before migration:\n\n"
            
            for component, score in readiness['details'].items():
                if score < 80:
                    report += f"### {component.replace('_', ' ').title()} (Currently {score}%)\n"
                    if component == "reference_map_complete":
                        report += "- Run: `python3 scripts/00066-reference-mapper.py --scan --save`\n"
                    elif component == "rollback_tested":
                        report += "- Run: `python3 scripts/00066-create-rollback.py --prepare`\n"
                    elif component == "backup_verified":
                        report += "- Create backup branch: `git checkout -b pre-reorg-backup-session-66`\n"
                    report += "\n"
        
        return report


def main():
    parser = argparse.ArgumentParser(description='Check migration readiness')
    parser.add_argument('--check', action='store_true', help='Check readiness')
    parser.add_argument('--threshold', type=int, default=80, 
                       help='Minimum readiness threshold (default: 80)')
    parser.add_argument('--report', action='store_true', 
                       help='Generate detailed report')
    parser.add_argument('--force', action='store_true',
                       help='Show score even if not ready')
    
    args = parser.parse_args()
    
    scorer = MigrationReadinessScorer(threshold=args.threshold)
    
    if args.check or args.report or not any(vars(args).values()):
        readiness = scorer.calculate_migration_readiness()
        
        print(f"\n{'='*50}")
        print(f"Migration Readiness: {readiness['overall']:.1f}%")
        print(f"Threshold: {readiness['threshold']}%")
        print(f"Status: {'✅ READY' if readiness['ready'] else '❌ NOT READY'}")
        print(f"{'='*50}")
        
        print("\nComponent Scores:")
        for component, score in readiness['details'].items():
            bar = "█" * (score // 10) + "░" * (10 - score // 10)
            print(f"  {component:25} [{bar}] {score:3}%")
        
        print(f"\n💪 Strongest: {readiness['strongest']} ({readiness['strongest_score']}%)")
        print(f"😰 Weakest: {readiness['weakest_link']} ({readiness['weakest_score']}%)")
        
        if not readiness['ready'] and not args.force:
            print("\n❌ Migration blocked until readiness >= 80%")
            print("Run with --report for detailed instructions")
            raise MigrationNotReady(f"Only {readiness['overall']:.1f}% ready. Need {readiness['threshold']}% minimum.")
        
        if args.report:
            report = scorer.generate_report(readiness)
            report_file = "migration-readiness-00066.md"
            with open(report_file, 'w') as f:
                f.write(report)
            print(f"\n📄 Detailed report saved to {report_file}")


if __name__ == "__main__":
    main()