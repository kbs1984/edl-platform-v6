"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Coins, TrendingUp, TrendingDown } from "lucide-react";

interface EmCoinDisplayProps {
  userId: string;
  className?: string;
  showDetails?: boolean;
}

export function EmCoinDisplay({ userId, className = "", showDetails = false }: EmCoinDisplayProps) {
  const [balance, setBalance] = useState(0);
  const [totalEarned, setTotalEarned] = useState(0);
  const [totalSpent, setTotalSpent] = useState(0);
  const [loading, setLoading] = useState(true);
  const [recentChange, setRecentChange] = useState<number | null>(null);
  const supabase = createClient();

  useEffect(() => {
    if (!userId) return;

    const fetchWalletData = async () => {
      try {
        const { data, error } = await supabase
          .from("emcoin_wallets")
          .select("balance, total_earned, total_spent")
          .eq("user_id", userId)
          .single();

        if (error && error.code !== "PGRST116") {
          throw error;
        }

        if (data) {
          setBalance(data.balance);
          setTotalEarned(data.total_earned);
          setTotalSpent(data.total_spent);
        }
      } catch (error) {
        console.error("Error fetching wallet:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWalletData();

    // Subscribe to real-time balance updates
    const subscription = supabase
      .channel(`emcoin-${userId}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "emcoin_wallets",
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          const newBalance = payload.new.balance;
          const oldBalance = balance;
          
          setBalance(newBalance);
          setTotalEarned(payload.new.total_earned);
          setTotalSpent(payload.new.total_spent);
          
          // Show the change animation
          if (newBalance !== oldBalance) {
            setRecentChange(newBalance - oldBalance);
            setTimeout(() => setRecentChange(null), 3000);
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [userId, balance, supabase]);

  if (loading) {
    return (
      <div className={`animate-pulse bg-muted rounded-lg p-4 ${className}`}>
        <div className="h-8 bg-muted-foreground/20 rounded w-24"></div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {/* Main Balance Display */}
      <div className="flex items-center gap-2 p-4 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-lg border border-yellow-500/20">
        <Coins className="h-6 w-6 text-yellow-500" />
        <div className="flex-1">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
              {balance.toLocaleString()}
            </span>
            <span className="text-sm text-muted-foreground">EmCoins</span>
          </div>
          
          {/* Recent change indicator */}
          {recentChange !== null && (
            <div
              className={`absolute -top-2 -right-2 px-2 py-1 rounded-full text-xs font-bold animate-bounce ${
                recentChange > 0
                  ? "bg-green-500 text-white"
                  : "bg-red-500 text-white"
              }`}
            >
              {recentChange > 0 ? "+" : ""}{recentChange}
            </div>
          )}
        </div>
      </div>

      {/* Detailed Stats */}
      {showDetails && (
        <div className="mt-3 grid grid-cols-2 gap-2">
          <div className="flex items-center gap-1 p-2 bg-green-500/10 rounded">
            <TrendingUp className="h-4 w-4 text-green-500" />
            <div>
              <p className="text-xs text-muted-foreground">Earned</p>
              <p className="text-sm font-semibold text-green-600 dark:text-green-400">
                {totalEarned.toLocaleString()}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-1 p-2 bg-red-500/10 rounded">
            <TrendingDown className="h-4 w-4 text-red-500" />
            <div>
              <p className="text-xs text-muted-foreground">Spent</p>
              <p className="text-sm font-semibold text-red-600 dark:text-red-400">
                {totalSpent.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}