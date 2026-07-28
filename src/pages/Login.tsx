import { useState } from 'react'

import { Link, useNavigate } from 'react-router-dom'

import { supabase } from '@/api/supabase'

export function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setIsSubmitting(true)
    setErrorMessage(null)

    const { error } = await supabase.auth.signInWithPassword({ email, password })

    setIsSubmitting(false)

    if (error) {
      setErrorMessage(error.message)
      return
    }

    navigate('/')
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background px-5 py-16">
      <div className="w-full max-w-sm rounded-lg bg-surface p-6 shadow-card">
        <h1 className="text-center text-[28px] font-bold leading-tight text-ink">로그인</h1>
        <p className="mt-2 text-center text-sm font-medium text-ink-secondary">
          계정으로 로그인해주세요.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="login-email" className="text-sm font-bold text-ink">
              이메일
            </label>
            <input
              id="login-email"
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
            <label htmlFor="login-password" className="text-sm font-bold text-ink">
              비밀번호
            </label>
            <input
              id="login-password"
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="rounded-sm border border-border bg-surface px-4 py-3 text-base text-ink outline-none focus:border-primary focus:ring-2 focus:ring-primary-light"
              placeholder="비밀번호"
            />
          </div>

          {errorMessage && (
            <p className="rounded-sm bg-[#f3f3f3] px-4 py-3 text-sm text-danger">
              {errorMessage}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-2 rounded-full bg-primary px-8 py-4 text-lg font-bold text-white shadow-card transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? '로그인 중...' : '로그인'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm font-medium text-ink-secondary">
          계정이 없으신가요?{' '}
          <Link to="/signup" className="font-bold text-primary">
            회원가입
          </Link>
        </p>
      </div>
    </main>
  )
}
