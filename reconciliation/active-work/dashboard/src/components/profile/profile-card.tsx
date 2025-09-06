import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CalendarIcon, MapPinIcon, LinkIcon, MailIcon, UserPlusIcon } from 'lucide-react';
import { format } from 'date-fns';
import Link from 'next/link';

interface ProfileUser {
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
  badges?: Array<{
    id: string;
    name: string;
    icon: string;
    earned_at: string;
  }>;
}

interface ProfileCardProps {
  user: ProfileUser;
  showActions?: boolean;
  isOwnProfile?: boolean;
  className?: string;
}

export function ProfileCard({ user, showActions = true, isOwnProfile = false, className = '' }: ProfileCardProps) {
  const getUserInitials = (username: string) => {
    return username
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Card className={`${className}`}>
      <CardHeader>
        <div className="flex items-start gap-4">
          <Avatar className="h-20 w-20">
            <AvatarImage src={user.avatar_url} alt={user.username} />
            <AvatarFallback className="text-lg bg-primary/10 text-primary">
              {getUserInitials(user.username)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <CardTitle className="text-2xl">{user.username}</CardTitle>
            {user.bio && (
              <CardDescription className="mt-2">
                {user.bio}
              </CardDescription>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
          {user.location && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPinIcon className="h-4 w-4" />
              <span>{user.location}</span>
            </div>
          )}
          
          {user.website && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <LinkIcon className="h-4 w-4" />
              <a 
                href={user.website} 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:underline"
              >
                {user.website}
              </a>
            </div>
          )}
          
          {user.email && isOwnProfile && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <MailIcon className="h-4 w-4" />
              <span>{user.email}</span>
            </div>
          )}
          
          <div className="flex items-center gap-2 text-muted-foreground">
            <CalendarIcon className="h-4 w-4" />
            <span>Joined {format(new Date(user.created_at), 'MMMM yyyy')}</span>
          </div>
        </div>

        <div className="flex gap-6 pt-2 border-t">
          <div className="text-center">
            <div className="text-2xl font-bold">{user.teams_count || 0}</div>
            <div className="text-xs text-muted-foreground">Teams</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{user.activities_count || 0}</div>
            <div className="text-xs text-muted-foreground">Activities</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{user.friends_count || 0}</div>
            <div className="text-xs text-muted-foreground">Friends</div>
          </div>
        </div>

        {user.badges && user.badges.length > 0 && (
          <div className="pt-3 border-t">
            <div className="text-sm font-medium mb-2">Badges</div>
            <div className="flex flex-wrap gap-2">
              {user.badges.map((badge) => (
                <Badge key={badge.id} variant="secondary" className="gap-1">
                  <span>{badge.icon}</span>
                  <span>{badge.name}</span>
                </Badge>
              ))}
            </div>
          </div>
        )}

        {showActions && (
          <div className="flex gap-3 pt-3">
            {isOwnProfile ? (
              <Link href="/profile/edit" className="w-full">
                <Button className="w-full">Edit Profile</Button>
              </Link>
            ) : (
              <>
                {user.is_friend ? (
                  <Button variant="outline" className="w-full" disabled>
                    Friends
                  </Button>
                ) : user.is_pending_friend ? (
                  <Button variant="outline" className="w-full" disabled>
                    Request Pending
                  </Button>
                ) : (
                  <form action={`/api/friends/add`} method="POST" className="w-full">
                    <input type="hidden" name="userId" value={user.id} />
                    <Button type="submit" className="w-full">
                      <UserPlusIcon className="mr-2 h-4 w-4" />
                      Add Friend
                    </Button>
                  </form>
                )}
                <Link href={`/profiles/${user.username}`} className="w-full">
                  <Button variant="outline" className="w-full">View Profile</Button>
                </Link>
              </>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

interface ProfileMiniCardProps {
  user: Pick<ProfileUser, 'id' | 'username' | 'avatar_url' | 'bio'>;
  onClick?: () => void;
}

export function ProfileMiniCard({ user, onClick }: ProfileMiniCardProps) {
  const getUserInitials = (username: string) => {
    return username
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div 
      className="flex items-center gap-3 p-3 rounded-lg hover:bg-secondary/50 transition-colors cursor-pointer"
      onClick={onClick}
    >
      <Avatar className="h-10 w-10">
        <AvatarImage src={user.avatar_url} alt={user.username} />
        <AvatarFallback className="text-sm">
          {getUserInitials(user.username)}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <div className="font-medium truncate">{user.username}</div>
        {user.bio && (
          <div className="text-sm text-muted-foreground truncate">
            {user.bio}
          </div>
        )}
      </div>
    </div>
  );
}