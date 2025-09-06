#!/usr/bin/env node
/**
 * Simple Feature Discovery
 * Session 133 - Priority 3: Test-First Validation Suite
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('📊 EDL Platform Feature Discovery\n');
console.log('=' .repeat(50));

// Check what's actually implemented
const features = {
    authentication: {
        implemented: [],
        missing: []
    },
    friends: {
        implemented: [],
        missing: []
    },
    teams: {
        implemented: [],
        missing: []
    },
    dashboard: {
        implemented: [],
        missing: []
    },
    chat: {
        implemented: [],
        missing: []
    }
};

// Check Auth Gateway routes
console.log('\n🔍 Checking Auth Gateway...');
const authGatewayPath = 'reconciliation/active-work/auth-gateway/src/app';
if (fs.existsSync(authGatewayPath)) {
    try {
        const authPages = execSync(`find ${authGatewayPath} -name "page.tsx" -type f`, { encoding: 'utf8' });
        const authRoutes = authPages.split('\n').filter(Boolean);
        
        authRoutes.forEach(route => {
            if (route.includes('login')) {
                features.authentication.implemented.push('Login page');
            }
            if (route.includes('sign-up')) {
                features.authentication.implemented.push('Signup page');
            }
            if (route.includes('thank-you')) {
                features.authentication.implemented.push('Thank you page');
            }
        });
        
        console.log(`  ✅ Found ${authRoutes.length} pages`);
    } catch (e) {
        console.log('  ❌ Error checking auth gateway');
    }
}

// Check Dashboard routes
console.log('\n🔍 Checking Dashboard...');
const dashboardPath = 'reconciliation/active-work/dashboard/src/app';
if (fs.existsSync(dashboardPath)) {
    try {
        const dashPages = execSync(`find ${dashboardPath} -name "page.tsx" -type f`, { encoding: 'utf8' });
        const dashRoutes = dashPages.split('\n').filter(Boolean);
        
        dashRoutes.forEach(route => {
            if (route.includes('friends')) {
                features.friends.implemented.push('Friends page');
            }
            if (route.includes('teams') || route.includes('groups')) {
                features.teams.implemented.push('Teams/Groups page');
            }
            if (route.includes('chat')) {
                features.chat.implemented.push('Chat page');
            }
            if (route.includes('profile')) {
                features.dashboard.implemented.push('Profile page');
            }
        });
        
        console.log(`  ✅ Found ${dashRoutes.length} pages`);
    } catch (e) {
        console.log('  ❌ Error checking dashboard');
    }
}

// Check for components
console.log('\n🔍 Checking Components...');
const componentPaths = [
    'reconciliation/active-work/auth-gateway/src/components',
    'reconciliation/active-work/dashboard/src/components'
];

componentPaths.forEach(compPath => {
    if (fs.existsSync(compPath)) {
        try {
            const components = execSync(`find ${compPath} -name "*.tsx" -type f`, { encoding: 'utf8' });
            const compList = components.split('\n').filter(Boolean);
            
            compList.forEach(comp => {
                const name = path.basename(comp);
                if (name.includes('friend')) {
                    features.friends.implemented.push(`Component: ${name}`);
                }
                if (name.includes('team')) {
                    features.teams.implemented.push(`Component: ${name}`);
                }
                if (name.includes('chat')) {
                    features.chat.implemented.push(`Component: ${name}`);
                }
            });
        } catch (e) {
            // Silent fail
        }
    }
});

// Check for server actions
console.log('\n🔍 Checking Server Actions...');
const actionPaths = [
    'reconciliation/active-work/auth-gateway/src/lib/action',
    'reconciliation/active-work/dashboard/src/lib/actions'
];

actionPaths.forEach(actionPath => {
    if (fs.existsSync(actionPath)) {
        try {
            const actions = execSync(`ls -la ${actionPath}/*.ts 2>/dev/null || true`, { encoding: 'utf8' });
            if (actions.includes('auth-actions')) {
                features.authentication.implemented.push('Auth server actions');
            }
            if (actions.includes('student-actions')) {
                features.dashboard.implemented.push('Student server actions');
            }
        } catch (e) {
            // Silent fail
        }
    }
});

// Generate testable features list
console.log('\n📋 Testable Features Summary:\n');

const testableFeatures = {
    'Authentication': [
        'Student signup flow',
        'Guardian signup flow (if exists)',
        'Login with email/password',
        'Logout functionality',
        'Session persistence',
        'Redirect after login (to dashboard)',
        'Password validation rules',
        'Error handling'
    ],
    'Friends System': [
        'Send friend request',
        'Accept friend request',
        'Reject friend request',
        'View friends list',
        'Remove friend',
        'Online status display',
        'Real-time updates (if implemented)'
    ],
    'Teams System': [
        'Create team',
        'Join team',
        'Leave team',
        'View team members',
        'Team chat (if implemented)',
        'Team settings'
    ],
    'Dashboard': [
        'Navigation menu',
        'User profile display',
        'Activity feed',
        'Quick stats',
        'Responsive design',
        'Page routing'
    ],
    'Chat UI': [
        'Send message',
        'Receive message',
        'Chat history',
        'Real-time updates',
        'Typing indicators (if implemented)'
    ]
};

// Print what's implemented vs what needs testing
Object.entries(features).forEach(([feature, data]) => {
    console.log(`\n${feature.toUpperCase()}:`);
    if (data.implemented.length > 0) {
        console.log('  ✅ Implemented:');
        data.implemented.forEach(item => console.log(`     - ${item}`));
    } else {
        console.log('  ❌ No implementations found');
    }
});

// Create test plan
console.log('\n\n🎯 Test Plan:\n');
console.log('Priority order based on dependencies:\n');
console.log('1. Authentication (required for all other features)');
console.log('2. Dashboard (verifies authenticated state)');
console.log('3. Friends System (requires multiple users)');
console.log('4. Teams System (requires users with relationships)');
console.log('5. Chat UI (requires friends or teams)');

// Save discovery report
const report = {
    timestamp: new Date().toISOString(),
    features,
    testableFeatures,
    testPriority: [
        'Authentication',
        'Dashboard',
        'Friends System',
        'Teams System',
        'Chat UI'
    ]
};

fs.writeFileSync(
    'reconciliation/00133-feature-discovery.json',
    JSON.stringify(report, null, 2)
);

console.log('\n💾 Report saved to: reconciliation/00133-feature-discovery.json');
console.log('\n✅ Discovery complete! Ready to create baseline tests.');