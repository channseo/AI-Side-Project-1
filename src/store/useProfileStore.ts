import { create } from 'zustand'

import type { Profile } from '@/types'

export type ProfileStatus = 'idle' | 'loading' | 'loaded' | 'error'

interface ProfileState {
  profile: Profile | null
  status: ProfileStatus
  setProfile: (profile: Profile) => void
  setStatus: (status: ProfileStatus) => void
  reset: () => void
}

export const useProfileStore = create<ProfileState>((set) => ({
  profile: null,
  status: 'idle',
  setProfile: (profile) => set({ profile, status: 'loaded' }),
  setStatus: (status) => set({ status }),
  reset: () => set({ profile: null, status: 'idle' }),
}))
