'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'
import PageWrapper from '@/components/layout/page-wrapper'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Plus, Calendar, DollarSign } from 'lucide-react'
import { JamNav } from '@/components/jam-platform/navigation/JamNav'
import { AdminProtected } from '@/components/auth/AdminProtected'
import { AdminQuestForm } from '@/components/jam-platform/admin/AdminQuestForm'
import { getAllQuests, type Quest } from '@/services/jam/quests.service'
import { useAppAuth } from '@/store/auth-context'

export default function AdminQuestsPage() {
  const { isAppAuthenticated } = useAppAuth()
  const [showCreateForm, setShowCreateForm] = useState(false)

  // Fetch all quests
  const {
    data: quests = [],
    isLoading,
    refetch,
  } = useQuery<Quest[]>({
    queryKey: ['admin-quests'],
    queryFn: () => getAllQuests(),
    enabled: isAppAuthenticated,
  })

  const handleQuestCreated = () => {
    setShowCreateForm(false)
    refetch()
  }

  return (
    <PageWrapper>
      <div className="page py-6">
        <div className="sticky top-0 z-10">
          <JamNav />
        </div>
        <div className="container max-w-6xl pl-64">
          <AdminProtected>
            <div className="space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <Link
                href="/jam/admin/verifications"
                className="mb-2 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary"
              >
                <ArrowLeft className="h-4 w-4" />
                Volver a Verificaciones
              </Link>
              <h1 className="text-3xl font-bold">Gestión de Quests</h1>
              <p className="mt-2 text-muted-foreground">
                Crea y administra quests para programas
              </p>
            </div>

            <Button onClick={() => setShowCreateForm(!showCreateForm)}>
              <Plus className="mr-2 h-4 w-4" />
              {showCreateForm ? 'Cancelar' : 'Crear Quest'}
            </Button>
          </div>

          {/* Create Form */}
          {showCreateForm && (
            <div className="animate-in duration-300 fade-in slide-in-from-top-4">
              <AdminQuestForm onSuccess={handleQuestCreated} />
            </div>
          )}

          {/* Stats */}
          <div className="grid w-4/5 gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Quests
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{quests.length}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Quests de Equipo
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {
                    quests.filter(
                      (q) => q.questType === 'TEAM' || q.questType === 'BOTH',
                    ).length
                  }
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Bounties Totales
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  $
                  {quests
                    .reduce((sum, q) => sum + (q.bountyUsd || 0), 0)
                    .toLocaleString()}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quest List */}
          <div className="w-4/5">
            <Card>
              <CardHeader>
                <CardTitle>Todos los Quests</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex min-h-[200px] items-center justify-center">
                    <div className="space-y-4 text-center">
                      <div className="mx-auto h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
                      <p className="text-sm text-muted-foreground">
                        Cargando quests...
                      </p>
                    </div>
                  </div>
                ) : quests.length === 0 ? (
                  <div className="py-8 text-center">
                    <p className="text-muted-foreground">
                      No hay quests creados. Crea tu primer quest arriba.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {quests.map((quest) => (
                      <div
                        key={quest.id}
                        className="flex items-start justify-between rounded-lg border p-4 hover:bg-muted/50"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold">{quest.title}</h3>
                            <Badge
                              variant={
                                quest.questType === 'TEAM'
                                  ? 'default'
                                  : 'secondary'
                              }
                            >
                              {quest.questType}
                            </Badge>
                            {quest.difficulty && (
                              <Badge variant="outline">
                                {quest.difficulty}
                              </Badge>
                            )}
                          </div>

                          {quest.description && (
                            <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                              {quest.description}
                            </p>
                          )}

                          <div className="mt-3 flex flex-wrap gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              {new Date(
                                quest.start,
                              ).toLocaleDateString()} -{' '}
                              {new Date(quest.end).toLocaleDateString()}
                            </div>

                            {quest.bountyUsd && (
                              <div className="flex items-center gap-1 text-green-600">
                                <DollarSign className="h-4 w-4" />$
                                {quest.bountyUsd} USD
                              </div>
                            )}

                            <div>{quest.rewardPoints} puntos</div>

                            {quest.maxSubmissions && (
                              <div>Max: {quest.maxSubmissions} submissions</div>
                            )}
                          </div>
                        </div>

                        <div className="ml-4 flex gap-2">
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/jam/admin/quests/${quest.id}`}>Ver Submissions</Link>
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
            </div>
          </AdminProtected>
        </div>
      </div>
    </PageWrapper>
  )
}
