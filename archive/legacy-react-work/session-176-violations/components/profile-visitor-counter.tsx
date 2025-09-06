"use client";

import { Eye, Users, TrendingUp, Calendar } from "lucide-react";
import { useVisitorTracking } from "@/hooks/use-visitor-tracking";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface VisitorCounterProps {
  profileUserId: string;
  className?: string;
  showDetails?: boolean;
}

export function VisitorCounter({ 
  profileUserId, 
  className = "", 
  showDetails = true 
}: VisitorCounterProps) {
  const { stats, todayCount, recentVisitors, loading } = useVisitorTracking(profileUserId);

  if (loading) {
    return (
      <div className={`animate-pulse ${className}`}>
        <div className="h-20 bg-muted rounded-lg"></div>
      </div>
    );
  }

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Today's Visitors - Cyworld Style */}
      <div className="p-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg border border-blue-500/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Eye className="h-5 w-5 text-blue-500" />
            <span className="text-sm font-medium text-muted-foreground">Today</span>
          </div>
          <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
            {todayCount}
          </div>
        </div>
        
        {stats?.peak_daily && stats.peak_daily > todayCount && (
          <div className="mt-2 text-xs text-muted-foreground">
            Peak: {stats.peak_daily} visitors
            {stats.peak_date && (
              <span className="ml-1">
                ({new Date(stats.peak_date).toLocaleDateString()})
              </span>
            )}
          </div>
        )}
      </div>

      {/* Detailed Stats Grid */}
      {showDetails && stats && (
        <div className="grid grid-cols-3 gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="p-3 bg-muted/50 rounded-lg text-center cursor-help">
                  <Users className="h-4 w-4 mx-auto mb-1 text-muted-foreground" />
                  <p className="text-lg font-semibold">{stats.unique_this_week}</p>
                  <p className="text-xs text-muted-foreground">This Week</p>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Unique visitors this week</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <div className="p-3 bg-muted/50 rounded-lg text-center cursor-help">
                  <Calendar className="h-4 w-4 mx-auto mb-1 text-muted-foreground" />
                  <p className="text-lg font-semibold">{stats.unique_this_month}</p>
                  <p className="text-xs text-muted-foreground">This Month</p>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Unique visitors this month</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <div className="p-3 bg-muted/50 rounded-lg text-center cursor-help">
                  <TrendingUp className="h-4 w-4 mx-auto mb-1 text-muted-foreground" />
                  <p className="text-lg font-semibold">{stats.total_visitors}</p>
                  <p className="text-xs text-muted-foreground">All Time</p>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Total visitors all time</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      )}

      {/* Recent Visitors */}
      {showDetails && recentVisitors.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-muted-foreground">Recent Visitors</h4>
          <div className="flex -space-x-2">
            {recentVisitors.slice(0, 8).map((visitor, i) => (
              <TooltipProvider key={`${visitor.visitor_id}-${i}`}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="relative">
                      {visitor.visitor_profile?.avatar_url ? (
                        <img
                          src={visitor.visitor_profile.avatar_url}
                          alt={visitor.visitor_profile.full_name || "Visitor"}
                          className="h-8 w-8 rounded-full border-2 border-background"
                        />
                      ) : (
                        <div className="h-8 w-8 rounded-full border-2 border-background bg-muted flex items-center justify-center text-xs font-medium">
                          {visitor.visitor_profile?.full_name?.[0] || "?"}
                        </div>
                      )}
                      {visitor.is_friend && (
                        <div className="absolute -bottom-1 -right-1 h-3 w-3 bg-green-500 rounded-full border border-background" />
                      )}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{visitor.visitor_profile?.full_name || "Anonymous"}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(visitor.visited_at).toLocaleString()}
                    </p>
                    {visitor.is_friend && (
                      <p className="text-xs text-green-500">Friend</p>
                    )}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ))}
            {recentVisitors.length > 8 && (
              <div className="h-8 w-8 rounded-full border-2 border-background bg-muted flex items-center justify-center text-xs font-medium">
                +{recentVisitors.length - 8}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}