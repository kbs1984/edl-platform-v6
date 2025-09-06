// Session 00076: Missing Root Middleware for Auth Protection
// This file should be placed at:
// - truth-seed/emdash-auth-main/src/middleware.ts
// - truth-seed/emdash-dashboard-main/src/middleware.ts

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { updateSession } from '@/utils/supabase/middleware'

export async function middleware(request: NextRequest) {
  // Update the session (this refreshes tokens if needed)
  const response = await updateSession(request)
  
  // Get the pathname for route protection
  const { pathname } = request.nextUrl
  
  // Define public routes that don't need auth
  const publicRoutes = [
    '/auth/login',
    '/sign-up',
    '/forgot-password',
    '/auth/callback',
    '/thank-you',
    '/' // Landing page
  ]
  
  // Define protected route patterns
  const protectedPatterns = [
    '/profiles',
    '/groups',
    '/debate',
    '/settings',
    '/onboarding'
  ]
  
  // Check if current path is public
  const isPublicRoute = publicRoutes.some(route => 
    pathname === route || pathname.startsWith(`${route}/`)
  )
  
  // Check if current path needs protection
  const isProtectedRoute = protectedPatterns.some(pattern =>
    pathname.startsWith(pattern)
  )
  
  // If protected route and no session, redirect to auth server
  if (isProtectedRoute && !response.headers.get('x-user-authenticated')) {
    // Redirect to auth server on port 3000, not the dashboard itself
    const authUrl = process.env.NEXT_PUBLIC_AUTH_URL || 'http://localhost:3000'
    const redirectUrl = new URL('/login', authUrl)
    redirectUrl.searchParams.set('redirectTo', `http://localhost:3001${pathname}`)
    return NextResponse.redirect(redirectUrl)
  }
  
  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}