"use server"

import { createServerClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

// US-155: Start a new activity instance
export async function startActivity(activityId: string) {
  const supabase = await createServerClient();
  
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return { status: "error", message: "Not authenticated" };
  }

  // Check if instance already exists
  const { data: existing } = await supabase
    .from("activity_instance")
    .select("id")
    .eq("activity_id", activityId)
    .eq("user_id", user.id)
    .single();

  if (existing) {
    return { status: "error", message: "Already started this activity" };
  }

  // Create new instance
  const { data: instance, error: instanceError } = await supabase
    .from("activity_instance")
    .insert({
      activity_id: activityId,
      user_id: user.id,
      current_session: 1,
      status: "active"
    })
    .select()
    .single();

  if (instanceError) {
    return { status: "error", message: instanceError.message };
  }

  // Get first session
  const { data: firstSession } = await supabase
    .from("activity_session")
    .select("id")
    .eq("activity_id", activityId)
    .eq("session_number", 1)
    .single();

  if (firstSession) {
    // Create progress record for first session
    await supabase
      .from("session_progress")
      .insert({
        instance_id: instance.id,
        session_id: firstSession.id,
        progress_data: {}
      });
  }

  revalidatePath("/activities");
  return { status: "success", data: instance };
}

// US-156: Save session progress
export async function saveSessionProgress(
  instanceId: string,
  sessionId: string,
  progressData: any
) {
  const supabase = await createServerClient();
  
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return { status: "error", message: "Not authenticated" };
  }

  // Update or create progress record
  const { error } = await supabase
    .from("session_progress")
    .upsert({
      instance_id: instanceId,
      session_id: sessionId,
      progress_data: progressData,
      last_save_at: new Date().toISOString(),
      auto_save_count: progressData.auto_save_count || 0
    }, {
      onConflict: "instance_id,session_id"
    });

  if (error) {
    return { status: "error", message: error.message };
  }

  return { status: "success", message: "Progress saved" };
}

// US-157: Complete session and move to next
export async function completeSession(
  instanceId: string,
  sessionId: string,
  finalData?: any
) {
  const supabase = await createServerClient();
  
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return { status: "error", message: "Not authenticated" };
  }

  // Mark session as complete
  const { error: progressError } = await supabase
    .from("session_progress")
    .update({
      is_complete: true,
      completed_at: new Date().toISOString(),
      progress_data: finalData || {}
    })
    .eq("instance_id", instanceId)
    .eq("session_id", sessionId);

  if (progressError) {
    return { status: "error", message: progressError.message };
  }

  // Get instance and activity info
  const { data: instance } = await supabase
    .from("activity_instance")
    .select(`
      *,
      activity:activity_id (
        id,
        total_sessions
      )
    `)
    .eq("id", instanceId)
    .single();

  if (!instance) {
    return { status: "error", message: "Instance not found" };
  }

  const nextSession = instance.current_session + 1;
  
  // Check if there are more sessions
  if (nextSession <= instance.activity.total_sessions) {
    // Move to next session
    const { error: updateError } = await supabase
      .from("activity_instance")
      .update({
        current_session: nextSession
      })
      .eq("id", instanceId);

    if (updateError) {
      return { status: "error", message: updateError.message };
    }

    // Get next session info
    const { data: nextSessionData } = await supabase
      .from("activity_session")
      .select("id")
      .eq("activity_id", instance.activity_id)
      .eq("session_number", nextSession)
      .single();

    if (nextSessionData) {
      // Create progress record for next session
      await supabase
        .from("session_progress")
        .insert({
          instance_id: instanceId,
          session_id: nextSessionData.id,
          progress_data: {}
        });
    }

    return { 
      status: "success", 
      message: `Moved to Session ${nextSession}`,
      nextSession 
    };
  } else {
    // Activity complete
    const { error: completeError } = await supabase
      .from("activity_instance")
      .update({
        status: "completed",
        completed_at: new Date().toISOString()
      })
      .eq("id", instanceId);

    if (completeError) {
      return { status: "error", message: completeError.message };
    }

    // TODO: Notify guardian of completion
    
    revalidatePath("/activities");
    return { 
      status: "success", 
      message: "Activity completed!",
      completed: true 
    };
  }
}

// US-158/US-159: Submit assignment within activity
export async function submitAssignment(
  assignmentId: string,
  instanceId: string,
  content: string,
  citations?: any,
  fileUrls?: string[]
) {
  const supabase = await createServerClient();
  
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return { status: "error", message: "Not authenticated" };
  }

  // Create or update submission
  const { data: submission, error } = await supabase
    .from("assignment_submission")
    .upsert({
      assignment_id: assignmentId,
      instance_id: instanceId,
      user_id: user.id,
      content,
      citations: citations || null,
      file_urls: fileUrls || [],
      status: "submitted",
      updated_at: new Date().toISOString()
    }, {
      onConflict: "assignment_id,instance_id"
    })
    .select()
    .single();

  if (error) {
    return { status: "error", message: error.message };
  }

  // TODO: Notify supervisor of submission

  return { 
    status: "success", 
    message: "Assignment submitted successfully",
    data: submission 
  };
}

// Get activity sessions with progress
export async function getActivityWithProgress(activityId: string) {
  const supabase = await createServerClient();
  
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return { status: "error", message: "Not authenticated" };
  }

  // Get activity with all sessions
  const { data: activity, error: activityError } = await supabase
    .from("activity")
    .select(`
      *,
      sessions:activity_session (
        id,
        session_number,
        title,
        content,
        objectives,
        duration_minutes,
        assignments:activity_assignment (
          id,
          title,
          description,
          requirements,
          rubric,
          due_offset_hours
        )
      )
    `)
    .eq("id", activityId)
    .single();

  if (activityError) {
    return { status: "error", message: activityError.message };
  }

  // Get user's instance and progress
  const { data: instance } = await supabase
    .from("activity_instance")
    .select(`
      *,
      progress:session_progress (
        session_id,
        is_complete,
        progress_data,
        last_save_at
      )
    `)
    .eq("activity_id", activityId)
    .eq("user_id", user.id)
    .single();

  return { 
    status: "success", 
    data: {
      activity,
      instance,
      sessions: activity.sessions.sort((a: any, b: any) => 
        a.session_number - b.session_number
      )
    }
  };
}