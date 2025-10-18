'use client'

import { useQuery } from '@tanstack/react-query'
import { useAppAuth } from '@/store/auth-context'
import PageWrapper from '@/components/layout/page-wrapper'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { JamNav } from '@/components/jam-platform/navigation/JamNav'
import { AdminProtected } from '@/components/auth/AdminProtected'
import {
  Users,
  FolderKanban,
  Target,
  CheckCircle,
  TrendingUp,
  DollarSign,
  Calendar,
} from 'lucide-react'
import { getAdminDashboardStats } from '@/services/jam/admin-dashboard.service'
import { STAGE_ORDER, STAGES } from '@/lib/jam/stages'

export default function AdminDashboardPage() {
  const { user } = useAppAuth()

  const { data: stats, isLoading } = useQuery({
    queryKey: ['admin-dashboard-stats'],
    queryFn: getAdminDashboardStats,
    enabled: !!user?.isAdmin,
  })

  return (
    <PageWrapper>
      <div className="page py-6">
        <div className="sticky top-0 z-10">
          <JamNav />
        </div>
        <div className="container max-w-6xl pl-64">
          <AdminProtected>
            {isLoading ? (
              <div className="flex min-h-[400px] items-center justify-center">
                <div className="space-y-4 text-center">
                  <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-primary"></div>
                  <p className="text-muted-foreground">Cargando estadísticas...</p>
                </div>
              </div>
            ) : !stats ? null : (
              <div className="space-y-6">
                {/* Header */}
                <div>
                  <h1 className="mb-2 text-3xl font-bold">Admin Dashboard</h1>
                  <p className="text-muted-foreground">
                    Vista general de la plataforma y métricas clave
                  </p>
                </div>

                {/* Top Stats Grid */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  {/* Users */}
                  <Card>
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-sm font-medium">Usuarios</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{stats.users.total}</div>
                      <p className="text-xs text-muted-foreground">
                        {stats.users.recentlyJoined} nuevos esta semana
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {stats.users.admins} administradores
                      </p>
                    </CardContent>
                  </Card>

                  {/* Projects */}
                  <Card>
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-sm font-medium">Proyectos</CardTitle>
                        <FolderKanban className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{stats.projects.total}</div>
                      <p className="text-xs text-muted-foreground">
                        {stats.projects.activeProjects} activos (30 días)
                      </p>
                    </CardContent>
                  </Card>

                  {/* Quests */}
                  <Card>
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-sm font-medium">Quests</CardTitle>
                        <Target className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{stats.quests.total}</div>
                      <p className="text-xs text-muted-foreground">
                        {stats.quests.completed} completados
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {stats.quests.pending} pendientes
                      </p>
                    </CardContent>
                  </Card>

                  {/* Bounties */}
                  <Card>
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-sm font-medium">Bounties Pagados</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">${stats.submissions.totalBountiesPaid}</div>
                      <p className="text-xs text-muted-foreground">USD en total</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Verification Stats */}
                <div className="grid gap-4 md:grid-cols-3">
                  <Card>
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-sm font-medium">Pendientes</CardTitle>
                        <Calendar className="h-4 w-4 text-yellow-600" />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-yellow-600">
                        {stats.submissions.pendingVerification}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Submissions esperando verificación
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-sm font-medium">Verificados Hoy</CardTitle>
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-green-600">
                        {stats.submissions.verifiedToday}
                      </div>
                      <p className="text-xs text-muted-foreground">Quests verificados hoy</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-sm font-medium">Programas</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{stats.programs.total}</div>
                      <p className="text-xs text-muted-foreground">
                        {stats.programs.active} activos
                      </p>
                    </CardContent>
                  </Card>
                </div>

                {/* Projects by Stage */}
                <Card>
                  <CardHeader>
                    <CardTitle>Proyectos por Stage</CardTitle>
                    <CardDescription>
                      Distribución de proyectos en cada etapa de desarrollo
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {STAGE_ORDER.map((stage) => {
                        const count = stats.projects.byStage[stage] || 0
                        const percentage = stats.projects.total > 0
                          ? (count / stats.projects.total) * 100
                          : 0
                        const stageConfig = STAGES[stage]

                        return (
                          <div key={stage} className="space-y-1">
                            <div className="flex items-center justify-between text-sm">
                              <span className="flex items-center gap-2">
                                <span className="text-lg">{stageConfig.icon}</span>
                                {stageConfig.title}
                              </span>
                              <span className="font-medium">
                                {count} ({percentage.toFixed(0)}%)
                              </span>
                            </div>
                            <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                              <div
                                className="h-full bg-primary transition-all"
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>

                {/* Quest Type Distribution */}
                <div className="grid gap-4 md:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>Quest Types</CardTitle>
                      <CardDescription>Distribución por tipo de quest</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Individual</span>
                          <span className="font-medium">{stats.quests.individual}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Team</span>
                          <span className="font-medium">{stats.quests.team}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Both</span>
                          <span className="font-medium">
                            {stats.quests.total - stats.quests.individual - stats.quests.team}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Quest Completion</CardTitle>
                      <CardDescription>Estado de completitud de quests</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Completados</span>
                          <span className="font-medium text-green-600">
                            {stats.quests.completed}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Pendientes</span>
                          <span className="font-medium text-yellow-600">
                            {stats.quests.pending}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Tasa de Completitud</span>
                          <span className="font-medium">
                            {stats.quests.total > 0
                              ? ((stats.quests.completed / stats.quests.total) * 100).toFixed(1)
                              : 0}
                            %
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
          </AdminProtected>
        </div>
      </div>
    </PageWrapper>
  )
}
