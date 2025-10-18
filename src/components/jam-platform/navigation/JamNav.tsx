'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Home,
  Target,
  Calendar,
  Users,
  MessageSquare,
  User,
  Menu,
  X,
  FolderPlus,
  Grid3x3,
  Shield,
  CheckSquare,
  LayoutDashboard,
} from 'lucide-react'
import { NavLink } from './NavLink'
import { Button } from '@/components/ui/button'
import { useAppAuth } from '@/store/auth-context'

const NAV_ITEMS = [
  { href: '/jam/dashboard', label: 'Dashboard', icon: Home },
  { href: '/jam/projects/create', label: 'Crear Proyecto', icon: FolderPlus },
  { href: '/jam/projects', label: 'Explorar Proyectos', icon: Grid3x3 },
  { href: '/jam/quests', label: 'Quests', icon: Target },
  { href: '/jam/programs', label: 'Programs', icon: Calendar },
  { href: '/jam/mentors', label: 'Mentors', icon: Users },
  { href: '/jam/community', label: 'Community', icon: MessageSquare },
  { href: '/jam/profile', label: 'Profile', icon: User },
]

const ADMIN_NAV_ITEMS = [
  { href: '/jam/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/jam/admin/users', label: 'Usuarios', icon: Users },
  { href: '/jam/admin/quests', label: 'Gestionar Quests', icon: Target },
  { href: '/jam/admin/verifications', label: 'Verificaciones', icon: CheckSquare },
]

export function JamNav() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { user } = useAppAuth()
  const isAdmin = user?.isAdmin === true

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:fixed lg:top-24 lg:bottom-0 lg:left-0 lg:flex lg:w-56 lg:flex-col">
        <div className="flex h-full flex-col gap-y-6 overflow-y-auto px-6 py-8">
          {/* Logo */}
          <Link href="/jam/dashboard" className="text-xl font-bold">
            Jam Platform
          </Link>

          {/* Navigation */}
          <nav className="flex flex-1 flex-col gap-2">
            {NAV_ITEMS.map((item) => (
              <NavLink key={item.href} {...item} />
            ))}

            {/* Admin Section */}
            {isAdmin && (
              <>
                <div className="my-4 border-t" />
                <div className="mb-2 flex items-center gap-2 px-3 text-xs font-semibold uppercase text-muted-foreground">
                  <Shield className="h-4 w-4" />
                  Admin
                </div>
                {ADMIN_NAV_ITEMS.map((item) => (
                  <NavLink key={item.href} {...item} />
                ))}
              </>
            )}
          </nav>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="sticky top-0 z-40 flex items-center gap-x-6 border-b bg-background px-4 py-4 sm:px-6 lg:hidden">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </Button>
        <Link href="/jam/dashboard" className="text-lg font-bold">
          Jam Platform
        </Link>
      </div>

      {/* Mobile Sidebar */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-background/80 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Sidebar */}
          <div className="fixed inset-y-0 left-0 w-64 border-r bg-background">
            <div className="flex flex-col gap-y-6 px-6 py-8">
              {/* Logo */}
              <div className="flex items-center justify-between">
                <Link
                  href="/jam/dashboard"
                  className="text-xl font-bold"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Jam Platform
                </Link>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              {/* Navigation */}
              <nav className="flex flex-1 flex-col gap-2">
                {NAV_ITEMS.map((item) => (
                  <div key={item.href} onClick={() => setMobileMenuOpen(false)}>
                    <NavLink {...item} />
                  </div>
                ))}

                {/* Admin Section */}
                {isAdmin && (
                  <>
                    <div className="my-4 border-t" />
                    <div className="mb-2 flex items-center gap-2 px-3 text-xs font-semibold uppercase text-muted-foreground">
                      <Shield className="h-4 w-4" />
                      Admin
                    </div>
                    {ADMIN_NAV_ITEMS.map((item) => (
                      <div key={item.href} onClick={() => setMobileMenuOpen(false)}>
                        <NavLink {...item} />
                      </div>
                    ))}
                  </>
                )}
              </nav>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
