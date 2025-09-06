"use client";

import { useState, useEffect, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Trophy, 
  Users, 
  Calendar,
  Award,
  MessageCircle,
  Heart,
  Share2,
  Clock,
  TrendingUp,
  Zap,
  Target,
  Star,
  RefreshCw,
  Filter
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Activity types for the feed
type ActivityType = 
  | "achievement_unlocked"
  | "friend_added"
  | "activity_completed"
  | "emcoin_earned"
  | "streak_milestone"
  | "team_joined"
  | "debate_won"
  | "level_up";

interface ActivityItem {
  id: string;
  type: ActivityType;
  user: {
    id: string;
    name: string;
    avatar?: string;
  };
  timestamp: Date;
  data: {
    achievement?: string;
    friend?: string;
    activity?: string;
    amount?: number;
    streak?: number;
    team?: string;
    level?: number;
    [key: string]: any;
  };
  reactions?: {
    likes: number;
    comments: number;
    hasLiked?: boolean;
  };
}

interface SocialActivityFeedProps {
  className?: string;
  userId?: string;
  showFilters?: boolean;
  limit?: number;
}

export default function SocialActivityFeed({ 
  className,
  userId,
  showFilters = true,
  limit = 20
}: SocialActivityFeedProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [filter, setFilter] = useState<ActivityType | "all">("all");
  const [refreshing, setRefreshing] = useState(false);
  
  // Generate mock data for demonstration
  const generateMockActivities = useCallback((): ActivityItem[] => {
    const mockUsers = [
      { id: "1", name: "Alex Chen", avatar: undefined },
      { id: "2", name: "Sarah Miller", avatar: undefined },
      { id: "3", name: "James Wilson", avatar: undefined },
      { id: "4", name: "Emma Davis", avatar: undefined },
      { id: "5", name: "Michael Brown", avatar: undefined },
    ];

    const activities: ActivityItem[] = [
      {
        id: "1",
        type: "achievement_unlocked",
        user: mockUsers[0],
        timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 min ago
        data: { achievement: "First Debate Winner" },
        reactions: { likes: 12, comments: 3, hasLiked: false }
      },
      {
        id: "2",
        type: "friend_added",
        user: mockUsers[1],
        timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 min ago
        data: { friend: "David Kim" },
        reactions: { likes: 5, comments: 1, hasLiked: true }
      },
      {
        id: "3",
        type: "emcoin_earned",
        user: mockUsers[2],
        timestamp: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
        data: { amount: 500 },
        reactions: { likes: 8, comments: 2, hasLiked: false }
      },
      {
        id: "4",
        type: "streak_milestone",
        user: mockUsers[3],
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
        data: { streak: 30 },
        reactions: { likes: 25, comments: 7, hasLiked: true }
      },
      {
        id: "5",
        type: "activity_completed",
        user: mockUsers[4],
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3), // 3 hours ago
        data: { activity: "Advanced Mathematics Workshop" },
        reactions: { likes: 15, comments: 4, hasLiked: false }
      },
      {
        id: "6",
        type: "level_up",
        user: mockUsers[0],
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
        data: { level: 10 },
        reactions: { likes: 30, comments: 10, hasLiked: true }
      },
      {
        id: "7",
        type: "team_joined",
        user: mockUsers[1],
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8), // 8 hours ago
        data: { team: "Phoenix Squad" },
        reactions: { likes: 7, comments: 2, hasLiked: false }
      },
      {
        id: "8",
        type: "debate_won",
        user: mockUsers[2],
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12), // 12 hours ago
        data: { topic: "Climate Change Solutions" },
        reactions: { likes: 18, comments: 6, hasLiked: true }
      },
    ];

    return activities;
  }, []);

  // Load activities on mount
  useEffect(() => {
    const loadActivities = async () => {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        const mockData = generateMockActivities();
        setActivities(mockData);
        setLoading(false);
      } catch (err) {
        setError(err as Error);
        setLoading(false);
      }
    };

    loadActivities();
  }, [generateMockActivities]);

  // Handle refresh
  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const newActivities = generateMockActivities();
      setActivities(newActivities);
      toast({
        title: "Feed refreshed",
        description: "Showing latest activities",
      });
    } catch (err) {
      toast({
        title: "Error refreshing feed",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setRefreshing(false);
    }
  }, [generateMockActivities]);

  // Handle like toggle
  const handleLike = useCallback((activityId: string) => {
    setActivities(prev => prev.map(activity => {
      if (activity.id === activityId && activity.reactions) {
        const hasLiked = !activity.reactions.hasLiked;
        return {
          ...activity,
          reactions: {
            ...activity.reactions,
            likes: hasLiked 
              ? activity.reactions.likes + 1 
              : Math.max(0, activity.reactions.likes - 1),
            hasLiked
          }
        };
      }
      return activity;
    }));
  }, []);

  // Get activity icon and color
  const getActivityDisplay = (type: ActivityType) => {
    switch(type) {
      case "achievement_unlocked":
        return { icon: Trophy, color: "text-yellow-500", bg: "bg-yellow-100 dark:bg-yellow-900/20" };
      case "friend_added":
        return { icon: Users, color: "text-blue-500", bg: "bg-blue-100 dark:bg-blue-900/20" };
      case "activity_completed":
        return { icon: Target, color: "text-green-500", bg: "bg-green-100 dark:bg-green-900/20" };
      case "emcoin_earned":
        return { icon: Zap, color: "text-purple-500", bg: "bg-purple-100 dark:bg-purple-900/20" };
      case "streak_milestone":
        return { icon: TrendingUp, color: "text-orange-500", bg: "bg-orange-100 dark:bg-orange-900/20" };
      case "team_joined":
        return { icon: Users, color: "text-indigo-500", bg: "bg-indigo-100 dark:bg-indigo-900/20" };
      case "debate_won":
        return { icon: Award, color: "text-red-500", bg: "bg-red-100 dark:bg-red-900/20" };
      case "level_up":
        return { icon: Star, color: "text-cyan-500", bg: "bg-cyan-100 dark:bg-cyan-900/20" };
      default:
        return { icon: Calendar, color: "text-gray-500", bg: "bg-gray-100 dark:bg-gray-900/20" };
    }
  };

  // Get activity message
  const getActivityMessage = (activity: ActivityItem) => {
    const { type, data, user } = activity;
    
    switch(type) {
      case "achievement_unlocked":
        return (
          <>
            <span className="font-semibold">{user.name}</span> unlocked{" "}
            <span className="font-semibold text-primary">{data.achievement}</span> achievement!
          </>
        );
      case "friend_added":
        return (
          <>
            <span className="font-semibold">{user.name}</span> and{" "}
            <span className="font-semibold">{data.friend}</span> are now friends
          </>
        );
      case "activity_completed":
        return (
          <>
            <span className="font-semibold">{user.name}</span> completed{" "}
            <span className="font-semibold text-primary">{data.activity}</span>
          </>
        );
      case "emcoin_earned":
        return (
          <>
            <span className="font-semibold">{user.name}</span> earned{" "}
            <span className="font-semibold text-yellow-600">{data.amount} EmCoins</span>
          </>
        );
      case "streak_milestone":
        return (
          <>
            <span className="font-semibold">{user.name}</span> reached a{" "}
            <span className="font-semibold text-orange-600">{data.streak}-day streak!</span> 🔥
          </>
        );
      case "team_joined":
        return (
          <>
            <span className="font-semibold">{user.name}</span> joined team{" "}
            <span className="font-semibold text-primary">{data.team}</span>
          </>
        );
      case "debate_won":
        return (
          <>
            <span className="font-semibold">{user.name}</span> won a debate on{" "}
            <span className="font-semibold text-primary">"{data.topic}"</span>
          </>
        );
      case "level_up":
        return (
          <>
            <span className="font-semibold">{user.name}</span> reached{" "}
            <span className="font-semibold text-cyan-600">Level {data.level}!</span> 🎉
          </>
        );
      default:
        return (<><span className="font-semibold">{user.name}</span> was active</>);
    }
  };

  // Get initials for avatar
  const getInitials = (name: string) => {
    return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
  };

  // Filter activities
  const filteredActivities = filter === "all" 
    ? activities 
    : activities.filter(a => a.type === filter);

  // Loading state
  if (loading) {
    return (
      <Card className={cn("p-4", className)}>
        <div className="space-y-4">
          <Skeleton className="h-10 w-full" />
          {[1, 2, 3].map(i => (
            <div key={i} className="flex gap-3">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="flex-1">
                <Skeleton className="h-4 w-3/4 mb-2" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </Card>
    );
  }

  // Error state
  if (error) {
    return (
      <Card className={cn("p-6", className)}>
        <div className="text-center">
          <p className="text-muted-foreground">Unable to load activity feed</p>
          <Button onClick={handleRefresh} variant="outline" className="mt-4">
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card className={cn("flex flex-col", className)}>
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Activity Feed</h2>
          <div className="flex items-center gap-2">
            {showFilters && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-2" />
                    {filter === "all" ? "All" : filter.replace("_", " ")}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>Filter Activities</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setFilter("all")}>
                    All Activities
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilter("achievement_unlocked")}>
                    Achievements
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilter("friend_added")}>
                    New Friends
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilter("emcoin_earned")}>
                    EmCoin Rewards
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilter("activity_completed")}>
                    Activities
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleRefresh}
              disabled={refreshing}
            >
              <RefreshCw className={cn("h-4 w-4", refreshing && "animate-spin")} />
            </Button>
          </div>
        </div>
      </div>

      {/* Activity List */}
      <ScrollArea className="h-[500px]">
        <div className="p-4 space-y-4">
          {filteredActivities.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No activities to show</p>
            </div>
          ) : (
            filteredActivities.slice(0, limit).map(activity => {
              const display = getActivityDisplay(activity.type);
              const Icon = display.icon;
              
              return (
                <div key={activity.id} className="flex gap-3">
                  {/* Icon */}
                  <div className={cn("p-2 rounded-full shrink-0", display.bg)}>
                    <Icon className={cn("h-5 w-5", display.color)} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <p className="text-sm">
                          {getActivityMessage(activity)}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          <Clock className="inline h-3 w-3 mr-1" />
                          {formatDistanceToNow(activity.timestamp, { addSuffix: true })}
                        </p>
                      </div>
                      
                      {/* Avatar */}
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={activity.user.avatar} />
                        <AvatarFallback className="text-xs">
                          {getInitials(activity.user.name)}
                        </AvatarFallback>
                      </Avatar>
                    </div>

                    {/* Reactions */}
                    {activity.reactions && (
                      <div className="flex items-center gap-4 mt-3">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 px-2"
                          onClick={() => handleLike(activity.id)}
                        >
                          <Heart 
                            className={cn(
                              "h-4 w-4 mr-1",
                              activity.reactions.hasLiked && "fill-red-500 text-red-500"
                            )}
                          />
                          <span className="text-xs">{activity.reactions.likes}</span>
                        </Button>
                        <Button variant="ghost" size="sm" className="h-7 px-2">
                          <MessageCircle className="h-4 w-4 mr-1" />
                          <span className="text-xs">{activity.reactions.comments}</span>
                        </Button>
                        <Button variant="ghost" size="sm" className="h-7 px-2">
                          <Share2 className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </ScrollArea>
    </Card>
  );
}