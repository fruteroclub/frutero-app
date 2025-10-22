'use client'

import { use } from 'react'
import { useQuery } from '@tanstack/react-query'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import PageWrapper from '@/components/layout/page-wrapper'
import { JamNav } from '@/components/jam-platform/navigation/JamNav'
import { QuestSubmissionForm } from '@/components/jam-platform/quests/QuestSubmissionForm'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, DollarSign, Calendar, Users } from 'lucide-react'
import {
  getProjectQuest,
  type ProjectQuest,
} from '@/services/jam/project-quests.service'

interface QuestDetailPageProps {
  params: Promise<{
    slug: string
    questId: string
  }>
}

export default function QuestDetailPage({ params }: QuestDetailPageProps) {
  const { slug, questId } = use(params)

  // Fetch project quest
  const {
    data: projectQuest,
    isLoading,
    refetch,
  } = useQuery<ProjectQuest | null>({
    queryKey: ['project-quest', slug, questId],
    queryFn: () => getProjectQuest(slug, questId),
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
              <Loader2 className="h-8 w-8 animate-spin text-foreground" />
            </div>
          </div>
        </div>
      </PageWrapper>
    )
  }

  if (!projectQuest || !projectQuest.quest) {
    notFound()
  }

  const quest = projectQuest.quest
  const deadline = quest.dueDate || quest.end

  return (
    <PageWrapper>
      <div className="page py-6">
        <div className="sticky top-0 z-10">
          <JamNav />
        </div>
        <div className="container max-w-4xl space-y-6 pl-64">
          {/* Back Link */}
          <Link
            href={`/jam/projects/${slug}/quests`}
            className="inline-flex items-center text-sm text-foreground hover:text-foreground"
          >
            ← Volver a Quests
          </Link>

          {/* Quest Header */}
          <div>
            <div className="mb-2 flex items-center gap-2">
              <h1 className="text-3xl font-bold">{quest.title}</h1>
              {quest.bountyUsd && (
                <Badge variant="default" className="flex items-center gap-1">
                  <DollarSign className="h-4 w-4" />${quest.bountyUsd}
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2 text-sm text-foreground">
              {quest.category && (
                <Badge variant="secondary">{quest.category}</Badge>
              )}
              {quest.difficulty && (
                <Badge variant="outline">{quest.difficulty}</Badge>
              )}
              <Badge variant="outline">
                <Users className="mr-1 h-3 w-3" />
                {quest.questType}
              </Badge>
            </div>
          </div>

          {/* Quest Description */}
          <Card>
            <CardHeader>
              <CardTitle>Descripción</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm whitespace-pre-wrap text-foreground">
                {quest.description}
              </p>
            </CardContent>
          </Card>

          {/* Quest Details */}
          <div className="grid gap-4 md:grid-cols-2">
            {/* Deadline */}
            <Card>
              <CardContent className="pt-6">
                <div className="mb-1 flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-foreground" />
                  <p className="text-sm font-medium">Fecha Límite</p>
                </div>
                <p className="text-sm text-foreground">
                  {new Date(deadline).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </CardContent>
            </Card>

            {/* Rewards */}
            <Card>
              <CardContent className="pt-6">
                <div className="mb-1 flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-foreground" />
                  <p className="text-sm font-medium">Recompensas</p>
                </div>
                {quest.bountyUsd ? (
                  <p className="text-sm text-foreground">
                    ${quest.bountyUsd} USD + {quest.rewardPoints} puntos
                  </p>
                ) : (
                  <p className="text-sm text-foreground">
                    {quest.rewardPoints} puntos
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Submission Status Alert */}
          {projectQuest.status === 'REJECTED' && (
            <Alert variant="destructive">
              <AlertDescription>
                Este quest fue rechazado. Revisa las notas de verificación abajo
                y vuelve a enviar con las correcciones necesarias.
              </AlertDescription>
            </Alert>
          )}

          {/* Submission Form */}
          <QuestSubmissionForm
            projectSlug={slug}
            questId={questId}
            currentSubmission={projectQuest}
            onUpdate={() => refetch()}
          />
        </div>
      </div>
    </PageWrapper>
  )
}
