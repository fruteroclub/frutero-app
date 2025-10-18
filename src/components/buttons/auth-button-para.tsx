'use client'

import { type Dispatch, type SetStateAction } from 'react'
import {
  useModal, // Modal control hook
  useWallet, // Wallet info hook
  useAccount, // Account connection hook
  useCreateGuestWalletsState, // Guest wallet creation state
} from '@getpara/react-sdk'
import { useAppAuth } from '@/store/auth-context'
import { toast } from 'sonner'
import { Button } from '../ui/button'
import { cn } from '@/lib/utils'

type AuthButtonProps = {
  children?: React.ReactNode
  className?: string
  size?: 'default' | 'sm' | 'lg' | 'xl' | 'icon' | null | undefined
  setIsMenuOpen?: Dispatch<SetStateAction<boolean>>
}

export default function AuthButtonPara({
  children,
  className,
  size = 'default',
  setIsMenuOpen,
}: AuthButtonProps) {
  // App-level auth state
  const {
    isAppAuthenticated,
    login: appLogin,
    logout: appLogout,
  } = useAppAuth()

  // Para SDK Hooks
  const { openModal } = useModal() // Modal management
  const { data: wallet, isLoading: walletLoading } = useWallet() // Wallet info
  const { isConnected, connectionType, embedded } = useAccount() // Connection status
  const { isPending: isCreatingGuestWallets, error: guestWalletError } =
    useCreateGuestWalletsState() // Guest wallet state

  // Handle opening Para modal and app login
  function handleAuth() {
    if (!isAppAuthenticated) {
      // If not app-authenticated, just log them into the app
      // Para wallet should already be connected from previous sessions
      appLogin({
        id: '123',
        username: 'test',
        displayName: 'test',
        email: 'test@test.com',
        bio: 'test',
        website: 'test',
        avatarUrl: 'test',
        bannerUrl: 'test',
        profile: null,
        isAdmin: false,
      })
      setIsMenuOpen?.(false)
      toast.success('¡Bienvenido de vuelta!')
    } else {
      // If already app-authenticated, open Para modal for wallet management
      openModal()
      setIsMenuOpen?.(false)
    }
  }

  // Handle app logout (keeps Para wallet connected)
  function handleLogout() {
    appLogout()
    setIsMenuOpen?.(false)
    toast.success('Sesión cerrada correctamente')
  }

  // Show guest wallet creation error if any
  if (guestWalletError) {
    console.error('Error creating guest wallets:', guestWalletError)
    toast.error('Error al crear billetera de invitado')
  }

  // Display wallet info when app-authenticated and Para connected
  if (isAppAuthenticated && isConnected && wallet) {
    const isGuest = connectionType === 'embedded' && !embedded?.email

    return (
      <div className="flex items-center gap-2">
        <span className="text-sm">
          {/* Use Para's display address method */}
          {wallet.id ? `${wallet.id.slice(0, 6)}...${wallet.id.slice(-4)}` : ''}
          {isGuest && (
            <span className="ml-1 text-xs text-muted-foreground">
              (Invitado)
            </span>
          )}
        </span>
        <Button
          onClick={handleAuth} // Open modal for wallet management
          size="sm"
          variant="outline"
          className="font-funnel font-medium"
        >
          Gestionar
        </Button>
        <Button
          onClick={handleLogout} // App logout functionality
          size="sm"
          variant="ghost"
          className="font-funnel font-medium text-muted-foreground hover:text-foreground"
        >
          Salir
        </Button>
      </div>
    )
  }

  // Loading state (wallet loading or creating guest wallets)
  if (walletLoading || isCreatingGuestWallets) {
    return (
      <Button disabled size={size} className={className}>
        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-b-2 border-current"></div>
        {isCreatingGuestWallets ? 'Creando billetera...' : 'Cargando...'}
      </Button>
    )
  }

  // Show appropriate button based on Para connection and app auth state
  if (!isConnected || !wallet) {
    // Para not connected - need to create/connect wallet first
    return (
      <Button
        onClick={() => {
          openModal()
          setIsMenuOpen?.(false)
        }}
        size={size}
        className={cn('font-funnel font-medium', className)}
      >
        {children || 'Únete'}
      </Button>
    )
  }

  // Para connected but not app-authenticated - show login button
  return (
    <Button
      onClick={handleAuth}
      size={size}
      className={cn('font-funnel font-medium', className)}
    >
      {children || 'Entrar'}
    </Button>
  )
}
