import { GuardianForm } from "@/components/onboarding/guardian-form";
import { JudgeForm } from "@/components/onboarding/judge-form";
import { StudentForm } from "@/components/onboarding/student-form";
import { Steps } from "@/components/ui/steps";
import { getProfile } from "@/utils/get-user-info";
import { redirect } from "next/navigation";


export default async function Page() {
  const profile = await getProfile();
  if (!profile.user_role) redirect("/onboarding/step-1");
  if (!profile.name) redirect("/onboarding/step-2");
  
  return (
    <>
      <Steps current={2} steps={["Step 1", "Step 2", "Step 3"]} />
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-8">Enter additional information</h2>
        { profile.user_role === "STUDENT" ? (
          <StudentForm />
        ) : profile.user_role === "GUARDIAN" ? (
          <GuardianForm />
        ) : (
          <JudgeForm />
        )}
      </div>
    </>
  );
}
