#!/usr/bin/env node
/**
 * Test Helpers Validation Script
 * Session 133 - Validates that all helper modules work correctly
 */

const AuthHelpers = require('./auth-helpers');
const SessionManager = require('./session-manager');
const SupabaseValidator = require('./supabase-validator');
const TestCleanup = require('./test-cleanup');

async function validateHelpers() {
    console.log('🧪 Validating Test Helper Modules...\n');
    
    const results = {
        authHelpers: false,
        sessionManager: false,
        supabaseValidator: false,
        testCleanup: false
    };
    
    // Test AuthHelpers
    try {
        const auth = new AuthHelpers();
        const testUser = auth.generateTestUser();
        
        if (testUser.email && testUser.email.includes('+test_')) {
            console.log('✅ AuthHelpers: Working');
            console.log(`   Generated test email: ${testUser.email}`);
            results.authHelpers = true;
        } else {
            console.log('❌ AuthHelpers: Failed to generate test user');
        }
    } catch (error) {
        console.log('❌ AuthHelpers: Error -', error.message);
    }
    
    // Test SessionManager
    try {
        const sessionManager = new SessionManager();
        console.log('✅ SessionManager: Initialized');
        console.log(`   Active sessions: ${sessionManager.getSessionCount()}`);
        results.sessionManager = true;
    } catch (error) {
        console.log('❌ SessionManager: Error -', error.message);
    }
    
    // Test SupabaseValidator
    try {
        const validator = new SupabaseValidator();
        const testUserCount = await validator.countTestUsers();
        console.log('✅ SupabaseValidator: Connected');
        console.log(`   Found ${testUserCount} test users in database`);
        results.supabaseValidator = true;
    } catch (error) {
        console.log('❌ SupabaseValidator: Error -', error.message);
    }
    
    // Test TestCleanup
    try {
        const cleanup = new TestCleanup();
        cleanup.setDryRun(true); // Don't actually delete anything
        const stats = await cleanup.getTestDataStats();
        console.log('✅ TestCleanup: Working');
        console.log(`   Test data stats:`, stats);
        results.testCleanup = true;
    } catch (error) {
        console.log('❌ TestCleanup: Error -', error.message);
    }
    
    // Summary
    console.log('\n📊 Validation Summary:');
    console.log('─'.repeat(40));
    
    const totalTests = Object.keys(results).length;
    const passedTests = Object.values(results).filter(r => r).length;
    
    for (const [module, passed] of Object.entries(results)) {
        console.log(`${passed ? '✅' : '❌'} ${module}`);
    }
    
    console.log('─'.repeat(40));
    console.log(`Total: ${passedTests}/${totalTests} modules working`);
    
    if (passedTests === totalTests) {
        console.log('\n🎉 All helper modules validated successfully!');
        return 0;
    } else {
        console.log('\n⚠️ Some modules failed validation. Check errors above.');
        return 1;
    }
}

// Run validation
validateHelpers()
    .then(exitCode => process.exit(exitCode))
    .catch(error => {
        console.error('Fatal error:', error);
        process.exit(1);
    });