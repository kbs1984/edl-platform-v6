import { createClient } from "@supabase/supabase-js";

export const createAdminAuthClient = async () => {
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_KEY!, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })
  return supabase.auth.admin;
};
