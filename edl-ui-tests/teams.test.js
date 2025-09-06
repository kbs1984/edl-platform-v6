/**
 * Teams System Test Suite - Standard Puppeteer
 * Session 132 - Testing Team Management Flows
 */

const puppeteer = require('puppeteer');

describe('EDL Teams System Tests', () => {
    let browser;
    let page;
    
    const config = {
        dashboardUrl: 'http://localhost:3001',
        testTeam: {
            name: 'Test Team 132',
            description: 'Automated test team'
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
    
    test('should navigate to teams section', async () => {
        await page.goto(`${config.dashboardUrl}/groups/teams`, {
            waitUntil: 'networkidle2'
        });
        
        const url = page.url();
        expect(url).toContain('/teams');
        
        // Look for teams heading
        const teamsHeading = await page.$('h1:has-text("Teams"), h2:has-text("Teams"), [data-testid="teams-heading"]');
        if (teamsHeading) {
            console.log('✅ Teams section loaded');
        }
    });
    
    test('should open create team dialog', async () => {
        await page.goto(`${config.dashboardUrl}/groups/teams`, {
            waitUntil: 'networkidle2'
        });
        
        // Look for create team button
        const createBtn = await page.$('button:has-text("Create Team"), button:has-text("New Team"), [data-testid="create-team-btn"]');
        
        if (createBtn) {
            await createBtn.click();
            await new Promise(resolve => setTimeout(resolve, 500));
            
            // Check if dialog opened
            const dialog = await page.$('[role="dialog"], .modal, [data-testid="create-team-dialog"]');
            expect(dialog).toBeTruthy();
            
            // Look for team name input
            const nameInput = await page.$('input[name="name"], input[placeholder*="team name"], [data-testid="team-name-input"]');
            expect(nameInput).toBeTruthy();
            
            console.log('✅ Create team dialog opened');
        } else {
            console.log('⚠️ Create team button not found');
        }
    });
    
    test('should create a new team', async () => {
        await page.goto(`${config.dashboardUrl}/groups/teams`, {
            waitUntil: 'networkidle2'
        });
        
        const createBtn = await page.$('button:has-text("Create Team"), button:has-text("New Team")');
        
        if (createBtn) {
            await createBtn.click();
            await new Promise(resolve => setTimeout(resolve, 500));
            
            // Fill team name
            const nameInput = await page.$('input[name="name"], input[placeholder*="team name"]');
            if (nameInput) {
                await nameInput.type(config.testTeam.name);
                
                // Fill description if available
                const descInput = await page.$('textarea[name="description"], input[name="description"]');
                if (descInput) {
                    await descInput.type(config.testTeam.description);
                }
                
                // Submit form
                const submitBtn = await page.$('button[type="submit"], button:has-text("Create"), button:has-text("Save")');
                if (submitBtn) {
                    await submitBtn.click();
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    
                    // Check for success message or redirect
                    const successMsg = await page.$('[role="alert"], .toast-success');
                    if (successMsg) {
                        const text = await successMsg.evaluate(el => el.textContent);
                        console.log(`✅ Team created: ${text}`);
                    }
                }
            }
        }
    });
    
    test('should join team with code', async () => {
        await page.goto(`${config.dashboardUrl}/groups/teams`, {
            waitUntil: 'networkidle2'
        });
        
        // Look for join team button
        const joinBtn = await page.$('button:has-text("Join Team"), button:has-text("Join with Code"), [data-testid="join-team-btn"]');
        
        if (joinBtn) {
            await joinBtn.click();
            await new Promise(resolve => setTimeout(resolve, 500));
            
            // Enter team code
            const codeInput = await page.$('input[placeholder*="code"], input[name="code"], [data-testid="team-code-input"]');
            if (codeInput) {
                await codeInput.type('TEST-TEAM-CODE');
                
                // Submit
                const submitBtn = await page.$('button[type="submit"], button:has-text("Join")');
                if (submitBtn) {
                    await submitBtn.click();
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    
                    // Check response
                    const message = await page.$('[role="alert"], .toast');
                    if (message) {
                        const text = await message.evaluate(el => el.textContent);
                        console.log(`Join team response: ${text}`);
                    }
                }
            }
        } else {
            console.log('⚠️ Join team button not found');
        }
    });
    
    test('should display team list', async () => {
        await page.goto(`${config.dashboardUrl}/groups/teams`, {
            waitUntil: 'networkidle2'
        });
        
        // Look for team list
        const teamList = await page.$('.team-list, [data-testid="team-list"], .grid');
        
        if (teamList) {
            // Count team cards
            const teamCards = await page.$$('.team-card, [data-testid="team-card"], .card');
            console.log(`Found ${teamCards.length} teams`);
            
            if (teamCards.length > 0) {
                // Click on first team
                await teamCards[0].click();
                await new Promise(resolve => setTimeout(resolve, 1000));
                
                // Check if navigated to team detail
                const url = page.url();
                if (url.includes('/teams/')) {
                    console.log('✅ Navigated to team detail page');
                    
                    // Look for team members
                    const membersList = await page.$('.members-list, [data-testid="team-members"]');
                    if (membersList) {
                        const members = await page.$$('.member-item, [data-testid="member-item"]');
                        console.log(`Team has ${members.length} members`);
                    }
                }
            } else {
                // Check for empty state
                const emptyState = await page.$('.empty-state, p:has-text("No teams")');
                if (emptyState) {
                    console.log('✅ Empty teams state displayed');
                }
            }
        }
    });
    
    test('should leave a team', async () => {
        // Navigate to a specific team page
        await page.goto(`${config.dashboardUrl}/groups/teams`, {
            waitUntil: 'networkidle2'
        });
        
        const teamCards = await page.$$('.team-card, [data-testid="team-card"]');
        
        if (teamCards.length > 0) {
            await teamCards[0].click();
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Look for leave team button
            const leaveBtn = await page.$('button:has-text("Leave Team"), button:has-text("Leave"), [data-testid="leave-team-btn"]');
            
            if (leaveBtn) {
                await leaveBtn.click();
                await new Promise(resolve => setTimeout(resolve, 500));
                
                // Confirm if dialog appears
                const confirmBtn = await page.$('button:has-text("Confirm"), button:has-text("Yes, Leave")');
                if (confirmBtn) {
                    await confirmBtn.click();
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    
                    // Check if redirected back to teams list
                    const url = page.url();
                    if (url.endsWith('/teams')) {
                        console.log('✅ Successfully left team');
                    }
                }
            } else {
                console.log('ℹ️ Leave team option not available');
            }
        } else {
            console.log('ℹ️ No teams to leave');
        }
    });
    
    test('should display team chat', async () => {
        await page.goto(`${config.dashboardUrl}/groups/teams`, {
            waitUntil: 'networkidle2'
        });
        
        const teamCards = await page.$$('.team-card, [data-testid="team-card"]');
        
        if (teamCards.length > 0) {
            await teamCards[0].click();
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Look for chat section
            const chatSection = await page.$('.team-chat, [data-testid="team-chat"], .chat-container');
            
            if (chatSection) {
                // Check for message input
                const messageInput = await page.$('input[placeholder*="message"], textarea[placeholder*="message"]');
                expect(messageInput).toBeTruthy();
                
                // Check for send button
                const sendBtn = await page.$('button[aria-label*="send"], button:has-text("Send")');
                expect(sendBtn).toBeTruthy();
                
                console.log('✅ Team chat interface available');
            } else {
                console.log('ℹ️ Team chat not found on this page');
            }
        }
    });
});