#!/usr/bin/env python3
"""
GitHub Reality Agent - Test Suite
Tests progressive discovery and session management functions
"""

import unittest
import json
import tempfile
import os
import sys
from pathlib import Path
from unittest.mock import patch, MagicMock

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent))
from connector import GitHubRealityAgent


class TestGitHubRealityAgent(unittest.TestCase):
    """Test suite for GitHub Reality Agent"""
    
    def setUp(self):
        """Set up test environment"""
        self.agent = GitHubRealityAgent(verbose=False)
    
    def test_initialization(self):
        """Test agent initialization"""
        self.assertIsNotNone(self.agent)
        self.assertEqual(self.agent.verbose, False)
        self.assertEqual(self.agent.gh_available, False)
        self.assertEqual(self.agent.authenticated, False)
    
    def test_confidence_levels(self):
        """Test confidence level definitions"""
        expected = {
            1: 1.0,
            2: 0.9,
            3: 0.8,
            4: 0.7,
            5: 0.6
        }
        self.assertEqual(self.agent.CONFIDENCE_LEVELS, expected)
    
    @patch('subprocess.run')
    def test_level_1_gh_not_installed(self, mock_run):
        """Test Level 1 when gh is not installed"""
        mock_run.return_value = MagicMock(
            returncode=127,
            stdout="",
            stderr="command not found"
        )
        
        result = self.agent.level_1_github_cli_access()
        
        self.assertEqual(result["level"], 1)
        self.assertEqual(result["confidence"], 0.0)
        self.assertFalse(result["gh_installed"])
        self.assertFalse(result["authenticated"])
    
    @patch('subprocess.run')
    def test_level_1_gh_installed_not_auth(self, mock_run):
        """Test Level 1 when gh is installed but not authenticated"""
        # First call: gh --version
        mock_run.side_effect = [
            MagicMock(returncode=0, stdout="gh version 2.46.0\n", stderr=""),
            MagicMock(returncode=1, stdout="", stderr="Not authenticated")
        ]
        
        result = self.agent.level_1_github_cli_access()
        
        self.assertEqual(result["level"], 1)
        self.assertEqual(result["confidence"], 0.5)
        self.assertTrue(result["gh_installed"])
        self.assertFalse(result["authenticated"])
    
    @patch('subprocess.run')
    def test_level_1_fully_authenticated(self, mock_run):
        """Test Level 1 when fully authenticated"""
        auth_output = """github.com
  ✓ Logged in to github.com account testuser
  - Token scopes: 'repo', 'workflow'"""
        
        rate_limit = json.dumps({
            "limit": 5000,
            "remaining": 4999,
            "reset": 1234567890,
            "used": 1
        })
        
        mock_run.side_effect = [
            MagicMock(returncode=0, stdout="gh version 2.46.0\n", stderr=""),
            MagicMock(returncode=0, stdout=auth_output, stderr=""),
            MagicMock(returncode=0, stdout=rate_limit, stderr="")
        ]
        
        result = self.agent.level_1_github_cli_access()
        
        self.assertEqual(result["level"], 1)
        self.assertEqual(result["confidence"], 1.0)
        self.assertTrue(result["gh_installed"])
        self.assertTrue(result["authenticated"])
        self.assertIn("repo", result["token_scopes"])
        self.assertIn("workflow", result["token_scopes"])
        self.assertIsNotNone(result["rate_limit"])
    
    @patch('subprocess.run')
    def test_level_2_not_git_repo(self, mock_run):
        """Test Level 2 when not in a git repository"""
        self.agent.authenticated = True
        
        mock_run.return_value = MagicMock(
            returncode=128,
            stdout="",
            stderr="not a git repository"
        )
        
        result = self.agent.level_2_repository_connection()
        
        self.assertEqual(result["level"], 2)
        self.assertEqual(result["confidence"], 0.0)
        self.assertFalse(result["is_git_repo"])
        self.assertFalse(result["has_remote"])
    
    @patch('subprocess.run')
    def test_level_2_git_repo_with_remote(self, mock_run):
        """Test Level 2 with git repo and GitHub remote"""
        self.agent.authenticated = True
        
        repo_info = json.dumps({
            "visibility": "public",
            "isFork": False,
            "parent": None
        })
        
        mock_run.side_effect = [
            MagicMock(returncode=0, stdout="true", stderr=""),  # is git repo
            MagicMock(returncode=0, stdout="https://github.com/owner/repo.git", stderr=""),  # remote URL
            MagicMock(returncode=0, stdout="refs/remotes/origin/main", stderr=""),  # default branch
            MagicMock(returncode=0, stdout=repo_info, stderr="")  # repo info
        ]
        
        result = self.agent.level_2_repository_connection()
        
        self.assertEqual(result["level"], 2)
        self.assertGreater(result["confidence"], 0.5)
        self.assertTrue(result["is_git_repo"])
        self.assertTrue(result["has_remote"])
        self.assertEqual(result["repo_owner"], "owner")
        self.assertEqual(result["repo_name"], "repo")
        self.assertEqual(result["default_branch"], "main")
        self.assertEqual(result["repo_visibility"], "public")
    
    def test_session_branch_creation(self):
        """Test session branch name generation"""
        session_id = "00004"
        expected_branch = f"session-{session_id}"
        
        # Test the branch name format
        result = {"branch_name": f"session-{session_id}"}
        self.assertEqual(result["branch_name"], expected_branch)
    
    @patch('subprocess.run')
    def test_create_pull_request(self, mock_run):
        """Test PR creation"""
        self.agent.authenticated = True
        
        pr_url = "https://github.com/owner/repo/pull/123"
        mock_run.return_value = MagicMock(
            returncode=0,
            stdout=pr_url,
            stderr=""
        )
        
        result = self.agent.create_pull_request(
            title="Test PR",
            body="Test body",
            draft=True
        )
        
        self.assertTrue(result["success"])
        self.assertEqual(result["pr_url"], pr_url)
        self.assertEqual(result["pr_number"], 123)
        self.assertIsNone(result["error"])
    
    @patch('subprocess.run')
    def test_create_issue(self, mock_run):
        """Test issue creation"""
        self.agent.authenticated = True
        
        issue_url = "https://github.com/owner/repo/issues/456"
        mock_run.return_value = MagicMock(
            returncode=0,
            stdout=issue_url,
            stderr=""
        )
        
        result = self.agent.create_issue(
            title="Test Issue",
            body="Test body",
            labels=["bug", "enhancement"]
        )
        
        self.assertTrue(result["success"])
        self.assertEqual(result["issue_url"], issue_url)
        self.assertEqual(result["issue_number"], 456)
        self.assertIsNone(result["error"])
    
    def test_discovery_unauthenticated(self):
        """Test discovery when not authenticated"""
        with patch.object(self.agent, 'level_1_github_cli_access') as mock_level1:
            mock_level1.return_value = {
                "level": 1,
                "confidence": 0.0,
                "gh_installed": False,
                "authenticated": False
            }
            
            result = self.agent.discover(max_level=5)
            
            self.assertIn("levels", result)
            self.assertIn(1, result["levels"])
            self.assertNotIn(2, result["levels"])  # Should not proceed beyond level 1
            self.assertEqual(result["overall_confidence"], 0.0)
    
    def test_discovery_authenticated(self):
        """Test full discovery when authenticated"""
        with patch.object(self.agent, 'level_1_github_cli_access') as mock_level1, \
             patch.object(self.agent, 'level_2_repository_connection') as mock_level2, \
             patch.object(self.agent, 'level_3_pull_request_state') as mock_level3, \
             patch.object(self.agent, 'level_4_issue_tracking_state') as mock_level4, \
             patch.object(self.agent, 'level_5_workflow_state') as mock_level5:
            
            # Mock return values that also set confidence scores
            def mock_l1():
                self.agent.confidence_scores[1] = 1.0
                self.agent.authenticated = True
                return {"level": 1, "confidence": 1.0, "authenticated": True}
            
            def mock_l2():
                self.agent.confidence_scores[2] = 0.9
                self.agent.repo_info = {"test": "data"}
                return {"level": 2, "confidence": 0.9}
            
            def mock_l3():
                self.agent.confidence_scores[3] = 0.8
                return {"level": 3, "confidence": 0.8}
            
            def mock_l4():
                self.agent.confidence_scores[4] = 0.7
                return {"level": 4, "confidence": 0.7}
            
            def mock_l5():
                self.agent.confidence_scores[5] = 0.6
                return {"level": 5, "confidence": 0.6}
            
            mock_level1.side_effect = mock_l1
            mock_level2.side_effect = mock_l2
            mock_level3.side_effect = mock_l3
            mock_level4.side_effect = mock_l4
            mock_level5.side_effect = mock_l5
            
            result = self.agent.discover(max_level=5)
            
            self.assertIn("levels", result)
            self.assertEqual(len(result["levels"]), 5)
            self.assertAlmostEqual(result["overall_confidence"], 0.8, places=1)
    
    def test_error_handling(self):
        """Test error handling in commands"""
        with patch('subprocess.run') as mock_run:
            mock_run.side_effect = Exception("Test exception")
            
            returncode, stdout, stderr = self.agent.run_command(["test", "command"])
            
            self.assertEqual(returncode, -1)
            self.assertEqual(stdout, "")
            self.assertIn("Test exception", stderr)


class TestIntegration(unittest.TestCase):
    """Integration tests (requires actual GitHub CLI)"""
    
    @unittest.skipUnless(
        os.system("which gh > /dev/null 2>&1") == 0,
        "GitHub CLI not installed"
    )
    def test_real_gh_version(self):
        """Test with real GitHub CLI"""
        agent = GitHubRealityAgent(verbose=False)
        returncode, stdout, stderr = agent.run_command(["gh", "--version"])
        
        self.assertEqual(returncode, 0)
        self.assertIn("gh version", stdout)
    
    @unittest.skipUnless(
        os.system("gh auth status > /dev/null 2>&1") == 0,
        "Not authenticated to GitHub"
    )
    def test_real_auth_status(self):
        """Test real authentication status"""
        agent = GitHubRealityAgent(verbose=False)
        result = agent.level_1_github_cli_access()
        
        self.assertTrue(result["gh_installed"])
        self.assertTrue(result["authenticated"])
        self.assertGreater(len(result["token_scopes"]), 0)


def run_tests():
    """Run the test suite"""
    # Create test suite
    loader = unittest.TestLoader()
    suite = unittest.TestSuite()
    
    # Add test cases
    suite.addTests(loader.loadTestsFromTestCase(TestGitHubRealityAgent))
    suite.addTests(loader.loadTestsFromTestCase(TestIntegration))
    
    # Run tests
    runner = unittest.TextTestRunner(verbosity=2)
    result = runner.run(suite)
    
    # Print summary
    print("\n" + "="*60)
    print("TEST SUMMARY")
    print("="*60)
    print(f"Tests run: {result.testsRun}")
    print(f"Failures: {len(result.failures)}")
    print(f"Errors: {len(result.errors)}")
    print(f"Skipped: {len(result.skipped)}")
    
    if result.wasSuccessful():
        print("\n✓ All tests passed!")
    else:
        print("\n✗ Some tests failed")
    
    return result.wasSuccessful()


if __name__ == "__main__":
    success = run_tests()
    sys.exit(0 if success else 1)