#!/usr/bin/env python3
"""
Basic smoke tests for Assumption Detector
"""

import unittest
import tempfile
import os
from assumption_detector import AssumptionDetector, AssumptionRealityAgent

class TestAssumptionDetector(unittest.TestCase):
    
    def test_init(self):
        """Test detector initialization"""
        detector = AssumptionDetector()
        self.assertIsNotNone(detector)
    
    def test_scan_assumptions_empty_file(self):
        """Test assumption scanning on empty file"""
        detector = AssumptionDetector()
        
        with tempfile.NamedTemporaryFile(mode='w', suffix='.py', delete=False) as f:
            f.write("# Empty test file\npass\n")
            temp_path = f.name
        
        try:
            result = detector.scan_assumptions(temp_path)
            self.assertIsInstance(result, dict)
            self.assertIn('assumptions', result)
            self.assertIsInstance(result['assumptions'], list)
        finally:
            os.unlink(temp_path)
    
    def test_detect_assumption_patterns(self):
        """Test assumption pattern detection"""
        detector = AssumptionDetector()
        test_content = "# This assumes the file exists\nopen('file.txt')"
        
        assumptions = detector.detect_assumption_patterns(test_content)
        self.assertIsInstance(assumptions, list)

class TestAssumptionRealityAgent(unittest.TestCase):
    
    def test_init(self):
        """Test agent initialization"""
        agent = AssumptionRealityAgent()
        self.assertIsNotNone(agent)
    
    def test_scan_project_assumptions(self):
        """Test project-wide assumption scanning"""
        agent = AssumptionRealityAgent()
        result = agent.scan_project_assumptions()
        self.assertIsInstance(result, dict)
        self.assertIn('total_files_scanned', result)
        self.assertIn('assumptions_found', result)

if __name__ == '__main__':
    unittest.main()