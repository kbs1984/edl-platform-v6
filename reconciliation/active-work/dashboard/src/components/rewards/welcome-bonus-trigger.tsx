'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Coins, Sparkles, Gift, Trophy, Zap } from 'lucide-react';

interface WelcomeBonusResult {
  success: boolean;
  transaction_id?: string;
  new_balance?: number;
  amount_awarded?: number;
  error?: string;
  bonus_multiplier?: number;
  is_bonus?: boolean;
}

interface WelcomeBonusProps {
  userId: string;
  onBonusAwarded?: (result: WelcomeBonusResult) => void;
}

export function WelcomeBonusTrigger({ userId, onBonusAwarded }: WelcomeBonusProps) {
  const [currentBalance, setCurrentBalance] = useState<number>(0);
  const [lastBonus, setLastBonus] = useState<WelcomeBonusResult | null>(null);
  const [isAwarding, setIsAwarding] = useState(false);
  const [bonusHistory, setBonusHistory] = useState<WelcomeBonusResult[]>([]);
  const [stats, setStats] = useState({
    totalBonuses: 0,
    bonusRate: 0,
    averageMultiplier: 1.0
  });

  const supabase = createClient();

  useEffect(() => {
    fetchCurrentBalance();
    loadBonusHistory();
  }, [userId]);

  const fetchCurrentBalance = async () => {
    try {
      const { data, error } = await supabase
        .from('emcoin_wallets')
        .select('balance')
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      setCurrentBalance(data?.balance || 0);
    } catch (err) {
      console.error('Failed to fetch balance:', err);
    }
  };

  const loadBonusHistory = () => {
    // Load from localStorage for demo purposes
    const stored = localStorage.getItem(`bonus_history_${userId}`);
    if (stored) {
      const history = JSON.parse(stored);
      setBonusHistory(history);
      calculateStats(history);
    }
  };

  const saveBonusHistory = (history: WelcomeBonusResult[]) => {
    localStorage.setItem(`bonus_history_${userId}`, JSON.stringify(history));
    calculateStats(history);
  };

  const calculateStats = (history: WelcomeBonusResult[]) => {
    if (history.length === 0) return;

    const bonusCount = history.filter(h => h.is_bonus).length;
    const bonusRate = (bonusCount / history.length) * 100;
    const multipliers = history.filter(h => h.bonus_multiplier).map(h => h.bonus_multiplier!);
    const averageMultiplier = multipliers.length > 0 
      ? multipliers.reduce((a, b) => a + b, 0) / multipliers.length 
      : 1.0;

    setStats({
      totalBonuses: bonusCount,
      bonusRate: Math.round(bonusRate * 10) / 10,
      averageMultiplier: Math.round(averageMultiplier * 100) / 100
    });
  };

  const calculateVariableReward = (baseAmount: number): { amount: number, isBonus: boolean, multiplier: number } => {
    // Implement the 15% bonus chance from v5 specs
    const bonusChance = 0.15; // 15% chance
    const isBonus = Math.random() < bonusChance;
    
    if (isBonus) {
      // 1.5x to 3.0x multiplier range
      const multiplier = 1.5 + Math.random() * 1.5; // 1.5 to 3.0
      const amount = Math.floor(baseAmount * multiplier);
      
      console.log(`🎰 BONUS! ${multiplier.toFixed(2)}x multiplier: ${baseAmount} → ${amount} EmCoins`);
      
      return { amount, isBonus: true, multiplier };
    }
    
    return { amount: baseAmount, isBonus: false, multiplier: 1.0 };
  };

  const awardWelcomeBonus = async () => {
    try {
      setIsAwarding(true);
      
      // Calculate variable reward (testing Session 148's gambling psychology)
      const baseAmount = 50; // Standard welcome bonus
      const { amount, isBonus, multiplier } = calculateVariableReward(baseAmount);
      
      // Test the award_emcoins function Session 148 created
      const { data, error } = await supabase.rpc('award_emcoins', {
        p_user_id: userId,
        p_amount: amount,
        p_type: 'bonus',
        p_description: isBonus 
          ? `Welcome bonus with ${multiplier.toFixed(2)}x multiplier!` 
          : 'Welcome bonus'
      });

      if (error) throw error;

      const result: WelcomeBonusResult = {
        ...data,
        bonus_multiplier: multiplier,
        is_bonus: isBonus
      };

      setLastBonus(result);
      
      // Update history
      const newHistory = [result, ...bonusHistory.slice(0, 19)]; // Keep last 20
      setBonusHistory(newHistory);
      saveBonusHistory(newHistory);
      
      // Trigger celebration animation if bonus
      if (isBonus) {
        triggerBonusCelebration(amount, multiplier);
      }
      
      // Refresh balance
      await fetchCurrentBalance();
      
      onBonusAwarded?.(result);
      
    } catch (err: any) {
      const errorResult: WelcomeBonusResult = {
        success: false,
        error: err.message
      };
      setLastBonus(errorResult);
    } finally {
      setIsAwarding(false);
    }
  };

  const triggerBonusCelebration = (amount: number, multiplier: number) => {
    // Trigger DOM animations similar to v5's celebration mechanics
    const celebrationDiv = document.createElement('div');
    celebrationDiv.innerHTML = `
      <div style="
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 9999;
        font-size: 3rem;
        color: gold;
        text-shadow: 0 0 20px rgba(255, 215, 0, 0.8);
        animation: bonusPulse 3s ease-out forwards;
        pointer-events: none;
      ">
        🎰 BONUS! ${multiplier.toFixed(1)}x
        <div style="font-size: 1.5rem; text-align: center;">
          +${amount} EmCoins!
        </div>
      </div>
      <style>
        @keyframes bonusPulse {
          0% { transform: translate(-50%, -50%) scale(0.5); opacity: 0; }
          20% { transform: translate(-50%, -50%) scale(1.2); opacity: 1; }
          80% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
          100% { transform: translate(-50%, -50%) scale(0.8); opacity: 0; }
        }
      </style>
    `;
    
    document.body.appendChild(celebrationDiv);
    
    // Remove after exactly 3 seconds (v5 timing)
    setTimeout(() => {
      document.body.removeChild(celebrationDiv);
    }, 3000);
  };

  return (
    <div className="space-y-4 w-full max-w-2xl">
      {/* Current Balance Display */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Coins className="h-5 w-5 text-yellow-500" />
            Current Balance: {currentBalance} EmCoins
          </CardTitle>
          <CardDescription>
            Test the variable reward system (15% bonus chance, 1.5x-3x multiplier)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            onClick={awardWelcomeBonus}
            disabled={isAwarding}
            className="w-full"
            size="lg"
          >
            {isAwarding ? (
              'Awarding Bonus...'
            ) : (
              <>
                <Gift className="h-4 w-4 mr-2" />
                Award Welcome Bonus (50 EmCoins + Variable Reward)
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Last Bonus Result */}
      {lastBonus && (
        <Card className={lastBonus.success ? 'border-green-500' : 'border-red-500'}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {lastBonus.success ? (
                <>
                  {lastBonus.is_bonus ? (
                    <Sparkles className="h-5 w-5 text-yellow-500" />
                  ) : (
                    <Coins className="h-5 w-5 text-green-500" />
                  )}
                  {lastBonus.is_bonus ? 'Bonus Reward!' : 'Standard Reward'}
                </>
              ) : (
                <>
                  <Zap className="h-5 w-5 text-red-500" />
                  Award Failed
                </>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {lastBonus.success ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span>Amount Awarded:</span>
                  <Badge variant={lastBonus.is_bonus ? 'default' : 'secondary'}>
                    +{lastBonus.amount_awarded} EmCoins
                  </Badge>
                </div>
                
                {lastBonus.is_bonus && (
                  <div className="flex items-center justify-between">
                    <span>Bonus Multiplier:</span>
                    <Badge variant="default" className="bg-yellow-500">
                      {lastBonus.bonus_multiplier?.toFixed(2)}x
                    </Badge>
                  </div>
                )}
                
                <div className="flex items-center justify-between">
                  <span>New Balance:</span>
                  <Badge variant="outline">{lastBonus.new_balance} EmCoins</Badge>
                </div>
                
                <div className="text-xs text-muted-foreground">
                  Transaction ID: {lastBonus.transaction_id}
                </div>
              </div>
            ) : (
              <Alert variant="destructive">
                <AlertDescription>{lastBonus.error}</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      )}

      {/* Variable Reward Statistics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-purple-500" />
            Variable Reward Statistics
          </CardTitle>
          <CardDescription>
            Testing the gambling psychology from Session 148
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-3 bg-muted rounded-lg">
              <div className="text-2xl font-bold text-purple-500">{stats.totalBonuses}</div>
              <div className="text-sm text-muted-foreground">Total Bonuses</div>
            </div>
            
            <div className="text-center p-3 bg-muted rounded-lg">
              <div className="text-2xl font-bold text-blue-500">{stats.bonusRate}%</div>
              <div className="text-sm text-muted-foreground">Bonus Rate</div>
              <div className="text-xs text-muted-foreground">(Target: 15%)</div>
            </div>
            
            <div className="text-center p-3 bg-muted rounded-lg">
              <div className="text-2xl font-bold text-green-500">{stats.averageMultiplier}x</div>
              <div className="text-sm text-muted-foreground">Avg Multiplier</div>
              <div className="text-xs text-muted-foreground">(Range: 1.5-3.0x)</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent History */}
      {bonusHistory.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Bonus History</CardTitle>
            <CardDescription>Last {Math.min(bonusHistory.length, 5)} awards</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {bonusHistory.slice(0, 5).map((bonus, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-muted rounded">
                  <div className="flex items-center gap-2">
                    {bonus.is_bonus ? (
                      <Sparkles className="h-4 w-4 text-yellow-500" />
                    ) : (
                      <Coins className="h-4 w-4 text-green-500" />
                    )}
                    <span className="text-sm">
                      {bonus.is_bonus ? `${bonus.bonus_multiplier?.toFixed(2)}x Bonus` : 'Standard'}
                    </span>
                  </div>
                  <Badge variant={bonus.is_bonus ? 'default' : 'secondary'}>
                    +{bonus.amount_awarded} EmCoins
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Debug Info */}
      {process.env.NODE_ENV === 'development' && (
        <Card className="border-dashed">
          <CardHeader>
            <CardTitle className="text-sm">Debug Info - Variable Reward Testing</CardTitle>
          </CardHeader>
          <CardContent className="text-xs space-y-2">
            <p><strong>Test Objective:</strong> Verify 15% bonus rate over multiple awards</p>
            <p><strong>Expected Behavior:</strong> ~3 bonuses out of 20 attempts</p>
            <p><strong>Multiplier Range:</strong> 1.5x to 3.0x (75-150 EmCoins from 50 base)</p>
            <p><strong>Celebration:</strong> 3-second gold animation for bonuses</p>
            <p><strong>Console Logs:</strong> Check for "🎰 BONUS!" messages</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}