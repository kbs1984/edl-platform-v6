---
session: "172"
type: "protocol"
status: "authoritative"
created: "2025-09-05"
title: "Recipe-Based Workflow Protocol - File System Integration"
purpose: "Sear recipe-based development into our workflow using YAML metadata and file system protocol"
topics: ["recipes", "workflow", "file-system", "yaml", "enforcement"]
priority: "P0"
domain: "core"
canonical: true
enforced_by: ["00172-recipe-query.py", "00172-recipe-enforcement.sh", "session-start-scripts"]
implements: ["00171-ARCHITECTURAL-WORKFLOW-REVISION.md", "00069-UNIFIED-FILE-SYSTEM-PROTOCOL.md"]
---

# Recipe-Based Workflow Protocol
## Searing Recipes into Our File System

**Version**: 1.0  
**Status**: MANDATORY - Enforced in Phase 2.5  
**Authority**: Session 152 Architecture + Evidence Imperative Protocol

---

## Executive Summary

This protocol **sears recipe-based development into our workflow** by:
1. Extending YAML frontmatter to require recipe citations
2. Creating queryable recipe metadata
3. Enforcing recipe validation gates
4. Making recipes searchable via our file system

**Core Principle**: No implementation without recipe citation. Recipes are evidence.

---

## 🔥 The Recipe Metadata Schema

### Required YAML Frontmatter for Implementations

```yaml
---
# STANDARD FIELDS (existing)
session: "172"
type: "implementation"
status: "in-progress"
created: "2025-09-05"

# RECIPE FIELDS (NEW - MANDATORY)
recipes:
  canvas: "CANVAS-001-4"        # UI wireframe reference
  v5: "V5-RECIPE-002"          # Pattern reference
  brian: "BRIAN-RECIPE-003"     # Backend architecture
  
# ARCHITECTURE FIELDS (MANDATORY per Session 152)
architecture:
  component_type: "Server Component"
  state_management: "Server Actions"
  integration_pattern: "V5 Bridge"
  session_152_compliant: true
---
```

### Recipe Field Specifications

| Field | Required | Format | Example |
|-------|----------|--------|---------|
| `recipes.canvas` | Yes* | CANVAS-XXX-X | CANVAS-001-4 |
| `recipes.v5` | Yes* | V5-RECIPE-XXX | V5-RECIPE-002 |
| `recipes.brian` | Yes* | BRIAN-RECIPE-XXX | BRIAN-RECIPE-003 |
| `architecture.component_type` | Yes | String | "Server Component" |
| `architecture.state_management` | Yes | String | "Server Actions" |
| `architecture.integration_pattern` | Yes | String | "V5 Bridge" |
| `architecture.session_152_compliant` | Yes | Boolean | true |

*At least one recipe type required, all three preferred

---

## 🔍 Recipe Query Integration

### Query Commands

```bash
# Find all files using a specific recipe
python3 scripts/00172-recipe-query.py --usage "CANVAS-001-4"

# Find files missing recipes
python3 scripts/00172-recipe-query.py --missing

# Validate all recipe citations
python3 scripts/00172-recipe-query.py --validate

# Suggest recipes for a feature
python3 scripts/00172-recipe-query.py --feature "achievement"

# List all available recipes
python3 scripts/00172-recipe-query.py --list

# Combine with YAML query for powerful searches
python3 scripts/00059-yaml-query.py --recipe "V5-RECIPE-002" --status "completed"
```

### Recipe Discovery via File System

```bash
# Find all files implementing addiction mechanics
grep -r "V5-RECIPE-001" reconciliation/ --include="*.tsx"

# Find all Canvas-001-4 implementations
find . -name "*.md" -exec grep -l "canvas: \"CANVAS-001-4\"" {} \;

# Find Server Component implementations
python3 scripts/00059-yaml-query.py --architecture "Server Component"
```

---

## 🚦 Workflow Integration Points

### Phase 0: Pre-flight
```bash
# Load recipe catalog
python3 scripts/00172-recipe-query.py --list > /tmp/recipe-catalog.txt
```

### Phase 2: Status Review
```bash
# Check existing recipe implementations
python3 scripts/00172-recipe-query.py --feature "$FEATURE"
python3 scripts/00059-yaml-query.py --topic "$FEATURE" --recipe "*"
```

### Phase 2.5: Architectural Validation (NEW)
```bash
# MANDATORY - Run recipe enforcement
./scripts/00172-recipe-enforcement.sh "$FEATURE" "$SESSION"

# Cannot proceed without:
# 1. Recipe selection documented
# 2. Architecture confirmed
# 3. Template filled out
```

### Phase 3: Plan Feature
```javascript
// In Sequential Thinking
thought: "Selected recipes: CANVAS-001-4 for UI, V5-RECIPE-002 for mechanics"
```

### Phase 4: Research
```javascript
// Research must reference recipes
mcp__brave-search__brave_web_search({
  query: "Next.js Server Components " + SELECTED_RECIPE_PATTERN
})
```

### Phase 5: Build
```typescript
// MANDATORY: Recipe citations in code
// Recipe: CANVAS-001-4 (Activity & Registrar Box)
// Pattern: V5-RECIPE-002 (Streak System)
// Backend: BRIAN-RECIPE-003 (Activity System)
export default async function ActivityRegistrar() {
  // Implementation
}
```

### Phase 6: Validate
```bash
# Validate recipe compliance
python3 scripts/00172-recipe-query.py --validate
npm run build  # Must pass
```

### Phase 7: Auto-PR
```bash
# PR description must include recipes
python3 scripts/00136-auto-pr.py "Feature: $FEATURE (Recipes: $CANVAS_ID, $V5_ID, $BRIAN_ID)"
```

---

## 🔒 Enforcement Mechanisms

### 1. Git Pre-commit Hook

```bash
#!/bin/bash
# .git/hooks/pre-commit

# Check for recipe citations in new TypeScript files
for file in $(git diff --cached --name-only --diff-filter=A | grep -E '\.(tsx?|md)$'); do
  if [ -f "$file" ]; then
    # Check for recipe citations
    if ! grep -q "CANVAS-\|V5-RECIPE-\|BRIAN-RECIPE-" "$file"; then
      echo "ERROR: $file missing recipe citations"
      echo "Add recipe comments: // Recipe: CANVAS-XXX-X"
      exit 1
    fi
  fi
done
```

### 2. Session Start Integration

```bash
# Added to 00140-mcp-integrated-session-start.sh
echo "📚 Loading Recipe Catalog..."
python3 scripts/00172-recipe-query.py --list --brief

echo "🔍 Checking recipe compliance..."
python3 scripts/00172-recipe-query.py --missing --count
```

### 3. MCP Session Tracking

```javascript
// Enhanced MCP tracking
mcp__edl-v6-session__add_task({
  title: "Implement feature with recipes",
  recipes: {
    canvas: "CANVAS-001-4",
    v5: "V5-RECIPE-002",
    brian: "BRIAN-RECIPE-003"
  },
  priority: "high"
})

mcp__edl-v6-session__track_deliverable({
  path: "component.tsx",
  type: "component",
  recipes_used: ["CANVAS-001-4", "V5-RECIPE-002"]
})
```

---

## 📊 Recipe Compliance Metrics

### Tracking Recipe Adoption

```bash
# Generate compliance report
cat > scripts/recipe-compliance.sh << 'SCRIPT'
#!/bin/bash
echo "Recipe Compliance Report"
echo "========================"

# Files with recipes
WITH_RECIPES=$(python3 scripts/00172-recipe-query.py --scan --json | jq '.with_recipes')

# Files missing recipes  
MISSING=$(python3 scripts/00172-recipe-query.py --missing --count)

# Calculate percentage
TOTAL=$((WITH_RECIPES + MISSING))
if [ $TOTAL -gt 0 ]; then
  COMPLIANCE=$((WITH_RECIPES * 100 / TOTAL))
  echo "Compliance: ${COMPLIANCE}%"
  echo "Files with recipes: $WITH_RECIPES"
  echo "Files missing recipes: $MISSING"
fi

# Most used recipes
echo -e "\nTop Recipes:"
python3 scripts/00172-recipe-query.py --top 5
SCRIPT
```

### Success Metrics

- **Target**: 100% recipe coverage for new implementations
- **Current**: Track via `recipe-compliance.sh`
- **Enforcement**: Phase 2.5 gate prevents non-compliant code

---

## 🎯 Implementation Checklist

### For Developers

- [ ] Before coding, run: `./scripts/00172-recipe-enforcement.sh`
- [ ] Select recipes from each category (Canvas, V5, Brian)
- [ ] Add recipe fields to YAML frontmatter
- [ ] Include recipe comments in code
- [ ] Validate with: `python3 scripts/00172-recipe-query.py --validate`

### For Sessions

- [ ] Start with recipe catalog review
- [ ] Document selected recipes in session log
- [ ] Track recipe usage in MCP
- [ ] Validate compliance before PR
- [ ] Include recipes in handoff

### For System

- [ ] Pre-commit hooks installed
- [ ] Recipe query tool available
- [ ] Enforcement scripts in workflow
- [ ] YAML schema updated
- [ ] Documentation complete

---

## 🔄 Recipe Catalog Management

### Adding New Recipes

1. **Discover Pattern**: Find proven implementation
2. **Document Source**: File path and line numbers
3. **Assign ID**: Follow naming convention
4. **Update Catalog**: Add to `00172-recipe-query.py`
5. **Create Example**: Show implementation
6. **Get Approval**: Via Reality Agent validation

### Recipe Naming Convention

```
Canvas:  CANVAS-[section]-[number]   (e.g., CANVAS-001-4)
V5:      V5-RECIPE-[number]          (e.g., V5-RECIPE-002)
Brian:   BRIAN-RECIPE-[number]       (e.g., BRIAN-RECIPE-003)
Custom:  CUSTOM-RECIPE-[session]-[number] (e.g., CUSTOM-RECIPE-172-001)
```

---

## 📚 Quick Reference

### Essential Commands

```bash
# Before ANY implementation
./scripts/00172-recipe-enforcement.sh "feature-name"

# Query recipes
python3 scripts/00172-recipe-query.py --feature "achievement"

# Validate implementation
python3 scripts/00172-recipe-query.py --validate

# Check compliance
python3 scripts/00172-recipe-query.py --missing
```

### Recipe Sources

- **Canvas**: `archive/legacy-canvas-work/*.canvas`
- **V5**: `reconciliation/00138-V5-INTEGRATION-SPECIFICATIONS.md`
- **Brian**: `requirements/brian-backend-proposal/`
- **Platform Spec**: `requirements/PLATFORM-SPECIFICATION-V1.md`

### Enforcement Points

1. Phase 2.5: Recipe selection (BLOCKING)
2. Phase 5: Code comments (REQUIRED)
3. Phase 6: Validation (MANDATORY)
4. Phase 7: PR description (ENFORCED)

---

## Conclusion

By integrating recipes into our YAML metadata and file system protocol, we've created a **queryable, enforceable system** that prevents the architectural mismatches that plagued Sessions 167-170.

Recipes are now:
- **Searchable** via YAML queries
- **Enforceable** via workflow gates
- **Traceable** via git history
- **Validatable** via automated tools

This protocol ensures that **evidence-based development** isn't just a principle but a **system-enforced requirement**.

---

*"Recipes are evidence. Evidence is emperor. The file system is our enforcer."*

---

**Protocol Status**: ACTIVE  
**Enforcement Level**: MANDATORY  
**Integration Complete**: Session 172