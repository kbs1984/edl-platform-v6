import { TeamCard } from './team-card';
import { UsersIcon } from 'lucide-react';
import { getTeams, getTeamMembers } from '@/lib/actions/team-actions';

interface TeamListProps {
  userId: string;
  showPending?: boolean;
}

// Session 180: Add default export
export default async function TeamList({ userId, showPending = false }: TeamListProps) {
  const teams = await getTeams(userId, showPending);

  if (!teams || teams.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-center mt-20">
        <UsersIcon className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium">No teams found</h3>
        <p className="text-muted-foreground mt-2 max-w-md">
          {showPending 
            ? "You don't have any pending team invitations."
            : "You haven't joined any teams yet. Create a new team or accept team invitations to get started."}
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {teams.map((team) => (
        <TeamCard key={team.id} team={team} />
      ))}
    </div>
  );
}

export async function TeamListWithMembers({ userId }: TeamListProps) {
  const teams = await getTeams(userId);
  
  if (!teams || teams.length === 0) {
    return <TeamList userId={userId} />;
  }

  const teamsWithMembers = await Promise.all(
    teams.map(async (team) => {
      const members = await getTeamMembers(team.id);
      return { ...team, members };
    })
  );

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {teamsWithMembers.map((team) => (
        <TeamCard key={team.id} team={team} />
      ))}
    </div>
  );
}