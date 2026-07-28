import { useEffect } from 'react'

import { supabase } from '@/api/supabase'
import { useAuthStore } from '@/store/useAuthStore'

export function useAuthSession() {
  const setSession = useAuthStore((state) => state.setSession)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [setSession])
}
