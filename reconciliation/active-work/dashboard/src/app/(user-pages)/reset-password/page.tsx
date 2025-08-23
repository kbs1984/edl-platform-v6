import { resetPasswordAction } from "@/lib/actions/auth-actions";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { PasswordInput } from "@/components/ui/password";

export default async function ResetPassword(props: {
  searchParams: Promise<Message>;
}) {
  const searchParams = await props.searchParams;
  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 max-w-lg w-full">
      <Card className="mx-auto w-full bg-background/25 shadow-2xl border-foreground/10">
        <form className="flex flex-col w-full p-4 gap-2">
          <h1 className="text-2xl font-medium pl-1">Reset password</h1>
          <p className="text-sm text-foreground/60 pl-1">
            Please enter your new password below.
          </p>
          <PasswordInput
            type="password"
            name="password"
            placeholder="New password"
            className="mt-4"
            required
          />
          <Input
            type="password"
            name="confirmPassword"
            placeholder="Confirm password"
            className="mt-4"
            required
          />
          <SubmitButton formAction={resetPasswordAction} className="mt-5">
            Reset password
          </SubmitButton>
          <FormMessage message={searchParams} />
        </form>
      </Card>
    </div>
  );
}
