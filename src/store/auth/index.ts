import { create } from 'zustand'

type LoginStatus = boolean | 'loading'

interface AuthStore {
  isLoggedIn: LoginStatus
  setIsLoggedIn: (isLoggedIn: LoginStatus) => void
}

export const useAuthStore = create<AuthStore>(set => ({
  isLoggedIn: 'loading',
  setIsLoggedIn: (isLoggedIn: LoginStatus) => set({ isLoggedIn }),
}))
