import { useState, useEffect } from "react";
import { toast } from "@/hooks/use-toast";
import { getFriendListAction, getFriendRequestListAction } from "@/lib/actions/student-actions";
import { Friend, Friendship } from "@/types";
import { usePresence } from "@/contexts/online-signal";
import { getProfile } from "@/utils/get-user-info";
import { createClient } from "@/utils/supabase/client";

export type FriendWithStatus = Friend & {
  status: "online" | "onDebate" | null;
};

export type PresenceType = {
  user_id: string;
  on_debate: boolean;
  online: boolean;
  presence_ref: string;
};

/**
 * @returns friends - 업데이트된 친구 목록
 */
export function useFriends() {
  const supabase = createClient();
  
  const { presence } = usePresence();
  const [userId, setUserId] = useState<string | null>(null);

  const [friends, setFriends] = useState<FriendWithStatus[]>([]);
  const [friendRequests, setFriendRequests] = useState<Friendship[]>([]);

  const updateFriends = async () => {
    const res = await getFriendListAction();
    if (res.status === "error") {
      toast({
        title: "Get Friends Error",
        description: `Friend Sidebar: ${res.message}`,
        variant: "destructive",
      });
    }
    if (res.data) {
      const newFriends = res.data.map((friend: Friend) => {
        return {
          ...friend,
          status: null,
        }
      });

      setFriends([]);
      setFriends([ ...newFriends ]);
    }
  }
  
  useEffect(() => {
    const fetchUserId = async () => {
      const profile = await getProfile();
      if (profile) {
        setUserId(profile.id);
      }
    };
    fetchUserId();
  }, []);

  useEffect(() => {
    const fetchFriendRequests = async () => {
      // Wait for authentication to be established
      if (!userId) return;
      
      const res = await getFriendRequestListAction();
      if (res.status === "error") {
        toast({
          title: "Get Friend Requests Error",
          description: `Friend Request Dialog: ${res.message}`,
          variant: "destructive",
        });
        return;
      } else if (res.data) {
        setFriendRequests(res.data);
      }
    };
    fetchFriendRequests();
  }, [userId]); // Only run when userId is available

  useEffect(() => {
    if (!userId) return;
    
    const channel = supabase
      .channel("friend-updates")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "friendship",
          filter: `friend_id=eq.${userId}`,
        },
        (payload) => {
          if (payload.eventType === "INSERT" && payload.new.status === "PENDING") {
            const newFriendship = payload.new as Friendship;
            setFriendRequests((prev) => [ ...prev, newFriendship ]);
          }

          if (payload.eventType === "UPDATE") {
            if (payload.new.status === "ACCEPTED") {
              // Remove from requests and update friends list immediately
              setFriendRequests((prev) => prev.filter((req) => req.id !== payload.new.id));
              updateFriends(); // Refresh friends list when accepted
            } else if (payload.new.status === "REJECTED" || payload.new.status === "CANCELED") {
              setFriendRequests((prev) => prev.filter((req) => req.id !== payload.new.id));
            }
          }

          if (payload.eventType === "DELETE") {
            setFriendRequests((prev) => prev.filter((req) => req.id !== payload.old.id));
            updateFriends(); // Refresh when friendship deleted
          }
        }
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "friendship",
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          // Listen for changes where current user is the requester
          if (payload.eventType === "UPDATE" && payload.new.status === "ACCEPTED") {
            updateFriends(); // Refresh friends list when your request is accepted
          }
          if (payload.eventType === "DELETE") {
            updateFriends(); // Refresh when friendship deleted
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  useEffect(() => {
    // Only update friends after userId is available
    if (!userId) return;
    updateFriends();
  }, [userId]);

  useEffect(() => {
    if (presence && presence.user_presence) {
      setFriends((prev) => {
        const newFriends = prev.map((friend) => {
          const online: PresenceType = presence.user_presence.find((p: PresenceType) => p.user_id === friend.friend_id);
          if (online) {
            if (online.on_debate) return { ...friend, status: "onDebate" };
            if (online.online) {
              return { ...friend, status: "online" };
            }
          }
          return { ...friend, status: null };
        }) as FriendWithStatus[];
        return newFriends;
      });
    }
  }, [presence]);

  return { friends: friends, friendRequests: friendRequests };
}
