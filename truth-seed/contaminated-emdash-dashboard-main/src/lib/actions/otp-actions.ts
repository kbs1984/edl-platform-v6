"use server";
import { createServerClient } from "@/utils/supabase/server";

export const sendOtp = async (phoneNumber: string) => {
  const supabase = await createServerClient();
  const res = await supabase.auth.updateUser({
    phone: phoneNumber
  });

  return res;
};

export const verifyOtp = async (phoneNumber: string, otp: string) => {
  const supabase = await createServerClient();
  const res = await supabase.auth.verifyOtp({
    phone: phoneNumber,
    token: otp,
    type: "phone_change"
  });

  return res;
};
