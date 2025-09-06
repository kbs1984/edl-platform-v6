"use client"

import { useState } from "react"
import { Switch } from "@/components/ui/switch"
import { Student } from "@/types"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { toast } from "@/hooks/use-toast"
import { enableChallengeAction } from "@/lib/actions/student-actions"
import { Button } from "@/components/ui/button"

export const ChallengeEnableToggle = ({ student }: { student: Student }) => {
  const [enabled, setEnabled] = useState(student.challenge_enabled);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleCheckedChange = async (nextValue: boolean) => {
    if (!enabled && nextValue) {
      setDialogOpen(true);
    } else {
      const res = await enableChallengeAction(student.id, false);
      if (res.status === "error") {
        toast({
          title: "Error",
          description: `Challenge Enable Toggle check change: ${res.message}`,
          variant: "destructive",
        });
      } else {
        setEnabled(nextValue);
      }
    }
  }

  const handleConfirm = async () => {
    const res = await enableChallengeAction(student.id, true);

    if (res.status === "error") {
      toast({
        title: "Error",
        description: `Challenge Enable Toggle confirm: ${res.message}`,
        variant: "destructive",
      });
    } else {
      setEnabled(true);
    }
    setDialogOpen(false);
  }

  const handleCancel = async () => {
    setEnabled(false);
    setDialogOpen(false);
  }

  return (
    <div className="space-y-2">
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enable Challenges?</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            Are you sure you want to enable challenges? < br />
            This will allow the you to participate upper division debate.
          </DialogDescription>
          <DialogFooter className="mt-2">
            <Button className="border px-3 py-1 rounded" onClick={handleCancel} variant={"outline"}>
              Cancel
            </Button>
            <Button className="ml-2 border px-3 py-1 rounded bg-blue-600 text-white" onClick={handleConfirm} variant={"primary"}>
              Enable
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="flex items-center justify-between gap-2 ml-2 mt-2 md:ml-0">
        <div>Enable Challenges</div>
        <Switch checked={enabled} onCheckedChange={handleCheckedChange} className="cursor-pointer" />
      </div>
    </div>
  )
}
