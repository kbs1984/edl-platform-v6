/**
 * Integration Test - Validates New Helper Modules
 * Session 133 - Tests the complete helper infrastructure
 */

const puppeteer = require('puppeteer');
const AuthHelpers = require('./auth-helpers');
const SessionManager = require('./session-manager');
const SupabaseValidator = require('./supabase-validator');
const TestCleanup = require('./test-cleanup');

describe('Helper Module Integration Tests', () => {
    let sessionManager;
    let authHelpers;
    let validator;
    let cleanup;
    let browser;
    let page;
    
    beforeAll(async () => {
        // Initialize all helpers
        sessionManager = new SessionManager();
        authHelpers = new AuthHelpers();
        validator = new SupabaseValidator();
        cleanup = new TestCleanup();
        cleanup.setDryRun(true); // Don't delete real data during tests
        
        // Create a browser session
        browser = await puppeteer.launch({
            headless: process.env.HEADLESS !== 'false',
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        page = await browser.newPage();
    });
    
    afterAll(async () => {
        // Cleanup
        if (browser) {
            await browser.close();
        }
        await sessionManager.cleanupSessions();
    });
    
    describe('AuthHelpers', () => {
        test('should generate unique test users', () => {
            const user1 = authHelpers.generateTestUser();
            const user2 = authHelpers.generateTestUser();
            
            expect(user1.email).toContain('+test_');
            expect(user2.email).toContain('+test_');
            expect(user1.email).not.toBe(user2.email);
            expect(user1.password).toBe('TestPass123!');
        });
        
        test('should have correct configuration', () => {
            expect(authHelpers.config.authUrl).toBe('http://localhost:3000');
            expect(authHelpers.config.dashboardUrl).toBe('http://localhost:3001');
            expect(authHelpers.config.baseEmail).toBe('brian.bumsik.kim@gmail.com');
        });
    });
    
    describe('SessionManager', () => {
        test('should track sessions correctly', async () => {
            const testPage = await sessionManager.createSession('test-user-1');
            
            expect(testPage).toBeDefined();
            expect(sessionManager.hasSession('test-user-1')).toBe(true);
            expect(sessionManager.getSessionCount()).toBe(1);
            
            const info = sessionManager.getSessionInfo('test-user-1');
            expect(info.userId).toBe('test-user-1');
            expect(info.browserConnected).toBe(true);
            
            await sessionManager.closeSession('test-user-1');
            expect(sessionManager.hasSession('test-user-1')).toBe(false);
        });
        
        test('should handle multiple sessions', async () => {
            const sessions = await sessionManager.createMultipleSessions(['user1', 'user2', 'user3']);
            
            expect(sessions.size).toBe(3);
            expect(sessionManager.getSessionCount()).toBe(3);
            expect(sessionManager.getActiveSessions()).toContain('user1');
            expect(sessionManager.getActiveSessions()).toContain('user2');
            expect(sessionManager.getActiveSessions()).toContain('user3');
            
            await sessionManager.cleanupSessions();
            expect(sessionManager.getSessionCount()).toBe(0);
        });
    });
    
    describe('SupabaseValidator', () => {
        test('should connect to Supabase', async () => {
            const count = await validator.countTestUsers();
            expect(count).toBeGreaterThanOrEqual(0);
        });
        
        test('should handle validation functions', async () => {
            // Test that functions exist and return expected types
            const testUsers = await validator.getTestUsers();
            expect(Array.isArray(testUsers)).toBe(true);
            
            const user = await validator.getUserByEmail('nonexistent@example.com');
            expect(user).toBeNull();
        });
        
        test('should support wait for data pattern', async () => {
            // Test the retry mechanism
            let attempts = 0;
            const result = await validator.waitForData(
                async () => {
                    attempts++;
                    return attempts === 3 ? { success: true } : null;
                },
                5,
                10
            );
            
            expect(result).toEqual({ success: true });
            expect(attempts).toBe(3);
        });
    });
    
    describe('TestCleanup', () => {
        test('should gather statistics without deleting', async () => {
            const stats = await cleanup.getTestDataStats();
            
            expect(stats).toHaveProperty('users');
            expect(stats).toHaveProperty('teams');
            expect(stats).toHaveProperty('friendships');
            expect(stats).toHaveProperty('teamMemberships');
            expect(stats).toHaveProperty('activities');
            
            expect(stats.users).toBeGreaterThanOrEqual(0);
        });
        
        test('should respect dry run mode', async () => {
            cleanup.setDryRun(true);
            
            const results = await cleanup.cleanupTestUsers();
            expect(results.users.deleted).toBe(0); // Nothing deleted in dry run
        });
    });
    
    describe('Integration Flow', () => {
        test('should work together for a complete flow', async () => {
            // 1. Generate a test user
            const testUser = authHelpers.generateTestUser();
            expect(testUser.email).toContain('+test_');
            
            // 2. Create a session for this user
            const testPage = await sessionManager.createSession(testUser.email);
            expect(testPage).toBeDefined();
            
            // 3. Check session is tracked
            expect(sessionManager.hasSession(testUser.email)).toBe(true);
            
            // 4. Get test data statistics
            const statsBefore = await cleanup.getTestDataStats();
            expect(statsBefore).toBeDefined();
            
            // 5. Clean up the session
            await sessionManager.closeSession(testUser.email);
            expect(sessionManager.hasSession(testUser.email)).toBe(false);
            
            console.log('✅ Integration flow completed successfully');
        });
    });
});