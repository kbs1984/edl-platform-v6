import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { sendFriendRequestAction } from "@/lib/actions/student-actions";
import { toast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";

export const AddFriendDialog = ({ dialogOpen, setDialogOpen }: { dialogOpen: boolean, setDialogOpen: (open: boolean) => void }) => {
  const sendFriendRequest = async (input: string) => {
    const res = await sendFriendRequestAction(input);
    if (res.status === "error") {
      toast({
        title: "Send Friend Request Error",
        description: `${res.message}`,
        variant: "destructive",
      });
    }
  }
  
  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Friend</DialogTitle>
          <DialogDescription>
            Add a friend by entering their email address or username.
          </DialogDescription>
        </DialogHeader>
        <form className="flex flex-col space-y-4" onSubmit={(e) => {
          e.preventDefault();
          const input = (e.target as HTMLFormElement).input.value;
          sendFriendRequest(input);
          setDialogOpen(false);
        }}>
          
          <div className="flex justify-between items-center gap-2">
            <Input type="text" placeholder="Enter email or username" name="input" className="w-full" height={"48px"} />
            <Button type="submit" className="h-12">Send Request</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}