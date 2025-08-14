# SPEC-002: File System Reality Agent Plan
**Priority**: High  
**Created**: 2025-08-14 | Session #00002  
**Status**: Planning  
**Domain Owner**: Reality Domain  
**Based On**: SPEC-001-SUPABASE-AGENT-PLAN.md patterns

## Executive Summary
Create a File System Reality Agent that monitors local project files and directories, following the proven progressive discovery pattern from the Supabase Reality Agent. This agent provides truth about file system state with no assumptions about project structure or contents.

## Core Principle
**"This agent observes and reports file system reality. It never modifies, assumes, or wishes."**

## Part 1: Assumptions to Test

### File System Access Methods
1. **Python pathlib vs os module**
   - Test: Which provides better cross-platform compatibility?
   - Test: Performance difference on large directory trees
   - Assumption: pathlib is more pythonic and maintainable

2. **Directory Traversal Approach**
   - Test: os.walk() vs pathlib.rglob() vs manual recursion
   - Test: Memory usage on deep directory structures
   - Assumption: os.walk() provides best control over traversal

3. **File Reading Strategy**
   - Test: Full read vs chunked reading for large files
   - Test: Binary file type detection accuracy
   - Assumption: Chunked reading prevents memory issues

### Performance Implications
1. **Caching Effectiveness**
   - Test: Cache hit rate with different TTLs
   - Test: Memory usage of cached metadata
   - Assumption: 30-second metadata cache optimal

2. **Hashing Performance**
   - Test: SHA-256 vs MD5 vs xxhash for change detection
   - Test: Impact of hashing large files
   - Assumption: SHA-256 provides best security/performance balance

3. **Directory Size Limits**
   - Test: Performance with node_modules (10,000+ files)
   - Test: Memory usage with deep nesting (10+ levels)
   - Assumption: Limits prevent agent lockup

### Cache Strategy for File Contents
1. **Content Cache Validity**
   - Test: Using mtime vs content hash for invalidation
   - Test: Cache size limits and eviction
   - Assumption: mtime is sufficient for most cases

2. **Partial Content Caching**
   - Test: Caching first/last N lines vs full content
   - Test: Compression benefit for cached content
   - Assumption: Partial caching reduces memory significantly

## Part 2: Architecture Design

### Reusable Components from Supabase Agent

```python
# Components to adapt from connector.py
class FileSystemConnector:
    # Reuse these patterns:
    CACHE_TTL = {
        "structure": 60,      # Directory structure
        "metadata": 30,       # File metadata
        "content": 300,       # File contents
        "snapshot": 3600      # Full snapshots
    }
    
    def __init__(self):
        # Reuse: Session ID generation
        # Reuse: Cache directory structure
        # Reuse: Environment variable configuration
        
    def _get_cache_path(self, cache_type: str) -> Path:
        # Reuse: Exact same implementation
        
    def _is_cache_valid(self, cache_type: str) -> bool:
        # Reuse: TTL-based validation
        
    def capture_snapshot(self, discovery_level: int) -> Dict:
        # Reuse: Snapshot system architecture
        
    def compare_snapshots(self, old, new) -> Dict:
        # Reuse: Comparison engine pattern
```

### New Components Specific to File System

```python
class FileSystemConnector:
    # New components needed:
    
    def _should_read_content(self, file_path: Path) -> bool:
        """Check privacy patterns before reading"""
        
    def _detect_file_type(self, file_path: Path) -> str:
        """MIME type detection for binary files"""
        
    def _calculate_file_hash(self, file_path: Path) -> str:
        """SHA-256 hash for change detection"""
        
    def _respect_ignore_patterns(self, path: Path) -> bool:
        """Check .gitignore and .fs-agent-ignore"""
        
    def _sample_large_file(self, file_path: Path) -> Dict:
        """Read first/last N lines of large files"""
```

### Directory Structure
```
reality/agent-reality-auditor/
├── supabase-connector/
│   ├── connector.py
│   ├── quickstart.py
│   └── .cache/
├── filesystem-connector/      # NEW
│   ├── connector.py          # Main module
│   ├── quickstart.py         # Validation script
│   ├── .cache/              # Shared cache structure
│   │   ├── snapshots/
│   │   └── discoveries/
│   └── .fs-agent-ignore      # Default exclusions
└── PURPOSE.md
```

## Part 3: Progressive Discovery Specification

### Level 1: File System Availability (Confidence: 0.0-1.0)
**Purpose**: Verify file system access and permissions

**Discovers**:
- Can we access the root path?
- What are our read permissions?
- File system type and characteristics
- Available disk space

**Output**:
```json
{
    "connection": {
        "status": "connected|limited|failed",
        "permission_level": "full_read|limited|none",
        "root_path": "/absolute/path",
        "fs_type": "ext4|ntfs|apfs",
        "available_space_bytes": 1000000000
    }
}
```

**Confidence Scoring**:
- 1.0: Full read access to root path
- 0.5: Limited access (some subdirs restricted)
- 0.0: No access or root doesn't exist

### Level 2: Directory Structure (Confidence: 0.3-0.9)
**Purpose**: Map directory tree and file counts

**Discovers**:
- Directory hierarchy
- File counts per directory
- Directory sizes
- Symlink presence (but not followed)

**Output**:
```json
{
    "summary": {
        "total_directories": 100,
        "total_files": 1000,
        "max_depth_reached": 5,
        "directories_skipped": ["node_modules"],
        "symlinks_found": 3
    },
    "details": {
        "tree": {
            "/": {
                "file_count": 10,
                "dir_count": 5,
                "size_bytes": 50000
            }
        }
    }
}
```

**Confidence Scoring**:
- 0.9: Complete traversal, no skipped directories
- 0.7: Some directories skipped due to limits
- 0.5: Many directories inaccessible
- 0.3: Partial traversal due to permissions

### Level 3: File Metadata & Properties (Confidence: 0.4-0.95)
**Purpose**: Detailed file information and metadata

**Discovers**:
- File sizes, permissions, timestamps
- File types and MIME types
- Content sampling for text files
- Git tracking status

**Output**:
```json
{
    "summary": {
        "total_size_bytes": 10000000,
        "file_types": {
            ".py": 50,
            ".md": 20,
            ".json": 10
        },
        "largest_files": [],
        "newest_files": [],
        "git_tracked_files": 70,
        "git_ignored_files": 30
    },
    "details": {
        "files": {
            "path/to/file.py": {
                "size_bytes": 1024,
                "permissions": "rw-r--r--",
                "modified": "2025-08-14T10:00:00Z",
                "type": "text/python",
                "hash": "sha256:abc123...",
                "content_sample": "first 100 lines...",
                "git_tracked": true
            }
        }
    }
}
```

**Confidence Scoring**:
- 0.95: All files fully analyzed
- 0.8: Most files analyzed, some content sampled
- 0.6: Many large files only partially analyzed
- 0.4: Significant permission restrictions

### Level 4: Change Tracking (Confidence: 0.7-1.0)
**Purpose**: Detect and categorize file system changes

**Discovers**:
- Files added/removed/modified since last snapshot
- Directory structure changes
- Permission changes
- Size/content changes

**Output**:
```json
{
    "change_detection": {
        "enabled": true,
        "previous_snapshot": "abc12345",
        "current_snapshot": "def67890",
        "changes": {
            "files_added": ["new/file.py"],
            "files_removed": ["old/file.py"],
            "files_modified": ["existing/file.py"],
            "directories_added": ["new/dir"],
            "directories_removed": [],
            "permission_changes": [],
            "total_size_change_bytes": 5000
        }
    }
}
```

**Confidence Scoring**:
- 1.0: Complete comparison with previous snapshot
- 0.9: Minor differences in traversal paths
- 0.8: Some files couldn't be re-checked
- 0.7: First snapshot (no comparison possible)

## Part 4: Change Detection Strategy

### What Constitutes a "Change"

**File-Level Changes**:
1. **Content Change**: SHA-256 hash differs
2. **Metadata Change**: Size, permissions, or mtime differs
3. **Location Change**: File moved (same hash, different path)
4. **Existence Change**: File added or removed

**Directory-Level Changes**:
1. **Structure Change**: Subdirectories added/removed
2. **Content Change**: File count changed
3. **Permission Change**: Directory access modified

### Snapshot Storage Approach

```python
# Snapshot structure
{
    "snapshot_id": "8-char-hash",
    "timestamp": "ISO-8601",
    "root_path": "/absolute/path",
    "discovery_level": 4,
    "state": {
        "structure": {},  # Level 2 data
        "metadata": {},   # Level 3 data
        "hashes": {}      # SHA-256 hashes
    },
    "statistics": {
        "files_scanned": 1000,
        "directories_scanned": 100,
        "errors_encountered": 0
    }
}
```

**Storage Location**: `.cache/snapshots/fs_snapshot_{id}.json`

### Comparison Algorithm

```python
def compare_snapshots(old, new):
    # 1. Build path sets
    old_paths = set(old["state"]["hashes"].keys())
    new_paths = set(new["state"]["hashes"].keys())
    
    # 2. Identify changes
    added = new_paths - old_paths
    removed = old_paths - new_paths
    common = old_paths & new_paths
    
    # 3. Check modifications
    modified = []
    for path in common:
        if old["state"]["hashes"][path] != new["state"]["hashes"][path]:
            modified.append(path)
    
    # 4. Categorize changes
    return categorize_changes(added, removed, modified)
```

## Part 5: Implementation Phases

### Phase 1: Foundation (2 hours)
- [ ] Create `filesystem-connector/` directory structure
- [ ] Implement basic `FileSystemConnector` class
- [ ] Port cache management from Supabase agent
- [ ] Implement Level 1 discovery (access & permissions)
- [ ] Create quickstart.py for validation
- [ ] Set up environment variable configuration

### Phase 2: Progressive Discovery (3 hours)
- [ ] Implement Level 2 (directory structure)
- [ ] Add ignore pattern support (.gitignore, .fs-agent-ignore)
- [ ] Implement Level 3 (file metadata)
- [ ] Add file type detection and MIME types
- [ ] Implement content sampling for large files
- [ ] Add SHA-256 hashing system

### Phase 3: Change Tracking (2 hours)
- [ ] Port snapshot system from Supabase agent
- [ ] Adapt comparison engine for file system
- [ ] Implement change categorization
- [ ] Add movement detection (same hash, new location)
- [ ] Create history management

### Phase 4: Integration & Testing (2 hours)
- [ ] Integration with Reality Domain
- [ ] Performance testing with large directories
- [ ] Cross-platform compatibility testing
- [ ] Documentation and examples
- [ ] Error recovery and edge cases

## Part 6: Risk Assessment

### Performance Risks

**Large Directories (node_modules)**
- **Risk**: Agent hangs or uses excessive memory
- **Mitigation**: MAX_FILES_PER_DIR limit (default 1000)
- **Detection**: Log when limits triggered
- **Recovery**: Skip directory, report in limitations

**Deep Nesting**
- **Risk**: Stack overflow or slow traversal
- **Mitigation**: MAX_DEPTH limit (default 10)
- **Detection**: Track recursion depth
- **Recovery**: Stop at max depth, report partial discovery

### Binary File Handling

**Large Binary Files**
- **Risk**: Memory exhaustion trying to read
- **Mitigation**: Never read binary content, only metadata
- **Detection**: Check file extension and magic bytes
- **Recovery**: Report as binary, skip content

**Special File Types**
- **Risk**: Hanging on pipes, devices, sockets
- **Mitigation**: Check file type before access
- **Detection**: Use os.path.isfile() strictly
- **Recovery**: Skip non-regular files

### Symbolic Links

**Infinite Loops**
- **Risk**: Following circular symlinks
- **Mitigation**: Never follow symlinks
- **Detection**: os.path.islink() check
- **Recovery**: Report symlink presence only

**Security Boundaries**
- **Risk**: Escaping intended root via symlinks
- **Mitigation**: Resolve all paths to absolute
- **Detection**: Check path.startswith(root)
- **Recovery**: Reject paths outside root

### Cross-Platform Compatibility

**Path Separators**
- **Risk**: Windows \ vs Unix /
- **Mitigation**: Use pathlib exclusively
- **Detection**: Platform detection on init
- **Recovery**: Normalize all paths

**Permissions Models**
- **Risk**: Windows ACL vs Unix permissions
- **Mitigation**: Report raw permission data
- **Detection**: Platform-specific checks
- **Recovery**: Graceful degradation

**Case Sensitivity**
- **Risk**: Windows case-insensitive, Unix case-sensitive
- **Mitigation**: Preserve original case always
- **Detection**: Test file system on init
- **Recovery**: Document in limitations

## Success Criteria

1. **Progressive Discovery**: Each level builds on previous
2. **Pattern Reuse**: >60% code reused from Supabase agent
3. **Performance**: <5 seconds for 1000 files
4. **Memory**: <100MB for 10,000 file snapshot
5. **Accuracy**: 100% change detection accuracy
6. **Safety**: Zero file modifications ever
7. **Privacy**: Never expose sensitive content

## Output Specification Alignment

The File System agent output follows identical structure to Supabase agent:

```json
{
    "metadata": {
        "timestamp": "ISO-8601",
        "agent": "filesystem-reality",
        "check_type": "level_X_discovery",
        "session_id": "unique-id",
        "confidence_score": 0.0-1.0,
        "root_path": "/monitored/path",
        "limitations": ["symlinks_not_followed", "large_files_sampled"]
    },
    "connection": {
        "status": "connected|limited|failed",
        "permission_level": "full_read|limited|none"
    },
    "discoveries": {
        "level": 1-4,
        "summary": {},
        "details": {}
    },
    "changes": {
        "detected": true|false,
        "categories": {}
    },
    "health": {
        "issues": [],
        "warnings": [],
        "recommendations": []
    }
}
```

## Integration with Supabase Agent

**Shared Infrastructure**:
- Cache directory structure
- Snapshot management system
- Error code namespace (REALITY_XXX)
- Output format specification

**Complementary Coverage**:
- Supabase Agent: Database reality (external state)
- File System Agent: Code reality (internal state)
- Combined: Complete project reality

**Future Integration Points**:
- Correlation of file changes with database changes
- Unified Reality Domain reporting
- Cross-agent change detection

## Open Questions for Review

1. **File Content Hashing**: SHA-256 for all files, or quick hash for large files?
2. **Git Integration**: Should we detect staged vs unstaged changes?
3. **Real-time Monitoring**: Future enhancement to add inotify/FSEvents?
4. **Compression**: Should we compress cached snapshots?
5. **Diff Generation**: Should Level 4 include actual diff content?

## Conclusion

This plan provides a comprehensive blueprint for implementing a File System Reality Agent that:
- Leverages proven patterns from the Supabase agent
- Respects Reality Domain principles of truth and transparency
- Handles file system complexity safely and efficiently
- Integrates seamlessly with existing architecture

The implementation will follow the same quality standards and constitutional principles that made the Supabase agent successful.

---

**Requirements Domain Approval**: Pending  
**Reality Domain Review**: Pending  
**Session #00001 Review**: Pending  

*This specification serves as the planning foundation for the File System Reality Agent implementation*