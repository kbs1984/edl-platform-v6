import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { ActivityDiscovery } from "@/components/activities/activity-discovery";

export default async function ActivityDiscoveryPage() {
  const supabase = await createClient();
  
  // Check authentication
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    redirect("/login");
  }

  return (
    <div className="container mx-auto p-6">
      <ActivityDiscovery userId={user.id} />
    </div>
  );
}