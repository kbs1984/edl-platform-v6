"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

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