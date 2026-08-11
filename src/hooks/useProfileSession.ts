import { useEffect } from 'react'

import { fetchProfile } from '@/api/profile'
import { useAuthStore } from '@/store/useAuthStore'
import { useProfileStore } from '@/store/useProfileStore'

export function useProfileSession() {
  const user = useAuthStore((state) => state.user)
  const isInitialized = useAuthStore((state) => state.isInitialized)
  const setProfile = useProfileStore((state) => state.setProfile)
  const setStatus = useProfileStore((state) => state.setStatus)
  const reset = useProfileStore((state) => state.reset)

  useEffect(() => {
    if (!isInitialized) return

    if (!user) {
      reset()
      return
    }

    let isCancelled = false
    setStatus('loading')

    fetchProfile(user.id)
      .then((profile) => {
        if (!isCancelled) setProfile(profile)
      })
      .catch(() => {
        if (!isCancelled) setStatus('error')
      })

    return () => {
      isCancelled = true
    }
  }, [user, isInitialized, setProfile, setStatus, reset])
}
