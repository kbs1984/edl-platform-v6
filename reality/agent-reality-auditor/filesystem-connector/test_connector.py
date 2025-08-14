#!/usr/bin/env python3
"""
File System Reality Agent - Test Suite
Tests all levels of progressive discovery
"""

import json
import sys
import time
from pathlib import Path
from connector import FileSystemConnector

def test_level_1():
    """Test basic file system access"""
    print("\n=== Testing Level 1: File System Access ===")
    
    connector = FileSystemConnector()
    result = connector.discover_level_1()
    
    assert result["connection"]["status"] == "connected", "Should connect to file system"
    assert result["metadata"]["confidence_score"] > 0, "Should have confidence"
    assert result["connection"]["available_space_bytes"] > 0, "Should detect disk space"
    
    print(f"✅ Status: {result['connection']['status']}")
    print(f"✅ Permission: {result['connection']['permission_level']}")
    print(f"✅ Platform: {result['connection']['fs_type']}")
    print(f"✅ Available space: {result['connection']['available_space_bytes'] / (1024**3):.1f} GB")
    
    return True

def test_level_2():
    """Test directory structure discovery"""
    print("\n=== Testing Level 2: Directory Structure ===")
    
    connector = FileSystemConnector()
    result = connector.discover_level_2()
    
    assert "error" not in result, f"Should not have errors: {result.get('error')}"
    assert result["discoveries"]["summary"]["total_files"] > 0, "Should find files"
    assert result["discoveries"]["summary"]["total_directories"] > 0, "Should find directories"
    
    print(f"✅ Files found: {result['discoveries']['summary']['total_files']}")
    print(f"✅ Directories found: {result['discoveries']['summary']['total_directories']}")
    print(f"✅ Max depth reached: {result['discoveries']['summary']['max_depth_reached']}")
    print(f"✅ Symlinks: {result['discoveries']['summary']['symlinks_found']}")
    
    if result['discoveries']['summary']['directories_skipped']:
        print(f"⚠️  Skipped: {', '.join(result['discoveries']['summary']['directories_skipped'][:3])}")
    
    return True

def test_level_3():
    """Test file metadata and content discovery"""
    print("\n=== Testing Level 3: File Metadata ===")
    
    connector = FileSystemConnector()
    result = connector.discover_level_3()
    
    assert "error" not in result, f"Should not have errors: {result.get('error')}"
    assert result["discoveries"]["summary"]["files_analyzed"] > 0, "Should analyze files"
    assert result["discoveries"]["summary"]["files_hashed"] > 0, "Should hash files"
    
    print(f"✅ Files analyzed: {result['discoveries']['summary']['files_analyzed']}")
    print(f"✅ Files hashed: {result['discoveries']['summary']['files_hashed']}")
    print(f"✅ Content sampled: {result['discoveries']['summary']['content_sampled']}")
    print(f"✅ Total size: {result['discoveries']['summary']['total_size_bytes'] / 1024:.1f} KB")
    
    # Show file type distribution
    file_types = result["discoveries"]["summary"]["file_types"]
    print(f"✅ File types: {list(file_types.keys())[:5]}")
    
    return True

def test_privacy_patterns():
    """Test that privacy patterns are respected"""
    print("\n=== Testing Privacy Patterns ===")
    
    # Create a test file that should not be read
    test_dir = Path("/tmp/fs_agent_test")
    test_dir.mkdir(exist_ok=True)
    
    # Create files that should be skipped
    (test_dir / ".env").write_text("SECRET_KEY=sensitive")
    (test_dir / "id_rsa").write_text("fake_private_key")
    (test_dir / "normal.txt").write_text("normal content")
    
    connector = FileSystemConnector(root_path=str(test_dir))
    result = connector.discover_level_3()
    
    # Check that sensitive files were not read
    files = result["discoveries"]["details"]["files"]
    
    for filename, info in files.items():
        if ".env" in filename or "id_rsa" in filename:
            assert "content_preview" not in info, f"Should not read {filename} content"
            if "hash" in info:
                assert info["hash"] == "skipped:privacy", f"Should skip hashing {filename}"
            print(f"✅ Skipped sensitive file: {filename}")
        elif "normal.txt" in filename:
            assert "content_preview" in info or "content_sample" in info, "Should read normal file"
            print(f"✅ Read normal file: {filename}")
    
    # Cleanup
    import shutil
    shutil.rmtree(test_dir)
    
    return True

def test_git_integration():
    """Test git status detection"""
    print("\n=== Testing Git Integration ===")
    
    connector = FileSystemConnector()
    
    # Check if git is available
    git_available = connector._check_git_available()
    print(f"✅ Git available: {git_available}")
    
    if git_available:
        # Test git status for a file
        test_file = Path(__file__)
        status = connector._get_git_status(test_file)
        print(f"✅ Git status for this test file: {status}")
        
        # Test git ignore
        is_ignored = connector._is_git_ignored(test_file)
        print(f"✅ Is test file ignored: {is_ignored}")
    else:
        print("⚠️  Not in a git repository - skipping git tests")
    
    return True

def test_snapshot_and_comparison():
    """Test snapshot capture and comparison"""
    print("\n=== Testing Snapshots ===")
    
    # Create test directory with known content
    test_dir = Path("/tmp/fs_agent_snapshot_test")
    test_dir.mkdir(exist_ok=True)
    
    # Initial state
    (test_dir / "file1.txt").write_text("initial content")
    (test_dir / "file2.txt").write_text("more content")
    
    connector = FileSystemConnector(root_path=str(test_dir))
    
    # Capture first snapshot
    snapshot1 = connector.capture_snapshot(discovery_level=3)
    print(f"✅ Captured snapshot 1: {snapshot1['snapshot_id']}")
    
    # Make changes
    time.sleep(1)  # Ensure timestamp difference
    (test_dir / "file1.txt").write_text("modified content")
    (test_dir / "file3.txt").write_text("new file")
    (test_dir / "file2.txt").unlink()  # Remove file
    
    # Capture second snapshot
    snapshot2 = connector.capture_snapshot(discovery_level=3)
    print(f"✅ Captured snapshot 2: {snapshot2['snapshot_id']}")
    
    # Compare snapshots
    comparison = connector.compare_snapshots(snapshot1, snapshot2)
    changes = comparison["change_detection"]["changes"]
    
    assert "file3.txt" in str(changes["files_added"]), "Should detect added file"
    assert "file2.txt" in str(changes["files_removed"]), "Should detect removed file"
    assert "file1.txt" in str(changes["files_modified"]), "Should detect modified file"
    
    print(f"✅ Files added: {changes['files_added']}")
    print(f"✅ Files removed: {changes['files_removed']}")
    print(f"✅ Files modified: {changes['files_modified']}")
    
    # Cleanup
    import shutil
    shutil.rmtree(test_dir)
    
    return True

def test_performance():
    """Test performance with limits"""
    print("\n=== Testing Performance Limits ===")
    
    # Create directory with many files
    test_dir = Path("/tmp/fs_agent_perf_test")
    test_dir.mkdir(exist_ok=True)
    
    # Create 100 files
    for i in range(100):
        (test_dir / f"file_{i}.txt").write_text(f"content {i}")
    
    connector = FileSystemConnector(root_path=str(test_dir))
    
    start_time = time.time()
    result = connector.discover_level_2()
    elapsed = time.time() - start_time
    
    print(f"✅ Processed 100 files in {elapsed:.2f} seconds")
    assert elapsed < 5, "Should process 100 files in under 5 seconds"
    
    # Test depth limit
    deep_dir = test_dir
    for i in range(15):  # Create deeper than MAX_DEPTH
        deep_dir = deep_dir / f"level_{i}"
        deep_dir.mkdir()
    
    result = connector.discover_level_2()
    assert result["discoveries"]["summary"]["max_depth_reached"] <= FileSystemConnector.MAX_DEPTH, \
        "Should respect MAX_DEPTH limit"
    print(f"✅ Respected MAX_DEPTH limit: {result['discoveries']['summary']['max_depth_reached']}")
    
    # Cleanup
    import shutil
    shutil.rmtree(test_dir)
    
    return True

def run_all_tests():
    """Run all tests"""
    print("🔍 File System Reality Agent - Test Suite")
    print("=" * 60)
    
    tests = [
        ("Level 1 Discovery", test_level_1),
        ("Level 2 Discovery", test_level_2),
        ("Level 3 Discovery", test_level_3),
        ("Privacy Patterns", test_privacy_patterns),
        ("Git Integration", test_git_integration),
        ("Snapshots", test_snapshot_and_comparison),
        ("Performance", test_performance)
    ]
    
    passed = 0
    failed = 0
    
    for test_name, test_func in tests:
        try:
            if test_func():
                passed += 1
                print(f"✅ {test_name}: PASSED\n")
            else:
                failed += 1
                print(f"❌ {test_name}: FAILED\n")
        except Exception as e:
            failed += 1
            print(f"❌ {test_name}: ERROR - {str(e)}\n")
    
    print("=" * 60)
    print(f"Results: {passed} passed, {failed} failed")
    
    return failed == 0

if __name__ == "__main__":
    success = run_all_tests()
    sys.exit(0 if success else 1)