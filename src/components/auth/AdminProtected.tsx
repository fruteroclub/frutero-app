'use client'

import { ReactNode } from 'react'
import { useAppAuth } from '@/store/auth-context'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Shield, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface AdminProtectedProps {
  children: ReactNode
  fallback?: ReactNode
  redirectTo?: string
}

/**
 * Wrapper component that protects admin-only content
 * Shows loading state while checking auth, then shows unauthorized or children
 */
export function AdminProtected({
  children,
  fallback,
  redirectTo = '/jam/dashboard',
}: AdminProtectedProps) {
  const { user, isLoading, isAppAuthenticated } = useAppAuth()

  // Loading state
  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="space-y-4 text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-foreground">Verificando permisos...</p>
        </div>
      </div>
    )
  }

  // Not authenticated
  if (!isAppAuthenticated || !user) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Alert variant="destructive" className="max-w-md">
          <Shield className="h-4 w-4" />
          <AlertDescription className="space-y-3">
            <p>Debes iniciar sesión para acceder a esta página.</p>
            <Button variant="outline" size="sm" asChild>
              <Link href="/jam/dashboard">Ir al Dashboard</Link>
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  // Not admin
  if (!user.isAdmin) {
    if (fallback) {
      return <>{fallback}</>
    }

    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Alert variant="destructive" className="max-w-md">
          <Shield className="h-4 w-4" />
          <AlertDescription className="space-y-3">
            <p>
              No tienes permisos de administrador para acceder a esta página.
            </p>
            <Button variant="outline" size="sm" asChild>
              <Link href={redirectTo}>Volver</Link>
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  // Is admin - show protected content
  return <>{children}</>
}
