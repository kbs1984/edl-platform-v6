#!/usr/bin/env python3
"""
Basic smoke tests for Reality Dashboard
"""

import unittest
import tempfile
import json
import os
from unittest.mock import patch, MagicMock
from reality_dashboard import RealityDashboard

class TestRealityDashboard(unittest.TestCase):
    
    def test_init(self):
        """Test dashboard initialization"""
        dashboard = RealityDashboard()
        self.assertIsNotNone(dashboard)
    
    @patch('reality_dashboard.IntegrationRealityAgent')
    def test_collect_health_data(self, mock_agent_class):
        """Test health data collection"""
        mock_agent = MagicMock()
        mock_agent.generate_integration_report.return_value = {
            'health': {'overall': 1.0},
            'agents': {},
            'debt': {'debt_score': 0}
        }
        mock_agent_class.return_value = mock_agent
        
        dashboard = RealityDashboard()
        data = dashboard.collect_health_data()
        
        self.assertIsInstance(data, dict)
        self.assertIn('health', data)
        self.assertIn('timestamp', data)
    
    def test_save_dashboard_data(self):
        """Test dashboard data saving"""
        dashboard = RealityDashboard()
        test_data = {
            'timestamp': '2025-01-01T00:00:00',
            'health': {'overall': 1.0}
        }
        
        with tempfile.NamedTemporaryFile(mode='w', suffix='.json', delete=False) as f:
            temp_path = f.name
        
        try:
            dashboard.save_dashboard_data(test_data, temp_path)
            
            with open(temp_path, 'r') as f:
                saved_data = json.load(f)
            
            self.assertEqual(saved_data, test_data)
        finally:
            os.unlink(temp_path)
    
    def test_format_health_display(self):
        """Test health display formatting"""
        dashboard = RealityDashboard()
        test_health = {
            'overall': 0.95,
            'synchronization': 1.0,
            'completeness': 0.9
        }
        
        display = dashboard.format_health_display(test_health)
        self.assertIsInstance(display, str)
        self.assertIn('95%', display)

if __name__ == '__main__':
    unittest.main()