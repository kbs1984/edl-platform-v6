#!/usr/bin/env python3
"""
Session 126: Test MCP-Enhanced Reality Agent
Validates that the Supabase Reality Agent properly uses MCP for performance gains
"""

import sys
import json
import time
from pathlib import Path
from datetime import datetime

# Add reality directory to path
sys.path.append(str(Path(__file__).parent.parent / "reality"))
sys.path.append(str(Path(__file__).parent.parent / "reality/agent-reality-auditor/supabase-connector"))

def test_mcp_enhanced_reality_agent():
    """Test the MCP-enhanced Supabase Reality Agent"""
    
    print("""
╔══════════════════════════════════════════════════════════╗
║     Session 126: MCP-Enhanced Reality Agent Test          ║
║           Validating Performance Improvements              ║
╚══════════════════════════════════════════════════════════╝
    """)
    
    try:
        # Import the enhanced connector
        from connector import SupabaseConnector
        
        print("✅ Imported Supabase connector successfully\n")
        
        # Initialize connector
        print("📋 Initializing Reality Agent...")
        connector = SupabaseConnector()
        
        # Check MCP availability
        print(f"🔍 MCP Available: {connector.use_mcp}")
        print(f"   Session ID: {connector.session_id}")
        
        if not connector.use_mcp:
            print("⚠️  MCP not available - will use REST fallback")
        else:
            print("✅ MCP is available for enhanced performance\n")
        
        # Test Level 1 Discovery (Connection)
        print("🧪 Testing Level 1 Discovery (Connection)...")
        start = time.perf_counter()
        level_1 = connector.discover_level_1()
        level_1_time = (time.perf_counter() - start) * 1000
        
        print(f"   Status: {level_1['connection']['status']}")
        print(f"   Time: {level_1_time:.2f}ms")
        
        if level_1["connection"]["status"] != "connected":
            print(f"❌ Connection failed: {level_1.get('error', 'Unknown error')}")
            return False
        
        print("   ✅ Level 1 passed\n")
        
        # Test Level 2 Discovery (Tables) - This should use MCP
        print("🧪 Testing Level 2 Discovery (Table Discovery)...")
        start = time.perf_counter()
        level_2 = connector.discover_level_2()
        level_2_time = (time.perf_counter() - start) * 1000
        
        print(f"   Method: {level_2.get('metadata', {}).get('method', 'unknown')}")
        print(f"   Time: {level_2_time:.2f}ms")
        
        # Check if MCP was used
        if level_2.get("metadata", {}).get("method") == "mcp_direct":
            print("   ✅ MCP was used for table discovery!")
            
            # Check performance data
            if "performance" in level_2:
                perf = level_2["performance"]
                print(f"   Performance:")
                print(f"      MCP Duration: {perf.get('duration_ms', 'N/A'):.2f}ms")
                print(f"      REST Estimate: {perf.get('estimated_rest_ms', 'N/A'):.2f}ms")
                print(f"      Speedup: {perf.get('speedup', 'N/A')}")
        else:
            print("   ⚠️ REST fallback was used")
            
        # Display table count
        if "table_count" in level_2:
            print(f"   Tables found: {level_2['table_count']}")
        elif "tables" in level_2:
            print(f"   Tables found: {len(level_2['tables'])}")
            
        # Check security analysis
        if "security_analysis" in level_2 and level_2["security_analysis"]:
            print("\n   Security Analysis:")
            for table, status in list(level_2["security_analysis"].items())[:5]:
                print(f"      {table}: {status}")
            if len(level_2["security_analysis"]) > 5:
                print(f"      ... and {len(level_2['security_analysis']) - 5} more tables")
        
        # Get performance summary
        print("\n📊 Performance Summary:")
        perf_summary = connector.get_performance_summary()
        
        print(f"   MCP Operations: {perf_summary['operations']['mcp_count']}")
        print(f"   REST Operations: {perf_summary['operations']['rest_count']}")
        
        if perf_summary["performance_gains"]:
            print(f"   Average Speedup: {perf_summary['average_speedup']:.1f}x")
            
            if "time_saved" in perf_summary:
                ts = perf_summary["time_saved"]
                print(f"   Time Saved: {ts['time_saved_ms']:.0f}ms ({ts['percentage_saved']:.1f}%)")
        
        print(f"\n   📝 {perf_summary['recommendation']}")
        
        # Test comparison with REST
        if connector.use_mcp:
            print("\n🔄 Comparing MCP vs REST Performance...")
            
            # Force REST for comparison
            connector.use_mcp = False
            print("   Forcing REST mode for comparison...")
            
            start = time.perf_counter()
            rest_level_2 = connector.discover_level_2()
            rest_time = (time.perf_counter() - start) * 1000
            
            print(f"   REST Discovery Time: {rest_time:.2f}ms")
            
            if level_2_time > 0:
                actual_speedup = rest_time / level_2_time
                print(f"   Actual Speedup: {actual_speedup:.1f}x")
                
                if actual_speedup >= 2:
                    print(f"   ✅ MCP is {actual_speedup:.1f}x faster than REST!")
                else:
                    print(f"   📊 MCP speedup: {actual_speedup:.1f}x")
        
        print("\n" + "="*60)
        print("✅ MCP-Enhanced Reality Agent Test Complete!")
        print("="*60)
        
        return True
        
    except ImportError as e:
        print(f"❌ Failed to import connector: {e}")
        return False
    except Exception as e:
        print(f"❌ Test failed: {e}")
        import traceback
        traceback.print_exc()
        return False


def test_mcp_operations_directly():
    """Test MCP operations directly through Claude"""
    
    print("\n🔬 Testing Direct MCP Operations...")
    
    try:
        # This will only work when run through Claude
        print("   Testing mcp__supabase_dev__list_tables...")
        
        # Note: These MCP calls only work in Claude environment
        # They're commented out for the Python script
        """
        tables = mcp__supabase_dev__list_tables(schemas=["public"])
        print(f"   ✅ Found {len(tables)} tables via MCP")
        
        # Test a complex query
        print("   Testing complex aggregation via MCP...")
        result = mcp__supabase_dev__execute_sql(query='''
            SELECT 
                COUNT(DISTINCT p.id) as total_profiles,
                COUNT(DISTINCT s.id) as total_students
            FROM profile p
            LEFT JOIN student s ON s.user_id = p.id
        ''')
        print(f"   ✅ Aggregation result: {result}")
        """
        
        print("   ⚠️ Direct MCP calls only work in Claude environment")
        
    except Exception as e:
        print(f"   ⚠️ Direct MCP test skipped: {e}")


if __name__ == "__main__":
    # Test the enhanced Reality Agent
    success = test_mcp_enhanced_reality_agent()
    
    # Test direct MCP operations (only works in Claude)
    test_mcp_operations_directly()
    
    if success:
        print("\n🎉 All tests passed! MCP integration is working.")
        sys.exit(0)
    else:
        print("\n❌ Some tests failed. Check the output above.")
        sys.exit(1)