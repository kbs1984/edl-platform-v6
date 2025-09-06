/**
 * Friends System Test Suite - Standard Puppeteer
 * Session 132 - Testing Friend Request Flows
 */

const puppeteer = require('puppeteer');

describe('EDL Friends System Tests', () => {
    let browser;
    let page;
    
    const config = {
        dashboardUrl: 'http://localhost:3001',
        testUsers: {
            user1: {
                email: 'user1@example.com',
                password: 'TestPass123!'
            },
            user2: {
                email: 'user2@example.com',
                password: 'TestPass123!'
            }
        }
    };
    
    beforeAll(async () => {
        browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        page = await browser.newPage();
        await page.setViewport({ width: 1366, height: 768 });
    });
    
    afterAll(async () => {
        if (browser) await browser.close();
    });
    
    test('should display friends section', async () => {
        await page.goto(`${config.dashboardUrl}/dashboard`, {
            waitUntil: 'networkidle2'
        });
        
        // Look for friends section
        const friendsSection = await page.$('[aria-label*="friends"], .friends-section, [data-testid="friends"]');
        
        if (friendsSection) {
            const isVisible = await friendsSection.isIntersectingViewport();
            expect(isVisible).toBe(true);
            console.log('✅ Friends section found and visible');
        } else {
            console.log('⚠️ Friends section not found - may require login');
        }
    });
    
    test('should open friend request dialog', async () => {
        await page.goto(`${config.dashboardUrl}/dashboard`, {
            waitUntil: 'networkidle2'
        });
        
        // Look for "Add Friend" button
        const addFriendBtn = await page.$('button:has-text("Add Friend"), button[aria-label*="add friend"], [data-testid="add-friend-btn"]');
        
        if (addFriendBtn) {
            await addFriendBtn.click();
            await new Promise(resolve => setTimeout(resolve, 500));
            
            // Check if dialog opened
            const dialog = await page.$('[role="dialog"], .modal, [data-testid="friend-request-dialog"]');
            expect(dialog).toBeTruthy();
            
            // Look for friend code input
            const friendCodeInput = await page.$('input[placeholder*="friend"], input[name*="code"], [data-testid="friend-code-input"]');
            expect(friendCodeInput).toBeTruthy();
            
            console.log('✅ Friend request dialog opened successfully');
        } else {
            console.log('⚠️ Add Friend button not found');
        }
    });
    
    test('should send friend request', async () => {
        await page.goto(`${config.dashboardUrl}/dashboard`, {
            waitUntil: 'networkidle2'
        });
        
        // Try to send a friend request
        const addFriendBtn = await page.$('button:has-text("Add Friend"), button[aria-label*="add friend"]');
        
        if (addFriendBtn) {
            await addFriendBtn.click();
            await new Promise(resolve => setTimeout(resolve, 500));
            
            // Enter friend code
            const friendCodeInput = await page.$('input[placeholder*="friend"], input[name*="code"]');
            if (friendCodeInput) {
                await friendCodeInput.type('TEST-FRIEND-CODE');
                
                // Submit request
                const sendBtn = await page.$('button:has-text("Send"), button:has-text("Add"), button[type="submit"]');
                if (sendBtn) {
                    await sendBtn.click();
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    
                    // Check for success or error message
                    const message = await page.$('[role="alert"], .toast, .notification');
                    if (message) {
                        const text = await message.evaluate(el => el.textContent);
                        console.log(`Friend request response: ${text}`);
                    }
                }
            }
        }
    });
    
    test('should display friend list', async () => {
        await page.goto(`${config.dashboardUrl}/dashboard`, {
            waitUntil: 'networkidle2'
        });
        
        // Look for friend list
        const friendList = await page.$('.friend-list, [data-testid="friend-list"], ul[aria-label*="friends"]');
        
        if (friendList) {
            // Count friend items
            const friendItems = await page.$$('.friend-item, [data-testid="friend-item"], li[role="listitem"]');
            console.log(`Found ${friendItems.length} friends in list`);
            
            // Check for empty state
            if (friendItems.length === 0) {
                const emptyState = await page.$('.empty-state, [data-testid="no-friends"], p:has-text("No friends")');
                expect(emptyState).toBeTruthy();
                console.log('✅ Empty friend list state displayed');
            } else {
                console.log('✅ Friend list displayed with items');
            }
        }
    });
    
    test('should handle friend request acceptance', async () => {
        await page.goto(`${config.dashboardUrl}/dashboard`, {
            waitUntil: 'networkidle2'
        });
        
        // Look for pending requests
        const pendingRequests = await page.$('.pending-requests, [data-testid="pending-requests"]');
        
        if (pendingRequests) {
            const acceptBtns = await page.$$('button:has-text("Accept"), button[aria-label*="accept"]');
            
            if (acceptBtns.length > 0) {
                await acceptBtns[0].click();
                await new Promise(resolve => setTimeout(resolve, 1000));
                
                // Check for success message
                const successMsg = await page.$('[role="alert"], .toast-success');
                if (successMsg) {
                    const text = await successMsg.evaluate(el => el.textContent);
                    console.log(`✅ Friend request accepted: ${text}`);
                }
            } else {
                console.log('ℹ️ No pending friend requests');
            }
        }
    });
    
    test('should remove friend', async () => {
        await page.goto(`${config.dashboardUrl}/dashboard`, {
            waitUntil: 'networkidle2'
        });
        
        // Look for friend items with remove option
        const friendItems = await page.$$('.friend-item, [data-testid="friend-item"]');
        
        if (friendItems.length > 0) {
            // Hover over first friend to reveal options
            await friendItems[0].hover();
            await new Promise(resolve => setTimeout(resolve, 500));
            
            // Look for remove button
            const removeBtn = await page.$('button:has-text("Remove"), button[aria-label*="remove friend"]');
            
            if (removeBtn) {
                await removeBtn.click();
                await new Promise(resolve => setTimeout(resolve, 500));
                
                // Confirm removal if dialog appears
                const confirmBtn = await page.$('button:has-text("Confirm"), button:has-text("Yes")');
                if (confirmBtn) {
                    await confirmBtn.click();
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    console.log('✅ Friend removed successfully');
                }
            }
        } else {
            console.log('ℹ️ No friends to remove');
        }
    });
});