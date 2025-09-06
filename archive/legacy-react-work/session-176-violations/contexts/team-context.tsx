"use client";

import { createClient } from "@/utils/supabase/client";
import { createContext, useContext, useEffect, useState, useRef } from "react";
import { TeamInvitation, TeamMemberProfile, TeamWithStatus } from "@/types";
import { getMyTeams, getPendingTeamInvitations } from "@/lib/actions/team-actions";
import { getProfile } from "@/utils/get-user-info";

type TeamContextType = {
  teamRequests: TeamInvitation[];
  isLoading: boolean;
  error: string | null;
  hasPendingRequests: boolean;
  memberStatus: Map<string, Map<string, TeamMemberProfile['status']>>;
  myTeams: TeamWithStatus[] | null;
  refetchTeams: () => Promise<void>;
  refetchRequests: () => Promise<void>;
};

const TeamContext = createContext<TeamContextType | null>(null);

export function TeamProvider({ children }: { children: React.ReactNode }) {
  const supabase = createClient();
  const dataFetchedRef = useRef(false);
  
  const [userId, setUserId] = useState<string | null>(null);
  const [teamRequests, setTeamRequests] = useState<TeamInvitation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [myTeams, setMyTeams] = useState<TeamWithStatus[] | null>(null);
  const [myTeamIds, setMyTeamIds] = useState<string[]>([]);
  const [memberStatus, setMemberStatus] = useState<Map<string, Map<string, TeamMemberProfile['status']>>>(
    new Map<string, Map<string, TeamMemberProfile['status']>>()
  );

  // Fetch user ID once on initial load
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const profile = await getProfile();
        setUserId(profile?.id || null);
      } catch (err) {
        console.error("Error fetching profile:", err);
        setUserId(null);
      }
    };
    fetchUser();
  }, []);

  // Fetch initial team data only once when userId is available
  useEffect(() => {
    if (!userId || dataFetchedRef.current) return;
    
    const fetchInitialData = async () => {
      setIsLoading(true);
      
      try {
        // Fetch both team requests and teams in parallel
        const [teamRequestsData, myTeamsData] = await Promise.all([
          getPendingTeamInvitations(),
          getMyTeams()
        ]);
        
        // Set team requests
        if (teamRequestsData.error) {
          setError(teamRequestsData.error.message);
          setTeamRequests([]);
        } else {
          setTeamRequests(teamRequestsData.data || []);
        }

        // Set my teams
        if (myTeamsData) {
          setMyTeams(myTeamsData);
          
          // Extract team IDs for subscriptions
          const teamIds = myTeamsData.map((team) => team.id);
          setMyTeamIds(teamIds);
          
          // Fetch member statuses
          if (teamIds.length > 0) {
            const { data: memberStatusData, error: memberStatusError } = await supabase
              .from('team_member')
              .select('team_id, student_id, status')
              .in('team_id', teamIds);
              
            if (!memberStatusError && memberStatusData) {
              const memberStatusMap = new Map<string, Map<string, TeamMemberProfile['status']>>();
              memberStatusData.forEach((item) => {
                const teamMemberStatus = memberStatusMap.get(item.team_id) || 
                  new Map<string, TeamMemberProfile['status']>();
                teamMemberStatus.set(item.student_id, item.status);
                memberStatusMap.set(item.team_id, teamMemberStatus);
              });
              setMemberStatus(memberStatusMap);
            }
          }
        }
        
        // Mark data as fetched
        dataFetchedRef.current = true;
      } catch (err: any) {
        console.error('Error fetching team data:', err);
        setError('An unexpected error occurred while fetching team data');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchInitialData();
  }, [userId]);

  // Refetch team requests with debounce protection
  const refetchRequestsTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const refetchRequests = async () => {
    if (!userId) {
      setTeamRequests([]);
      return;
    }
    
    // Clear any pending timeout
    if (refetchRequestsTimeoutRef.current) {
      clearTimeout(refetchRequestsTimeoutRef.current);
    }
    
    // Set a new timeout to prevent multiple rapid calls
    refetchRequestsTimeoutRef.current = setTimeout(async () => {
      setError(null);
      try {
        const result = await getPendingTeamInvitations();
        if (result.error) {
          setError(result.error.message);
          setTeamRequests([]);
        } else {
          setTeamRequests(result.data || []);
        }
      } catch (err: any) {
        console.error('Error fetching team invitations:', err);
        setError('An unexpected error occurred while fetching team invitations.');
        setTeamRequests([]);
      }
      refetchRequestsTimeoutRef.current = null;
    }, 300);
  };

  // Refetch my teams with debounce protection
  const refetchTeamsTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const refetchTeams = async () => {
    if (!userId) {
      setMyTeams(null);
      return;
    }
    
    // Clear any pending timeout
    if (refetchTeamsTimeoutRef.current) {
      clearTimeout(refetchTeamsTimeoutRef.current);
    }
    
    // Set a new timeout to prevent multiple rapid calls
    refetchTeamsTimeoutRef.current = setTimeout(async () => {
      setError(null);
      try {
        const myTeamsData = await getMyTeams();
        
        if (myTeamsData) {
          setMyTeams(myTeamsData);
          
          // Update team IDs for subscriptions
          const teamIds = myTeamsData.map(team => team.id);
          setMyTeamIds(prev => {
            // Only update if the team IDs have changed
            if (teamIds.length !== prev.length || 
                !teamIds.every(id => prev.includes(id))) {
              return teamIds;
            }
            return prev;
          });
        }
      } catch (err: any) {
        console.error('Error fetching teams:', err);
        setError('An unexpected error occurred while fetching teams.');
      }
      refetchTeamsTimeoutRef.current = null;
    }, 300);
  };

  // Subscribe to team member changes for the current user (only once)
  useEffect(() => {
    if (!userId) return;
    
    // Maintain a reference to update events in progress to prevent duplicate processing
    const processingEvents = new Set();
    
    const channel = supabase
      .channel("my-team-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "team_member",
          filter: `student_id=eq.${userId}`,
        },
        (payload) => {
          const eventId = `${payload.eventType}-${(payload.new as any)?.team_id || (payload.old as any)?.team_id}-${Date.now()}`;
          if (processingEvents.has(eventId)) return;
          
          processingEvents.add(eventId);
          
          // Handle different event types
          if (payload.eventType === "INSERT") {
            setMyTeamIds((prev) => [...prev, payload.new.team_id]);
            refetchTeams();
          }
          if (payload.eventType === "DELETE") {
            setMyTeamIds((prev) => prev.filter((id) => id !== payload.old.team_id));
            refetchTeams();
          }
          if (payload.eventType === "UPDATE") {
            // Only refetch teams if the status changed
            if ((payload.old as any).status !== (payload.new as any).status) {
              refetchTeams();
            }
          }

          // Only refetch requests for relevant events
          if (payload.eventType === "INSERT" || 
              (payload.eventType === "UPDATE" && (payload.old as any).status !== (payload.new as any).status)) {
            refetchRequests();
          }
          
          // Remove from processing set after a delay
          setTimeout(() => {
            processingEvents.delete(eventId);
          }, 500);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  // Subscribe to team member changes for all teams the user is part of
  // Only recreate the subscription when team IDs actually change
  useEffect(() => {
    if (!userId || myTeamIds.length === 0) return;

    // Don't recreate subscription unless we need to
    const teamIdsStr = myTeamIds.sort().join(',');
    
    const channel = supabase
      .channel(`team_member_changes-${teamIdsStr}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'team_member',
          filter: `team_id=in.(${teamIdsStr})`,
        },
        (payload) => {
          if (payload.eventType === "UPDATE" || payload.eventType === "INSERT") {
            setMemberStatus(prev => {
              const next = new Map(prev);
              const teamMap = new Map(next.get(payload.new.team_id) ?? []);
              teamMap.set((payload.new as any).student_id, (payload.new as any).status);
              next.set(payload.new.team_id, teamMap);
              return next;
            });
          }
          if (payload.eventType === "DELETE") {
            setMemberStatus(prev => {
              const next = new Map(prev);
              const teamMap = new Map(next.get((payload.old as any).team_id) ?? []);
              teamMap.delete((payload.old as any).student_id);
              if (teamMap.size === 0) {
                next.delete(payload.old.team_id);
              } else {
                next.set(payload.old.team_id, teamMap);
              }
              return next;
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, myTeamIds]);

  // Cleanup all timeouts on unmount
  useEffect(() => {
    return () => {
      if (refetchRequestsTimeoutRef.current) {
        clearTimeout(refetchRequestsTimeoutRef.current);
      }
      if (refetchTeamsTimeoutRef.current) {
        clearTimeout(refetchTeamsTimeoutRef.current);
      }
    };
  }, []);
  
  return (
    <TeamContext.Provider 
      value={{ 
        teamRequests, 
        isLoading, 
        error, 
        hasPendingRequests: teamRequests.length > 0,
        memberStatus,
        myTeams,
        refetchTeams,
        refetchRequests
      }}
    >
      {children}
    </TeamContext.Provider>
  );
}

export function useTeam() {
  const context = useContext(TeamContext);
  if (!context) {
    throw new Error("useTeam must be used within a TeamProvider");
  }

  return context;
}