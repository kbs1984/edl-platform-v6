import { getProfile } from "@/utils/get-user-info";
import { redirect } from "next/navigation";
import { createServerClient } from "@/utils/supabase/server";
import { StudentDashboard } from "@/components/dashboard/student";

export default async function Home() {
  const supabase = await createServerClient();
  const profile = await getProfile();
  
  if (!profile.active) {
    if (!profile.user_role) redirect(`/onboarding`);
    if (!profile.date_of_birth || !profile.gender || !profile.image_path || !profile.name || !profile.username) redirect(`/onboarding/step-2`);
    else redirect(`/onboarding/step-3`);
  }

  // EDL Platform: Check if student needs call sign
  // Session 107: Commenting out call-sign check as the page doesn't exist
  // if (profile.user_role === 'STUDENT') {
  //   const { data: student } = await supabase
  //     .from('student')
  //     .select('call_sign')
  //     .eq('user_id', profile.id)
  //     .single();
      
  //   if (!student?.call_sign) {
  //     redirect('/onboarding/call-sign');
  //   }
  // }

  if (profile.user_role === "STUDENT") {
    const { data, error } = await supabase.from("student").select("*").eq("user_id", profile.id).single();
    if (error) return <div> Student data not found... </div>
    return <StudentDashboard profile={profile} student={data!} />;
  } else if (profile.user_role === "JUDGE") {
    return <a href="https://adjud.edl.emdash.one" target="_blank">Judge Dashboard</a>
    // const { data, error } = await supabase.from("judge").select("*").eq("user_id", profile.id).single();
    // if (error) return <div> Judge data not found... </div>
    return <div> Judge Dashboard </div>;
  } else if (profile.user_role === "GUARDIAN") {
    const { data, error } = await supabase.from("guardian").select("*").eq("user_id", profile.id).single();
    if (error) return <div> Guardian data not found... </div>
    return <div> Guardian Dashboard </div>;
  }
  return <div> No data found... </div>;
}
