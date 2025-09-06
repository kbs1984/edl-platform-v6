'use client';

import { useState, useEffect } from 'react';
import { Card, Skeleton, ErrorAlert } from '@/shared/base-components';
import { useGlobalStore } from '@/contexts/global-state';
import { tokens } from '@/shared/design-tokens';
import { createClient } from '@/utils/supabase/client';
import { cn } from '@/lib/utils';

interface FireLevel {
  min: number;
  emoji: string;
  size: string;
  animation: string;
  message: string;
}

const FIRE_LEVELS: FireLevel[] = [
  { min: 0, emoji: '💨', size: 'text-2xl', animation: '', message: 'Start your streak!' },
  { min: 1, emoji: '🔥', size: 'text-3xl', animation: 'animate-pulse', message: 'Keep it up!' },
  { min: 3, emoji: '🔥🔥', size: 'text-4xl', animation: 'animate-pulse', message: 'On fire!' },
  { min: 7, emoji: '🔥🔥🔥', size: 'text-5xl', animation: 'animate-bounce', message: 'Blazing hot!' },
  { min: 14, emoji: '🔥🔥🔥🔥', size: 'text-6xl', animation: 'animate-bounce', message: 'Unstoppable!' },
  { min: 30, emoji: '🌋', size: 'text-7xl', animation: 'animate-spin', message: 'LEGENDARY!' }
];

function getFireLevel(streak: number): FireLevel {
  for (let i = FIRE_LEVELS.length - 1; i >= 0; i--) {
    if (streak >= FIRE_LEVELS[i].min) {
      return FIRE_LEVELS[i];
    }
  }
  return FIRE_LEVELS[0];
}

export function StreakCounter() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [celebrating, setCelebrating] = useState(false);
  const { user, updateStreak } = useGlobalStore();
  
  const supabase = createClient();
  const fireLevel = getFireLevel(user.streak);

  useEffect(() => {
    fetchStreakData()
      .then(() => setLoading(false))
      .catch(setError);
      
    // Check if this is a new day login
    checkDailyLogin();
  }, []);

  async function fetchStreakData() {
    try {
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      if (!currentUser) throw new Error('Not authenticated');

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('current_streak, last_login')
        .eq('id', currentUser.id)
        .single();
        
      if (profileError) throw profileError;
      
      if (profile) {
        updateStreak(profile.current_streak || 0);
        
        // Check if streak should be reset
        if (profile.last_login) {
          const lastLogin = new Date(profile.last_login);
          const today = new Date();
          const daysSinceLastLogin = Math.floor((today.getTime() - lastLogin.getTime()) / (1000 * 60 * 60 * 24));
          
          if (daysSinceLastLogin > 1) {
            // Streak broken - reset to 0
            await resetStreak();
          }
        }
      }
    } catch (err) {
      console.error('Error fetching streak data:', err);
      throw err;
    }
  }

  async function checkDailyLogin() {
    try {
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      if (!currentUser) return;

      const today = new Date().toISOString().split('T')[0];
      const { data: profile } = await supabase
        .from('profiles')
        .select('last_login')
        .eq('id', currentUser.id)
        .single();
        
      if (profile?.last_login) {
        const lastLoginDate = new Date(profile.last_login).toISOString().split('T')[0];
        if (lastLoginDate !== today) {
          // New day login - increment streak
          await incrementStreak();
        }
      } else {
        // First login ever
        await incrementStreak();
      }
    } catch (err) {
      console.error('Error checking daily login:', err);
    }
  }

  async function incrementStreak() {
    try {
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      if (!currentUser) return;

      const { data, error } = await supabase
        .from('profiles')
        .update({ 
          current_streak: user.streak + 1,
          last_login: new Date().toISOString()
        })
        .eq('id', currentUser.id)
        .select('current_streak')
        .single();
        
      if (!error && data) {
        updateStreak(data.current_streak);
        setCelebrating(true);
        setTimeout(() => setCelebrating(false), 3000);
        
        // Award EmCoin bonus for streak milestones
        if ([3, 7, 14, 30, 100].includes(data.current_streak)) {
          await awardStreakBonus(data.current_streak);
        }
      }
    } catch (err) {
      console.error('Error incrementing streak:', err);
    }
  }

  async function resetStreak() {
    try {
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      if (!currentUser) return;

      await supabase
        .from('profiles')
        .update({ 
          current_streak: 0,
          last_login: new Date().toISOString()
        })
        .eq('id', currentUser.id);
        
      updateStreak(0);
    } catch (err) {
      console.error('Error resetting streak:', err);
    }
  }

  async function awardStreakBonus(streak: number) {
    const bonusAmounts: Record<number, number> = {
      3: 10,
      7: 25,
      14: 50,
      30: 100,
      100: 500
    };
    
    const bonus = bonusAmounts[streak] || 0;
    if (bonus === 0) return;
    
    try {
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      if (!currentUser) return;

      // Award EmCoins
      const { data: wallet } = await supabase
        .from('emcoin_wallets')
        .select('balance')
        .eq('user_id', currentUser.id)
        .single();
        
      if (wallet) {
        await supabase
          .from('emcoin_wallets')
          .update({ balance: wallet.balance + bonus })
          .eq('user_id', currentUser.id);
          
        // Log transaction
        await supabase
          .from('emcoin_transactions')
          .insert({
            user_id: currentUser.id,
            amount: bonus,
            type: 'streak_bonus',
            description: `${streak} day streak bonus!`
          });
      }
    } catch (err) {
      console.error('Error awarding streak bonus:', err);
    }
  }

  if (loading) return <Skeleton className="h-32 w-full" />;
  if (error) return <ErrorAlert message={`Failed to load streak: ${error.message}`} />;

  return (
    <Card className="w-full relative overflow-hidden">
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          background: `radial-gradient(circle at center, ${tokens.colors.addiction.fire} 0%, transparent 70%)`
        }}
      />
      
      <div className="relative p-6 text-center">
        <div className={cn(fireLevel.size, fireLevel.animation, celebrating && "scale-125 transition-transform")}>
          {fireLevel.emoji}
        </div>
        
        <div className="mt-4">
          <div className="text-3xl font-bold" style={{ color: tokens.colors.addiction.fire }}>
            {user.streak} Day{user.streak !== 1 ? 's' : ''}
          </div>
          <div className="text-sm text-muted-foreground mt-1">
            {fireLevel.message}
          </div>
        </div>
        
        {celebrating && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-6xl animate-ping">🎉</div>
          </div>
        )}
        
        {user.streak > 0 && (
          <div className="mt-4 text-xs text-muted-foreground">
            Next milestone: {FIRE_LEVELS.find(l => l.min > user.streak)?.min || '∞'} days
          </div>
        )}
      </div>
    </Card>
  );
}