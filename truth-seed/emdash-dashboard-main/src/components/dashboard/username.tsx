"use client";

import { Copy } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export const Username = ({ username }: { username: string }) => {

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(username);
      toast({ title: "Copied", description: "Username copied to clipboard", variant: "default" });
    } catch (error) {
      toast({ title: "Error", description: `Failed to copy username. error: ${error}`, variant: "destructive" });
    }
  };

  return (
    <div className="flex items-center">
      <div className="mr-2">{username}</div>
      <button onClick={handleCopy} type="button">
        <Copy className="w-4 h-4 text-foreground inline cursor-pointer" />
      </button>
    </div>
  );
};
