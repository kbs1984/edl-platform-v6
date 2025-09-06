/**
 * Session Manager for Puppeteer Browser Sessions
 * Session 133 - Managing multiple browser sessions for parallel testing
 * 
 * Handles browser lifecycle and session management for E2E tests
 */

const puppeteer = require('puppeteer');

class SessionManager {
    constructor() {
        this.sessions = new Map();
        this.defaultOptions = {
            headless: process.env.HEADLESS !== 'false', // Default to headless
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-accelerated-2d-canvas',
                '--no-first-run',
                '--no-zygote',
                '--disable-gpu'
            ],
            // Slow down actions for debugging if needed
            slowMo: process.env.SLOW_MO ? parseInt(process.env.SLOW_MO) : 0
        };
    }

    /**
     * Create a new browser session for a user
     * @param {string} userId - Unique identifier for the session
     * @param {Object} options - Optional Puppeteer launch options
     * @returns {Promise<Page>} The page object for the session
     */
    async createSession(userId, options = {}) {
        // Don't create duplicate sessions
        if (this.sessions.has(userId)) {
            console.warn(`Session already exists for user ${userId}`);
            return this.sessions.get(userId).page;
        }

        console.log(`Creating browser session for user: ${userId}`);
        
        // Merge options with defaults
        const launchOptions = { ...this.defaultOptions, ...options };
        
        try {
            const browser = await puppeteer.launch(launchOptions);
            const page = await browser.newPage();
            
            // Set viewport for consistent testing
            await page.setViewport({
                width: 1366,
                height: 768,
                deviceScaleFactor: 1
            });
            
            // Store session
            this.sessions.set(userId, { 
                browser, 
                page,
                createdAt: Date.now()
            });
            
            console.log(`Session created for user: ${userId}`);
            return page;
        } catch (error) {
            console.error(`Failed to create session for ${userId}:`, error);
            throw error;
        }
    }

    /**
     * Get an existing session
     * @param {string} userId - User identifier
     * @returns {Page|null} The page object or null if not found
     */
    async getSession(userId) {
        const session = this.sessions.get(userId);
        return session ? session.page : null;
    }

    /**
     * Get browser instance for a session
     * @param {string} userId - User identifier
     * @returns {Browser|null} The browser object or null if not found
     */
    getBrowser(userId) {
        const session = this.sessions.get(userId);
        return session ? session.browser : null;
    }

    /**
     * Close a specific session
     * @param {string} userId - User identifier
     * @returns {Promise<boolean>} True if closed successfully
     */
    async closeSession(userId) {
        const session = this.sessions.get(userId);
        
        if (!session) {
            console.warn(`No session found for user ${userId}`);
            return false;
        }
        
        try {
            console.log(`Closing session for user: ${userId}`);
            await session.browser.close();
            this.sessions.delete(userId);
            return true;
        } catch (error) {
            console.error(`Error closing session for ${userId}:`, error);
            return false;
        }
    }

    /**
     * Close all active sessions
     * Used for cleanup after test runs
     */
    async cleanupSessions() {
        console.log(`Cleaning up ${this.sessions.size} active sessions`);
        
        const closePromises = [];
        
        for (const [userId, session] of this.sessions) {
            closePromises.push(
                session.browser.close()
                    .then(() => console.log(`Closed session for ${userId}`))
                    .catch(err => console.error(`Error closing session for ${userId}:`, err))
            );
        }
        
        await Promise.all(closePromises);
        this.sessions.clear();
        
        console.log('All sessions cleaned up');
    }

    /**
     * Get all active session IDs
     * @returns {Array<string>} Array of user IDs with active sessions
     */
    getActiveSessions() {
        return Array.from(this.sessions.keys());
    }

    /**
     * Get session count
     * @returns {number} Number of active sessions
     */
    getSessionCount() {
        return this.sessions.size;
    }

    /**
     * Check if a session exists
     * @param {string} userId - User identifier
     * @returns {boolean} True if session exists
     */
    hasSession(userId) {
        return this.sessions.has(userId);
    }

    /**
     * Get session info
     * @param {string} userId - User identifier
     * @returns {Object|null} Session metadata or null
     */
    getSessionInfo(userId) {
        const session = this.sessions.get(userId);
        
        if (!session) {
            return null;
        }
        
        return {
            userId,
            createdAt: session.createdAt,
            uptime: Date.now() - session.createdAt,
            browserConnected: session.browser.isConnected()
        };
    }

    /**
     * Create multiple sessions for testing scenarios
     * @param {Array<string>} userIds - Array of user identifiers
     * @returns {Promise<Map>} Map of userId to page objects
     */
    async createMultipleSessions(userIds) {
        const sessions = new Map();
        
        for (const userId of userIds) {
            try {
                const page = await this.createSession(userId);
                sessions.set(userId, page);
            } catch (error) {
                console.error(`Failed to create session for ${userId}:`, error);
            }
        }
        
        return sessions;
    }

    /**
     * Take screenshots from all sessions
     * Useful for debugging test failures
     * @param {string} prefix - Prefix for screenshot filenames
     */
    async captureAllScreenshots(prefix = 'screenshot') {
        const timestamp = Date.now();
        const screenshots = [];
        
        for (const [userId, session] of this.sessions) {
            const filename = `/tmp/${prefix}_${userId}_${timestamp}.png`;
            
            try {
                await session.page.screenshot({ 
                    path: filename,
                    fullPage: true 
                });
                
                screenshots.push({
                    userId,
                    filename,
                    success: true
                });
                
                console.log(`Screenshot saved: ${filename}`);
            } catch (error) {
                console.error(`Failed to capture screenshot for ${userId}:`, error);
                screenshots.push({
                    userId,
                    filename,
                    success: false,
                    error: error.message
                });
            }
        }
        
        return screenshots;
    }

    /**
     * Reset all sessions by closing and recreating them
     * Useful between test suites
     */
    async resetAllSessions() {
        const userIds = this.getActiveSessions();
        
        // Close all
        await this.cleanupSessions();
        
        // Recreate
        for (const userId of userIds) {
            await this.createSession(userId);
        }
        
        console.log(`Reset ${userIds.length} sessions`);
    }
}

module.exports = SessionManager;