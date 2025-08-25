---
created: '2025-08-23'
domain: core
priority: P1
purpose: Document yaml file template
session: legacy
status: draft
title: YAML File Template
topics:
- yaml
- documentation
type: guide
---

# YAML File Template

Copy this template for all new files:

```markdown
---
session: "00XXX"
type: "specification" | "guide" | "report" | "analysis" | "log" | "script" | "config"
status: "current" | "superseded" | "draft" | "archived"
created: "2025-MM-DD"
title: "Human-readable title"
purpose: "Why this file exists"

# Optional but recommended:
topics: ["tag1", "tag2", "tag3"]
priority: "P0" | "P1" | "P2"
domain: "requirements" | "reality" | "reconciliation" | "core"

# Relationships (as applicable):
supersedes: ["00XXX-OLD-FILE.md"]
related_to: ["00XXX-RELATED-FILE.md"]  
implements: ["00XXX-DECISION.md"]
depends_on: ["path/to/dependency.sql"]

# Tracking:
validation_method: "manual" | "automated" | "reality-agent"
estimated_shelf_life: "6 months" | "indefinite" | "until Session XX"
---

# Your File Title

Your content here...
```

## Quick Start Examples:

### Specification File:
```yaml
---
session: "00059"
type: "specification"
status: "current"  
created: "2025-08-24"
title: "FileSystem Agent Level 3 Enhancement"
purpose: "Define requirements for upgrading FileSystem Agent organizational capabilities"
topics: ["filesystem", "agent", "organization", "monitoring"]
priority: "P0"
domain: "reality"
implements: ["00056-FILESYSTEM-AGENT-ENHANCEMENT-SPEC.md"]
related_to: ["00058-YAML-FILE-ORGANIZATION-SYSTEM.md"]
---
```

### Analysis Report:
```yaml
---
session: "00060"
type: "analysis"  
status: "current"
created: "2025-08-25"
title: "Organization Health Metrics After YAML Implementation"
purpose: "Measure effectiveness of new YAML organization system"
topics: ["organization", "metrics", "yaml", "health"]
priority: "P1"
domain: "reality"
depends_on: ["00058-YAML-FILE-ORGANIZATION-SYSTEM.md"]
validation_method: "automated"
estimated_shelf_life: "3 months"
---
```