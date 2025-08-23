// src/components/chat/chat-message-list.tsx
"use client";

import { ChatMessageWithSender } from "@/types/chat";
import { ChatMessage } from "./chat-message";
import { useEffect, useRef } from "react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface ChatMessageListProps {
  messages: ChatMessageWithSender[];
  currentUserId: string;
}

export function ChatMessageList({ messages, currentUserId }: ChatMessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto p-4">
      <div className="space-y-1">
        {messages.map((message, index) => {
          const prevMessage = index > 0 ? messages[index - 1] : null;
          const nextMessage = index < messages.length - 1 ? messages[index + 1] : null;
          const isFirstInSequence = !prevMessage || prevMessage.sender_id !== message.sender_id;
          const isLastInSequence = !nextMessage || nextMessage.sender_id !== message.sender_id;
          
          // 날짜가 바뀌었는지 확인
          const currentDate = new Date(message.created_at).toDateString();
          const prevDate = prevMessage 
            ? new Date(prevMessage.created_at).toDateString()
            : null;
          const shouldShowDate = !prevDate || currentDate !== prevDate;
          
          return (
            <div key={message.id}>
              {(shouldShowDate || index === 0) && (
                <div className={cn("flex justify-center mb-4", index !== 0 && "my-4")}>
                  <span className="text-xs bg-muted px-2 py-1 rounded-full text-muted-foreground">
                    {format(new Date(message.created_at), 'yyyy년 MM월 dd일')}
                  </span>
                </div>
              )}
              <ChatMessage
                key={message.id}
                message={message}
                isCurrentUser={message.sender_id === currentUserId}
                isFirstInSequence={isFirstInSequence}
                isLastInSequence={isLastInSequence}
                showTime={isLastInSequence || (nextMessage && new Date(nextMessage.created_at).getTime() - new Date(message.created_at).getTime() > 120000)}
              />
            </div>
          );
        })}
      </div>
      <div ref={bottomRef} />
    </div>
  );
}