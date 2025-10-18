'use client'

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'

type AuthContextType = {
  isAppAuthenticated: boolean
  login: () => void
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

  // Check for saved auth state on mount
  useEffect(() => {
    const savedAuthState = localStorage.getItem('frutero-app-auth')
    if (savedAuthState === 'true') {
      setIsAppAuthenticated(true)
    }
  }, [])

  const login = () => {
    setIsAppAuthenticated(true)
    localStorage.setItem('frutero-app-auth', 'true')
  }

  const logout = () => {
    setIsAppAuthenticated(false)
    localStorage.removeItem('frutero-app-auth')
  }

  return (
    <AuthContext.Provider value={{ isAppAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}