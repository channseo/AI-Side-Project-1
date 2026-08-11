import type { OnboardingPurpose } from '@/types'

const DEFAULT_DASHBOARD_GREETING = 'OPIC 말하기 연습, 지금 시작해보세요'

const purposeGreetings: Record<OnboardingPurpose, string> = {
  check_expected_score: '지금 실력이면 어느 레벨일지 확인해보세요',
  improve_speaking: '강점과 개선점을 짚어드릴게요',
  realistic_practice: '실전처럼 3문제, 바로 연습해보세요',
}

export function getDashboardGreeting(purpose: OnboardingPurpose | null | undefined): string {
  if (!purpose) return DEFAULT_DASHBOARD_GREETING
  return purposeGreetings[purpose] ?? DEFAULT_DASHBOARD_GREETING
}
