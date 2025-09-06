'use client';

import { useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { 
  BookOpen, 
  Clock, 
  Calendar,
  Users,
  Trophy,
  Zap,
  AlertCircle,
  CheckCircle,
  ChevronRight,
  Info,
  Target,
  Star,
  TrendingUp,
  Loader2
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';

interface Activity {
  id: string;
  title: string;
  description: string;
  total_sessions: number;
  created_at: string;
  created_by?: string;
  // Enhanced fields
  prerequisites?: string[];
  learning_objectives?: string[];
  estimated_hours?: number;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  category?: string;
  tags?: string[];
  max_participants?: number;
  current_participants?: number;
  emcoin_reward?: number;
  badge_rewards?: string[];
  schedule?: {
    start_date?: string;
    end_date?: string;
    sessions_per_week?: number;
  };
}

interface ActivitySession {
  id: string;
  activity_id: string;
  session_number: number;
  title: string;
  objectives?: string[];
  duration_minutes?: number;
}

interface ActivityRegistrationProps {
  activity: Activity;
  sessions?: ActivitySession[];
  userId: string;
  onSuccess?: () => void;
}

export function ActivityRegistration({ 
  activity, 
  sessions = [], 
  userId,
  onSuccess 
}: ActivityRegistrationProps) {
  const [loading, setLoading] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [notifyGuardian, setNotifyGuardian] = useState(false);
  const [step, setStep] = useState<'preview' | 'confirm' | 'success'>('preview');
  const [registrationId, setRegistrationId] = useState<string | null>(null);
  
  const router = useRouter();
  const supabase = createClient();

  // Calculate activity metrics
  const totalHours = activity.estimated_hours || (activity.total_sessions * 1.5);
  const weeksToComplete = activity.schedule?.sessions_per_week 
    ? Math.ceil(activity.total_sessions / activity.schedule.sessions_per_week)
    : Math.ceil(activity.total_sessions / 2); // Default 2 sessions per week
  
  const spotsRemaining = activity.max_participants 
    ? Math.max(0, activity.max_participants - (activity.current_participants || 0))
    : null;

  const canRegister = agreed && (!activity.max_participants || spotsRemaining! > 0);

  const handleRegistration = async () => {
    if (!canRegister) return;

    setLoading(true);
    try {
      // Check if already registered
      const { data: existing, error: checkError } = await supabase
        .from('activity_instance')
        .select('id')
        .eq('activity_id', activity.id)
        .eq('user_id', userId)
        .single();

      if (existing) {
        toast({
          title: 'Already Registered',
          description: 'You are already registered for this activity',
          variant: 'destructive',
        });
        return;
      }

      // Create activity instance
      const { data: instance, error } = await supabase
        .from('activity_instance')
        .insert({
          activity_id: activity.id,
          user_id: userId,
          current_session: 1,
          status: 'active',
          started_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;

      setRegistrationId(instance.id);

      // Notify guardian if requested
      if (notifyGuardian) {
        await notifyGuardianOfRegistration(activity);
      }

      // Award initial EmCoins for registration
      if (activity.emcoin_reward) {
        await awardRegistrationBonus(activity.emcoin_reward);
      }

      setStep('success');
      
      toast({
        title: 'Registration Successful!',
        description: `You have been registered for ${activity.title}`,
      });

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Registration error:', error);
      toast({
        title: 'Registration Failed',
        description: 'There was an error registering for this activity',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const notifyGuardianOfRegistration = async (activity: Activity) => {
    try {
      // Get guardian info
      const { data: studentData } = await supabase
        .from('student')
        .select('guardian_id')
        .eq('user_id', userId)
        .single();

      if (studentData?.guardian_id) {
        // Create notification for guardian
        await supabase
          .from('notifications')
          .insert({
            user_id: studentData.guardian_id,
            type: 'activity_registration',
            title: 'Student Activity Registration',
            message: `Your student has registered for: ${activity.title}`,
            metadata: {
              activity_id: activity.id,
              student_id: userId,
            },
          });
      }
    } catch (error) {
      console.error('Failed to notify guardian:', error);
    }
  };

  const awardRegistrationBonus = async (amount: number) => {
    try {
      // Get user's wallet
      const { data: wallet } = await supabase
        .from('emcoin_wallets')
        .select('id')
        .eq('user_id', userId)
        .single();

      if (wallet) {
        // Create transaction for registration bonus
        await supabase
          .from('emcoin_transactions')
          .insert({
            to_wallet_id: wallet.id,
            amount: Math.floor(amount * 0.1), // 10% bonus for registering
            type: 'activity_fee',
            description: `Registration bonus for ${activity.title}`,
          });
      }
    } catch (error) {
      console.error('Failed to award registration bonus:', error);
    }
  };

  const startFirstSession = () => {
    router.push(`/activities/${activity.id}/session/1`);
  };

  const viewActivityDashboard = () => {
    router.push(`/activities/${activity.id}`);
  };

  if (step === 'success') {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <CardTitle className="text-2xl">Registration Complete!</CardTitle>
          <CardDescription>
            You have successfully registered for {activity.title}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <Info className="h-4 w-4" />
            <AlertTitle>What's Next?</AlertTitle>
            <AlertDescription>
              You can now start your first session. The activity will guide you through
              {' '}{activity.total_sessions} sessions at your own pace.
            </AlertDescription>
          </Alert>
          
          {activity.emcoin_reward && (
            <Alert className="border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20">
              <Zap className="h-4 w-4 text-yellow-600" />
              <AlertTitle>EmCoin Bonus!</AlertTitle>
              <AlertDescription>
                You've earned {Math.floor(activity.emcoin_reward * 0.1)} EmCoins for registering!
                Complete all sessions to earn the full {activity.emcoin_reward} EmCoins.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
        <CardFooter className="flex gap-2">
          <Button onClick={startFirstSession} className="flex-1">
            Start First Session
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
          <Button variant="outline" onClick={viewActivityDashboard}>
            View Activity Details
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Activity Overview */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl">{activity.title}</CardTitle>
              <CardDescription className="mt-2">
                {activity.description}
              </CardDescription>
            </div>
            {activity.difficulty && (
              <Badge 
                variant="secondary"
                className={cn(
                  activity.difficulty === 'beginner' && 'bg-green-100 text-green-700',
                  activity.difficulty === 'intermediate' && 'bg-yellow-100 text-yellow-700',
                  activity.difficulty === 'advanced' && 'bg-red-100 text-red-700'
                )}
              >
                {activity.difficulty}
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Key Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex flex-col">
              <span className="text-sm text-muted-foreground flex items-center gap-1">
                <Clock className="h-4 w-4" />
                Duration
              </span>
              <span className="text-lg font-semibold">{totalHours} hours</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-muted-foreground flex items-center gap-1">
                <BookOpen className="h-4 w-4" />
                Sessions
              </span>
              <span className="text-lg font-semibold">{activity.total_sessions}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-muted-foreground flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                Timeline
              </span>
              <span className="text-lg font-semibold">{weeksToComplete} weeks</span>
            </div>
            {spotsRemaining !== null && (
              <div className="flex flex-col">
                <span className="text-sm text-muted-foreground flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  Spots Left
                </span>
                <span className={cn(
                  "text-lg font-semibold",
                  spotsRemaining <= 5 && "text-orange-600",
                  spotsRemaining === 0 && "text-red-600"
                )}>
                  {spotsRemaining}
                </span>
              </div>
            )}
          </div>

          <Separator />

          {/* Learning Objectives */}
          {activity.learning_objectives && activity.learning_objectives.length > 0 && (
            <div>
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <Target className="h-4 w-4" />
                Learning Objectives
              </h3>
              <ul className="space-y-1">
                {activity.learning_objectives.map((objective, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                    <span>{objective}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Prerequisites */}
          {activity.prerequisites && activity.prerequisites.length > 0 && (
            <div>
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                Prerequisites
              </h3>
              <ul className="space-y-1">
                {activity.prerequisites.map((prereq, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm">
                    <Info className="h-4 w-4 text-blue-500 mt-0.5" />
                    <span>{prereq}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Rewards */}
          {(activity.emcoin_reward || activity.badge_rewards) && (
            <div>
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <Trophy className="h-4 w-4" />
                Rewards
              </h3>
              <div className="flex flex-wrap gap-2">
                {activity.emcoin_reward && (
                  <Badge variant="outline" className="gap-1">
                    <Zap className="h-3 w-3 text-yellow-500" />
                    {activity.emcoin_reward} EmCoins
                  </Badge>
                )}
                {activity.badge_rewards?.map((badge, idx) => (
                  <Badge key={idx} variant="outline" className="gap-1">
                    <Star className="h-3 w-3" />
                    {badge}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Session Overview */}
      {sessions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Session Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {sessions.slice(0, 5).map((session) => (
                <div key={session.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-semibold text-sm">
                      {session.session_number}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{session.title}</p>
                      {session.duration_minutes && (
                        <p className="text-xs text-muted-foreground">
                          {session.duration_minutes} minutes
                        </p>
                      )}
                    </div>
                  </div>
                  {session.objectives && session.objectives.length > 0 && (
                    <Badge variant="secondary" className="text-xs">
                      {session.objectives.length} objectives
                    </Badge>
                  )}
                </div>
              ))}
              {sessions.length > 5 && (
                <p className="text-sm text-muted-foreground text-center py-2">
                  + {sessions.length - 5} more sessions
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Registration Confirmation */}
      <Card>
        <CardHeader>
          <CardTitle>Registration Confirmation</CardTitle>
          <CardDescription>
            Please review and confirm your registration
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {spotsRemaining !== null && spotsRemaining <= 5 && spotsRemaining > 0 && (
            <Alert className="border-orange-500">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Limited Spots Available</AlertTitle>
              <AlertDescription>
                Only {spotsRemaining} spots remaining for this activity. Register now to secure your place.
              </AlertDescription>
            </Alert>
          )}

          {spotsRemaining === 0 && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Activity Full</AlertTitle>
              <AlertDescription>
                This activity is currently full. You can join the waitlist to be notified when spots become available.
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-3">
            <div className="flex items-start space-x-2">
              <Checkbox 
                id="terms" 
                checked={agreed}
                onCheckedChange={(checked) => setAgreed(checked as boolean)}
                disabled={spotsRemaining === 0}
              />
              <div className="space-y-1 leading-none">
                <Label htmlFor="terms" className="cursor-pointer">
                  I understand the commitment required
                </Label>
                <p className="text-sm text-muted-foreground">
                  I commit to completing all {activity.total_sessions} sessions over approximately {weeksToComplete} weeks.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-2">
              <Checkbox 
                id="guardian" 
                checked={notifyGuardian}
                onCheckedChange={(checked) => setNotifyGuardian(checked as boolean)}
                disabled={spotsRemaining === 0}
              />
              <div className="space-y-1 leading-none">
                <Label htmlFor="guardian" className="cursor-pointer">
                  Notify my guardian (optional)
                </Label>
                <p className="text-sm text-muted-foreground">
                  Send a notification to my guardian about this registration.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex gap-2">
          {spotsRemaining === 0 ? (
            <Button className="flex-1" disabled>
              Join Waitlist
            </Button>
          ) : (
            <>
              <Button 
                className="flex-1" 
                onClick={handleRegistration}
                disabled={!canRegister || loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Registering...
                  </>
                ) : (
                  <>
                    Complete Registration
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
              <Button variant="outline" onClick={() => router.back()}>
                Cancel
              </Button>
            </>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}