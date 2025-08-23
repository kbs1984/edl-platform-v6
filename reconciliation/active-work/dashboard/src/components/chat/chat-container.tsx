"use client";

import { ChatInput } from "./chat-input";
import { ChatMessageList } from "./chat-message-list";
import { useChat } from "@/hooks/use-chat";
import { sendMessage } from "@/lib/actions/chat-actions";
import { useToast } from "@/hooks/use-toast";
import { ChatSkeleton } from "./chat-skeleton";
import { ChatRoomType } from "@/types/chat";

interface ChatContainerProps {
  teamId: string;
  currentUserId: string;
  disabled?: boolean;
  type: ChatRoomType;
}

export function ChatContainer({
  teamId,
  currentUserId,
  disabled,
  type,
}: ChatContainerProps) {
  const { messages, isLoading } = useChat({id: teamId, type});
  const { toast } = useToast();

  const onSendMessage = async (content: string) => {
    const result = await sendMessage(teamId, type, content);
    if (!result) {
      toast({
        title: "오류",
        description: "메시지 전송에 실패했습니다.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) return <ChatSkeleton />;

  return (
    <div className="flex flex-col h-[600px] border rounded-lg bg-background">
      <ChatMessageList
        messages={messages}
        currentUserId={currentUserId}
      />
      <ChatInput
        onSendMessage={onSendMessage}
        disabled={disabled}
      />
    </div>
  );
}