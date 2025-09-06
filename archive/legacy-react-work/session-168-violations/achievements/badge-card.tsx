'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Trophy, 
  Lock, 
  Star,
  Crown,
  Gem,
  Shield,
  Award
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

export interface BadgeData {
  id: string;
  name: string;
  description: string;
  type: 'public' | 'members';
  category: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  icon_url?: string;
  emcoin_reward: number;
  requirement_value?: number;
  current_progress?: number;
  earned: boolean;
  earned_at?: string;
  task?: string;
  level?: number;
}

const rarityStyles = {
  common: {
    gradient: 'from-gray-400 to-gray-600',
    glow: 'shadow-gray-400/20',
    icon: Award,
    borderColor: 'border-gray-400'
  },
  rare: {
    gradient: 'from-blue-400 to-blue-600',
    glow: 'shadow-blue-400/30',
    icon: Star,
    borderColor: 'border-blue-400'
  },
  epic: {
    gradient: 'from-purple-400 to-purple-600',
    glow: 'shadow-purple-400/40',
    icon: Gem,
    borderColor: 'border-purple-400'
  },
  legendary: {
    gradient: 'from-yellow-400 via-amber-500 to-orange-500',
    glow: 'shadow-yellow-400/50',
    icon: Crown,
    borderColor: 'border-yellow-400'
  }
};

interface BadgeCardProps {
  badge?: BadgeData;
  loading?: boolean;
  error?: Error | null;
  onClick?: (badge: BadgeData) => void;
  compact?: boolean;
}

export function BadgeCard({ 
  badge, 
  loading = false, 
  error = null,
  onClick,
  compact = false
}: BadgeCardProps) {
  const [imageError, setImageError] = useState(false);
  
  // Handle loading state
  if (loading) {
    return (
      <Card className={cn(
        "relative overflow-hidden",
        compact ? "p-2" : "p-4"
      )}>
        <CardContent className="p-0">
          <Skeleton className={cn(
            "mx-auto rounded-full",
            compact ? "h-12 w-12" : "h-20 w-20"
          )} />
          <div className="mt-3 space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-3 w-2/3 mx-auto" />
          </div>
        </CardContent>
      </Card>
    );
  }

  // Handle error state
  if (error) {
    return (
      <Card className="relative overflow-hidden border-red-300 bg-red-50 dark:bg-red-950/20">
        <CardContent className="p-4 text-center">
          <Shield className="h-8 w-8 mx-auto text-red-500 mb-2" />
          <p className="text-sm text-red-600 dark:text-red-400">
            Failed to load badge
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {error.message}
          </p>
        </CardContent>
      </Card>
    );
  }

  // Handle empty state
  if (!badge) {
    return (
      <Card className="relative overflow-hidden border-dashed">
        <CardContent className="p-4 text-center">
          <div className="h-20 w-20 mx-auto rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
            <Lock className="h-8 w-8 text-gray-400" />
          </div>
          <p className="text-sm text-gray-500 mt-3">
            Badge not available
          </p>
        </CardContent>
      </Card>
    );
  }

  const rarityStyle = rarityStyles[badge.rarity];
  const RarityIcon = rarityStyle.icon;
  const isLocked = !badge.earned;
  const progress = badge.requirement_value 
    ? ((badge.current_progress || 0) / badge.requirement_value) * 100 
    : 0;

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <Card
        className={cn(
          "relative overflow-hidden cursor-pointer transition-all",
          "hover:shadow-lg",
          badge.earned && `bg-gradient-to-br ${rarityStyle.gradient}`,
          badge.earned && rarityStyle.glow,
          isLocked && "opacity-75",
          rarityStyle.borderColor,
          "border-2"
        )}
        onClick={() => onClick?.(badge)}
      >
        <CardContent className={cn(
          compact ? "p-3" : "p-4"
        )}>
          {/* Lock overlay for unearned badges */}
          {isLocked && (
            <div className="absolute inset-0 bg-black/10 backdrop-blur-[0.5px] z-10 flex items-center justify-center">
              <Lock className={cn(
                "text-gray-500/50",
                compact ? "h-4 w-4" : "h-6 w-6"
              )} />
            </div>
          )}

          {/* Badge Icon */}
          <div className={cn(
            "relative mx-auto mb-3",
            compact ? "h-12 w-12" : "h-20 w-20"
          )}>
            <div className={cn(
              "absolute inset-0 rounded-full flex items-center justify-center",
              badge.earned 
                ? `bg-gradient-to-br ${rarityStyle.gradient}` 
                : "bg-gray-200 dark:bg-gray-700"
            )}>
              {badge.icon_url && !imageError ? (
                <img 
                  src={badge.icon_url}
                  alt={badge.name}
                  className={cn(
                    "rounded-full",
                    compact ? "h-10 w-10" : "h-16 w-16"
                  )}
                  onError={() => setImageError(true)}
                />
              ) : (
                <RarityIcon className={cn(
                  badge.earned ? "text-white" : "text-gray-400",
                  compact ? "h-6 w-6" : "h-10 w-10"
                )} />
              )}
            </div>

            {/* Level indicator */}
            {badge.level && badge.level > 1 && (
              <div className="absolute -bottom-1 -right-1 bg-white dark:bg-gray-900 rounded-full px-1.5 py-0.5">
                <span className={cn(
                  "font-bold",
                  compact ? "text-xs" : "text-sm",
                  badge.earned ? "text-purple-600" : "text-gray-500"
                )}>
                  LV.{badge.level}
                </span>
              </div>
            )}
          </div>

          {/* Badge Info */}
          <div className="text-center relative z-20">
            <p className={cn(
              "font-semibold line-clamp-1",
              compact ? "text-xs" : "text-sm",
              badge.earned ? "text-white" : "text-gray-700 dark:text-gray-300"
            )}>
              {badge.name}
            </p>

            {/* Type badge */}
            {!compact && (
              <Badge 
                variant={badge.earned ? "secondary" : "outline"}
                className={cn(
                  "mt-1",
                  compact ? "text-xs px-1 py-0" : "text-xs"
                )}
              >
                {badge.type === 'public' ? '👥' : '🔒'} {badge.type}
              </Badge>
            )}

            {/* Task description */}
            {!compact && badge.task && (
              <p className={cn(
                "mt-2 line-clamp-2",
                "text-xs",
                badge.earned ? "text-white/80" : "text-gray-500"
              )}>
                Task: {badge.task}
              </p>
            )}

            {/* Reward */}
            {badge.emcoin_reward > 0 && (
              <p className={cn(
                "mt-1",
                compact ? "text-xs" : "text-sm",
                badge.earned ? "text-white/90" : "text-gray-600 dark:text-gray-400"
              )}>
                🪙 {badge.emcoin_reward}
              </p>
            )}

            {/* Progress bar for locked badges */}
            {isLocked && badge.requirement_value && (
              <div className="mt-2 space-y-1">
                <Progress 
                  value={progress} 
                  className={cn(
                    compact ? "h-1" : "h-1.5"
                  )}
                />
                <p className="text-xs text-gray-500">
                  {badge.current_progress || 0}/{badge.requirement_value}
                </p>
              </div>
            )}

            {/* Status */}
            {badge.earned ? (
              <p className={cn(
                "mt-1 font-medium",
                compact ? "text-xs" : "text-sm",
                "text-white/90"
              )}>
                ✓ Earned
              </p>
            ) : (
              <p className={cn(
                "mt-1",
                compact ? "text-xs" : "text-sm",
                progress === 100 ? "text-green-600 font-medium" : "text-gray-500"
              )}>
                {progress === 100 ? 'Ready' : 'In Progress'}
              </p>
            )}

            {/* Earned date */}
            {badge.earned && badge.earned_at && !compact && (
              <p className="text-xs text-white/60 mt-1">
                {new Date(badge.earned_at).toLocaleDateString()}
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}