"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { Check, UserRoundPen, XIcon } from "lucide-react";
import { Friendship, Profile } from "@/types";
import { getProfilesAction, updateFriendRequestAction } from "@/lib/actions/student-actions";
import Image from "next/image";
import { toast } from "@/hooks/use-toast";

type FriendshipWithProfile = {
  friendship: Friendship;
  profile: Profile;
};

export const FriendRequestDialog = ({friendRequests}: {friendRequests: Friendship[]}) => {
  const [open, setOpen] = useState(false);
  const [profiles, setProfiles] = useState<Array<FriendshipWithProfile>>([]);
  const [processing, setProcessing] = useState<string | null>(null); // Track which request is being processed

  useEffect(() => {
    const getProfiles = async () => {
      const res = await getProfilesAction(friendRequests.map((req: Friendship) => req.user_id));
      if (!res || res.status === "error") {
        console.error(`Error fetching profiles: ${res?.message || 'No response'}`);
      } else if (res.data) {
        const profilesWithStatus = friendRequests.map((req: Friendship) => {
          const profile = res.data!.find((profile: Profile) => profile.id === req.user_id);
          return {
            friendship: req,
            profile: profile,
          };
        });
        setProfiles(profilesWithStatus);
      }
    }
    getProfiles();
  }, [friendRequests]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    // nativeEvent.submitter 를 사용하여 어떤 버튼이 클릭되었는지 확인
    const button = (event.nativeEvent as SubmitEvent).submitter as HTMLButtonElement;
    const action = button.value as "ACCEPTED" | "REJECTED";
    const friendshipId = (event.target as HTMLFormElement).friendship_id.value;
    
    setProcessing(friendshipId); // Show loading state
    
    const res = await updateFriendRequestAction(friendshipId, action);
    
    if (res.status === "error") {
      toast({
        title: "Error",
        description: res.message,
        variant: "destructive",
      });
      setProcessing(null);
    } else {
      toast({
        title: "Success",
        description: res.message,
      });
      // Remove the processed request from the list
      setProfiles(prev => prev.filter(p => p.friendship.id !== friendshipId));
      setProcessing(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div className="peer group relative cursor-pointer">
          {profiles.length > 0 && <div className="rounded-full bg-yellow-200 absolute right-[-2.5px] top-[-2.5px] size-2.5" />}
          <button
            type="button"
            onClick={() => setOpen(true)}
            className={cn(
              "peer focus:outline-none cursor-pointer",
              "min-w-8 h-8 border border-muted-foreground text-muted-foreground rounded-md",
              "flex items-center justify-center",
              "transition-colors duration-300 hover:bg-muted-foreground hover:text-muted"
            )}
          >
            <UserRoundPen className="size-4" />
          </button>
          <div className="absolute top-1/2 -translate-y-1/2 -translate-x-3/4 -left-full bg-background rounded-md border border-foreground text-xs p-2 text-foreground opacity-0 peer-hover:opacity-100 user-select-none transition-opacity duration-300">
            Friend Requests
          </div>
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Friend Requests</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-2">
          {profiles.length > 0 ? (
            profiles.map((req) => (
              <div key={req.friendship.id} className="border py-4 px-3 rounded-md flex items-center gap-2 justify-between">
                <div className="flex items-center gap-2">
                  <Image src={req.profile.image_path!} alt={req.profile.username!} width={32} height={32} className="min-w-8 min-h-8 max-w-8 max-h-8 rounded-full" />
                  <div>{req.profile.username}</div>
                </div>
                <form className="flex gap-2" onSubmit={handleSubmit}>
                  <input type="hidden" name="friendship_id" value={req.friendship.id} />
                  <button 
                    type="submit" 
                    name="action" 
                    value="REJECTED" 
                    disabled={processing === req.friendship.id}
                    className="bg-red-500 text-white px-2 py-2 rounded-md cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <XIcon />
                  </button>
                  <button 
                    type="submit" 
                    name="action" 
                    value="ACCEPTED" 
                    disabled={processing === req.friendship.id}
                    className="bg-green-500 text-white px-2 py-2 rounded-md cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Check />
                  </button>
                </form>
              </div>
            ))
          ) : (
            <p className="p-2">No friend requests at the moment.</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
