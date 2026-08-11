import type { ReactNode } from 'react'

import { Navigate } from 'react-router-dom'

import { LoadingScreen } from '@/components/LoadingScreen'
import { useAuthStore } from '@/store/useAuthStore'

interface RequireAuthProps {
  children: ReactNode
}

export function RequireAuth({ children }: RequireAuthProps) {
  const isInitialized = useAuthStore((state) => state.isInitialized)
  const user = useAuthStore((state) => state.user)

  if (!isInitialized) {
    return <LoadingScreen />
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}
