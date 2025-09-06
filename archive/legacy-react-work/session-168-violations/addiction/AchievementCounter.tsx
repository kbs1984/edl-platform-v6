'use client';

import { useState, useEffect } from 'react';
import { Card, Skeleton, ErrorAlert } from '@/shared/base-components';
import { useGlobalStore } from '@/contexts/global-state';
import { tokens } from '@/shared/design-tokens';
import { createClient } from '@/utils/supabase/client';
import { cn } from '@/lib/utils';

interface AchievementCategory {
  name: string;
  icon: string;
  count: number;
  total: number;
  color: string;
}

interface RecentAchievement {
  id: string;
  name: string;
  icon: string;
  unlockedAt: Date;
}

export function AchievementCounter() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [categories, setCategories] = useState<AchievementCategory[]>([]);
  const [recentAchievements, setRecentAchievements] = useState<RecentAchievement[]>([]);
  const [totalAchievements, setTotalAchievements] = useState({ earned: 0, total: 0 });
  const [animatingId, setAnimatingId] = useState<string | null>(null);
  
  const { user, updateAchievements } = useGlobalStore();
  const supabase = createClient();

  useEffect(() => {
    fetchAchievementData()
      .then(() => setLoading(false))
      .catch(setError);
      
    // Set up real-time subscription for new achievements
    setupAchievementSubscription();
  }, []);

  async function fetchAchievementData() {
    try {
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      if (!currentUser) throw new Error('Not authenticated');

      // Fetch all achievements
      const { data: allAchievements, error: allError } = await supabase
        .from('achievements')
        .select('*')
        .order('category');
        
      if (allError) throw allError;

      // Fetch user's achievements
      const { data: userAchievements, error: userError } = await supabase
        .from('user_achievements')
        .select('*, achievement:achievements(*)')
        .eq('user_id', currentUser.id)
        .order('unlocked_at', { ascending: false });
        
      if (userError) throw userError;

      // Process categories
      const categoryMap = new Map<string, AchievementCategory>();
      const categoryColors: Record<string, string> = {
        'social': tokens.colors.primary,
        'learning': tokens.colors.success,
        'participation': tokens.colors.warning,
        'excellence': tokens.colors.addiction.trophy,
        'special': tokens.colors.addiction.eye
      };
      
      const categoryIcons: Record<string, string> = {
        'social': '👥',
        'learning': '📚',
        'participation': '🎯',
        'excellence': '🏆',
        'special': '⭐'
      };

      // Count total achievements by category
      allAchievements?.forEach(achievement => {
        const category = achievement.category || 'general';
        if (!categoryMap.has(category)) {
          categoryMap.set(category, {
            name: category,
            icon: categoryIcons[category] || '🎖️',
            count: 0,
            total: 0,
            color: categoryColors[category] || tokens.colors.primary
          });
        }
        const cat = categoryMap.get(category)!;
        cat.total++;
      });

      // Count earned achievements by category
      userAchievements?.forEach(userAch => {
        const category = userAch.achievement?.category || 'general';
        const cat = categoryMap.get(category);
        if (cat) cat.count++;
      });

      setCategories(Array.from(categoryMap.values()));
      
      // Set recent achievements
      const recent = userAchievements?.slice(0, 5).map(ua => ({
        id: ua.id,
        name: ua.achievement?.name || 'Unknown',
        icon: ua.achievement?.icon || '🏅',
        unlockedAt: new Date(ua.unlocked_at)
      })) || [];
      
      setRecentAchievements(recent);
      
      // Update totals
      const earned = userAchievements?.length || 0;
      const total = allAchievements?.length || 0;
      setTotalAchievements({ earned, total });
      updateAchievements(earned);
      
    } catch (err) {
      console.error('Error fetching achievement data:', err);
      throw err;
    }
  }

  async function setupAchievementSubscription() {
    const { data: { user: currentUser } } = await supabase.auth.getUser();
    if (!currentUser) return;

    const channel = supabase
      .channel('achievement-unlocks')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'user_achievements',
          filter: `user_id=eq.${currentUser.id}`
        },
        async (payload: any) => {
          // New achievement unlocked!
          setAnimatingId(payload.new.id);
          setTimeout(() => setAnimatingId(null), 3000);
          
          // Refresh achievement data
          await fetchAchievementData();
          
          // Show celebration
          celebrateAchievement(payload.new);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }

  function celebrateAchievement(achievement: any) {
    // This could trigger a global celebration animation
    console.log('🎉 New achievement unlocked!', achievement);
    
    // You could dispatch a global event here for other components to react
    window.dispatchEvent(new CustomEvent('achievement-unlocked', { 
      detail: achievement 
    }));
  }

  function getProgressColor(percentage: number): string {
    if (percentage >= 80) return tokens.colors.success;
    if (percentage >= 50) return tokens.colors.warning;
    return tokens.colors.muted || '#888';
  }

  if (loading) return <Skeleton className="h-48 w-full" />;
  if (error) return <ErrorAlert message={`Failed to load achievements: ${error.message}`} />;

  const overallProgress = totalAchievements.total > 0 
    ? Math.round((totalAchievements.earned / totalAchievements.total) * 100)
    : 0;

  return (
    <div className="space-y-4">
      {/* Main Counter Card */}
      <Card className="relative overflow-hidden">
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            background: `radial-gradient(circle at top right, ${tokens.colors.addiction.trophy} 0%, transparent 70%)`
          }}
        />
        
        <div className="relative p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold">Achievements</h3>
              <p className="text-sm text-muted-foreground">
                Your journey of excellence
              </p>
            </div>
            <div className="text-5xl">🏆</div>
          </div>
          
          {/* Overall Progress */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Overall Progress</span>
              <span className="font-bold">
                {totalAchievements.earned} / {totalAchievements.total}
              </span>
            </div>
            <div className="h-3 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full transition-all duration-500"
                style={{
                  width: `${overallProgress}%`,
                  backgroundColor: getProgressColor(overallProgress)
                }}
              />
            </div>
            <p className="text-xs text-muted-foreground text-right">
              {overallProgress}% Complete
            </p>
          </div>
        </div>
      </Card>

      {/* Categories Breakdown */}
      <Card>
        <div className="p-6">
          <h4 className="text-sm font-semibold mb-4">Categories</h4>
          <div className="space-y-3">
            {categories.map((category) => {
              const percentage = category.total > 0 
                ? Math.round((category.count / category.total) * 100)
                : 0;
                
              return (
                <div key={category.name} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{category.icon}</span>
                      <span className="capitalize">{category.name}</span>
                    </div>
                    <span className="text-xs font-medium">
                      {category.count}/{category.total}
                    </span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full transition-all duration-500"
                      style={{
                        width: `${percentage}%`,
                        backgroundColor: category.color
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Card>

      {/* Recent Achievements */}
      {recentAchievements.length > 0 && (
        <Card>
          <div className="p-6">
            <h4 className="text-sm font-semibold mb-4">Recently Unlocked</h4>
            <div className="space-y-2">
              {recentAchievements.map((achievement) => (
                <div 
                  key={achievement.id}
                  className={cn(
                    "flex items-center gap-3 p-2 rounded-lg transition-all",
                    animatingId === achievement.id && "bg-accent animate-pulse scale-105"
                  )}
                >
                  <span className="text-2xl">{achievement.icon}</span>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{achievement.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {achievement.unlockedAt.toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}