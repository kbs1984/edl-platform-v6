"use server";

import { createServerClient } from "@/utils/supabase/server";
import { ChatMessage, ChatMessageWithSender, ChatRoom, ChatRoomType } from "@/types/chat";
import { getProfile } from "@/utils/get-user-info";

export async function getRoomMessages(roomId: string): Promise<ChatMessageWithSender[]> {
  const supabase = await createServerClient();
  const { data, error } = await supabase
    .schema("chat")
    .rpc("get_room_messages", { p_room_id: roomId });

  if (error) {
    console.error("Error fetching messages via RPC:", error);
    return [];
  }
  if (!data) return [];

  // 이제 RPC 결과는 각 행에 sender_name, avatar_url 필드를 갖습니다.
  return (data as any[]).map(row => ({
    id: row.id,
    room_id: row.room_id,
    sender_id: row.sender_id,
    content: row.content,
    is_system: row.is_system,
    created_at: row.created_at,
    updated_at: row.updated_at,
    sender: {
      name: row.sender_name,
      image_path: row.image_path,
    },
  }));
}


export async function sendMessage(id: string, type: ChatRoomType, content: string): Promise<ChatMessage | null> {
  const supabase = await createServerClient();
  
  const room = type === "FRIEND" ? await getFriendChatRoom(id) : await getGroupChatRoom(id, type);
  if (!room) {
    console.error("Error: Room not found for", type, id);
    return null;
  }
  
  const profile = await getProfile();

  const { data: message, error } = await supabase
    .schema("chat")
    .from("message")
    .insert({
      room_id: room.id,
      sender_id: profile.id,
      content,
    })
    .select(`*`)
    .single();

  if (error) {
    console.error("Error sending message:", error);
    return null;
  }

  return message;
}

export async function getGroupChatRoom(id: string, type: ChatRoomType): Promise<ChatRoom | null> {
  const supabase = await createServerClient();
  if (type === "FRIEND") {
    throw new Error("Invalid chat room type");
  }

  if (type === "TEAM") {
    const { data: room, error } = await supabase
      .schema("chat")
      .from("room")
      .select("*")
      .eq("team_id", id)
      .eq("type", type)
      .single();

    if (error) {
      console.error("Error fetching team room:", error);
      return null;
    }

    return room;
  }

  if (type === "GUILD") {
    const { data: room, error } = await supabase
      .schema("chat")
      .from("room")
      .select("*")
      .eq("guild_id", id)
      .eq("type", type)
      .single();

    if (error) {
      console.error("Error fetching guild room:", error);
      return null;
    }

    return room;
  }

  return null;
}

export async function getFriendChatRoom(id: string): Promise<ChatRoom | null> {
  const supabase = await createServerClient();
  const { data: { user: user } } = await supabase.auth.getUser();
  if (!user) throw new Error("User not found");
  
  const { data: room, error } = await supabase
  .schema("chat")
  .rpc('get_friend_room', {
    p_user: user.id,
    p_friend: id,
  })
  .single();

  if (error) {
    console.error("Error fetching friend room:", error);
    return null;
  }

  return room as ChatRoom;
}
