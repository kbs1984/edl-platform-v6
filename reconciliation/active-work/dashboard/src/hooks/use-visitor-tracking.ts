"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";

export interface VisitorStats {
  total_visitors: number;
  unique_today: number;
  unique_this_week: number;
  unique_this_month: number;
  friend_visitors: number;
  peak_daily: number;
  peak_date: string | null;
}

export interface RecentVisitor {
  visitor_id: string;
  visited_at: string;
  is_friend: boolean;
  visitor_profile?: {
    id: string;
    full_name: string;
    avatar_url?: string;
  };
}

export function useVisitorTracking(profileUserId?: string) {
  const [stats, setStats] = useState<VisitorStats | null>(null);
  const [recentVisitors, setRecentVisitors] = useState<RecentVisitor[]>([]);
  const [loading, setLoading] = useState(true);
  const [todayCount, setTodayCount] = useState(0);
  const supabase = createClient();

  // Track a visit to this profile
  const trackVisit = async (visitorId: string, isFriend: boolean = false) => {
    if (!profileUserId || visitorId === profileUserId) return; // Don't track self-visits

    try {
      await supabase.from("profile_visitors").insert({
        profile_user_id: profileUserId,
        visitor_id: visitorId,
        is_friend: isFriend,
      });
    } catch (error) {
      console.error("Error tracking visit:", error);
    }
  };

  useEffect(() => {
    if (!profileUserId) return;

    const fetchVisitorData = async () => {
      try {
        // Get visitor stats
        const { data: statsData, error: statsError } = await supabase
          .from("visitor_stats")
          .select("*")
          .eq("profile_user_id", profileUserId)
          .single();

        if (statsError && statsError.code !== "PGRST116") {
          throw statsError;
        }

        if (statsData) {
          setStats(statsData);
          setTodayCount(statsData.unique_today || 0);
        }

        // Get recent visitors (last 10)
        const { data: visitorsData, error: visitorsError } = await supabase
          .from("profile_visitors")
          .select(`
            visitor_id,
            visited_at,
            is_friend,
            visitor:profiles!visitor_id(
              id,
              full_name,
              avatar_url
            )
          `)
          .eq("profile_user_id", profileUserId)
          .order("visited_at", { ascending: false })
          .limit(10);

        if (visitorsError) throw visitorsError;

        setRecentVisitors(
          visitorsData?.map((v) => ({
            visitor_id: v.visitor_id,
            visited_at: v.visited_at,
            is_friend: v.is_friend,
            visitor_profile: v.visitor,
          })) || []
        );
      } catch (error) {
        console.error("Error fetching visitor data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVisitorData();

    // Subscribe to real-time visitor updates
    const subscription = supabase
      .channel(`visitors-${profileUserId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "profile_visitors",
          filter: `profile_user_id=eq.${profileUserId}`,
        },
        async (payload) => {
          // Increment today count for real-time feel
          setTodayCount((prev) => prev + 1);

          // Fetch the visitor's profile info
          const { data: visitorProfile } = await supabase
            .from("profiles")
            .select("id, full_name, avatar_url")
            .eq("id", payload.new.visitor_id)
            .single();

          // Add to recent visitors
          setRecentVisitors((prev) => [
            {
              visitor_id: payload.new.visitor_id,
              visited_at: payload.new.visited_at,
              is_friend: payload.new.is_friend,
              visitor_profile: visitorProfile,
            },
            ...prev.slice(0, 9), // Keep only last 10
          ]);
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [profileUserId, supabase]);

  return {
    stats,
    recentVisitors,
    todayCount,
    loading,
    trackVisit,
  };
}