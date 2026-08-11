import { useEffect, useState } from 'react'

import { supabase } from '@/api/supabase'
import { useAuthStore } from '@/store/useAuthStore'

import type { PostgrestError } from '@supabase/supabase-js'

import type { Profile } from '@/types'

const PROFILE_COLUMNS = 'id, email, onboarding_completed, purpose, main_problem, expected_feature'

type ProfileQueryStatus = 'loading' | 'success' | 'empty' | 'error'

export type UseProfileResult =
  | { status: 'loading'; profile: null; error: null }
  | { status: 'success'; profile: Profile; error: null }
  | { status: 'empty'; profile: null; error: null }
  | { status: 'error'; profile: null; error: PostgrestError }

export function useProfile(): UseProfileResult {
  const user = useAuthStore((state) => state.user)

  const [status, setStatus] = useState<ProfileQueryStatus>('loading')
  const [profile, setProfile] = useState<Profile | null>(null)
  const [error, setError] = useState<PostgrestError | null>(null)

  useEffect(() => {
    if (!user) {
      setStatus('loading')
      setProfile(null)
      setError(null)
      return
    }

    let isCancelled = false
    setStatus('loading')
    setError(null)

    supabase
      .from('profiles')
      .select(PROFILE_COLUMNS)
      .eq('id', user.id)
      .maybeSingle()
      .returns<Profile>()
      .then(({ data, error: queryError }) => {
        if (isCancelled) return

        if (queryError) {
          setStatus('error')
          setError(queryError)
          setProfile(null)
          return
        }

        if (!data) {
          setStatus('empty')
          setProfile(null)
          return
        }

        setProfile(data)
        setStatus('success')
      })

    return () => {
      isCancelled = true
    }
  }, [user])

  if (status === 'success' && profile) {
    return { status: 'success', profile, error: null }
  }

  if (status === 'error' && error) {
    return { status: 'error', profile: null, error }
  }

  if (status === 'empty') {
    return { status: 'empty', profile: null, error: null }
  }

  return { status: 'loading', profile: null, error: null }
}
