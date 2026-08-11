export interface Question {
  id: string
  text: string
}

export interface QuestionSet {
  topic: string
  questions: Question[]
}

export interface AnalysisResult {
  level: string
  strengths: string[]
  improvements: string[]
  repeatedPhrases: string[]
  suggestions: string[]
  sampleAnswer: string
  disclaimer: string
}

export type OnboardingPurpose = 'check_expected_score' | 'improve_speaking' | 'realistic_practice'

export type OnboardingMainProblem =
  | 'lack_realistic_practice'
  | 'hard_to_self_assess'
  | 'no_expert_feedback'
  | 'lack_practice_sets'

export type OnboardingExpectedFeature = 'goal_al' | 'goal_ih' | 'goal_im' | 'no_goal'

export interface Profile {
  id: string
  email: string | null
  onboarding_completed: boolean
  purpose: OnboardingPurpose | null
  main_problem: OnboardingMainProblem | null
  expected_feature: OnboardingExpectedFeature | null
}
