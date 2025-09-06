"use client"

import { useEffect, useState } from "react";
import { getVisitorStats, getRecentVisitors, trackProfileVisit } from "@/lib/actions/visitor-actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, Users, TrendingUp, Calendar, Clock } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

interface VisitorStats {
  today_count: number;
  yesterday_count: number;
  week_count: number;
  month_count: number;
  total_count: number;
  unique_total: number;
  peak_daily_count?: number;
  peak_date?: string;
}

interface RecentVisitor {
  id: string;
  visited_at: string;
  last_visit: string;
  is_friend: boolean;
  visitor: {
    id: string;
    name: string;
    username: string;
    image_path?: string;
  };
}

interface VisitorTrackerProps {
  profileId?: string; // If viewing someone else's profile
  autoTrack?: boolean; // Whether to track this visit
}

export function VisitorTracker({ profileId, autoTrack = true }: VisitorTrackerProps) {
  const [stats, setStats] = useState<VisitorStats | null>(null);
  const [recentVisitors, setRecentVisitors] = useState<RecentVisitor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      // Track visit if viewing someone else's profile
      if (profileId && autoTrack) {
        await trackProfileVisit(profileId);
      }

      // Get visitor stats
      const statsResult = await getVisitorStats(profileId);
      if (statsResult?.stats) {
        setStats(statsResult.stats);
      }

      // Get recent visitors (only for own profile)
      if (!profileId) {
        const visitorsResult = await getRecentVisitors(3);
        if (visitorsResult?.visitors) {
          setRecentVisitors(visitorsResult.visitors);
        }
      }

      setLoading(false);
    };

    fetchData();
    // Refresh every minute
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, [profileId, autoTrack]);

  if (loading) {
    return (
      <Card className="animate-pulse">
        <CardHeader>
          <div className="h-6 bg-gray-200 rounded w-32"></div>
        </CardHeader>
        <CardContent>
          <div className="h-20 bg-gray-200 rounded"></div>
        </CardContent>
      </Card>
    );
  }

  if (!stats) {
    return null;
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <Eye className="h-5 w-5" />
          Profile Visitors
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Today's count - The primary metric */}
        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-full">
              <Calendar className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Today</p>
              <p className="text-2xl font-bold text-blue-700">
                {stats.today_count}
              </p>
            </div>
          </div>
          {stats.yesterday_count > 0 && (
            <div className="text-right">
              <p className="text-xs text-gray-500">Yesterday</p>
              <p className="text-sm font-semibold text-gray-700">
                {stats.yesterday_count}
              </p>
            </div>
          )}
        </div>

        {/* Summary stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="text-center">
            <p className="text-xs text-gray-500">This Week</p>
            <p className="text-lg font-semibold">{stats.week_count}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-500">This Month</p>
            <p className="text-lg font-semibold">{stats.month_count}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-500">All Time</p>
            <p className="text-lg font-semibold">{stats.total_count}</p>
          </div>
        </div>

        {/* Peak record */}
        {stats.peak_daily_count && stats.peak_daily_count > 0 && (
          <>
            <Separator />
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-1 text-gray-600">
                <TrendingUp className="h-4 w-4" />
                Peak Day
              </span>
              <span className="font-semibold">
                {stats.peak_daily_count} visitors
                {stats.peak_date && (
                  <span className="text-xs text-gray-500 ml-1">
                    ({new Date(stats.peak_date).toLocaleDateString()})
                  </span>
                )}
              </span>
            </div>
          </>
        )}

        {/* Recent visitors */}
        {recentVisitors.length > 0 && (
          <>
            <Separator />
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-700 flex items-center gap-1">
                <Clock className="h-4 w-4" />
                Recent Visitors
              </p>
              <div className="space-y-2">
                {recentVisitors.map((visitor) => (
                  <div key={visitor.id} className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={visitor.visitor.image_path} />
                      <AvatarFallback>
                        {visitor.visitor.name?.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {visitor.visitor.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        @{visitor.visitor.username}
                        {visitor.is_friend && " • Friend"}
                      </p>
                    </div>
                    <p className="text-xs text-gray-400">
                      {new Date(visitor.last_visit).toLocaleTimeString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Unique visitors count */}
        <div className="pt-2 border-t">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              Unique Visitors
            </span>
            <span className="font-semibold">{stats.unique_total}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Compact version for profile header
export function VisitorCountBadge({ userId }: { userId?: string }) {
  const [todayCount, setTodayCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCount = async () => {
      const result = await getVisitorStats(userId);
      if (result.stats) {
        setTodayCount(result.stats.today_count);
      }
      setLoading(false);
    };

    fetchCount();
    // Refresh every minute
    const interval = setInterval(fetchCount, 60000);
    return () => clearInterval(interval);
  }, [userId]);

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-6 w-16 bg-gray-200 rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1.5 px-3 py-1 bg-blue-50 rounded-full">
      <Eye className="h-4 w-4 text-blue-600" />
      <span className="text-sm font-semibold text-blue-700">
        {todayCount} today
      </span>
    </div>
  );
}