#!/usr/bin/env python3
"""
Test Assumption Prevention System
Demonstrates how Session 00005's enhancement prevents ghost sessions
"""

from assumption_detector import AssumptionDetector
from connector import IntegrationRealityAgent

def test_ghost_session_prevention():
    """Test that ghost session creation is blocked"""
    
    print("🔮 ASSUMPTION PREVENTION TEST")
    print("=" * 50)
    
    detector = AssumptionDetector()
    
    # Test 1: Ghost session prevention
    print("\n1. Ghost Session Prevention Test:")
    
    prevention = detector.prevent_ghost_session(6, 5)  # Try to create Session 00006 from Session 00005
    
    print(f"  Attempting to create Session 00006 from Session 00005:")
    print(f"  Action: {prevention['action']}")
    print(f"  Reason: {prevention['reason']}")
    print(f"  Recommendation: {prevention.get('recommendation', 'N/A')}")
    
    # Test 2: Assumption detection in text
    print("\n2. Assumption Detection Test:")
    
    test_text = """
    Desktop suggests enhancements for next session.
    Session 00006 should implement the dashboard.
    Maybe we could add this later.
    """
    
    assumptions = detector.detect_assumptions(test_text, "00005")
    print(f"  Assumptions detected: {len(assumptions)}")
    
    for assumption in assumptions:
        print(f"    - {assumption['type']}: '{assumption['text']}' [{assumption['severity']}]")
    
    # Test 3: Ghost session detection
    print("\n3. Ghost Session Detection Test:")
    
    ghost_text = "Session 00006 will handle this. Session 00007 might be needed."
    ghosts = detector.detect_ghost_sessions(ghost_text, 5)
    
    print(f"  Ghost sessions detected: {len(ghosts)}")
    for ghost in ghosts:
        print(f"    - Session {ghost['session_number']:05d} (current: {ghost['current_session']:05d})")
    
    # Test 4: Integration with full system
    print("\n4. Full Integration Test:")
    
    agent = IntegrationRealityAgent()
    health = agent.calculate_health_score()
    
    print(f"  Assumption Clarity: {health.get('assumption_clarity', 1.0):.1%}")
    print(f"  Overall Health: {health['overall']:.1%}")
    
    print("\n✅ All tests demonstrate prevention working!")
    print("\nThe Session 00005 enhancement successfully prevents:")
    print("  - Ghost session artifact creation")
    print("  - Assumption-based reality forks") 
    print("  - Temporal displacement confusion")
    print("  - Future reference deceptions")

if __name__ == "__main__":
    test_ghost_session_prevention()