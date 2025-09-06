// Session 00082: Auth callback handler for dashboard
// Handles the redirect from auth server after login

import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/utils/supabase/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const error = requestUrl.searchParams.get('error')
  
  // Handle errors from auth
  if (error) {
    console.error('Auth callback error:', error)
    const errorCode = requestUrl.searchParams.get('error_code')
    const errorDescription = requestUrl.searchParams.get('error_description')
    
    // Redirect to login with error message
    return NextResponse.redirect(
      new URL(`/auth/login?error=${error}&error_code=${errorCode}&error_description=${errorDescription}`, requestUrl.origin)
    )
  }

  if (code) {
    const supabase = await createServerClient()
    
    try {
      // Exchange the code for a session
      const { error: sessionError } = await supabase.auth.exchangeCodeForSession(code)
      
      if (sessionError) {
        console.error('Session exchange error:', sessionError)
        return NextResponse.redirect(
          new URL('/auth/login?error=session_exchange_failed', requestUrl.origin)
        )
      }

      // Check if user needs onboarding
      const { data: { user } } = await supabase.auth.getUser()
      
      if (user) {
        // Check if profile exists and is complete
        const { data: profile } = await supabase
          .from('profile')
          .select('username, name')
          .eq('id', user.id)
          .single()

        // If no username, redirect to onboarding
        if (!profile?.username) {
          return NextResponse.redirect(new URL('/onboarding', requestUrl.origin))
        }
        
        // Otherwise go to dashboard home
        return NextResponse.redirect(new URL('/profiles', requestUrl.origin))
      }
    } catch (error) {
      console.error('Callback processing error:', error)
      return NextResponse.redirect(
        new URL('/auth/login?error=callback_failed', requestUrl.origin)
      )
    }
  }

  // No code provided, redirect to login
  return NextResponse.redirect(new URL('/auth/login', requestUrl.origin))
}