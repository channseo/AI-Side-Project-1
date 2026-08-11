import { useState } from 'react'

import { Link, useNavigate } from 'react-router-dom'

import { fetchProfile } from '@/api/profile'
import { supabase } from '@/api/supabase'
import { useProfileStore } from '@/store/useProfileStore'

export function SignUp() {
  const navigate = useNavigate()
  const setProfile = useProfileStore((state) => state.setProfile)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setIsSubmitting(true)
    setErrorMessage(null)
    setSuccessMessage(null)

    const { error, data } = await supabase.auth.signUp({ email, password })

    setIsSubmitting(false)

    if (error) {
      setErrorMessage(error.message)
      return
    }

    if (!data.session || !data.user) {
      setSuccessMessage('가입이 완료됐어요. 이메일함에서 인증 링크를 확인해주세요.')
      return
    }

    try {
      const profile = await fetchProfile(data.user.id)
      setProfile(profile)
      navigate(profile.onboarding_completed ? '/dashboard' : '/onboarding')
    } catch {
      setErrorMessage('프로필 정보를 불러오지 못했어요. 새로고침 후 다시 시도해주세요.')
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background px-5 py-16">
      <div className="w-full max-w-sm rounded-lg bg-surface p-6 shadow-card">
        <h1 className="text-center text-[28px] font-bold leading-tight text-ink">회원가입</h1>
        <p className="mt-2 text-center text-sm font-medium text-ink-secondary">
          이메일과 비밀번호로 계정을 만들어보세요.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="signup-email" className="text-sm font-bold text-ink">
              이메일
            </label>
            <input
              id="signup-email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="rounded-sm border border-border bg-surface px-4 py-3 text-base text-ink outline-none focus:border-primary focus:ring-2 focus:ring-primary-light"
              placeholder="you@example.com"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="signup-password" className="text-sm font-bold text-ink">
              비밀번호
            </label>
            <input
              id="signup-password"
              type="password"
              required
              minLength={6}
              autoComplete="new-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="rounded-sm border border-border bg-surface px-4 py-3 text-base text-ink outline-none focus:border-primary focus:ring-2 focus:ring-primary-light"
              placeholder="6자 이상 입력해주세요"
            />
          </div>

          {errorMessage && (
            <p className="rounded-sm bg-[#f3f3f3] px-4 py-3 text-sm text-danger">
              {errorMessage}
            </p>
          )}
          {successMessage && (
            <p className="rounded-sm bg-[#f3f3f3] px-4 py-3 text-sm text-success">
              {successMessage}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-2 rounded-full bg-primary px-8 py-4 text-lg font-bold text-white shadow-card transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? '가입 중...' : '회원가입'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm font-medium text-ink-secondary">
          이미 계정이 있으신가요?{' '}
          <Link to="/login" className="font-bold text-primary">
            로그인
          </Link>
        </p>
      </div>
    </main>
  )
}
