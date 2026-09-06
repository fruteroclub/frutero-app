'use client'

import { type Dispatch, type SetStateAction, useState } from 'react'
import { toast } from 'sonner'
import { Button } from '../ui/button'
import { cn } from '@/lib/utils'

type AuthButtonProps = {
  children?: React.ReactNode
  className?: string
  size?: 'default' | 'sm' | 'lg' | 'xl' | 'icon' | null | undefined
  setIsMenuOpen?: Dispatch<SetStateAction<boolean>>
}

export default function AuthButton({
  children,
  className,
  size = 'default',
  setIsMenuOpen,
}: AuthButtonProps) {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  function login() {
    if (!isLoggedIn) {
      setIsLoggedIn(true)
      toast.info('mock login - configurar flujo de autenticación en la app')
    } else {
      toast.warning('ya existe una sesión activa')
    }
  }
  async function logout() {
    setIsLoggedIn(false)
    toast.info('mock logout - configurar flujo de autenticación en la app')
    setIsMenuOpen?.(false)
  }

  return (
    <Button
      onClick={isLoggedIn ? logout : login}
      size={size}
      className={cn('font-funnel font-medium', className)}
    >
      {isLoggedIn ? 'salir' : children || 'entrar'}
    </Button>
  )
}
