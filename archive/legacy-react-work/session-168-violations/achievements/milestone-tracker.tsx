'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { 
  Trophy, 
  Star, 
  Target,
  Zap,
  Medal,
  CheckCircle2,
  Circle,
  ChevronRight,
  Lock,
  Sparkles,
  AlertCircle,
  Gift
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export interface Milestone {
  id: string;
  name: string;
  description: string;
  target: number;
  current: number;
  reward: {
    emcoins?: number;
    badge?: string;
    title?: string;
  };
  category: 'badges' | 'emcoins' | 'activities' | 'streaks' | 'social';
  completed: boolean;
  completedAt?: string;
  claimable: boolean;
  claimed: boolean;
  order: number;
}

interface MilestoneTrackerProps {
  milestones?: Milestone[];
  loading?: boolean;
  error?: Error | null;
  onClaim?: (milestoneId: string) => Promise<void>;
  compact?: boolean;
  showCompleted?: boolean;
}

const categoryIcons = {
  badges: Trophy,
  emcoins: Zap,
  activities: Target,
  streaks: Star,
  social: Medal
};

const categoryColors = {
  badges: 'text-purple-600 bg-purple-100',
  emcoins: 'text-amber-600 bg-amber-100',
  activities: 'text-blue-600 bg-blue-100',
  streaks: 'text-orange-600 bg-orange-100',
  social: 'text-pink-600 bg-pink-100'
};

export function MilestoneTracker({
  milestones = [],
  loading = false,
  error = null,
  onClaim,
  compact = false,
  showCompleted = true
}: MilestoneTrackerProps) {
  const [claimingId, setClaimingId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed' | 'claimable'>('all');

  // Filter milestones
  const filteredMilestones = milestones.filter(m => {
    switch (filter) {
      case 'active':
        return !m.completed && !m.claimed;
      case 'completed':
        return m.completed || m.claimed;
      case 'claimable':
        return m.claimable && !m.claimed;
      default:
        return showCompleted || (!m.completed && !m.claimed);
    }
  }).sort((a, b) => {
    // Sort by: claimable first, then active, then completed
    if (a.claimable && !b.claimable) return -1;
    if (!a.claimable && b.claimable) return 1;
    if (!a.completed && b.completed) return -1;
    if (a.completed && !b.completed) return 1;
    return a.order - b.order;
  });

  const handleClaim = async (milestoneId: string) => {
    if (!onClaim) return;
    
    setClaimingId(milestoneId);
    try {
      await onClaim(milestoneId);
    } finally {
      setClaimingId(null);
    }
  };

  // Handle loading state
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-40" />
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <Skeleton key={i} className="h-20 w-full" />
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
            Milestone Tracker Error
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600">{error.message}</p>
        </CardContent>
      </Card>
    );
  }

  // Handle empty state
  if (milestones.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Milestone Tracker
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Target className="h-12 w-12 mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500">No milestones available</p>
            <p className="text-xs text-gray-400 mt-1">
              Complete achievements to unlock milestones
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const stats = {
    total: milestones.length,
    completed: milestones.filter(m => m.completed || m.claimed).length,
    claimable: milestones.filter(m => m.claimable && !m.claimed).length,
    active: milestones.filter(m => !m.completed && !m.claimed).length
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-blue-600" />
            Milestone Tracker
          </CardTitle>
          <div className="flex items-center gap-2">
            {stats.claimable > 0 && (
              <Badge variant="default" className="animate-pulse">
                {stats.claimable} to claim!
              </Badge>
            )}
            <Badge variant="secondary">
              {stats.completed}/{stats.total}
            </Badge>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Filter Tabs */}
        {!compact && (
          <div className="flex gap-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg">
            {(['all', 'active', 'claimable', 'completed'] as const).map(f => (
              <Button
                key={f}
                variant={filter === f ? 'default' : 'ghost'}
                size="sm"
                className="flex-1 capitalize"
                onClick={() => setFilter(f)}
              >
                {f}
                {f === 'claimable' && stats.claimable > 0 && (
                  <span className="ml-1 text-xs">({stats.claimable})</span>
                )}
              </Button>
            ))}
          </div>
        )}

        {/* Milestones List */}
        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {filteredMilestones.map((milestone) => (
              <MilestoneItem
                key={milestone.id}
                milestone={milestone}
                isExpanded={expandedId === milestone.id}
                onToggle={() => setExpandedId(
                  expandedId === milestone.id ? null : milestone.id
                )}
                onClaim={handleClaim}
                isClaiming={claimingId === milestone.id}
                compact={compact}
              />
            ))}
          </AnimatePresence>
        </div>

        {/* Empty state for filter */}
        {filteredMilestones.length === 0 && (
          <div className="text-center py-6">
            <Circle className="h-8 w-8 mx-auto text-gray-300 mb-2" />
            <p className="text-sm text-gray-500">
              No {filter === 'all' ? '' : filter} milestones
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function MilestoneItem({
  milestone,
  isExpanded,
  onToggle,
  onClaim,
  isClaiming,
  compact
}: {
  milestone: Milestone;
  isExpanded: boolean;
  onToggle: () => void;
  onClaim: (id: string) => void;
  isClaiming: boolean;
  compact?: boolean;
}) {
  const progress = (milestone.current / milestone.target) * 100;
  const isComplete = milestone.completed || milestone.claimed;
  const CategoryIcon = categoryIcons[milestone.category];
  const categoryStyle = categoryColors[milestone.category];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={cn(
        "border rounded-lg transition-all",
        milestone.claimable && !milestone.claimed && "ring-2 ring-green-500 ring-offset-2",
        isComplete && "opacity-75"
      )}
    >
      <div 
        className={cn(
          "p-3 cursor-pointer",
          !compact && "hover:bg-gray-50 dark:hover:bg-gray-800"
        )}
        onClick={onToggle}
      >
        <div className="flex items-start gap-3">
          {/* Status Icon */}
          <div className="mt-0.5">
            {milestone.claimed ? (
              <CheckCircle2 className="h-5 w-5 text-green-600" />
            ) : milestone.completed ? (
              <Gift className="h-5 w-5 text-amber-500 animate-bounce" />
            ) : (
              <Circle className="h-5 w-5 text-gray-400" />
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {/* Title and Category */}
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className={cn(
                "font-medium",
                compact ? "text-sm" : "text-base",
                isComplete && "line-through text-gray-500"
              )}>
                {milestone.name}
              </h4>
              <Badge 
                variant="secondary"
                className={cn(categoryStyle, "text-xs")}
              >
                <CategoryIcon className="h-3 w-3 mr-1" />
                {milestone.category}
              </Badge>
            </div>

            {/* Progress */}
            {!isComplete && (
              <div className="mt-2 space-y-1">
                <Progress value={progress} className="h-2" />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>{milestone.current}/{milestone.target}</span>
                  <span>{progress.toFixed(0)}%</span>
                </div>
              </div>
            )}

            {/* Claimable Badge */}
            {milestone.claimable && !milestone.claimed && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="mt-2"
              >
                <Button
                  size="sm"
                  variant="default"
                  className="w-full sm:w-auto"
                  onClick={(e) => {
                    e.stopPropagation();
                    onClaim(milestone.id);
                  }}
                  disabled={isClaiming}
                >
                  {isClaiming ? (
                    <>
                      <Sparkles className="h-4 w-4 mr-1 animate-spin" />
                      Claiming...
                    </>
                  ) : (
                    <>
                      <Gift className="h-4 w-4 mr-1" />
                      Claim Rewards
                    </>
                  )}
                </Button>
              </motion.div>
            )}
          </div>

          {/* Expand Icon */}
          {!compact && (
            <ChevronRight className={cn(
              "h-4 w-4 text-gray-400 transition-transform",
              isExpanded && "rotate-90"
            )} />
          )}
        </div>
      </div>

      {/* Expanded Details */}
      <AnimatePresence>
        {isExpanded && !compact && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t"
          >
            <div className="p-3 space-y-2">
              <p className="text-sm text-gray-600">{milestone.description}</p>
              
              {/* Rewards */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs text-gray-500">Rewards:</span>
                {milestone.reward.emcoins && (
                  <Badge variant="outline" className="text-xs">
                    🪙 {milestone.reward.emcoins} EmCoins
                  </Badge>
                )}
                {milestone.reward.badge && (
                  <Badge variant="outline" className="text-xs">
                    🏆 {milestone.reward.badge}
                  </Badge>
                )}
                {milestone.reward.title && (
                  <Badge variant="outline" className="text-xs">
                    📛 {milestone.reward.title}
                  </Badge>
                )}
              </div>

              {/* Completion Date */}
              {milestone.completedAt && (
                <p className="text-xs text-gray-500">
                  Completed: {new Date(milestone.completedAt).toLocaleDateString()}
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}