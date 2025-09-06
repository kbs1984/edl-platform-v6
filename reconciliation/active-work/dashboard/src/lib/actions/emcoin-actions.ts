"use server"

import { createServerClient } from "@/utils/supabase/server";

export async function getEmCoinBalance() {
  const supabase = await createServerClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { error: "User not authenticated" };
  }

  const { data: wallet, error } = await supabase
    .from("emcoin_wallets")
    .select("balance, total_earned, total_spent")
    .eq("user_id", user.id)
    .single();

  if (error && error.code === 'PGRST116') {
    // No wallet exists, create one
    const { data: newWallet, error: createError } = await supabase
      .from("emcoin_wallets")
      .insert({
        user_id: user.id,
        balance: 0,
        total_earned: 0,
        total_spent: 0
      })
      .select()
      .single();

    if (createError) {
      return { error: createError.message };
    }

    return { wallet: newWallet };
  }

  if (error) {
    return { error: error.message };
  }

  return { wallet };
}

export async function getRecentTransactions(limit = 5) {
  const supabase = await createServerClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { error: "User not authenticated" };
  }

  // Get user's wallet
  const { data: wallet } = await supabase
    .from("emcoin_wallets")
    .select("id")
    .eq("user_id", user.id)
    .single();

  if (!wallet) {
    return { transactions: [] };
  }

  const { data: transactions, error } = await supabase
    .from("emcoin_transactions")
    .select("*")
    .or(`from_wallet_id.eq.${wallet.id},to_wallet_id.eq.${wallet.id}`)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    return { error: error.message };
  }

  return { transactions: transactions || [] };
}

export async function claimDailyBonus() {
  const supabase = await createServerClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { error: "User not authenticated" };
  }

  // Use the simpler database function with proper parameter syntax
  const { data, error } = await supabase
    .rpc('claim_daily_bonus_simple', { user_id: user.id })
    .single();

  if (error) {
    return { error: error.message };
  }

  if (!data.success) {
    return { error: data.message };
  }

  return { 
    success: true, 
    amount: parseFloat(data.amount)
  };
}