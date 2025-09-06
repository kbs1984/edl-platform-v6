"use server"

import { createServerClient } from "@/utils/supabase/server";

export async function linkStudentToGuardian(
  studentEmail: string,
  relationship: string = "parent"
) {
  const supabase = await createServerClient();

  // Get current guardian
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return { status: "error", message: "Not authenticated" };
  }

  const { data: guardian, error: guardianError } = await supabase
    .from("guardian")
    .select("id")
    .eq("user_id", user.id)
    .single();

  if (guardianError || !guardian) {
    return { status: "error", message: "Guardian profile not found" };
  }

  // Find student by email
  const { data: studentProfile, error: profileError } = await supabase
    .from("profile")
    .select("id")
    .eq("email", studentEmail)
    .single();

  if (profileError || !studentProfile) {
    return { status: "error", message: "Student not found with that email" };
  }

  // Check if student exists
  const { data: student, error: studentCheckError } = await supabase
    .from("student")
    .select("id, guardian_id")
    .eq("user_id", studentProfile.id)
    .single();

  if (studentCheckError || !student) {
    return { status: "error", message: "Student profile not found" };
  }

  // Check if student already has a guardian
  if (student.guardian_id) {
    return { status: "error", message: "Student already linked to another guardian" };
  }

  // Link the student to guardian
  const { error: updateError } = await supabase
    .from("student")
    .update({
      guardian_id: guardian.id,
      relationship_with_guardian: relationship
    })
    .eq("id", student.id);

  if (updateError) {
    return { status: "error", message: updateError.message };
  }

  return { status: "success", message: "Student successfully linked" };
}

export async function unlinkStudentFromGuardian(studentId: string) {
  const supabase = await createServerClient();

  // Get current guardian
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return { status: "error", message: "Not authenticated" };
  }

  const { data: guardian, error: guardianError } = await supabase
    .from("guardian")
    .select("id")
    .eq("user_id", user.id)
    .single();

  if (guardianError || !guardian) {
    return { status: "error", message: "Guardian profile not found" };
  }

  // Verify the student is linked to this guardian
  const { data: student, error: studentError } = await supabase
    .from("student")
    .select("guardian_id")
    .eq("id", studentId)
    .single();

  if (studentError || !student) {
    return { status: "error", message: "Student not found" };
  }

  if (student.guardian_id !== guardian.id) {
    return { status: "error", message: "You are not authorized to unlink this student" };
  }

  // Unlink the student
  const { error: updateError } = await supabase
    .from("student")
    .update({
      guardian_id: null,
      relationship_with_guardian: null
    })
    .eq("id", studentId);

  if (updateError) {
    return { status: "error", message: updateError.message };
  }

  return { status: "success", message: "Student successfully unlinked" };
}

export async function getGuardianStudents() {
  const supabase = await createServerClient();

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return { status: "error", message: "Not authenticated", data: null };
  }

  const { data: guardian, error: guardianError } = await supabase
    .from("guardian")
    .select("id")
    .eq("user_id", user.id)
    .single();

  if (guardianError || !guardian) {
    return { status: "error", message: "Guardian profile not found", data: null };
  }

  const { data: students, error: studentsError } = await supabase
    .from("student")
    .select(`
      id,
      user_id,
      grade_level,
      school_id,
      relationship_with_guardian,
      profile!inner(
        name,
        email,
        active
      )
    `)
    .eq("guardian_id", guardian.id);

  if (studentsError) {
    return { status: "error", message: studentsError.message, data: null };
  }

  return { status: "success", message: "Students retrieved", data: students };
}