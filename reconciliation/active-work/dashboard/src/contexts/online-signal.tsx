"use client";

import { useIdleDetection } from "@/hooks/use-idle-detection";
import { usePageAway } from "@/hooks/use-page-away";
import { getProfile } from "@/utils/get-user-info";
import { createClient } from "@/utils/supabase/client";
import { RealtimeChannel } from "@supabase/supabase-js";
import React, { createContext, useContext, useState, useEffect } from "react";

type PresenceContextType = {
  onDebate: boolean;
  setOnDebate: (onDebate: boolean) => void;
  presence: Record<string, any>;
}

const PresenceContext = createContext<PresenceContextType | null>(null);

export const usePresence = () => {
  const context = useContext(PresenceContext);
  if (!context) {
    throw new Error("usePresence must be used within a PresenceProvider");
  }
  return context;
}

export const PresenceProvider = ({ children }: React.ComponentProps<"div">) => {
  const supabase = createClient();
  const [onDebate, setOnDebate] = useState(false);
  const [presence, setPresence] = useState({});
  const [channel, setChannel] = useState<RealtimeChannel | null>(null);

  const [userId, setUserId] = useState<string | null>(null);

  const isPageAway = usePageAway(60 * 1000); // 1분 이상 페이지 away 상태면 true
  const isIdle = useIdleDetection(10 * 60 * 1000); // 10분 이상 idle 상태면 true
  const online = !(isPageAway || isIdle); // 두 조건 중 하나라도 만족하면 offline

  useEffect(() => {
    const getId = async () => {
      const profile = await getProfile();
      setUserId(profile.id);
    }
    getId();
  }, []);

  useEffect(() => {
    const presenceChannel = supabase.channel("public:presence", {
      config: { presence: { key: "user_presence" } },
    });
    setChannel(presenceChannel);
  }, []);

  useEffect(() => {
    if (!channel || !userId) return;

    channel.on("presence", { event: "sync" }, () => {
      const state = channel.presenceState();
      setPresence({ ...state });
    });

    channel.subscribe(async (status) => {
      if (status === "SUBSCRIBED") {
        await channel.track({
          user_id: userId,
          online: online,
          on_debate: false,
        });
      }
    });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [channel, userId]);

  useEffect(() => {
    if (!channel || !userId) return;
    const interval = setInterval(async () => {
      await channel.track({
        user_id: userId,
        online: online,
        on_debate: onDebate,
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [channel, onDebate]);

  const contextValue = React.useMemo<PresenceContextType>(
    () => ({
      onDebate: onDebate,
      setOnDebate: setOnDebate,
      presence: presence,
    }),
    [onDebate, setOnDebate, presence]
  );

  return (
    <PresenceContext.Provider value={contextValue}>
      {children}
    </PresenceContext.Provider>
  );
};