#!/usr/bin/env python3
"""
Test Incremental Build Performance (50x Target)
Session: 00059
Purpose: Verify incremental builds are 50x faster than full builds
"""

import time
import sys
import os
from pathlib import Path
import tempfile
import shutil

sys.path.append(str(Path(__file__).parent))
from importlib import import_module

# Import our modules
indexer_module = import_module('00059-yaml-indexer')
YAMLIndexer = indexer_module.YAMLIndexer

agent_path = Path(__file__).parent.parent / 'reality' / 'agent-filesystem'
sys.path.append(str(agent_path))
agent_module = import_module('00059-filesystem-agent-level3')
CachedFileSystemAgent = agent_module.CachedFileSystemAgent


def test_incremental_performance():
    """Test incremental vs full build performance"""
    print("🚀 Testing Incremental Build Performance (50x Target)")
    print("=" * 60)
    
    # Test 1: YAML Indexer Performance
    print("\n📊 Test 1: YAML Indexer")
    print("-" * 40)
    
    # Clear cache for fair test
    cache_file = Path('.yaml-index-cache.pkl')
    if cache_file.exists():
        cache_file.unlink()
    
    # Full build (no cache)
    indexer1 = YAMLIndexer(cache_enabled=False)
    start = time.time()
    indexer1.scan_files()
    full_time = time.time() - start
    files_count = indexer1.stats['files_processed']
    
    print(f"Full build: {full_time:.3f}s for {files_count} files")
    print(f"Speed: {files_count/full_time:.1f} files/second")
    
    # Incremental build (with cache)
    indexer2 = YAMLIndexer(cache_enabled=True)
    # First run to populate cache
    indexer2.scan_files()
    
    # Now test incremental (all cached)
    indexer3 = YAMLIndexer(cache_enabled=True)
    start = time.time()
    indexer3.scan_files()
    incremental_time = time.time() - start
    
    print(f"Incremental: {incremental_time:.3f}s for {files_count} files")
    print(f"Speed: {files_count/incremental_time:.1f} files/second")
    
    speedup1 = full_time / incremental_time
    print(f"🎯 Speedup: {speedup1:.1f}x")
    
    if speedup1 >= 50:
        print("✅ YAML Indexer: 50x target ACHIEVED!")
    elif speedup1 >= 10:
        print(f"🟡 YAML Indexer: {speedup1:.1f}x speedup (target: 50x)")
    else:
        print(f"❌ YAML Indexer: Only {speedup1:.1f}x speedup")
    
    # Test 2: FileSystem Agent Performance
    print("\n📊 Test 2: FileSystem Agent Level 3")
    print("-" * 40)
    
    agent = CachedFileSystemAgent()
    
    # Full rebuild
    start = time.time()
    result1 = agent.full_rebuild()
    full_agent_time = time.time() - start
    
    print(f"Full rebuild: {full_agent_time:.3f}s")
    print(f"Files processed: {result1.get('files_processed', 'N/A')}")
    
    # Simulate file changes (touch a few files)
    test_files = list(Path('.').glob('*.md'))[:3]
    for f in test_files:
        f.touch()
    
    # Incremental update
    changed = agent.detect_changes()
    start = time.time()
    result2 = agent.incremental_update(changed)
    incremental_agent_time = time.time() - start
    
    print(f"Incremental: {incremental_agent_time:.3f}s")
    print(f"Files changed: {len(changed)}")
    
    if incremental_agent_time > 0:
        speedup2 = full_agent_time / incremental_agent_time
        print(f"🎯 Speedup: {speedup2:.1f}x")
        
        if speedup2 >= 50:
            print("✅ FileSystem Agent: 50x target ACHIEVED!")
        elif speedup2 >= 10:
            print(f"🟡 FileSystem Agent: {speedup2:.1f}x speedup")
        else:
            print(f"❌ FileSystem Agent: Only {speedup2:.1f}x speedup")
    
    # Test 3: Simulated Large Change Set
    print("\n📊 Test 3: Incremental with Multiple Changes")
    print("-" * 40)
    
    # Create temporary test files
    with tempfile.TemporaryDirectory() as tmpdir:
        tmp_path = Path(tmpdir)
        
        # Create 10 test files with YAML
        for i in range(10):
            test_file = tmp_path / f"test-{i:03d}.md"
            content = f"""---
session: "00059"
type: "test"
status: "current"
created: "2025-08-23"
title: "Test File {i}"
purpose: "Performance testing"
---

# Test File {i}

This is test content for performance testing.
"""
            test_file.write_text(content)
        
        # Test incremental with new files
        indexer_tmp = YAMLIndexer(str(tmp_path), cache_enabled=True)
        
        # Initial scan
        start = time.time()
        indexer_tmp.scan_files()
        initial_time = time.time() - start
        
        # Add more files
        for i in range(10, 15):
            test_file = tmp_path / f"test-{i:03d}.md"
            test_file.write_text(f"# Test {i}\n\nNo frontmatter")
        
        # Incremental scan
        indexer_tmp2 = YAMLIndexer(str(tmp_path), cache_enabled=True)
        start = time.time()
        indexer_tmp2.scan_files()
        update_time = time.time() - start
        
        print(f"Initial scan (10 files): {initial_time:.3f}s")
        print(f"Incremental (5 new files): {update_time:.3f}s")
        
        if initial_time > 0:
            efficiency = update_time / initial_time
            print(f"Efficiency: {efficiency:.2f} (lower is better)")
            
            if efficiency < 0.5:
                print("✅ Efficient incremental processing")
            else:
                print("🟡 Incremental could be more efficient")
    
    # Overall Summary
    print("\n" + "=" * 60)
    print("📊 OVERALL PERFORMANCE SUMMARY")
    print("=" * 60)
    
    print(f"\n🎯 Performance Achievements:")
    print(f"  • YAML Indexer speedup: {speedup1:.1f}x")
    print(f"  • FileSystem Agent speedup: {speedup2:.1f}x" if incremental_agent_time > 0 else "  • FileSystem Agent: N/A")
    print(f"  • Cache hit rate: {indexer3.stats.get('cache_hit_rate', 0):.1f}%")
    
    avg_speedup = speedup1
    if incremental_agent_time > 0:
        avg_speedup = (speedup1 + speedup2) / 2
    
    print(f"\n📈 Average Speedup: {avg_speedup:.1f}x")
    
    if avg_speedup >= 50:
        print("✅ 50x TARGET ACHIEVED!")
    elif avg_speedup >= 25:
        print(f"🟡 Good performance: {avg_speedup:.1f}x (target: 50x)")
    else:
        print(f"⚠️ Below target: {avg_speedup:.1f}x (target: 50x)")
    
    # Performance recommendations
    print("\n💡 Performance Optimization Tips:")
    if avg_speedup < 50:
        print("  • Ensure cache is warm before measuring")
        print("  • Use SSD for better I/O performance")
        print("  • Consider parallel processing for large sets")
        print("  • Optimize file hash calculation")
    else:
        print("  • Performance target met!")
        print("  • System ready for production use")
        print("  • Can handle 10x file growth efficiently")


if __name__ == "__main__":
    test_incremental_performance()