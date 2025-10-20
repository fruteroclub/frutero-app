'use client'

import { use } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useAppAuth } from '@/store/auth-context'
import PageWrapper from '@/components/layout/page-wrapper'
import { JamNav } from '@/components/jam-platform/navigation/JamNav'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { MentorHeader } from '@/components/jam-platform/mentors/MentorHeader'
import { MentorStats } from '@/components/jam-platform/mentors/MentorStats'
import { MentorConnection } from '@/components/jam-platform/mentors/MentorConnection'
import { SessionHistory } from '@/components/jam-platform/mentors/SessionHistory'
import { SessionLogger } from '@/components/jam-platform/mentors/SessionLogger'
import { getMentorById, getMentorshipStatus, type Mentor } from '@/services/jam/mentors.service'

export default function MentorDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const { user, isAppAuthenticated } = useAppAuth()

  const { data: mentor, isLoading } = useQuery<Mentor>({
    queryKey: ['mentor', id],
    queryFn: async () => {
      const result = await getMentorById(id)
      if (!result.data) throw new Error('Mentor no encontrado')
      return result.data
    },
  })

  const { data: connectionStatus } = useQuery({
    queryKey: ['mentorship-status', id, user?.id],
    queryFn: async () => {
      if (!user?.id) return { exists: false, mentorship: null }
      const result = await getMentorshipStatus(id, user.id)
      return result.data || { exists: false, mentorship: null }
    },
    enabled: isAppAuthenticated && !!user,
  })

  if (isLoading) {
    return (
      <PageWrapper>
        <div className="page py-6">
          <div className="sticky top-0 z-10">
            <JamNav />
          </div>
          <div className="container max-w-6xl space-y-6 pl-64">
            <div className="py-12 text-center">
              <p className="text-muted-foreground">Cargando mentor...</p>
            </div>
          </div>
        </div>
      </PageWrapper>
    )
  }

  if (!mentor) {
    return (
      <PageWrapper>
        <div className="page py-6">
          <div className="sticky top-0 z-10">
            <JamNav />
          </div>
          <div className="container max-w-6xl space-y-6 pl-64">
            <div className="py-12 text-center">
              <h2 className="text-2xl font-bold">Mentor no encontrado</h2>
              <p className="mt-2 text-muted-foreground">
                El mentor que buscas no existe o no está disponible.
              </p>
            </div>
          </div>
        </div>
      </PageWrapper>
    )
  }

  return (
    <PageWrapper>
      <div className="page py-6">
        <div className="sticky top-0 z-10">
          <JamNav />
        </div>
        <div className="container max-w-6xl space-y-6 pl-64">
          <MentorHeader mentor={mentor} />

          <MentorStats mentor={mentor} />

          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Enfoque de Mentoría</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {mentor.mentoringApproach ? (
                    <p className="text-muted-foreground">{mentor.mentoringApproach}</p>
                  ) : (
                    <p className="text-muted-foreground">
                      No hay información sobre el enfoque de mentoría.
                    </p>
                  )}

                  {mentor.experience && (
                    <div className="space-y-2">
                      <h3 className="text-sm font-semibold">Experiencia</h3>
                      <p className="text-muted-foreground">{mentor.experience}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-1">
              {isAppAuthenticated && user ? (
                <div className="space-y-4">
                  <MentorConnection
                    mentor={mentor}
                    userId={user.id}
                    hasExistingConnection={connectionStatus?.exists || false}
                  />
                  {connectionStatus?.exists && connectionStatus.mentorship && (
                    <SessionLogger
                      mentorshipId={connectionStatus.mentorship.id}
                      userRole="participant"
                    />
                  )}
                </div>
              ) : (
                <Card>
                  <CardHeader>
                    <CardTitle>Conecta con este Mentor</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Inicia sesión para solicitar mentoría.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* Session History for connected users */}
          {isAppAuthenticated &&
            user &&
            connectionStatus?.exists &&
            connectionStatus.mentorship && (
              <div>
                <h2 className="mb-4 text-2xl font-bold">Historial de Sesiones</h2>
                <SessionHistory
                  mentorshipId={connectionStatus.mentorship.id}
                  mentorName={mentor.displayName || mentor.username || 'Mentor'}
                />
              </div>
            )}
        </div>
      </div>
    </PageWrapper>
  )
}
