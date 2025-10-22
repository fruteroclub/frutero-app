'use client'

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import type { UserWithProfile } from '@/types/user'

type AuthContextType = {
  isAppAuthenticated: boolean
  user: UserWithProfile | null
  isLoading: boolean
  isOnboardingComplete: boolean
  login: (user: UserWithProfile) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAppAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAppAuth must be used within an AuthProvider')
  }
  return context
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAppAuthenticated, setIsAppAuthenticated] = useState(false)
  const [user, setUser] = useState<UserWithProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Check for saved auth state and user on mount
  useEffect(() => {
    const savedAuthState = localStorage.getItem('frutero-app-auth')
    const savedUser = localStorage.getItem('frutero-user')

    if (savedAuthState === 'true' && savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser) as UserWithProfile
        setIsAppAuthenticated(true)
        setUser(parsedUser)
      } catch (error) {
        console.error('Failed to parse saved user:', error)
        // Clear invalid data
        localStorage.removeItem('frutero-app-auth')
        localStorage.removeItem('frutero-user')
      }
    }

    setIsLoading(false)
  }, [])

  const login = (userData: UserWithProfile) => {
    setIsAppAuthenticated(true)
    setUser(userData)
    localStorage.setItem('frutero-app-auth', 'true')
    localStorage.setItem('frutero-user', JSON.stringify(userData))
  }

  const logout = () => {
    setIsAppAuthenticated(false)
    setUser(null)
    // Clear all app-related localStorage keys
    localStorage.removeItem('frutero-app-auth')
    localStorage.removeItem('frutero-user')
    localStorage.removeItem('jam-onboarding-draft')
  }

  const isOnboardingComplete = !!(user?.onboardingCompletedAt)

  return (
    <AuthContext.Provider value={{ isAppAuthenticated, user, isLoading, isOnboardingComplete, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}