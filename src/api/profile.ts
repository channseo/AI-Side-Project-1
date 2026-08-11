import { supabase } from '@/api/supabase'

import type { Profile } from '@/types'

const PROFILE_COLUMNS = 'id, email, onboarding_completed, purpose, main_problem, expected_feature'

export async function fetchProfile(userId: string): Promise<Profile> {
  const { data, error } = await supabase
    .from('profiles')
    .select(PROFILE_COLUMNS)
    .eq('id', userId)
    .single()
    .returns<Profile>()

  if (error) {
    throw error
  }

  return data
}
