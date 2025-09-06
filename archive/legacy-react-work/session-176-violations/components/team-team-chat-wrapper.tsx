"use client";

import { ChatContainer } from "@/components/chat/chat-container";
import { ChatProvider } from "@/contexts/chat-context";

interface TeamChatWrapperProps {
  teamId: string;
  currentUserId: string;
}

export function TeamChatWrapper({ teamId, currentUserId }: TeamChatWrapperProps) {
  return (
    <ChatProvider>
      <ChatContainer
        teamId={teamId}
        type="TEAM"
        currentUserId={currentUserId}
      />
    </ChatProvider>
  );
}