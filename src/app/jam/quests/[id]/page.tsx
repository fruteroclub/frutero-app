'use client'

import { use } from 'react'
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
  CheckCircle2,
  Circle,
  Info,
} from 'lucide-react'
import { JamNav } from '@/components/jam-platform/navigation/JamNav'
import { getQuest, type Quest } from '@/services/jam/quests.service'

interface QuestDetailPageProps {
  params: Promise<{
    id: string
  }>
}

export default function QuestDetailPage({ params }: QuestDetailPageProps) {
  const { id } = use(params)
  const { isAppAuthenticated } = useAppAuth()

  const { data: quest, isLoading } = useQuery<Quest | null>({
    queryKey: ['quest', id],
    queryFn: () => getQuest(id),
    enabled: isAppAuthenticated,
  })

  if (isLoading) {
    return (
      <PageWrapper>
        <div className="page py-6">
          <div className="sticky top-0 z-10">
            <JamNav />
          </div>
          <div className="container max-w-4xl pl-64">
            <div className="flex min-h-[400px] items-center justify-center">
              <div className="space-y-4 text-center">
                <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-primary"></div>
                <p className="text-muted-foreground">Cargando quest...</p>
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

  // Format dates
  const dueDate = new Date(quest.dueDate || quest.end)
  const daysUntilDue = Math.ceil((dueDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24))

  // Quest type badge variant
  const getQuestTypeBadgeVariant = (type: string) => {
    switch (type) {
      case 'TEAM':
        return 'default'
      case 'INDIVIDUAL':
        return 'secondary'
      case 'BOTH':
        return 'outline'
      default:
        return 'secondary'
    }
  }

  // Difficulty badge variant
  const getDifficultyBadgeVariant = (difficulty: string | null) => {
    switch (difficulty) {
      case 'easy':
        return 'secondary'
      case 'medium':
        return 'default'
      case 'hard':
        return 'destructive'
      default:
        return 'secondary'
    }
  }

  return (
    <PageWrapper>
      <div className="page py-6">
        <div className="sticky top-0 z-10">
          <JamNav />
        </div>
        <div className="container max-w-4xl space-y-6 pl-64">
          {/* Back Link */}
          <Link
            href="/jam/quests"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver a Quests
          </Link>

          {/* Quest Header */}
          <div className="space-y-4">
            <div>
              <h1 className="mb-3 text-3xl font-bold">{quest.title}</h1>
              <div className="flex flex-wrap gap-2">
                <Badge variant={getQuestTypeBadgeVariant(quest.questType)}>
                  {quest.questType === 'TEAM' && <Users className="mr-1 h-3 w-3" />}
                  {quest.questType}
                </Badge>
                <Badge variant="outline">{quest.category}</Badge>
                <Badge variant={getDifficultyBadgeVariant(quest.difficulty)}>
                  {quest.difficulty}
                </Badge>
                <Badge variant="secondary">
                  <Trophy className="mr-1 h-3 w-3" />
                  {quest.rewardPoints} puntos
                </Badge>
                {quest.bountyUsd && (
                  <Badge variant="default" className="bg-green-600">
                    <DollarSign className="mr-1 h-3 w-3" />
                    ${quest.bountyUsd} USD
                  </Badge>
                )}
              </div>
            </div>

            {/* Quest Type Info */}
            {quest.questType === 'BOTH' && (
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  Este quest se puede completar individualmente o en equipo.
                </AlertDescription>
              </Alert>
            )}
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {/* Main Content */}
            <div className="space-y-6 md:col-span-2">
              {/* Description */}
              <Card>
                <CardHeader>
                  <CardTitle>Descripción</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{quest.description}</p>
                </CardContent>
              </Card>

              {/* Requirements */}
              <Card>
                <CardHeader>
                  <CardTitle>Requisitos</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {quest.requirements.map((requirement, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <Circle className="mt-1 h-4 w-4 flex-shrink-0 text-muted-foreground" />
                        <span>{requirement}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Deliverables */}
              <Card>
                <CardHeader>
                  <CardTitle>Entregables</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {quest.deliverables.map((deliverable, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <CheckCircle2 className="mt-1 h-4 w-4 flex-shrink-0 text-green-600" />
                        <span>{deliverable}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Action Button */}
              <Button size="lg" className="w-full">
                Iniciar Quest
              </Button>
            </div>

            {/* Sidebar */}
            <div className="space-y-4">
              {/* Deadline */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Fecha Límite</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>
                      {dueDate.toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </span>
                  </div>
                  <p
                    className={`mt-2 text-sm ${
                      daysUntilDue < 3 ? 'text-red-600' : 'text-muted-foreground'
                    }`}
                  >
                    {daysUntilDue > 0
                      ? `${daysUntilDue} días restantes`
                      : 'Vencido'}
                  </p>
                </CardContent>
              </Card>

              {/* Capacity (if applicable) */}
              {quest.maxSubmissions && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Disponibilidad</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2 text-sm">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span>
                        {quest.maxSubmissions - quest.currentSubmissions} /{' '}
                        {quest.maxSubmissions} espacios
                      </span>
                    </div>
                    {quest.maxSubmissions - quest.currentSubmissions === 0 && (
                      <p className="mt-2 text-sm text-red-600">
                        No hay espacios disponibles
                      </p>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Rewards */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Recompensas</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Puntos</span>
                    <span className="font-semibold">{quest.rewardPoints}</span>
                  </div>
                  {quest.bountyUsd && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Bounty</span>
                      <span className="font-semibold text-green-600">
                        ${quest.bountyUsd} USD
                      </span>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  )
}
