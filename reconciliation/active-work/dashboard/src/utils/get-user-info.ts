"use server";

import { cache } from 'react'
import { createServerClient } from './supabase/server'
import { redirect } from 'next/navigation'
import { Profile } from '@/types'

export const getProfile = cache(async (userId?: string): Promise<Profile> => {
  const supabase = await createServerClient()

  const {
    data: { user },
    error: authError
  } = await supabase.auth.getUser()
  if (authError || !user) {
    // Use the auth gateway URL directly - environment variables might not be set
    const authUrl = process.env.AUTH_URL 
      ? `${process.env.PROTOCOL || 'https://'}${process.env.AUTH_URL}`
      : 'https://auth-gateway-jc769uf9c-briankims-projects.vercel.app/login';
    redirect(authUrl)
  }
  const id = userId ?? user.id

  const { data: profile, error: profileError } = await supabase
    .from('profile')
    .select('*')
    .eq('id', id)
    .single()

  if (profileError || !profile) {
    // If profile doesn't exist, redirect to onboarding instead of throwing error
    console.log('Profile not found for user:', id, 'Redirecting to onboarding')
    redirect('/onboarding')
  }

  return profile
})
