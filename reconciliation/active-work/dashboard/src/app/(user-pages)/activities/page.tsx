import { redirect } from "next/navigation";
import { createServerClient } from "@/utils/supabase/server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Clock, CheckCircle, PlayCircle, PauseCircle } from "lucide-react";
import Link from "next/link";

export default async function ActivitiesPage() {
  const supabase = await createServerClient();
  
  // Check authentication
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    redirect("/login");
  }

  // Get all available activities
  const { data: activities, error: activitiesError } = await supabase
    .from("activity")
    .select(`
      id,
      title,
      description,
      total_sessions,
      created_at
    `)
    .order("created_at", { ascending: false });

  // Get user's activity instances
  const { data: instances, error: instancesError } = await supabase
    .from("activity_instance")
    .select(`
      id,
      activity_id,
      current_session,
      status,
      started_at,
      completed_at
    `)
    .eq("user_id", user.id);

  const instanceMap = new Map(instances?.map(inst => [inst.activity_id, inst]) || []);

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <BookOpen className="h-8 w-8" />
          Activity Runtime ENGINE
        </h1>
        <p className="text-muted-foreground mt-2">
          Multi-session activities with progress tracking (US-155)
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Active Activities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {instances?.filter(i => i.status === 'active').length || 0}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {instances?.filter(i => i.status === 'completed').length || 0}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Available</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {activities?.length || 0}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Activities List */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Available Activities</h2>
        
        {!activities || activities.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-muted-foreground">
                No activities available yet. Check back soon!
              </p>
            </CardContent>
          </Card>
        ) : (
          activities.map((activity) => {
            const instance = instanceMap.get(activity.id);
            const isActive = instance?.status === 'active';
            const isCompleted = instance?.status === 'completed';
            const progress = instance ? 
              `Session ${instance.current_session} of ${activity.total_sessions}` : 
              null;

            return (
              <Card key={activity.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="flex items-center gap-2">
                        {activity.title}
                        {isCompleted && <CheckCircle className="h-5 w-5 text-green-500" />}
                        {isActive && <PlayCircle className="h-5 w-5 text-blue-500" />}
                      </CardTitle>
                      <CardDescription className="mt-2">
                        {activity.description}
                      </CardDescription>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {activity.total_sessions} sessions
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-muted-foreground">
                      {progress && (
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {progress}
                        </span>
                      )}
                    </div>
                    <div className="space-x-2">
                      {!instance && (
                        <Link href={`/activities/${activity.id}/start`}>
                          <Button size="sm">
                            Start Activity
                          </Button>
                        </Link>
                      )}
                      {isActive && (
                        <Link href={`/activities/${activity.id}/session/${instance.current_session}`}>
                          <Button size="sm" variant="outline">
                            Continue Session {instance.current_session}
                          </Button>
                        </Link>
                      )}
                      {isCompleted && (
                        <Link href={`/activities/${activity.id}/review`}>
                          <Button size="sm" variant="secondary">
                            Review
                          </Button>
                        </Link>
                      )}
                      {/* TODO: Notify guardian when session complete */}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      {/* My Progress Section */}
      {instances && instances.length > 0 && (
        <div className="mt-8 space-y-4">
          <h2 className="text-xl font-semibold">My Progress</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {instances
              .filter(inst => inst.status === 'active' || inst.status === 'paused')
              .map((instance) => {
                const activity = activities?.find(a => a.id === instance.activity_id);
                if (!activity) return null;

                return (
                  <Card key={instance.id}>
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-2">
                        {activity.title}
                        {instance.status === 'paused' && 
                          <PauseCircle className="h-4 w-4 text-yellow-500" />
                        }
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="w-full bg-secondary rounded-full h-2">
                          <div 
                            className="bg-primary h-2 rounded-full transition-all"
                            style={{ 
                              width: `${(instance.current_session / activity.total_sessions) * 100}%` 
                            }}
                          />
                        </div>
                        <div className="flex justify-between text-sm text-muted-foreground">
                          <span>Session {instance.current_session} of {activity.total_sessions}</span>
                          <span>{Math.round((instance.current_session / activity.total_sessions) * 100)}%</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
          </div>
        </div>
      )}
    </div>
  );
}