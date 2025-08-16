#!/usr/bin/env python3
"""
Integration Reality Agent - Quickstart
Discovers meta-reality across all Reality Agents
"""

import sys
import json
from pathlib import Path
from datetime import datetime

# Add current directory to path
sys.path.append(str(Path(__file__).parent))

from connector import IntegrationRealityAgent


def main():
    """Run integration reality discovery"""
    print("=" * 60)
    print("INTEGRATION REALITY AGENT - META-REALITY DISCOVERY")
    print("=" * 60)
    print("")
    print("Initializing Integration Reality Agent...")
    print("This agent discovers how Reality Agents relate and conflict")
    print("")
    
    try:
        # Initialize the agent
        agent = IntegrationRealityAgent()
        
        print("Phase 1: Deception Detection Engine")
        print("-" * 40)
        
        # Run deception detection
        gaps = agent.discover_session_reality_gaps()
        
        print(f"✓ Analyzed {len(gaps.get('claimed_work', []))} session claims")
        print(f"✓ Found {len(gaps.get('actual_changes', []))} actual changes")
        print(f"✓ Found {len(gaps.get('actual_commits', []))} actual commits")
        print(f"✓ Truth Score: {gaps.get('truth_score', 0.0):.1%}")
        
        if gaps.get('deception_instances'):
            print(f"\n⚠️  Found {len(gaps['deception_instances'])} deception instances:")
            for deception in gaps['deception_instances'][:3]:
                print(f"  - {deception.get('type')}: {deception.get('reason')}")
        
        print("")
        print("Phase 2: Retroactive Logging Detection")
        print("-" * 40)
        
        retroactive = agent.find_retroactive_logging()
        if retroactive:
            print(f"⚠️  Found {len(retroactive)} retroactive logging instances:")
            for instance in retroactive[:3]:
                print(f"  - {instance.get('type')} in {instance.get('file')}")
                if instance.get('severity'):
                    print(f"    Severity: {instance['severity']}")
        else:
            print("✓ No retroactive logging detected")
        
        print("")
        print("Phase 3: Integration Debt Tracking")
        print("-" * 40)
        
        debt = agent.track_integration_debt()
        print(f"✓ Total Debt Score: {debt['total_debt_score']}/100")
        print(f"✓ Debt Level: {debt['debt_level']}")
        if debt['uncommitted_files'] > 0:
            print(f"  - {debt['uncommitted_files']} uncommitted files")
        if debt['untracked_files'] > 0:
            print(f"  - {debt['untracked_files']} untracked files")
        if debt['missing_tests'] > 0:
            print(f"  - {debt['missing_tests']} missing tests")
        
        print("")
        print("Phase 4: Integration Health Analysis")
        print("-" * 40)
        
        # Generate and display the visual report
        print("")
        report = agent.generate_visual_report()
        print(report)
        
        # Save detailed JSON results
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        output_file = Path(__file__).parent / f"integration_report_{timestamp}.json"
        
        detailed_results = {
            "timestamp": datetime.now().isoformat(),
            "session_id": agent.session_id,
            "health_scores": agent.calculate_health_score(),
            "level_1_health": agent.level_1_health_check(),
            "level_2_correlation": agent.level_2_binary_correlation(),
            "session_gaps": gaps,
            "retroactive_logging": retroactive
        }
        
        output_file.write_text(json.dumps(detailed_results, indent=2))
        print(f"\nDetailed results saved to: {output_file.name}")
        
    except Exception as e:
        print(f"\n❌ Error: {str(e)}")
        import traceback
        traceback.print_exc()
        sys.exit(1)


if __name__ == "__main__":
    main()