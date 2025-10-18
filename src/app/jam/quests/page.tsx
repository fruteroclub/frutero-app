'use client'

import { use } from 'react'
import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'
import { useAppAuth } from '@/store/auth-context'
import PageWrapper from '@/components/layout/page-wrapper'
import { Card } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { ArrowLeft, Info } from 'lucide-react'
import { JamNav } from '@/components/jam-platform/navigation/JamNav'
import { QuestTypeToggle } from '@/components/jam-platform/quests/QuestTypeToggle'
import { QuestCard } from '@/components/jam-platform/quests/QuestCard'
import {
  getAllQuests,
  getUserQuests,
  type Quest,
  type UserQuest,
  type QuestType,
} from '@/services/jam/quests.service'

interface QuestsPageProps {
  searchParams: Promise<{
    type?: QuestType
  }>
}

export default function QuestsPage({ searchParams }: QuestsPageProps) {
  const { user, isAppAuthenticated } = useAppAuth()
  const { type = 'ALL' } = use(searchParams)

  // Fetch all available quests
  const { data: availableQuests = [], isLoading: loadingAvailable } = useQuery<Quest[]>({
    queryKey: ['quests', type],
    queryFn: () => getAllQuests(type),
    enabled: isAppAuthenticated,
  })

  // Fetch user's quests with progress
  const { data: userQuestData = [], isLoading: loadingUser } = useQuery<UserQuest[]>({
    queryKey: ['user-quests', user?.id, type],
    queryFn: () => getUserQuests(user!.id, type),
    enabled: isAppAuthenticated && !!user,
  })

  const isLoading = loadingAvailable || loadingUser

  // Merge available quests with user progress
  const questsWithProgress = availableQuests.map((quest) => {
    const userQuest = userQuestData.find((uq) => uq.questId === quest.id)
    return {
      quest,
      userQuest: userQuest || null,
    }
  })

  // Categorize quests
  const activeQuests = questsWithProgress.filter(
    (q) => q.userQuest && q.userQuest.status === 'IN_PROGRESS'
  )

  const availableNewQuests = questsWithProgress.filter(
    (q) => !q.userQuest || q.userQuest.status === 'NOT_STARTED'
  )

  const completedQuests = questsWithProgress.filter(
    (q) => q.userQuest && q.userQuest.status === 'COMPLETED'
  )

  return (
    <PageWrapper>
      <div className="page py-6">
        <div className="sticky top-0 z-10">
          <JamNav />
        </div>
        <div className="container max-w-6xl space-y-6 pl-64">
          {/* Header */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <Link
                href="/jam/dashboard"
                className="mb-2 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary"
              >
                <ArrowLeft className="h-4 w-4" />
                Volver al Dashboard
              </Link>
              <h1 className="text-3xl font-bold">Quests</h1>
              <p className="mt-2 text-muted-foreground">
                Completa quests para ganar puntos, aprender habilidades y hacer crecer tu proyecto
              </p>
            </div>

            <QuestTypeToggle currentType={type} />
          </div>

          {/* Info Alert */}
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              Los quests individuales son para ti solo. Los quests de equipo requieren que tu
              proyecto complete el trabajo colaborativamente.
            </AlertDescription>
          </Alert>

          {/* Loading State */}
          {isLoading && (
            <div className="flex min-h-[400px] items-center justify-center">
              <div className="space-y-4 text-center">
                <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-primary"></div>
                <p className="text-muted-foreground">Cargando quests...</p>
              </div>
            </div>
          )}

          {/* Quest Lists */}
          {!isLoading && (
            <div className="space-y-8">
              {/* Active Quests */}
              {activeQuests.length > 0 && (
                <section>
                  <h2 className="mb-4 text-2xl font-semibold">Quests Activos</h2>
                  <div className="grid gap-4 md:grid-cols-2">
                    {activeQuests.map(({ quest, userQuest }) => (
                      <QuestCard
                        key={quest.id}
                        quest={quest}
                        userQuest={userQuest}
                        highlight
                      />
                    ))}
                  </div>
                </section>
              )}

              {/* Available Quests */}
              <section>
                <h2 className="mb-4 text-2xl font-semibold">
                  {activeQuests.length > 0 ? 'Quests Disponibles' : 'Todos los Quests'}
                </h2>
                {availableNewQuests.length === 0 ? (
                  <Card className="p-6 text-center">
                    <p className="text-muted-foreground">
                      No hay quests disponibles en este momento.
                    </p>
                  </Card>
                ) : (
                  <div className="grid gap-4 md:grid-cols-2">
                    {availableNewQuests.map(({ quest, userQuest }) => (
                      <QuestCard key={quest.id} quest={quest} userQuest={userQuest} />
                    ))}
                  </div>
                )}
              </section>

              {/* Completed Quests */}
              {completedQuests.length > 0 && (
                <details className="group">
                  <summary className="mb-4 cursor-pointer text-2xl font-semibold hover:text-primary">
                    Quests Completados ({completedQuests.length})
                  </summary>
                  <div className="grid gap-4 md:grid-cols-2">
                    {completedQuests.map(({ quest, userQuest }) => (
                      <QuestCard key={quest.id} quest={quest} userQuest={userQuest} />
                    ))}
                  </div>
                </details>
              )}
            </div>
          )}
        </div>
      </div>
    </PageWrapper>
  )
}
