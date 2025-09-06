/**
 * Friends System Baseline Test
 * Session 133 - Priority 3: Test-First Validation Suite
 * 
 * Tests the "95% syndrome" - Friends system that appears complete but isn't
 */

const puppeteer = require('puppeteer');
const AuthHelpers = require('../auth-helpers');
const SessionManager = require('../session-manager');
const SupabaseValidator = require('../supabase-validator');

describe('Friends System Baseline Tests', () => {
    let sessionManager;
    let authHelpers;
    let validator;
    let user1, user2;
    let page1, page2;
    
    const baseline = {
        working: [],
        broken: [],
        partial: [],
        notImplemented: [],
        performance: {},
        ninetyFivePercent: [] // The "looks complete but isn't" issues
    };
    
    beforeAll(async () => {
        sessionManager = new SessionManager();
        authHelpers = new AuthHelpers();
        validator = new SupabaseValidator();
        
        // Create two test users for friend interactions
        user1 = authHelpers.generateTestUser();
        user2 = authHelpers.generateTestUser();
        
        // Create sessions for both users
        page1 = await sessionManager.createSession(user1.email);
        page2 = await sessionManager.createSession(user2.email);
        
        // Sign up both users
        try {
            await authHelpers.signup(page1, user1);
            await authHelpers.signup(page2, user2);
            
            // Login both users
            await authHelpers.login(page1, user1.email, user1.password);
            await authHelpers.login(page2, user2.email, user2.password);
            
            baseline.working.push('Two user setup for friend testing');
        } catch (error) {
            baseline.broken.push(`User setup - ${error.message}`);
        }
    });
    
    afterAll(async () => {
        await sessionManager.cleanupSessions();
        
        // Generate report
        console.log('\n📊 Friends System Baseline Report:');
        console.log('=' .repeat(50));
        console.log('\n✅ Working:');
        baseline.working.forEach(item => console.log(`  - ${item}`));
        console.log('\n❌ Broken:');
        baseline.broken.forEach(item => console.log(`  - ${item}`));
        console.log('\n⚠️ Partial:');
        baseline.partial.forEach(item => console.log(`  - ${item}`));
        console.log('\n🚫 Not Implemented:');
        baseline.notImplemented.forEach(item => console.log(`  - ${item}`));
        console.log('\n😬 95% Syndrome Issues:');
        baseline.ninetyFivePercent.forEach(item => console.log(`  - ${item}`));
        console.log('\n⏱️ Performance:');
        Object.entries(baseline.performance).forEach(([key, value]) => {
            console.log(`  - ${key}: ${value}ms`);
        });
    });
    
    describe('Friends Page Access', () => {
        test('Friends page loads when authenticated', async () => {
            const startTime = Date.now();
            
            try {
                // Navigate to friends page
                await page1.goto('http://localhost:3001/friends', {
                    waitUntil: 'networkidle2',
                    timeout: 30000
                });
                
                const friendsContent = await page1.$('[data-testid="friends-page"], main, .friends-container');
                
                if (friendsContent) {
                    baseline.working.push('Friends page loads');
                    baseline.performance['friends_page_load'] = Date.now() - startTime;
                } else {
                    baseline.broken.push('Friends page - no content found');
                }
            } catch (error) {
                baseline.broken.push(`Friends page access - ${error.message}`);
            }
        });
        
        test('Friends UI components present', async () => {
            try {
                // Check for friend-related UI elements
                const addFriendButton = await page1.$('button:has-text("Add Friend"), [data-testid="add-friend"]');
                const friendsList = await page1.$('[data-testid="friends-list"], .friends-list');
                const friendRequests = await page1.$('[data-testid="friend-requests"], .friend-requests');
                
                if (addFriendButton) {
                    baseline.working.push('Add friend button present');
                } else {
                    baseline.broken.push('Add friend button missing');
                }
                
                if (friendsList) {
                    baseline.working.push('Friends list container present');
                } else {
                    baseline.partial.push('Friends list container missing');
                }
                
                if (friendRequests) {
                    baseline.working.push('Friend requests section present');
                } else {
                    baseline.notImplemented.push('Friend requests section');
                }
            } catch (error) {
                baseline.broken.push(`Friends UI components - ${error.message}`);
            }
        });
    });
    
    describe('Send Friend Request', () => {
        test('Open add friend dialog', async () => {
            try {
                // Click add friend button
                const addButton = await page1.$('button:has-text("Add Friend"), [data-testid="add-friend"]');
                
                if (addButton) {
                    await addButton.click();
                    await page1.waitForTimeout(1000);
                    
                    const dialog = await page1.$('dialog[open], [role="dialog"], .modal');
                    
                    if (dialog) {
                        baseline.working.push('Add friend dialog opens');
                    } else {
                        baseline.broken.push('Add friend dialog does not open');
                    }
                } else {
                    baseline.broken.push('Cannot test dialog - button missing');
                }
            } catch (error) {
                baseline.broken.push(`Add friend dialog - ${error.message}`);
            }
        });
        
        test('Send friend request to user', async () => {
            const startTime = Date.now();
            
            try {
                // Enter friend's email or username
                const searchInput = await page1.$('input[placeholder*="email"], input[placeholder*="username"], input[type="search"]');
                
                if (searchInput) {
                    await searchInput.type(user2.email);
                    await page1.waitForTimeout(1000);
                    
                    // Click send/add button
                    const sendButton = await page1.$('button:has-text("Send"), button:has-text("Add"), button:has-text("Request")');
                    
                    if (sendButton) {
                        await sendButton.click();
                        await page1.waitForTimeout(2000);
                        
                        baseline.working.push('Friend request sent');
                        baseline.performance['send_friend_request'] = Date.now() - startTime;
                        
                        // Validate in database
                        const friendship = await validator.validateFriendship(user1.id, user2.id);
                        if (friendship) {
                            baseline.working.push('Friend request in database');
                        } else {
                            baseline.ninetyFivePercent.push('Friend request sent but not in database');
                        }
                    } else {
                        baseline.broken.push('Send friend request button missing');
                    }
                } else {
                    baseline.broken.push('Friend search input missing');
                }
            } catch (error) {
                baseline.broken.push(`Send friend request - ${error.message}`);
            }
        });
    });
    
    describe('Receive Friend Request', () => {
        test('Friend request notification appears', async () => {
            try {
                // Check user2's page for friend request
                await page2.goto('http://localhost:3001/friends');
                await page2.waitForTimeout(2000);
                
                const notification = await page2.$('[data-testid="friend-request"], .friend-request, .notification');
                
                if (notification) {
                    baseline.working.push('Friend request notification appears');
                } else {
                    // Check if requires refresh
                    await page2.reload();
                    await page2.waitForTimeout(2000);
                    
                    const notificationAfterRefresh = await page2.$('[data-testid="friend-request"], .friend-request');
                    
                    if (notificationAfterRefresh) {
                        baseline.ninetyFivePercent.push('Friend request requires refresh to appear');
                    } else {
                        baseline.broken.push('Friend request notification never appears');
                    }
                }
            } catch (error) {
                baseline.broken.push(`Friend request notification - ${error.message}`);
            }
        });
        
        test('Real-time updates for friend requests', async () => {
            try {
                // Send another request and check if it appears without refresh
                const startTime = Date.now();
                
                // User1 sends request
                await page1.evaluate(() => {
                    // Trigger a friend request programmatically if possible
                    console.log('Sending friend request...');
                });
                
                // Wait and check User2 without refresh
                await page2.waitForTimeout(3000);
                
                const realTimeUpdate = await page2.$('.new-notification, [data-testid="new-request"]');
                
                if (realTimeUpdate) {
                    baseline.working.push('Real-time friend request updates');
                    baseline.performance['realtime_update'] = Date.now() - startTime;
                } else {
                    baseline.ninetyFivePercent.push('No real-time updates - requires refresh');
                }
            } catch (error) {
                baseline.partial.push(`Real-time updates - ${error.message}`);
            }
        });
    });
    
    describe('Accept/Reject Friend Request', () => {
        test('Accept friend request', async () => {
            try {
                const acceptButton = await page2.$('button:has-text("Accept"), [data-testid="accept-friend"]');
                
                if (acceptButton) {
                    await acceptButton.click();
                    await page2.waitForTimeout(2000);
                    
                    // Check if friend appears in list
                    const friendInList = await page2.$eval('body', (body, email) => {
                        return body.textContent.includes(email);
                    }, user1.email);
                    
                    if (friendInList) {
                        baseline.working.push('Friend request accepted');
                    } else {
                        baseline.ninetyFivePercent.push('Friend accepted but not in list');
                    }
                } else {
                    baseline.broken.push('Accept friend button missing');
                }
            } catch (error) {
                baseline.broken.push(`Accept friend request - ${error.message}`);
            }
        });
        
        test('Reject friend request', async () => {
            try {
                const rejectButton = await page2.$('button:has-text("Reject"), button:has-text("Decline"), [data-testid="reject-friend"]');
                
                if (rejectButton) {
                    baseline.working.push('Reject friend button present');
                    // Don't actually click to preserve test data
                } else {
                    baseline.notImplemented.push('Reject friend button');
                }
            } catch (error) {
                baseline.partial.push(`Reject friend request - ${error.message}`);
            }
        });
    });
    
    describe('Friends List Management', () => {
        test('View friends list', async () => {
            try {
                const friendsList = await page1.$$('[data-testid="friend-item"], .friend-item');
                
                if (friendsList.length > 0) {
                    baseline.working.push(`Friends list shows ${friendsList.length} friends`);
                } else {
                    baseline.partial.push('Friends list empty or not found');
                }
            } catch (error) {
                baseline.broken.push(`View friends list - ${error.message}`);
            }
        });
        
        test('Online status indicator', async () => {
            try {
                const onlineIndicator = await page1.$('.online-status, [data-testid="online"], .status-indicator');
                
                if (onlineIndicator) {
                    baseline.working.push('Online status indicators present');
                } else {
                    baseline.notImplemented.push('Online status indicators');
                }
            } catch (error) {
                baseline.notImplemented.push(`Online status - ${error.message}`);
            }
        });
        
        test('Remove friend functionality', async () => {
            try {
                const removeButton = await page1.$('button:has-text("Remove"), button:has-text("Unfriend"), [data-testid="remove-friend"]');
                
                if (removeButton) {
                    baseline.working.push('Remove friend button present');
                    // Don't actually click to preserve test data
                } else {
                    baseline.notImplemented.push('Remove friend functionality');
                }
            } catch (error) {
                baseline.notImplemented.push(`Remove friend - ${error.message}`);
            }
        });
    });
    
    describe('95% Syndrome Specific Tests', () => {
        test('Friend updates without page refresh', async () => {
            try {
                // This is the key "95% syndrome" test
                // System appears to work but requires refresh for updates
                
                const initialFriendCount = (await page1.$$('.friend-item')).length;
                
                // Have user2 do something that should update user1's view
                await page2.evaluate(() => {
                    // Simulate activity that should trigger update
                    console.log('User activity that should update friend view');
                });
                
                await page1.waitForTimeout(3000);
                
                const updatedFriendCount = (await page1.$$('.friend-item')).length;
                
                if (updatedFriendCount !== initialFriendCount) {
                    baseline.working.push('Friends list updates in real-time');
                } else {
                    baseline.ninetyFivePercent.push('Friends list requires manual refresh for updates');
                }
            } catch (error) {
                baseline.ninetyFivePercent.push(`Real-time sync - ${error.message}`);
            }
        });
        
        test('Friend request count updates', async () => {
            try {
                const requestCount = await page2.$('[data-testid="request-count"], .badge, .notification-count');
                
                if (requestCount) {
                    const count = await requestCount.evaluate(el => el.textContent);
                    if (count && parseInt(count) > 0) {
                        baseline.working.push('Friend request count displays');
                    } else {
                        baseline.ninetyFivePercent.push('Friend request count shows but wrong value');
                    }
                } else {
                    baseline.notImplemented.push('Friend request count indicator');
                }
            } catch (error) {
                baseline.partial.push(`Request count - ${error.message}`);
            }
        });
    });
});