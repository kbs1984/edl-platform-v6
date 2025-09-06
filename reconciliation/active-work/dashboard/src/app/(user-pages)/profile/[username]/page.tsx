import { notFound } from "next/navigation";
import { createServerClient } from "@/utils/supabase/server";
import { ProfileDisplay } from "@/components/profile/profile-display";

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const supabase = await createServerClient();

  // Get profile by username
  const { data: profile, error } = await supabase
    .from("profile")
    .select(`
      *,
      student:student(
        *,
        school:school(name)
      ),
      guardian:guardian(*),
      judge:judge(*)
    `)
    .eq("username", username)
    .single();

  if (error || !profile) {
    notFound();
  }

  // Get current user to check if viewing own profile
  const { data: { user } } = await supabase.auth.getUser();
  const isOwnProfile = user?.id === profile.id;

  // Get additional data based on user role
  let additionalData = {};

  if (profile.user_role === 'STUDENT' && profile.student) {
    // Get friend status if not own profile
    if (!isOwnProfile && user) {
      const { data: friendship } = await supabase
        .from("friendship")
        .select("id, status")
        .or(`user_id.eq.${user.id},friend_id.eq.${user.id}`)
        .or(`user_id.eq.${profile.id},friend_id.eq.${profile.id}`)
        .single();

      additionalData = { friendship };
    }

    // Get achievements
    const { data: achievements } = await supabase
      .from("user_achievements")
      .select(`
        *,
        achievement:achievements(*)
      `)
      .eq("user_id", profile.id)
      .order("earned_at", { ascending: false })
      .limit(6);

    additionalData = { ...additionalData, achievements };

    // Get teams
    const { data: teams } = await supabase
      .from("team_member")
      .select(`
        *,
        team:team(*)
      `)
      .eq("student_id", profile.id)
      .eq("status", "ACCEPTED");

    additionalData = { ...additionalData, teams };
  }

  return (
    <ProfileDisplay
      profile={profile}
      isOwnProfile={isOwnProfile}
      additionalData={additionalData}
    />
  );
}