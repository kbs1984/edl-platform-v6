'use client';

import { useState, useEffect } from 'react';
import { Card, Skeleton, ErrorAlert } from '@/shared/base-components';
import { useGlobalStore } from '@/contexts/global-state';
import { tokens } from '@/shared/design-tokens';
import { createClient } from '@/utils/supabase/client';
import { cn } from '@/lib/utils';

interface MetricItemProps {
  icon: string;
  value: number | string;
  label: string;
  color: string;
  animate?: boolean;
}

function MetricItem({ icon, value, label, color, animate }: MetricItemProps) {
  return (
    <div className="flex flex-col items-center justify-center p-2 hover:scale-105 transition-transform">
      <div 
        className={cn(
          "text-3xl mb-1",
          animate && "animate-pulse"
        )}
        style={{ filter: `drop-shadow(0 0 8px ${color})` }}
      >
        {icon}
      </div>
      <div className="text-xl font-bold" style={{ color }}>
        {value}
      </div>
      <div className="text-xs text-muted-foreground">{label}</div>
    </div>
  );
}

export function AddictionBar() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { user, updateBalance, updateStreak, updateAchievements, updateVisitors } = useGlobalStore();
  
  const supabase = createClient();

  useEffect(() => {
    fetchAddictionData()
      .then(() => setLoading(false))
      .catch(setError);
      
    // Set up real-time subscriptions
    const setupSubscriptions = async () => {
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      if (!currentUser) return;

      // Subscribe to EmCoin updates
      const emcoinChannel = supabase
        .channel('addiction-bar-emcoin')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'emcoin_wallets',
            filter: `user_id=eq.${currentUser.id}`
          },
          (payload: any) => {
            if (payload.new?.balance) {
              updateBalance(payload.new.balance);
            }
          }
        )
        .subscribe();

      // Subscribe to visitor updates
      const visitorChannel = supabase
        .channel('addiction-bar-visitors')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'visitor_stats',
            filter: `user_id=eq.${currentUser.id}`
          },
          (payload: any) => {
            if (payload.new?.today_count) {
              updateVisitors(payload.new.today_count);
            }
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(emcoinChannel);
        supabase.removeChannel(visitorChannel);
      };
    };

    setupSubscriptions();
  }, []);

  async function fetchAddictionData() {
    try {
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      if (!currentUser) throw new Error('Not authenticated');

      // Fetch EmCoin balance
      const { data: wallet, error: walletError } = await supabase
        .from('emcoin_wallets')
        .select('balance')
        .eq('user_id', currentUser.id)
        .single();
        
      if (!walletError && wallet) {
        updateBalance(wallet.balance);
      }

      // Fetch achievement count
      const { data: achievements, error: achievementError } = await supabase
        .from('user_achievements')
        .select('id')
        .eq('user_id', currentUser.id);
        
      if (!achievementError && achievements) {
        updateAchievements(achievements.length);
      }

      // Fetch streak data
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('current_streak, last_login')
        .eq('id', currentUser.id)
        .single();
        
      if (!profileError && profile) {
        updateStreak(profile.current_streak || 0);
      }

      // Fetch visitor count
      const { data: visitors, error: visitorError } = await supabase
        .from('visitor_stats')
        .select('today_count')
        .eq('user_id', currentUser.id)
        .single();
        
      if (!visitorError && visitors) {
        updateVisitors(visitors.today_count || 0);
      }
    } catch (err) {
      console.error('Error fetching addiction data:', err);
      throw err;
    }
  }

  if (loading) return (
    <Card className="w-full">
      <div className="flex items-center justify-around p-4">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-20 w-20 rounded-lg" />
        ))}
      </div>
    </Card>
  );

  if (error) return <ErrorAlert message={`Failed to load addiction bar: ${error.message}`} />;

  return (
    <Card className="w-full bg-gradient-to-r from-background to-accent/10 border-2">
      <div className="flex items-center justify-around p-4">
        <MetricItem
          icon="👁️"
          value={user.todayVisitors}
          label="Visitors"
          color={tokens.colors.addiction.eye}
        />
        <MetricItem
          icon="🔥"
          value={user.streak}
          label="Streak"
          color={tokens.colors.addiction.fire}
          animate={user.streak > 0}
        />
        <MetricItem
          icon="🪙"
          value={user.emcoinBalance}
          label="EmCoins"
          color={tokens.colors.addiction.coin}
        />
        <MetricItem
          icon="🏆"
          value={user.achievementCount}
          label="Achievements"
          color={tokens.colors.addiction.trophy}
        />
      </div>
    </Card>
  );
}