'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Home, Target, Calendar, Users, MessageSquare, User, Menu, X, FolderPlus } from 'lucide-react';
import { NavLink } from './NavLink';
import { Button } from '@/components/ui/button';

const NAV_ITEMS = [
  { href: '/jam/dashboard', label: 'Dashboard', icon: Home },
  { href: '/jam/projects/create', label: 'Crear Proyecto', icon: FolderPlus },
  { href: '/jam/quests', label: 'Quests', icon: Target },
  { href: '/jam/programs', label: 'Programs', icon: Calendar },
  { href: '/jam/mentors', label: 'Mentors', icon: Users },
  { href: '/jam/community', label: 'Community', icon: MessageSquare },
  { href: '/jam/profile', label: 'Profile', icon: User },
];

export function JamNav() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:left-0 lg:top-24 lg:bottom-0">
        <div className="flex flex-col gap-y-6 px-6 py-8 h-full overflow-y-auto">
          {/* Logo */}
          <Link href="/jam/dashboard" className="font-bold text-xl">
            Jam Platform
          </Link>

          {/* Navigation */}
          <nav className="flex flex-1 flex-col gap-2">
            {NAV_ITEMS.map((item) => (
              <NavLink key={item.href} {...item} />
            ))}
          </nav>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="lg:hidden sticky top-0 z-40 flex items-center gap-x-6 border-b bg-background px-4 py-4 sm:px-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
        <Link href="/jam/dashboard" className="font-bold text-lg">
          Jam Platform
        </Link>
      </div>

      {/* Mobile Sidebar */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-background/80 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Sidebar */}
          <div className="fixed inset-y-0 left-0 w-64 bg-background border-r">
            <div className="flex flex-col gap-y-6 px-6 py-8">
              {/* Logo */}
              <div className="flex items-center justify-between">
                <Link
                  href="/jam/dashboard"
                  className="font-bold text-xl"
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
              </nav>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
