"use client";

import { useState, useEffect, useCallback } from "react";
import { claimReward, getAvailableRewards, getRewardHistory } from "@/lib/actions/reward-actions";
import { toast } from "@/hooks/use-toast";

interface AvailableReward {
  type: "daily_login" | "achievement" | "activity" | "profile_milestone" | "friend_referral";
  key: string;
  amount: number;
  title: string;
  description: string;
}

interface RewardClaim {
  id: string;
  reward_type: string;
  reward_key: string;
  amount: number;
  claimed_at: string;
  metadata?: any;
}

interface UseRewardSystemReturn {
  availableRewards: AvailableReward[];
  rewardHistory: RewardClaim[];
  loading: boolean;
  claiming: boolean;
  error: string | null;
  claimReward: (type: string, key: string, metadata?: any) => Promise<void>;
  refreshRewards: () => Promise<void>;
}

/**
 * Hook for managing the reward system with defensive programming
 * Implements all patterns from our workflow appendix
 */
export function useRewardSystem(): UseRewardSystemReturn {
  const [availableRewards, setAvailableRewards] = useState<AvailableReward[]>([]);
  const [rewardHistory, setRewardHistory] = useState<RewardClaim[]>([]);
  const [loading, setLoading] = useState(true);
  const [claiming, setClaiming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch available rewards with defensive programming
  const fetchRewards = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [availableResult, historyResult] = await Promise.all([
        getAvailableRewards(),
        getRewardHistory(),
      ]);

      // Use optional chaining for all results
      if (availableResult?.rewards) {
        setAvailableRewards(availableResult.rewards);
      }
      
      if (historyResult?.history) {
        setRewardHistory(historyResult.history);
      }

      // Check for errors
      if (availableResult?.error) {
        setError(availableResult.error);
      } else if (historyResult?.error) {
        setError(historyResult.error);
      }
    } catch (err) {
      console.error("Failed to fetch rewards:", err);
      setError(err instanceof Error ? err.message : "Failed to load rewards");
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchRewards();
  }, [fetchRewards]);

  // Claim reward with idempotency and error handling
  const handleClaimReward = useCallback(async (
    type: string,
    key: string,
    metadata?: any
  ) => {
    // Prevent double-clicking
    if (claiming) {
      toast({
        title: "Please wait",
        description: "Already processing a reward claim",
        variant: "default",
      });
      return;
    }

    try {
      setClaiming(true);
      setError(null);

      const result = await claimReward({
        rewardType: type as any,
        rewardKey: key,
        metadata,
      });

      // Check result with optional chaining
      if (result?.success && result?.amount) {
        toast({
          title: "🎉 Reward Claimed!",
          description: `You earned ${result.amount} EmCoins!`,
          className: "bg-green-50 border-green-200",
        });

        // Refresh rewards list
        await fetchRewards();
      } else if (result?.alreadyClaimed) {
        toast({
          title: "Already Claimed",
          description: "You've already claimed this reward",
          variant: "default",
        });
      } else {
        toast({
          title: "Failed to claim reward",
          description: result?.error || "Please try again later",
          variant: "destructive",
        });
      }
    } catch (err) {
      console.error("Claim reward error:", err);
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to claim reward",
        variant: "destructive",
      });
      setError(err instanceof Error ? err.message : "Failed to claim reward");
    } finally {
      setClaiming(false);
    }
  }, [claiming, fetchRewards]);

  return {
    availableRewards,
    rewardHistory,
    loading,
    claiming,
    error,
    claimReward: handleClaimReward,
    refreshRewards: fetchRewards,
  };
}

/**
 * Hook for checking and auto-claiming daily login bonus
 */
export function useDailyLoginReward() {
  const [checked, setChecked] = useState(false);
  
  useEffect(() => {
    // Only check once per page load
    if (checked) return;
    
    const checkDailyLogin = async () => {
      try {
        const result = await getAvailableRewards();
        
        // Check if daily login is available using optional chaining
        const dailyReward = result?.rewards?.find(r => r.type === "daily_login");
        
        if (dailyReward?.key) {
          // Auto-claim daily login
          const claimResult = await claimReward({
            rewardType: "daily_login",
            rewardKey: dailyReward.key,
          });
          
          if (claimResult?.success && claimResult?.amount) {
            toast({
              title: "🌟 Daily Login Bonus!",
              description: `Welcome back! You earned ${claimResult.amount} EmCoins!`,
              className: "bg-yellow-50 border-yellow-200",
            });
          }
        }
        
        setChecked(true);
      } catch (err) {
        console.error("Daily login check failed:", err);
        // Silent failure - don't interrupt user experience
      }
    };
    
    // Small delay to not interfere with page load
    const timer = setTimeout(checkDailyLogin, 2000);
    return () => clearTimeout(timer);
  }, [checked]);
  
  return { checked };
}