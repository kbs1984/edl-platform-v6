"use client";

import { createClient } from "@/utils/supabase/client";
import { ChatMessage, ChatMessageWithSender, ChatRoomType } from "@/types/chat";
import { createContext, useContext, useEffect, useState } from "react";
import { getFriendChatRoom, getGroupChatRoom, getRoomMessages } from "@/lib/actions/chat-actions";
import { useToast } from "@/hooks/use-toast";

type ChatContextType = {
  messages: Record<string, ChatMessageWithSender[]>;
  isLoading: Record<string, boolean>;
  subscribe: (id: string, type: ChatRoomType) => void;
  unsubscribe: (id: string) => void;
};

const ChatContext = createContext<ChatContextType | null>(null);

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const supabase = createClient();
  const { toast } = useToast();
  const [messages, setMessages] = useState<Record<string, ChatMessageWithSender[]>>({});
  const [isLoading, setIsLoading] = useState<Record<string, boolean>>({});
  const [channels, setChannels] = useState<Record<string, any>>({});

  const subscribe = async (id: string, type: ChatRoomType) => {
    if (channels[id]) return;

    setIsLoading(prev => ({ ...prev, [id]: true }));

    // 1. Get chat room
    const room = type === "FRIEND" 
      ? await getFriendChatRoom(id) 
      : await getGroupChatRoom(id, type);

    if (!room) {
      toast({
        title: "오류",
        description: "채팅방을 찾을 수 없습니다.",
        variant: "destructive",
      });
      setIsLoading(prev => ({ ...prev, [id]: false }));
      return;
    }

    // 2. Get initial messages
    const initialMessages = await getRoomMessages(room.id);
    if (initialMessages) {
      setMessages(prev => ({ ...prev, [id]: initialMessages }));
    }
    setIsLoading(prev => ({ ...prev, [id]: false }));

    // 3. Subscribe to new messages
    const channel = supabase
      .channel(`room:${room.id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "chat",
          table: "message",
          filter: `room_id=eq.${room.id}`,
        },
        async (payload) => {
          const newMessage = payload.new as ChatMessage;
          const { data: sender } = await supabase
            .from("profile")
            .select("name, image_path")
            .eq("id", newMessage.sender_id)
            .single();

          if (sender) {
            setMessages(prev => ({
              ...prev,
              [id]: [...(prev[id] || []), { ...newMessage, sender }],
            }));
          }
        }
      )
      .subscribe();

    setChannels(prev => ({ ...prev, [id]: channel }));
  };

  const unsubscribe = (id: string) => {
    const channel = channels[id];
    if (channel) {
      supabase.removeChannel(channel);
      setChannels(prev => {
        const newChannels = { ...prev };
        delete newChannels[id];
        return newChannels;
      });
      setMessages(prev => {
        const newMessages = { ...prev };
        delete newMessages[id];
        return newMessages;
      });
      setIsLoading(prev => {
        const newLoading = { ...prev };
        delete newLoading[id];
        return newLoading;
      });
    }
  };

  useEffect(() => {
    return () => {
      Object.values(channels).forEach(channel => {
        supabase.removeChannel(channel);
      });
    };
  }, []);

  return (
    <ChatContext.Provider value={{ messages, isLoading, subscribe, unsubscribe }}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChat({ id, type }: { id: string; type: ChatRoomType }) {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within a ChatProvider");
  }

  useEffect(() => {
    context.subscribe(id, type);
    return () => {
      context.unsubscribe(id);
    };
  }, [id, type]);

  return {
    messages: context.messages[id] || [],
    isLoading: context.isLoading[id] || false,
  };
}
