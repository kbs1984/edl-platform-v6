"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { inviteTeamMember, removeTeamMember, updateTeamMemberStatus } from "@/lib/actions/team-actions";
import { Friend, Team, TeamDetailsPageData, TeamMemberProfile } from "@/types";
import { useRouter } from "next/navigation";
import { InviteMemberDialog } from "./invite-member-dialog";
import { useState } from "react";
import { EditTeamDialog } from "./edit-team-dialog";
import { toast } from "@/hooks/use-toast";

export function TeamHeader({ 
  team,
  currentUserTeamMemberId,
  currentUserStatus,
  members,
  currentUserId,
}: { 
  team: Team, 
  currentUserTeamMemberId: string, 
  currentUserStatus: TeamDetailsPageData['currentUserStatus']
  members: TeamMemberProfile[]
  currentUserId: string
}) {
  const router = useRouter();
  
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
  
  const handleInvite = (status: 'ACCEPTED' | 'REJECTED') => async () => {
    try {
      const result = await updateTeamMemberStatus(currentUserTeamMemberId, status);
      if (result.success) {
        toast({ title: "Success", description: "Invitation accepted!" });
        router.refresh();
      } else {
        toast({ title: "Error", description: result.error?.message || "Failed to accept invitation.", variant: "destructive" });
      }
    } catch (error) {
      toast({ title: "Error", description: "An unexpected error occurred.", variant: "destructive" });
    }
  };

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const handleEditInfo = () => {
    setIsEditDialogOpen(true);
  };

  const handleInviteMembers = async (friend: Friend) => {
    inviteTeamMember(team.id, [friend.friend_id], false);
    router.refresh();
  };

  const handleLeaveTeam = () => {
    removeTeamMember(currentUserTeamMemberId, currentUserStatus, members, team.id);
    router.refresh();
  };
  
  return (
    <Card className="mb-6">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={team.image_path || undefined} alt={team.name} />
              <AvatarFallback>{team.name?.substring(0, 2).toUpperCase() || 'T'}</AvatarFallback>
            </Avatar>
            <div>
              <div>
                <CardTitle className="text-3xl font-bold inline mr-3">{team.name}</CardTitle>
                <p className="inline">{team.division} DIVISION</p>
              </div>
              {team.description && <CardDescription className="mt-1 text-md">{team.description}</CardDescription>}
              <p className="text-sm text-muted-foreground mt-2">
                Led by {team.leader_profile?.username} &bull; Created on {team.created_at}
              </p>
            </div>
          </div>
          <div className="flex flex-col space-y-2 items-end">
            {currentUserStatus === 'leader' && (
              <>
                <Button onClick={handleEditInfo} variant="outline" size="default" className="w-full">Edit Team Info</Button>
                <InviteMemberDialog 
                  isOpen={isInviteDialogOpen}
                  onOpenChange={setIsInviteDialogOpen}
                  onInviteMember={handleInviteMembers}
                  alreadyInvitedMemberIds={members.map(m => m.id).filter(id => id !== currentUserId)}
                  creatorId={team.leader_profile?.id}
                />
              </>
            )}
            {currentUserStatus === 'member' && (
              <Button onClick={handleLeaveTeam} variant="destructive" size="sm">Leave Team</Button>
            )}
            {currentUserStatus === 'invited' && (
              <div className="flex gap-2">
                <Button onClick={handleInvite('REJECTED')} variant="outline" size="sm">Decline</Button>
                <Button onClick={handleInvite('ACCEPTED')} size="sm">Accept Invite</Button>
              </div>
            )}
          </div>
        </div>
      </CardHeader>
      <EditTeamDialog
        team={team}
        isOpen={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
      />
    </Card>
  );
}
