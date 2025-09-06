'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Activity,
  Trophy, 
  Clock, 
  Target,
  TrendingUp,
  Calendar,
  CheckCircle2,
  PlayCircle,
  PauseCircle,
  XCircle,
  AlertCircle,
  ChevronRight,
  BarChart3,
  Zap,
  BookOpen,
  Users,
  Star,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';

interface ActivityDashboardProps {
  userId: string;
  className?: string;
}

interface ActivityData {
  id: string;
  title: string;
  description?: string;
  total_sessions: number;
  category?: string;
  difficulty?: string;
  emcoin_reward?: number;
}

interface ActivityInstance {
  id: string;
  activity_id: string;
  user_id: string;
  current_session: number;
  status: 'active' | 'paused' | 'completed' | 'abandoned';
  started_at: string;
  completed_at?: string;
  last_accessed?: string;
  activity?: ActivityData;
}

interface DashboardStats {
  totalActivities: number;
  activeActivities: number;
  completedActivities: number;
  totalSessions: number;
  completedSessions: number;
  averageProgress: number;
  streak: number;
  totalEmCoinsEarned: number;
}

interface RecentActivity {
  instance: ActivityInstance;
  daysAgo: number;
  progressPercentage: number;
}

export function ActivityDashboard({ userId, className }: ActivityDashboardProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [instances, setInstances] = useState<ActivityInstance[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);
  const [selectedTab, setSelectedTab] = useState<'all' | 'active' | 'completed'>('all');
  
  const supabase = createClient();

  useEffect(() => {
    loadDashboardData();
  }, [userId]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Load all activity instances for the user with activity details
      const { data: instanceData, error: instanceError } = await supabase
        .from('activity_instance')
        .select(`
          *,
          activity:activity_id (
            id,
            title,
            description,
            total_sessions,
            category,
            difficulty,
            emcoin_reward
          )
        `)
        .eq('user_id', userId)
        .order('last_accessed', { ascending: false, nullsFirst: false });

      if (instanceError) throw instanceError;

      const instances = instanceData || [];
      setInstances(instances);

      // Calculate statistics
      const stats = calculateStats(instances);
      setStats(stats);

      // Prepare recent activities
      const recent = prepareRecentActivities(instances);
      setRecentActivities(recent);

    } catch (err) {
      console.error('Error loading dashboard data:', err);
      setError(err as Error);
      toast({
        title: 'Error',
        description: 'Failed to load dashboard data',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (instances: ActivityInstance[]): DashboardStats => {
    const totalActivities = instances.length;
    const activeActivities = instances.filter(i => i.status === 'active').length;
    const completedActivities = instances.filter(i => i.status === 'completed').length;
    
    let totalSessions = 0;
    let completedSessions = 0;
    let totalEmCoinsEarned = 0;

    instances.forEach(instance => {
      const activity = instance.activity as ActivityData;
      if (activity) {
        totalSessions += activity.total_sessions;
        
        if (instance.status === 'completed') {
          completedSessions += activity.total_sessions;
          totalEmCoinsEarned += activity.emcoin_reward || 0;
        } else {
          completedSessions += Math.max(0, instance.current_session - 1);
        }
      }
    });

    const averageProgress = totalSessions > 0 
      ? Math.round((completedSessions / totalSessions) * 100)
      : 0;

    // Calculate streak (consecutive days with activity)
    const streak = calculateStreak(instances);

    return {
      totalActivities,
      activeActivities,
      completedActivities,
      totalSessions,
      completedSessions,
      averageProgress,
      streak,
      totalEmCoinsEarned
    };
  };

  const calculateStreak = (instances: ActivityInstance[]): number => {
    // Simple streak calculation based on last accessed dates
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const accessDates = new Set<string>();
    instances.forEach(instance => {
      if (instance.last_accessed) {
        const date = new Date(instance.last_accessed);
        date.setHours(0, 0, 0, 0);
        accessDates.add(date.toISOString());
      }
    });

    let streak = 0;
    let currentDate = new Date(today);
    
    while (accessDates.has(currentDate.toISOString())) {
      streak++;
      currentDate.setDate(currentDate.getDate() - 1);
    }

    return streak;
  };

  const prepareRecentActivities = (instances: ActivityInstance[]): RecentActivity[] => {
    const now = new Date();
    
    return instances
      .filter(instance => instance.last_accessed)
      .map(instance => {
        const lastAccessed = new Date(instance.last_accessed!);
        const daysAgo = Math.floor((now.getTime() - lastAccessed.getTime()) / (1000 * 60 * 60 * 24));
        const activity = instance.activity as ActivityData;
        const progressPercentage = activity
          ? Math.round((instance.current_session / activity.total_sessions) * 100)
          : 0;

        return {
          instance,
          daysAgo,
          progressPercentage
        };
      })
      .slice(0, 5); // Show only 5 most recent
  };

  const getFilteredInstances = () => {
    switch (selectedTab) {
      case 'active':
        return instances.filter(i => i.status === 'active');
      case 'completed':
        return instances.filter(i => i.status === 'completed');
      default:
        return instances;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <PlayCircle className="h-4 w-4 text-blue-500" />;
      case 'completed':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'paused':
        return <PauseCircle className="h-4 w-4 text-yellow-500" />;
      case 'abandoned':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-blue-600 bg-blue-100 dark:bg-blue-900 dark:text-blue-300';
      case 'completed':
        return 'text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-300';
      case 'paused':
        return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-300';
      case 'abandoned':
        return 'text-red-600 bg-red-100 dark:bg-red-900 dark:text-red-300';
      default:
        return 'text-gray-600 bg-gray-100 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const resumeActivity = async (instanceId: string, activityId: string, currentSession: number) => {
    try {
      await supabase
        .from('activity_instance')
        .update({ 
          status: 'active',
          last_accessed: new Date().toISOString()
        })
        .eq('id', instanceId);

      toast({
        title: 'Activity Resumed',
        description: 'Redirecting to session...',
      });

      // Navigate to the current session
      window.location.href = `/activities/${activityId}/session/${currentSession}`;
    } catch (err) {
      console.error('Error resuming activity:', err);
      toast({
        title: 'Error',
        description: 'Failed to resume activity',
        variant: 'destructive',
      });
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className={cn("space-y-6", className)}>
        {/* Stats Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <Skeleton className="h-4 w-20" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16" />
                <Skeleton className="h-3 w-24 mt-1" />
              </CardContent>
            </Card>
          ))}
        </div>
        
        {/* Activity List Skeleton */}
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="flex items-center gap-4">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="flex-1">
                    <Skeleton className="h-5 w-48" />
                    <Skeleton className="h-3 w-32 mt-2" />
                  </div>
                  <Skeleton className="h-8 w-20" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <Card className={className}>
        <CardContent className="pt-6">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {error.message || 'Failed to load dashboard'}
            </AlertDescription>
          </Alert>
          <Button 
            onClick={loadDashboardData} 
            variant="outline" 
            className="mt-4"
          >
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  // No data state
  if (!stats || instances.length === 0) {
    return (
      <Card className={className}>
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Activities Yet</h3>
            <p className="text-muted-foreground mb-4">
              Start your learning journey by enrolling in an activity
            </p>
            <Link href="/activities">
              <Button>
                Browse Activities
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }

  const filteredInstances = getFilteredInstances();

  return (
    <div className={cn("space-y-6", className)}>
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-1">
              <Activity className="h-4 w-4" />
              Total Activities
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalActivities}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats.activeActivities} active, {stats.completedActivities} completed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-1">
              <Target className="h-4 w-4" />
              Overall Progress
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.averageProgress}%</div>
            <Progress value={stats.averageProgress} className="h-1 mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-1">
              <TrendingUp className="h-4 w-4" />
              Current Streak
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold flex items-center gap-1">
              {stats.streak} 
              <span className="text-base font-normal text-muted-foreground">days</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Keep it up! 🔥
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-1">
              <Zap className="h-4 w-4" />
              EmCoins Earned
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalEmCoinsEarned}</div>
            <p className="text-xs text-muted-foreground mt-1">
              From completed activities
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      {recentActivities.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Activity</CardTitle>
            <CardDescription>Your last accessed activities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentActivities.map((recent) => {
                const activity = recent.instance.activity as ActivityData;
                if (!activity) return null;
                
                return (
                  <div 
                    key={recent.instance.id}
                    className="flex items-center gap-4 p-3 rounded-lg hover:bg-accent/50 transition-colors"
                  >
                    <div className="relative">
                      <div className={cn(
                        "h-10 w-10 rounded-full flex items-center justify-center",
                        "bg-primary/10 text-primary"
                      )}>
                        <BookOpen className="h-5 w-5" />
                      </div>
                      {getStatusIcon(recent.instance.status)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">{activity.title}</div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>Session {recent.instance.current_session}/{activity.total_sessions}</span>
                        <span>{recent.progressPercentage}% complete</span>
                        <span>
                          {recent.daysAgo === 0 ? 'Today' : 
                           recent.daysAgo === 1 ? 'Yesterday' : 
                           `${recent.daysAgo} days ago`}
                        </span>
                      </div>
                    </div>
                    
                    {recent.instance.status === 'active' && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => resumeActivity(
                          recent.instance.id,
                          recent.instance.activity_id,
                          recent.instance.current_session
                        )}
                      >
                        Continue
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* All Activities */}
      <Card>
        <CardHeader>
          <CardTitle>My Activities</CardTitle>
          <CardDescription>Manage all your enrolled activities</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={selectedTab} onValueChange={(v: any) => setSelectedTab(v)}>
            <TabsList className="mb-4">
              <TabsTrigger value="all">
                All ({instances.length})
              </TabsTrigger>
              <TabsTrigger value="active">
                Active ({instances.filter(i => i.status === 'active').length})
              </TabsTrigger>
              <TabsTrigger value="completed">
                Completed ({instances.filter(i => i.status === 'completed').length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value={selectedTab} className="mt-0">
              <ScrollArea className="h-[400px] pr-4">
                <div className="space-y-4">
                  {filteredInstances.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      No {selectedTab === 'all' ? '' : selectedTab} activities
                    </div>
                  ) : (
                    filteredInstances.map((instance) => {
                      const activity = instance.activity as ActivityData;
                      if (!activity) return null;
                      
                      const progress = Math.round(
                        (instance.current_session / activity.total_sessions) * 100
                      );

                      return (
                        <Card key={instance.id}>
                          <CardContent className="pt-6">
                            <div className="flex items-start justify-between mb-4">
                              <div className="flex-1">
                                <h4 className="font-semibold flex items-center gap-2">
                                  {activity.title}
                                  <Badge 
                                    variant="secondary" 
                                    className={cn("text-xs", getStatusColor(instance.status))}
                                  >
                                    {instance.status}
                                  </Badge>
                                </h4>
                                {activity.description && (
                                  <p className="text-sm text-muted-foreground mt-1">
                                    {activity.description}
                                  </p>
                                )}
                              </div>
                            </div>

                            <div className="space-y-3">
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">
                                  Session {instance.current_session} of {activity.total_sessions}
                                </span>
                                <span className="font-medium">{progress}%</span>
                              </div>
                              <Progress value={progress} className="h-2" />
                              
                              <div className="flex items-center justify-between pt-2">
                                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                  {activity.category && (
                                    <Badge variant="outline" className="text-xs">
                                      {activity.category}
                                    </Badge>
                                  )}
                                  {activity.difficulty && (
                                    <Badge variant="outline" className="text-xs">
                                      {activity.difficulty}
                                    </Badge>
                                  )}
                                  {instance.status === 'completed' && activity.emcoin_reward && (
                                    <span className="flex items-center gap-1">
                                      <Zap className="h-3 w-3" />
                                      +{activity.emcoin_reward}
                                    </span>
                                  )}
                                </div>
                                
                                {instance.status === 'active' ? (
                                  <Link 
                                    href={`/activities/${instance.activity_id}/session/${instance.current_session}`}
                                  >
                                    <Button size="sm">
                                      Continue
                                      <ChevronRight className="h-4 w-4 ml-1" />
                                    </Button>
                                  </Link>
                                ) : instance.status === 'completed' ? (
                                  <Link href={`/activities/${instance.activity_id}/certificate`}>
                                    <Button size="sm" variant="outline">
                                      <Trophy className="h-4 w-4 mr-1" />
                                      Certificate
                                    </Button>
                                  </Link>
                                ) : instance.status === 'paused' ? (
                                  <Button 
                                    size="sm" 
                                    variant="outline"
                                    onClick={() => resumeActivity(
                                      instance.id,
                                      instance.activity_id,
                                      instance.current_session
                                    )}
                                  >
                                    Resume
                                  </Button>
                                ) : null}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })
                  )}
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}