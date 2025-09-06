'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle2, 
  Circle, 
  PlayCircle,
  Trophy,
  Clock,
  AlertCircle,
  RotateCcw,
  Flag
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';

interface SessionProgressProps {
  activityId: string;
  userId: string;
  onSessionChange?: (sessionNumber: number) => void;
  className?: string;
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
}

interface Activity {
  id: string;
  title: string;
  description?: string;
  total_sessions: number;
  estimated_duration_per_session?: number;
}

interface SessionData {
  number: number;
  title?: string;
  description?: string;
  completed: boolean;
  current: boolean;
  locked: boolean;
}

export function SessionProgress({ 
  activityId, 
  userId, 
  onSessionChange,
  className 
}: SessionProgressProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [activity, setActivity] = useState<Activity | null>(null);
  const [instance, setInstance] = useState<ActivityInstance | null>(null);
  const [sessions, setSessions] = useState<SessionData[]>([]);
  const [saving, setSaving] = useState(false);
  
  const supabase = createClient();

  useEffect(() => {
    loadData();
  }, [activityId, userId]);

  useEffect(() => {
    // Auto-save progress to localStorage as backup
    if (instance) {
      localStorage.setItem(
        `activity-progress-${activityId}-${userId}`,
        JSON.stringify({
          currentSession: instance.current_session,
          status: instance.status,
          lastAccessed: new Date().toISOString()
        })
      );
    }
  }, [instance, activityId, userId]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Load activity details
      const { data: activityData, error: activityError } = await supabase
        .from('activity')
        .select('*')
        .eq('id', activityId)
        .single();

      if (activityError) throw activityError;
      if (!activityData) throw new Error('Activity not found');

      setActivity(activityData);

      // Load or create instance
      let { data: instanceData, error: instanceError } = await supabase
        .from('activity_instance')
        .select('*')
        .eq('activity_id', activityId)
        .eq('user_id', userId)
        .single();

      if (instanceError && instanceError.code !== 'PGRST116') {
        throw instanceError;
      }

      // Create instance if doesn't exist
      if (!instanceData) {
        const { data: newInstance, error: createError } = await supabase
          .from('activity_instance')
          .insert({
            activity_id: activityId,
            user_id: userId,
            current_session: 1,
            status: 'active',
            started_at: new Date().toISOString()
          })
          .select()
          .single();

        if (createError) throw createError;
        instanceData = newInstance;
      }

      setInstance(instanceData);

      // Generate session data
      const sessionList: SessionData[] = [];
      for (let i = 1; i <= activityData.total_sessions; i++) {
        sessionList.push({
          number: i,
          title: `Session ${i}`,
          description: getSessionDescription(i, activityData.total_sessions),
          completed: i < instanceData.current_session || 
                    (i === instanceData.current_session && instanceData.status === 'completed'),
          current: i === instanceData.current_session && instanceData.status !== 'completed',
          locked: i > instanceData.current_session && instanceData.status !== 'completed'
        });
      }
      setSessions(sessionList);

    } catch (err) {
      console.error('Error loading session progress:', err);
      setError(err as Error);
      
      // Try to restore from localStorage
      const cached = localStorage.getItem(`activity-progress-${activityId}-${userId}`);
      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          toast({
            title: 'Offline Mode',
            description: 'Loading cached progress data',
          });
        } catch {}
      }
    } finally {
      setLoading(false);
    }
  };

  const getSessionDescription = (session: number, total: number): string => {
    if (session === 1) return 'Introduction and Setup';
    if (session === total) return 'Final Session & Review';
    if (session === Math.ceil(total / 2)) return 'Midpoint Check-in';
    return `Continue your journey`;
  };

  const updateProgress = async (newSession: number) => {
    if (!instance || !activity) return;
    
    // Validate session number
    if (newSession < 1 || newSession > activity.total_sessions) {
      toast({
        title: 'Invalid Session',
        description: 'Session number out of range',
        variant: 'destructive',
      });
      return;
    }

    try {
      setSaving(true);

      const updates: Partial<ActivityInstance> = {
        current_session: newSession,
        last_accessed: new Date().toISOString(),
      };

      // Mark as completed if reaching the last session
      if (newSession === activity.total_sessions) {
        updates.status = 'completed';
        updates.completed_at = new Date().toISOString();
      }

      const { error: updateError } = await supabase
        .from('activity_instance')
        .update(updates)
        .eq('id', instance.id);

      if (updateError) throw updateError;

      // Update local state
      setInstance({
        ...instance,
        ...updates
      });

      // Update sessions
      const newSessions = sessions.map((s, idx) => ({
        ...s,
        completed: idx + 1 < newSession || 
                  (idx + 1 === newSession && updates.status === 'completed'),
        current: idx + 1 === newSession && updates.status !== 'completed',
        locked: idx + 1 > newSession && updates.status !== 'completed'
      }));
      setSessions(newSessions);

      // Trigger callback
      if (onSessionChange) {
        onSessionChange(newSession);
      }

      // Show celebration for completion
      if (updates.status === 'completed') {
        toast({
          title: '🎉 Activity Completed!',
          description: 'Congratulations on finishing all sessions!',
        });
      } else {
        toast({
          title: 'Progress Updated',
          description: `Now on Session ${newSession}`,
        });
      }

    } catch (err) {
      console.error('Error updating progress:', err);
      toast({
        title: 'Error',
        description: 'Failed to update progress',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const handlePrevious = () => {
    if (!instance || instance.current_session <= 1) return;
    updateProgress(instance.current_session - 1);
  };

  const handleNext = () => {
    if (!instance || !activity || instance.current_session >= activity.total_sessions) return;
    updateProgress(instance.current_session + 1);
  };

  const handleJumpToSession = (sessionNumber: number) => {
    const session = sessions[sessionNumber - 1];
    if (!session || session.locked) return;
    updateProgress(sessionNumber);
  };

  const handleRestart = async () => {
    if (!instance) return;
    
    try {
      setSaving(true);
      
      const { error } = await supabase
        .from('activity_instance')
        .update({
          current_session: 1,
          status: 'active',
          completed_at: null,
          started_at: new Date().toISOString()
        })
        .eq('id', instance.id);

      if (error) throw error;

      await loadData();
      
      toast({
        title: 'Activity Restarted',
        description: 'Starting from Session 1',
      });
      
      if (onSessionChange) {
        onSessionChange(1);
      }
    } catch (err) {
      console.error('Error restarting activity:', err);
      toast({
        title: 'Error',
        description: 'Failed to restart activity',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const getProgressPercentage = () => {
    if (!instance || !activity) return 0;
    if (instance.status === 'completed') return 100;
    return Math.round(((instance.current_session - 1) / activity.total_sessions) * 100);
  };

  const getEstimatedTimeRemaining = () => {
    if (!instance || !activity) return null;
    const remainingSessions = activity.total_sessions - instance.current_session + 1;
    const minutesPerSession = activity.estimated_duration_per_session || 30;
    const totalMinutes = remainingSessions * minutesPerSession;
    
    if (totalMinutes < 60) return `${totalMinutes} min`;
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${hours}h ${minutes}m`;
  };

  // Loading state
  if (loading) {
    return (
      <Card className={className}>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-32 mt-2" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-2 w-full" />
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map(i => (
              <Skeleton key={i} className="h-10 w-10 rounded-full" />
            ))}
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-24" />
          </div>
        </CardContent>
      </Card>
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
              {error.message || 'Failed to load session progress'}
            </AlertDescription>
          </Alert>
          <Button 
            onClick={loadData} 
            variant="outline" 
            className="mt-4"
            disabled={loading}
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  // No data state
  if (!activity || !instance) {
    return (
      <Card className={className}>
        <CardContent className="pt-6">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              No activity data available
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  const progress = getProgressPercentage();
  const timeRemaining = getEstimatedTimeRemaining();

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              {activity.title}
              {instance.status === 'completed' && (
                <Badge variant="default" className="gap-1">
                  <Trophy className="h-3 w-3" />
                  Completed
                </Badge>
              )}
            </CardTitle>
            <CardDescription className="mt-1">
              Session {instance.current_session} of {activity.total_sessions}
            </CardDescription>
          </div>
          {timeRemaining && instance.status !== 'completed' && (
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>{timeRemaining} remaining</span>
            </div>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Overall Progress</span>
            <span className="font-medium">{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Session Indicators */}
        <div className="relative">
          <div className="flex items-center justify-between">
            {sessions.map((session, idx) => (
              <div key={session.number} className="flex flex-col items-center">
                <button
                  onClick={() => handleJumpToSession(session.number)}
                  disabled={session.locked || saving}
                  className={cn(
                    "relative z-10 flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all",
                    "hover:scale-110 disabled:cursor-not-allowed disabled:hover:scale-100",
                    session.completed && "border-primary bg-primary text-primary-foreground",
                    session.current && "border-primary bg-background animate-pulse",
                    session.locked && "border-muted bg-muted text-muted-foreground opacity-50"
                  )}
                  title={session.title}
                >
                  {session.completed ? (
                    <CheckCircle2 className="h-5 w-5" />
                  ) : session.current ? (
                    <PlayCircle className="h-5 w-5" />
                  ) : session.locked ? (
                    <Circle className="h-5 w-5" />
                  ) : (
                    <span className="text-xs font-semibold">{session.number}</span>
                  )}
                </button>
                
                {/* Connecting Line */}
                {idx < sessions.length - 1 && (
                  <div 
                    className={cn(
                      "absolute top-5 w-full h-0.5",
                      "left-1/2 right-0",
                      session.completed ? "bg-primary" : "bg-muted"
                    )}
                    style={{
                      width: 'calc(100% - 2.5rem)',
                      transform: 'translateX(1.25rem)'
                    }}
                  />
                )}
                
                {/* Session Label */}
                <span className={cn(
                  "mt-2 text-xs text-center max-w-[60px]",
                  session.current ? "font-semibold" : "text-muted-foreground"
                )}>
                  {session.number === 1 && "Start"}
                  {session.number === activity.total_sessions && "End"}
                  {session.number !== 1 && session.number !== activity.total_sessions && `S${session.number}`}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Current Session Info */}
        {instance.status !== 'completed' && (
          <Alert>
            <PlayCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>Current Session:</strong> {sessions[instance.current_session - 1]?.description}
            </AlertDescription>
          </Alert>
        )}

        {/* Navigation Buttons */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={!instance || instance.current_session <= 1 || saving}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Previous
          </Button>
          
          {instance.status === 'completed' ? (
            <Button
              variant="outline"
              onClick={handleRestart}
              disabled={saving}
              className="ml-auto"
            >
              <RotateCcw className="h-4 w-4 mr-1" />
              Restart Activity
            </Button>
          ) : (
            <Button
              onClick={handleNext}
              disabled={!instance || !activity || instance.current_session >= activity.total_sessions || saving}
              className="ml-auto"
            >
              {instance.current_session === activity.total_sessions - 1 ? (
                <>
                  Complete Activity
                  <Flag className="h-4 w-4 ml-1" />
                </>
              ) : (
                <>
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </>
              )}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}