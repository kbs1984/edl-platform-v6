"use server"

import { createServerClient } from "@/utils/supabase/server";

export async function sendFriendRequest(friendId: string) {
  const supabase = await createServerClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { error: "User not authenticated", success: false };
  }

  // Check if request already exists
  const { data: existingRequest } = await supabase
    .from("friendship")
    .select("id, status")
    .or(`user_id.eq.${user.id},friend_id.eq.${user.id}`)
    .or(`user_id.eq.${friendId},friend_id.eq.${friendId}`)
    .single();

  if (existingRequest) {
    if (existingRequest.status === 'PENDING') {
      return { error: "Friend request already pending", success: false };
    }
    if (existingRequest.status === 'ACCEPTED') {
      return { error: "Already friends", success: false };
    }
  }

  // Create new friend request
  const { error } = await supabase
    .from("friendship")
    .insert({
      user_id: user.id,
      friend_id: friendId,
      status: 'PENDING'
    });

  if (error) {
    return { error: error.message, success: false };
  }

  return { success: true };
}

export async function acceptFriendRequest(requestId: string) {
  const supabase = await createServerClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { error: "User not authenticated", success: false };
  }

  const { error } = await supabase
    .from("friendship")
    .update({
      status: 'ACCEPTED',
      accepted_at: new Date().toISOString()
    })
    .eq("id", requestId)
    .eq("friend_id", user.id); // Only the recipient can accept

  if (error) {
    return { error: error.message, success: false };
  }

  return { success: true };
}

export async function rejectFriendRequest(requestId: string) {
  const supabase = await createServerClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { error: "User not authenticated", success: false };
  }

  const { error } = await supabase
    .from("friendship")
    .update({ status: 'REJECTED' })
    .eq("id", requestId)
    .eq("friend_id", user.id); // Only the recipient can reject

  if (error) {
    return { error: error.message, success: false };
  }

  return { success: true };
}

export async function removeFriend(friendId: string) {
  const supabase = await createServerClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { error: "User not authenticated", success: false };
  }

  const { error } = await supabase
    .from("friendship")
    .delete()
    .or(`user_id.eq.${user.id},friend_id.eq.${user.id}`)
    .or(`user_id.eq.${friendId},friend_id.eq.${friendId}`)
    .eq("status", "ACCEPTED");

  if (error) {
    return { error: error.message, success: false };
  }

  return { success: true };
}