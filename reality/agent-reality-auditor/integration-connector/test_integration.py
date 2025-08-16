#!/usr/bin/env python3
"""
Integration Reality Agent - Comprehensive Test
Tests all levels of reality discovery and integration analysis
"""

import sys
import json
from pathlib import Path
from datetime import datetime
import subprocess

# Add current directory to path
sys.path.append(str(Path(__file__).parent))

from connector import IntegrationRealityAgent


def test_level_1_health_check(agent):
    """Test Level 1: Agent Health Check"""
    print("\n" + "=" * 60)
    print("TEST: Level 1 - Agent Health Check")
    print("=" * 60)
    
    result = agent.level_1_health_check()
    
    print(f"Confidence Score: {result['confidence']}")
    print(f"Agents Status:")
    for name, status in result['agents'].items():
        if isinstance(status, dict):
            print(f"  - {name}: {status.get('status', 'unknown')}")
    
    summary = result.get('summary', {})
    print(f"\nSummary:")
    print(f"  Healthy: {summary.get('healthy_agents', 0)}")
    print(f"  Limited: {summary.get('limited_agents', 0)}")
    print(f"  Failed: {summary.get('failed_agents', 0)}")
    print(f"  Can Proceed: {summary.get('can_proceed', False)}")
    
    return result['confidence'] > 0


def test_level_2_binary_correlation(agent):
    """Test Level 2: Binary Correlation (FS + Git)"""
    print("\n" + "=" * 60)
    print("TEST: Level 2 - Binary Correlation")
    print("=" * 60)
    
    result = agent.level_2_binary_correlation()
    
    print(f"Confidence Score: {result['confidence']}")
    print(f"Uncommitted Files: {len(result.get('uncommitted', []))}")
    print(f"Untracked Files: {len(result.get('untracked', []))}")
    print(f"Unpushed Commits: {len(result.get('unpushed', []))}")
    
    sync_info = result.get('fs_git_sync', {})
    print(f"\nSync Score: {sync_info.get('sync_score', 0):.1%}")
    print(f"Total Sync Issues: {sync_info.get('total_sync_issues', 0)}")
    
    # Show sample of issues
    if result.get('uncommitted'):
        print("\nSample Uncommitted Files:")
        for file in result['uncommitted'][:3]:
            print(f"  - {file}")
    
    return result['confidence'] > 0


def test_deception_detection(agent):
    """Test Deception Detection Engine"""
    print("\n" + "=" * 60)
    print("TEST: Deception Detection Engine")
    print("=" * 60)
    
    result = agent.discover_session_reality_gaps()
    
    print(f"Session Claims Analyzed: {len(result.get('claimed_work', []))}")
    print(f"Actual Changes Found: {len(result.get('actual_changes', []))}")
    print(f"Actual Commits Found: {len(result.get('actual_commits', []))}")
    print(f"Truth Score: {result.get('truth_score', 0):.1%}")
    
    deceptions = result.get('deception_instances', [])
    if deceptions:
        print(f"\n⚠️  Deceptions Found: {len(deceptions)}")
        for deception in deceptions[:3]:
            print(f"  Type: {deception.get('type')}")
            print(f"  Reason: {deception.get('reason')}")
    else:
        print("\n✅ No deceptions detected")
    
    return result['truth_score'] >= 0.5


def test_retroactive_logging(agent):
    """Test Retroactive Logging Detection"""
    print("\n" + "=" * 60)
    print("TEST: Retroactive Logging Detection")
    print("=" * 60)
    
    instances = agent.find_retroactive_logging()
    
    if instances:
        print(f"⚠️  Retroactive Logging Instances: {len(instances)}")
        
        # Group by type
        by_type = {}
        for instance in instances:
            itype = instance.get('type', 'unknown')
            if itype not in by_type:
                by_type[itype] = []
            by_type[itype].append(instance)
        
        for itype, items in by_type.items():
            print(f"\n  {itype}: {len(items)} instances")
            for item in items[:2]:
                if item.get('severity'):
                    print(f"    - {item.get('file', 'unknown')} [{item['severity']}]")
                else:
                    print(f"    - {item.get('file', 'unknown')}")
    else:
        print("✅ No retroactive logging detected")
    
    return len(instances) == 0


def test_integration_debt(agent):
    """Test Integration Debt Tracking"""
    print("\n" + "=" * 60)
    print("TEST: Integration Debt Tracking")
    print("=" * 60)
    
    debt = agent.track_integration_debt()
    
    print(f"Total Debt Score: {debt['total_debt_score']}/100")
    print(f"Debt Level: {debt['debt_level']}")
    
    # Show debt bar
    debt_bar = agent.generate_health_bar(1.0 - debt['total_debt_score'] / 100)
    print(f"Debt Health: {debt_bar}")
    
    print("\nDebt Breakdown:")
    if debt['uncommitted_files'] > 0:
        print(f"  • Uncommitted Files: {debt['uncommitted_files']}")
    if debt['untracked_files'] > 0:
        print(f"  • Untracked Files: {debt['untracked_files']}")
    if debt['unpushed_commits'] > 0:
        print(f"  • Unpushed Commits: {debt['unpushed_commits']}")
    if debt['undocumented_features'] > 0:
        print(f"  • Undocumented Features: {debt['undocumented_features']}")
    if debt['missing_tests'] > 0:
        print(f"  • Missing Tests: {debt['missing_tests']}")
    
    if debt['total_debt_score'] == 0:
        print("  ✅ No integration debt!")
    
    return debt['debt_level'] in ['LOW', 'MEDIUM']


def test_health_scores(agent):
    """Test Overall Health Score Calculation"""
    print("\n" + "=" * 60)
    print("TEST: Health Score Calculation")
    print("=" * 60)
    
    health = agent.calculate_health_score()
    
    print("Health Metrics:")
    for metric, score in health.items():
        if metric != 'overall':
            bar = agent.generate_health_bar(score)
            print(f"  {metric.capitalize():<15} {bar}")
    
    print(f"\nOverall Health: {agent.generate_health_bar(health['overall'])}")
    
    return health['overall'] >= 0.5


def run_all_tests():
    """Run all integration tests"""
    print("=" * 60)
    print("INTEGRATION REALITY AGENT - COMPREHENSIVE TEST SUITE")
    print("=" * 60)
    print(f"Test Time: {datetime.now().isoformat()}")
    
    # Initialize agent
    print("\nInitializing Integration Reality Agent...")
    agent = IntegrationRealityAgent()
    
    # Track test results
    results = {}
    
    # Run tests
    tests = [
        ("Level 1 Health Check", test_level_1_health_check),
        ("Level 2 Binary Correlation", test_level_2_binary_correlation),
        ("Deception Detection", test_deception_detection),
        ("Retroactive Logging", test_retroactive_logging),
        ("Integration Debt", test_integration_debt),
        ("Health Scores", test_health_scores)
    ]
    
    for test_name, test_func in tests:
        try:
            results[test_name] = test_func(agent)
        except Exception as e:
            print(f"\n❌ Test {test_name} failed: {str(e)}")
            results[test_name] = False
    
    # Summary
    print("\n" + "=" * 60)
    print("TEST SUMMARY")
    print("=" * 60)
    
    passed = sum(1 for v in results.values() if v)
    total = len(results)
    
    for test_name, passed in results.items():
        status = "✅ PASS" if passed else "❌ FAIL"
        print(f"{test_name:<30} {status}")
    
    print(f"\nTotal: {passed}/{total} tests passed")
    
    # Generate final report
    print("\n" + "=" * 60)
    print("FINAL INTEGRATION REALITY REPORT")
    print("=" * 60)
    print(agent.generate_visual_report())
    
    # Save test results
    test_results = {
        "timestamp": datetime.now().isoformat(),
        "test_results": results,
        "passed": passed,
        "total": total,
        "health_scores": agent.calculate_health_score(),
        "integration_debt": agent.track_integration_debt()
    }
    
    output_file = Path(__file__).parent / f"test_results_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
    output_file.write_text(json.dumps(test_results, indent=2))
    print(f"\nTest results saved to: {output_file.name}")
    
    return passed == total


if __name__ == "__main__":
    success = run_all_tests()
    sys.exit(0 if success else 1)