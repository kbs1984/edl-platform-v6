import { Database } from "./database.types"

export type Profile = Database['public']['Tables']['profile']['Row']
export type Student = Database['public']['Tables']['student']['Row']
export type School = Database['public']['Tables']['school']['Row']
export type Friendship = Database['public']['Tables']['friendship']['Row']
export type Friend = {
  id: string;
  friend_id: string;
  image_path: string;
  username: string;
  exp: number;
}
export type friendRequests = {
  id: string;
  friend_id: string;
  image_path: string;
  username: string;
  exp: number;
  status: string;
}
export interface TeamInvitation {
  id: string;
  status: string;
  team: {
    id: string;
    name: string;
    image_path: string | null;
  };
}

export type Team = Database['public']['Tables']['team']['Row'] & {
  leader_profile?: Pick<Profile, 'id' | 'username' | 'image_path'> | null;
};

export type TeamMember = Database['public']['Tables']['team_member']['Row'];

export interface TeamMemberProfile {
  id: string; // profile_id of the member
  username: string;
  avatarUrl?: string | null;
  exp: number;
  isLeader: boolean;
  status: Database['public']['Enums']['status']
}

export type TeamMemberExtended = TeamMember & {
  profile: Pick<Profile, 'id' | 'username' | 'image_path'>; 
};

export type TeamWithStatus = Team & {
  status: Database['public']['Enums']['status']
}

export interface TeamDetailsPageData {
  team: Team | null;
  members: TeamMemberExtended[];
  currentUserStatus: 'leader' | 'member' | 'invited' | 'non-member' | 'not-authenticated';
  currentUserId: string | null;
  currentUserTeamMemberId?: string | null; // ID of the team_member record for the current user
  error?: string; // Optional error message
}

// Consolidated error return type for getTeamDetailsPageData
export type TeamDetailsErrorData = {
  error: string;
  team: null;
  members: TeamMemberExtended[]; 
  currentUserStatus: 'not-authenticated';
  currentUserId: string | null;
  currentUserTeamMemberId: null;
};