#!/usr/bin/env node

/**
 * Recipe Validation Framework
 * Validates UI recipes against architectural guidelines and quality standards
 * Prevents another Session 167-170 crisis through automated compliance checking
 */

const fs = require('fs');
const path = require('path');

class RecipeValidator {
    constructor() {
        this.errors = [];
        this.warnings = [];
        this.score = 0;
        this.maxScore = 100;
    }

    /**
     * Main validation entry point
     */
    async validateRecipe(recipePath) {
        console.log(`\n🔍 Validating Recipe: ${recipePath}\n`);
        
        if (!fs.existsSync(recipePath)) {
            this.errors.push(`Recipe file not found: ${recipePath}`);
            return this.getReport();
        }

        const content = fs.readFileSync(recipePath, 'utf8');
        
        // Run all validation checks
        this.validateArchitecturalCompliance(content);
        this.validateCanvasAlignment(content);
        this.validateTestingCompliance(content);
        this.validatePerformanceMetrics(content);
        this.validateMigrationReadiness(content);
        this.validateDocumentationQuality(content);
        this.validateDependencies(content);
        this.validateEdgeCases(content);
        
        return this.getReport();
    }

    /**
     * Check for architectural anti-patterns (Session 152 compliance)
     */
    validateArchitecturalCompliance(content) {
        console.log('Checking Architectural Compliance...');
        let points = 25;
        
        // Check for React hooks (FORBIDDEN)
        const reactHooks = [
            'useState', 'useEffect', 'useCallback', 'useMemo', 
            'useRef', 'useContext', 'useReducer', 'useLayoutEffect'
        ];
        
        reactHooks.forEach(hook => {
            const regex = new RegExp(`\\b${hook}\\b`, 'g');
            if (regex.test(content)) {
                this.errors.push(`❌ Found forbidden React hook: ${hook}`);
                points -= 5;
            }
        });
        
        // Check for 'use client' directive (FORBIDDEN)
        if (content.includes("'use client'") || content.includes('"use client"')) {
            this.errors.push("❌ Found forbidden 'use client' directive");
            points -= 10;
        }
        
        // Check for CSS-in-JS (FORBIDDEN)
        const cssInJsPatterns = [
            'styled-components', 'styled.', '@emotion', 'css`'
        ];
        
        cssInJsPatterns.forEach(pattern => {
            if (content.includes(pattern)) {
                this.errors.push(`❌ Found forbidden CSS-in-JS: ${pattern}`);
                points -= 5;
            }
        });
        
        // Check for vanilla JS class pattern (REQUIRED)
        if (!content.includes('class ') || !content.includes('constructor(')) {
            this.warnings.push("⚠️ Missing vanilla JS class pattern");
            points -= 5;
        } else {
            console.log('  ✅ Vanilla JS class pattern found');
        }
        
        // Check for data-* attributes (REQUIRED)
        if (!content.includes('data-') || !content.includes('dataset')) {
            this.warnings.push("⚠️ Missing data-* attributes for hydration");
            points -= 3;
        } else {
            console.log('  ✅ Data attributes for hydration found');
        }
        
        // Check for Server Component example (RECOMMENDED)
        if (!content.includes('Server Component Integration')) {
            this.warnings.push("⚠️ Missing Server Component integration example");
            points -= 2;
        } else {
            console.log('  ✅ Server Component integration documented');
        }
        
        this.score += Math.max(0, points);
    }

    /**
     * Validate Canvas alignment
     */
    validateCanvasAlignment(content) {
        console.log('Checking Canvas Alignment...');
        let points = 25;
        
        // Check for Canvas node ID
        if (!content.match(/Canvas Node ID:.*[a-f0-9]{16}/)) {
            this.warnings.push("⚠️ Missing or invalid Canvas node ID");
            points -= 5;
        } else {
            console.log('  ✅ Canvas node ID present');
        }
        
        // Check for Canvas position
        if (!content.includes('Canvas Position:')) {
            this.warnings.push("⚠️ Missing Canvas position reference");
            points -= 5;
        }
        
        // Check for Canvas file reference
        if (!content.match(/Canvas File:.*\.canvas/)) {
            this.warnings.push("⚠️ Missing Canvas file reference");
            points -= 5;
        }
        
        // Check for color alignment
        if (!content.includes('Canvas Color Code:')) {
            this.warnings.push("⚠️ Missing Canvas color code reference");
            points -= 5;
        }
        
        // Check for alignment checklist
        if (!content.includes('Canvas Alignment Checklist')) {
            this.warnings.push("⚠️ Missing Canvas alignment checklist");
            points -= 5;
        } else {
            console.log('  ✅ Canvas alignment checklist present');
        }
        
        this.score += Math.max(0, points);
    }

    /**
     * Validate testing compliance
     */
    validateTestingCompliance(content) {
        console.log('Checking Testing Compliance...');
        let points = 20;
        
        // Check for data-testid attributes
        const testIdCount = (content.match(/data-testid="/g) || []).length;
        if (testIdCount < 3) {
            this.warnings.push(`⚠️ Insufficient test selectors (found ${testIdCount}, need 3+)`);
            points -= 5;
        } else {
            console.log(`  ✅ ${testIdCount} test selectors found`);
        }
        
        // Check for unit test examples
        if (!content.includes('describe(') || !content.includes('it(')) {
            this.warnings.push("⚠️ Missing unit test examples");
            points -= 5;
        } else {
            console.log('  ✅ Unit test examples present');
        }
        
        // Check for E2E test examples
        if (!content.includes('cy.') && !content.includes('Cypress')) {
            this.warnings.push("⚠️ Missing E2E test examples");
            points -= 5;
        }
        
        // Check for accessibility
        if (!content.includes('aria-') && !content.includes('ARIA')) {
            this.warnings.push("⚠️ Missing accessibility attributes");
            points -= 5;
        } else {
            console.log('  ✅ Accessibility attributes present');
        }
        
        this.score += Math.max(0, points);
    }

    /**
     * Validate performance metrics
     */
    validatePerformanceMetrics(content) {
        console.log('Checking Performance Metrics...');
        let points = 15;
        
        // Check for bundle size metric
        if (!content.match(/Bundle Size:.*\d+\s*(KB|MB)/)) {
            this.warnings.push("⚠️ Missing bundle size metric");
            points -= 5;
        } else {
            console.log('  ✅ Bundle size metric documented');
        }
        
        // Check for render timing
        if (!content.match(/Initial Render:.*\d+\s*ms/)) {
            this.warnings.push("⚠️ Missing initial render metric");
            points -= 5;
        }
        
        // Check for TTI metric
        if (!content.match(/Time to Interactive:.*\d+/)) {
            this.warnings.push("⚠️ Missing Time to Interactive metric");
            points -= 5;
        }
        
        this.score += Math.max(0, points);
    }

    /**
     * Validate migration readiness
     */
    validateMigrationReadiness(content) {
        console.log('Checking Migration Readiness...');
        let points = 5;
        
        // Check for migration guide
        if (!content.includes('Migration Guide') && !content.includes('Migration from')) {
            this.errors.push("❌ Missing migration guide");
            points = 0;
        } else {
            console.log('  ✅ Migration guide present');
            
            // Check for table mappings
            if (!content.includes('Table Mappings') && !content.includes('v5_table')) {
                this.warnings.push("⚠️ Missing table mapping details");
                points -= 2;
            }
            
            // Check for breaking changes
            if (!content.includes('Breaking Changes')) {
                this.warnings.push("⚠️ Breaking changes not documented");
                points -= 2;
            }
        }
        
        this.score += Math.max(0, points);
    }

    /**
     * Validate documentation quality
     */
    validateDocumentationQuality(content) {
        console.log('Checking Documentation Quality...');
        let points = 10;
        
        // Check for version number
        if (!content.match(/Version:.*\d+\.\d+\.\d+/)) {
            this.warnings.push("⚠️ Missing semantic version number");
            points -= 2;
        }
        
        // Check for quality score
        if (!content.match(/Quality Score:.*\d+\/100/)) {
            this.warnings.push("⚠️ Missing quality score");
            points -= 2;
        }
        
        // Check for session heritage
        if (!content.match(/Session Heritage:.*SESSION-\d+\.\d+/)) {
            this.warnings.push("⚠️ Missing session heritage reference");
            points -= 2;
        }
        
        // Check for usage example
        if (!content.includes('Usage Example')) {
            this.warnings.push("⚠️ Missing usage example");
            points -= 2;
        }
        
        // Check for related recipes
        if (!content.includes('Related Recipes')) {
            this.warnings.push("⚠️ Missing related recipes section");
            points -= 2;
        }
        
        this.score += Math.max(0, points);
    }

    /**
     * Validate dependencies
     */
    validateDependencies(content) {
        console.log('Checking Dependencies...');
        
        // Check for NO React warning
        if (!content.includes('NO React') && !content.includes('no React')) {
            this.warnings.push("⚠️ Missing explicit NO React dependencies warning");
        }
        
        // Check for required recipes list
        if (!content.includes('Required Foundation Recipes') && 
            !content.includes('Required Recipes')) {
            this.warnings.push("⚠️ Missing required recipes dependencies");
        }
        
        // Check for browser requirements
        if (!content.includes('Browser Requirements')) {
            this.warnings.push("⚠️ Missing browser requirements");
        }
    }

    /**
     * Validate edge cases
     */
    validateEdgeCases(content) {
        console.log('Checking Edge Cases...');
        
        const edgeCases = [
            'Offline Mode',
            'Stale Data',
            'Race Condition',
            'Error',
            'Retry',
            'Cache'
        ];
        
        const foundCases = edgeCases.filter(ec => 
            content.toLowerCase().includes(ec.toLowerCase())
        );
        
        if (foundCases.length < 3) {
            this.warnings.push(`⚠️ Insufficient edge case coverage (${foundCases.length}/6)`);
        } else {
            console.log(`  ✅ Edge cases covered: ${foundCases.join(', ')}`);
        }
    }

    /**
     * Generate validation report
     */
    getReport() {
        const totalErrors = this.errors.length;
        const totalWarnings = this.warnings.length;
        const finalScore = Math.min(this.score, this.maxScore);
        const grade = this.getGrade(finalScore);
        
        console.log('\n' + '='.repeat(60));
        console.log('VALIDATION REPORT');
        console.log('='.repeat(60));
        
        if (this.errors.length > 0) {
            console.log('\n🔴 ERRORS (Must Fix):');
            this.errors.forEach(error => console.log('  ' + error));
        }
        
        if (this.warnings.length > 0) {
            console.log('\n🟡 WARNINGS (Should Fix):');
            this.warnings.forEach(warning => console.log('  ' + warning));
        }
        
        console.log('\n📊 QUALITY SCORE:');
        console.log(`  Score: ${finalScore}/${this.maxScore} (${grade})`);
        console.log(`  Errors: ${totalErrors}`);
        console.log(`  Warnings: ${totalWarnings}`);
        
        console.log('\n✅ VALIDATION STATUS:');
        if (totalErrors === 0 && finalScore >= 85) {
            console.log('  ✅ Recipe PASSED validation');
            console.log('  Ready for production use');
        } else if (totalErrors === 0 && finalScore >= 70) {
            console.log('  ⚠️ Recipe PASSED with warnings');
            console.log('  Consider addressing warnings before production');
        } else {
            console.log('  ❌ Recipe FAILED validation');
            console.log('  Must fix errors before use');
        }
        
        console.log('\n' + '='.repeat(60) + '\n');
        
        return {
            passed: totalErrors === 0 && finalScore >= 70,
            score: finalScore,
            grade,
            errors: this.errors,
            warnings: this.warnings
        };
    }

    getGrade(score) {
        if (score >= 95) return 'A+';
        if (score >= 90) return 'A';
        if (score >= 85) return 'B+';
        if (score >= 80) return 'B';
        if (score >= 75) return 'C+';
        if (score >= 70) return 'C';
        if (score >= 65) return 'D';
        return 'F';
    }
}

// CLI Usage
if (require.main === module) {
    const args = process.argv.slice(2);
    
    if (args.length === 0) {
        console.log('Usage: node recipe-validator.js <recipe-file.md>');
        console.log('Example: node recipe-validator.js ../components/addiction-bar-recipe-v2.md');
        process.exit(1);
    }
    
    const validator = new RecipeValidator();
    const recipePath = path.resolve(args[0]);
    
    validator.validateRecipe(recipePath).then(report => {
        process.exit(report.passed ? 0 : 1);
    });
}

module.exports = RecipeValidator;