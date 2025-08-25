---
session: "00058"
type: "specification"
status: "current"
created: "2025-08-23"
title: "YAML File Organization & Indexing System"
purpose: "Establish systematic file creation, storage, and cross-referencing using YAML metadata"
topics: ["organization", "yaml", "indexing", "metadata", "discovery", "filesystem"]
priority: "P0"
domain: "core"
implements: ["00056-COMPREHENSIVE-ORGANIZATION-STRATEGY.md"]
related_to: ["00056-FILESYSTEM-AGENT-ENHANCEMENT-SPEC.md", "00058-DIRECTORY-CONSOLIDATION-LOG.md"]
validation_method: "manual"
success_criteria: ["YAML standards adopted", "Automated indexing working", "FileSystem Agent integration", "Discovery queries <2 seconds"]
estimated_shelf_life: "indefinite"
breakthrough: "First systematic approach to file organization and discovery in EDL Platform"
---

# 00058 YAML File Organization & Indexing System

**Session**: 00058  
**Date**: 2025-08-23  
**Purpose**: Establish systematic file creation, storage, and cross-referencing with YAML

---

## 🎯 System Overview

**Vision**: Transform our clean 14-directory foundation into an intelligent, self-organizing knowledge base using YAML metadata + automated indexing.

### **Core Components:**
1. **YAML Frontmatter Standard** - Structured metadata in every file
2. **Centralized Index System** - Automated aggregation of all metadata  
3. **Cross-Reference Engine** - Automatic relationship detection
4. **Discovery Interface** - Multiple ways to find related content
5. **FileSystem Agent Integration** - Automated maintenance and validation

---

## 📝 YAML Frontmatter Standard

### **Required Fields (Every File):**
```yaml
---
session: "00058"
type: "specification" | "guide" | "report" | "analysis" | "log" | "script" | "config"
status: "current" | "superseded" | "draft" | "archived"
created: "2025-08-23"
title: "Human-readable title"
purpose: "Why this file exists"
---
```

### **Optional Fields (As Applicable):**
```yaml
---
# Relationships
supersedes: ["00044-TEST-AUTH-FLOW-GUIDE.md"]
related_to: ["00056-FILESYSTEM-AGENT-ENHANCEMENT-SPEC.md"]
implements: ["00042-TRUTH-SEED-ADOPTION-DECISION.md"]
depends_on: ["migrations/batches/done-batch-05-functions-complete.sql"]

# Classification
topics: ["database", "migration", "auth", "organization"]
priority: "P0" | "P1" | "P2"
domain: "requirements" | "reality" | "reconciliation" | "core"
phase: "prototype" | "production" | "maintenance"

# Tracking
validation_method: "manual" | "automated" | "reality-agent"
last_verified: "2025-08-23"
estimated_shelf_life: "6 months" | "indefinite" | "until Session 65"

# Context
problem_solved: "FileSystem chaos was preventing effective development"
success_criteria: ["Directory count < 15", "File organization health > 85%"]
lessons_learned: ["B-first approach superior to A-first"]

# Technical
file_format: "markdown" | "sql" | "python" | "yaml" | "json"
encoding: "utf-8"
word_count: 2847
---
```

---

## 🗂️ File Creation & Storage Standards

### **Directory Mapping by Type:**

#### **Root Directory (Session Deliverables Only):**
```yaml
# Criteria for root placement:
- type: ["specification", "guide", "major-report", "decision-log"]  
- status: "current"
- session-prefixed: true
- scope: "project-wide" | "cross-domain"
```

#### **Subdirectory Mapping:**
```yaml
docs/:
  types: ["reference", "protocol", "minor-guide"]
  examples: ["docs/protocols/SESSION-PROTOCOL.md"]

archive/:
  types: ["log", "report", "superseded-spec"]  
  status: ["archived", "superseded"]
  
scripts/:
  types: ["automation", "utility", "validation"]
  file_formats: ["python", "bash", "javascript"]

migrations/:
  types: ["schema", "data-migration", "deployment"]
  file_formats: ["sql", "json"]
```

### **Naming Convention Enhancement:**
```yaml
# Current: 00058-FILENAME.md
# Enhanced: 00058-TYPE-TOPIC-FILENAME.md

examples:
  - "00058-SPEC-filesystem-yaml-organization-system.md"
  - "00059-GUIDE-agent-level3-enhancement.md"  
  - "00060-REPORT-organization-health-metrics.md"
  - "00061-LOG-session-comprehensive.md"
```

---

## 🔍 Centralized Index System

### **Master Index File Structure:**
```yaml
# index/master-catalog.yaml
metadata_version: "1.0"
last_updated: "2025-08-23T11:45:00Z"
total_files: 247
total_sessions: 58

files:
  "00058-YAML-FILE-ORGANIZATION-SYSTEM.md":
    session: "00058"
    type: "specification"
    status: "current"
    created: "2025-08-23"
    topics: ["organization", "yaml", "indexing", "filesystem"]
    relationships:
      supersedes: []
      implements: ["00056-FILESYSTEM-AGENT-ENHANCEMENT-SPEC.md"]
      related_to: ["00056-COMPREHENSIVE-ORGANIZATION-STRATEGY.md"]
    metrics:
      word_count: 2847
      last_verified: "2025-08-23"
```

### **Topic-Based Indexes:**
```yaml
# index/topics/database.yaml
topic: "database"
files:
  - file: "00044-CRITICAL-MIGRATION-GAP-REPORT.md"
    session: "00044"
    relevance: "primary"
    status: "current"
  - file: "migrations/batches/done-batch-05-functions-complete.sql"  
    session: "00050"
    relevance: "implementation"
    status: "deployed"

# index/topics/organization.yaml  
topic: "organization"
evolution:
  - session: "00056"
    breakthrough: "Identified 28-directory chaos"
  - session: "00058"  
    achievement: "Reduced to 14 directories + YAML system"
```

### **Session-Based Indexes:**
```yaml
# index/sessions/00058.yaml
session: "00058"
focus: "Directory consolidation and YAML organization system"
deliverables:
  - "00058-DIRECTORY-CONSOLIDATION-LOG.md"
  - "00058-YAML-FILE-ORGANIZATION-SYSTEM.md"
impact:
  directories: "28 → 14 (50% reduction)"
  root_files: "93 → 53 (43% reduction)" 
  org_health: "52% → 78% (+26%)"
```

---

## 🔗 Cross-Reference & Discovery System

### **Automated Relationship Detection:**
```python
# scripts/yaml-indexer.py
def detect_relationships(file_metadata, all_files):
    relationships = {
        "supersedes": find_superseded_files(file_metadata),
        "implements": find_implementation_targets(file_metadata),
        "related_to": find_topic_overlap(file_metadata, all_files),
        "depends_on": find_file_dependencies(file_content)
    }
    return relationships

def find_topic_overlap(file_topics, all_files):
    related = []
    for other_file, other_metadata in all_files.items():
        overlap = set(file_topics) & set(other_metadata.get('topics', []))
        if len(overlap) >= 2:  # 2+ shared topics = related
            related.append(other_file)
    return related
```

### **Discovery Queries:**
```bash
# Find all current database documentation
python3 scripts/yaml-query.py --topic "database" --status "current"

# Find files that supersede others (potential cleanup candidates)  
python3 scripts/yaml-query.py --has-field "supersedes"

# Find Session 44-55 files that need review
python3 scripts/yaml-query.py --session-range "44-55" --status "draft"

# Find orphaned files (no relationships)
python3 scripts/yaml-query.py --orphaned

# Topic evolution timeline
python3 scripts/yaml-timeline.py --topic "database"
```

---

## 🤖 FileSystem Agent Integration

### **Level 3 Enhancement with YAML Awareness:**
```python
# Enhanced FileSystem Agent capabilities
class YAMLOrganizationalMonitor:
    def validate_file_metadata(self, file_path):
        metadata = extract_yaml_frontmatter(file_path)
        violations = []
        
        # Required field validation
        required = ["session", "type", "status", "created", "title", "purpose"]
        for field in required:
            if field not in metadata:
                violations.append(f"Missing required field: {field}")
        
        # Consistency validation  
        if not file_path.startswith(f"{metadata['session']}-"):
            violations.append("Filename doesn't match session in metadata")
            
        return violations
    
    def detect_metadata_drift(self):
        # Find files with outdated "last_verified" dates
        # Find "current" files older than 6 months
        # Find files missing relationships that should exist
        pass
    
    def suggest_organization_improvements(self):
        # Files in wrong directories based on metadata
        # Missing cross-references
        # Status inconsistencies
        pass
```

### **Session Startup Integration:**
```bash
# Enhanced 00028-session-start.sh
echo "1/5 Running FileSystem Agent (Level 3 + YAML)..."
python3 reality/agent-filesystem/connector.py \
    --level 3 \
    --yaml-validation \
    --index-refresh \
    --relationship-check

# Expected output:
# 📊 Organization Health: 87% ✅
# 📁 Directories: 14/15 ✅  
# 📄 Root Files: 53/30 ⚠️
# 🏷️ YAML Compliance: 92% ✅ (4 files missing frontmatter)
# 🔗 Cross-References: 156 detected, 12 broken
```

---

## 📊 Implementation Roadmap

### **Phase 1 (Session 59): YAML Foundation**
1. **Create YAML standards document** (this file)
2. **Add YAML frontmatter to 10 most important files**  
3. **Build basic yaml-indexer.py script**
4. **Create master catalog structure**

### **Phase 2 (Session 60): Automation**
1. **Enhance FileSystem Agent with YAML awareness**
2. **Build yaml-query.py for discovery**
3. **Integrate with session startup process**
4. **Create topic-based indexes**

### **Phase 3 (Session 61): Intelligence**  
1. **Automated relationship detection**
2. **Timeline and evolution tracking**
3. **Orphan file detection and cleanup suggestions**
4. **Health metrics and drift prevention**

### **Phase 4 (Session 62+): Optimization**
1. **Advanced query patterns**
2. **Visual relationship mapping**  
3. **Automated archival workflows**
4. **Predictive organization suggestions**

---

## 🎯 Success Metrics

### **Immediate (Session 60):**
- ✅ 50+ files have YAML frontmatter
- ✅ Master catalog operational
- ✅ Topic-based discovery working
- ✅ FileSystem Agent YAML-aware

### **Short-term (Sessions 61-62):**
- ✅ Cross-reference accuracy >95%
- ✅ Orphaned files <5% of total
- ✅ Discovery queries <2 seconds  
- ✅ Relationship detection automated

### **Long-term (Sessions 63+):**
- ✅ Zero manual file hunting needed
- ✅ Automatic organization suggestions 90% accepted
- ✅ Knowledge base self-maintains
- ✅ New session file creation fully templated

---

## 💡 Advanced Features (Future)

### **Intelligent Archival:**
```yaml
# Automatic status transitions based on metadata
rules:
  - if: "supersedes field exists AND 30 days old"
    then: "suggest status: archived for superseded files"
  - if: "estimated_shelf_life expired"  
    then: "flag for review"
```

### **Session Impact Analysis:**
```yaml
# Track how sessions build on each other
session_dependencies:
  "00059": 
    builds_on: ["00058", "00056"]
    impact_score: 0.87
    knowledge_reuse: ["organization", "filesystem"]
```

### **Topic Evolution Tracking:**
```yaml
# Show how understanding develops over time  
topic_evolution:
  "database":
    sessions: ["00044", "00046", "00050", "00053", "00055"]
    breakthrough_moments:
      "00050": "Desktop extraction method discovered"
      "00055": "Business logic audit methodology established"
```

---

*This YAML organization system transforms our clean 14-directory foundation into an intelligent, self-organizing knowledge base that grows smarter with each session.*