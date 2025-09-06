'use client';

import { useState, useEffect } from 'react';
import { Button, Card, Skeleton, ErrorAlert } from '@/shared/base-components';
import { useGlobalStore } from '@/contexts/global-state';
import { tokens } from '@/shared/design-tokens';
import { createClient } from '@/utils/supabase/client';
import { cn } from '@/lib/utils';

interface BonusState {
  available: boolean;
  lastClaimed: Date | null;
  nextAvailable: Date | null;
  amount: number;
}

export function DailyBonusButton() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [claiming, setClaiming] = useState(false);
  const [bonusState, setBonusState] = useState<BonusState>({
    available: false,
    lastClaimed: null,
    nextAvailable: null,
    amount: 10
  });
  const [showReward, setShowReward] = useState(false);
  const [timeUntilBonus, setTimeUntilBonus] = useState<string>('');
  
  const { user, updateBalance } = useGlobalStore();
  const supabase = createClient();

  useEffect(() => {
    checkBonusAvailability()
      .then(() => setLoading(false))
      .catch(setError);
      
    // Update countdown timer
    const interval = setInterval(() => {
      if (!bonusState.available && bonusState.nextAvailable) {
        updateCountdown();
      }
    }, 1000);
    
    return () => clearInterval(interval);
  }, [bonusState.nextAvailable, bonusState.available]);

  async function checkBonusAvailability() {
    try {
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      if (!currentUser) throw new Error('Not authenticated');

      // Check last claim time
      const { data: lastClaim, error: claimError } = await supabase
        .from('emcoin_transactions')
        .select('created_at')
        .eq('user_id', currentUser.id)
        .eq('type', 'daily_bonus')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();
        
      if (!claimError && lastClaim) {
        const lastClaimDate = new Date(lastClaim.created_at);
        const now = new Date();
        const hoursSinceLastClaim = (now.getTime() - lastClaimDate.getTime()) / (1000 * 60 * 60);
        
        if (hoursSinceLastClaim < 24) {
          // Bonus not yet available
          const nextAvailable = new Date(lastClaimDate.getTime() + (24 * 60 * 60 * 1000));
          setBonusState({
            available: false,
            lastClaimed: lastClaimDate,
            nextAvailable,
            amount: calculateBonusAmount()
          });
        } else {
          // Bonus available
          setBonusState({
            available: true,
            lastClaimed: lastClaimDate,
            nextAvailable: null,
            amount: calculateBonusAmount()
          });
        }
      } else {
        // Never claimed before - bonus available
        setBonusState({
          available: true,
          lastClaimed: null,
          nextAvailable: null,
          amount: calculateBonusAmount()
        });
      }
    } catch (err) {
      console.error('Error checking bonus availability:', err);
      throw err;
    }
  }

  function calculateBonusAmount(): number {
    // Base amount + streak bonus
    const baseAmount = 10;
    const streakBonus = Math.min(user.streak * 2, 50); // 2 coins per streak day, max 50
    return baseAmount + streakBonus;
  }

  function updateCountdown() {
    if (!bonusState.nextAvailable) {
      setTimeUntilBonus('');
      return;
    }
    
    const now = new Date();
    const diff = bonusState.nextAvailable.getTime() - now.getTime();
    
    if (diff <= 0) {
      // Bonus is now available
      setBonusState(prev => ({ ...prev, available: true, nextAvailable: null }));
      setTimeUntilBonus('');
      return;
    }
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    
    setTimeUntilBonus(`${hours}h ${minutes}m ${seconds}s`);
  }

  async function claimBonus() {
    if (!bonusState.available || claiming) return;
    
    setClaiming(true);
    setError(null);
    
    try {
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      if (!currentUser) throw new Error('Not authenticated');

      // Get current balance
      const { data: wallet, error: walletError } = await supabase
        .from('emcoin_wallets')
        .select('balance')
        .eq('user_id', currentUser.id)
        .single();
        
      if (walletError) throw walletError;
      if (!wallet) {
        // Create wallet if doesn't exist
        await supabase
          .from('emcoin_wallets')
          .insert({ user_id: currentUser.id, balance: 0 });
      }
      
      const currentBalance = wallet?.balance || 0;
      const newBalance = currentBalance + bonusState.amount;
      
      // Update balance
      const { error: updateError } = await supabase
        .from('emcoin_wallets')
        .update({ balance: newBalance })
        .eq('user_id', currentUser.id);
        
      if (updateError) throw updateError;
      
      // Log transaction
      const { error: transactionError } = await supabase
        .from('emcoin_transactions')
        .insert({
          user_id: currentUser.id,
          amount: bonusState.amount,
          type: 'daily_bonus',
          description: `Daily bonus claimed! +${bonusState.amount} EmCoins`
        });
        
      if (transactionError) throw transactionError;
      
      // Update global state
      updateBalance(newBalance);
      
      // Show reward animation
      setShowReward(true);
      setTimeout(() => setShowReward(false), 3000);
      
      // Update bonus state
      const nextAvailable = new Date(Date.now() + (24 * 60 * 60 * 1000));
      setBonusState({
        available: false,
        lastClaimed: new Date(),
        nextAvailable,
        amount: calculateBonusAmount()
      });
      
    } catch (err) {
      console.error('Error claiming bonus:', err);
      setError(err as Error);
    } finally {
      setClaiming(false);
    }
  }

  if (loading) return <Skeleton className="h-24 w-full" />;
  if (error && !claiming) return <ErrorAlert message={`Failed to load bonus: ${error.message}`} />;

  return (
    <Card className="w-full relative overflow-hidden">
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          background: `linear-gradient(135deg, ${tokens.colors.addiction.coin} 0%, ${tokens.colors.success} 100%)`
        }}
      />
      
      <div className="relative p-6">
        <div className="text-center mb-4">
          <div className="text-4xl mb-2">🎁</div>
          <h3 className="text-lg font-semibold">Daily Bonus</h3>
          <p className="text-sm text-muted-foreground">
            Claim your daily EmCoins!
          </p>
        </div>
        
        {bonusState.available ? (
          <div className="space-y-4">
            <div className="text-center">
              <span className="text-2xl font-bold" style={{ color: tokens.colors.addiction.coin }}>
                +{bonusState.amount}
              </span>
              <span className="ml-2 text-lg">EmCoins</span>
              {user.streak > 0 && (
                <p className="text-xs text-muted-foreground mt-1">
                  Includes {Math.min(user.streak * 2, 50)} streak bonus!
                </p>
              )}
            </div>
            
            <Button
              onClick={claimBonus}
              disabled={claiming}
              className="w-full h-12 text-lg font-bold"
              style={{
                background: `linear-gradient(135deg, ${tokens.colors.addiction.coin} 0%, ${tokens.colors.success} 100%)`
              }}
            >
              {claiming ? (
                <LoadingSpinner className="w-6 h-6" />
              ) : (
                'Claim Bonus! 🪙'
              )}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Next bonus available in:</p>
              <p className="text-2xl font-bold mt-2">{timeUntilBonus}</p>
            </div>
            
            <Button
              disabled
              className="w-full h-12 opacity-50"
            >
              Already Claimed Today ✓
            </Button>
            
            {bonusState.lastClaimed && (
              <p className="text-xs text-center text-muted-foreground">
                Last claimed: {bonusState.lastClaimed.toLocaleString()}
              </p>
            )}
          </div>
        )}
        
        {showReward && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-6xl animate-bounce">
              🪙 +{bonusState.amount}
            </div>
          </div>
        )}
        
        {error && claiming && (
          <p className="text-sm text-destructive text-center mt-2">
            {error.message}
          </p>
        )}
      </div>
    </Card>
  );
}

function LoadingSpinner({ className }: { className?: string }) {
  return (
    <div className={cn('animate-spin rounded-full border-2 border-current border-t-transparent', className)} />
  );
}