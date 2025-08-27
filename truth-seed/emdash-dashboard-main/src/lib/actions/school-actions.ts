"use server";

import { createServerClient } from "@/utils/supabase/server";

export const searchSchoolAction = async (schoolSearchQuery: string) => {
  const supabase = await createServerClient();
  const { data, error } = await supabase.rpc("search_school", { search_query: schoolSearchQuery }).select("*");
  if (error) console.error(error);
  return data;
}

export const registerSchoolAction = async (schoolName: string) => {
  const supabase = await createServerClient();
  const { data: { user: user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from("school")
    .insert({
      name: schoolName
      // Note: school table doesn't have created_by column
    })
    .select("id, name")
    .single();
  
  if (error) {
    console.error("Error registering school:", error);
    return null;
  }
  
  if (!data) {
    console.error("No data returned from school registration");
    return null;
  }
  
  // Return the school object with both id and name
  return data;
}