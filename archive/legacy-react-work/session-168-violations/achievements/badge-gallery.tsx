'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { 
  Trophy, 
  Award, 
  Star, 
  Shield,
  Zap,
  Users,
  BookOpen,
  Target,
  Sparkles,
  Crown,
  Medal,
  Gem,
  Search,
  Filter,
  TrendingUp,
  Lock
} from 'lucide-react';
import { getAllAchievements } from '@/lib/actions/achievement-actions';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface BadgeItem {
  id: string;
  name: string;
  description: string;
  icon_url?: string;
  emcoin_reward: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  category: string;
  earned?: boolean;
  earned_at?: string;
  progress?: number;
  requirement_value?: number;
}

const rarityConfig = {
  common: {
    color: 'from-gray-400 to-gray-600',
    glow: 'shadow-gray-400/20',
    icon: Award,
    label: 'Common',
    borderAnimation: ''
  },
  rare: {
    color: 'from-blue-400 to-blue-600',
    glow: 'shadow-blue-400/30',
    icon: Star,
    label: 'Rare',
    borderAnimation: ''
  },
  epic: {
    color: 'from-purple-400 to-purple-600',
    glow: 'shadow-purple-400/40',
    icon: Gem,
    label: 'Epic',
    borderAnimation: 'animate-pulse'
  },
  legendary: {
    color: 'from-yellow-400 via-amber-500 to-orange-500',
    glow: 'shadow-yellow-400/50',
    icon: Crown,
    label: 'Legendary',
    borderAnimation: 'animate-spin-slow'
  }
};

const categoryConfig: { [key: string]: { icon: any, color: string } } = {
  'debate_wins': { icon: Trophy, color: 'text-yellow-500' },
  'participation': { icon: Users, color: 'text-blue-500' },
  'streaks': { icon: Zap, color: 'text-orange-500' },
  'social': { icon: Users, color: 'text-pink-500' },
  'academic': { icon: BookOpen, color: 'text-green-500' },
  'special_event': { icon: Sparkles, color: 'text-purple-500' },
  'milestone': { icon: Target, color: 'text-red-500' },
};

export function BadgeGallery({ userId }: { userId?: string }) {
  const [badges, setBadges] = useState<BadgeItem[]>([]);
  const [filteredBadges, setFilteredBadges] = useState<BadgeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRarity, setSelectedRarity] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [hoveredBadge, setHoveredBadge] = useState<string | null>(null);

  useEffect(() => {
    loadBadges();
  }, [userId]);

  useEffect(() => {
    filterBadges();
  }, [badges, searchTerm, selectedRarity, selectedCategory]);

  const loadBadges = async () => {
    setLoading(true);
    try {
      const result = await getAllAchievements();
      if (result.success) {
        setBadges(result.data || []);
      }
    } catch (error) {
      console.error('Error loading badges:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterBadges = () => {
    let filtered = [...badges];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(badge => 
        badge.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        badge.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Rarity filter
    if (selectedRarity !== 'all') {
      filtered = filtered.filter(badge => badge.rarity === selectedRarity);
    }

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(badge => badge.category === selectedCategory);
    }

    setFilteredBadges(filtered);
  };

  const stats = {
    total: badges.length,
    earned: badges.filter(b => b.earned).length,
    legendary: badges.filter(b => b.rarity === 'legendary' && b.earned).length,
    epic: badges.filter(b => b.rarity === 'epic' && b.earned).length,
    rare: badges.filter(b => b.rarity === 'rare' && b.earned).length,
    common: badges.filter(b => b.rarity === 'common' && b.earned).length,
  };

  const completionPercentage = stats.total > 0 ? (stats.earned / stats.total) * 100 : 0;

  const categories = ['all', ...new Set(badges.map(b => b.category))];
  const rarities = ['all', 'common', 'rare', 'epic', 'legendary'];

  return (
    <div className="space-y-6">
      {/* Gallery Header with Stats */}
      <Card className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Medal className="h-6 w-6 text-purple-500" />
              Badge Gallery
            </span>
            <Badge variant="secondary" className="text-lg px-3 py-1">
              {stats.earned}/{stats.total}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Overall Progress */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Collection Progress</span>
              <span className="font-bold">{completionPercentage.toFixed(1)}%</span>
            </div>
            <Progress value={completionPercentage} className="h-3" />
          </div>

          {/* Rarity Breakdown */}
          <div className="grid grid-cols-4 gap-3">
            {Object.entries(rarityConfig).map(([rarity, config]) => {
              const count = stats[rarity as keyof typeof stats] || 0;
              const total = badges.filter(b => b.rarity === rarity).length;
              const RarityIcon = config.icon;
              
              return (
                <div 
                  key={rarity}
                  className={cn(
                    "text-center p-3 rounded-lg bg-white/50 dark:bg-black/20",
                    "hover:scale-105 transition-transform cursor-pointer",
                    selectedRarity === rarity && "ring-2 ring-purple-500"
                  )}
                  onClick={() => setSelectedRarity(selectedRarity === rarity ? 'all' : rarity)}
                >
                  <RarityIcon className={cn(
                    "h-6 w-6 mx-auto mb-1",
                    `bg-gradient-to-br ${config.color} bg-clip-text text-transparent`
                  )} />
                  <p className="text-xs font-semibold capitalize">{rarity}</p>
                  <p className="text-xs text-gray-500">{count}/{total}</p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                name="search"
                placeholder="Search badges..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Category Filter */}
            <div className="flex gap-2 flex-wrap">
              {categories.map((cat) => (
                <Badge
                  key={cat}
                  variant={selectedCategory === cat ? 'default' : 'outline'}
                  className="cursor-pointer capitalize"
                  onClick={() => setSelectedCategory(cat)}
                >
                  {cat === 'all' ? 'All Categories' : cat.replace('_', ' ')}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Badge Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        <AnimatePresence>
          {filteredBadges.map((badge) => (
            <motion.div
              key={badge.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <BadgeCard
                badge={badge}
                onHover={setHoveredBadge}
                isHovered={hoveredBadge === badge.id}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Empty State */}
      {filteredBadges.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Search className="h-12 w-12 mx-auto mb-3 text-gray-300" />
            <p className="text-gray-500">No badges found</p>
            <p className="text-sm text-gray-400 mt-1">
              Try adjusting your filters
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function BadgeCard({ 
  badge, 
  onHover, 
  isHovered 
}: { 
  badge: BadgeItem;
  onHover: (id: string | null) => void;
  isHovered: boolean;
}) {
  const config = rarityConfig[badge.rarity];
  const CategoryIcon = categoryConfig[badge.category]?.icon || Award;
  const isEarned = badge.earned;

  return (
    <Card
      className={cn(
        "relative overflow-hidden cursor-pointer transition-all",
        isEarned 
          ? `bg-gradient-to-br ${config.color} text-white` 
          : 'bg-gray-100 dark:bg-gray-800',
        isHovered && `shadow-lg ${config.glow}`,
        !isEarned && 'opacity-60'
      )}
      onMouseEnter={() => onHover(badge.id)}
      onMouseLeave={() => onHover(null)}
    >
      <CardContent className="p-4">
        {/* Lock Overlay for Unearned */}
        {!isEarned && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-[1px]">
            <Lock className="h-6 w-6 text-white/50" />
          </div>
        )}

        {/* Badge Icon */}
        <div className={cn(
          "relative h-20 w-20 mx-auto mb-3",
          config.borderAnimation
        )}>
          <div className={cn(
            "absolute inset-0 rounded-full",
            isEarned && `bg-gradient-to-br ${config.color}`,
            !isEarned && 'bg-gray-300 dark:bg-gray-700'
          )} />
          <div className="absolute inset-2 bg-white/90 dark:bg-black/90 rounded-full flex items-center justify-center">
            <CategoryIcon className={cn(
              "h-8 w-8",
              isEarned ? categoryConfig[badge.category]?.color : 'text-gray-400'
            )} />
          </div>
          
          {/* Rarity Gem */}
          {badge.rarity !== 'common' && (
            <div className="absolute -top-1 -right-1">
              <Gem className={cn(
                "h-4 w-4",
                isEarned ? 'text-white' : 'text-gray-400'
              )} />
            </div>
          )}
        </div>

        {/* Badge Info */}
        <div className="text-center space-y-1">
          <p className={cn(
            "font-semibold text-sm line-clamp-1",
            isEarned ? 'text-white' : 'text-gray-700 dark:text-gray-300'
          )}>
            {badge.name}
          </p>
          
          {/* Reward */}
          {badge.emcoin_reward > 0 && (
            <p className={cn(
              "text-xs",
              isEarned ? 'text-white/80' : 'text-gray-500'
            )}>
              {badge.emcoin_reward} 🪙
            </p>
          )}

          {/* Progress Bar for Unearned */}
          {!isEarned && badge.requirement_value && badge.progress !== undefined && (
            <div className="mt-2">
              <Progress 
                value={(badge.progress / badge.requirement_value) * 100} 
                className="h-1"
              />
              <p className="text-xs text-gray-500 mt-1">
                {badge.progress}/{badge.requirement_value}
              </p>
            </div>
          )}

          {/* Earned Date */}
          {isEarned && badge.earned_at && (
            <p className="text-xs text-white/60">
              {new Date(badge.earned_at).toLocaleDateString()}
            </p>
          )}
        </div>

        {/* Hover Details */}
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute inset-x-0 bottom-0 bg-black/80 text-white p-3 text-xs"
          >
            {badge.description}
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}