'use server'

import { getProfile } from '@/utils/get-user-info';
import { createServerClient } from "@/utils/supabase/server";
import { v4 as uuidv4 } from "uuid"; 
import { Team, Profile, TeamMemberExtended, TeamDetailsPageData, TeamDetailsErrorData, TeamMember, TeamMemberProfile, TeamInvitation, TeamWithStatus } from "@/types";

export async function checkTeamNameAvailability(
  teamName: string
): Promise<boolean> {
  if (!teamName || teamName.trim().length < 3) {
    return false
  }

  const supabase = await createServerClient();

  try {
    const { count, error } = await supabase
      .from('team')
      .select('*' , { count: 'exact', head: true })
      .eq('name', teamName.trim())

    if (error) {
      console.error('Error checking team name availability:', error)
      return false
    }

    return count === 0
  } catch (err) {
    console.error('Unexpected error in checkTeamNameAvailability:', err)
    return false
  }
}

export async function getMyTeams(): Promise<TeamWithStatus[] | null> {
  const supabase = await createServerClient();
  const profile = await getProfile();

  if (!profile) {
    return null;
  }

  try {
    const { data, error } = await supabase
      .from('team_member')
      .select(`
        *,
        team:team_id (
          id,
          name,
          description,
          division,
          image_path,
          created_at,
          updated_at
        )
      `)
      .eq('student_id', profile.id);

    if (error) {
      console.error('Error fetching my teams:', error);
      return null;
    }
    const myTeamsData: TeamWithStatus[] | null = data?.map((item) => ({
      ...item.team,
      status: item.status,
    })) || null;

    return myTeamsData;
  } catch (err: any) {
    console.error('Unexpected error in getMyTeams:', err);
    return null;
  }
}

export async function getPendingTeamInvitations(): Promise<{ data: TeamInvitation[] | null; error: { message: string } | null }> {
  const supabase = await createServerClient();
  const profile = await getProfile();

  if (!profile) {
    return { error: { message: "User not authenticated" }, data: null };
  }

  try {
    const { data, error } = await supabase
      .from('team_member')
      .select(`
        id,
        status,
        team (
          id,
          name,
          image_path
        )
      `)
      .eq('student_id', profile.id)
      .eq('status', 'PENDING');

    if (error) {
      console.error("Error fetching pending team invitations:", error);
      return { error, data: null };
    }
    const dataTransformed = (data || []).map((item: any) => ({
      id: item.id,
      status: item.status,
      team: {
        id: item.team.id,
        name: item.team.name,
        image_path: item.team.image_path,
      },
    }));
    return { data: dataTransformed, error: null };
  } catch (err: any) {
    console.error("Unexpected error in getPendingTeamInvitations:", err);
    return { error: { message: err.message || "An unexpected error occurred" }, data: null };
  }
}

export async function updateTeamMemberStatus(teamMemberId: string, status: 'ACCEPTED' | 'REJECTED') {
  const supabase = await createServerClient();
  const profile = await getProfile();

  if (!profile) {
    return { success: false, error: { message: "User not authenticated." } };
  }

  try {
    const { data: memberToUpdate, error: memberError } = await supabase
      .from('team_member')
      .select('student_id')
      .eq('id', teamMemberId)
      .single();

    if (memberError || !memberToUpdate) {
      return { success: false, error: { message: "Team member record not found or error fetching it." } };
    }

    // Ensure the current user is the one associated with the team_member record
    if (memberToUpdate.student_id !== profile.id) {
      return { success: false, error: { message: "Unauthorized to update this invitation." } };
    }
    
    const { error } = await supabase
      .from('team_member')
      .update({ 
        status: status,
        join_date: status === 'ACCEPTED' ? new Date().toISOString() : null,
        updated_at: new Date().toISOString() 
      })
      .eq('id', teamMemberId)
      .eq('student_id', profile.id); 

    if (error) {
      console.error(`Error updating team member status to ${status}:`, error);
      return { success: false, error };
    }

    return { success: true };
  } catch (err: any) {
    console.error("Unexpected error in updateTeamMemberStatus:", err);
    return { success: false, error: { message: err.message || "An unexpected error occurred." } };
  }
}

// Action to CREATE a new team
export async function createTeamAction(formData: FormData) {
  const supabase = await createServerClient();

  try {
    const profile = await getProfile();
    const division = (await supabase.from('student').select('division').eq('user_id', profile!.id).single()).data?.division;
    if (!profile || !division) throw new Error("User not authenticated");

    // Extract data from FormData
    const teamName = formData.get("teamName")?.toString();
    const description = formData.get("description")?.toString();
    const imageFile = formData.get("logo"); 
    const membersJSON = formData.get("members")?.toString(); // Get members JSON string

    let members: { id: string }[] = [];
    if (membersJSON) {
      try {
        members = JSON.parse(membersJSON);
        if (!Array.isArray(members)) throw new Error("Invalid members format");
      } catch (e) {
        throw new Error("Failed to parse members data");
      }
    } else {
        throw new Error("Members data is missing"); // Require members data
    }

    // Ensure the creator is always included in the members list for insertion
    const invitedMemberIds = members.map(m => m.id); // IDs from the frontend are invitees

    if (!teamName) throw new Error("Team name is required");

    let teamLogoUrl: string | null = null;

    // --- Logo Upload Logic (similar to UploadUserInfoAction) ---
    if (imageFile && imageFile instanceof File && imageFile.size > 0) {
      const type = imageFile.name.split(".").pop();
      const filePath = `${profile.id}/${uuidv4()}.${type}`;

      const { error: uploadError } = await supabase
        .storage
        .from("team-assets")
        .upload(filePath, imageFile);

      if (uploadError) throw new Error(`Logo upload error: ${uploadError.message}`);

      const { data: publicData } = supabase
        .storage
        .from("team-assets")
        .getPublicUrl(filePath);
      teamLogoUrl = publicData.publicUrl;
    } 
    // --- End Logo Upload Logic ---

    // Insert into 'team' table
    const { data: newTeam, error: teamInsertError } = await supabase
      .from('team')
      .insert({
        name: teamName,
        description: description,
        image_path: teamLogoUrl,
        division: division,
        updated_at: new Date().toISOString(),
      })
      .select()
      .single(); // Get the newly created team record

    if (teamInsertError) throw new Error(`DB insert error (team): ${teamInsertError.message}`);
    if (!newTeam) throw new Error("Failed to create team record.");

    // --- Insert Team Creator as Leader ---
    const { error: creatorInsertError } = await supabase
      .from('team_member')
      .insert({
        team_id: newTeam.id,
        student_id: profile.id,
        is_leader: true,
        status: 'ACCEPTED',
        join_date: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });

    if (creatorInsertError) {
      await supabase.from('team').delete().eq('id', newTeam.id);
      if (teamLogoUrl) {
        await supabase.storage.from('team-assets').remove([teamLogoUrl]);
      }
      console.error("DB insert error (team_member for creator):", creatorInsertError);
      throw new Error(`DB insert error (team_member for creator): ${creatorInsertError.message}`);
    }

    // --- Insert Invited Members ---
    if (invitedMemberIds.length > 0) {
      const result = await inviteTeamMember(newTeam.id, invitedMemberIds, false);

      if (!result.success) {
        await supabase.from('team_member').delete().eq('team_id', newTeam.id);
        await supabase.from('team').delete().eq('id', newTeam.id);
        if (teamLogoUrl) {
          await supabase.storage.from('team-assets').remove([teamLogoUrl]);
        }
        console.error("DB insert error (team_member for invitees):", result.message);
        throw new Error(`DB insert error (team_member for invitees): ${result.message}`);
      }
    }

    return {
      success: true,
      message: "Team created successfully!",
      teamId: newTeam.id
    }

  } catch (err: any) {
    console.error("Error in CreateTeamAction:", err);
    return {
      success: false,
      message: err.message || "Something went wrong while creating the team"
    }
  }
}

export async function isTeamDetailsErrorData(data: TeamDetailsPageData | TeamDetailsErrorData): Promise<boolean> {
  return (data as TeamDetailsErrorData).error !== undefined && data.team === null;
}

export async function getTeamDetailsPageData(
  teamId: string
): Promise<TeamDetailsPageData | TeamDetailsErrorData> {
  const supabase = await createServerClient();
  const profile = await getProfile();

  if (!profile) {
    return {
      error: "User not authenticated.",
      team: null,
      members: [],
      currentUserStatus: 'not-authenticated',
      currentUserId: null,
      currentUserTeamMemberId: null,
    };
  }
  const currentUserId = profile.id;

  try {
    // 1. Fetch team basic details including leader's profile
    const { data: teamData, error: teamError } = await supabase
      .from('team')
      .select('*')
      .eq('id', teamId)
      .single();

    if (teamError && teamError.code !== 'PGRST116') { // PGRST116: single() found no rows
      console.error("Error fetching team details:", teamError.message);
      return {
        error: teamError.message,
        team: null,
        members: [],
        currentUserStatus: 'not-authenticated',
        currentUserId,
        currentUserTeamMemberId: null,
      };
    }

    if (!teamData) {
      console.warn("Team not found for ID:", teamId);
      return { 
        error: "Team not found.", 
        team: null, 
        members: [], 
        currentUserStatus: 'not-authenticated', 
        currentUserId, 
        currentUserTeamMemberId: null 
      };
    }

    // 2. Fetch team members including their profiles
    const { data: membersData, error: membersError } = await supabase
      .from('team_member')
      .select(`
        *,
        student_id (
          id,
          username,
          image_path
        )
      `)
      .eq('team_id', teamId)
      .neq('status', 'REJECTED'); // Exclude rejected members

    if (membersError) {
      console.error("Error fetching team members:", membersError.message);
      // Return team data if available, but indicate member fetching error
      return {
        error: `Error fetching team members: ${membersError.message}`,
        team: teamData as Team, 
        members: [],
        currentUserStatus: 'not-authenticated', // Or a specific error status
        currentUserId,
        currentUserTeamMemberId: null,
      };
    }

    const extendedMembers: TeamMemberExtended[] = membersData?.map((m: any) => ({
      ...(m as TeamMember), // Cast m to TeamMember
      profile: m.student_id as Pick<Profile, 'id' | 'username' | 'image_path'>,
    })) || [];

    // 3. Determine current user's status and team_member_id
    let currentUserStatus: TeamDetailsPageData['currentUserStatus'] = 'non-member';
    let currentUserTeamMemberId: string | null = null;
    let leader_profile: Pick<Profile, 'id' | 'username' | 'image_path'> | null = null;

    const currentUserMembership = extendedMembers.find(
      (m) => m.profile.id === currentUserId
    );

    const leaderMembership = extendedMembers.find(
      (m) => m.is_leader
    );

    if (leaderMembership) {
      leader_profile = leaderMembership.profile;
    }

    if (currentUserMembership) {
      currentUserTeamMemberId = currentUserMembership.id; // This is team_member.id
      if (currentUserMembership.status === 'PENDING') {
        currentUserStatus = 'invited';
      } else if (currentUserMembership.status === 'ACCEPTED') {
        currentUserStatus = currentUserMembership.is_leader ? 'leader' : 'member';
      }
    }
    
    const team = {
        ...teamData,
        leader_profile,
        created_at: new Date(teamData.created_at).toISOString().split('T')[0], // Format to YYYY-MM-DD
    } as Team;

    return {
      team,
      members: extendedMembers,
      currentUserStatus,
      currentUserId: profile.id,
      currentUserTeamMemberId,
    };
  } catch (error: any) {
    console.error("Error fetching team details:", error.message);
    return {
      error: `Failed to fetch team details: ${error.message}`,
      team: null,
      members: [],
      currentUserStatus: 'not-authenticated',
      currentUserId: null,
      currentUserTeamMemberId: null,
    };
  }
}

export async function inviteTeamMember(
  teamId: string,
  studentIds: string[],
  isLeader: boolean
) {
  const supabase = await createServerClient();

  try {
    const inviteeRecords = studentIds.map(studentId => ({
      team_id: teamId,
      student_id: studentId,
      is_leader: isLeader,
      status: 'PENDING',
      updated_at: new Date().toISOString(),
    }));
    
    const { error: insertError } = await supabase
      .from('team_member')
      .insert(inviteeRecords);

    if (insertError) {
      console.error("DB insert error (team_member for invitee):", insertError);
      throw new Error(`DB insert error (team_member for invitee): ${insertError.message}`);
    }

    return {
      success: true,
      message: "Team member invited successfully!",
    }
  } catch (err: any) {
    console.error("Error inviting team member:", err);
    return {
      success: false,
      message: err.message || "Something went wrong while inviting the team member",
    }
  }
}

// Action to REMOVE a team member (only by team leader)
export async function removeTeamMember(
  teamMemberIdToRemove: string, 
  currentUserStatus: TeamDetailsPageData['currentUserStatus'], 
  members: TeamMemberProfile[],
  teamId: string
) {
  const supabase = await createServerClient();
  const profile = await getProfile();

  if (!profile) {
    return { success: false, error: { message: "User not authenticated." } };
  }

  const membersWithoutCurrent = members.filter(m => m.id !== profile.id);

  if (members.length === 1) {
    const { error: deleteError } = await supabase
      .from('team')
      .delete()
      .eq('id', teamId);
    if (deleteError) {
      console.error("Error removing team member:", deleteError);
      return { success: false, error: deleteError };
    }
    return { success: true };
  }

  if (currentUserStatus === 'leader' && members.length > 1) {
    changeTeamLeader(membersWithoutCurrent[0].id, teamId)
  }

  const { error: deleteError } = await supabase
      .from('team_member')
      .delete()
      .eq('student_id', teamMemberIdToRemove);

    if (deleteError) {
      console.error("Error removing team member:", deleteError);
      return { success: false, error: deleteError };
    }

    return { success: true };
}

// Action to CHANGE the team leader (only by current team leader)
export async function updateTeamInfo(teamId: string, updates: { name?: string; description?: string; image_path?: string }) {
  const supabase = await createServerClient();
  const profile = await getProfile();

  if (!profile) {
    return { error: { message: "Not authenticated" }, success: false };
  }

  // First check if user is team leader
  const { data: teamMember } = await supabase
    .from('team_member')
    .select('is_leader')
    .eq('team_id', teamId)
    .eq('student_id', profile.id)
      .single();

  if (!teamMember?.is_leader) {
    return { error: { message: "Only team leader can update team info" }, success: false };
  }

  // If updating name, check availability
  if (updates.name) {
    const isNameAvailable = await checkTeamNameAvailability(updates.name);
    if (!isNameAvailable) {
      return { error: { message: "Team name already taken" }, success: false };
    }
  }

  // Update team info
  const { error } = await supabase
    .from('team')
    .update(updates)
    .eq('id', teamId);

  if (error) throw error;

  return { success: true };
}

export async function changeTeamLeader(newLeaderTeamMemberId: string, teamId: string) {
  const supabase = await createServerClient();

  const { error: rpcErr } = await supabase.rpc('set_team_leader', {
    p_team_id: teamId,
    p_student_id: newLeaderTeamMemberId,
  });
  if (rpcErr) {
    return { error: { message: rpcErr.message }, success: false };
  }

  return { success: true };
}