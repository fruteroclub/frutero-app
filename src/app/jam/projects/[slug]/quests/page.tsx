'use client'

import { use } from 'react'
import { useQuery } from '@tanstack/react-query'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import PageWrapper from '@/components/layout/page-wrapper'
import { JamNav } from '@/components/jam-platform/navigation/JamNav'
import { TeamQuestCard } from '@/components/jam-platform/quests/TeamQuestCard'
import { ProjectQuestCard } from '@/components/jam-platform/quests/ProjectQuestCard'
import { Card } from '@/components/ui/card'
import { Loader2 } from 'lucide-react'
import { getProject, type Project } from '@/services/jam/projects.service'
import {
  getAvailableTeamQuests,
  getProjectQuests,
  type TeamQuest,
  type ProjectQuest,
} from '@/services/jam/project-quests.service'

interface QuestsPageProps {
  params: Promise<{
    slug: string
  }>
}

export default function QuestsPage({ params }: QuestsPageProps) {
  const { slug } = use(params)

  // Fetch project
  const { data: project, isLoading: projectLoading } = useQuery<Project | null>({
    queryKey: ['project', slug],
    queryFn: () => getProject(slug),
  })

  // Fetch available team quests
  const {
    data: availableQuests = [],
    isLoading: loadingAvailable,
    refetch: refetchAvailable,
  } = useQuery<TeamQuest[]>({
    queryKey: ['available-quests', slug],
    queryFn: () => getAvailableTeamQuests(slug),
    enabled: !!project,
  })

  // Fetch active project quests
  const {
    data: activeQuests = [],
    isLoading: loadingActive,
    refetch: refetchActive,
  } = useQuery<ProjectQuest[]>({
    queryKey: ['project-quests', slug],
    queryFn: () => getProjectQuests(slug),
    enabled: !!project,
  })

  const handleQuestApplied = () => {
    refetchActive()
    refetchAvailable()
  }

  if (projectLoading || loadingAvailable || loadingActive) {
    return (
      <PageWrapper>
        <div className="page py-6">
          <div className="sticky top-0 z-10">
            <JamNav />
          </div>
          <div className="container max-w-4xl pl-64">
            <div className="flex min-h-[400px] items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          </div>
        </div>
      </PageWrapper>
    )
  }

  if (!project) {
    notFound()
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
            href={`/jam/projects/${slug}`}
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
          >
            ← Volver al Proyecto
          </Link>

          {/* Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold">{project.name} - Team Quests</h1>
            <p className="text-muted-foreground">
              Completa quests para ganar bounties para tu equipo
            </p>
          </div>

          {/* Active Quests */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Quests Activos</h2>
            {activeQuests.length === 0 ? (
              <Card className="p-6 text-center text-muted-foreground">
                No hay quests activos. Explora los quests disponibles abajo para
                comenzar.
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {activeQuests.map((pq) => (
                  <ProjectQuestCard
                    key={pq.id}
                    projectQuest={pq}
                    projectSlug={slug}
                  />
                ))}
              </div>
            )}
          </section>

          {/* Available Quests */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">Quests Disponibles</h2>
            {availableQuests.length === 0 ? (
              <Card className="p-6 text-center text-muted-foreground">
                No hay quests disponibles en este momento.
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {availableQuests.map((quest) => (
                  <TeamQuestCard
                    key={quest.id}
                    quest={quest}
                    projectSlug={slug}
                    onApplied={handleQuestApplied}
                  />
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </PageWrapper>
  )
}
