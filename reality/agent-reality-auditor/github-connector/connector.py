#!/usr/bin/env python3
"""
GitHub Reality Agent - Progressive Discovery Connector
Implements SPEC-003: GitHub State Discovery
Constitutional compliance: Article VII (transparency through version control)
"""

import subprocess
import json
import os
import sys
from datetime import datetime
from typing import Dict, List, Tuple, Optional, Any
from pathlib import Path
import argparse
import time

class GitHubRealityAgent:
    """
    Progressive discovery of GitHub repository state.
    Follows Reality Domain principles: report actual state, not desired state.
    """
    
    CONFIDENCE_LEVELS = {
        1: 1.0,     # GitHub CLI availability
        2: 0.9,     # Repository connection
        3: 0.8,     # Pull request state
        4: 0.7,     # Issue tracking state
        5: 0.6      # Workflow/CI state
    }
    
    def __init__(self, repo_path: str = ".", verbose: bool = False):
        self.repo_path = Path(repo_path).resolve()
        self.verbose = verbose
        self.gh_available = False
        self.authenticated = False
        self.repo_info = {}
        self.discovery_timestamp = datetime.now().isoformat()
        self.confidence_scores = {}
        
    def log(self, message: str, level: str = "INFO"):
        """Constitutional logging requirement"""
        if self.verbose:
            timestamp = datetime.now().strftime("%H:%M:%S")
            print(f"[{timestamp}] [{level}] {message}")
    
    def run_command(self, cmd: List[str], check: bool = True) -> Tuple[int, str, str]:
        """Execute command and return (returncode, stdout, stderr)"""
        try:
            result = subprocess.run(
                cmd,
                capture_output=True,
                text=True,
                check=check,
                cwd=self.repo_path
            )
            return result.returncode, result.stdout, result.stderr
        except subprocess.CalledProcessError as e:
            return e.returncode, e.stdout, e.stderr
        except Exception as e:
            return -1, "", str(e)
    
    def level_1_github_cli_access(self) -> Dict[str, Any]:
        """Level 1: Verify GitHub CLI availability and authentication"""
        self.log("Starting Level 1: GitHub CLI access verification")
        
        result = {
            "level": 1,
            "confidence": 0.0,
            "gh_installed": False,
            "gh_version": None,
            "authenticated": False,
            "auth_status": None,
            "token_scopes": [],
            "rate_limit": None
        }
        
        # Check if gh is installed
        returncode, stdout, stderr = self.run_command(["gh", "--version"], check=False)
        if returncode == 0:
            result["gh_installed"] = True
            result["gh_version"] = stdout.strip().split('\n')[0]
            self.gh_available = True
            self.log(f"GitHub CLI found: {result['gh_version']}")
        else:
            self.log("GitHub CLI not installed", "WARNING")
            return result
        
        # Check authentication status
        returncode, stdout, stderr = self.run_command(["gh", "auth", "status"], check=False)
        if returncode == 0:
            result["authenticated"] = True
            result["auth_status"] = stdout
            self.authenticated = True
            
            # Extract token scopes from output
            for line in stdout.split('\n'):
                if 'Token scopes:' in line:
                    scopes = line.split(':', 1)[1].strip()
                    result["token_scopes"] = [s.strip().strip("'") for s in scopes.split(',')]
            
            self.log("GitHub authentication confirmed")
        else:
            self.log("Not authenticated to GitHub", "WARNING")
            result["auth_status"] = stderr or "Not authenticated"
        
        # Check API rate limit
        if result["authenticated"]:
            returncode, stdout, stderr = self.run_command(
                ["gh", "api", "rate_limit", "--jq", ".rate"],
                check=False
            )
            if returncode == 0:
                try:
                    result["rate_limit"] = json.loads(stdout)
                    self.log(f"API rate limit: {result['rate_limit'].get('remaining', 'unknown')}/{result['rate_limit'].get('limit', 'unknown')}")
                except:
                    pass
        
        # Calculate confidence
        if result["gh_installed"]:
            result["confidence"] = 0.5
            if result["authenticated"]:
                result["confidence"] = 1.0
        
        self.confidence_scores[1] = result["confidence"]
        return result
    
    def level_2_repository_connection(self) -> Dict[str, Any]:
        """Level 2: Verify repository connection and remote configuration"""
        self.log("Starting Level 2: Repository connection discovery")
        
        result = {
            "level": 2,
            "confidence": 0.0,
            "is_git_repo": False,
            "has_remote": False,
            "remote_url": None,
            "default_branch": None,
            "repo_visibility": None,
            "repo_owner": None,
            "repo_name": None,
            "is_fork": False,
            "parent_repo": None
        }
        
        if not self.authenticated:
            self.log("Skipping Level 2: Not authenticated", "WARNING")
            return result
        
        # Check if current directory is a git repo
        returncode, stdout, stderr = self.run_command(
            ["git", "rev-parse", "--is-inside-work-tree"],
            check=False
        )
        if returncode != 0:
            self.log("Not inside a git repository", "WARNING")
            return result
        
        result["is_git_repo"] = True
        
        # Get remote URL
        returncode, stdout, stderr = self.run_command(
            ["git", "remote", "get-url", "origin"],
            check=False
        )
        if returncode == 0:
            result["has_remote"] = True
            result["remote_url"] = stdout.strip()
            
            # Parse owner and repo from URL
            url = result["remote_url"]
            if "github.com" in url:
                parts = url.split('/')
                if len(parts) >= 2:
                    result["repo_owner"] = parts[-2].split(':')[-1]
                    result["repo_name"] = parts[-1].replace('.git', '')
        
        # Get default branch
        returncode, stdout, stderr = self.run_command(
            ["git", "symbolic-ref", "refs/remotes/origin/HEAD"],
            check=False
        )
        if returncode == 0:
            result["default_branch"] = stdout.strip().split('/')[-1]
        
        # Get repository info from GitHub API
        if result["repo_owner"] and result["repo_name"]:
            returncode, stdout, stderr = self.run_command(
                ["gh", "repo", "view", f"{result['repo_owner']}/{result['repo_name']}", "--json",
                 "visibility,isFork,parent"],
                check=False
            )
            if returncode == 0:
                try:
                    repo_data = json.loads(stdout)
                    result["repo_visibility"] = repo_data.get("visibility")
                    result["is_fork"] = repo_data.get("isFork", False)
                    if result["is_fork"] and repo_data.get("parent"):
                        result["parent_repo"] = repo_data["parent"].get("nameWithOwner")
                    
                    self.repo_info = repo_data
                    self.log(f"Repository: {result['repo_owner']}/{result['repo_name']} ({result['repo_visibility']})")
                except:
                    pass
        
        # Calculate confidence
        if result["is_git_repo"]:
            result["confidence"] = 0.3
            if result["has_remote"]:
                result["confidence"] = 0.6
                if result["repo_visibility"]:
                    result["confidence"] = 0.9
        
        self.confidence_scores[2] = result["confidence"]
        return result
    
    def level_3_pull_request_state(self) -> Dict[str, Any]:
        """Level 3: Discover pull request state"""
        self.log("Starting Level 3: Pull request state discovery")
        
        result = {
            "level": 3,
            "confidence": 0.0,
            "current_branch": None,
            "has_upstream": False,
            "pr_exists": False,
            "pr_number": None,
            "pr_state": None,
            "pr_url": None,
            "open_prs": [],
            "recent_merged_prs": []
        }
        
        if not self.authenticated or not self.repo_info:
            self.log("Skipping Level 3: Prerequisites not met", "WARNING")
            return result
        
        # Get current branch
        returncode, stdout, stderr = self.run_command(
            ["git", "branch", "--show-current"],
            check=False
        )
        if returncode == 0:
            result["current_branch"] = stdout.strip()
            self.log(f"Current branch: {result['current_branch']}")
        
        # Check if current branch has PR
        if result["current_branch"]:
            returncode, stdout, stderr = self.run_command(
                ["gh", "pr", "status", "--json", "currentBranch"],
                check=False
            )
            if returncode == 0:
                try:
                    pr_data = json.loads(stdout)
                    current = pr_data.get("currentBranch")
                    if current:
                        result["pr_exists"] = True
                        result["pr_number"] = current.get("number")
                        result["pr_state"] = current.get("state")
                        result["pr_url"] = current.get("url")
                        self.log(f"PR #{result['pr_number']} ({result['pr_state']})")
                except:
                    pass
        
        # Get open PRs
        returncode, stdout, stderr = self.run_command(
            ["gh", "pr", "list", "--limit", "10", "--json",
             "number,title,state,author,createdAt"],
            check=False
        )
        if returncode == 0:
            try:
                result["open_prs"] = json.loads(stdout)
                self.log(f"Found {len(result['open_prs'])} open PRs")
            except:
                pass
        
        # Get recently merged PRs
        returncode, stdout, stderr = self.run_command(
            ["gh", "pr", "list", "--state", "merged", "--limit", "5", "--json",
             "number,title,mergedAt,author"],
            check=False
        )
        if returncode == 0:
            try:
                result["recent_merged_prs"] = json.loads(stdout)
            except:
                pass
        
        # Calculate confidence
        if result["current_branch"]:
            result["confidence"] = 0.4
            if len(result["open_prs"]) > 0 or len(result["recent_merged_prs"]) > 0:
                result["confidence"] = 0.8
        
        self.confidence_scores[3] = result["confidence"]
        return result
    
    def level_4_issue_tracking_state(self) -> Dict[str, Any]:
        """Level 4: Discover issue tracking state"""
        self.log("Starting Level 4: Issue tracking state discovery")
        
        result = {
            "level": 4,
            "confidence": 0.0,
            "open_issues_count": 0,
            "open_issues": [],
            "assigned_issues": [],
            "recent_closed_issues": [],
            "labels": []
        }
        
        if not self.authenticated or not self.repo_info:
            self.log("Skipping Level 4: Prerequisites not met", "WARNING")
            return result
        
        # Get open issues
        returncode, stdout, stderr = self.run_command(
            ["gh", "issue", "list", "--limit", "20", "--json",
             "number,title,state,author,assignees,labels,createdAt"],
            check=False
        )
        if returncode == 0:
            try:
                result["open_issues"] = json.loads(stdout)
                result["open_issues_count"] = len(result["open_issues"])
                self.log(f"Found {result['open_issues_count']} open issues")
                
                # Extract assigned issues
                current_user_cmd = ["gh", "api", "user", "--jq", ".login"]
                user_code, user_out, _ = self.run_command(current_user_cmd, check=False)
                if user_code == 0:
                    current_user = user_out.strip()
                    result["assigned_issues"] = [
                        issue for issue in result["open_issues"]
                        if any(a.get("login") == current_user for a in issue.get("assignees", []))
                    ]
            except:
                pass
        
        # Get recently closed issues
        returncode, stdout, stderr = self.run_command(
            ["gh", "issue", "list", "--state", "closed", "--limit", "10", "--json",
             "number,title,closedAt,author"],
            check=False
        )
        if returncode == 0:
            try:
                result["recent_closed_issues"] = json.loads(stdout)
            except:
                pass
        
        # Get labels
        returncode, stdout, stderr = self.run_command(
            ["gh", "label", "list", "--limit", "50", "--json", "name,description,color"],
            check=False
        )
        if returncode == 0:
            try:
                result["labels"] = json.loads(stdout)
                self.log(f"Found {len(result['labels'])} labels")
            except:
                pass
        
        # Calculate confidence
        if result["open_issues_count"] > 0 or len(result["recent_closed_issues"]) > 0:
            result["confidence"] = 0.7
        elif len(result["labels"]) > 0:
            result["confidence"] = 0.5
        
        self.confidence_scores[4] = result["confidence"]
        return result
    
    def level_5_workflow_state(self) -> Dict[str, Any]:
        """Level 5: Discover GitHub Actions workflow state"""
        self.log("Starting Level 5: Workflow/CI state discovery")
        
        result = {
            "level": 5,
            "confidence": 0.0,
            "workflows": [],
            "recent_runs": [],
            "active_runs": [],
            "workflow_files": []
        }
        
        if not self.authenticated or not self.repo_info:
            self.log("Skipping Level 5: Prerequisites not met", "WARNING")
            return result
        
        # Check for workflow files locally
        workflows_dir = self.repo_path / ".github" / "workflows"
        if workflows_dir.exists():
            result["workflow_files"] = [
                f.name for f in workflows_dir.glob("*.yml")
            ] + [
                f.name for f in workflows_dir.glob("*.yaml")
            ]
            self.log(f"Found {len(result['workflow_files'])} workflow files")
        
        # Get workflow runs
        returncode, stdout, stderr = self.run_command(
            ["gh", "run", "list", "--limit", "10", "--json",
             "databaseId,name,status,conclusion,createdAt,headBranch"],
            check=False
        )
        if returncode == 0:
            try:
                result["recent_runs"] = json.loads(stdout)
                result["active_runs"] = [
                    run for run in result["recent_runs"]
                    if run.get("status") in ["in_progress", "queued"]
                ]
                self.log(f"Found {len(result['recent_runs'])} recent workflow runs")
            except:
                pass
        
        # Get workflow list
        returncode, stdout, stderr = self.run_command(
            ["gh", "workflow", "list", "--all", "--json", "name,state,id"],
            check=False
        )
        if returncode == 0:
            try:
                result["workflows"] = json.loads(stdout)
                self.log(f"Found {len(result['workflows'])} workflows")
            except:
                pass
        
        # Calculate confidence
        if len(result["workflows"]) > 0:
            result["confidence"] = 0.6
            if len(result["recent_runs"]) > 0:
                result["confidence"] = 0.8
        
        self.confidence_scores[5] = result["confidence"]
        return result
    
    def create_pull_request(self, title: str, body: str = "", 
                           draft: bool = False, base: str = None) -> Dict[str, Any]:
        """Create a pull request from current branch"""
        result = {
            "success": False,
            "pr_number": None,
            "pr_url": None,
            "error": None
        }
        
        if not self.authenticated:
            result["error"] = "Not authenticated to GitHub"
            return result
        
        cmd = ["gh", "pr", "create", "--title", title]
        if body:
            cmd.extend(["--body", body])
        if draft:
            cmd.append("--draft")
        if base:
            cmd.extend(["--base", base])
        
        returncode, stdout, stderr = self.run_command(cmd, check=False)
        
        if returncode == 0:
            result["success"] = True
            result["pr_url"] = stdout.strip()
            # Extract PR number from URL
            if "/pull/" in result["pr_url"]:
                result["pr_number"] = int(result["pr_url"].split("/pull/")[-1])
            self.log(f"Created PR: {result['pr_url']}")
        else:
            result["error"] = stderr or "Failed to create PR"
            self.log(f"PR creation failed: {result['error']}", "ERROR")
        
        return result
    
    def create_issue(self, title: str, body: str = "", 
                    labels: List[str] = None) -> Dict[str, Any]:
        """Create a GitHub issue"""
        result = {
            "success": False,
            "issue_number": None,
            "issue_url": None,
            "error": None
        }
        
        if not self.authenticated:
            result["error"] = "Not authenticated to GitHub"
            return result
        
        cmd = ["gh", "issue", "create", "--title", title]
        if body:
            cmd.extend(["--body", body])
        if labels:
            cmd.extend(["--label", ",".join(labels)])
        
        returncode, stdout, stderr = self.run_command(cmd, check=False)
        
        if returncode == 0:
            result["success"] = True
            result["issue_url"] = stdout.strip()
            # Extract issue number from URL
            if "/issues/" in result["issue_url"]:
                result["issue_number"] = int(result["issue_url"].split("/issues/")[-1])
            self.log(f"Created issue: {result['issue_url']}")
        else:
            result["error"] = stderr or "Failed to create issue"
            self.log(f"Issue creation failed: {result['error']}", "ERROR")
        
        return result
    
    def push_session_branch(self, session_id: str, create_pr: bool = False) -> Dict[str, Any]:
        """Push session work to remote branch"""
        result = {
            "success": False,
            "branch_name": f"session-{session_id}",
            "pushed": False,
            "pr_created": False,
            "pr_url": None,
            "error": None
        }
        
        # Create and checkout session branch
        returncode, stdout, stderr = self.run_command(
            ["git", "checkout", "-b", result["branch_name"]],
            check=False
        )
        if returncode != 0 and "already exists" not in stderr:
            result["error"] = f"Failed to create branch: {stderr}"
            return result
        
        # Push branch to remote
        returncode, stdout, stderr = self.run_command(
            ["git", "push", "-u", "origin", result["branch_name"]],
            check=False
        )
        
        if returncode == 0:
            result["pushed"] = True
            self.log(f"Pushed branch: {result['branch_name']}")
            
            if create_pr:
                pr_result = self.create_pull_request(
                    title=f"Session #{session_id} Work",
                    body=f"Automated PR for session {session_id} work",
                    draft=True
                )
                if pr_result["success"]:
                    result["pr_created"] = True
                    result["pr_url"] = pr_result["pr_url"]
                    result["success"] = True
        else:
            result["error"] = stderr or "Failed to push branch"
            self.log(f"Push failed: {result['error']}", "ERROR")
        
        return result
    
    def discover(self, max_level: int = 5) -> Dict[str, Any]:
        """Run progressive discovery up to specified level"""
        self.log(f"Starting GitHub Reality discovery (max level: {max_level})")
        
        results = {
            "discovery_timestamp": self.discovery_timestamp,
            "repo_path": str(self.repo_path),
            "levels": {},
            "overall_confidence": 0.0
        }
        
        # Level 1: GitHub CLI Access
        if max_level >= 1:
            results["levels"][1] = self.level_1_github_cli_access()
            if results["levels"][1]["confidence"] == 0:
                self.log("Cannot proceed without GitHub CLI", "ERROR")
                # Still calculate overall confidence even if we stop
                if self.confidence_scores:
                    results["overall_confidence"] = sum(self.confidence_scores.values()) / len(self.confidence_scores)
                results["discovery_complete"] = False
                return results
        
        # Level 2: Repository Connection
        if max_level >= 2 and self.authenticated:
            results["levels"][2] = self.level_2_repository_connection()
        
        # Level 3: Pull Request State
        if max_level >= 3 and self.authenticated:
            results["levels"][3] = self.level_3_pull_request_state()
        
        # Level 4: Issue Tracking State
        if max_level >= 4 and self.authenticated:
            results["levels"][4] = self.level_4_issue_tracking_state()
        
        # Level 5: Workflow State
        if max_level >= 5 and self.authenticated:
            results["levels"][5] = self.level_5_workflow_state()
        
        # Calculate overall confidence
        if self.confidence_scores:
            results["overall_confidence"] = sum(self.confidence_scores.values()) / len(self.confidence_scores)
        else:
            results["overall_confidence"] = 0.0
        
        results["discovery_complete"] = True
        self.log(f"Discovery complete. Overall confidence: {results['overall_confidence']:.2f}")
        
        return results


def main():
    parser = argparse.ArgumentParser(
        description="GitHub Reality Agent - Progressive Discovery"
    )
    parser.add_argument(
        "--level",
        type=int,
        default=5,
        choices=[1, 2, 3, 4, 5],
        help="Maximum discovery level (1-5)"
    )
    parser.add_argument(
        "--path",
        type=str,
        default=".",
        help="Repository path (default: current directory)"
    )
    parser.add_argument(
        "--verbose",
        action="store_true",
        help="Enable verbose output"
    )
    parser.add_argument(
        "--output",
        type=str,
        choices=["json", "text"],
        default="text",
        help="Output format"
    )
    parser.add_argument(
        "--create-pr",
        action="store_true",
        help="Test PR creation (interactive)"
    )
    parser.add_argument(
        "--create-issue",
        action="store_true",
        help="Test issue creation (interactive)"
    )
    
    args = parser.parse_args()
    
    # Initialize agent
    agent = GitHubRealityAgent(args.path, args.verbose)
    
    # Run discovery
    results = agent.discover(args.level)
    
    # Output results
    if args.output == "json":
        print(json.dumps(results, indent=2, default=str))
    else:
        print("\n" + "="*60)
        print("GitHub Reality Discovery Report")
        print("="*60)
        print(f"Timestamp: {results['discovery_timestamp']}")
        print(f"Repository: {results['repo_path']}")
        print(f"Overall Confidence: {results.get('overall_confidence', 0):.2%}")
        
        for level_num, level_data in results.get("levels", {}).items():
            print(f"\n--- Level {level_num} ---")
            print(f"Confidence: {level_data.get('confidence', 0):.2%}")
            
            if level_num == 1:
                print(f"GitHub CLI: {level_data.get('gh_version', 'Not installed')}")
                print(f"Authenticated: {level_data.get('authenticated', False)}")
                if level_data.get('token_scopes'):
                    print(f"Token Scopes: {', '.join(level_data['token_scopes'])}")
            
            elif level_num == 2:
                if level_data.get('repo_name'):
                    print(f"Repository: {level_data['repo_owner']}/{level_data['repo_name']}")
                    print(f"Visibility: {level_data.get('repo_visibility', 'unknown')}")
                    print(f"Default Branch: {level_data.get('default_branch', 'unknown')}")
            
            elif level_num == 3:
                print(f"Current Branch: {level_data.get('current_branch', 'unknown')}")
                print(f"Open PRs: {len(level_data.get('open_prs', []))}")
                if level_data.get('pr_exists'):
                    print(f"Current PR: #{level_data['pr_number']} ({level_data['pr_state']})")
            
            elif level_num == 4:
                print(f"Open Issues: {level_data.get('open_issues_count', 0)}")
                print(f"Assigned to You: {len(level_data.get('assigned_issues', []))}")
                print(f"Labels: {len(level_data.get('labels', []))}")
            
            elif level_num == 5:
                print(f"Workflows: {len(level_data.get('workflows', []))}")
                print(f"Recent Runs: {len(level_data.get('recent_runs', []))}")
                print(f"Active Runs: {len(level_data.get('active_runs', []))}")
    
    # Interactive tests
    if args.create_pr and agent.authenticated:
        print("\n--- PR Creation Test ---")
        title = input("PR Title: ")
        body = input("PR Body (optional): ")
        result = agent.create_pull_request(title, body or "", draft=True)
        if result["success"]:
            print(f"✓ Created PR: {result['pr_url']}")
        else:
            print(f"✗ Failed: {result['error']}")
    
    if args.create_issue and agent.authenticated:
        print("\n--- Issue Creation Test ---")
        title = input("Issue Title: ")
        body = input("Issue Body (optional): ")
        result = agent.create_issue(title, body or "")
        if result["success"]:
            print(f"✓ Created Issue: {result['issue_url']}")
        else:
            print(f"✗ Failed: {result['error']}")


if __name__ == "__main__":
    main()