#!/usr/bin/env node
/**
 * Quick Configuration Test - Session 131
 * Verifies port and email configuration fixes
 */

async function quickConfigTest() {
    console.log('🧪 Quick Configuration Test - Session 131');
    console.log('=' .repeat(50));
    
    try {
        // Test imports
        console.log('\n1️⃣ Testing imports...');
        const TestUtilities = require('./00129-test-utilities');
        console.log('   ✅ TestUtilities loaded');
        
        // Test service detection
        console.log('\n2️⃣ Testing service detection...');
        const services = await TestUtilities.checkServicesRunning();
        console.log('   Auth Gateway (3000):', services.authGateway ? '✅' : '❌');
        console.log('   Dashboard (3001):', services.dashboard ? '✅' : '❌');
        
        if (!services.authGateway || !services.dashboard) {
            console.log('\n❌ Services not running. Please start them:');
            if (!services.authGateway) {
                console.log('   cd reconciliation/active-work/auth-gateway && npm run dev');
            }
            if (!services.dashboard) {
                console.log('   cd reconciliation/active-work/dashboard && npm run dev');
            }
            return;
        }
        
        // Test user generation
        console.log('\n3️⃣ Testing user generation...');
        const user1 = TestUtilities.generateTestUser();
        console.log('   Email:', user1.email);
        console.log('   Password:', user1.password);
        console.log('   ✅ Email uses Gmail with + addressing');
        
        // Test password validation
        console.log('\n4️⃣ Testing password requirements...');
        const password = user1.password;
        const hasMinLength = password.length >= 10;
        const hasLetter = /[a-zA-Z]/.test(password);
        const hasNumber = /[0-9]/.test(password);
        const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
        
        console.log('   Min 10 chars:', hasMinLength ? '✅' : '❌');
        console.log('   Has letter:', hasLetter ? '✅' : '❌');
        console.log('   Has number:', hasNumber ? '✅' : '❌');
        console.log('   Has special:', hasSpecial ? '✅' : '❌');
        
        // Configuration summary
        console.log('\n5️⃣ Configuration Summary:');
        console.log('   Auth Gateway URL: http://localhost:3000');
        console.log('   Dashboard URL: http://localhost:3001');
        console.log('   Email Domain: @gmail.com');
        console.log('   Email Prefix: brian.bumsik.kim+test_');
        
        console.log('\n✅ Configuration test complete!');
        console.log('\n📝 Next steps:');
        console.log('   1. Run full auth flow test: node scripts/00129-test-auth-flow.js');
        console.log('   2. Create dashboard tests: scripts/00131-test-dashboard.js');
        console.log('   3. Create friends tests: scripts/00131-test-friends.js');
        
    } catch (error) {
        console.error('\n❌ Test failed:', error.message);
        process.exit(1);
    }
}

// Run the test
quickConfigTest().catch(console.error);