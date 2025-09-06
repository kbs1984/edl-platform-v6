import { signOutAction } from "@/lib/action/auth-actions";
import Link from "next/link";
import { Button } from "./ui/button";
import { getUser } from "@/lib/get-user";
// 라이트모드는 나중에
// import { ThemeSwitcher } from "./theme-switcher";

export async function Header() {
  const user = await getUser();

  return user ? (
    <div className="flex items-center justify-end w-full gap-4">
      {/* <ThemeSwitcher /> */}
      Hey, {user.email}!
      <form action={signOutAction}>
        <Button type="submit" variant={"outline"}>
          Sign out
        </Button>
      </form>
    </div>
  ) : (
    <div className="flex gap-2 justify-end w-full">
      <Button asChild size="sm" variant={"outline"}>
        <Link href="/login">Login</Link>
      </Button>
      <Button asChild size="sm" variant={"default"}>
        <Link href="/sign-up">Sign up</Link>
      </Button>
      {/* <ThemeSwitcher /> */}
    </div>
  );
}
