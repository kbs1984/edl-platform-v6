"use server"

import { createServerClient } from "@/utils/supabase/server"

export async function checkUsernameAvailability(username: string, id: string): Promise<boolean> {
  // Create or retrieve a Supabase server client instance.
  const supabase = await createServerClient() 

  // Query the database for a matching username.
  const { data } = await supabase
    .from("profile")
    .select("username, id")
    .eq("username", username.toLowerCase())
    .maybeSingle()

  return data === null || data.id === id;
}
