'use client';

import { useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';

// Bridge component to connect v5 vanilla JS with React/Supabase
export function V5AddictionBridge() {
  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return;
    
    // Wait for v5Engine to be available
    const initV5 = () => {
      if (window.v5Engine && !window.v5Engine.mounted) {
        const supabase = createClient();
        
        // Initialize with Supabase client
        window.v5Engine.init({
          mountPoint: 'v5-addiction-bar',
          supabaseClient: supabase
        });
        
        // Set up real-time subscriptions for live updates
        setupRealtimeSubscriptions(supabase);
      }
    };
    
    // Check if v5Engine is already loaded
    if (window.v5Engine) {
      initV5();
    } else {
      // Wait for script to load
      const checkInterval = setInterval(() => {
        if (window.v5Engine) {
          clearInterval(checkInterval);
          initV5();
        }
      }, 100);
      
      // Cleanup after 5 seconds if not loaded
      setTimeout(() => clearInterval(checkInterval), 5000);
    }
  }, []);
  
  return null; // This component doesn't render anything
}

// Set up real-time subscriptions for live updates
function setupRealtimeSubscriptions(supabase: any) {
  // Get current user
  supabase.auth.getUser().then(({ data: { user } }: any) => {
    if (!user) return;
    
    // Subscribe to visitor updates
    const visitorChannel = supabase
      .channel('visitor-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'visitor_stats',
          filter: `user_id=eq.${user.id}`
        },
        (payload: any) => {
          if (window.v5Engine && payload.new) {
            window.v5Engine.updateDisplay({
              todayVisitors: payload.new.today_count || 0
            });
          }
        }
      )
      .subscribe();
    
    // Subscribe to EmCoin updates
    const emcoinChannel = supabase
      .channel('emcoin-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'emcoin_wallets',
          filter: `user_id=eq.${user.id}`
        },
        (payload: any) => {
          if (window.v5Engine && payload.new) {
            window.v5Engine.updateDisplay({
              emcoinBalance: payload.new.balance || 0
            });
          }
        }
      )
      .subscribe();
    
    // Cleanup on unmount
    return () => {
      supabase.removeChannel(visitorChannel);
      supabase.removeChannel(emcoinChannel);
    };
  });
}

// Type declarations for window object
declare global {
  interface Window {
    v5Engine: {
      mounted: boolean;
      init: (options?: any) => void;
      updateDisplay: (data: any) => void;
      celebrate: (type: string, value: number) => void;
    };
    V5_CONFIG: any;
  }
}