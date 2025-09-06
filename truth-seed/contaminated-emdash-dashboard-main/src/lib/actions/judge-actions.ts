"use server";

import { JudgeData } from "@/components/onboarding/judge-form";
import { createServerClient } from "@/utils/supabase/server";

export async function checkUserEmail(email: string): Promise<string | null> {
  // Create or retrieve a Supabase server client instance.
  const supabase = await createServerClient()

  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) return null;

  // Query the database for a matching username.
  const { data } = await supabase
    .from("profile")
    .select("email, id")
    .eq("email", email.toLowerCase())
    .maybeSingle()

  if (!data || !data.id || user.id === data.id) return null;
  return data.id;
}

export async function judgeAction(formData: JudgeData) {
  if (!formData.termsAgreed) return { status: "error", message: "Terms not agreed"};
  const supabase = await createServerClient();

  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) return { status: "error", message: error.message};
  if (!user) return { status: "error", message: "User not found"};
  if (!user.phone) return { status: "error", message: "Phone number not registered"};

  if (!formData.bio || !formData.jobTitle) return { status: "error", message: "Form missing"};

  const { error: judgeError } = await supabase
  .from("judge")
  .insert({
    biography: formData.bio,
    job_title: formData.jobTitle,
    referral_user_id: formData.referralId,
  });

  if (judgeError) return { status: "error", message: judgeError.message};

  const { error: profileError } = await supabase
  .from("profile")
  .update({
    active: true,
    term_agree_time: new Date().toISOString()
  })
  .eq("id", user.id);

  if (profileError) return { status: "error", message: `profile update error: ${profileError.message}`};
  
  return { status: "success", message: "Succesfully registered"};
}
