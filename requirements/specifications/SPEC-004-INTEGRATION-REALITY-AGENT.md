# SPEC-004: Integration Reality Agent
**Proposed By**: Session 00004  
**For**: Session 00005  
**Date**: 2025-08-15  
**Type**: Reality Agent Development

## Executive Summary

Create an Integration Reality Agent that combines outputs from all existing Reality Agents (Supabase, File System, GitHub) to discover correlations and provide unified reality view. This agent will reveal integration gaps, inconsistencies, and the true state of the entire system.

## Background

We now have three specialized Reality Agents:
1. **Supabase Agent** - External database reality
2. **File System Agent** - Local code/file reality  
3. **GitHub Agent** - Version control/collaboration reality

Each provides partial truth. The Integration Agent will correlate these truths to reveal the complete picture.

## Problem Statement

Currently, each agent operates in isolation, missing critical correlations:
- Files changed locally but not committed
- Database schema drift from code expectations
- PRs claiming features that don't exist in code
- Documentation describing different reality than implementation
- Tests passing locally but failing in CI

## Proposed Solution

### Core Concept

```python
class IntegrationRealityAgent:
    """Discover truth through correlation of all reality domains"""
    
    def __init__(self):
        self.fs_agent = FileSystemConnector()
        self.gh_agent = GitHubConnector()
        self.db_agent = SupabaseConnector()
        
    def discover_integration_reality(self) -> Dict:
        # Gather individual realities
        fs_reality = self.fs_agent.discover(level=3)
        gh_reality = self.gh_agent.discover(level=3)
        db_reality = self.db_agent.discover(level=3)
        
        # Find correlations and gaps
        return {
            "individual_realities": {...},
            "correlations": self.find_correlations(),
            "inconsistencies": self.find_inconsistencies(),
            "gaps": self.find_gaps(),
            "unified_truth": self.synthesize_truth()
        }
```

### Progressive Discovery Levels

#### Level 1: Agent Availability (Confidence: 1.0)
- Check which agents are functional
- Verify credentials/access for each
- Report availability matrix

#### Level 2: Basic Correlation (Confidence: 0.8)
- Match files to git status
- Compare local vs remote branches
- Check if database tables match code models

#### Level 3: Deep Integration Analysis (Confidence: 0.6)
- Uncommitted changes analysis
- Schema drift detection
- PR/Issue vs code reality
- Documentation accuracy check

#### Level 4: Predictive Gaps (Confidence: 0.4)
- Likely integration failures
- Hidden dependencies
- Future conflicts
- Technical debt accumulation

### Key Correlations to Discover

1. **Version Control Gaps**
   ```python
   def find_vcs_gaps(self):
       return {
           "uncommitted": self.fs_reality.modified - self.gh_reality.committed,
           "unpushed": self.gh_reality.local_only_commits,
           "untracked": self.fs_reality.files - self.gh_reality.tracked
       }
   ```

2. **Database-Code Mismatches**
   ```python
   def find_schema_drift(self):
       code_models = self.extract_models_from_code()
       db_tables = self.db_agent.get_tables()
       return {
           "missing_in_db": code_models - db_tables,
           "missing_in_code": db_tables - code_models,
           "type_mismatches": self.compare_types()
       }
   ```

3. **Documentation Drift**
   ```python
   def find_doc_drift(self):
       return {
           "outdated_examples": self.verify_code_examples(),
           "missing_docs": self.find_undocumented_functions(),
           "incorrect_apis": self.validate_api_docs()
       }
   ```

## Implementation Plan

### Phase 1: Core Framework (2 hours)
1. Create `integration_connector.py`
2. Import and initialize all three agents
3. Implement basic discovery framework
4. Test agent availability detection

### Phase 2: Correlation Engine (2 hours)
1. Implement version control gap detection
2. Add schema drift analysis
3. Create documentation checker
4. Build correlation matrix

### Phase 3: Reporting (1 hour)
1. Create unified truth report format
2. Add confidence scoring
3. Implement priority ranking for gaps
4. Generate actionable recommendations

### Phase 4: Testing (1 hour)
1. Test with known inconsistencies
2. Verify correlation accuracy
3. Validate priority rankings
4. Test with session gaps (reality protocol)

## Expected Discoveries

The Integration Agent will likely reveal:

1. **Hidden Technical Debt**
   - Uncommitted fixes
   - Documented features that don't exist
   - Tests that don't test claimed functionality

2. **Integration Risks**
   - Files that will conflict on merge
   - Database migrations needed
   - Breaking changes not reflected in versions

3. **Reality Gaps**
   - What we claim vs what exists
   - What's tested vs what's broken
   - What's documented vs what's true

## Success Metrics

1. **Correlation Accuracy**: >90% accurate correlation between domains
2. **Gap Detection**: Find at least 10 real integration gaps
3. **Actionable Output**: Every gap has remediation suggestion
4. **Performance**: Complete analysis in <30 seconds

## Example Output

```json
{
  "timestamp": "2025-08-15T10:00:00",
  "integration_reality": {
    "health_score": 0.73,
    "critical_gaps": [
      {
        "type": "uncommitted_changes",
        "files": 12,
        "risk": "high",
        "action": "git add -A && git commit"
      },
      {
        "type": "schema_drift", 
        "tables_affected": ["users", "sessions"],
        "risk": "medium",
        "action": "Generate migration"
      }
    ],
    "correlations": {
      "fs_to_git": 0.89,
      "code_to_db": 0.71,
      "docs_to_code": 0.45
    },
    "truth": "System is 73% integrated. 27% exists in silos."
  }
}
```

## Testing Approach

### With Session Reality Protocol
Since Session 00005 will use the new reality protocol:
1. Start building the agent
2. Take natural break (test gap detection)
3. Resume and verify context preserved
4. Complete implementation across multiple interactions
5. Integration Agent should detect its own development gaps

## Risk Assessment

**Low Risk**:
- Read-only operations
- Uses existing proven agents
- No system modifications

**Medium Risk**:
- Performance with large codebases
- Memory usage with full analysis
- Timeout on slow operations

## Coaching Notes for Session 00005

1. **Start Simple**: Get basic correlation working first
2. **Use Reality Pattern**: Follow same progressive discovery as other agents
3. **Test Incrementally**: Verify each correlation type
4. **Document Discoveries**: What gaps are found in our own system?
5. **Embrace Gaps**: Take breaks to test session reality protocol

## Constitutional Alignment

This aligns with:
- **Truth Over Speed**: Reveals actual integration state
- **Reality Domain**: Discovers what IS, not what should be
- **Transparency**: Makes hidden gaps visible

## Questions for Session 00003

1. Is the correlation approach sound?
2. What integration gaps do you predict we'll find?
3. Should we add more correlation types?
4. Is 6 hours realistic for implementation?
5. What's missing from this spec?

---

*"The truth is rarely pure and never simple, but correlation reveals it."*