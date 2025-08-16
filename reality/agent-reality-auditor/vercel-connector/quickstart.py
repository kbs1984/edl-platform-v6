#!/usr/bin/env python3
"""
Vercel Reality Agent - Quick Test
Tests all 4 levels of discovery
"""

from connector import VercelRealityAgent
import json

def test_vercel_agent():
    print("Testing Vercel Reality Agent...")
    print("=" * 50)
    
    agent = VercelRealityAgent()
    
    # Test Level 1: Connection
    print("\n1. Testing Connection...")
    connection = agent.discover_level_1()
    if connection.get('connected'):
        print("✅ Connected to Vercel API")
        print(f"   Latency: {connection.get('latency_ms'):.1f}ms")
        print(f"   Rate limit remaining: {connection.get('rate_limit_remaining')}")
    else:
        print("❌ Cannot connect to Vercel")
        print(f"   Error: {connection.get('error')}")
        print("\n⚠️  Check your environment variables:")
        print("   VERCEL_TOKEN: " + ("Set" if agent.token else "NOT SET"))
        print("   VERCEL_PROJECT_ID: " + ("Set" if agent.project_id else "NOT SET"))
        return
    
    # Test Level 2: Current State
    print("\n2. Getting Current Deployment...")
    state = agent.discover_level_2()
    if 'error' not in state:
        if state.get('production_deployment'):
            prod = state['production_deployment']
            print(f"✅ Production: {prod.get('url')}")
            print(f"   Commit: {prod.get('git_commit', 'unknown')[:7]}")
            print(f"   State: {prod.get('state')}")
            print(f"   Branch: {prod.get('git_branch')}")
        else:
            print("⚠️  No production deployment found")
    else:
        print(f"❌ Error: {state['error']}")
    
    # Test Level 3: Recent Changes
    print("\n3. Checking Recent Changes...")
    changes = agent.discover_level_3()
    if 'error' not in changes:
        deployments = changes.get('recent_deployments', [])
        print(f"✅ Found {len(deployments)} recent deployments")
        for dep in deployments[:3]:
            print(f"   {dep['position']+1}. {dep['git_commit']} - {dep['state']} ({dep['target']})")
        if changes.get('deployment_frequency_seconds'):
            freq_hours = changes['deployment_frequency_seconds'] / 3600
            print(f"   Deployment frequency: every {freq_hours:.1f} hours")
    else:
        print(f"❌ Error: {changes['error']}")
    
    # Test Level 4: Gaps
    print("\n4. Detecting Reality Gaps...")
    gaps_result = agent.discover_level_4()
    if 'error' not in gaps_result:
        gaps = gaps_result.get('gaps', [])
        if gaps:
            print(f"⚠️  Found {len(gaps)} reality gaps:")
            for gap in gaps:
                print(f"   - [{gap['severity']}] {gap['gap_type']}")
                print(f"     Truth: {gap['truth']}")
                print(f"     Impact: {gap['impact']}")
        else:
            print("✅ No reality gaps detected")
    else:
        print(f"❌ Error: {gaps_result['error']}")
    
    print("\n" + "=" * 50)
    print("Test Complete!")
    
    # Generate full report
    print("\nGenerating full report...")
    report = agent.generate_deployment_report()
    print(f"Health Score: {report['health_score']}%")
    print(f"Status: {report['status']}")

if __name__ == "__main__":
    test_vercel_agent()