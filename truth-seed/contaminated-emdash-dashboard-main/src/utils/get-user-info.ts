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
    redirect(`${process.env.PROTOCOL}${process.env.AUTH_URL}`)
  }
  const id = userId ?? user.id

  const { data: profile, error: profileError } = await supabase
    .from('profile')
    .select('*')
    .eq('id', id)
    .single()

  if (profileError || !profile) {
    throw new Error(profileError?.message || '프로필을 가져올 수 없습니다.')
  }

  return profile
})
