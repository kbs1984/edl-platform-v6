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

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { status: "error", message: "User not authenticated"};

  // Add explicit auth check to prevent database errors
  const { data: authSession } = await supabase.auth.getSession();
  if (!authSession?.session) {
    return { status: "error", message: "No valid session found"};
  }

  const { data, error } = await supabase.rpc("get_friend_profiles").select("*");

  if (error) return { status: "error", message: `Failed to get friend list: ${error.message}`};
  if (!data) return { status: "success", message: "No friends found", data: []};
  const friends = data as Friend[];
  return { status: "success", message: "Friend list retrieved successfully", data: friends };
}

export const getFriendRequestListAction = async () => {
  const supabase = await createServerClient();
  const { data: { user: user } } = await supabase.auth.getUser();
  if (!user) return { status: "error", message: "User not authenticated"};

  // Add explicit auth check to prevent database errors
  const { data: authSession } = await supabase.auth.getSession();
  if (!authSession?.session) {
    return { status: "error", message: "No valid session found"};
  }

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
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return { status: "error", message: "Not authenticated" };
  }

  // First, get the original friendship request to know who sent it
  const { data: originalRequest, error: fetchError } = await supabase
    .from("friendship")
    .select("user_id, friend_id")
    .eq("id", requestId)
    .single();

  if (fetchError || !originalRequest) {
    return { status: "error", message: "Friend request not found" };
  }

  // Verify the current user is the recipient of the request
  if (originalRequest.friend_id !== user.id) {
    return { status: "error", message: "You can only respond to requests sent to you" };
  }

  // Update the original request
  const updateData: any = {
    status: status,
    updated_at: new Date().toISOString()
  };

  // Add accepted_at timestamp if accepting
  if (status === "ACCEPTED") {
    updateData.accepted_at = new Date().toISOString();
  }

  const { error: updateError } = await supabase
    .from("friendship")
    .update(updateData)
    .eq("id", requestId);

  if (updateError) {
    return { status: "error", message: `Failed to update friend request: ${updateError.message}` };
  }

  // If accepted, create the reciprocal friendship AND chat room
  if (status === "ACCEPTED") {
    // Check if reciprocal already exists (defensive programming)
    const { data: existingReciprocal } = await supabase
      .from("friendship")
      .select("id")
      .eq("user_id", originalRequest.friend_id)
      .eq("friend_id", originalRequest.user_id)
      .single();

    if (!existingReciprocal) {
      const { error: reciprocalError } = await supabase
        .from("friendship")
        .insert({
          user_id: originalRequest.friend_id,  // Current user (who accepted)
          friend_id: originalRequest.user_id,  // Person who sent request
          status: "ACCEPTED",
          accepted_at: new Date().toISOString()
        });

      if (reciprocalError) {
        console.error("Failed to create reciprocal friendship:", reciprocalError);
        // Note: We don't fail the whole operation if reciprocal fails
        // The original acceptance already succeeded
      }
    }

    // Create chat room for the new friends
    // First check if a room already exists between them
    const { data: existingRoom } = await supabase
      .from("chat.room")
      .select(`
        id,
        chat.participant!inner(student_id)
      `)
      .eq("type", "FRIEND")
      .or(`chat.participant.student_id.eq.${originalRequest.user_id},chat.participant.student_id.eq.${originalRequest.friend_id}`)
      .single();

    if (!existingRoom) {
      // Create a new friend chat room
      const { data: newRoom, error: roomError } = await supabase
        .from("chat.room")
        .insert({
          type: "FRIEND",
          title: null  // Friend rooms don't need titles
        })
        .select()
        .single();

      if (roomError) {
        console.error("Failed to create chat room:", roomError);
      } else if (newRoom) {
        // Add both friends as participants
        const { error: participantError } = await supabase
          .from("chat.participant")
          .insert([
            { room_id: newRoom.id, student_id: originalRequest.user_id },
            { room_id: newRoom.id, student_id: originalRequest.friend_id }
          ]);

        if (participantError) {
          console.error("Failed to add chat participants:", participantError);
        } else {
          console.log("Chat room created successfully for friends:", newRoom.id);
        }
      }
    }
  }

  return { 
    status: "success", 
    message: status === "ACCEPTED" 
      ? "Friend request accepted! You are now friends." 
      : "Friend request declined."
  };
}

export const acceptFriendRequestAction = async (requestId: string) => {
  return updateFriendRequestAction(requestId, "ACCEPTED");
}

export const rejectFriendRequestAction = async (requestId: string) => {
  return updateFriendRequestAction(requestId, "REJECTED");
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

export const getFriendChatRoomAction = async (friendUserId: string) => {
  const supabase = await createServerClient();
  
  // Get current user
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { status: "error", message: "User not authenticated" };

  // Find the chat room for these two friends
  // Using complex JOIN since we don't have chat_room_id in friendship table yet
  const { data: room, error } = await supabase
    .schema("chat")
    .from("room")
    .select(`
      id,
      type,
      participant!inner(student_id)
    `)
    .eq("type", "FRIEND")
    .filter("participant.student_id", "in", `(${user.id},${friendUserId})`)
    .single();

  if (error || !room) {
    console.error("Error finding friend chat room:", error);
    return { status: "error", message: "Chat room not found" };
  }

  // Verify both participants are in the room
  const participants = room.participant as any[];
  const hasCurrentUser = participants.some(p => p.student_id === user.id);
  const hasFriend = participants.some(p => p.student_id === friendUserId);
  
  if (!hasCurrentUser || !hasFriend || participants.length !== 2) {
    return { status: "error", message: "Invalid chat room participants" };
  }

  return { status: "success", data: { roomId: room.id } };
}