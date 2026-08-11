import { Navigate } from 'react-router-dom'

import { LoadingScreen } from '@/components/LoadingScreen'
import { useProfile } from '@/hooks/useProfile'
import { getDashboardGreeting } from '@/utils/personalization'

export function Dashboard() {
  const { status, profile, error } = useProfile()

  if (status === 'loading') {
    return <LoadingScreen />
  }

  if (status === 'error') {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background px-5">
        <p className="text-sm font-medium text-ink-secondary">
          프로필 정보를 불러오지 못했어요. {error.message}
        </p>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="rounded-full bg-primary px-6 py-3 text-base font-bold text-white shadow-card transition hover:bg-primary-hover"
        >
          새로고침
        </button>
      </main>
    )
  }

  if (status === 'empty' || !profile.onboarding_completed) {
    return <Navigate to="/onboarding" replace />
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background px-5 py-16">
      <div className="w-full max-w-md rounded-lg bg-surface p-6 shadow-card">
        <h1 className="text-[28px] font-bold leading-tight text-ink md:text-[32px]">
          {profile.email}님, 환영해요!
        </h1>
        <p className="mt-2 text-sm font-medium text-ink-secondary">
          {getDashboardGreeting(profile.purpose)}
        </p>
      </div>
    </main>
  )
}
