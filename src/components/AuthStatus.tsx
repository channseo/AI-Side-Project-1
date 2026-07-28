import { useState } from 'react'

import { Link } from 'react-router-dom'

import { supabase } from '@/api/supabase'
import { useAuthStore } from '@/store/useAuthStore'

export function AuthStatus() {
  const user = useAuthStore((state) => state.user)
  const isInitialized = useAuthStore((state) => state.isInitialized)
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleLogout = async () => {
    setIsLoggingOut(true)
    await supabase.auth.signOut()
    setIsLoggingOut(false)
  }

  if (!isInitialized) {
    return (
      <div
        className="invisible flex items-center justify-end gap-4 px-5 py-4 text-sm font-bold"
        aria-hidden="true"
      >
        <span>로그인</span>
        <span>회원가입</span>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex items-center justify-end gap-4 px-5 py-4 text-sm font-bold">
        <Link to="/login" className="text-ink-secondary">
          로그인
        </Link>
        <Link to="/signup" className="text-primary">
          회원가입
        </Link>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-end gap-4 px-5 py-4 text-sm">
      <span className="font-medium text-ink-secondary">{user.email}</span>
      <button
        type="button"
        onClick={handleLogout}
        disabled={isLoggingOut}
        className="rounded-full border-2 border-primary px-4 py-1.5 font-bold text-primary transition hover:bg-primary-light disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isLoggingOut ? '로그아웃 중...' : '로그아웃'}
      </button>
    </div>
  )
}
