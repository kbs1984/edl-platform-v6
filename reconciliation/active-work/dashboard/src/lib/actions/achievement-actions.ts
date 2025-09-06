'use server';

import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';

export async function getUserAchievements(userId?: string) {
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

  // Fetch user achievements with achievement details
  const { data, error } = await supabase
    .from('user_achievements')
    .select(`
      *,
      achievement:achievements(*)
    `)
    .eq('user_id', targetUserId)
    .order('earned_at', { ascending: false });

  if (error) {
    console.error('Failed to fetch achievements:', error);
    return { success: false, error: error.message };
  }

  return { success: true, data };
}

export async function getAllAchievements() {
  const supabase = await createClient();
  
  // Get current user
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { success: false, error: 'Not authenticated' };
  }

  // Fetch all available achievements
  const { data: allAchievements, error: achievementsError } = await supabase
    .from('achievements')
    .select('*')
    .eq('is_active', true)
    .order('display_order', { ascending: true });

  if (achievementsError) {
    console.error('Failed to fetch all achievements:', achievementsError);
    return { success: false, error: achievementsError.message };
  }

  // Fetch user's earned achievements
  const { data: userAchievements, error: userError } = await supabase
    .from('user_achievements')
    .select('achievement_id')
    .eq('user_id', user.id);

  if (userError) {
    console.error('Failed to fetch user achievements:', userError);
    return { success: false, error: userError.message };
  }

  const earnedIds = new Set(userAchievements?.map(ua => ua.achievement_id) || []);

  // Mark which achievements are earned
  const achievementsWithStatus = allAchievements?.map(achievement => ({
    ...achievement,
    earned: earnedIds.has(achievement.id)
  })) || [];

  return { success: true, data: achievementsWithStatus };
}

export async function getAchievementProgress(userId?: string) {
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

  // Get total achievements
  const { count: totalCount } = await supabase
    .from('achievements')
    .select('*', { count: 'exact', head: true })
    .eq('is_active', true);

  // Get earned achievements
  const { count: earnedCount } = await supabase
    .from('user_achievements')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', targetUserId);

  // Get achievements by category
  const { data: categoryProgress } = await supabase
    .rpc('get_achievement_progress_by_category', { p_user_id: targetUserId });

  return { 
    success: true, 
    data: {
      total: totalCount || 0,
      earned: earnedCount || 0,
      percentage: totalCount ? Math.round((earnedCount || 0) / totalCount * 100) : 0,
      byCategory: categoryProgress || []
    }
  };
}

export async function getAchievementLeaderboard(limit = 10) {
  const supabase = await createClient();

  // Get top users by achievement count
  const { data, error } = await supabase
    .from('user_achievements')
    .select(`
      user_id,
      profile:profiles!user_achievements_user_id_fkey(name, username, image_path),
      count:achievement_id.count()
    `)
    .order('count', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Failed to fetch leaderboard:', error);
    return { success: false, error: error.message };
  }

  return { success: true, data };
}

export async function checkAndAwardAchievements(userId: string, type: string, value: number) {
  const supabase = await createClient();

  // This would be called after certain actions to check if new achievements are earned
  // For now, return a placeholder
  return { success: true, newAchievements: [] };
}