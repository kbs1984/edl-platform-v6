import { Card } from "@/components/ui/card";
import { Onboarding2InputForm } from "@/components/onboarding-step-2-form";
import { Steps } from "@/components/ui/steps";
import { getProfile } from "@/utils/get-user-info";
import { redirect } from "next/navigation";


export default async function Page() {
  const profile = await getProfile();
  
  if (!profile.user_role) redirect("/onboarding/step-1");
  
  return (
    <>
      <Steps current={1} steps={["Step 1", "Step 2", "Step 3"]} />
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">Enter your personal information</h2>
      </div>
      <Onboarding2InputForm profile={profile} />
    </>
  );
}
