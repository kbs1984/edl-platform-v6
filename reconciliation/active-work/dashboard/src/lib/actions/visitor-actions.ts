"use server"

import { createServerClient } from "@/utils/supabase/server";

export async function getVisitorStats(userId?: string) {
  const supabase = await createServerClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  const targetUserId = userId || user?.id;
  
  if (!targetUserId) {
    return { error: "User not authenticated" };
  }

  // Get or create visitor stats
  let { data: stats, error } = await supabase
    .from("visitor_stats")
    .select("*")
    .eq("user_id", targetUserId)
    .single();

  if (error && error.code === 'PGRST116') {
    // No stats exist, create them
    const { data: newStats, error: createError } = await supabase
      .from("visitor_stats")
      .insert({
        user_id: targetUserId,
        today_count: 0,
        yesterday_count: 0,
        week_count: 0,
        month_count: 0,
        total_count: 0,
        unique_total: 0
      })
      .select()
      .single();

    if (createError) {
      return { error: createError.message };
    }
    stats = newStats;
  } else if (error) {
    return { error: error.message };
  }

  return { stats };
}

export async function trackProfileVisit(profileId: string) {
  const supabase = await createServerClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || user.id === profileId) {
    // Don't track self-visits
    return { success: false };
  }

  const today = new Date().toISOString().split('T')[0];

  // Check if already visited today
  const { data: existingVisit } = await supabase
    .from("profile_visitors")
    .select("id, visit_count")
    .eq("profile_id", profileId)
    .eq("visitor_id", user.id)
    .eq("visit_date", today)
    .single();

  if (existingVisit) {
    // Update visit count for today
    await supabase
      .from("profile_visitors")
      .update({
        visit_count: existingVisit.visit_count + 1,
        last_visit: new Date().toISOString()
      })
      .eq("id", existingVisit.id);
  } else {
    // Create new visit record
    const { data: friendship } = await supabase
      .from("friendship")
      .select("id")
      .eq("user_id", user.id)
      .eq("friend_id", profileId)
      .eq("status", "ACCEPTED")
      .single();

    await supabase
      .from("profile_visitors")
      .insert({
        profile_id: profileId,
        visitor_id: user.id,
        visit_date: today,
        is_friend: !!friendship
      });

    // Update visitor stats - increment today_count
    await supabase.rpc('increment_visitor_count', {
      target_user_id: profileId
    });
  }

  return { success: true };
}

export async function getRecentVisitors(limit = 5) {
  const supabase = await createServerClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { error: "User not authenticated" };
  }

  const { data: visitors, error } = await supabase
    .from("profile_visitors")
    .select(`
      *,
      visitor:profile!profile_visitors_visitor_id_fkey(
        id,
        name,
        username,
        image_path
      )
    `)
    .eq("profile_id", user.id)
    .order('last_visit', { ascending: false })
    .limit(limit);

  if (error) {
    return { error: error.message };
  }

  return { visitors: visitors || [] };
}

export async function getVisitorLeaderboard(periodType: 'daily' | 'weekly' | 'monthly' | 'all_time' = 'daily') {
  const supabase = await createServerClient();

  const today = new Date().toISOString().split('T')[0];
  
  const { data: leaderboard, error } = await supabase
    .from("visitor_leaderboard")
    .select(`
      *,
      user:profile!visitor_leaderboard_user_id_fkey(
        id,
        name,
        username,
        image_path
      )
    `)
    .eq("period_type", periodType)
    .eq("period_date", today)
    .order('visitor_count', { ascending: false })
    .limit(10);

  if (error) {
    return { error: error.message };
  }

  return { leaderboard: leaderboard || [] };
}