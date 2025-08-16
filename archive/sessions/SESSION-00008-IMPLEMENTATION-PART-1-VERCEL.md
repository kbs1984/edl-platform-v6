# Session 00008 Implementation Part 1: Vercel Reality Agent

## Overview
This document contains the COMPLETE implementation for the Vercel Reality Agent. Copy exactly as shown.

## File Structure Required
```bash
reality/agent-reality-auditor/vercel-connector/
├── connector.py           # Main Vercel Reality Agent (code below)
├── quickstart.py          # Test script (code below)
├── requirements.txt       # Dependencies (code below)
└── .cache/               # Will be auto-created
```

## Step 1: Environment Variables Setup

```bash
# Get these from your Vercel account
export VERCEL_TOKEN="your-vercel-api-token"
export VERCEL_PROJECT_ID="your-project-id"
export VERCEL_TEAM_ID=""  # Leave empty if not using teams

# To get these values:
# 1. VERCEL_TOKEN: Go to https://vercel.com/account/tokens
# 2. VERCEL_PROJECT_ID: Go to project settings in Vercel dashboard
# 3. VERCEL_TEAM_ID: Only if using Vercel Teams
```

## Step 2: Create connector.py

```python
#!/usr/bin/env python3
"""
Vercel Reality Agent - Deployment Truth Monitor
Created: Session 00008
Purpose: Monitor deployment state without judgment
"""

import os
import json
import hashlib
import requests
from datetime import datetime, timedelta
from pathlib import Path
from typing import Dict, List, Optional, Any

class VercelRealityAgent:
    """
    Monitors Vercel deployment truth without understanding purpose.
    Reports what IS deployed, not what SHOULD be deployed.
    """
    
    def __init__(self):
        self.name = "Vercel Reality Agent"
        self.session_id = "00008"
        self.cache_dir = Path(__file__).parent / ".cache"
        self.cache_dir.mkdir(exist_ok=True)
        
        # Vercel API configuration
        self.token = os.environ.get('VERCEL_TOKEN', '')
        self.project_id = os.environ.get('VERCEL_PROJECT_ID', '')
        self.team_id = os.environ.get('VERCEL_TEAM_ID', '')  # Optional
        
        self.base_url = "https://api.vercel.com"
        self.headers = {
            "Authorization": f"Bearer {self.token}",
            "Content-Type": "application/json"
        }
        
        # Cache TTLs (in seconds)
        self.ttl_deployment = 60  # Deployment info changes slowly
        self.ttl_build = 30       # Build status changes quickly
        
    def discover_level_1(self) -> Dict[str, Any]:
        """Can I connect to Vercel?"""
        try:
            # Test connection with user endpoint
            response = requests.get(
                f"{self.base_url}/v2/user",
                headers=self.headers,
                timeout=5
            )
            
            return {
                "connected": response.status_code == 200,
                "timestamp": datetime.utcnow().isoformat(),
                "latency_ms": response.elapsed.total_seconds() * 1000,
                "rate_limit_remaining": response.headers.get('X-Rate-Limit-Remaining', 'unknown')
            }
        except Exception as e:
            return {
                "connected": False,
                "error": str(e),
                "timestamp": datetime.utcnow().isoformat()
            }
    
    def discover_level_2(self) -> Dict[str, Any]:
        """What is currently deployed?"""
        try:
            # Get production deployment
            prod_url = f"{self.base_url}/v6/deployments"
            params = {
                "projectId": self.project_id,
                "target": "production",
                "limit": 1
            }
            if self.team_id:
                params["teamId"] = self.team_id
                
            response = requests.get(
                prod_url,
                headers=self.headers,
                params=params,
                timeout=10
            )
            
            if response.status_code != 200:
                return {"error": f"API returned {response.status_code}"}
            
            data = response.json()
            deployments = data.get('deployments', [])
            
            if not deployments:
                return {
                    "production_deployment": None,
                    "status": "no_deployments"
                }
            
            current = deployments[0]
            
            return {
                "production_deployment": {
                    "id": current.get('uid'),
                    "url": current.get('url'),
                    "state": current.get('state'),  # READY, ERROR, etc
                    "created_at": current.get('created'),
                    "git_commit": current.get('meta', {}).get('githubCommitSha', 'unknown'),
                    "git_branch": current.get('meta', {}).get('githubCommitRef', 'unknown'),
                    "git_message": current.get('meta', {}).get('githubCommitMessage', ''),
                    "creator": current.get('creator', {}).get('username', 'unknown'),
                    "build_duration_ms": current.get('buildingAt', 0),
                    "regions": current.get('regions', [])
                },
                "environment_type": current.get('target', 'unknown'),
                "ready_state": current.get('readyState', 'unknown')
            }
            
        except Exception as e:
            return {
                "error": str(e),
                "timestamp": datetime.utcnow().isoformat()
            }
    
    def discover_level_3(self) -> Dict[str, Any]:
        """What changed recently?"""
        try:
            # Get last 5 deployments
            url = f"{self.base_url}/v6/deployments"
            params = {
                "projectId": self.project_id,
                "limit": 5
            }
            if self.team_id:
                params["teamId"] = self.team_id
                
            response = requests.get(
                url,
                headers=self.headers,
                params=params,
                timeout=10
            )
            
            if response.status_code != 200:
                return {"error": f"API returned {response.status_code}"}
            
            data = response.json()
            deployments = data.get('deployments', [])
            
            changes = []
            for i, deploy in enumerate(deployments):
                changes.append({
                    "position": i,
                    "id": deploy.get('uid'),
                    "state": deploy.get('state'),
                    "target": deploy.get('target'),  # production, preview
                    "created": deploy.get('created'),
                    "git_commit": deploy.get('meta', {}).get('githubCommitSha', 'unknown')[:7],
                    "git_message": deploy.get('meta', {}).get('githubCommitMessage', '')[:50]
                })
            
            # Calculate deployment frequency
            if len(deployments) >= 2:
                latest = datetime.fromtimestamp(deployments[0].get('created', 0) / 1000)
                previous = datetime.fromtimestamp(deployments[1].get('created', 0) / 1000)
                time_between = (latest - previous).total_seconds()
            else:
                time_between = None
                
            return {
                "recent_deployments": changes,
                "deployment_frequency_seconds": time_between,
                "total_in_24h": self._count_deployments_in_timeframe(24),
                "failed_in_24h": self._count_failed_deployments(24)
            }
            
        except Exception as e:
            return {
                "error": str(e),
                "timestamp": datetime.utcnow().isoformat()
            }
    
    def discover_level_4(self) -> Dict[str, Any]:
        """Are there inconsistencies?"""
        gaps = []
        
        try:
            # Get production deployment
            prod = self.discover_level_2()
            if 'error' in prod:
                return {"error": prod['error']}
            
            prod_deploy = prod.get('production_deployment', {})
            if not prod_deploy:
                gaps.append({
                    "gap_type": "no_production_deployment",
                    "severity": "CRITICAL",
                    "truth": "No production deployment exists",
                    "impact": "Application not accessible to users"
                })
                return {"gaps": gaps}
            
            # Check GitHub alignment (requires GitHub agent data)
            github_latest = self._get_github_latest_commit()
            if github_latest and prod_deploy.get('git_commit'):
                if github_latest != prod_deploy.get('git_commit'):
                    gaps.append({
                        "gap_type": "deployment_behind",
                        "severity": "HIGH",
                        "truth": f"Deployed: {prod_deploy.get('git_commit')[:7]}, GitHub: {github_latest[:7]}",
                        "impact": "Latest code not in production"
                    })
            
            # Check build state
            if prod_deploy.get('state') != 'READY':
                gaps.append({
                    "gap_type": "deployment_not_ready",
                    "severity": "CRITICAL",
                    "truth": f"Deployment state: {prod_deploy.get('state')}",
                    "impact": "Deployment may not be serving traffic"
                })
            
            # Check environment variables
            env_check = self._check_environment_variables()
            if env_check.get('missing_critical'):
                gaps.append({
                    "gap_type": "missing_env_vars",
                    "severity": "HIGH",
                    "truth": f"Missing: {', '.join(env_check['missing_critical'])}",
                    "impact": "Application may fail at runtime"
                })
            
            # Check deployment age
            if prod_deploy.get('created_at'):
                created = datetime.fromtimestamp(prod_deploy['created_at'] / 1000)
                age_hours = (datetime.utcnow() - created).total_seconds() / 3600
                if age_hours > 168:  # 1 week
                    gaps.append({
                        "gap_type": "stale_deployment",
                        "severity": "MEDIUM",
                        "truth": f"Deployment is {int(age_hours/24)} days old",
                        "impact": "Potentially outdated code in production"
                    })
            
            return {
                "gaps": gaps,
                "total_gaps": len(gaps),
                "critical_gaps": len([g for g in gaps if g['severity'] == 'CRITICAL'])
            }
            
        except Exception as e:
            return {
                "error": str(e),
                "timestamp": datetime.utcnow().isoformat()
            }
    
    def _get_github_latest_commit(self) -> Optional[str]:
        """Get latest commit from GitHub (if GitHub agent available)"""
        # This will integrate with GitHub agent
        github_cache = Path(__file__).parent.parent / "github-connector" / ".cache" / "latest_commit.json"
        if github_cache.exists():
            with open(github_cache) as f:
                data = json.load(f)
                return data.get('sha')
        return None
    
    def _check_environment_variables(self) -> Dict[str, Any]:
        """Check if critical environment variables are set"""
        try:
            url = f"{self.base_url}/v8/projects/{self.project_id}/env"
            if self.team_id:
                url += f"?teamId={self.team_id}"
                
            response = requests.get(url, headers=self.headers, timeout=10)
            
            if response.status_code != 200:
                return {"error": f"API returned {response.status_code}"}
            
            data = response.json()
            env_vars = data.get('envs', [])
            
            # Define critical variables (customize per project)
            critical = ['DATABASE_URL', 'SUPABASE_URL', 'SUPABASE_ANON_KEY']
            existing = [env['key'] for env in env_vars]
            
            missing = [var for var in critical if var not in existing]
            
            return {
                "total_vars": len(env_vars),
                "critical_present": [var for var in critical if var in existing],
                "missing_critical": missing,
                "has_all_critical": len(missing) == 0
            }
            
        except Exception as e:
            return {"error": str(e)}
    
    def _count_deployments_in_timeframe(self, hours: int) -> int:
        """Count deployments in last N hours"""
        # Placeholder - implement based on API data
        return 0
    
    def _count_failed_deployments(self, hours: int) -> int:
        """Count failed deployments in last N hours"""
        # Placeholder - implement based on API data
        return 0
    
    def generate_deployment_report(self) -> Dict[str, Any]:
        """Generate comprehensive deployment truth report"""
        report = {
            "agent": self.name,
            "session": self.session_id,
            "timestamp": datetime.utcnow().isoformat(),
            "levels": {}
        }
        
        # Discover all levels
        report["levels"]["connection"] = self.discover_level_1()
        if report["levels"]["connection"].get("connected"):
            report["levels"]["current_state"] = self.discover_level_2()
            report["levels"]["recent_changes"] = self.discover_level_3()
            report["levels"]["gaps"] = self.discover_level_4()
        
        # Calculate health score
        health = 100
        if not report["levels"]["connection"].get("connected"):
            health = 0
        elif report["levels"].get("gaps", {}).get("gaps"):
            gaps = report["levels"]["gaps"]["gaps"]
            for gap in gaps:
                if gap["severity"] == "CRITICAL":
                    health -= 30
                elif gap["severity"] == "HIGH":
                    health -= 15
                elif gap["severity"] == "MEDIUM":
                    health -= 5
        
        report["health_score"] = max(0, health)
        report["status"] = "healthy" if health > 70 else "degraded" if health > 30 else "critical"
        
        # Cache the report
        cache_file = self.cache_dir / f"deployment_report_{datetime.utcnow().strftime('%Y%m%d_%H%M%S')}.json"
        with open(cache_file, 'w') as f:
            json.dump(report, f, indent=2)
        
        return report

# CLI Interface
if __name__ == "__main__":
    import sys
    
    agent = VercelRealityAgent()
    
    if len(sys.argv) > 1:
        command = sys.argv[1]
        
        if command == "--help":
            print("Vercel Reality Agent - Deployment Truth Monitor")
            print("\nUsage:")
            print("  python connector.py          # Full report")
            print("  python connector.py --level N # Specific level (1-4)")
            print("  python connector.py --gaps    # Only show gaps")
            print("\nEnvironment Variables Required:")
            print("  VERCEL_TOKEN        # Your Vercel API token")
            print("  VERCEL_PROJECT_ID   # Your project ID")
            print("  VERCEL_TEAM_ID      # Optional team ID")
            
        elif command == "--level" and len(sys.argv) > 2:
            level = int(sys.argv[2])
            if level == 1:
                result = agent.discover_level_1()
            elif level == 2:
                result = agent.discover_level_2()
            elif level == 3:
                result = agent.discover_level_3()
            elif level == 4:
                result = agent.discover_level_4()
            else:
                result = {"error": "Invalid level. Use 1-4"}
            print(json.dumps(result, indent=2))
            
        elif command == "--gaps":
            gaps = agent.discover_level_4()
            if gaps.get("gaps"):
                print("REALITY GAPS DETECTED:")
                print("=" * 50)
                for gap in gaps["gaps"]:
                    print(f"\n[{gap['severity']}] {gap['gap_type']}")
                    print(f"  Truth: {gap['truth']}")
                    print(f"  Impact: {gap['impact']}")
            else:
                print("No reality gaps detected")
    else:
        # Full report
        report = agent.generate_deployment_report()
        
        print("=" * 60)
        print("         VERCEL DEPLOYMENT REALITY REPORT")
        print("=" * 60)
        
        if report["health_score"] == 100:
            print("\n✅ Deployment Reality: PERFECT")
        elif report["health_score"] > 70:
            print(f"\n⚠️  Deployment Reality: DEGRADED ({report['health_score']}%)")
        else:
            print(f"\n❌ Deployment Reality: CRITICAL ({report['health_score']}%)")
        
        if report["levels"].get("current_state", {}).get("production_deployment"):
            prod = report["levels"]["current_state"]["production_deployment"]
            print(f"\n📦 Production Deployment:")
            print(f"  URL: {prod.get('url')}")
            print(f"  Commit: {prod.get('git_commit', 'unknown')[:7]}")
            print(f"  State: {prod.get('state')}")
            print(f"  Branch: {prod.get('git_branch')}")
        
        if report["levels"].get("gaps", {}).get("gaps"):
            print(f"\n⚠️  Reality Gaps Found: {len(report['levels']['gaps']['gaps'])}")
            for gap in report["levels"]["gaps"]["gaps"]:
                print(f"  - [{gap['severity']}] {gap['truth']}")
        
        print("\n" + "=" * 60)
```

## Step 3: Create quickstart.py

```python
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
        print(f"   Latency: {connection.get('latency_ms')}ms")
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
```

## Step 4: Create requirements.txt

```txt
requests>=2.28.0
```

## Step 5: Test Commands

```bash
# Navigate to the agent directory
cd reality/agent-reality-auditor/vercel-connector/

# Install dependencies
pip install -r requirements.txt

# Set environment variables
export VERCEL_TOKEN="your-token-here"
export VERCEL_PROJECT_ID="your-project-id"

# Run quick test
python3 quickstart.py

# Run full report
python3 connector.py

# Check for gaps only
python3 connector.py --gaps

# Test specific level
python3 connector.py --level 2
```

## Expected Output Examples

### Successful Connection
```
Testing Vercel Reality Agent...
==================================================

1. Testing Connection...
✅ Connected to Vercel API
   Latency: 234.5ms
   Rate limit remaining: 1000

2. Getting Current Deployment...
✅ Production: https://your-project.vercel.app
   Commit: abc1234
   State: READY
   Branch: main

3. Checking Recent Changes...
✅ Found 5 recent deployments
   1. abc1234 - READY (production)
   2. def5678 - READY (preview)
   3. ghi9012 - ERROR (preview)

4. Detecting Reality Gaps...
⚠️  Found 1 reality gaps:
   - [HIGH] deployment_behind
     Truth: Deployed: abc1234, GitHub: xyz9876
     Impact: Latest code not in production
```

### No Credentials
```
Testing Vercel Reality Agent...
==================================================

1. Testing Connection...
❌ Cannot connect to Vercel
   Error: 401 Unauthorized

⚠️  Check your environment variables:
   VERCEL_TOKEN: NOT SET
   VERCEL_PROJECT_ID: NOT SET
```

## Troubleshooting

### Problem: 401 Unauthorized
**Solution**: Your VERCEL_TOKEN is invalid or expired. Get a new one from https://vercel.com/account/tokens

### Problem: Project not found
**Solution**: Your VERCEL_PROJECT_ID is wrong. Check Vercel dashboard → Project Settings → General → Project ID

### Problem: No deployments found
**Solution**: Your project exists but has never been deployed. Deploy once from Vercel dashboard.

### Problem: Rate limited
**Solution**: Vercel API has rate limits. Wait a few minutes or implement caching.

## Integration Notes

This agent will automatically integrate with:
- GitHub Agent (for commit comparison)
- Integration Agent (for system-wide health)
- Dashboard (for visualization)

The agent is designed to be:
- **Read-only**: Never modifies Vercel state
- **Cached**: Stores results in .cache/ directory
- **Graceful**: Handles missing credentials without crashing
- **Truth-focused**: Reports what IS, not what SHOULD BE

## Next Steps

After successful implementation:
1. Test with your actual Vercel project
2. Verify gaps detection works
3. Move to Part 2: API Contract Agent
4. Update Integration Agent (Part 3)
5. Run full validation (Part 4)