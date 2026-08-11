import { supabase } from '@/api/supabase'

import type {
  OnboardingExpectedFeature,
  OnboardingMainProblem,
  OnboardingPurpose,
  Profile,
} from '@/types'

export interface OnboardingSubmission {
  purpose: OnboardingPurpose
  mainProblem: OnboardingMainProblem
  expectedFeature: OnboardingExpectedFeature
}

export async function saveOnboardingAnswers(
  userId: string,
  answers: OnboardingSubmission
): Promise<Profile> {
  const { data, error } = await supabase
    .from('profiles')
    .update({
      purpose: answers.purpose,
      main_problem: answers.mainProblem,
      expected_feature: answers.expectedFeature,
      onboarding_completed: true,
      updated_at: new Date().toISOString(),
    })
    .eq('id', userId)
    .select('id, email, onboarding_completed, purpose, main_problem, expected_feature')
    .single()
    .returns<Profile>()

  if (error) {
    throw error
  }

  return data
}
