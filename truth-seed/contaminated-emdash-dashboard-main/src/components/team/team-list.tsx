"use client";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CalendarIcon, Loader2, UsersIcon } from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useTeam } from '@/contexts/team-context';

const TeamList = () => {
  const { myTeams, isLoading } = useTeam();

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-center mt-20">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }
  if (!myTeams || myTeams.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-center mt-20">
        <UsersIcon className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium">No teams found</h3>
        <p className="text-muted-foreground mt-2 max-w-md">
          You haven't joined any teams yet. Create a new team or accept team invitations to get started.
        </p>
      </div>
    );
  }

  // Function to get status badge color
  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'ACCEPTED':
        return 'bg-green-100 text-green-800 hover:bg-green-100';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100';
      case 'REJECTED':
        return 'bg-red-100 text-red-800 hover:bg-red-100';
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-100';
    }
  };

  // Function to get team initials for avatar fallback
  const getTeamInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {myTeams.map((team) => (
        <Card key={team.id} className="overflow-hidden hover:shadow-md transition-shadow duration-300">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12">
                  {team.image_path ? (
                    <AvatarImage 
                      src={team.image_path} 
                      alt={team.name} 
                    />
                  ) : null}
                  <AvatarFallback>{getTeamInitials(team.name)}</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-xl">{team.name}</CardTitle>
                  <Badge className={`mt-1 font-normal ${getStatusBadgeColor(team.status)}`}>
                    {team.status === 'ACCEPTED' ? 'Member' : 
                     team.status === 'PENDING' ? 'Invited' : team.status}
                  </Badge>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <CardDescription className="line-clamp-2 h-10">
              {team.description || 'No description'}
            </CardDescription>
            <div className="flex items-center text-xs text-muted-foreground mt-3">
              <CalendarIcon className="mr-1 h-3 w-3" />
              Created {format(new Date(team.created_at), 'MMM d, yyyy')}
            </div>
          </CardContent>
          <CardFooter className="pt-2">
            <Link href={`/groups/teams/${team.id}`} className="w-full">
              <Button variant="outline" className="w-full">
                {team.status === 'ACCEPTED' ? 'View Team' : 
                 team.status === 'PENDING' ? 'Respond to Invitation' : 'View Details'}
              </Button>
            </Link>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default TeamList;