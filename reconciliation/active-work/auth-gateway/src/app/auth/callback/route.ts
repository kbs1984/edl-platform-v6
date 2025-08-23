import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  // The `/auth/callback` route is required for the server-side auth flow implemented
  // by the SSR package. It exchanges an auth code for the user's session.
  // https://supabase.com/docs/guides/auth/server-side/nextjs
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const redirectTo = requestUrl.searchParams.get("redirect_to")?.toString();

  if (code) {
    const supabase = await createClient();
    await supabase.auth.exchangeCodeForSession(code);
  }
  
  // 토큰 루트페이지 전파
  const cookieStore = await cookies();
  cookieStore.getAll().forEach((token) => {
    if (token.name.includes("bbrheacetxlnqbibjwsz")) // EDL Platform project
    cookieStore.set(token.name, token.value, {
      httpOnly: true,
      path: "/",
      domain: `.${process.env.ROOT_URL}`,
    });
  });
  

  if (redirectTo) {
    return NextResponse.redirect(`${process.env.PROTOCOL}${process.env.DASHBOARD_URL}${redirectTo}`);
  }

  // URL to redirect to after sign up process completes
  return NextResponse.redirect(`${process.env.PROTOCOL}${process.env.DASHBOARD_URL}/onboarding`);
}
