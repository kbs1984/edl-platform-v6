#!/usr/bin/env node
/**
 * Feature Discovery Script
 * Session 133 - Priority 3: Test-First Validation Suite
 * 
 * Discovers all testable features in the EDL Platform
 */

const fs = require('fs');
const path = require('path');
const { glob } = require('glob');

class FeatureDiscovery {
    constructor() {
        this.features = {
            authentication: {
                routes: [],
                components: [],
                apis: [],
                status: 'unknown'
            },
            student: {
                routes: [],
                components: [],
                apis: [],
                status: 'unknown'
            },
            guardian: {
                routes: [],
                components: [],
                apis: [],
                status: 'unknown'
            },
            friends: {
                routes: [],
                components: [],
                apis: [],
                status: 'unknown'
            },
            teams: {
                routes: [],
                components: [],
                apis: [],
                status: 'unknown'
            },
            chat: {
                routes: [],
                components: [],
                apis: [],
                status: 'unknown'
            },
            dashboard: {
                routes: [],
                components: [],
                apis: [],
                status: 'unknown'
            }
        };
        
        this.basePaths = {
            authGateway: 'reconciliation/active-work/auth-gateway',
            dashboard: 'reconciliation/active-work/dashboard',
            adminDashboard: 'reconciliation/active-work/admin-dashboard'
        };
    }

    /**
     * Discover all routes in Next.js applications
     */
    async discoverRoutes() {
        console.log('🔍 Discovering routes...\n');
        
        // Auth Gateway routes
        const authRoutes = await this.scanDirectory(
            `${this.basePaths.authGateway}/src/app`,
            'page.tsx'
        );
        
        // Dashboard routes
        const dashboardRoutes = await this.scanDirectory(
            `${this.basePaths.dashboard}/src/app`,
            'page.tsx'
        );
        
        // Categorize routes
        authRoutes.forEach(route => {
            if (route.includes('login') || route.includes('sign-up') || route.includes('logout')) {
                this.features.authentication.routes.push(route);
            }
        });
        
        dashboardRoutes.forEach(route => {
            if (route.includes('profile')) {
                this.features.student.routes.push(route);
            } else if (route.includes('friends')) {
                this.features.friends.routes.push(route);
            } else if (route.includes('teams') || route.includes('groups')) {
                this.features.teams.routes.push(route);
            } else if (route.includes('chat')) {
                this.features.chat.routes.push(route);
            } else if (route.includes('dashboard') || route === '/') {
                this.features.dashboard.routes.push(route);
            }
        });
        
        return { authRoutes, dashboardRoutes };
    }

    /**
     * Discover React components
     */
    async discoverComponents() {
        console.log('🔍 Discovering components...\n');
        
        const componentPaths = [
            `${this.basePaths.authGateway}/src/components`,
            `${this.basePaths.dashboard}/src/components`
        ];
        
        for (const basePath of componentPaths) {
            if (!fs.existsSync(basePath)) continue;
            
            const components = await this.scanDirectory(basePath, '*.tsx');
            
            components.forEach(comp => {
                const name = path.basename(comp);
                
                if (name.includes('auth') || name.includes('login') || name.includes('signup')) {
                    this.features.authentication.components.push(comp);
                } else if (name.includes('profile') || name.includes('student')) {
                    this.features.student.components.push(comp);
                } else if (name.includes('guardian')) {
                    this.features.guardian.components.push(comp);
                } else if (name.includes('friend')) {
                    this.features.friends.components.push(comp);
                } else if (name.includes('team') || name.includes('group')) {
                    this.features.teams.components.push(comp);
                } else if (name.includes('chat') || name.includes('message')) {
                    this.features.chat.components.push(comp);
                } else if (name.includes('dashboard') || name.includes('sidebar') || name.includes('nav')) {
                    this.features.dashboard.components.push(comp);
                }
            });
        }
    }

    /**
     * Discover API routes and server actions
     */
    async discoverAPIs() {
        console.log('🔍 Discovering APIs and server actions...\n');
        
        // Check for API routes
        const apiPaths = [
            `${this.basePaths.authGateway}/src/app/api`,
            `${this.basePaths.dashboard}/src/app/api`
        ];
        
        for (const apiPath of apiPaths) {
            if (fs.existsSync(apiPath)) {
                const apis = await this.scanDirectory(apiPath, 'route.ts');
                this.categorizeAPIs(apis);
            }
        }
        
        // Check for server actions
        const actionPaths = [
            `${this.basePaths.authGateway}/src/lib/action`,
            `${this.basePaths.dashboard}/src/lib/actions`
        ];
        
        for (const actionPath of actionPaths) {
            if (fs.existsSync(actionPath)) {
                const actions = await this.scanDirectory(actionPath, '*.ts');
                this.categorizeAPIs(actions);
            }
        }
    }

    /**
     * Scan directory for files matching pattern
     */
    async scanDirectory(basePath, pattern) {
        return new Promise((resolve) => {
            if (!fs.existsSync(basePath)) {
                resolve([]);
                return;
            }
            
            glob(`${basePath}/**/${pattern}`, (err, files) => {
                if (err) {
                    console.error(`Error scanning ${basePath}:`, err);
                    resolve([]);
                } else {
                    resolve(files.map(f => f.replace(process.cwd() + '/', '')));
                }
            });
        });
    }

    /**
     * Categorize API endpoints
     */
    categorizeAPIs(apis) {
        apis.forEach(api => {
            const name = path.basename(api);
            
            if (name.includes('auth')) {
                this.features.authentication.apis.push(api);
            } else if (name.includes('student') || name.includes('profile')) {
                this.features.student.apis.push(api);
            } else if (name.includes('friend')) {
                this.features.friends.apis.push(api);
            } else if (name.includes('team')) {
                this.features.teams.apis.push(api);
            } else if (name.includes('chat')) {
                this.features.chat.apis.push(api);
            }
        });
    }

    /**
     * Generate testable features list
     */
    generateTestableFeatures() {
        const testable = {
            authentication: {
                signup: {
                    student: 'Student registration flow',
                    guardian: 'Guardian registration flow',
                    validation: 'Form validation rules',
                    emailVerification: 'Email confirmation process'
                },
                login: {
                    standard: 'Email/password login',
                    redirect: 'Post-login redirect to dashboard',
                    session: 'Session persistence',
                    errors: 'Error handling'
                },
                logout: {
                    standard: 'Logout flow',
                    cleanup: 'Session cleanup',
                    redirect: 'Post-logout redirect'
                },
                password: {
                    reset: 'Password reset flow',
                    requirements: 'Password strength requirements'
                }
            },
            student: {
                profile: {
                    creation: 'Profile creation on signup',
                    editing: 'Profile edit functionality',
                    display: 'Profile display in dashboard',
                    avatar: 'Avatar upload/display'
                },
                school: {
                    search: 'School search functionality',
                    selection: 'School selection',
                    validation: 'School data validation'
                },
                grade: {
                    selection: 'Grade level selection',
                    progression: 'Grade progression logic'
                }
            },
            guardian: {
                registration: {
                    flow: 'Guardian signup flow',
                    studentLink: 'Link to student account',
                    permissions: 'Permission management'
                },
                dashboard: {
                    view: 'Guardian dashboard view',
                    monitoring: 'Student activity monitoring'
                }
            },
            friends: {
                requests: {
                    send: 'Send friend request',
                    receive: 'Receive friend request',
                    accept: 'Accept friend request',
                    reject: 'Reject friend request'
                },
                management: {
                    list: 'View friends list',
                    remove: 'Remove friend',
                    block: 'Block user'
                },
                status: {
                    online: 'Online status display',
                    updates: 'Real-time status updates'
                }
            },
            teams: {
                creation: {
                    create: 'Create new team',
                    settings: 'Team settings',
                    privacy: 'Privacy settings'
                },
                membership: {
                    join: 'Join team',
                    leave: 'Leave team',
                    invite: 'Invite members',
                    roles: 'Member roles'
                },
                communication: {
                    chat: 'Team chat functionality',
                    announcements: 'Team announcements'
                }
            },
            chat: {
                messaging: {
                    send: 'Send message',
                    receive: 'Receive message',
                    typing: 'Typing indicators'
                },
                history: {
                    load: 'Load chat history',
                    pagination: 'Message pagination',
                    search: 'Search messages'
                },
                realtime: {
                    updates: 'Real-time message delivery',
                    presence: 'User presence'
                }
            },
            dashboard: {
                navigation: {
                    menu: 'Navigation menu',
                    routing: 'Page routing',
                    breadcrumbs: 'Breadcrumb navigation'
                },
                widgets: {
                    stats: 'Statistics widgets',
                    activity: 'Activity feed',
                    quickActions: 'Quick action buttons'
                },
                responsiveness: {
                    mobile: 'Mobile view',
                    tablet: 'Tablet view',
                    desktop: 'Desktop view'
                },
                performance: {
                    loadTime: 'Initial load time',
                    navigation: 'Navigation speed',
                    dataFetch: 'Data fetching'
                }
            }
        };
        
        return testable;
    }

    /**
     * Generate report
     */
    async generateReport() {
        console.log('\n📊 Feature Discovery Report\n');
        console.log('=' .repeat(50));
        
        // Discover all features
        await this.discoverRoutes();
        await this.discoverComponents();
        await this.discoverAPIs();
        
        // Generate testable features
        const testable = this.generateTestableFeatures();
        
        // Create report
        const report = {
            timestamp: new Date().toISOString(),
            discovered: this.features,
            testable: testable,
            statistics: {
                totalRoutes: 0,
                totalComponents: 0,
                totalAPIs: 0,
                featuresWithRoutes: 0,
                featuresWithComponents: 0,
                featuresWithAPIs: 0
            }
        };
        
        // Calculate statistics
        Object.values(this.features).forEach(feature => {
            report.statistics.totalRoutes += feature.routes.length;
            report.statistics.totalComponents += feature.components.length;
            report.statistics.totalAPIs += feature.apis.length;
            
            if (feature.routes.length > 0) report.statistics.featuresWithRoutes++;
            if (feature.components.length > 0) report.statistics.featuresWithComponents++;
            if (feature.apis.length > 0) report.statistics.featuresWithAPIs++;
        });
        
        // Print summary
        console.log('\n📈 Discovery Statistics:');
        console.log(`  Routes discovered: ${report.statistics.totalRoutes}`);
        console.log(`  Components discovered: ${report.statistics.totalComponents}`);
        console.log(`  APIs discovered: ${report.statistics.totalAPIs}`);
        
        console.log('\n🎯 Features with implementations:');
        Object.entries(this.features).forEach(([name, feature]) => {
            const hasImpl = feature.routes.length > 0 || 
                          feature.components.length > 0 || 
                          feature.apis.length > 0;
            
            if (hasImpl) {
                console.log(`  ✅ ${name}:`);
                if (feature.routes.length > 0) 
                    console.log(`     - ${feature.routes.length} routes`);
                if (feature.components.length > 0) 
                    console.log(`     - ${feature.components.length} components`);
                if (feature.apis.length > 0) 
                    console.log(`     - ${feature.apis.length} APIs`);
            } else {
                console.log(`  ❌ ${name}: No implementations found`);
            }
        });
        
        // Save report
        const reportPath = 'reconciliation/00133-feature-discovery-report.json';
        fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
        console.log(`\n💾 Full report saved to: ${reportPath}`);
        
        return report;
    }
}

// Run discovery
async function main() {
    const discovery = new FeatureDiscovery();
    const report = await discovery.generateReport();
    
    console.log('\n✅ Feature discovery complete!');
    console.log('\nNext step: Create baseline tests for discovered features');
}

main().catch(console.error);