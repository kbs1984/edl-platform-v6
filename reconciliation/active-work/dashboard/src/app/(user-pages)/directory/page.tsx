import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { SchoolDirectorySearch } from "@/components/directory/school-directory-search";

export default async function DirectoryPage() {
  const supabase = await createClient();
  
  // Check authentication
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    redirect("/login");
  }

  return (
    <div className="container mx-auto p-6">
      <SchoolDirectorySearch currentUserId={user.id} />
    </div>
  );
}