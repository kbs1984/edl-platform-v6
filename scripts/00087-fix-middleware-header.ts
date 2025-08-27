// Session 00087: Fix for Middleware Authentication Header
// This fixes the redirect loop by properly setting the x-user-authenticated header
// 
// REPLACE the content of:
// truth-seed/emdash-dashboard-main/src/utils/supabase/middleware.ts
// 
// The bug: updateSession never sets the header that middleware checks

import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

export const updateSession = async (request: NextRequest) => {
  try {
    // Create an unmodified response
    let response = NextResponse.next({
      request: {
        headers: request.headers,
      },
    });

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) =>
              request.cookies.set(name, value),
            );
            response = NextResponse.next({
              request,
            });
            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options),
            );
          },
        },
      },
    );

    // This will refresh session if expired - required for Server Components
    // https://supabase.com/docs/guides/auth/server-side/nextjs
    const user = await supabase.auth.getUser();

    // *** SESSION 00087 FIX: Set the authentication header ***
    // This header is checked by middleware.ts line 47
    // Without this, authenticated users get stuck in redirect loop
    if (!user.error && user.data?.user) {
      response.headers.set('x-user-authenticated', 'true');
      
      // Optional: Add more user info to headers for debugging
      response.headers.set('x-user-id', user.data.user.id);
      response.headers.set('x-user-email', user.data.user.email || '');
    }

    // protected routes (keeping original logic)
    if (request.nextUrl.pathname.startsWith("/protected") && user.error) {
      return NextResponse.redirect(new URL("/sign-in", request.url));
    }

    if (request.nextUrl.pathname === "/" && !user.error) {
      return NextResponse.redirect(new URL("/protected", request.url));
    }

    return response;
  } catch (e) {
    // If you are here, a Supabase client could not be created!
    // This is likely because you have not set up environment variables.
    console.error('Supabase client creation failed:', e);
    return NextResponse.next({
      request: {
        headers: request.headers,
      },
    });
  }
};