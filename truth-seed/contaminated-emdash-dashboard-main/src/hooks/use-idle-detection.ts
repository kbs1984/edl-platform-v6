"use client";

import { useEffect, useRef, useState } from "react";

export function useIdleDetection(idleTime = 1800000) {
  const [isIdle, setIsIdle] = useState(false);
  const timerRef = useRef<any>(null);

  useEffect(() => {
    const resetTimer = () => {
      if (isIdle) {
        setIsIdle(false);
      }
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        setIsIdle(true);
      }, idleTime);
    };

    const events = ["mousemove", "keydown", "scroll", "touchstart"];
    events.forEach((event) => window.addEventListener(event, resetTimer));

    // 초기 타이머 설정
    resetTimer();

    return () => {
      events.forEach((event) => window.removeEventListener(event, resetTimer));
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [idleTime, isIdle]);

  return isIdle;
}