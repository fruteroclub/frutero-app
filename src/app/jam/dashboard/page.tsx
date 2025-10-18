'use client'

import { useAppAuth } from '@/store/auth-context'
import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'
import { WelcomeHeader } from '@/components/jam-platform/dashboard/WelcomeHeader'
import { QuestProgressCard } from '@/components/jam-platform/dashboard/QuestProgressCard'
import { MentorshipCard } from '@/components/jam-platform/dashboard/MentorshipCard'
import { ProjectStageCard } from '@/components/jam-platform/dashboard/ProjectStageCard'
import { QuickActions } from '@/components/jam-platform/dashboard/QuickActions'
import { UpcomingDeadlines } from '@/components/jam-platform/dashboard/UpcomingDeadlines'
import { RecentActivity } from '@/components/jam-platform/dashboard/RecentActivity'
import type { DashboardStats } from '@/types/jam'
import PageWrapper from '@/components/layout/page-wrapper'
import { JamNav } from '@/components/jam-platform/navigation/JamNav'

export default function DashboardPage() {
  const { user, isAppAuthenticated, isLoading } = useAppAuth()

  const { data: stats, isLoading: loadingStats } = useQuery({
    queryKey: ['dashboard', user?.id],
    queryFn: async () => {
      const res = await fetch(`/api/jam/dashboard?userId=${user!.id}`)
      if (!res.ok) throw new Error('Failed to load dashboard stats')
      return res.json() as Promise<DashboardStats>
    },
    enabled: isAppAuthenticated && !!user,
  })

  if (isLoading || loadingStats) {
    return (
      <div className="container py-8">
        <div className="flex min-h-[400px] items-center justify-center">
          <div className="space-y-4 text-center">
            <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-primary"></div>
            <p className="text-muted-foreground">Cargando...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!isAppAuthenticated || !user) {
    return (
      <div className="container py-8">
        <div className="flex min-h-[400px] items-center justify-center">
          <div className="space-y-4 text-center">
            <h2 className="text-2xl font-bold">Autenticación Requerida</h2>
            <p className="text-muted-foreground">
              Por favor inicia sesión para acceder al dashboard.
            </p>
            <Link
              href="/"
              className="inline-block rounded-md bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90"
            >
              Ir a Inicio
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="container py-8">
        <div className="space-y-4 text-center">
          <p className="text-muted-foreground">
            Error al cargar datos del dashboard
          </p>
        </div>
      </div>
    )
  }

  return (
    <PageWrapper>
      <div className="page py-6">
        <div className="sticky top-0 z-10">
          <JamNav />
        </div>
        <div className="container space-y-8 pb-2 pl-64">
          <WelcomeHeader user={user} />
          <div className="grid w-full items-stretch gap-6 md:grid-cols-2 lg:grid-cols-3">
            <QuestProgressCard stats={stats.quests} />
            <MentorshipCard mentorship={stats.mentorship} />
            <ProjectStageCard project={stats.project} />
          </div>

          <div className="grid w-full items-stretch gap-6 md:grid-cols-2 lg:grid-cols-3">
            <UpcomingDeadlines deadlines={stats.deadlines} />
            <QuickActions />
            <RecentActivity activities={stats.recentActivities} />
          </div>
        </div>
      </div>
    </PageWrapper>
  )
}
