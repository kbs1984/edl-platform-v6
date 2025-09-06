#!/usr/bin/env node
/**
 * Run Auth Test with Correct Ports
 * Session 128 - Executing Session 129's test with corrected configuration
 */

// Override the ports before loading utilities
process.env.AUTH_GATEWAY_URL = 'http://localhost:3000';
process.env.DASHBOARD_URL = 'http://localhost:3001';

const { execSync } = require('child_process');

console.log('🔧 Running auth test with corrected ports:');
console.log('   Auth Gateway: http://localhost:3000');
console.log('   Dashboard: http://localhost:3001');
console.log('');

// Run the test
try {
    execSync('node scripts/00129-test-auth-flow.js', { 
        stdio: 'inherit',
        env: {
            ...process.env,
            AUTH_GATEWAY_URL: 'http://localhost:3000',
            DASHBOARD_URL: 'http://localhost:3001'
        }
    });
} catch (error) {
    console.error('Test failed:', error.message);
    process.exit(1);
}