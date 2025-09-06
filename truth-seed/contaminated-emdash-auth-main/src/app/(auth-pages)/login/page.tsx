import { loginAction } from "@/lib/action/auth-actions";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import Image from "next/image";
import { Divider } from "@/components/ui/Divider";
import { SocialLoginButton } from "@/components/ui/social-login-button";

export default async function Login(props: { searchParams: Promise<Message> }) {
  const searchParams = await props.searchParams;
  return (
    <div>
      <form className="flex-1 flex flex-col p-4">
        <h1 className="text-3xl font-medium mt-4 ml-4 flex items-center justify-start gap-3"> 
          <Image src={"/logos/white_emdash.svg"} alt={"logo"} width={40} height={40} /> 
          Welcome Back!
        </h1>
        <div className="flex flex-col gap-2 [&>input]:mb-3 mt-4">
          <Input name="email" placeholder="Your email" required />
          <Input
            type="password"
            name="password"
            placeholder="Your password"
            required
          />
          <div className="flex justify-between items-center mt-2">
            <FormMessage message={searchParams} />
            <Link className="text-xs text-foreground underline min-w-32 cursor-pointer" href="/forgot-password">
              Forgot Password?
            </Link>
          </div>
          <SubmitButton pendingText="Logging In..." formAction={loginAction} className="mt-4 h-12">
            Login
          </SubmitButton>
          <div className="flex justify-center items-center w-full pl-2 mt-4">
            <p className="text-sm text-foreground">
              Don't have an account?{" "}
              <Link className="text-foreground font-medium underline" href="/sign-up">
                Sign up
              </Link>
            </p>
          </div>
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
