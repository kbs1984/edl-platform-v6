import { ButtonProps } from "@/components/ui/button";
import { GraduationCap, Scale, ShieldCheck } from "lucide-react";
import { createServerClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Steps } from "@/components/ui/steps";
import { SubmitButton } from "@/components/submit-button";
import { getProfile } from "@/utils/get-user-info";

const RoleSelectButton = async ({className, ...props}: ButtonProps) => {
  const profile = await getProfile();
  return (
    <div>
      <input type="radio" id={props.id} name="role" className="peer hidden" value={props.id?.toUpperCase()} defaultChecked={props.id?.toUpperCase() === profile.user_role} />
      <label htmlFor={props.id} className="
        text-foreground border-2 border-foreground 
        flex flex-col w-40 h-40 bg-transparent center rounded-lg
        peer-checked:bg-primary peer-checked:text-primary-foreground peer-checked:border-primary 
        hover:bg-foreground hover:text-background 
        transition-colors cursor-pointer duration-300
      ">
        {props.children}
      </label>
    </div>
  );
}
export default function Page() {
  const onSubmit = async (formData: FormData) => {
    "use server"
    const role = formData.get("role");
    const supabase = await createServerClient();
    const { data: { user } } = await supabase.auth.getUser();
  
    const { error } = await supabase
      .from("profile")
      .update({ user_role: role })
      .eq('id', user!.id);
    
    if (error) console.error(error);
    redirect("/onboarding/step-2");
  };
  
  return (
    <form className="w-full">
      <Steps current={0} steps={["Step 1", "Step 2", "Step 3"]} />
      <div className="flex flex-col min-w-64 max-w-2xl mx-auto center w-[90%] px-10">
        <h1 className="text-2xl font-medium">What is your role?</h1>
        <h2 className="text-xl font-medium mt-4">Please, choose the current role</h2>
        <div className="flex mt-16 gap-8 center">
          <RoleSelectButton className="hover:bg-foreground text-white hover:text-background" id="student">
            <GraduationCap strokeWidth={1} className="w-20 h-20" />
            Student
          </RoleSelectButton>
          <RoleSelectButton className="hover:bg-foreground text-white hover:text-background" id="judge">
            <Scale strokeWidth={1} className="w-20 h-20" />
            Judge
          </RoleSelectButton>
          <RoleSelectButton className="hover:bg-foreground text-white hover:text-background" id="guardian">
            <ShieldCheck strokeWidth={1} className="w-20 h-20" />
            Guardian
          </RoleSelectButton>
        </div>
        <SubmitButton className="flex mt-12 self-end" formAction={onSubmit}>
          Next Step
        </SubmitButton>
      </div>
    </form>
  );
}
