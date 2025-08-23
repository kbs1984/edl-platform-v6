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
      name: schoolName,
      created_by: user.id
    })
    .select("id");
  
  if (error) console.error(error);
  if (!data) return null;
  return data[0];
}