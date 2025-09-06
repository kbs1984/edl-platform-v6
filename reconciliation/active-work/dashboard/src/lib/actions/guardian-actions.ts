"use server"

import { GuardianData } from "@/types/form";
import { createServerClient } from "@/utils/supabase/server";

export const guardianAction = async (formData: GuardianData) => {
  if (!formData.termsAgreed) return { status: "error", message: "Terms not agreed"};
  const supabase = await createServerClient();

  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) return { status: "error", message: error.message};
  if (!user) return { status: "error", message: "User not found"};
  if (!user.phone) return { status: "error", message: "Phone number not registered"};
  
  // First check if guardian record already exists
  const { data: existingGuardian } = await supabase
    .from("guardian")
    .select("id")
    .eq("user_id", user.id)
    .single();

  // Only insert if no guardian record exists
  if (!existingGuardian) {
    const { error: guardianError } = await supabase
      .from("guardian")
      .insert({
        user_id: user.id,
        // Payment and billing can be added later in profile settings
        payment_method: null,
        billing_address: null
      })

    if (guardianError) return { status: "error", message: guardianError.message};
  }

  const { error: profileError } = await supabase
    .from("profile")
    .update({
      active: true,
      user_role: 'GUARDIAN',
      term_agree_time: new Date().toISOString()
    })
    .eq("id", user.id);

  if (profileError) return { status: "error", message: `profile update error: ${profileError.message}`};

  return { status: "success", message: "Succesfully registered"};
}