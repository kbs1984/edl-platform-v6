"use client";

import { Skeleton } from "@/components/ui/skeleton";

export function ChatSkeleton() {
  return (
    <div className="flex flex-col h-[600px] border rounded-lg bg-background p-4 space-y-4">
      <div className="flex-1 space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className={`flex ${i % 2 === 0 ? "justify-start" : "justify-end"}`}>
            <div className={`flex items-start gap-2 max-w-[80%] ${i % 2 === 0 ? "flex-row" : "flex-row-reverse"}`}>
              <Skeleton className="h-8 w-8 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-16 w-[200px]" />
              </div>
            </div>
          </div>
        ))}
      </div>
      <Skeleton className="h-10 w-full" />
    </div>
  );
}
