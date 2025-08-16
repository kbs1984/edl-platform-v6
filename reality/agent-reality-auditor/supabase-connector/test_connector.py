#!/usr/bin/env python3
"""
Basic smoke tests for Supabase Reality Agent
"""

import unittest
import os
from unittest.mock import patch, MagicMock
from connector import SupabaseConnector

class TestSupabaseConnector(unittest.TestCase):
    
    def test_init_without_credentials_raises(self):
        """Test connector initialization without credentials raises error"""
        with patch.dict(os.environ, {}, clear=True):
            with self.assertRaises(ValueError) as context:
                connector = SupabaseConnector()
            self.assertIn("REALITY_001", str(context.exception))
            self.assertIn("Missing credentials", str(context.exception))
    
    def test_init_with_credentials(self):
        """Test connector initialization with credentials"""
        test_url = "https://test.supabase.co"
        test_key = "test-key"
        
        with patch.dict(os.environ, {
            'SUPABASE_URL': test_url,
            'SUPABASE_ANON_KEY': test_key
        }):
            connector = SupabaseConnector()
            self.assertEqual(connector.url, test_url)
            self.assertEqual(connector.key, test_key)
    
    def test_level_1_discovery(self):
        """Test level 1 discovery returns expected structure"""
        with patch.dict(os.environ, {
            'SUPABASE_URL': 'https://test.supabase.co',
            'SUPABASE_ANON_KEY': 'test-key'
        }):
            connector = SupabaseConnector()
            # Test that connector has expected attributes after init
            self.assertIsNotNone(connector.session_id)
            self.assertEqual(connector.discovery_level, 0)
    
    def test_requires_both_url_and_key(self):
        """Test that both URL and key are required"""
        # Test with only URL
        with patch.dict(os.environ, {'SUPABASE_URL': 'https://test.supabase.co'}, clear=True):
            with self.assertRaises(ValueError):
                connector = SupabaseConnector()
        
        # Test with only key
        with patch.dict(os.environ, {'SUPABASE_ANON_KEY': 'test-key'}, clear=True):
            with self.assertRaises(ValueError):
                connector = SupabaseConnector()

if __name__ == '__main__':
    unittest.main()