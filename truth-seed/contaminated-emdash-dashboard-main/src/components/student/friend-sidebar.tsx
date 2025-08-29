import { FriendSidebar, SidebarContent, useFriendSidebar } from "@/components/ui/friend-sidebar"
import { cn, getLevelFromExp } from "@/lib/utils";
import { MessageCircleMore, Plus, Search, UserPlus, Users, XIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useFriends } from "@/hooks/use-friends";
import { AddFriendDialog } from "./add-friend-dialog";
import Image from "next/image";
import { FriendRequestDialog } from "./friend-request-dialog";

export const StudentFriendSidebar = () => {
  const { setOpen } = useFriendSidebar();
  const { friends, friendRequests } = useFriends();
  const [ addFriendDialogOpen, setAddFriendDialogOpen ] = useState(false);

  return (
    <>
      <FriendSidebar variant="floating" collapsible="offcanvas" className="whitespace-nowrap">
        <SidebarContent className="py-2 px-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2 pl-1">
              <Users className="size-4" />
              Friends
            </div>
            <XIcon className="cursor-pointer" onClick={() => setOpen(false)} />
          </div>
          <div className="relative flex items-center gap-2 mt-4">
            <Search className="absolute bottom-2 left-2 size-4 text-muted-foreground" />
            <input type="text" placeholder="Search Friends" className="w-full p-2 border-[1.5px] border-muted-foreground rounded pl-8 h-8 text-sm" />
            <FriendRequestDialog friendRequests={friendRequests} />
            <div className="peer group relative">
              <button type="button" onClick={() => setAddFriendDialogOpen(true)} className={cn(
                "peer focus:outline-none cursor-pointer",
                "min-w-8 h-8 border border-muted-foreground text-muted-foreground rounded-md",
                "flex items-center justify-center cursor-pointer",
                "transition-colors duration-300 hover:bg-muted-foreground hover:text-muted",
              )}>
                <UserPlus className="size-4" />
              </button>
              <div className="absolute top-1/2 -translate-y-1/2 -translate-x-3/4 -left-full bg-background rounded-md border border-foreground text-xs p-2 text-foreground opacity-0 peer-hover:opacity-100 user-select-none pointer-events-none transition-opacity duration-300">
                Add New Friend
              </div>
            </div>
          </div>
          <div>
            {friends.length > 0 ? (
              <> 
                <div className="text-sm font-semibold text-muted-foreground mt-4">Online Friends - {friends.filter((friend) => friend.status === "online").length}</div>
                <div className="flex flex-col gap-1 mt-2">
                  {friends.filter((friend) => friend.status === "online").map((friend) => (
                    <div key={friend.id} className="flex justify-between items-center p-2 hover:bg-foreground/20 rounded-md cursor-pointer transition-colors duration-300 relative">
                      <div className="flex gap-4">
                        <Image src={friend.image_path} alt={friend.username} width={32} height={32} className="min-w-8 min-h-8 max-w-8 max-h-8 rounded-full" />
                        <div>
                          <div className="text-sm">{friend.username}</div>
                          <div className="text-xs text-muted-foreground">{friend.status === "online" ? "Online" : "On Debate"}</div>
                        </div>
                      </div>
                      <MessageCircleMore strokeWidth={1.3} className="size-6 text-muted-foreground cursor-pointer" />
                      <div className="rounded-full bg-green-500 absolute left-[33px] bottom-[11px] size-2.5" />
                    </div>
                  ))}
                </div>
                <div className="h-[1px] bg-muted-foreground/20 my-4" />
                {/* Offline Friends List */}
                <div className="text-sm font-semibold text-muted-foreground mt-4">Offline Friends</div>
                <div className="flex flex-col gap-1 mt-2">
                  {friends.filter((friend) => friend.status === null).map((friend) => (
                    <div key={friend.id} className="flex justify-between items-center p-2 hover:bg-foreground/20 rounded-md cursor-pointer transition-colors duration-300 relative">
                      <div className="flex gap-4 opacity-60">
                      <Image src={friend.image_path} alt={friend.username} width={32} height={32} className="min-w-8 min-h-8 max-w-8 max-h-8 rounded-full" />
                        <div className="text-sm mt-1">{friend.username}</div>
                      </div>
                      <MessageCircleMore strokeWidth={1.3} className="size-6 text-muted-foreground cursor-pointer" />
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center gap-2">
                <div className="text-md text-muted-foreground">No friends found</div>
                <Button variant={"primary"} size={"sm"} onClick={() => setAddFriendDialogOpen(true)}>
                  <Plus />
                  <div>
                    Add New Friends
                  </div>
                </Button>
              </div>
            )}
          </div>
        </SidebarContent>
      </FriendSidebar>
      <AddFriendDialog dialogOpen={addFriendDialogOpen} setDialogOpen={setAddFriendDialogOpen} />
    </>
  )
}