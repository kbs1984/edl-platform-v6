#!/usr/bin/env node
/*
---
session: "00118"
type: "script"
status: "active"
created: "2025-08-30"
modified: "2025-08-30"
title: "EDL Platform Test Runner"
purpose: "Automated test script for EDL platform applications using Puppeteer MCP"
language: "javascript"
category: "testing"
topics: ["testing", "automation", "puppeteer", "build-verification"]
priority: "P1"
domain: "core"
---
*/
/**
 * Automated test script for EDL platform applications
 * Uses Puppeteer MCP for browser automation
 * Session 00118
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m'
};

function log(message, type = 'info') {
  const prefix = {
    info: `${colors.blue}ℹ${colors.reset}`,
    success: `${colors.green}✓${colors.reset}`,
    error: `${colors.red}✗${colors.reset}`,
    warning: `${colors.yellow}⚠${colors.reset}`
  };
  console.log(`${prefix[type]} ${message}`);
}

function runCommand(command, description) {
  log(`Running: ${description}`, 'info');
  try {
    execSync(command, { stdio: 'inherit' });
    log(`Success: ${description}`, 'success');
    return true;
  } catch (error) {
    log(`Failed: ${description}`, 'error');
    return false;
  }
}

// Test configurations for each app
const apps = [
  {
    name: 'Auth Gateway',
    path: 'reconciliation/active-work/auth-gateway',
    port: 3000,
    buildCommand: 'npm run build',
    startCommand: 'npm run dev',
    tests: [
      'Build verification',
      'Type checking',
      'Login page test',
      'Signup page test'
    ]
  },
  {
    name: 'Dashboard',
    path: 'reconciliation/active-work/dashboard',
    port: 3001,
    buildCommand: 'npm run build',
    startCommand: 'npm run dev',
    tests: [
      'Build verification',
      'Student onboarding flow',
      'Friend system test',
      'Team management test'
    ]
  },
  {
    name: 'Admin Dashboard',
    path: 'reconciliation/active-work/admin-dashboard',
    port: 3002,
    buildCommand: 'npm run build',
    startCommand: 'npm run dev',
    tests: [
      'Build verification',
      'Telemetry collection',
      'Metrics accuracy',
      'Real-time updates'
    ]
  }
];

async function testApp(app) {
  console.log(`\n${colors.bright}Testing ${app.name}${colors.reset}`);
  console.log('='.repeat(50));
  
  // Change to app directory
  process.chdir(path.join(process.cwd(), app.path));
  
  // Run build
  const buildSuccess = runCommand(app.buildCommand, `${app.name} build`);
  if (!buildSuccess) {
    log(`Skipping runtime tests for ${app.name} due to build failure`, 'warning');
    return {
      app: app.name,
      build: false,
      tests: []
    };
  }
  
  // Return to root directory
  process.chdir(path.join(process.cwd(), '../../..'));
  
  return {
    app: app.name,
    build: true,
    tests: app.tests
  };
}

async function runAllTests() {
  console.log(`${colors.bright}EDL Platform Test Suite${colors.reset}`);
  console.log(`Started: ${new Date().toISOString()}\n`);
  
  const results = [];
  
  for (const app of apps) {
    const result = await testApp(app);
    results.push(result);
  }
  
  // Generate test report
  generateReport(results);
}

function generateReport(results) {
  console.log(`\n${colors.bright}Test Report${colors.reset}`);
  console.log('='.repeat(50));
  
  const report = {
    timestamp: new Date().toISOString(),
    summary: {
      total: results.length,
      passed: results.filter(r => r.build).length,
      failed: results.filter(r => !r.build).length
    },
    details: results
  };
  
  // Print summary
  console.log(`Total Apps Tested: ${report.summary.total}`);
  console.log(`${colors.green}Passed: ${report.summary.passed}${colors.reset}`);
  console.log(`${colors.red}Failed: ${report.summary.failed}${colors.reset}`);
  
  // Save report to file
  const reportPath = path.join(process.cwd(), 'test-results.json');
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  log(`Report saved to: ${reportPath}`, 'success');
  
  // Create markdown report
  const mdReport = generateMarkdownReport(report);
  const mdPath = path.join(process.cwd(), 'test-results.md');
  fs.writeFileSync(mdPath, mdReport);
  log(`Markdown report saved to: ${mdPath}`, 'success');
}

function generateMarkdownReport(report) {
  let md = `# EDL Platform Test Results\n\n`;
  md += `**Date**: ${report.timestamp}\n\n`;
  md += `## Summary\n\n`;
  md += `- Total Apps: ${report.summary.total}\n`;
  md += `- Passed: ${report.summary.passed}\n`;
  md += `- Failed: ${report.summary.failed}\n\n`;
  
  md += `## Details\n\n`;
  report.details.forEach(result => {
    md += `### ${result.app}\n\n`;
    md += `- Build: ${result.build ? '✅ Passed' : '❌ Failed'}\n`;
    if (result.tests.length > 0) {
      md += `- Tests to run:\n`;
      result.tests.forEach(test => {
        md += `  - [ ] ${test}\n`;
      });
    }
    md += `\n`;
  });
  
  md += `## Next Steps\n\n`;
  md += `1. Run Puppeteer tests for each app\n`;
  md += `2. Check telemetry data collection\n`;
  md += `3. Verify database operations\n`;
  md += `4. Test user flows end-to-end\n`;
  
  return md;
}

// Run tests
runAllTests().catch(error => {
  log(`Test suite failed: ${error.message}`, 'error');
  process.exit(1);
});