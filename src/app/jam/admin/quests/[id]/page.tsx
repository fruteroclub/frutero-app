'use client'

import { use, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { useAppAuth } from '@/store/auth-context'
import PageWrapper from '@/components/layout/page-wrapper'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  ArrowLeft,
  Calendar,
  Users,
  DollarSign,
  Trophy,
  Shield,
  ExternalLink,
  CheckCircle2,
  XCircle,
  Clock,
} from 'lucide-react'
import { JamNav } from '@/components/jam-platform/navigation/JamNav'
import { getQuest, type Quest } from '@/services/jam/quests.service'
import {
  getQuestSubmissions,
  type QuestSubmission,
} from '@/services/jam/admin.service'

interface AdminQuestDetailPageProps {
  params: Promise<{
    id: string
  }>
}

export default function AdminQuestDetailPage({
  params,
}: AdminQuestDetailPageProps) {
  const { id } = use(params)
  const { user, isAppAuthenticated } = useAppAuth()
  const [statusFilter, setStatusFilter] = useState<string>('ALL')

  // Always call hooks
  const { data: quest, isLoading: questLoading } = useQuery<Quest | null>({
    queryKey: ['quest', id],
    queryFn: () => getQuest(id),
    enabled: isAppAuthenticated && !!user?.isAdmin,
  })

  const { data: submissions = [], isLoading: submissionsLoading } = useQuery<
    QuestSubmission[]
  >({
    queryKey: ['quest-submissions', id],
    queryFn: () => getQuestSubmissions(id),
    enabled: isAppAuthenticated && !!user?.isAdmin,
  })

  // Check admin permission after hooks
  if (!user?.isAdmin) {
    return (
      <PageWrapper>
        <div className="page py-6">
          <div className="sticky top-0 z-10">
            <JamNav />
          </div>
          <div className="container max-w-6xl pl-64">
            <Alert variant="destructive">
              <Shield className="h-4 w-4" />
              <AlertDescription>
                No tienes permisos de administrador para acceder a esta página.
              </AlertDescription>
            </Alert>
          </div>
        </div>
      </PageWrapper>
    )
  }

  const isLoading = questLoading || submissionsLoading

  if (isLoading) {
    return (
      <PageWrapper>
        <div className="page py-6">
          <div className="sticky top-0 z-10">
            <JamNav />
          </div>
          <div className="container max-w-6xl pl-64">
            <div className="flex min-h-[400px] items-center justify-center">
              <div className="space-y-4 text-center">
                <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-primary"></div>
                <p className="text-foreground">
                  Cargando quest y submissions...
                </p>
              </div>
            </div>
          </div>
        </div>
      </PageWrapper>
    )
  }

  if (!quest) {
    notFound()
  }

  // Filter submissions
  const filteredSubmissions = submissions.filter((submission) => {
    if (statusFilter === 'ALL') return true
    return submission.status === statusFilter
  })

  // Stats
  const stats = {
    total: submissions.length,
    inProgress: submissions.filter((s) => s.status === 'IN_PROGRESS').length,
    completed: submissions.filter((s) => s.status === 'COMPLETED').length,
    submitted: submissions.filter((s) => s.status === 'SUBMITTED').length,
    verified: submissions.filter((s) => s.status === 'VERIFIED').length,
    rejected: submissions.filter((s) => s.status === 'REJECTED').length,
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return <Badge variant="default">Completado</Badge>
      case 'IN_PROGRESS':
        return <Badge variant="secondary">En Progreso</Badge>
      case 'SUBMITTED':
        return <Badge variant="outline">Enviado</Badge>
      case 'VERIFIED':
        return <Badge className="bg-green-600">Verificado</Badge>
      case 'REJECTED':
        return <Badge variant="destructive">Rechazado</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED':
      case 'VERIFIED':
        return <CheckCircle2 className="h-5 w-5 text-green-600" />
      case 'REJECTED':
        return <XCircle className="h-5 w-5 text-red-600" />
      case 'IN_PROGRESS':
      case 'SUBMITTED':
        return <Clock className="h-5 w-5 text-yellow-600" />
      default:
        return <Clock className="h-5 w-5 text-foreground" />
    }
  }

  return (
    <PageWrapper>
      <div className="page py-6">
        <div className="sticky top-0 z-10">
          <JamNav />
        </div>
        <div className="container space-y-6 pl-64">
          {/* Back Link */}
          <Link
            href="/jam/admin/quests"
            className="inline-flex items-center gap-2 text-sm text-foreground hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver a Gestión de Quests
          </Link>

          {/* Quest Header */}
          <div className="space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h1 className="mb-3 text-3xl font-bold">{quest.title}</h1>
                <div className="flex flex-wrap gap-2">
                  <Badge
                    variant={
                      quest.questType === 'TEAM' ? 'default' : 'secondary'
                    }
                  >
                    {quest.questType === 'TEAM' && (
                      <Users className="mr-1 h-3 w-3" />
                    )}
                    {quest.questType}
                  </Badge>
                  <Badge variant="outline">{quest.category}</Badge>
                  <Badge variant="secondary">
                    <Trophy className="mr-1 h-3 w-3" />
                    {quest.rewardPoints} puntos
                  </Badge>
                  {quest.bountyUsd && (
                    <Badge variant="default" className="bg-green-600">
                      <DollarSign className="mr-1 h-3 w-3" />${quest.bountyUsd}{' '}
                      USD
                    </Badge>
                  )}
                </div>
              </div>
              <Button variant="outline" asChild>
                <Link href={`/jam/quests/${id}`}>Ver Vista Usuario</Link>
              </Button>
            </div>

            <p className="text-foreground">{quest.description}</p>
          </div>

          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.total}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  En Progreso
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.inProgress}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Completados
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.completed}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Enviados</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.submitted}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Verificados
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {stats.verified}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Rechazados
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">
                  {stats.rejected}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Submissions</CardTitle>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant={statusFilter === 'ALL' ? 'default' : 'outline'}
                    onClick={() => setStatusFilter('ALL')}
                  >
                    Todos
                  </Button>
                  <Button
                    size="sm"
                    variant={
                      statusFilter === 'IN_PROGRESS' ? 'default' : 'outline'
                    }
                    onClick={() => setStatusFilter('IN_PROGRESS')}
                  >
                    En Progreso
                  </Button>
                  <Button
                    size="sm"
                    variant={
                      statusFilter === 'COMPLETED' ? 'default' : 'outline'
                    }
                    onClick={() => setStatusFilter('COMPLETED')}
                  >
                    Completados
                  </Button>
                  <Button
                    size="sm"
                    variant={
                      statusFilter === 'SUBMITTED' ? 'default' : 'outline'
                    }
                    onClick={() => setStatusFilter('SUBMITTED')}
                  >
                    Enviados
                  </Button>
                  <Button
                    size="sm"
                    variant={
                      statusFilter === 'VERIFIED' ? 'default' : 'outline'
                    }
                    onClick={() => setStatusFilter('VERIFIED')}
                  >
                    Verificados
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {filteredSubmissions.length === 0 ? (
                <div className="py-8 text-center text-foreground">
                  No hay submissions{' '}
                  {statusFilter !== 'ALL' && `con estado: ${statusFilter}`}
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredSubmissions.map((submission) => (
                    <div
                      key={submission.id}
                      className="flex items-start gap-4 rounded-lg border p-4 hover:bg-muted/50"
                    >
                      {getStatusIcon(submission.status)}
                      <div className="flex-1 space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-semibold">
                                {submission.userName ||
                                  submission.projectName ||
                                  'Usuario'}
                              </span>
                              {getStatusBadge(submission.status)}
                            </div>
                            <p className="text-sm text-foreground">
                              {submission.userEmail || submission.projectId}
                            </p>
                          </div>
                          <div className="text-right text-sm text-foreground">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {new Date(
                                submission.startedAt || submission.createdAt,
                              ).toLocaleDateString()}
                            </div>
                            {submission.completedAt && (
                              <div className="text-xs">
                                Completado:{' '}
                                {new Date(
                                  submission.completedAt,
                                ).toLocaleDateString()}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-foreground">Progreso</span>
                            <span className="font-medium">
                              {submission.progress}%
                            </span>
                          </div>
                          <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                            <div
                              className="h-full bg-primary transition-all"
                              style={{ width: `${submission.progress}%` }}
                            />
                          </div>
                        </div>

                        {/* Submission Text */}
                        {submission.submissionText && (
                          <div className="rounded bg-muted p-3">
                            <p className="text-sm">
                              {submission.submissionText}
                            </p>
                          </div>
                        )}

                        {/* Submission URLs */}
                        {submission.submissionUrls &&
                          submission.submissionUrls.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                              {submission.submissionUrls.map((url, index) => (
                                <Button
                                  key={index}
                                  variant="outline"
                                  size="sm"
                                  asChild
                                >
                                  <a
                                    href={url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    <ExternalLink className="mr-1 h-3 w-3" />
                                    Link {index + 1}
                                  </a>
                                </Button>
                              ))}
                            </div>
                          )}

                        {submission.submissionLink && (
                          <Button variant="outline" size="sm" asChild>
                            <a
                              href={submission.submissionLink}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <ExternalLink className="mr-1 h-3 w-3" />
                              Ver Submission
                            </a>
                          </Button>
                        )}
                      </div>

                      {/* Verification Actions */}
                      {(submission.status === 'COMPLETED' ||
                        submission.status === 'SUBMITTED') && (
                        <div className="flex flex-col gap-2">
                          <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-700"
                            asChild
                          >
                            <Link
                              href={`/jam/admin/verifications?submissionId=${submission.id}`}
                            >
                              Verificar
                            </Link>
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </PageWrapper>
  )
}
