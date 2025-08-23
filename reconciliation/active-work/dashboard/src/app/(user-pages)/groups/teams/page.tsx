import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus } from "lucide-react";
import Link from "next/link";
import TeamList from '@/components/team/team-list';
import { TeamRequestDialog } from "@/components/team/team-request-dialog";

export default async function Page() {
  return (
    <div className="px-10 pt-5 pb-10 gridcols" style={{ height: "calc(100svh - 64px)" }}>
      <Card className="h-full">
        <div className="px-10 pt-5 pb-10 w-full h-full">
          <div className="w-full flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">My Teams</h1>
              <p className="text-muted-foreground">Manage your teams here</p>
            </div>
            <div className="flex items-center gap-4">
              <TeamRequestDialog />
              <Link href={"/groups/teams/new"}>
                <Button className="h-11">
                  <Plus className="mr-2 size-4" />
                  New Team
                </Button>
              </Link>
            </div>
          </div>
          <div className="mt-5">
            <TeamList />
          </div>
        </div>
      </Card>
    </div>
  );
}