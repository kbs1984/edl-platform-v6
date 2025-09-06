import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { inviteToTeam } from '@/lib/actions/team-actions';
import { UserPlusIcon } from 'lucide-react';

interface TeamInviteFormProps {
  teamId: string;
  teamName: string;
}

export function TeamInviteForm({ teamId, teamName }: TeamInviteFormProps) {
  async function handleInvite(formData: FormData) {
    'use server';
    
    const username = formData.get('username') as string;
    const role = formData.get('role') as 'ADMIN' | 'MEMBER';
    
    if (!username) return;
    
    await inviteToTeam(teamId, username, role);
  }

  return (
    <form action={handleInvite} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="username">Username or Email</Label>
        <Input
          id="username"
          name="username"
          type="text"
          placeholder="Enter username or email"
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="role">Role</Label>
        <Select name="role" defaultValue="MEMBER">
          <SelectTrigger id="role">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="MEMBER">Member</SelectItem>
            <SelectItem value="ADMIN">Admin</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button type="submit" className="w-full">
        <UserPlusIcon className="mr-2 h-4 w-4" />
        Send Invitation
      </Button>
    </form>
  );
}

interface TeamInviteCardProps {
  invitation: {
    id: string;
    team: {
      id: string;
      name: string;
      description?: string;
      avatar_url?: string;
    };
    inviter: {
      username: string;
      avatar_url?: string;
    };
    role: 'ADMIN' | 'MEMBER';
    created_at: string;
  };
}

export function TeamInviteCard({ invitation }: TeamInviteCardProps) {
  async function handleAccept() {
    'use server';
    const { acceptInvite } = await import('@/lib/actions/team-actions');
    await acceptInvite(invitation.id);
  }

  async function handleReject() {
    'use server';
    const { rejectInvite } = await import('@/lib/actions/team-actions');
    await rejectInvite(invitation.id);
  }

  return (
    <div className="border rounded-lg p-6 space-y-4">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold">{invitation.team.name}</h3>
          {invitation.team.description && (
            <p className="text-sm text-muted-foreground mt-1">
              {invitation.team.description}
            </p>
          )}
        </div>
        <span className="text-sm text-muted-foreground">
          Invited by {invitation.inviter.username}
        </span>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-sm">You're invited as:</span>
        <span className="text-sm font-medium px-2 py-1 bg-secondary rounded">
          {invitation.role}
        </span>
      </div>

      <div className="flex gap-3">
        <form action={handleAccept} className="flex-1">
          <Button type="submit" className="w-full">
            Accept Invitation
          </Button>
        </form>
        <form action={handleReject} className="flex-1">
          <Button type="submit" variant="outline" className="w-full">
            Decline
          </Button>
        </form>
      </div>
    </div>
  );
}