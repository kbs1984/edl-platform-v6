"use server";

import { StudentData } from "@/types/form";
import { Friend } from "@/types";
import { createServerClient } from "@/utils/supabase/server";

export const studentAction = async (formData: StudentData) => {
  const supabase = await createServerClient();

  if (!formData.termsAgreed) return { status: "error", message: "Terms not agreed"};
  if (!formData.addGuardianLater && !formData.guardianEmail) return { status: "error", message: "Guardian email not provided"};
  if (formData.graduationYear !== "Graduated" && !formData.schoolId) return { status: "error", message: "School name not provided"};

  if (formData.graduationYear === "Graduated") formData.schoolId = null;

  const guardian = await supabase
    .from("guardian")
    .select("id")
    .eq("email", formData.guardianEmail);

  // Get user first to ensure we have the user_id
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { status: "error", message: "User not found"};

  // Direct insert matching truth-seed pattern (NO user_id - uses auth.uid() default)
  const { data: studentData, error: studentAddError } = await supabase
    .from('student')
    .insert({
      graduation_year: formData.graduationYear === "Graduated" ? 2000 : formData.graduationYear,
      location: formData.location,
      school_id: formData.schoolId || null,
      guardian_id: guardian.data?.[0]?.id || null
      // NOTE: NOT including user_id - table uses auth.uid() as default
    })
    .select('id')
    .single();
  
  const studentId = studentData?.id;

  if (studentAddError) {
    console.error("Student insert error details:", {
      error: studentAddError,
      code: studentAddError.code,
      message: studentAddError.message,
      details: studentAddError.details,
      hint: studentAddError.hint
    });
    return { status: "error", message: `student add error: ${studentAddError.message}`};
  }
  
  const { error: profileError } = await supabase
    .from("profile")
    .update({
      active: true,
      term_agree_time: new Date().toISOString()
    })
    .eq("id", user.id);

  if (profileError) return { status: "error", message: `profile update error: ${profileError.message}`};

  return { status: "success", message: "Succesfully registered"};
}

export const enableChallengeAction = async (studentId: string, enabled: boolean) => {
  const supabase = await createServerClient();

  const { error } = await supabase
    .from("student")
    .update({ challenge_enabled: enabled })
    .eq("id", studentId);

  if (error) return { status: "error", message: `Failed to enable challenges: ${error.message}`};

  return { status: "success", message: "Challenges enabled successfully"};
}

export const getFriendListAction = async () => {
  const supabase = await createServerClient();

  const { data, error } = await supabase.rpc("get_friend_profiles").select("*");

  if (error) return { status: "error", message: `Failed to get friend list: ${error.message}`};
  if (!data) return { status: "success", message: "No friends found", data: []};
  const friends = data as Friend[];
  return { status: "success", message: "Friend list retrieved successfully", data: friends };
}

export const getFriendRequestListAction = async () => {
  const supabase = await createServerClient();
  const { data: { user: user } } = await supabase.auth.getUser();
  if (!user) return { status: "error", message: "User not found"};

  const { data, error } = await supabase.from("friendship").select("*").eq("friend_id", user.id).eq("status", "PENDING");

  if (error) return { status: "error", message: `Failed to get friend request list: ${error.message}`};
  return { status: "success", message: "Friend request list retrieved successfully", data };
}

export const sendFriendRequestAction = async (input: string) => {
  const supabase = await createServerClient();

  const { data, error } = await supabase.rpc("get_profile_uuid", { input: input });
  if (error) return { status: "error", message: `Failed to get profile: ${error.message}`};
  if (!data) return { status: "error", message: "Profile not found"};

  const { error: insertError } = await supabase
    .from("friendship")
    .insert({
      friend_id: data,
    });

  if (insertError) return { status: "error", message: `Failed to send friend request: ${insertError.message}`};
  return { status: "success", message: "Friend request sent successfully"};
}

export const updateFriendRequestAction = async (requestId: string, status: "ACCEPTED" | "REJECTED") => {
  const supabase = await createServerClient();
  const { error } = await supabase
    .from("friendship")
    .update({ 
      status: status,
      updated_at: new Date().toISOString()
    })
    .eq("id", requestId);

  if (error) return { status: "error", message: `Failed to update friend request: ${error.message}`};
  return { status: "success", message: "Friend request updated successfully"};
}

export const getProfilesAction = async (userIds: string[]) => {
  const supabase = await createServerClient();

  const { data, error } = await supabase
    .from("profile")
    .select("*")
    .in("id", userIds);

  if (error) return { status: "error", message: `Failed to get profiles: ${error.message}`};
  return { status: "success", message: "Profiles retrieved successfully", data };
}