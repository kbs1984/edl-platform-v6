import { forgotPasswordAction } from "@/lib/action/auth-actions";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";

export default async function ForgotPassword(props: {
  searchParams: Promise<Message>;
}) {
  const searchParams = await props.searchParams;
  return (
    <form className="flex flex-col p-4">
      <div>
        <h1 className="text-2xl font-medium">Reset Password</h1>
        <p className="text-sm text-secondary-foreground">
          Please enter your e-mail for recovery instruction
        </p>
      </div>
      <div className="flex flex-col gap-2 mt-2">
        <Input name="email" placeholder="Your email" required />
        <SubmitButton formAction={forgotPasswordAction} className="mt-4">
          Reset Password
        </SubmitButton>
        <FormMessage message={searchParams} />
      </div>
    </form>
  );
}
