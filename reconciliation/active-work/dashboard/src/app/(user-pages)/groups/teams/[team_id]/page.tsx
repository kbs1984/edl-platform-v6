import { Suspense } from "react";
import { TeamHeader } from "@/components/team/team-header";
import { TeamMembersList } from "@/components/team/team-members-list";
import { TeamPageSkeleton } from "@/components/team/team-skeletons";
import { getTeamDetailsPageData, isTeamDetailsErrorData } from "@/lib/actions/team-actions";
import { TeamChatWrapper } from "@/components/team/team-chat-wrapper";
import { TeamDetailsErrorData, TeamDetailsPageData, TeamMemberProfile } from "@/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { UsersIcon, TrophyIcon } from "lucide-react";
import { DebateSearch } from "@/components/debate/debate-search";
import { createServerClient } from "@/utils/supabase/server";

async function TeamDetailContent({ teamId }: { teamId: string }) {
  const supabase = await createServerClient();
  const data: TeamDetailsPageData | TeamDetailsErrorData = await getTeamDetailsPageData(teamId);

  const isError = await isTeamDetailsErrorData(data);
  if (isError) return <div className="container mx-auto p-4 text-center">Error: {(data as TeamDetailsErrorData).error}</div>;
  const { team, members, currentUserStatus, currentUserId, currentUserTeamMemberId } = data as TeamDetailsPageData;
  if (!team) return <div className="container mx-auto p-4 text-center">Team not found.</div>;

  const membersProfile: TeamMemberProfile[] = members.map(m => ({
    id: m.profile.id,
    username: m.profile.username || "Unknown User",
    avatarUrl: m.profile.image_path || "",
    exp: 0,
    isLeader: m.is_leader,
    status: m.status,
  }));

  const { data: debateFormats, error: debateFormatsError } = await supabase
    .schema("debate")
    .from("debate_formats")
    .select("*");

  if (debateFormatsError) {
    console.error("Error fetching debate formats:", debateFormatsError);
    return <div className="container mx-auto p-4 text-center">Error fetching debate formats.</div>;
  }

  const debateFormatsData = debateFormats
    .filter(format => format.type === "SYNC")
    .map(format => ({
      value: format.id,
      name: format.description,
    }));

  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8 space-y-6">
      <TeamHeader
        team={team}
        currentUserTeamMemberId={currentUserTeamMemberId || ""}
        currentUserStatus={currentUserStatus}
        members={membersProfile}
        currentUserId={currentUserId || ""}
      />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <TeamMembersList
            members={membersProfile}
            currentUserId={currentUserId || ""}
            teamId={team.id}
            currentUserStatus={currentUserStatus}
            />
        </div>
        <div>
          <DebateSearch 
            team={team}
            currentUserStatus={currentUserStatus}
            debateFormats={debateFormatsData}
          />
        </div>
        {(currentUserStatus === "member" || currentUserStatus === "leader") 
          ? (
            <div className="md:col-span-1">
              <TeamChatWrapper
                teamId={team.id}
                currentUserId={currentUserId || ""}
              />
          </div>
          )
          : (
            <div className="md:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>Join This Team</CardTitle>
                  <CardDescription>You're currently not a member of this team</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2">
                    <UsersIcon className="h-5 w-5 text-muted-foreground" />
                    <p className="text-sm">Team size: {members.length} member{members.length !== 1 ? 's' : ''}</p>
                  </div>
                  {team.division && (
                    <div className="flex items-center gap-2">
                      <TrophyIcon className="h-5 w-5 text-muted-foreground" />
                      <p className="text-sm">Division: {team.division}</p>
                    </div>
                  )}
                  {currentUserStatus === "invited" ? (
                    <Alert className="bg-yellow-50 border-yellow-200">
                      <AlertTitle className="text-yellow-800">You've been invited</AlertTitle>
                      <AlertDescription className="text-yellow-700">
                        You have a pending invitation to join this team.
                      </AlertDescription>
                    </Alert>
                  ) : currentUserStatus === "non-member" ? (
                    <Alert className="bg-blue-50 border-blue-200">
                      <AlertTitle className="text-blue-800">Want to join?</AlertTitle>
                      <AlertDescription className="text-blue-700">
                        You can request to join this team or wait for an invitation from the team leader.
                      </AlertDescription>
                    </Alert>
                  ) : null}
                </CardContent>
              </Card>
            </div>
          )
        }
      </div>
    </div>
  );
}

export default async function TeamDetailPage({ params }: { params: Promise<{ team_id: string }> }) {
  const teamId = (await params).team_id;

  return (
    <Suspense fallback={<TeamPageSkeleton />}>
      <TeamDetailContent teamId={teamId} />
    </Suspense>
  );
}