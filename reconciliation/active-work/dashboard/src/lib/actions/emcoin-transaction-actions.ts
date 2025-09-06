'use server';

import { createClient } from '@/utils/supabase/server';

export interface Transaction {
  id: string;
  from_wallet_id?: string;
  to_wallet_id?: string;
  amount: number;
  type: string;
  description?: string;
  metadata?: any;
  status: string;
  created_at: string;
  direction?: 'in' | 'out';
  from_wallet?: {
    user?: {
      name: string;
      username: string;
    }
  };
  to_wallet?: {
    user?: {
      name: string;
      username: string;
    }
  };
}

export async function getTransactionHistory(userId?: string, limit = 50) {
  const supabase = await createClient();
  
  // Get current user if no userId provided
  let targetUserId = userId;
  if (!targetUserId) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return { success: false, error: 'Not authenticated' };
    }
    targetUserId = user.id;
  }

  // Get user's wallet
  const { data: wallet, error: walletError } = await supabase
    .from('emcoin_wallets')
    .select('id')
    .eq('user_id', targetUserId)
    .single();

  if (walletError || !wallet) {
    return { success: false, error: 'Wallet not found' };
  }

  // Fetch transactions where user is sender or receiver
  const { data: transactions, error } = await supabase
    .from('emcoin_transactions')
    .select(`
      *,
      from_wallet:from_wallet_id(
        user:user_id(
          profile:profiles!inner(name, username)
        )
      ),
      to_wallet:to_wallet_id(
        user:user_id(
          profile:profiles!inner(name, username)
        )
      )
    `)
    .or(`from_wallet_id.eq.${wallet.id},to_wallet_id.eq.${wallet.id}`)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Failed to fetch transactions:', error);
    return { success: false, error: error.message };
  }

  // Calculate transaction direction (in/out) for the user
  const processedTransactions = transactions?.map(tx => ({
    ...tx,
    direction: tx.from_wallet_id === wallet.id ? 'out' : 'in'
  }));

  return { success: true, data: processedTransactions };
}

export async function transferEmCoins(toUserId: string, amount: number, description?: string) {
  const supabase = await createClient();
  
  // Get current user
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { success: false, error: 'Not authenticated' };
  }

  // Validate amount
  if (amount <= 0) {
    return { success: false, error: 'Amount must be positive' };
  }

  // Get sender's wallet
  const { data: senderWallet, error: senderError } = await supabase
    .from('emcoin_wallets')
    .select('*')
    .eq('user_id', user.id)
    .single();

  if (senderError || !senderWallet) {
    return { success: false, error: 'Sender wallet not found' };
  }

  // Check balance
  if (Number(senderWallet.balance) < amount) {
    return { success: false, error: 'Insufficient balance' };
  }

  // Get receiver's wallet
  const { data: receiverWallet, error: receiverError } = await supabase
    .from('emcoin_wallets')
    .select('*')
    .eq('user_id', toUserId)
    .single();

  if (receiverError || !receiverWallet) {
    return { success: false, error: 'Receiver wallet not found' };
  }

  // Begin transaction
  try {
    // Update sender's balance
    const { error: updateSenderError } = await supabase
      .from('emcoin_wallets')
      .update({
        balance: Number(senderWallet.balance) - amount,
        total_spent: Number(senderWallet.total_spent) + amount,
        updated_at: new Date().toISOString()
      })
      .eq('id', senderWallet.id);

    if (updateSenderError) throw updateSenderError;

    // Update receiver's balance
    const { error: updateReceiverError } = await supabase
      .from('emcoin_wallets')
      .update({
        balance: Number(receiverWallet.balance) + amount,
        total_earned: Number(receiverWallet.total_earned) + amount,
        updated_at: new Date().toISOString()
      })
      .eq('id', receiverWallet.id);

    if (updateReceiverError) throw updateReceiverError;

    // Create transaction record
    const { data: transaction, error: transactionError } = await supabase
      .from('emcoin_transactions')
      .insert({
        from_wallet_id: senderWallet.id,
        to_wallet_id: receiverWallet.id,
        amount,
        type: 'transfer',
        description: description || 'EmCoin transfer',
        status: 'completed',
        metadata: {
          sender_name: user.email,
          receiver_id: toUserId
        }
      })
      .select()
      .single();

    if (transactionError) throw transactionError;

    return { success: true, data: transaction };
  } catch (error: any) {
    console.error('Transfer failed:', error);
    return { success: false, error: error.message || 'Transfer failed' };
  }
}

export async function purchaseWithEmCoins(amount: number, itemType: string, itemId: string, description: string) {
  const supabase = await createClient();
  
  // Get current user
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { success: false, error: 'Not authenticated' };
  }

  // Get user's wallet
  const { data: wallet, error: walletError } = await supabase
    .from('emcoin_wallets')
    .select('*')
    .eq('user_id', user.id)
    .single();

  if (walletError || !wallet) {
    return { success: false, error: 'Wallet not found' };
  }

  // Check balance
  if (Number(wallet.balance) < amount) {
    return { success: false, error: 'Insufficient EmCoin balance' };
  }

  try {
    // Update wallet balance
    const { error: updateError } = await supabase
      .from('emcoin_wallets')
      .update({
        balance: Number(wallet.balance) - amount,
        total_spent: Number(wallet.total_spent) + amount,
        updated_at: new Date().toISOString()
      })
      .eq('id', wallet.id);

    if (updateError) throw updateError;

    // Create transaction record
    const { data: transaction, error: transactionError } = await supabase
      .from('emcoin_transactions')
      .insert({
        from_wallet_id: wallet.id,
        to_wallet_id: null, // System purchase
        amount,
        type: 'purchase',
        description,
        status: 'completed',
        metadata: {
          item_type: itemType,
          item_id: itemId,
          user_id: user.id
        }
      })
      .select()
      .single();

    if (transactionError) throw transactionError;

    return { success: true, data: transaction };
  } catch (error: any) {
    console.error('Purchase failed:', error);
    return { success: false, error: error.message || 'Purchase failed' };
  }
}

export async function getTransactionStats(userId?: string) {
  const supabase = await createClient();
  
  // Get target user
  let targetUserId = userId;
  if (!targetUserId) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return { success: false, error: 'Not authenticated' };
    }
    targetUserId = user.id;
  }

  // Get wallet with stats
  const { data: wallet, error } = await supabase
    .from('emcoin_wallets')
    .select('*')
    .eq('user_id', targetUserId)
    .single();

  if (error || !wallet) {
    return { success: false, error: 'Wallet not found' };
  }

  // Get transaction counts by type
  const { data: typeCounts } = await supabase
    .rpc('get_transaction_type_counts', { p_wallet_id: wallet.id });

  // Get recent activity (last 7 days)
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const { data: recentTransactions } = await supabase
    .from('emcoin_transactions')
    .select('amount, type, created_at')
    .or(`from_wallet_id.eq.${wallet.id},to_wallet_id.eq.${wallet.id}`)
    .gte('created_at', sevenDaysAgo.toISOString())
    .order('created_at', { ascending: false });

  return {
    success: true,
    data: {
      balance: wallet.balance,
      total_earned: wallet.total_earned,
      total_spent: wallet.total_spent,
      last_daily_bonus: wallet.last_daily_bonus,
      type_counts: typeCounts || [],
      recent_activity: recentTransactions || [],
      created_at: wallet.created_at
    }
  };
}

export async function getTopEmCoinHolders(limit = 10) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('emcoin_wallets')
    .select(`
      balance,
      user:user_id(
        profile:profiles!inner(name, username, image_path)
      )
    `)
    .order('balance', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Failed to fetch leaderboard:', error);
    return { success: false, error: error.message };
  }

  return { success: true, data };
}