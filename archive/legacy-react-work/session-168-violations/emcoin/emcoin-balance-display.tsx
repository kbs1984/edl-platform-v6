"use client"

import { useEffect, useState } from "react";
import { getEmCoinBalance, claimDailyBonus } from "@/lib/actions/emcoin-actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { Coins, TrendingUp, TrendingDown, Gift } from "lucide-react";

interface EmCoinWallet {
  balance: string;
  total_earned: string;
  total_spent: string;
}

export function EmCoinBalanceDisplay() {
  const [wallet, setWallet] = useState<EmCoinWallet | null>(null);
  const [loading, setLoading] = useState(true);
  const [claiming, setClaiming] = useState(false);

  const fetchBalance = async () => {
    const result = await getEmCoinBalance();
    if (result?.wallet) {
      setWallet(result.wallet);
    } else if (result?.error) {
      console.error("Error fetching balance:", result.error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchBalance();
    // Refresh every 30 seconds
    const interval = setInterval(fetchBalance, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleClaimBonus = async () => {
    setClaiming(true);
    const result = await claimDailyBonus();
    
    if (result.success) {
      toast({
        title: "Daily Bonus Claimed!",
        description: `You received ${result.amount} EmCoins!`,
        duration: 3000,
      });
      // Refresh balance
      await fetchBalance();
    } else if (result.error) {
      toast({
        variant: "destructive",
        title: "Claim Failed",
        description: result.error,
        duration: 3000,
      });
    }
    setClaiming(false);
  };

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-24 bg-gray-200 rounded-lg"></div>
      </div>
    );
  }

  if (!wallet) {
    return null;
  }

  const balance = parseFloat(wallet.balance);
  const earned = parseFloat(wallet.total_earned);
  const spent = parseFloat(wallet.total_spent);

  return (
    <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Coins className="h-8 w-8 text-yellow-600" />
            <h3 className="text-lg font-semibold">EmCoin Balance</h3>
          </div>
          <Button
            onClick={handleClaimBonus}
            disabled={claiming}
            size="sm"
            variant="outline"
            className="gap-1"
          >
            <Gift className="h-4 w-4" />
            Daily Bonus
          </Button>
        </div>
        
        <div className="space-y-3">
          <div className="text-3xl font-bold text-yellow-700">
            {balance.toLocaleString()} 🪙
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-1">
              <TrendingUp className="h-4 w-4 text-green-600" />
              <span className="text-gray-600">Earned:</span>
              <span className="font-semibold text-green-700">
                {earned.toLocaleString()}
              </span>
            </div>
            
            <div className="flex items-center gap-1">
              <TrendingDown className="h-4 w-4 text-red-600" />
              <span className="text-gray-600">Spent:</span>
              <span className="font-semibold text-red-700">
                {spent.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Compact version for sidebar/header
export function EmCoinBalanceCompact() {
  const [balance, setBalance] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBalance = async () => {
      const result = await getEmCoinBalance();
      if (result.wallet) {
        setBalance(parseFloat(result.wallet.balance));
      }
      setLoading(false);
    };

    fetchBalance();
    // Refresh every 30 seconds
    const interval = setInterval(fetchBalance, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="animate-pulse flex items-center gap-1">
        <div className="h-5 w-16 bg-gray-200 rounded"></div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-yellow-100 rounded-full">
      <Coins className="h-4 w-4 text-yellow-600" />
      <span className="font-semibold text-sm text-yellow-700">
        {balance.toLocaleString()}
      </span>
    </div>
  );
}