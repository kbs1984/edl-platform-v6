"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { updateTeamInfo } from "@/lib/actions/team-actions";
import { Team } from "@/types";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface EditTeamDialogProps {
  team: Team;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditTeamDialog({ team, isOpen, onOpenChange }: EditTeamDialogProps) {
  const [name, setName] = useState(team.name);
  const [description, setDescription] = useState(team.description || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const result = await updateTeamInfo(team.id, {
        name: name !== team.name ? name : undefined,
        description: description !== team.description ? description : undefined,
      });

      if (result.success) {
        toast({ title: "Success", description: "Team info updated successfully" });
        router.refresh();
        onOpenChange(false);
      } else {
        toast({
          title: "Error",
          description: result.error?.message || "Failed to update team info",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Team Information</DialogTitle>
          <DialogDescription>
            Make changes to your team&apos;s information here.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Input
                id="name"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Team Name"
                required
                minLength={3}
              />
            </div>
            <div className="space-y-2">
              <Textarea
                id="description"
                name="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Team Description"
                className="min-h-[100px]"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
