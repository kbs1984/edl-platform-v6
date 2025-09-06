"use client";

import { toast } from "@/hooks/use-toast";
import { updateTeamMemberStatus } from "@/lib/actions/team-actions";
import { useState } from "react";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Loader2, UserRoundPen } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import Link from "next/link";
import { useTeam } from "@/hooks/use-team";

export const TeamRequestDialog = () => {
  const [isUpdatingStatus, setIsUpdatingStatus] = useState<string | null>(null); 
  const { 
    teamRequests, 
    hasPendingRequests, 
    isLoading: isLoadingRequests,
  } = useTeam();
  const [isTeamRequestDialogOpen, setIsTeamRequestDialogOpen] = useState(false);

  const handleAction = async (teamMemberId: string, status: 'ACCEPTED' | 'REJECTED') => {
    setIsUpdatingStatus(teamMemberId);
    try {
      const result = await updateTeamMemberStatus(teamMemberId, status);
      if (result.error) {
        toast({
          variant: "destructive",
          title: `Failed to ${status === 'ACCEPTED' ? 'Accept' : 'Decline'} Invitation`,
          description: result.error.message,
        });
      } else {
        toast({
          title: "Success",
          description: `Invitation ${status === 'ACCEPTED' ? 'accepted' : 'declined'} successfully!`,
        });
      }
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: `An unexpected error occurred while ${status === 'ACCEPTED' ? 'accepting' : 'declining'} the invitation.`,
      });
    }
    setIsUpdatingStatus(null); // Clear updating status
  };

  return (
    <Dialog open={isTeamRequestDialogOpen} onOpenChange={setIsTeamRequestDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="relative h-11">
          <UserRoundPen className="size-4 mr-2" />
          Team Requests
          {hasPendingRequests && (
            <span className="absolute top-0 right-0 block h-2.5 w-2.5 transform translate-x-1/2 -translate-y-1/2 rounded-full bg-yellow-400 ring-1 ring-white" />
          )}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Pending Team Invitations</DialogTitle>
          <DialogDescription>
            Accept or decline pending invitations to join teams.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          {isLoadingRequests ? (
            <div className="flex justify-center items-center h-20">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : teamRequests.length === 0 ? (
            <p className="text-center text-muted-foreground">No pending invitations.</p>
          ) : (
            <ul className="space-y-3 max-h-96 overflow-y-auto pr-2">
              {teamRequests.map((invitation) => (
                <li key={invitation.id} className="flex items-center justify-between p-3 bg-secondary/50 rounded-md">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={invitation.team?.image_path || undefined} alt={invitation.team?.name} />
                      <AvatarFallback>{invitation.team?.name?.substring(0, 2).toUpperCase() || 'T'}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col gap-1">
                      <p className="font-semibold ml-1">{invitation.team?.name}</p>
                      <Link href={`/groups/teams/${invitation.team?.id}`}>
                        <Button size="sm" className="h-6 text-xs" variant={'secondary'}>View Details</Button>
                      </Link>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleAction(invitation.id, 'REJECTED')}
                      disabled={isUpdatingStatus === invitation.id}
                      className="h-10"
                    >
                      {isUpdatingStatus === invitation.id && invitation.status !== 'ACCEPTED' ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Decline'}
                    </Button>
                    <Button 
                      size="sm" 
                      onClick={() => handleAction(invitation.id, 'ACCEPTED')}
                      disabled={isUpdatingStatus === invitation.id}
                    >
                      {isUpdatingStatus === invitation.id && invitation.status === 'ACCEPTED' ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Accept'}
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}