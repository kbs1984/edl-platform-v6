import { signUpAction } from "@/lib/action/auth-actions";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password";
import Image from "next/image";
import { SocialLoginButton } from "@/components/ui/social-login-button";
import { Divider } from "@/components/ui/Divider";

export default async function Signup(props: {
  searchParams: Promise<Message>;
}) {
  const searchParams = await props.searchParams;
  if ("message" in searchParams) {
    return (
      <div className="w-full flex-1 flex items-center h-screen sm:max-w-md justify-center gap-2 p-4">
        <FormMessage message={searchParams} />
      </div>
    );
  }

  return (
    <div>
      <form action={signUpAction} className="flex flex-col p-4">
        <h1 className="text-3xl font-medium mt-4 ml-4 flex items-center justify-start gap-3"> 
          <Image src={"/logos/white_emdash.svg"} alt={"logo"} width={40} height={40} /> 
          Create an account
        </h1>
        <div className="flex flex-col gap-2 [&>input]:mb-3 mt-8">
          <Input name="email" placeholder="Your email *" required />
          <PasswordInput
            name="password"
            placeholder="Your password *"
            required
          />
          <Input
            type="password"
            name="confirm"
            placeholder="Confirm your password *"
            required
          />
          <SubmitButton pendingText="Signing up..." className="mt-8 h-12">
            Sign up
          </SubmitButton>
          <FormMessage message={searchParams} />
        </div>
      </form>
      <Divider text="or" />
      <div className="p-4 space-y-4 mt-3">
        <SocialLoginButton type="Google" />
        <SocialLoginButton type="Kakao" />
      </div>
    </div>
  );
}
