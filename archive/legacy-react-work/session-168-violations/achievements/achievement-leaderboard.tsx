'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Trophy, 
  Crown,
  Medal,
  Star,
  TrendingUp,
  TrendingDown,
  Minus,
  Users,
  Calendar,
  Clock,
  AlertCircle,
  ChevronUp,
  ChevronDown,
  Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export interface LeaderboardUser {
  id: string;
  username: string;
  display_name: string;
  avatar_url?: string;
  badge_count: number;
  emcoin_total: number;
  rare_badges: number;
  epic_badges: number;
  legendary_badges: number;
  streak_days: number;
  rank: number;
  previousRank?: number;
  level: number;
  title?: string;
  isCurrentUser?: boolean;
}

interface LeaderboardProps {
  users?: LeaderboardUser[];
  loading?: boolean;
  error?: Error | null;
  currentUserId?: string;
  timeframe?: 'all' | 'month' | 'week' | 'today';
  onTimeframeChange?: (timeframe: 'all' | 'month' | 'week' | 'today') => void;
  compact?: boolean;
  limit?: number;
}

const getRankIcon = (rank: number) => {
  switch (rank) {
    case 1:
      return { icon: Crown, color: 'text-yellow-500', bg: 'bg-yellow-100 dark:bg-yellow-950' };
    case 2:
      return { icon: Medal, color: 'text-gray-400', bg: 'bg-gray-100 dark:bg-gray-800' };
    case 3:
      return { icon: Medal, color: 'text-orange-600', bg: 'bg-orange-100 dark:bg-orange-950' };
    default:
      return { icon: Star, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-950' };
  }
};

const getRankChange = (current: number, previous?: number) => {
  if (!previous) return { icon: Minus, color: 'text-gray-400', text: '-' };
  const diff = previous - current;
  if (diff > 0) return { icon: TrendingUp, color: 'text-green-600', text: `+${diff}` };
  if (diff < 0) return { icon: TrendingDown, color: 'text-red-600', text: `${diff}` };
  return { icon: Minus, color: 'text-gray-400', text: '-' };
};

export function AchievementLeaderboard({
  users = [],
  loading = false,
  error = null,
  currentUserId,
  timeframe = 'all',
  onTimeframeChange,
  compact = false,
  limit = 10
}: LeaderboardProps) {
  const [expandedUserId, setExpandedUserId] = useState<string | null>(null);
  const [selectedTab, setSelectedTab] = useState<'badges' | 'emcoins' | 'streaks'>('badges');

  // Sort users based on selected tab
  const sortedUsers = [...users].sort((a, b) => {
    switch (selectedTab) {
      case 'emcoins':
        return b.emcoin_total - a.emcoin_total;
      case 'streaks':
        return b.streak_days - a.streak_days;
      default:
        return b.badge_count - a.badge_count;
    }
  }).slice(0, limit);

  // Find current user's position
  const currentUserPosition = users.findIndex(u => u.id === currentUserId || u.isCurrentUser);
  const currentUser = currentUserPosition >= 0 ? users[currentUserPosition] : null;

  // Handle loading state
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="flex-1">
                  <Skeleton className="h-4 w-32 mb-1" />
                  <Skeleton className="h-3 w-24" />
                </div>
                <Skeleton className="h-6 w-12" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Handle error state  
  if (error) {
    return (
      <Card className="border-red-300">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-600">
            <AlertCircle className="h-5 w-5" />
            Leaderboard Error
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600">{error.message}</p>
        </CardContent>
      </Card>
    );
  }

  // Handle empty state
  if (users.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            Achievement Leaderboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Users className="h-12 w-12 mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500">No leaderboard data available</p>
            <p className="text-xs text-gray-400 mt-1">
              Complete achievements to appear on the leaderboard
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-500" />
            Achievement Leaderboard
          </CardTitle>
          
          {/* Timeframe selector */}
          {!compact && onTimeframeChange && (
            <div className="flex gap-1">
              {(['today', 'week', 'month', 'all'] as const).map((tf) => (
                <Button
                  key={tf}
                  variant={timeframe === tf ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => onTimeframeChange(tf)}
                  className="capitalize"
                >
                  <Clock className="h-3 w-3 mr-1" />
                  {tf === 'all' ? 'All Time' : tf}
                </Button>
              ))}
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Tabs for different leaderboards */}
        {!compact && (
          <Tabs value={selectedTab} onValueChange={(v) => setSelectedTab(v as typeof selectedTab)}>
            <TabsList className="grid grid-cols-3 w-full">
              <TabsTrigger value="badges">
                <Trophy className="h-4 w-4 mr-1" />
                Badges
              </TabsTrigger>
              <TabsTrigger value="emcoins">
                <span className="mr-1">🪙</span>
                EmCoins
              </TabsTrigger>
              <TabsTrigger value="streaks">
                <Star className="h-4 w-4 mr-1" />
                Streaks
              </TabsTrigger>
            </TabsList>
          </Tabs>
        )}

        {/* Top 3 Podium */}
        {!compact && sortedUsers.length >= 3 && (
          <div className="grid grid-cols-3 gap-2 mb-4">
            {[1, 0, 2].map((index) => {
              const user = sortedUsers[index];
              if (!user) return null;
              const rankConfig = getRankIcon(index + 1);
              const RankIcon = rankConfig.icon;

              return (
                <motion.div
                  key={user.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={cn(
                    "relative text-center p-3 rounded-lg",
                    rankConfig.bg,
                    index === 0 && "order-2 scale-110 z-10"
                  )}
                >
                  <RankIcon className={cn(
                    "h-6 w-6 mx-auto mb-2",
                    rankConfig.color
                  )} />
                  <Avatar className="h-12 w-12 mx-auto mb-2 ring-2 ring-white">
                    <AvatarImage src={user.avatar_url} />
                    <AvatarFallback>{user.display_name[0]}</AvatarFallback>
                  </Avatar>
                  <p className="font-semibold text-sm truncate">
                    {user.display_name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {selectedTab === 'badges' && `${user.badge_count} badges`}
                    {selectedTab === 'emcoins' && `${user.emcoin_total} 🪙`}
                    {selectedTab === 'streaks' && `${user.streak_days} days`}
                  </p>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Leaderboard List */}
        <div className="space-y-2">
          <AnimatePresence mode="popLayout">
            {sortedUsers.map((user, index) => {
              const rankConfig = getRankIcon(user.rank || index + 1);
              const RankIcon = rankConfig.icon;
              const rankChange = getRankChange(user.rank || index + 1, user.previousRank);
              const RankChangeIcon = rankChange.icon;
              const isExpanded = expandedUserId === user.id;

              return (
                <motion.div
                  key={user.id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={cn(
                    "flex items-center gap-3 p-3 rounded-lg transition-all",
                    "hover:bg-gray-50 dark:hover:bg-gray-800",
                    user.isCurrentUser && "ring-2 ring-blue-500 ring-offset-2",
                    compact && index >= 5 && "hidden"
                  )}
                  onClick={() => !compact && setExpandedUserId(isExpanded ? null : user.id)}
                >
                  {/* Rank */}
                  <div className="flex items-center gap-2 w-16">
                    <div className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center",
                      user.rank <= 3 ? rankConfig.bg : 'bg-gray-100 dark:bg-gray-800'
                    )}>
                      {user.rank <= 3 ? (
                        <RankIcon className={cn("h-4 w-4", rankConfig.color)} />
                      ) : (
                        <span className="text-sm font-bold text-gray-600">
                          {user.rank || index + 1}
                        </span>
                      )}
                    </div>
                    {!compact && user.previousRank && (
                      <div className="flex items-center">
                        <RankChangeIcon className={cn("h-3 w-3", rankChange.color)} />
                      </div>
                    )}
                  </div>

                  {/* User Info */}
                  <div className="flex-1 flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={user.avatar_url} />
                      <AvatarFallback>{user.display_name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-medium truncate">
                          {user.display_name}
                        </p>
                        {user.title && !compact && (
                          <Badge variant="outline" className="text-xs">
                            {user.title}
                          </Badge>
                        )}
                        {user.isCurrentUser && (
                          <Badge variant="default" className="text-xs">
                            You
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span>Lv.{user.level}</span>
                        {!compact && (
                          <>
                            <span>•</span>
                            <span>{user.badge_count} badges</span>
                            {user.legendary_badges > 0 && (
                              <>
                                <span>•</span>
                                <span className="text-amber-600">
                                  {user.legendary_badges} legendary
                                </span>
                              </>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="text-right">
                    <p className="font-bold text-lg">
                      {selectedTab === 'badges' && user.badge_count}
                      {selectedTab === 'emcoins' && (
                        <span className="flex items-center gap-1">
                          {user.emcoin_total}
                          <span>🪙</span>
                        </span>
                      )}
                      {selectedTab === 'streaks' && `${user.streak_days}d`}
                    </p>
                    {!compact && (
                      <p className="text-xs text-gray-500">
                        {selectedTab === 'badges' && 'badges'}
                        {selectedTab === 'emcoins' && 'total'}
                        {selectedTab === 'streaks' && 'streak'}
                      </p>
                    )}
                  </div>

                  {/* Expand indicator */}
                  {!compact && (
                    <ChevronDown className={cn(
                      "h-4 w-4 text-gray-400 transition-transform",
                      isExpanded && "rotate-180"
                    )} />
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Current User Position (if not in top) */}
        {currentUser && currentUserPosition >= limit && (
          <div className="border-t pt-3">
            <p className="text-xs text-gray-500 mb-2">Your Position</p>
            <div className={cn(
              "flex items-center gap-3 p-3 rounded-lg",
              "bg-blue-50 dark:bg-blue-950/20 border border-blue-200"
            )}>
              <div className="w-16">
                <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                  <span className="text-sm font-bold text-blue-600">
                    {currentUserPosition + 1}
                  </span>
                </div>
              </div>
              <div className="flex-1 flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={currentUser.avatar_url} />
                  <AvatarFallback>{currentUser.display_name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{currentUser.display_name}</p>
                  <p className="text-xs text-gray-500">
                    Lv.{currentUser.level} • {currentUser.badge_count} badges
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-lg">
                  {selectedTab === 'badges' && currentUser.badge_count}
                  {selectedTab === 'emcoins' && `${currentUser.emcoin_total} 🪙`}
                  {selectedTab === 'streaks' && `${currentUser.streak_days}d`}
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}