import { Card } from "@/components/ui/card";
import { getUser } from "@/lib/get-user";
import { Profile } from "@/types/type";
import { createClient } from "@/utils/supabase/server";
import Image from "next/image";
import { redirect } from "next/navigation";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const user = await getUser();

  if (user !== null) {
    const { data: profile } = await supabase
      .from("profile")
      .select("*")
      .eq("id", user.id)
      .single();
      
    // Only redirect if profile exists and check its properties
    if (profile) {
      const dashboardUrl = `${process.env.PROTOCOL}${process.env.DASHBOARD_URL}`
      if (!profile.active) {
        if (!profile.user_role) redirect(`${dashboardUrl}/onboarding`);
        if (!profile.date_of_birth || !profile.gender || !profile.image_path || !profile.name || !profile.username) redirect(`${dashboardUrl}/onboarding/step-2`);
        else redirect(`${dashboardUrl}/onboarding/step-3`);
      }
    }
    // If no profile exists, allow access to auth pages (user needs to complete signup)
  }

  return (
    <>
      <Image className="fixed pointer-events-none top-[5%] left-1/2 -translate-x-1/2" src={"/background/auth/bg.svg"} alt={"bg"} width={1000} height={1000} />
      <div className="absolute top-1/2 left-1/2 -translate-1/2 max-w-lg w-full">
        <Card className="mx-auto w-full bg-background/25 shadow-2xl border-text/10">
          {children}
        </Card>
      </div>
    </>
  );
}
