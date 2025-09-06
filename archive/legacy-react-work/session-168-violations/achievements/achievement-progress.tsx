'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Trophy, 
  Award, 
  Star, 
  Crown,
  Gem,
  TrendingUp,
  Target,
  ChevronUp,
  AlertCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export interface AchievementStats {
  totalBadges: number;
  earnedBadges: number;
  totalEmCoins: number;
  earnedEmCoins: number;
  categoryProgress: {
    category: string;
    earned: number;
    total: number;
    percentage: number;
  }[];
  rarityBreakdown: {
    common: { earned: number; total: number };
    rare: { earned: number; total: number };
    epic: { earned: number; total: number };
    legendary: { earned: number; total: number };
  };
  recentAchievements: {
    id: string;
    name: string;
    earnedAt: string;
  }[];
  nextMilestone?: {
    name: string;
    target: number;
    current: number;
  };
}

interface AchievementProgressProps {
  stats?: AchievementStats;
  loading?: boolean;
  error?: Error | null;
  compact?: boolean;
  showDetails?: boolean;
}

const rarityColors = {
  common: { bg: 'bg-gray-500', text: 'text-gray-600', icon: Award },
  rare: { bg: 'bg-blue-500', text: 'text-blue-600', icon: Star },
  epic: { bg: 'bg-purple-500', text: 'text-purple-600', icon: Gem },
  legendary: { bg: 'bg-amber-500', text: 'text-amber-600', icon: Crown }
};

export function AchievementProgress({ 
  stats,
  loading = false,
  error = null,
  compact = false,
  showDetails = true
}: AchievementProgressProps) {
  const [expanded, setExpanded] = useState(!compact);
  const [animatedProgress, setAnimatedProgress] = useState(0);

  const overallProgress = stats 
    ? (stats.earnedBadges / stats.totalBadges) * 100 
    : 0;

  useEffect(() => {
    // Animate progress on load
    const timer = setTimeout(() => {
      setAnimatedProgress(overallProgress);
    }, 100);
    return () => clearTimeout(timer);
  }, [overallProgress]);

  // Handle loading state
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-12 w-full" />
            <div className="grid grid-cols-2 gap-4">
              <Skeleton className="h-20" />
              <Skeleton className="h-20" />
            </div>
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
            Achievement Progress Error
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600">{error.message}</p>
          <p className="text-xs text-gray-500 mt-2">
            Unable to load achievement statistics
          </p>
        </CardContent>
      </Card>
    );
  }

  // Handle empty state
  if (!stats) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            Achievement Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-gray-500 py-8">
            No achievement data available
          </p>
        </CardContent>
      </Card>
    );
  }

  const getProgressColor = (percentage: number) => {
    if (percentage >= 75) return 'text-green-600';
    if (percentage >= 50) return 'text-blue-600';
    if (percentage >= 25) return 'text-yellow-600';
    return 'text-gray-600';
  };

  const getProgressBarColor = (percentage: number) => {
    if (percentage >= 75) return 'bg-green-500';
    if (percentage >= 50) return 'bg-blue-500';
    if (percentage >= 25) return 'bg-yellow-500';
    return 'bg-gray-400';
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader 
        className={cn(
          "cursor-pointer select-none",
          compact && "pb-2"
        )}
        onClick={() => compact && setExpanded(!expanded)}
      >
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-500" />
            Achievement Progress
          </span>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-sm">
              {stats.earnedBadges}/{stats.totalBadges}
            </Badge>
            {compact && (
              <ChevronUp className={cn(
                "h-4 w-4 transition-transform",
                !expanded && "rotate-180"
              )} />
            )}
          </div>
        </CardTitle>
      </CardHeader>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <CardContent className="space-y-4">
              {/* Overall Progress */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Overall Completion</span>
                  <span className={cn(
                    "text-lg font-bold",
                    getProgressColor(overallProgress)
                  )}>
                    {overallProgress.toFixed(1)}%
                  </span>
                </div>
                <div className="relative">
                  <Progress 
                    value={animatedProgress} 
                    className="h-3"
                  />
                  {stats.nextMilestone && (
                    <div 
                      className="absolute top-0 h-3 w-0.5 bg-black/20"
                      style={{ left: `${(stats.nextMilestone.current / stats.nextMilestone.target) * 100}%` }}
                    />
                  )}
                </div>
                {stats.nextMilestone && (
                  <p className="text-xs text-gray-500">
                    Next milestone: {stats.nextMilestone.name} ({stats.nextMilestone.current}/{stats.nextMilestone.target})
                  </p>
                )}
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-3">
                {/* EmCoins Earned */}
                <div className="bg-amber-50 dark:bg-amber-950/20 rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-600 dark:text-gray-400">EmCoins</span>
                    <span className="text-xl">🪙</span>
                  </div>
                  <p className="text-lg font-bold text-amber-600">
                    {stats.earnedEmCoins}
                  </p>
                  <p className="text-xs text-gray-500">
                    of {stats.totalEmCoins} possible
                  </p>
                </div>

                {/* Completion Rate */}
                <div className="bg-blue-50 dark:bg-blue-950/20 rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-600 dark:text-gray-400">Rate</span>
                    <TrendingUp className="h-4 w-4 text-blue-500" />
                  </div>
                  <p className="text-lg font-bold text-blue-600">
                    {overallProgress.toFixed(0)}%
                  </p>
                  <p className="text-xs text-gray-500">
                    completion
                  </p>
                </div>
              </div>

              {/* Rarity Breakdown */}
              {showDetails && (
                <div className="space-y-2">
                  <p className="text-sm font-medium">Rarity Breakdown</p>
                  <div className="grid grid-cols-4 gap-2">
                    {Object.entries(stats.rarityBreakdown).map(([rarity, data]) => {
                      const config = rarityColors[rarity as keyof typeof rarityColors];
                      const Icon = config.icon;
                      const percentage = data.total > 0 
                        ? (data.earned / data.total) * 100 
                        : 0;

                      return (
                        <div 
                          key={rarity}
                          className="text-center p-2 rounded-lg bg-gray-50 dark:bg-gray-800"
                        >
                          <Icon className={cn("h-5 w-5 mx-auto mb-1", config.text)} />
                          <p className="text-xs font-medium capitalize">{rarity}</p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            {data.earned}/{data.total}
                          </p>
                          <Progress 
                            value={percentage} 
                            className="h-1 mt-1"
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Category Progress */}
              {showDetails && stats.categoryProgress.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-medium">Category Progress</p>
                  <div className="space-y-2">
                    {stats.categoryProgress.slice(0, 3).map((cat) => (
                      <div key={cat.category} className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="capitalize">
                            {cat.category.replace(/_/g, ' ')}
                          </span>
                          <span className="text-gray-500">
                            {cat.earned}/{cat.total}
                          </span>
                        </div>
                        <Progress 
                          value={cat.percentage} 
                          className="h-1.5"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recent Achievements */}
              {stats.recentAchievements.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-medium">Recent Unlocks</p>
                  <div className="space-y-1">
                    {stats.recentAchievements.slice(0, 3).map((achievement) => (
                      <div 
                        key={achievement.id}
                        className="flex items-center justify-between text-xs p-2 rounded bg-gray-50 dark:bg-gray-800"
                      >
                        <span className="flex items-center gap-1">
                          <Trophy className="h-3 w-3 text-yellow-500" />
                          {achievement.name}
                        </span>
                        <span className="text-gray-500">
                          {new Date(achievement.earnedAt).toLocaleDateString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}