import { ProfileCard, ProfileMiniCard } from './profile-card';
import { UsersIcon } from 'lucide-react';

interface Profile {
  id: string;
  username: string;
  email?: string;
  avatar_url?: string;
  bio?: string;
  location?: string;
  website?: string;
  created_at: string;
  teams_count?: number;
  activities_count?: number;
  friends_count?: number;
  is_friend?: boolean;
  is_pending_friend?: boolean;
}

interface ProfileListProps {
  profiles: Profile[];
  currentUserId?: string;
  variant?: 'card' | 'mini';
  emptyMessage?: string;
  emptyDescription?: string;
}

export function ProfileList({ 
  profiles, 
  currentUserId, 
  variant = 'card',
  emptyMessage = 'No profiles found',
  emptyDescription = 'No users match your search criteria.'
}: ProfileListProps) {
  if (!profiles || profiles.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-center">
        <UsersIcon className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium">{emptyMessage}</h3>
        <p className="text-muted-foreground mt-2 max-w-md">
          {emptyDescription}
        </p>
      </div>
    );
  }

  if (variant === 'mini') {
    return (
      <div className="space-y-2">
        {profiles.map((profile) => (
          <ProfileMiniCard key={profile.id} user={profile} />
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {profiles.map((profile) => (
        <ProfileCard 
          key={profile.id} 
          user={profile}
          isOwnProfile={profile.id === currentUserId}
        />
      ))}
    </div>
  );
}

interface FriendsListProps {
  userId: string;
  limit?: number;
}

export async function FriendsList({ userId, limit }: FriendsListProps) {
  const { getFriends } = await import('@/lib/actions/profile-actions');
  const friends = await getFriends(userId, limit);

  return (
    <ProfileList 
      profiles={friends}
      variant="mini"
      emptyMessage="No friends yet"
      emptyDescription="Start connecting with other users to build your network."
    />
  );
}

interface TeamMembersListProps {
  teamId: string;
}

export async function TeamMembersList({ teamId }: TeamMembersListProps) {
  const { getTeamMemberProfiles } = await import('@/lib/actions/team-actions');
  const members = await getTeamMemberProfiles(teamId);

  return (
    <ProfileList 
      profiles={members}
      variant="mini"
      emptyMessage="No team members"
      emptyDescription="This team doesn't have any members yet."
    />
  );
}