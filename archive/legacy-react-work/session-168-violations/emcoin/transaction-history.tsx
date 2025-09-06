'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  ArrowDownRight, 
  ArrowUpRight, 
  Coins, 
  Gift, 
  Trophy,
  Calendar,
  Clock,
  TrendingUp,
  TrendingDown,
  Filter,
  Download,
  RefreshCw,
  Loader2,
  CircleDollarSign
} from 'lucide-react';
import { getTransactionHistory, getTransactionStats, Transaction } from '@/lib/actions/emcoin-transaction-actions';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { format, formatDistanceToNow } from 'date-fns';

const transactionIcons: { [key: string]: any } = {
  'top_up': CircleDollarSign,
  'activity_fee': ArrowUpRight,
  'achievement_reward': Trophy,
  'daily_bonus': Gift,
  'transfer': ArrowUpRight,
  'purchase': ArrowDownRight,
  'judge_payment': Coins,
  'refund': RefreshCw
};

const transactionColors: { [key: string]: string } = {
  'top_up': 'text-green-600',
  'activity_fee': 'text-red-600',
  'achievement_reward': 'text-yellow-600',
  'daily_bonus': 'text-blue-600',
  'transfer': 'text-purple-600',
  'purchase': 'text-orange-600',
  'judge_payment': 'text-indigo-600',
  'refund': 'text-gray-600'
};

export function TransactionHistory({ userId }: { userId?: string }) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    loadData();
  }, [userId]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [historyRes, statsRes] = await Promise.all([
        getTransactionHistory(userId),
        getTransactionStats(userId)
      ]);

      if (historyRes.success) {
        setTransactions(historyRes.data || []);
      } else {
        toast({
          variant: 'destructive',
          title: 'Failed to load transactions',
          description: historyRes.error
        });
      }

      if (statsRes.success) {
        setStats(statsRes.data);
      }
    } catch (error) {
      console.error('Error loading transaction data:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to load transaction data'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
    toast({
      title: 'Refreshed',
      description: 'Transaction history updated'
    });
  };

  const filteredTransactions = filter === 'all' 
    ? transactions 
    : filter === 'in' 
      ? transactions.filter(t => t.direction === 'in')
      : filter === 'out'
        ? transactions.filter(t => t.direction === 'out')
        : transactions.filter(t => t.type === filter);

  const exportTransactions = () => {
    const csv = [
      ['Date', 'Type', 'Description', 'Amount', 'Direction', 'Status'],
      ...filteredTransactions.map(t => [
        format(new Date(t.created_at), 'yyyy-MM-dd HH:mm'),
        t.type,
        t.description || '',
        t.amount.toString(),
        t.direction || '',
        t.status
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `emcoin-transactions-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatCard
            title="Current Balance"
            value={`${stats.balance} 🪙`}
            icon={Coins}
            trend={stats.balance > 0 ? 'up' : 'neutral'}
          />
          <StatCard
            title="Total Earned"
            value={`${stats.total_earned} 🪙`}
            icon={TrendingUp}
            trend="up"
            className="text-green-600"
          />
          <StatCard
            title="Total Spent"
            value={`${stats.total_spent} 🪙`}
            icon={TrendingDown}
            trend="down"
            className="text-red-600"
          />
          <StatCard
            title="Transactions"
            value={transactions.length.toString()}
            icon={ArrowUpRight}
            trend="neutral"
          />
        </div>
      )}

      {/* Transaction List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Transaction History
            </CardTitle>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={exportTransactions}
                disabled={filteredTransactions.length === 0}
              >
                <Download className="h-4 w-4 mr-1" />
                Export
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={refreshing}
              >
                <RefreshCw className={cn(
                  "h-4 w-4 mr-1",
                  refreshing && "animate-spin"
                )} />
                Refresh
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <Tabs defaultValue="all" value={filter} onValueChange={setFilter}>
            <TabsList className="grid w-full grid-cols-5 mb-4">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="in">
                <ArrowDownRight className="h-4 w-4 mr-1" />
                In
              </TabsTrigger>
              <TabsTrigger value="out">
                <ArrowUpRight className="h-4 w-4 mr-1" />
                Out
              </TabsTrigger>
              <TabsTrigger value="daily_bonus">
                <Gift className="h-4 w-4 mr-1" />
                Bonus
              </TabsTrigger>
              <TabsTrigger value="achievement_reward">
                <Trophy className="h-4 w-4 mr-1" />
                Rewards
              </TabsTrigger>
            </TabsList>

            <ScrollArea className="h-[400px] pr-4">
              {filteredTransactions.length > 0 ? (
                <div className="space-y-2">
                  {filteredTransactions.map((transaction) => (
                    <TransactionItem 
                      key={transaction.id} 
                      transaction={transaction}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Clock className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                  <p className="text-gray-500">No transactions found</p>
                  <p className="text-sm text-gray-400 mt-1">
                    {filter !== 'all' ? 'Try adjusting your filters' : 'Start earning EmCoins to see your history'}
                  </p>
                </div>
              )}
            </ScrollArea>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

function StatCard({ 
  title, 
  value, 
  icon: Icon, 
  trend,
  className 
}: { 
  title: string;
  value: string;
  icon: any;
  trend: 'up' | 'down' | 'neutral';
  className?: string;
}) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">{title}</p>
            <p className={cn("text-2xl font-bold mt-1", className)}>
              {value}
            </p>
          </div>
          <div className={cn(
            "p-3 rounded-lg",
            trend === 'up' ? 'bg-green-100 text-green-600' :
            trend === 'down' ? 'bg-red-100 text-red-600' :
            'bg-gray-100 text-gray-600'
          )}>
            <Icon className="h-6 w-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function TransactionItem({ transaction }: { transaction: Transaction }) {
  const Icon = transactionIcons[transaction.type] || ArrowUpRight;
  const isIncoming = transaction.direction === 'in';
  
  return (
    <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
      <div className="flex items-center gap-3">
        <div className={cn(
          "p-2 rounded-lg",
          isIncoming ? 'bg-green-100' : 'bg-red-100'
        )}>
          <Icon className={cn(
            "h-5 w-5",
            transactionColors[transaction.type] || 'text-gray-600'
          )} />
        </div>
        
        <div>
          <p className="font-medium text-sm">
            {transaction.description || transaction.type.replace('_', ' ')}
          </p>
          <p className="text-xs text-gray-500">
            {formatDistanceToNow(new Date(transaction.created_at), { addSuffix: true })}
          </p>
        </div>
      </div>

      <div className="text-right">
        <p className={cn(
          "font-bold",
          isIncoming ? 'text-green-600' : 'text-red-600'
        )}>
          {isIncoming ? '+' : '-'}{transaction.amount} 🪙
        </p>
        <Badge variant={transaction.status === 'completed' ? 'default' : 'secondary'} className="text-xs">
          {transaction.status}
        </Badge>
      </div>
    </div>
  );
}