// src/types/chat.ts
export type ChatRoomType = 'FRIEND' | 'TEAM' | 'GUILD';

export interface ChatRoom {
  id: string;
  type: ChatRoomType;
  title: string | null;
  team_id: string | null;
  guild_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface ChatParticipant {
  id: string;
  room_id: string;
  student_id: string;
  joined_at: string;
  last_read_at: string;
}

export interface ChatMessage {
  id: string;
  room_id: string;
  sender_id: string;
  content: string;
  is_system: boolean;
  created_at: string;
  updated_at: string;
}

export interface ChatMessageWithSender extends ChatMessage {
  sender: {
    name: string;
    image_path: string | null;
  };
}