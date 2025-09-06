"use server";

import { createServerClient } from "@/utils/supabase/server";

export const searchSchoolAction = async (schoolSearchQuery: string) => {
  const supabase = await createServerClient();
  
  // Use RPC function with SECURITY DEFINER to bypass RLS
  const { data, error } = await supabase.rpc("search_school", { 
    search_query: schoolSearchQuery 
  });
  
  if (error) {
    console.error("Search school error:", error);
    // Fallback to direct table query if RPC fails
    const { data: fallbackData, error: fallbackError } = await supabase
      .from("school")
      .select("id, name")
      .ilike("name", `%${schoolSearchQuery}%`)
      .limit(20);
    
    if (fallbackError) {
      console.error("Fallback search also failed:", fallbackError);
      return [];
    }
    return fallbackData || [];
  }
  
  return data || [];
}

export const registerSchoolAction = async (schoolName: string) => {
  console.log("registerSchoolAction called with:", schoolName);
  const supabase = await createServerClient();
  const { data: { user: user } } = await supabase.auth.getUser();
  console.log("User in server action:", user?.id ? "authenticated" : "not authenticated");
  if (!user) {
    console.log("No user found in server action");
    return null;
  }

  const { data, error } = await supabase
    .from("school")
    .insert({
      name: schoolName,
      created_by: user.id,  // Explicitly set created_by
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
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