"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Search, Loader2, Plus } from "lucide-react"; // 추가
import type { Friend } from "@/types"; 
import { useFriends } from "@/hooks/use-friends";
import { Card } from "@/components/ui/card";

interface InviteMemberDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onInviteMember: (invited: Friend) => void;
  alreadyInvitedMemberIds: string[]; // ID 배열로 변경
  maxInvites?: number;
  creatorId?: string;
}

export function InviteMemberDialog({
  isOpen,
  onOpenChange,
  onInviteMember,
  alreadyInvitedMemberIds,
  maxInvites = 2,
  creatorId,
}: InviteMemberDialogProps) {
  const { friends } = useFriends();

  const [memberSearchQuery, setMemberSearchQuery] = useState("");
  const [memberSearchResults, setMemberSearchResults] = useState<Friend[]>([]);
  const [isSearchingMembers, setIsSearchingMembers] = useState(false);
  const [memberSearchDebounceTimeout, setMemberSearchDebounceTimeout] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setMemberSearchResults(friends);
  }, [friends]);
  
  const handleMemberSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setMemberSearchQuery(query);
    setIsSearchingMembers(true);

    if (memberSearchDebounceTimeout) {
      clearTimeout(memberSearchDebounceTimeout);
    }

    const timeout = setTimeout(() => {
      if (query.trim() === "") {
        setMemberSearchResults(friends.filter(f => !alreadyInvitedMemberIds.includes(f.id) && f.id !== creatorId));
      } else {
        const filtered = friends.filter(
          (friend) =>
            friend.username.toLowerCase().includes(query.toLowerCase()) &&
            !alreadyInvitedMemberIds.includes(friend.id) &&
            friend.id !== creatorId
        );
        setMemberSearchResults(filtered);
      }
      setIsSearchingMembers(false);
    }, 300);
    setMemberSearchDebounceTimeout(timeout);
  }, [friends, memberSearchDebounceTimeout, alreadyInvitedMemberIds, creatorId]);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button type="button" disabled={alreadyInvitedMemberIds.length >= maxInvites}>
          <Plus className="mr-2" />
          Add Member
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Member</DialogTitle>
          <DialogDescription>
            Search for friends by username to invite them to your team.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <div className="relative">
            <Input
              type="text"
              name="memberSearchDialog"
              placeholder="Search friends by username..."
              value={memberSearchQuery}
              onChange={handleMemberSearchChange}
            />
            {isSearchingMembers 
              ? <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin" />
              : <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />}
          </div>

          {/* Search Results */} 
          {memberSearchResults.length > 0 && (
            <Card className="mt-4 px-3 pt-2 max-h-60 overflow-y-auto">
              <ul className="space-y-2">
                {memberSearchResults.map(user => (
                  <li key={user.id} className="flex items-center justify-between pb-2 border-b last:border-none">
                    <div className="flex items-center gap-2">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={user.image_path || undefined} alt={user.username} />
                        <AvatarFallback>{user.username.charAt(0).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <span className="text-sm">{user.username}</span>
                    </div>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => onInviteMember(user)} 
                      disabled={(alreadyInvitedMemberIds.length) >= maxInvites || alreadyInvitedMemberIds.find(id => id === user.friend_id) != null}
                    > 
                      <Plus className="h-4 w-4 mr-1"/> Invite
                    </Button>
                  </li>
                ))}
              </ul>
            </Card>
          )}
          {memberSearchQuery.trim().length >=2 && !isSearchingMembers && memberSearchResults.length === 0 && (
            <p className="mt-4 text-sm text-center text-muted-foreground">No friends found matching "{memberSearchQuery}".</p>
          )}
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
