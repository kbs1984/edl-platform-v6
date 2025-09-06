"use client";

import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

// Keep the existing Tab component for backward compatibility
export const Tab = ({ items, lengthInset = 16 }: { items: {title: string, link: string}[], lengthInset?: number}) => {
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState(searchParams.get("tab"));

  const tmp = items.findIndex(item => item.title === activeTab);
  const index = tmp === -1 ? 0 : tmp;

  return (
    <div className="relative">
      <div 
        className="grid relative"
        style={{
          gridTemplateColumns: `repeat(${items.length}, 1fr)`,
          gap: `${lengthInset}px`,
        }}
      >
        {items.map((item, index) => (
          <Link
            key={index}
            href={item.link}
            type="button"
            onClick={() => setActiveTab(item.title)}
            shallow
            className={`py-2 text-center justify-self-center self-center font-medium transition-all duration-300 ${activeTab === item.title ? "text-font font-bold": "text-subfont"}`}
          >
            {item.title}
          </Link>
        ))}
      </div>
      {/* 배경 border (얇은 선) */}
      <div className="absolute bottom-0 h-0.5 bg-accent" />
      {/* 슬라이딩 인디케이터 */}
      <span
        className="absolute bottom-0 h-0.5 bg-primary bg-font transition-all duration-300"
        style={{
          width: `calc(calc(100%/${items.length}) - ${lengthInset*(1-1/items.length)}px)`,
          left: index >= 0 ? `${(index / items.length) * 100}%` : "0%",
          transform: `translateX(${lengthInset * index / (items.length)}px)`,
        }}
      />
    </div>
  );
}

// Add Radix UI based Tabs components for profile customization
const Tabs = TabsPrimitive.Root;

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      "inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground",
      className
    )}
    {...props}
  />
));
TabsList.displayName = TabsPrimitive.List.displayName;

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm",
      className
    )}
    {...props}
  />
));
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      className
    )}
    {...props}
  />
));
TabsContent.displayName = TabsPrimitive.Content.displayName;

export { Tabs, TabsList, TabsTrigger, TabsContent };