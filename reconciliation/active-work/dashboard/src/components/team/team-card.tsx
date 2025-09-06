import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CalendarIcon, UsersIcon } from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface TeamMember {
  id: string;
  user_id: string;
  role: 'ADMIN' | 'MEMBER';
  status: 'ACCEPTED' | 'PENDING' | 'REJECTED';
  joined_at?: string;
  user?: {
    username?: string;
    avatar_url?: string;
  };
}

interface Team {
  id: string;
  name: string;
  description?: string;
  avatar_url?: string;
  created_at: string;
  members?: TeamMember[];
  member_count?: number;
  user_role?: 'ADMIN' | 'MEMBER';
  user_status?: 'ACCEPTED' | 'PENDING' | 'REJECTED';
}

interface TeamCardProps {
  team: Team;
  showActions?: boolean;
  className?: string;
}

export function TeamCard({ team, showActions = true, className = '' }: TeamCardProps) {
  const getStatusBadgeColor = (status?: string) => {
    switch (status) {
      case 'ACCEPTED':
        return 'bg-green-100 text-green-800';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'REJECTED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTeamInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const memberCount = team.member_count || team.members?.length || 0;
  const acceptedMembers = team.members?.filter(m => m.status === 'ACCEPTED').length || 0;

  return (
    <Card className={`hover:shadow-lg transition-all duration-300 ${className}`}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <Avatar className="h-12 w-12">
              <AvatarImage src={team.avatar_url} alt={team.name} />
              <AvatarFallback className="bg-primary/10 text-primary">
                {getTeamInitials(team.name)}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-xl">{team.name}</CardTitle>
              {team.description && (
                <CardDescription className="mt-1 line-clamp-2">
                  {team.description}
                </CardDescription>
              )}
            </div>
          </div>
          {team.user_status && (
            <Badge className={getStatusBadgeColor(team.user_status)} variant="secondary">
              {team.user_status}
            </Badge>
          )}
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <UsersIcon className="h-4 w-4" />
              <span>
                {acceptedMembers} {acceptedMembers === 1 ? 'member' : 'members'}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <CalendarIcon className="h-4 w-4" />
              <span>Created {format(new Date(team.created_at), 'MMM d, yyyy')}</span>
            </div>
          </div>
          
          {team.user_role && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Your role:</span>
              <Badge variant={team.user_role === 'ADMIN' ? 'default' : 'outline'}>
                {team.user_role}
              </Badge>
            </div>
          )}

          {team.members && team.members.length > 0 && (
            <div className="flex items-center gap-1">
              <div className="flex -space-x-2">
                {team.members.slice(0, 5).map((member) => (
                  <Avatar key={member.id} className="h-8 w-8 border-2 border-background">
                    <AvatarImage src={member.user?.avatar_url} />
                    <AvatarFallback className="text-xs bg-secondary">
                      {member.user?.username?.slice(0, 2).toUpperCase() || '??'}
                    </AvatarFallback>
                  </Avatar>
                ))}
              </div>
              {team.members.length > 5 && (
                <span className="text-sm text-muted-foreground ml-2">
                  +{team.members.length - 5} more
                </span>
              )}
            </div>
          )}
        </div>
      </CardContent>

      {showActions && (
        <CardFooter className="pt-0">
          <Link href={`/groups/teams/${team.id}`} className="w-full">
            <Button className="w-full" variant={team.user_status === 'PENDING' ? 'outline' : 'default'}>
              {team.user_status === 'PENDING' ? 'View Invitation' : 'View Team'}
            </Button>
          </Link>
        </CardFooter>
      )}
    </Card>
  );
}