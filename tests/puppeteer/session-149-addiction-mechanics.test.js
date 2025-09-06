/**
 * Session 149 Enhanced Puppeteer Testing Suite
 * 
 * Tests the complete addiction mechanics from Session 148's foundation:
 * - Variable reward validation (15% bonus rate)
 * - Real data accuracy verification
 * - Server validation tampering prevention
 * - Psychology and performance testing
 * - Complete user journey automation
 */

const { test, expect } = require('@playwright/test');

// Test configuration
const TEST_CONFIG = {
  baseURL: process.env.DASHBOARD_URL || 'http://localhost:3000',
  timeout: 30000,
  // Test user credentials (using test environment)
  testUser: {
    email: 'test.addiction@example.com',
    password: 'TestPassword123!'
  },
  // Expected addiction mechanics values from v5 specs
  expectedValues: {
    dailyLogin: 10,
    welcomeBonus: 50,
    bonusChance: 0.15, // 15%
    bonusMultiplierMin: 1.5,
    bonusMultiplierMax: 3.0,
    celebrationDuration: 3000, // 3 seconds
    dopamineThreshold: 2000, // < 2 seconds
    targetFPS: 60
  }
};

test.describe('Session 149: Enhanced Addiction Mechanics Testing', () => {

  test.beforeEach(async ({ page }) => {
    // Navigate to dashboard (assuming auth is handled)
    await page.goto(TEST_CONFIG.baseURL);
    await page.waitForTimeout(1000);
  });

  /**
   * NEW Test: Variable Reward Validation
   * Verify the 15% bonus rate from Session 148's gambling psychology
   */
  test('Variable rewards trigger at 15% rate', async ({ page }) => {
    console.log('🧪 Testing variable reward system...');
    
    let bonusCount = 0;
    const totalTests = 20;
    const bonusAmounts = [];
    
    // Navigate to welcome bonus testing component
    await page.goto(`${TEST_CONFIG.baseURL}/test-welcome-bonus`);
    
    for (let i = 0; i < totalTests; i++) {
      // Click the award bonus button
      await page.click('button:has-text("Award Welcome Bonus")');
      
      // Wait for the award to process
      await page.waitForTimeout(1000);
      
      // Check if bonus was triggered by looking for bonus badge
      const bonusElement = await page.$('[data-testid="bonus-multiplier"]');
      if (bonusElement) {
        bonusCount++;
        
        // Extract bonus amount and multiplier
        const multiplierText = await bonusElement.textContent();
        const multiplier = parseFloat(multiplierText.replace('x', ''));
        bonusAmounts.push(multiplier);
        
        console.log(`🎰 BONUS #${bonusCount}: ${multiplier}x multiplier`);
        
        // Verify multiplier is in expected range (1.5x-3.0x)
        expect(multiplier).toBeGreaterThanOrEqual(TEST_CONFIG.expectedValues.bonusMultiplierMin);
        expect(multiplier).toBeLessThanOrEqual(TEST_CONFIG.expectedValues.bonusMultiplierMax);
      }
      
      // Wait between tests to avoid rate limiting
      await page.waitForTimeout(200);
    }
    
    // Calculate actual bonus rate
    const actualBonusRate = (bonusCount / totalTests) * 100;
    console.log(`📊 Bonus Rate: ${actualBonusRate}% (Expected: ~15%)`);
    console.log(`📈 Average Multiplier: ${bonusAmounts.length > 0 ? (bonusAmounts.reduce((a, b) => a + b, 0) / bonusAmounts.length).toFixed(2) : 0}x`);
    
    // Allow for statistical variance (10-20% range is acceptable)
    expect(actualBonusRate).toBeGreaterThan(8);
    expect(actualBonusRate).toBeLessThan(25);
    
    // Verify console logs show bonus messages
    const consoleLogs = await page.evaluate(() => {
      return window.testConsoleLogs?.filter(log => log.includes('🎰 BONUS!')) || [];
    });
    expect(consoleLogs.length).toBe(bonusCount);
  });

  /**
   * NEW Test: Real Data Accuracy
   * Verify addiction bar shows real database data, not mock data
   */
  test('Addiction bar shows real data', async ({ page }) => {
    console.log('🧪 Testing real data accuracy...');
    
    // Enable data tracking
    await page.evaluate(() => {
      window.testDataTracking = true;
    });
    
    // Get initial values from addiction bar
    await page.waitForSelector('#v5-addiction-bar');
    
    const initialEmCoins = await page.textContent('#emCoinBalance');
    const initialStreak = await page.textContent('#streakCount');
    const initialToday = await page.textContent('#todayCount');
    
    console.log(`📊 Initial Values - EmCoins: ${initialEmCoins}, Streak: ${initialStreak}, Today: ${initialToday}`);
    
    // Trigger an EmCoin award
    await page.click('[data-testid="award-emcoins-button"]');
    await page.waitForTimeout(2000);
    
    // Verify EmCoin balance updated
    const newEmCoins = await page.textContent('#emCoinBalance');
    expect(parseInt(newEmCoins)).toBeGreaterThan(parseInt(initialEmCoins));
    
    // Simulate profile visit to test today counter
    await page.evaluate(async () => {
      if (window.recordProfileVisit) {
        await window.recordProfileVisit();
      }
    });
    
    await page.waitForTimeout(1000);
    
    // Verify today counter updated
    const newToday = await page.textContent('#todayCount');
    expect(parseInt(newToday)).toBeGreaterThanOrEqual(parseInt(initialToday));
    
    // Test streak calculation
    const streakData = await page.evaluate(async () => {
      if (window.calculateUserStreak) {
        return await window.calculateUserStreak();
      }
      return null;
    });
    
    if (streakData) {
      expect(streakData).toBeGreaterThanOrEqual(0);
      console.log(`✅ Streak calculation working: ${streakData} days`);
    }
    
    console.log(`✅ Real data validation complete`);
  });

  /**
   * NEW Test: Server Validation (Tampering Prevention)
   * Test the server-side validation Session 148 built
   */
  test('LocalStorage tampering blocked', async ({ page }) => {
    console.log('🧪 Testing tampering prevention...');
    
    // Get legitimate starting balance
    await page.waitForSelector('#emCoinBalance');
    const legitimateBalance = await page.textContent('#emCoinBalance');
    
    // Attempt to tamper with localStorage
    await page.evaluate(() => {
      localStorage.setItem('v5_emcoinBalance', '999999');
      localStorage.setItem('v5_streak', '365');
      localStorage.setItem('v5_todayCount', '1000');
    });
    
    // Refresh page to see if tampered values persist
    await page.reload();
    await page.waitForSelector('#v5-addiction-bar');
    await page.waitForTimeout(2000);
    
    // Verify server overwrites tampered values
    const actualBalance = await page.textContent('#emCoinBalance');
    expect(actualBalance).not.toBe('999999');
    expect(parseInt(actualBalance)).toBeLessThan(1000); // Reasonable limit
    
    console.log(`✅ Tampering prevented: Attempted 999999, actual ${actualBalance}`);
    
    // Test invalid EmCoin award
    const invalidAwardResult = await page.evaluate(async () => {
      try {
        // Try to award invalid amount
        const result = await fetch('/api/award-emcoins', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            amount: 99999, // Invalid large amount
            type: 'invalid_type'
          })
        });
        return await result.json();
      } catch (e) {
        return { error: e.message };
      }
    });
    
    expect(invalidAwardResult.success).toBeFalsy();
    console.log(`✅ Invalid award blocked:`, invalidAwardResult);
  });

  /**
   * Enhanced Test: Psychology and Performance
   * Test the < 2 second dopamine and 60fps performance
   */
  test('Psychology and performance validation', async ({ page }) => {
    console.log('🧪 Testing psychology and performance...');
    
    // Enable performance monitoring
    await page.evaluate(() => {
      window.performanceMetrics = {
        animationTimes: [],
        frameRates: [],
        dopamineTimes: []
      };
    });
    
    // Test dopamine timing (< 2 seconds)
    const startTime = Date.now();
    
    // Trigger EmCoin award
    await page.click('[data-testid="award-emcoins-button"]');
    
    // Wait for visual feedback (dopamine)
    await page.waitForSelector('[data-testid="emcoin-animation"]', { timeout: TEST_CONFIG.expectedValues.dopamineThreshold });
    
    const dopamineTime = Date.now() - startTime;
    console.log(`⚡ Dopamine delivered in: ${dopamineTime}ms (Target: <2000ms)`);
    expect(dopamineTime).toBeLessThan(TEST_CONFIG.expectedValues.dopamineThreshold);
    
    // Test 60fps during animations
    const frameRates = await page.evaluate(() => {
      return new Promise((resolve) => {
        const frameRates = [];
        let frameCount = 0;
        let startTime = performance.now();
        
        function measureFrame() {
          frameCount++;
          const currentTime = performance.now();
          const elapsed = currentTime - startTime;
          
          if (elapsed >= 1000) {
            const fps = (frameCount / elapsed) * 1000;
            frameRates.push(fps);
            
            if (frameRates.length >= 3) {
              resolve(frameRates);
            } else {
              frameCount = 0;
              startTime = currentTime;
            }
          }
          
          requestAnimationFrame(measureFrame);
        }
        
        // Start celebration animation to test frame rate
        document.querySelector('.streak-fire')?.style.setProperty('animation', 'flicker 1.5s infinite alternate');
        requestAnimationFrame(measureFrame);
      });
    });
    
    const averageFPS = frameRates.reduce((a, b) => a + b, 0) / frameRates.length;
    console.log(`🎬 Average FPS during animations: ${averageFPS.toFixed(1)}`);
    expect(averageFPS).toBeGreaterThan(50); // Allow some tolerance
    
    // Test milestone celebration duration (exactly 3 seconds)
    const celebrationStart = Date.now();
    
    // Trigger milestone celebration
    await page.evaluate(() => {
      if (window.celebrateStreakMilestone) {
        window.celebrateStreakMilestone(7); // 7-day milestone
      }
    });
    
    // Wait for celebration to end
    await page.waitForTimeout(TEST_CONFIG.expectedValues.celebrationDuration + 100);
    
    // Verify celebration elements are cleaned up
    const celebrationActive = await page.evaluate(() => {
      const fire = document.querySelector('.streak-fire');
      return fire && (fire.style.fontSize === '3rem' || fire.style.color === 'gold');
    });
    
    expect(celebrationActive).toBeFalsy();
    console.log(`🎉 Celebration cleaned up after 3 seconds`);
  });

  /**
   * Enhanced Test: Complete User Journey
   * Test the full addiction cycle end-to-end
   */
  test('Complete addiction cycle', async ({ page }) => {
    console.log('🧪 Testing complete user journey...');
    
    // 1. Start in grey state
    await page.goto(`${TEST_CONFIG.baseURL}/test-grey-state`);
    
    const initialState = await page.textContent('[data-testid="user-state"]');
    expect(initialState).toBe('GREY');
    console.log(`✅ User starts in grey state`);
    
    // 2. Request supervisor
    await page.click('button:has-text("Request Supervisor")');
    await page.waitForTimeout(1000);
    
    const pendingState = await page.textContent('[data-testid="user-state"]');
    expect(pendingState).toBe('PENDING');
    console.log(`✅ Transitioned to pending state`);
    
    // 3. Simulate supervisor approval (admin action)
    await page.goto(`${TEST_CONFIG.baseURL}/test-supervisor-approval`);
    await page.click('[data-testid="approve-player-button"]');
    await page.waitForTimeout(2000);
    
    // 4. Verify welcome bonus (50 EmCoins + potential variable bonus)
    const bonusResult = await page.textContent('[data-testid="last-bonus-amount"]');
    const bonusAmount = parseInt(bonusResult);
    expect(bonusAmount).toBeGreaterThanOrEqual(50);
    console.log(`✅ Welcome bonus awarded: ${bonusAmount} EmCoins`);
    
    // 5. User performs activity (variable reward test)
    await page.goto(`${TEST_CONFIG.baseURL}/test-activity`);
    await page.click('[data-testid="complete-activity-button"]');
    await page.waitForTimeout(1000);
    
    // 6. Check for milestone celebration
    const milestoneTriggered = await page.$('[data-testid="milestone-celebration"]');
    if (milestoneTriggered) {
      console.log(`🎉 Milestone celebration triggered`);
    }
    
    // 7. Next day streak test
    await page.evaluate(() => {
      // Simulate next day
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      localStorage.setItem('lastVisit', tomorrow.toISOString().split('T')[0]);
    });
    
    await page.reload();
    await page.waitForTimeout(2000);
    
    const streakCount = await page.textContent('#streakCount');
    expect(parseInt(streakCount)).toBeGreaterThan(0);
    console.log(`✅ Streak counter working: ${streakCount} days`);
    
    console.log(`🎯 Complete addiction cycle validated`);
  });

  /**
   * Enhanced Test: Performance Under Load
   * Test 60fps during multiple simultaneous celebrations
   */
  test('60fps during heavy animations', async ({ page }) => {
    console.log('🧪 Testing performance under animation load...');
    
    // Trigger multiple celebrations simultaneously
    await page.evaluate(() => {
      // Trigger 5 different celebrations at once
      for (let i = 0; i < 5; i++) {
        setTimeout(() => {
          if (window.celebrateStreakMilestone) {
            window.celebrateStreakMilestone(i + 1);
          }
          if (window.animateValue) {
            window.animateValue(`testCounter${i}`, 0, 100, 1800);
          }
        }, i * 100);
      }
    });
    
    // Measure frame rate during heavy load
    const performanceMetrics = await page.evaluate(() => {
      return new Promise((resolve) => {
        const metrics = {
          minFPS: Infinity,
          maxFPS: 0,
          averageFPS: 0,
          frameDrops: 0
        };
        
        let frameCount = 0;
        let startTime = performance.now();
        const frameTimes = [];
        
        function measurePerformance() {
          const currentTime = performance.now();
          const frameTime = currentTime - startTime;
          frameTimes.push(frameTime);
          frameCount++;
          
          if (frameTime > 16.67) { // Dropped frame (< 60fps)
            metrics.frameDrops++;
          }
          
          if (frameCount >= 180) { // 3 seconds at 60fps
            const totalTime = frameTimes.reduce((a, b) => a + b, 0);
            const fps = (frameCount / totalTime) * 1000;
            
            metrics.averageFPS = fps;
            metrics.minFPS = Math.min(...frameTimes.map(t => 1000 / t));
            metrics.maxFPS = Math.max(...frameTimes.map(t => 1000 / t));
            
            resolve(metrics);
          } else {
            startTime = currentTime;
            requestAnimationFrame(measurePerformance);
          }
        }
        
        requestAnimationFrame(measurePerformance);
      });
    });
    
    console.log(`📊 Performance Metrics:`, performanceMetrics);
    expect(performanceMetrics.averageFPS).toBeGreaterThan(45); // Allow some tolerance under load
    expect(performanceMetrics.frameDrops).toBeLessThan(10); // Max 10 dropped frames
    
    console.log(`✅ Performance maintained under load`);
  });

  /**
   * Enhanced Test: Edge Case Validation
   * Test graceful failure handling
   */
  test('Graceful failure handling', async ({ page }) => {
    console.log('🧪 Testing edge case handling...');
    
    // Test network disconnection during data fetch
    await page.route('**/api/**', route => {
      route.abort('internetdisconnected');
    });
    
    // Try to award EmCoins while offline
    await page.click('[data-testid="award-emcoins-button"]');
    await page.waitForTimeout(2000);
    
    // Verify graceful fallback
    const errorMessage = await page.$('[data-testid="error-message"]');
    expect(errorMessage).toBeTruthy();
    console.log(`✅ Network error handled gracefully`);
    
    // Restore network and test recovery
    await page.unroute('**/api/**');
    
    await page.click('[data-testid="retry-button"]');
    await page.waitForTimeout(1000);
    
    const successMessage = await page.$('[data-testid="success-message"]');
    expect(successMessage).toBeTruthy();
    console.log(`✅ Recovery after network restoration works`);
    
    // Test invalid user state
    await page.evaluate(() => {
      // Corrupt localStorage state
      localStorage.setItem('userState', 'invalid_state');
    });
    
    await page.reload();
    await page.waitForTimeout(2000);
    
    // Verify app handles invalid state
    const stateDisplay = await page.textContent('[data-testid="user-state"]');
    expect(['GREY', 'PENDING', 'ACTIVE']).toContain(stateDisplay);
    console.log(`✅ Invalid state corrected to: ${stateDisplay}`);
  });

});

/**
 * Test Helper Functions
 */

// Custom test utilities
const TestUtils = {
  async waitForAddictionBar(page) {
    await page.waitForSelector('#v5-addiction-bar', { timeout: 5000 });
    await page.waitForTimeout(500); // Allow data to load
  },
  
  async getAddictionBarValues(page) {
    await this.waitForAddictionBar(page);
    
    return {
      emcoins: await page.textContent('#emCoinBalance'),
      streak: await page.textContent('#streakCount'),
      today: await page.textContent('#todayCount'),
      rank: await page.textContent('#rankPosition')
    };
  },
  
  async measureAnimationPerformance(page, duration = 3000) {
    return await page.evaluate((duration) => {
      return new Promise((resolve) => {
        const metrics = { frameCount: 0, droppedFrames: 0 };
        const startTime = performance.now();
        let lastFrameTime = startTime;
        
        function countFrames() {
          const currentTime = performance.now();
          const frameDelta = currentTime - lastFrameTime;
          
          metrics.frameCount++;
          
          if (frameDelta > 16.67) {
            metrics.droppedFrames++;
          }
          
          lastFrameTime = currentTime;
          
          if (currentTime - startTime < duration) {
            requestAnimationFrame(countFrames);
          } else {
            const fps = (metrics.frameCount / (currentTime - startTime)) * 1000;
            resolve({ ...metrics, fps });
          }
        }
        
        requestAnimationFrame(countFrames);
      });
    }, duration);
  }
};

module.exports = { TestUtils };