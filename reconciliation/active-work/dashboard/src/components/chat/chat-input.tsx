"use client";

import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { useState } from "react";

interface ChatInputProps {
  onSendMessage: (content: string) => void;
  disabled?: boolean;
}

export function ChatInput({ onSendMessage, disabled }: ChatInputProps) {
  const [content, setContent] = useState("");
  const [isComposing, setIsComposing] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = content.trim();
    if (!text) return;
    onSendMessage(text);
    setContent("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 p-4 border-t items-start">
      <textarea
        value={content}
        name="content"
        className="flex h-10 w-full rounded-md border border-input bg-background/50 px-2.5 pt-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 focus:outline-hidden focus:ring-0 peer focus-visible:shadow-[0_0_10px_2px_#ffffff] resize-none"
        placeholder=""
        disabled={disabled}
        onChange={(e) => setContent(e.target.value)}
        onCompositionStart={() => setIsComposing(true)}
        onCompositionEnd={() => setIsComposing(false)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey && !isComposing) {
            e.preventDefault();
            handleSubmit(e);
          }
        }}
      />
      <Button type="submit" className="h-[38px]" disabled={disabled || !content.trim()}>
        <Send className="h-4 w-4" />
      </Button>
    </form>
  );
}
