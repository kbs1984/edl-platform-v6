#!/bin/bash
# Recipe Enforcement Script - Integrates recipe validation into workflow
# Session: 172
# Created: 2025-09-05
# Purpose: Enforce recipe citations in Phase 2.5 Architectural Validation

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}╔══════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║       Recipe-Based Development Enforcement v1.0           ║${NC}"
echo -e "${BLUE}║         Phase 2.5 Architectural Validation                ║${NC}"
echo -e "${BLUE}╚══════════════════════════════════════════════════════════╝${NC}"
echo ""

# Get feature name from argument or prompt
FEATURE="${1:-}"
if [ -z "$FEATURE" ]; then
    echo -e "${YELLOW}Enter the feature you're implementing:${NC}"
    read -r FEATURE
fi

SESSION="${2:-$(ls archive/sessions/SESSION-*-LOG.md 2>/dev/null | tail -1 | grep -oE '[0-9]{3}' | tail -1)}"

echo -e "\n${BLUE}🎯 Feature:${NC} $FEATURE"
echo -e "${BLUE}📝 Session:${NC} $SESSION"
echo ""

# Step 1: Check for existing implementations
echo -e "${YELLOW}═══════════════════════════════════════════════════════════${NC}"
echo -e "${YELLOW}Step 1/5: Checking for existing implementations${NC}"
echo -e "${YELLOW}═══════════════════════════════════════════════════════════${NC}"

# Use YAML query to find existing work
echo "Running YAML query for existing work..."
python3 scripts/00059-yaml-query.py --topic "$FEATURE" --limit 5 2>/dev/null || true

# Check for existing components
echo -e "\nChecking for existing components..."
find reconciliation/active-work -type f -name "*.tsx" -o -name "*.ts" | xargs grep -l "$FEATURE" 2>/dev/null | head -5 || echo "No existing components found"

# Step 2: Suggest recipes
echo -e "\n${YELLOW}═══════════════════════════════════════════════════════════${NC}"
echo -e "${YELLOW}Step 2/5: Recipe Selection${NC}"
echo -e "${YELLOW}═══════════════════════════════════════════════════════════${NC}"

echo -e "\n${GREEN}📚 Suggested recipes for '$FEATURE':${NC}"
python3 scripts/00172-recipe-query.py --feature "$FEATURE" 2>/dev/null || {
    echo -e "${RED}Recipe query tool not available, showing manual selection:${NC}"
    echo ""
    echo "Canvas Recipes (UI Specifications):"
    echo "  CANVAS-001-1: Onboarding & Directory"
    echo "  CANVAS-001-2: Communication, Messages and Invitations"
    echo "  CANVAS-001-4: Activity & Registrar Box"
    echo "  CANVAS-002-1: PlayerID Profile Box"
    echo "  CANVAS-002-3: Badges Box"
    echo "  CANVAS-003-2: EmCoin Transactions Box"
    echo ""
    echo "V5 Pattern Recipes (Proven Mechanics):"
    echo "  V5-RECIPE-001: Addiction Mechanics Bar"
    echo "  V5-RECIPE-002: Streak System"
    echo "  V5-RECIPE-003: EmCoin Economy"
    echo "  V5-RECIPE-004: Achievement System"
    echo ""
    echo "Brian Architecture Recipes (Backend):"
    echo "  BRIAN-RECIPE-001: User System"
    echo "  BRIAN-RECIPE-002: Team System"
    echo "  BRIAN-RECIPE-003: Activity System"
}

# Step 3: Recipe validation questions
echo -e "\n${YELLOW}═══════════════════════════════════════════════════════════${NC}"
echo -e "${YELLOW}Step 3/5: Recipe Validation Questions${NC}"
echo -e "${YELLOW}═══════════════════════════════════════════════════════════${NC}"

echo -e "\n${RED}❓ MANDATORY RECIPE QUESTIONS:${NC}"
echo "□ 1. Which Canvas wireframe does this implement? (CANVAS-XXX-X)"
echo "□ 2. Which V5 pattern are you using? (V5-RECIPE-XXX)"
echo "□ 3. Which Brian backend tables? (BRIAN-RECIPE-XXX)"
echo "□ 4. Have you reviewed the actual recipe sources?"
echo "□ 5. Will you cite recipes in your code comments?"

# Step 4: Architecture validation (Session 152 authority)
echo -e "\n${YELLOW}═══════════════════════════════════════════════════════════${NC}"
echo -e "${YELLOW}Step 4/5: Architecture Validation (Session 152 Authority)${NC}"
echo -e "${YELLOW}═══════════════════════════════════════════════════════════${NC}"

echo -e "\n${GREEN}📋 ARCHITECTURE DECISION MATRIX:${NC}"
echo "┌─────────────────┬────────────────────┬──────────────────┐"
echo "│ Feature Type    │ Technology         │ Pattern          │"
echo "├─────────────────┼────────────────────┼──────────────────┤"
echo "│ Auth features   │ Server Components  │ Server Actions   │"
echo "│ Dashboard       │ Server Components  │ V5 vanilla JS    │"
echo "│ Forms          │ Standard HTML      │ data-testid      │"
echo "│ State mgmt     │ Server Actions     │ NOT React state  │"
echo "│ Interactive UI │ Vanilla JS         │ Class controllers│"
echo "└─────────────────┴────────────────────┴──────────────────┘"

echo -e "\n${RED}🚫 BLOCKING VALIDATION:${NC}"
echo "Cannot proceed without confirming:"
echo "  • Technology stack from matrix above"
echo "  • Recipe citations documented"
echo "  • Session 152 compliance verified"

# Step 5: Generate recipe template
echo -e "\n${YELLOW}═══════════════════════════════════════════════════════════${NC}"
echo -e "${YELLOW}Step 5/5: Recipe Template Generation${NC}"
echo -e "${YELLOW}═══════════════════════════════════════════════════════════${NC}"

TEMPLATE_FILE="/tmp/recipe-template-${SESSION}-${FEATURE}.md"
cat > "$TEMPLATE_FILE" << 'EOF'
---
session: "SESSION_NUMBER"
type: "implementation"
status: "in-progress"
created: "2025-09-05"
title: "FEATURE_NAME Implementation"
purpose: "Implement FEATURE_NAME using recipe-based approach"
recipes:
  canvas: "CANVAS-XXX-X"    # TODO: Specify Canvas wireframe
  v5: "V5-RECIPE-XXX"       # TODO: Specify V5 pattern
  brian: "BRIAN-RECIPE-XXX" # TODO: Specify Brian tables
architecture:
  component_type: "Server Component"  # or "Client Component" with justification
  state_management: "Server Actions"  # or "Vanilla JS" for dashboard
  integration_pattern: "V5 Bridge"    # or "Direct React" if justified
  session_152_compliant: true
---

# FEATURE_NAME Implementation

## Recipe Citations

### Canvas Wireframe
- **Recipe**: CANVAS-XXX-X
- **Source**: archive/legacy-canvas-work/XXX.canvas
- **Elements**: [List UI elements from Canvas]

### V5 Pattern
- **Recipe**: V5-RECIPE-XXX  
- **Source**: reconciliation/00138-V5-INTEGRATION-SPECIFICATIONS.md
- **Pattern**: [Describe pattern being used]

### Brian Architecture
- **Recipe**: BRIAN-RECIPE-XXX
- **Tables**: [List tables being used]
- **Relationships**: [Describe data relationships]

## Implementation Code

```typescript
// Recipe: CANVAS-XXX-X (Canvas wireframe reference)
// Pattern: V5-RECIPE-XXX (V5 pattern reference)
// Backend: BRIAN-RECIPE-XXX (Brian architecture reference)
// Architecture: Server Component (Session 152)

export default async function COMPONENT_NAME() {
  // Server Component implementation
  
  return (
    <div data-feature="FEATURE_NAME">
      {/* Server-rendered HTML following Canvas layout */}
    </div>
  );
}

// V5 vanilla JS bridge (if dashboard feature)
class FEATURE_NAMEController {
  constructor(element) {
    this.element = element;
    this.initialize();
  }
  
  initialize() {
    // Vanilla JS enhancement per V5 pattern
  }
}
```

## Validation Checklist

- [ ] Canvas wireframe layout matched
- [ ] V5 pattern correctly implemented
- [ ] Brian tables properly integrated
- [ ] Session 152 architecture followed
- [ ] Recipe citations in code comments
- [ ] No unauthorized React patterns
- [ ] Tests reference recipes

EOF

# Replace placeholders
sed -i "s/SESSION_NUMBER/$SESSION/g" "$TEMPLATE_FILE"
sed -i "s/FEATURE_NAME/$FEATURE/g" "$TEMPLATE_FILE"

echo -e "\n${GREEN}✅ Recipe template generated:${NC} $TEMPLATE_FILE"

# Create enforcement gate file
GATE_FILE="/tmp/recipe-gate-${SESSION}.json"
cat > "$GATE_FILE" << EOF
{
  "session": "$SESSION",
  "feature": "$FEATURE",
  "timestamp": "$(date -Iseconds)",
  "validation": {
    "recipes_selected": false,
    "architecture_confirmed": false,
    "session_152_compliant": false,
    "existing_work_checked": true
  },
  "blocking": true,
  "can_proceed": false
}
EOF

echo -e "${GREEN}✅ Enforcement gate created:${NC} $GATE_FILE"

# Final validation
echo -e "\n${RED}╔══════════════════════════════════════════════════════════╗${NC}"
echo -e "${RED}║                  MANDATORY CHECKPOINT                     ║${NC}"
echo -e "${RED}╚══════════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${RED}You CANNOT proceed to Phase 3 (Plan Feature) without:${NC}"
echo ""
echo "1. ✓ Selecting recipes from each category (Canvas, V5, Brian)"
echo "2. ✓ Confirming architecture approach (Server vs Client)"
echo "3. ✓ Verifying Session 152 compliance"
echo "4. ✓ Documenting recipe citations in template"
echo "5. ✓ Running build test: npm run build"
echo ""
echo -e "${YELLOW}Next Steps:${NC}"
echo "1. Review suggested recipes above"
echo "2. Open recipe sources to verify patterns"
echo "3. Edit template: $TEMPLATE_FILE"
echo "4. Copy recipe citations to your implementation"
echo "5. Use recipe query to validate: python3 scripts/00172-recipe-query.py --validate"
echo ""
echo -e "${BLUE}Recipe Enforcement Complete - Phase 2.5 Gate Active${NC}"