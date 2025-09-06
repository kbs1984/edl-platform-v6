// V5 Addiction Bar - The Psychological Anchor
// Session 148: Core addiction mechanics from v5 extraction

(function() {
  'use strict';
  
  // Initialize the V5 Engine
  window.v5Engine = {
    mounted: false,
    data: {
      todayVisitors: 0,
      currentStreak: 0,
      emcoinBalance: 0,
      divisionRank: '--'
    },
    elements: {},
    
    // Initialize the addiction bar
    init: function(options = {}) {
      if (this.mounted) return; // Prevent double mounting
      
      this.mountPoint = options.mountPoint || 'v5-addiction-bar';
      this.config = window.V5_CONFIG || options.config;
      
      // Load cached data immediately for instant display
      this.loadFromCache();
      
      // Create the addiction bar DOM
      this.createAddictionBar();
      
      // Start animations within 2 seconds (dopamine window)
      this.startAnimations();
      
      // Connect to data source
      if (options.supabaseClient) {
        this.supabase = options.supabaseClient;
        this.fetchRealData();
      }
      
      this.mounted = true;
    },
    
    // Create the addiction bar HTML structure - DATA ONLY MODE
    createAddictionBar: function() {
      const mount = document.getElementById(this.mountPoint);
      if (!mount) {
        console.error('[V5] Mount point not found:', this.mountPoint);
        return;
      }
      
      // Since mount point is hidden, we don't render visual elements
      // Just set up data structure for React components to consume
      console.log('[V5] Running in data-only mode - UI handled by React sidebar');
      
      // Store empty element references since we're not rendering
      this.elements = {
        bar: null,
        todayCount: null,
        streakCount: null,
        emcoinBalance: null,
        rankPosition: null,
        todayIcon: null,
        streakIcon: null
      };
      
      // Skip style injection in data-only mode
    },
    
    // Inject the addiction bar styles
    injectStyles: function() {
      if (document.getElementById('v5-addiction-styles')) return;
      
      const style = document.createElement('style');
      style.id = 'v5-addiction-styles';
      style.textContent = `
        /* V5 Addiction Bar Styles */
        .v5-addiction-bar {
          display: flex;
          justify-content: center;
          padding: 1rem 1.5rem;
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          transform: translateY(-100%);
          opacity: 0;
        }
        
        .v5-addiction-bar.v5-visible {
          animation: v5-slideDown 0.5s ease-out forwards;
        }
        
        .v5-addiction-inner {
          display: flex;
          gap: 3rem;
          align-items: center;
        }
        
        .v5-addiction-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        
        .v5-addiction-icon {
          font-size: 2rem;
          display: inline-block;
        }
        
        .v5-addiction-content {
          display: flex;
          flex-direction: column;
        }
        
        .v5-addiction-value {
          font-size: 1.5rem;
          font-weight: bold;
          color: #fff;
          line-height: 1;
        }
        
        .v5-addiction-label {
          font-size: 0.75rem;
          color: rgba(255, 255, 255, 0.7);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        
        /* Animations */
        @keyframes v5-slideDown {
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        
        @keyframes v5-glow {
          from { 
            filter: drop-shadow(0 0 10px rgba(255, 193, 7, 0.5));
          }
          to { 
            filter: drop-shadow(0 0 20px rgba(255, 193, 7, 0.8));
          }
        }
        
        @keyframes v5-flicker {
          0%, 100% { 
            transform: scale(1) rotate(-2deg);
          }
          50% { 
            transform: scale(1.1) rotate(2deg);
          }
        }
        
        @keyframes v5-countUp {
          from { 
            transform: scale(0.8);
            opacity: 0;
          }
          to { 
            transform: scale(1);
            opacity: 1;
          }
        }
        
        @keyframes v5-celebration {
          0% { transform: scale(1); }
          25% { transform: scale(1.3) rotate(5deg); }
          50% { transform: scale(1.2) rotate(-5deg); }
          75% { transform: scale(1.3) rotate(3deg); }
          100% { transform: scale(1); }
        }
        
        /* Active animations */
        .v5-today-counter {
          animation: v5-glow 2s ease-in-out infinite alternate;
        }
        
        .v5-streak-fire {
          animation: v5-flicker 1.5s infinite alternate;
        }
        
        .v5-counting {
          animation: v5-countUp 0.3s ease-out;
        }
        
        .v5-celebrating {
          animation: v5-celebration 0.5s ease-out;
        }
        
        /* Responsive */
        @media (max-width: 768px) {
          .v5-addiction-inner {
            gap: 1.5rem;
          }
          
          .v5-addiction-icon {
            font-size: 1.5rem;
          }
          
          .v5-addiction-value {
            font-size: 1.25rem;
          }
        }
      `;
      document.head.appendChild(style);
    },
    
    // Start the critical animations - DATA ONLY MODE
    startAnimations: function() {
      console.log('[V5] Data initialized:', this.data);
      // In data-only mode, we just log the initial data
      // React components will handle the visual updates
    },
    
    // Animate counting up effect - DATA ONLY MODE
    animateValue: function(elementKey, targetValue) {
      // In data-only mode, we don't animate DOM elements
      // React components handle their own animations
      console.log(`[V5] Data update: ${elementKey} = ${targetValue}`);
    },
    
    // Load data from localStorage for instant display
    loadFromCache: function() {
      const prefix = this.config.display.localStoragePrefix;
      
      this.data = {
        todayVisitors: parseInt(localStorage.getItem(prefix + 'todayVisitors') || '0'),
        currentStreak: parseInt(localStorage.getItem(prefix + 'currentStreak') || '0'),
        emcoinBalance: parseInt(localStorage.getItem(prefix + 'emcoinBalance') || '0'),
        divisionRank: localStorage.getItem(prefix + 'divisionRank') || '--'
      };
    },
    
    // Save data to localStorage
    saveToCache: function() {
      const prefix = this.config.display.localStoragePrefix;
      
      localStorage.setItem(prefix + 'todayVisitors', this.data.todayVisitors);
      localStorage.setItem(prefix + 'currentStreak', this.data.currentStreak);
      localStorage.setItem(prefix + 'emcoinBalance', this.data.emcoinBalance);
      localStorage.setItem(prefix + 'divisionRank', this.data.divisionRank);
    },
    
    // Update display with new data
    updateDisplay: function(data) {
      const oldData = {...this.data};
      this.data = {...this.data, ...data};
      
      // Check for milestones
      this.checkMilestones(oldData, this.data);
      
      // Update data (React components will read from this.data)
      console.log('[V5] Data updated:', this.data);
      
      // Save to cache
      this.saveToCache();
    },
    
    // Check for milestone celebrations
    checkMilestones: function(oldData, newData) {
      const milestones = this.config.milestones;
      
      // Check streak milestones
      for (const milestone of milestones.streak) {
        if (oldData.currentStreak < milestone && newData.currentStreak >= milestone) {
          this.celebrate('streak', milestone);
          break;
        }
      }
      
      // Check EmCoin milestones
      for (const milestone of milestones.emcoins) {
        if (oldData.emcoinBalance < milestone && newData.emcoinBalance >= milestone) {
          this.celebrate('emcoins', milestone);
          break;
        }
      }
    },
    
    // Trigger celebration animation
    celebrate: function(type, value) {
      const icon = type === 'streak' ? this.elements.streakIcon : 
                   type === 'emcoins' ? document.querySelector('.v5-addiction-icon:nth-child(3)') : null;
                   
      if (!icon) return;
      
      // Add celebration class
      icon.classList.add('v5-celebrating');
      icon.style.fontSize = '3rem';
      icon.style.color = 'gold';
      
      // Remove after celebration duration
      setTimeout(() => {
        icon.classList.remove('v5-celebrating');
        icon.style.fontSize = '';
        icon.style.color = '';
      }, this.config.animations.celebration);
      
      // Dispatch event for other components
      window.dispatchEvent(new CustomEvent('v5:milestone', {
        detail: { type, value }
      }));
    },
    
    // Calculate variable reward with gambling psychology
    calculateVariableReward: function(baseAmount, source = 'unknown') {
      if (Math.random() < this.config.rewards.variableChance) {
        const multiplier = this.config.rewards.variableMultiplier;
        const variance = multiplier.min + (Math.random() * (multiplier.max - multiplier.min));
        const bonusAmount = Math.floor(baseAmount * variance);
        
        // Log for debugging (helps verify it's working)
        console.log(`[V5] 🎰 BONUS! ${source}: ${baseAmount} → ${bonusAmount} (${variance.toFixed(2)}x)`);
        
        // Trigger celebration for bonus
        this.celebrate('bonus', bonusAmount);
        
        return bonusAmount;
      }
      return baseAmount;
    },
    
    // Award EmCoins with variable reward psychology
    awardEmCoins: function(baseAmount, type = 'activity') {
      const finalAmount = this.calculateVariableReward(baseAmount, type);
      
      // Update balance immediately for instant gratification
      this.updateDisplay({
        emcoinBalance: this.data.emcoinBalance + finalAmount
      });
      
      // If we have Supabase connection, persist to database
      if (this.supabase) {
        this.persistEmCoinAward(finalAmount, type);
      }
      
      return finalAmount;
    },
    
    // Persist EmCoin award to database
    persistEmCoinAward: async function(amount, type) {
      try {
        const userId = (await this.supabase.auth.getUser()).data?.user?.id;
        if (!userId) return;
        
        // Call server-side function that handles validation
        const { data, error } = await this.supabase.rpc('award_emcoins', {
          p_user_id: userId,
          p_amount: amount,
          p_type: type,
          p_description: `${type} reward${amount > this.config.rewards[type] ? ' (BONUS!)' : ''}`
        });
        
        if (error) {
          console.error('[V5] Error persisting award:', error);
          // Could show error feedback to user
        } else {
          console.log(`[V5] ✅ Awarded ${amount} EmCoins for ${type}`);
        }
        
      } catch (error) {
        console.error('[V5] Error in persistEmCoinAward:', error);
      }
    },
    
    // Fetch real data from Supabase (async, non-blocking)
    fetchRealData: async function() {
      if (!this.supabase) return;
      
      try {
        const userId = (await this.supabase.auth.getUser()).data?.user?.id;
        if (!userId) return;
        
        // Fetch all data in parallel
        const [visitors, emcoin, profile, streak] = await Promise.all([
          this.supabase
            .from('visitor_stats')
            .select('today_count')
            .eq('user_id', userId)
            .single(),
          this.supabase
            .from('emcoin_wallets')
            .select('balance')
            .eq('user_id', userId)
            .single(),
          this.supabase
            .from('profile')
            .select('ranking')
            .eq('id', userId)
            .single(),
          // Calculate current streak from login history
          this.supabase.rpc('calculate_user_streak', { p_user_id: userId })
        ]);
        
        // Update display with real data
        this.updateDisplay({
          todayVisitors: visitors.data?.today_count || 0,
          emcoinBalance: emcoin.data?.balance || 0,
          divisionRank: profile.data?.ranking || '--',
          currentStreak: streak.data || 0
        });
        
      } catch (error) {
        console.error('[V5] Error fetching data:', error);
        // Fallback to cached data on error
      }
    }
  };
  
  // Auto-init on DOMContentLoaded if mount point exists
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      if (document.getElementById('v5-addiction-bar')) {
        window.v5Engine.init();
      }
    });
  } else {
    // DOM already loaded
    if (document.getElementById('v5-addiction-bar')) {
      window.v5Engine.init();
    }
  }
})();