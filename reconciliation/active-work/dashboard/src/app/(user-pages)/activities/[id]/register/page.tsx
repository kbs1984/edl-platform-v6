import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { ActivityRegistration } from "@/components/activities/activity-registration";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ActivityRegisterPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();
  
  // Check authentication
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    redirect("/login");
  }

  // Get activity details
  const { data: activity, error: activityError } = await supabase
    .from("activity")
    .select(`
      *,
      activity_session (
        id,
        activity_id,
        session_number,
        title,
        objectives,
        duration_minutes
      )
    `)
    .eq('id', id)
    .single();

  if (activityError || !activity) {
    redirect("/activities");
  }

  // Check if already registered
  const { data: existingInstance } = await supabase
    .from("activity_instance")
    .select("id, status")
    .eq('activity_id', id)
    .eq('user_id', user.id)
    .single();

  if (existingInstance) {
    // Already registered, redirect to activity page
    redirect(`/activities/${id}`);
  }

  // Add mock enhanced data for demo
  const enhancedActivity = {
    ...activity,
    prerequisites: [
      "Basic understanding of debate concepts",
      "Commitment to complete all sessions",
      "Access to internet for research"
    ],
    learning_objectives: [
      "Develop critical thinking skills",
      "Learn effective argumentation techniques",
      "Practice public speaking",
      "Build confidence in expressing opinions"
    ],
    estimated_hours: activity.total_sessions * 1.5,
    difficulty: 'intermediate' as const,
    category: 'academic',
    tags: ['debate', 'critical-thinking', 'public-speaking'],
    max_participants: 30,
    current_participants: 18,
    emcoin_reward: 100,
    badge_rewards: ['Debate Novice', 'Critical Thinker'],
    schedule: {
      sessions_per_week: 2
    }
  };

  return (
    <div className="container mx-auto py-6">
      <ActivityRegistration 
        activity={enhancedActivity}
        sessions={activity.activity_session}
        userId={user.id}
      />
    </div>
  );
}