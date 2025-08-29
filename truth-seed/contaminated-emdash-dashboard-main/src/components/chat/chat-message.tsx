// src/components/chat/chat-message.tsx
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { ChatMessageWithSender } from "@/types/chat";
import { format } from "date-fns";

interface ChatMessageProps {
  message: ChatMessageWithSender;
  isCurrentUser: boolean;
  isFirstInSequence: boolean;
  isLastInSequence: boolean;
  showTime: boolean;
}

export function ChatMessage({ message, isCurrentUser, isFirstInSequence, isLastInSequence, showTime }: ChatMessageProps) {
  return (
    <div className={cn(
      "flex gap-2",
      !isCurrentUser ? "flex-row" : "flex-row-reverse",
      isLastInSequence && "pb-2"
    )}>
      {isFirstInSequence ? (
        <Avatar className="h-8 w-8 mt-1">
          <AvatarImage src={message.sender.image_path || undefined} />
          <AvatarFallback>{message.sender.name[0]}</AvatarFallback>
        </Avatar>
      ) : (
        <div className="w-9" />
      )}
      <div className={cn(
        "w-full flex justify-start",
        !isCurrentUser ? "flex-row" : "flex-row-reverse"
      )}>
        <div className={cn(
          "flex flex-col max-w-[70%]",
          !isCurrentUser ? "items-end" : "items-start"
        )}>
          <div className={cn(
            "rounded-lg px-3 py-2",
            isCurrentUser ? "bg-primary text-primary-foreground" : "bg-muted",
            isFirstInSequence && isLastInSequence && "rounded-lg",
          )}>
            {message.content}
          </div>
      </div>
        {showTime && (
          <span className="text-xs text-muted-foreground px-2 pb-1 flex items-end">
            {format(new Date(message.created_at), 'HH:mm')}
          </span>
        )}
      </div>
    </div>
  );
}

// src/components/chat/chat-input.tsx
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

interface ChatInputProps {
  onSendMessage: (content: string) => void;
  disabled?: boolean;
}

export function ChatInput({ onSendMessage, disabled }: ChatInputProps) {
  const [content, setContent] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    
    onSendMessage(content);
    setContent("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 p-4 border-t">
      <Textarea
        value={content}
        name="content"
        onChange={(e) => setContent(e.target.value)}
        placeholder="메시지를 입력하세요..."
        className="resize-none"
        disabled={disabled}
        rows={1}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
          }
        }}
      />
      <Button type="submit" disabled={disabled || !content.trim()}>
        전송
      </Button>
    </form>
  );
}