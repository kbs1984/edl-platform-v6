#!/usr/bin/env python3
"""
GitHub Reality Agent - Quickstart Validation
Checks prerequisites and estimates discovery scope
"""

import subprocess
import json
import os
import sys
from pathlib import Path
from typing import Dict, List, Tuple

class GitHubQuickstart:
    """Validate GitHub CLI setup and estimate discovery scope"""
    
    def __init__(self):
        self.checks = {
            "git_installed": False,
            "git_repo": False,
            "gh_installed": False,
            "gh_authenticated": False,
            "has_remote": False,
            "remote_is_github": False,
            "can_create_pr": False,
            "can_create_issue": False
        }
        self.warnings = []
        self.recommendations = []
        
    def run_command(self, cmd: List[str]) -> Tuple[int, str, str]:
        """Execute command safely"""
        try:
            result = subprocess.run(
                cmd,
                capture_output=True,
                text=True,
                timeout=5
            )
            return result.returncode, result.stdout, result.stderr
        except subprocess.TimeoutExpired:
            return -1, "", "Command timed out"
        except Exception as e:
            return -1, "", str(e)
    
    def check_git(self) -> bool:
        """Check git installation and repository"""
        print("🔍 Checking git installation...")
        
        # Check git installed
        code, out, err = self.run_command(["git", "--version"])
        if code == 0:
            self.checks["git_installed"] = True
            print(f"  ✓ Git installed: {out.strip()}")
        else:
            print("  ✗ Git not installed")
            self.recommendations.append("Install git: sudo apt-get install git")
            return False
        
        # Check if in git repo
        code, out, err = self.run_command(["git", "rev-parse", "--is-inside-work-tree"])
        if code == 0:
            self.checks["git_repo"] = True
            print("  ✓ Inside git repository")
        else:
            print("  ✗ Not in a git repository")
            self.recommendations.append("Initialize git: git init")
            return False
        
        # Check for remote
        code, out, err = self.run_command(["git", "remote", "get-url", "origin"])
        if code == 0:
            self.checks["has_remote"] = True
            remote_url = out.strip()
            print(f"  ✓ Has remote: {remote_url}")
            
            if "github.com" in remote_url:
                self.checks["remote_is_github"] = True
                print("  ✓ Remote is GitHub")
            else:
                print("  ⚠ Remote is not GitHub")
                self.warnings.append("Remote repository is not on GitHub")
        else:
            print("  ⚠ No remote configured")
            self.recommendations.append("Add remote: git remote add origin <github-url>")
        
        return True
    
    def check_github_cli(self) -> bool:
        """Check GitHub CLI installation and auth"""
        print("\n🔍 Checking GitHub CLI...")
        
        # Check gh installed
        code, out, err = self.run_command(["gh", "--version"])
        if code == 0:
            self.checks["gh_installed"] = True
            version = out.strip().split('\n')[0]
            print(f"  ✓ GitHub CLI installed: {version}")
        else:
            print("  ✗ GitHub CLI not installed")
            self.recommendations.append(
                "Install GitHub CLI: https://cli.github.com/manual/installation"
            )
            return False
        
        # Check authentication
        code, out, err = self.run_command(["gh", "auth", "status"])
        if code == 0:
            self.checks["gh_authenticated"] = True
            print("  ✓ Authenticated to GitHub")
            
            # Check scopes
            for line in out.split('\n'):
                if 'Token scopes:' in line:
                    scopes = line.split(':', 1)[1].strip()
                    print(f"  ✓ Token scopes: {scopes}")
                    
                    # Check for required scopes
                    if 'repo' in scopes:
                        self.checks["can_create_pr"] = True
                        self.checks["can_create_issue"] = True
                    else:
                        self.warnings.append("Token missing 'repo' scope for full functionality")
        else:
            print("  ✗ Not authenticated")
            self.recommendations.append("Authenticate: gh auth login")
            return False
        
        return True
    
    def check_api_limits(self) -> Dict:
        """Check GitHub API rate limits"""
        print("\n🔍 Checking API rate limits...")
        
        if not self.checks["gh_authenticated"]:
            print("  ⚠ Skipping (not authenticated)")
            return {}
        
        code, out, err = self.run_command(
            ["gh", "api", "rate_limit", "--jq", ".rate"]
        )
        
        if code == 0:
            try:
                limits = json.loads(out)
                remaining = limits.get("remaining", 0)
                limit = limits.get("limit", 0)
                
                print(f"  ✓ API calls remaining: {remaining}/{limit}")
                
                if remaining < 100:
                    self.warnings.append(f"Low API rate limit: {remaining} calls remaining")
                
                return limits
            except:
                print("  ⚠ Could not parse rate limits")
        else:
            print("  ⚠ Could not check rate limits")
        
        return {}
    
    def estimate_discovery(self) -> Dict:
        """Estimate what can be discovered"""
        print("\n📊 Discovery Estimation:")
        
        levels = {
            1: {"name": "GitHub CLI Access", "available": False, "confidence": 0.0},
            2: {"name": "Repository Connection", "available": False, "confidence": 0.0},
            3: {"name": "Pull Request State", "available": False, "confidence": 0.0},
            4: {"name": "Issue Tracking", "available": False, "confidence": 0.0},
            5: {"name": "Workflow/CI State", "available": False, "confidence": 0.0}
        }
        
        # Level 1
        if self.checks["gh_installed"]:
            levels[1]["available"] = True
            levels[1]["confidence"] = 1.0 if self.checks["gh_authenticated"] else 0.5
        
        # Level 2
        if self.checks["git_repo"] and self.checks["has_remote"] and self.checks["gh_authenticated"]:
            levels[2]["available"] = True
            levels[2]["confidence"] = 0.9 if self.checks["remote_is_github"] else 0.3
        
        # Levels 3-5
        if levels[2]["available"] and self.checks["remote_is_github"]:
            levels[3]["available"] = True
            levels[3]["confidence"] = 0.8
            levels[4]["available"] = True
            levels[4]["confidence"] = 0.7
            levels[5]["available"] = True
            levels[5]["confidence"] = 0.6
        
        for level, info in levels.items():
            status = "✓" if info["available"] else "✗"
            confidence = f"({info['confidence']:.0%})" if info["available"] else ""
            print(f"  Level {level}: {status} {info['name']} {confidence}")
        
        return levels
    
    def check_permissions(self) -> None:
        """Check repository permissions"""
        print("\n🔐 Checking Permissions:")
        
        if not self.checks["gh_authenticated"] or not self.checks["remote_is_github"]:
            print("  ⚠ Cannot check (not connected to GitHub)")
            return
        
        # Try to get repo info
        code, out, err = self.run_command(
            ["gh", "repo", "view", "--json", "viewerPermission"]
        )
        
        if code == 0:
            try:
                data = json.loads(out)
                permission = data.get("viewerPermission", "UNKNOWN")
                print(f"  ✓ Repository permission: {permission}")
                
                if permission in ["ADMIN", "MAINTAIN", "WRITE"]:
                    print("  ✓ Can create PRs and issues")
                elif permission == "READ":
                    self.warnings.append("Read-only access - cannot create PRs/issues")
                    self.checks["can_create_pr"] = False
                    self.checks["can_create_issue"] = False
            except:
                print("  ⚠ Could not determine permissions")
        else:
            print("  ⚠ Could not check permissions")
    
    def run(self) -> bool:
        """Run all checks"""
        print("="*60)
        print("GitHub Reality Agent - Quickstart Validation")
        print("="*60)
        
        # Run checks
        git_ok = self.check_git()
        gh_ok = self.check_github_cli()
        
        if gh_ok:
            self.check_api_limits()
            self.check_permissions()
        
        # Estimate discovery
        levels = self.estimate_discovery()
        
        # Summary
        print("\n" + "="*60)
        print("VALIDATION SUMMARY")
        print("="*60)
        
        total_checks = len(self.checks)
        passed_checks = sum(1 for v in self.checks.values() if v)
        
        print(f"\n✓ Passed: {passed_checks}/{total_checks} checks")
        
        if self.warnings:
            print(f"\n⚠ Warnings ({len(self.warnings)}):")
            for warning in self.warnings:
                print(f"  - {warning}")
        
        if self.recommendations:
            print(f"\n💡 Recommendations ({len(self.recommendations)}):")
            for rec in self.recommendations:
                print(f"  - {rec}")
        
        # Ready status
        print("\n" + "="*60)
        if passed_checks == total_checks:
            print("🚀 READY: All systems operational!")
            print("You can run full discovery with: python3 connector.py")
            return True
        elif self.checks["gh_authenticated"] and self.checks["git_repo"]:
            print("⚠️  PARTIAL: Basic functionality available")
            print("Some features may be limited. Check warnings above.")
            return True
        else:
            print("❌ NOT READY: Critical requirements missing")
            print("Please address the recommendations above.")
            return False


def main():
    quickstart = GitHubQuickstart()
    success = quickstart.run()
    
    # Suggest next steps
    print("\n📝 Next Steps:")
    if success:
        print("1. Run discovery: python3 connector.py --level 5")
        print("2. Test PR creation: python3 connector.py --create-pr")
        print("3. Test issue creation: python3 connector.py --create-issue")
    else:
        print("1. Fix the issues identified above")
        print("2. Re-run quickstart: python3 quickstart.py")
        print("3. Once ready, run discovery: python3 connector.py")
    
    sys.exit(0 if success else 1)


if __name__ == "__main__":
    main()