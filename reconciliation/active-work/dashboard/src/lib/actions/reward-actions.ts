"use server";

import { createServerClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

// Reward configuration with amounts
const REWARD_CONFIG = {
  achievement: {
    common: 10,
    rare: 25,
    epic: 50,
    legendary: 100,
  },
  activity: {
    beginner: 5,
    intermediate: 15,
    advanced: 30,
    expert: 50,
  },
  daily_login: 5,
  profile_milestone: 25,
  friend_referral: 20,
} as const;

type RewardType = "achievement" | "activity" | "daily_login" | "profile_milestone" | "friend_referral";

interface ClaimRewardParams {
  rewardType: RewardType;
  rewardKey: string;
  metadata?: Record<string, any>;
}

interface ClaimRewardResult {
  success: boolean;
  amount?: number;
  alreadyClaimed?: boolean;
  error?: string;
  transactionId?: string;
}

/**
 * Claim a reward with idempotency and defensive programming
 * Uses optional chaining throughout for safety
 */
export async function claimReward(params: ClaimRewardParams): Promise<ClaimRewardResult> {
  try {
    const supabase = await createServerClient();
    
    // Get current user with defensive check
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user?.id) {
      return { success: false, error: "Not authenticated" };
    }

    // Check if already claimed (idempotency check)
    const { data: existingClaim, error: checkError } = await supabase
      .from("emcoin_reward_claims")
      .select("id, amount")
      .eq("user_id", user.id)
      .eq("reward_type", params.rewardType)
      .eq("reward_key", params.rewardKey)
      .single();

    if (existingClaim?.id) {
      return { 
        success: false, 
        alreadyClaimed: true,
        amount: existingClaim.amount,
        error: "Reward already claimed" 
      };
    }

    // Calculate reward amount based on type and metadata
    let amount = 0;
    if (params.rewardType === "achievement" && params.metadata?.rarity) {
      amount = REWARD_CONFIG.achievement[params.metadata.rarity as keyof typeof REWARD_CONFIG.achievement] || 10;
    } else if (params.rewardType === "activity" && params.metadata?.difficulty) {
      amount = REWARD_CONFIG.activity[params.metadata.difficulty as keyof typeof REWARD_CONFIG.activity] || 5;
    } else if (params.rewardType === "daily_login") {
      amount = REWARD_CONFIG.daily_login;
    } else if (params.rewardType === "profile_milestone") {
      amount = REWARD_CONFIG.profile_milestone;
    } else if (params.rewardType === "friend_referral") {
      amount = REWARD_CONFIG.friend_referral;
    } else {
      amount = 5; // Default fallback
    }

    // Get or create user wallet with defensive check
    const { data: wallet, error: walletError } = await supabase
      .from("emcoin_wallets")
      .select("id, balance, total_earned, total_spent")
      .eq("user_id", user.id)
      .single();

    if (!wallet?.id) {
      // Create wallet if doesn't exist
      const { data: newWallet, error: createError } = await supabase
        .from("emcoin_wallets")
        .insert({
          user_id: user.id,
          balance: 0,
          total_earned: 0,
          total_spent: 0,
        })
        .select()
        .single();

      if (createError || !newWallet?.id) {
        return { success: false, error: "Failed to create wallet" };
      }
    }

    // Start transaction for atomic operation
    const walletId = wallet?.id || (await supabase
      .from("emcoin_wallets")
      .select("id")
      .eq("user_id", user.id)
      .single()).data?.id;

    if (!walletId) {
      return { success: false, error: "Wallet not found" };
    }

    // Create transaction record
    const { data: transaction, error: transactionError } = await supabase
      .from("emcoin_transactions")
      .insert({
        from_wallet_id: null, // System reward
        to_wallet_id: walletId,
        amount,
        type: "reward",
        description: `${params.rewardType}: ${params.rewardKey}`,
        metadata: {
          reward_type: params.rewardType,
          reward_key: params.rewardKey,
          ...params.metadata,
        },
        status: "completed",
      })
      .select()
      .single();

    if (transactionError || !transaction?.id) {
      return { success: false, error: "Failed to create transaction" };
    }

    // Record the claim
    const { error: claimError } = await supabase
      .from("emcoin_reward_claims")
      .insert({
        user_id: user.id,
        reward_type: params.rewardType,
        reward_key: params.rewardKey,
        amount,
        transaction_id: transaction.id,
        metadata: params.metadata,
      });

    if (claimError) {
      // Rollback transaction if claim fails
      await supabase
        .from("emcoin_transactions")
        .delete()
        .eq("id", transaction.id);
      
      return { success: false, error: "Failed to record claim" };
    }

    // Update wallet balance
    const { error: updateError } = await supabase
      .from("emcoin_wallets")
      .update({
        balance: (wallet?.balance || 0) + amount,
        total_earned: (wallet?.total_earned || 0) + amount,
        updated_at: new Date().toISOString(),
      })
      .eq("id", walletId);

    if (updateError) {
      return { success: false, error: "Failed to update balance" };
    }

    revalidatePath("/");
    
    return {
      success: true,
      amount,
      transactionId: transaction.id,
    };
  } catch (error) {
    console.error("Reward claim error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Get available rewards for a user
 * Uses defensive programming with optional chaining
 */
export async function getAvailableRewards() {
  try {
    const supabase = await createServerClient();
    
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user?.id) {
      return { rewards: [], error: "Not authenticated" };
    }

    // Get claimed rewards
    const { data: claimedRewards } = await supabase
      .from("emcoin_reward_claims")
      .select("reward_type, reward_key")
      .eq("user_id", user.id);

    const claimed = new Set(
      claimedRewards?.map(r => `${r.reward_type}:${r.reward_key}`) || []
    );

    // Check daily login availability
    const today = new Date().toISOString().split("T")[0];
    const dailyLoginKey = `login_${today}`;
    const canClaimDaily = !claimed.has(`daily_login:${dailyLoginKey}`);

    // Return available rewards
    return {
      rewards: [
        ...(canClaimDaily ? [{
          type: "daily_login" as const,
          key: dailyLoginKey,
          amount: REWARD_CONFIG.daily_login,
          title: "Daily Login Bonus",
          description: "Claim your daily login reward!",
        }] : []),
      ],
      error: null,
    };
  } catch (error) {
    console.error("Get available rewards error:", error);
    return {
      rewards: [],
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Get reward history for current user
 */
export async function getRewardHistory(limit = 10) {
  try {
    const supabase = await createServerClient();
    
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user?.id) {
      return { history: [], error: "Not authenticated" };
    }

    const { data: claims, error } = await supabase
      .from("emcoin_reward_claims")
      .select("*")
      .eq("user_id", user.id)
      .order("claimed_at", { ascending: false })
      .limit(limit);

    if (error) {
      return { history: [], error: error.message };
    }

    return {
      history: claims || [],
      error: null,
    };
  } catch (error) {
    console.error("Get reward history error:", error);
    return {
      history: [],
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}