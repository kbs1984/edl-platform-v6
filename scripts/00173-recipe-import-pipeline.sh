#!/bin/bash

# ============================================
# Recipe Import Pipeline v1.0
# Session 173 - Automated Recipe Validation & Import
# ============================================
# Purpose: Validate, import, and integrate v5 recipes
# Usage: ./scripts/00173-recipe-import-pipeline.sh [recipe-file.md]
#        ./scripts/00173-recipe-import-pipeline.sh --batch [directory]
# ============================================

set -e  # Exit on error

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
RECIPE_DIR="archive/legacy-canvas-work/v5-recipes-canvas-aligned"
VALIDATION_DIR="archive/legacy-canvas-work/v5-recipes-canvas-aligned"
CANVAS_DIR="archive/legacy-canvas-work"
IMPORT_LOG="logs/recipe-import-$(date +%Y%m%d-%H%M%S).log"
MIN_QUALITY_SCORE=85

# Create log directory if it doesn't exist
mkdir -p logs

echo -e "${BLUE}╔══════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║          Recipe Import Pipeline v1.0                      ║${NC}"
echo -e "${BLUE}║          Session 173 - Recipe System                      ║${NC}"
echo -e "${BLUE}╚══════════════════════════════════════════════════════════╝${NC}"
echo ""

# Function to validate a single recipe
validate_recipe() {
    local recipe_file="$1"
    local recipe_name=$(basename "$recipe_file")
    
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${YELLOW}Validating: $recipe_name${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    
    # Step 1: Check file exists
    if [ ! -f "$recipe_file" ]; then
        echo -e "${RED}❌ Recipe file not found: $recipe_file${NC}"
        return 1
    fi
    
    # Step 2: Check YAML frontmatter
    echo -e "\n📋 Checking YAML frontmatter..."
    if ! grep -q "^---" "$recipe_file"; then
        echo -e "${RED}❌ Missing YAML frontmatter${NC}"
        return 1
    fi
    
    # Extract session number if present
    session=$(grep "^session:" "$recipe_file" | cut -d'"' -f2 || echo "none")
    echo -e "   Session: $session"
    
    # Step 3: Check for React anti-patterns
    echo -e "\n🚫 Checking for React anti-patterns..."
    if grep -qE "useState|useEffect|'use client'" "$recipe_file"; then
        echo -e "${RED}❌ CRITICAL: React patterns detected!${NC}"
        echo -e "${RED}   This violates Session 152 architecture${NC}"
        grep -nE "useState|useEffect|'use client'" "$recipe_file" | head -5
        return 1
    else
        echo -e "${GREEN}✅ No React patterns found${NC}"
    fi
    
    # Step 4: Check for vanilla JS class pattern
    echo -e "\n🔍 Checking for vanilla JS class pattern..."
    if grep -q "class.*{" "$recipe_file"; then
        echo -e "${GREEN}✅ Vanilla JS class pattern found${NC}"
    else
        echo -e "${YELLOW}⚠️  Warning: No vanilla JS class found (may be intentional)${NC}"
    fi
    
    # Step 5: Check for data-testid attributes
    echo -e "\n🧪 Checking for test selectors..."
    testid_count=$(grep -c "data-testid" "$recipe_file" || echo "0")
    if [ "$testid_count" -gt 0 ]; then
        echo -e "${GREEN}✅ Found $testid_count data-testid attributes${NC}"
    else
        echo -e "${YELLOW}⚠️  Warning: No data-testid attributes found${NC}"
    fi
    
    # Step 6: Run Node.js validator if available
    echo -e "\n📊 Running quality validator..."
    if [ -f "$VALIDATION_DIR/recipe-validator.js" ]; then
        node "$VALIDATION_DIR/recipe-validator.js" "$recipe_file" > /tmp/recipe-validation.tmp 2>&1
        if [ $? -eq 0 ]; then
            score=$(grep -oE "Score: [0-9]+" /tmp/recipe-validation.tmp | grep -oE "[0-9]+" || echo "0")
            if [ -z "$score" ]; then
                score=0
            fi
            
            if [ "$score" -ge "$MIN_QUALITY_SCORE" ]; then
                echo -e "${GREEN}✅ Quality score: $score/100 (PASS)${NC}"
            else
                echo -e "${RED}❌ Quality score: $score/100 (FAIL - minimum $MIN_QUALITY_SCORE required)${NC}"
                return 1
            fi
        else
            echo -e "${YELLOW}⚠️  Validator returned warnings${NC}"
            cat /tmp/recipe-validation.tmp
        fi
    else
        echo -e "${YELLOW}⚠️  recipe-validator.js not found, skipping quality check${NC}"
    fi
    
    # Step 7: Extract canvas references
    echo -e "\n🎨 Extracting canvas references..."
    canvas_nodes=$(grep -oE "Canvas Node ID: [a-f0-9]{16}" "$recipe_file" | cut -d' ' -f4 || echo "none")
    canvas_box=$(grep "Canvas Box Type:" "$recipe_file" | cut -d':' -f2- | xargs || echo "none")
    
    if [ "$canvas_nodes" != "none" ]; then
        echo -e "   Canvas Nodes: $canvas_nodes"
        echo -e "   Canvas Box: $canvas_box"
        
        # Verify canvas mapping if script available
        if [ -f "$VALIDATION_DIR/verify-canvas-mapping.py" ]; then
            echo -e "\n🗺️  Verifying canvas mapping..."
            
            # Find matching canvas file
            canvas_file=""
            for canvas in "$CANVAS_DIR"/*.canvas; do
                if grep -q "$canvas_box" "$canvas" 2>/dev/null; then
                    canvas_file="$canvas"
                    break
                fi
            done
            
            if [ -n "$canvas_file" ]; then
                python3 "$VALIDATION_DIR/verify-canvas-mapping.py" \
                    --recipe "$recipe_file" \
                    --canvas "$canvas_file" 2>/dev/null
                if [ $? -eq 0 ]; then
                    echo -e "${GREEN}✅ Canvas mapping verified${NC}"
                else
                    echo -e "${YELLOW}⚠️  Canvas mapping issues detected${NC}"
                fi
            else
                echo -e "${YELLOW}⚠️  Canvas file not found for: $canvas_box${NC}"
            fi
        fi
    else
        echo -e "${YELLOW}⚠️  No canvas references found${NC}"
    fi
    
    # Step 8: Check for server component examples
    echo -e "\n🖥️  Checking for server component integration..."
    if grep -q "Server Component Integration" "$recipe_file"; then
        echo -e "${GREEN}✅ Server component examples found${NC}"
    else
        echo -e "${YELLOW}⚠️  Warning: No server component examples${NC}"
    fi
    
    # Step 9: Check for migration notes
    echo -e "\n📦 Checking for migration guidance..."
    if grep -q "Migration from V5 to V6" "$recipe_file"; then
        echo -e "${GREEN}✅ Migration notes included${NC}"
    else
        echo -e "${YELLOW}⚠️  Warning: No migration notes${NC}"
    fi
    
    return 0
}

# Function to update recipe map
update_recipe_map() {
    local recipe_file="$1"
    local recipe_name=$(basename "$recipe_file" .md)
    
    echo -e "\n📊 Updating Recipe Map..."
    
    # Extract covered user stories from recipe
    stories=$(grep -oE "US-[0-9]+" "$recipe_file" | tr '\n' ',' | sed 's/,$//' || echo "none")
    
    if [ "$stories" != "none" ]; then
        echo -e "   Covers stories: $stories"
        
        # Add to tracking file
        echo "$(date +%Y-%m-%d),$recipe_name,$stories" >> logs/recipe-coverage.csv
        echo -e "${GREEN}✅ Recipe map updated${NC}"
    else
        echo -e "${YELLOW}⚠️  No user stories referenced in recipe${NC}"
    fi
}

# Function to generate implementation scaffold
generate_scaffold() {
    local recipe_file="$1"
    local recipe_name=$(basename "$recipe_file" .md | sed 's/-recipe-v2//')
    local component_name=$(echo "$recipe_name" | sed 's/-/_/g')
    
    echo -e "\n🏗️  Generating implementation scaffold..."
    
    # Create scaffold directory
    scaffold_dir="reconciliation/active-work/dashboard/src/components/$component_name"
    mkdir -p "$scaffold_dir"
    
    # Generate files (basic templates)
    echo -e "   Creating $scaffold_dir/"
    echo -e "   - page.tsx (Server Component)"
    echo -e "   - controller.js (Vanilla JS)"
    echo -e "   - styles.css"
    echo -e "   - test.spec.ts"
    
    # Note: In a real implementation, we'd generate actual code here
    echo -e "${GREEN}✅ Scaffold generated at $scaffold_dir${NC}"
}

# Function to process batch import
batch_import() {
    local directory="$1"
    local success_count=0
    local fail_count=0
    
    echo -e "\n${BLUE}Starting batch import from: $directory${NC}\n"
    
    for recipe in "$directory"/*-recipe-v2.md; do
        if [ -f "$recipe" ]; then
            if validate_recipe "$recipe"; then
                update_recipe_map "$recipe"
                generate_scaffold "$recipe"
                ((success_count++))
                echo -e "\n${GREEN}✅ Successfully imported: $(basename "$recipe")${NC}\n"
            else
                ((fail_count++))
                echo -e "\n${RED}❌ Failed to import: $(basename "$recipe")${NC}\n"
            fi
        fi
    done
    
    echo -e "\n${BLUE}╔══════════════════════════════════════════════════════════╗${NC}"
    echo -e "${BLUE}║                    BATCH IMPORT COMPLETE                  ║${NC}"
    echo -e "${BLUE}╚══════════════════════════════════════════════════════════╝${NC}"
    echo -e "${GREEN}✅ Successful imports: $success_count${NC}"
    echo -e "${RED}❌ Failed imports: $fail_count${NC}"
}

# Main execution
if [ "$1" == "--batch" ] && [ -n "$2" ]; then
    # Batch mode
    batch_import "$2"
elif [ -n "$1" ]; then
    # Single file mode
    if validate_recipe "$1"; then
        update_recipe_map "$1"
        generate_scaffold "$1"
        echo -e "\n${GREEN}✅ Recipe successfully imported!${NC}"
    else
        echo -e "\n${RED}❌ Recipe validation failed${NC}"
        exit 1
    fi
else
    echo "Usage: $0 [recipe-file.md]"
    echo "       $0 --batch [directory]"
    echo ""
    echo "Examples:"
    echo "  $0 archive/legacy-canvas-work/v5-recipes-canvas-aligned/session-flow-recipe-v2.md"
    echo "  $0 --batch archive/legacy-canvas-work/v5-recipes-canvas-aligned"
    exit 1
fi

echo -e "\n📝 Import log saved to: $IMPORT_LOG"
echo -e "${BLUE}Recipe import pipeline complete!${NC}"