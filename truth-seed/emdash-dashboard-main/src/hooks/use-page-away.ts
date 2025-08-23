"use client";

import { useEffect, useRef, useState } from "react";

export function usePageAway(threshold = 60000) {
  const [isAway, setIsAway] = useState(false);
  const timeoutRef = useRef<any>(null);

  useEffect(() => {
    function handleVisibilityChange() {
      if (document.visibilityState === "hidden") {
        // 페이지가 숨겨지면 threshold(1분) 후 offline으로 설정
        timeoutRef.current = setTimeout(() => {
          setIsAway(true);
        }, threshold);
      } else {
        // 페이지가 다시 보이면 타이머 클리어 및 online으로 변경
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }
        setIsAway(false);
      }
    }
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [threshold]);

  return isAway;
}