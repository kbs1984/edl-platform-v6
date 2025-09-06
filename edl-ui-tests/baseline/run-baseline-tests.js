#!/usr/bin/env node
/**
 * Baseline Test Runner
 * Session 133 - Priority 3: Test-First Validation Suite
 * 
 * Runs all baseline tests and generates comprehensive report
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

class BaselineTestRunner {
    constructor() {
        this.results = {
            timestamp: new Date().toISOString(),
            summary: {
                totalFeatures: 0,
                working: 0,
                broken: 0,
                partial: 0,
                notImplemented: 0,
                ninetyFivePercent: 0
            },
            features: {},
            performance: {},
            failures: [],
            workItems: []
        };
    }

    /**
     * Run baseline tests for a feature
     */
    async runFeatureTest(feature, testFile) {
        console.log(`\n🧪 Testing ${feature}...`);
        console.log('=' .repeat(50));
        
        try {
            const output = execSync(`npx jest ${testFile} --no-coverage`, {
                encoding: 'utf8',
                cwd: path.dirname(testFile)
            });
            
            // Parse output for baseline results
            this.parseTestOutput(feature, output);
            
        } catch (error) {
            console.log(`❌ ${feature} tests failed to run`);
            this.results.failures.push({
                feature,
                error: error.message,
                type: 'execution_failure'
            });
        }
    }

    /**
     * Parse test output for baseline metrics
     */
    parseTestOutput(feature, output) {
        const lines = output.split('\n');
        const featureResult = {
            working: [],
            broken: [],
            partial: [],
            notImplemented: [],
            ninetyFivePercent: [],
            performance: {}
        };
        
        let currentSection = null;
        
        lines.forEach(line => {
            // Parse baseline report sections
            if (line.includes('✅ Working:')) {
                currentSection = 'working';
            } else if (line.includes('❌ Broken:')) {
                currentSection = 'broken';
            } else if (line.includes('⚠️ Partial:')) {
                currentSection = 'partial';
            } else if (line.includes('🚫 Not Implemented:')) {
                currentSection = 'notImplemented';
            } else if (line.includes('😬 95% Syndrome')) {
                currentSection = 'ninetyFivePercent';
            } else if (line.includes('⏱️ Performance:')) {
                currentSection = 'performance';
            } else if (line.startsWith('  - ') && currentSection) {
                const item = line.replace('  - ', '').trim();
                
                if (currentSection === 'performance') {
                    const [key, value] = item.split(': ');
                    featureResult.performance[key] = value;
                } else if (featureResult[currentSection]) {
                    featureResult[currentSection].push(item);
                }
            }
        });
        
        this.results.features[feature] = featureResult;
        
        // Update summary
        this.results.summary.totalFeatures++;
        this.results.summary.working += featureResult.working.length;
        this.results.summary.broken += featureResult.broken.length;
        this.results.summary.partial += featureResult.partial.length;
        this.results.summary.notImplemented += featureResult.notImplemented.length;
        this.results.summary.ninetyFivePercent += featureResult.ninetyFivePercent.length;
        
        // Generate work items
        this.generateWorkItems(feature, featureResult);
    }

    /**
     * Generate work items from failures
     */
    generateWorkItems(feature, result) {
        // Critical (Broken)
        result.broken.forEach(item => {
            this.results.workItems.push({
                priority: 'P0',
                feature,
                type: 'bug',
                description: item,
                status: 'broken'
            });
        });
        
        // High Priority (95% Syndrome)
        result.ninetyFivePercent.forEach(item => {
            this.results.workItems.push({
                priority: 'P1',
                feature,
                type: '95_percent_syndrome',
                description: item,
                status: 'partial',
                note: 'Appears complete but missing critical functionality'
            });
        });
        
        // Medium Priority (Partial)
        result.partial.forEach(item => {
            this.results.workItems.push({
                priority: 'P2',
                feature,
                type: 'incomplete',
                description: item,
                status: 'partial'
            });
        });
        
        // Low Priority (Not Implemented)
        result.notImplemented.forEach(item => {
            this.results.workItems.push({
                priority: 'P3',
                feature,
                type: 'not_implemented',
                description: item,
                status: 'missing'
            });
        });
    }

    /**
     * Run quick validation tests without full Puppeteer
     */
    async runQuickValidation() {
        console.log('\n🚀 Quick Validation Tests\n');
        
        // Test 1: Check if services are running
        console.log('Checking services...');
        try {
            const authCheck = execSync('curl -s -o /dev/null -w "%{http_code}" http://localhost:3000', { encoding: 'utf8' });
            const dashCheck = execSync('curl -s -o /dev/null -w "%{http_code}" http://localhost:3001', { encoding: 'utf8' });
            
            if (authCheck.includes('200') || authCheck.includes('302')) {
                console.log('  ✅ Auth Gateway: Running');
                this.results.features['Services'] = { working: ['Auth Gateway running'] };
            } else {
                console.log('  ❌ Auth Gateway: Not responding');
                this.results.failures.push({ feature: 'Services', error: 'Auth Gateway not running' });
            }
            
            if (dashCheck.includes('200') || dashCheck.includes('302')) {
                console.log('  ✅ Dashboard: Running');
                if (!this.results.features['Services']) this.results.features['Services'] = { working: [] };
                this.results.features['Services'].working.push('Dashboard running');
            } else {
                console.log('  ❌ Dashboard: Not responding');
                this.results.failures.push({ feature: 'Services', error: 'Dashboard not running' });
            }
        } catch (error) {
            console.log('  ⚠️ Services check failed - are they running?');
            this.results.failures.push({ feature: 'Services', error: 'Cannot reach services' });
        }
        
        // Test 2: Database connectivity
        console.log('\nChecking database...');
        try {
            const { SupabaseValidator } = require('../supabase-validator');
            const validator = new SupabaseValidator();
            const testUsers = await validator.countTestUsers();
            console.log(`  ✅ Database: Connected (${testUsers} test users)`);
            this.results.features['Database'] = { working: ['Database connection'] };
        } catch (error) {
            console.log('  ❌ Database: Connection failed');
            this.results.failures.push({ feature: 'Database', error: error.message });
        }
    }

    /**
     * Generate comprehensive report
     */
    generateReport() {
        console.log('\n\n📊 BASELINE TEST REPORT');
        console.log('=' .repeat(60));
        
        // Executive Summary
        console.log('\n🎯 Executive Summary\n');
        const total = this.results.summary.working + 
                     this.results.summary.broken + 
                     this.results.summary.partial + 
                     this.results.summary.notImplemented;
        
        const workingPercent = total > 0 ? 
            Math.round((this.results.summary.working / total) * 100) : 0;
        
        console.log(`  Overall Health: ${workingPercent}%`);
        console.log(`  Total Items Tested: ${total}`);
        console.log(`  ✅ Working: ${this.results.summary.working}`);
        console.log(`  ❌ Broken: ${this.results.summary.broken}`);
        console.log(`  ⚠️ Partial: ${this.results.summary.partial}`);
        console.log(`  🚫 Not Implemented: ${this.results.summary.notImplemented}`);
        console.log(`  😬 95% Syndrome Issues: ${this.results.summary.ninetyFivePercent}`);
        
        // Feature Breakdown
        console.log('\n📋 Feature Breakdown\n');
        Object.entries(this.results.features).forEach(([feature, data]) => {
            console.log(`\n${feature}:`);
            if (data.working && data.working.length > 0) {
                console.log(`  ✅ Working (${data.working.length}):`);
                data.working.slice(0, 3).forEach(item => console.log(`     - ${item}`));
                if (data.working.length > 3) console.log(`     ... and ${data.working.length - 3} more`);
            }
            if (data.broken && data.broken.length > 0) {
                console.log(`  ❌ Broken (${data.broken.length}):`);
                data.broken.forEach(item => console.log(`     - ${item}`));
            }
            if (data.ninetyFivePercent && data.ninetyFivePercent.length > 0) {
                console.log(`  😬 95% Syndrome (${data.ninetyFivePercent.length}):`);
                data.ninetyFivePercent.forEach(item => console.log(`     - ${item}`));
            }
        });
        
        // Critical Issues (95% Syndrome)
        console.log('\n🔥 Critical "95% Syndrome" Issues\n');
        console.log('These features appear to work but have critical missing functionality:\n');
        
        const ninetyFiveIssues = this.results.workItems.filter(item => 
            item.type === '95_percent_syndrome'
        );
        
        if (ninetyFiveIssues.length > 0) {
            ninetyFiveIssues.forEach(issue => {
                console.log(`  • ${issue.feature}: ${issue.description}`);
            });
        } else {
            console.log('  No 95% syndrome issues detected');
        }
        
        // Work Items by Priority
        console.log('\n📝 Work Items by Priority\n');
        
        const priorities = ['P0', 'P1', 'P2', 'P3'];
        priorities.forEach(priority => {
            const items = this.results.workItems.filter(item => item.priority === priority);
            if (items.length > 0) {
                console.log(`\n${priority} - ${this.getPriorityLabel(priority)} (${items.length} items):`);
                items.slice(0, 5).forEach(item => {
                    console.log(`  • [${item.feature}] ${item.description}`);
                });
                if (items.length > 5) {
                    console.log(`  ... and ${items.length - 5} more`);
                }
            }
        });
        
        // Performance Baselines
        console.log('\n⏱️ Performance Baselines\n');
        Object.entries(this.results.features).forEach(([feature, data]) => {
            if (data.performance && Object.keys(data.performance).length > 0) {
                console.log(`\n${feature}:`);
                Object.entries(data.performance).forEach(([metric, value]) => {
                    console.log(`  • ${metric}: ${value}`);
                });
            }
        });
        
        // Save detailed report
        const reportPath = '../../reconciliation/00133-baseline-test-report.json';
        fs.writeFileSync(reportPath, JSON.stringify(this.results, null, 2));
        console.log(`\n💾 Detailed report saved to: ${reportPath}`);
        
        // Generate markdown report
        this.generateMarkdownReport();
    }

    /**
     * Generate markdown report for documentation
     */
    generateMarkdownReport() {
        const md = [];
        
        md.push('# Priority 3 Baseline Test Report');
        md.push(`\n**Generated**: ${this.results.timestamp}`);
        md.push('**Session**: 133');
        md.push('\n## Executive Summary\n');
        
        const total = this.results.summary.working + 
                     this.results.summary.broken + 
                     this.results.summary.partial + 
                     this.results.summary.notImplemented;
        
        const workingPercent = total > 0 ? 
            Math.round((this.results.summary.working / total) * 100) : 0;
        
        md.push(`- **Overall Health**: ${workingPercent}%`);
        md.push(`- **Total Items Tested**: ${total}`);
        md.push(`- **Working**: ${this.results.summary.working}`);
        md.push(`- **Broken**: ${this.results.summary.broken}`);
        md.push(`- **Partial**: ${this.results.summary.partial}`);
        md.push(`- **Not Implemented**: ${this.results.summary.notImplemented}`);
        md.push(`- **95% Syndrome Issues**: ${this.results.summary.ninetyFivePercent}`);
        
        md.push('\n## Critical Findings\n');
        md.push('### 95% Syndrome Issues');
        md.push('\nThese features appear complete but have critical missing functionality:\n');
        
        const ninetyFiveIssues = this.results.workItems.filter(item => 
            item.type === '95_percent_syndrome'
        );
        
        ninetyFiveIssues.forEach(issue => {
            md.push(`- **${issue.feature}**: ${issue.description}`);
        });
        
        md.push('\n## Work Items\n');
        
        const priorities = ['P0', 'P1', 'P2', 'P3'];
        priorities.forEach(priority => {
            const items = this.results.workItems.filter(item => item.priority === priority);
            if (items.length > 0) {
                md.push(`\n### ${priority} - ${this.getPriorityLabel(priority)}`);
                items.forEach(item => {
                    md.push(`- [${item.feature}] ${item.description}`);
                });
            }
        });
        
        const mdPath = '../../reconciliation/00133-baseline-test-report.md';
        fs.writeFileSync(mdPath, md.join('\n'));
        console.log(`📄 Markdown report saved to: ${mdPath}`);
    }

    getPriorityLabel(priority) {
        const labels = {
            'P0': 'Critical (Broken)',
            'P1': 'High (95% Syndrome)',
            'P2': 'Medium (Partial)',
            'P3': 'Low (Not Implemented)'
        };
        return labels[priority] || priority;
    }
}

// Main execution
async function main() {
    const runner = new BaselineTestRunner();
    
    console.log('🚀 Starting Priority 3 Baseline Tests');
    console.log('Session 133 - Test-First Validation Suite\n');
    
    // Quick validation first
    await runner.runQuickValidation();
    
    // Check if we should run full tests
    if (process.argv.includes('--quick')) {
        console.log('\n⚡ Quick mode - skipping full Puppeteer tests');
    } else {
        console.log('\n⚠️ Full Puppeteer tests require services running on ports 3000 and 3001');
        console.log('Run with --quick for validation only\n');
        
        // Run baseline tests if files exist
        const testFiles = [
            'auth.baseline.test.js',
            'friends.baseline.test.js'
        ];
        
        for (const file of testFiles) {
            const testPath = path.join(__dirname, file);
            if (fs.existsSync(testPath)) {
                const feature = file.replace('.baseline.test.js', '');
                await runner.runFeatureTest(feature.charAt(0).toUpperCase() + feature.slice(1), testPath);
            }
        }
    }
    
    // Generate report
    runner.generateReport();
    
    console.log('\n\n✅ Baseline testing complete!');
    console.log('Ground truth established for Priority 2 implementation.');
}

main().catch(console.error);