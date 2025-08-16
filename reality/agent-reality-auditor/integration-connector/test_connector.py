#!/usr/bin/env python3
"""
Basic smoke tests for Integration Reality Agent
"""

import unittest
import os
from unittest.mock import patch, MagicMock
from pathlib import Path
from connector import IntegrationRealityAgent

class TestIntegrationRealityAgent(unittest.TestCase):
    
    def test_init(self):
        """Test agent initialization"""
        with patch.dict(os.environ, {
            'SUPABASE_URL': 'https://test.supabase.co',
            'SUPABASE_ANON_KEY': 'test-key'
        }):
            agent = IntegrationRealityAgent()
            self.assertIsNotNone(agent)
            self.assertIsInstance(agent.cache_dir, Path)
            self.assertTrue(agent.cache_dir.exists())
    
    def test_track_integration_debt(self):
        """Test integration debt tracking"""
        with patch.dict(os.environ, {
            'SUPABASE_URL': 'https://test.supabase.co',
            'SUPABASE_ANON_KEY': 'test-key'
        }):
            agent = IntegrationRealityAgent()
            result = agent.track_integration_debt()
            self.assertIsInstance(result, dict)
            self.assertIn('missing_tests', result)
            self.assertIn('total_debt_score', result)  # Fixed: was debt_score
            self.assertIn('debt_level', result)
    
    def test_calculate_health_score(self):
        """Test health score calculation"""
        with patch.dict(os.environ, {
            'SUPABASE_URL': 'https://test.supabase.co',
            'SUPABASE_ANON_KEY': 'test-key'
        }):
            agent = IntegrationRealityAgent()
            result = agent.calculate_health_score()
            self.assertIsInstance(result, dict)
            self.assertIn('overall', result)
            self.assertIn('synchronization', result)
            self.assertIn('completeness', result)
    
    def test_level_1_health_check(self):
        """Test level 1 health check"""
        with patch.dict(os.environ, {
            'SUPABASE_URL': 'https://test.supabase.co',
            'SUPABASE_ANON_KEY': 'test-key'
        }):
            agent = IntegrationRealityAgent()
            result = agent.level_1_health_check()
            self.assertIsInstance(result, dict)
            self.assertIn('agents', result)
            self.assertIn('summary', result)  # Fixed: was consensus
    
    def test_generate_visual_report(self):
        """Test visual report generation"""
        with patch.dict(os.environ, {
            'SUPABASE_URL': 'https://test.supabase.co',
            'SUPABASE_ANON_KEY': 'test-key'
        }):
            agent = IntegrationRealityAgent()
            result = agent.generate_visual_report()
            self.assertIsInstance(result, str)
            self.assertIn('Health Scores', result)

if __name__ == '__main__':
    unittest.main()