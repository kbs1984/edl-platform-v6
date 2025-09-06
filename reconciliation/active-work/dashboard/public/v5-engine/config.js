// V5 Engine Configuration - SACRED VALUES (DO NOT CHANGE)
// Session 148: Extracted from v5 analysis - these are calibrated for addiction

window.V5_CONFIG = {
  // Animation Timings (milliseconds) - Choreographed for dopamine
  animations: {
    slideDown: 500,      // Bar entrance animation
    scaleIncrement: 200, // Today counter bump effect  
    countUpEmcoin: 1800, // EmCoin counting animation
    countUpStreak: 1500, // Streak counting animation
    celebration: 3000,   // Milestone celebration duration
    shame: 2000,        // Broken streak shame duration
    shake: 500,         // Error feedback shake
    glow: 2000,         // Today counter glow cycle
    flicker: 1500       // Streak fire flicker cycle
  },
  
  // EmCoin Reward Values - Calibrated for engagement
  rewards: {
    dailyLogin: 10,      // Base daily bonus
    winDebate: 50,       // Victory reward
    dailyStreak: (streak) => Math.min(streak * 5, 50), // Capped multiplier
    achievementBase: 25, // Base achievement reward
    variableChance: 0.15, // 15% chance for bonus
    variableMultiplier: { min: 1.5, max: 3.0 } // Bonus range
  },
  
  // State Transitions
  states: {
    GREY: 'grey',
    PENDING: 'pending', 
    ACTIVE: 'active',
    SUSPENDED: 'suspended',
    INACTIVE: 'inactive'
  },
  
  // Sacred Limits
  limits: {
    maxLinkedPlayers: 6,  // Quality supervision limit
    streakRiskHours: 24,  // Hours before streak at risk
    inactiveDays: 90      // Days before marked inactive
  },
  
  // Display Configuration
  display: {
    updateInterval: 60000,     // Refresh data every minute
    localStoragePrefix: 'v5_', // Cache prefix
    countUpDuration: 1800,     // Match EmCoin animation
    decimalPlaces: 0           // Whole numbers only
  },
  
  // Milestone Definitions (for celebrations)
  milestones: {
    streak: [3, 7, 14, 30, 60, 100, 365],
    emcoins: [100, 500, 1000, 5000, 10000],
    visitors: [10, 50, 100, 500, 1000]
  }
};

// Freeze config to prevent accidental changes
Object.freeze(window.V5_CONFIG);
Object.freeze(window.V5_CONFIG.animations);
Object.freeze(window.V5_CONFIG.rewards);
Object.freeze(window.V5_CONFIG.states);
Object.freeze(window.V5_CONFIG.limits);
Object.freeze(window.V5_CONFIG.display);
Object.freeze(window.V5_CONFIG.milestones);