"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Crown, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getLevelFromExp } from "@/lib/utils";
import { changeTeamLeader, removeTeamMember } from "@/lib/actions/team-actions";
import { TeamDetailsPageData, TeamMemberProfile } from "@/types";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { useTeam } from "@/hooks/use-team";
import { toast } from "@/hooks/use-toast";

interface TeamMembersListProps {
  members: TeamMemberProfile[];
  currentUserId: string;
  teamId: string;
  currentUserStatus: TeamDetailsPageData['currentUserStatus'];
}

export function TeamMembersList({ 
  members, 
  currentUserId,
  teamId,
  currentUserStatus,
}: TeamMembersListProps) {
  const currentUserIsLeader = members.find(m => m.id === currentUserId)?.isLeader || false;
  const { memberStatus } = useTeam();
  const memberStatusForTeam = memberStatus.get(teamId);
  members.sort((a) => a.isLeader ? -1 : 1);

  const router = useRouter();

  const handleRemoveMember = (memberId: string) => async () => {
    await removeTeamMember(memberId, currentUserStatus, members, teamId);
    if (members.length === 0) {
      router.push('/groups/teams');
    }
    router.refresh();
  };

  const handleMakeLeader = (memberId: string) => async () => {
    const res = await changeTeamLeader(memberId, teamId);
    if (res.success) {
      toast({ title: "Success", description: "Team leader changed successfully" });
    } else {
      toast({
        title: "Error",
        description: `Failed to change team leader: ${res.error?.message}`,
        variant: "destructive",
      });
    }
    router.refresh();
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Team Members ({members.length})</CardTitle>
        <CardDescription>The current members of this team.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 h-full">
        {members.map((member) => (
          <div key={member.id} className="flex items-center justify-between p-3 bg-secondary/30 rounded-md">
            <div className="flex items-center gap-4">
              <Avatar className="h-12 w-12">
                <AvatarImage src={member.avatarUrl || undefined} alt={member.username} />
                <AvatarFallback>{member.username.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold text-lg flex items-center">
                  {member.username}
                  {member.isLeader && <span className="text-xs text-yellow-400 ml-2 flex items-center gap-1">Leader <Crown className="inline w-3 h-3" /></span>}
                  {memberStatusForTeam?.get(member.id) === 'PENDING' && <Badge className="text-xs bg-gray-700 text-secondary-foreground ml-2 ">Pending</Badge>}
                </p>
                <p className="text-sm text-muted-foreground">Level {getLevelFromExp(member.exp).level}</p>
              </div>
            </div>
            {(currentUserIsLeader || member.id === currentUserId) && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {/* Option for current user to leave team */}
                  {member.id === currentUserId && (
                    <DropdownMenuItem onClick={handleRemoveMember(member.id)} className="text-red-600 focus:text-red-600 focus:bg-red-50">
                      Leave Team
                    </DropdownMenuItem>
                  )}
                  {/* Options for team leader to manage other members */}
                  {currentUserIsLeader && member.id !== currentUserId && (
                    <>
                      {!member.isLeader && (
                        <DropdownMenuItem onClick={handleMakeLeader(member.id)}>
                          Make Leader
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem onClick={handleRemoveMember(member.id)} className="text-red-600 focus:text-red-600 focus:bg-red-50">
                        Remove Member
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        ))}
        {members.length === 0 && (
          <p className="text-center text-muted-foreground py-4">This team has no members yet.</p>
        )}
      </CardContent>
    </Card>
  );
}
