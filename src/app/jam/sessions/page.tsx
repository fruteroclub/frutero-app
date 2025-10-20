'use client'

import { useQuery } from '@tanstack/react-query'
import { useAppAuth } from '@/store/auth-context'
import PageWrapper from '@/components/layout/page-wrapper'
import { JamNav } from '@/components/jam-platform/navigation/JamNav'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { SessionCard } from '@/components/jam-platform/mentors/SessionCard'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Info } from 'lucide-react'
import {
  getUserMentorships,
  getMentorshipSessions,
  type UserMentorship,
  type MentorshipSession,
} from '@/services/jam/mentors.service'

export default function SessionsPage() {
  const { user, isAppAuthenticated } = useAppAuth()

  const { data: mentorships = [], isLoading: mentorshipsLoading } = useQuery<UserMentorship[]>({
    queryKey: ['user-mentorships', user?.id],
    queryFn: async () => {
      if (!user?.id) return []
      const result = await getUserMentorships(user.id)
      return result.data || []
    },
    enabled: isAppAuthenticated && !!user,
  })

  // Fetch all sessions for all mentorships
  const { data: allSessions = [], isLoading: sessionsLoading } = useQuery<
    Array<{ mentorshipId: string; sessions: MentorshipSession[]; mentorship: UserMentorship }>
  >({
    queryKey: ['all-sessions', user?.id],
    queryFn: async () => {
      const sessionsPromises = mentorships.map(async (mentorship) => {
        const result = await getMentorshipSessions(mentorship.id)
        return {
          mentorshipId: mentorship.id,
          sessions: result.data || [],
          mentorship,
        }
      })
      return Promise.all(sessionsPromises)
    },
    enabled: mentorships.length > 0,
  })

  // Flatten and sort all sessions by date
  const flattenedSessions = allSessions
    .flatMap((item) =>
      item.sessions.map((session) => ({
        session,
        mentorship: item.mentorship,
      }))
    )
    .sort((a, b) => new Date(b.session.date).getTime() - new Date(a.session.date).getTime())

  return (
    <PageWrapper>
      <div className="page py-6">
        <div className="sticky top-0 z-10">
          <JamNav />
        </div>
        <div className="container max-w-6xl space-y-6 pl-64">
          <div>
            <h1 className="text-3xl font-bold md:text-4xl">Historial de Sesiones</h1>
            <p className="mt-2 text-muted-foreground">
              Todas tus sesiones de mentoría registradas
            </p>
          </div>

          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              Las sesiones son registradas por mentores o participantes después de cada reunión.
              Mantén un registro consistente para un mejor seguimiento.
            </AlertDescription>
          </Alert>

          {mentorshipsLoading || sessionsLoading ? (
            <div className="py-12 text-center">
              <p className="text-muted-foreground">Cargando sesiones...</p>
            </div>
          ) : flattenedSessions.length === 0 ? (
            <Card>
              <CardHeader>
                <CardTitle>No hay sesiones registradas</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Aún no tienes sesiones de mentoría registradas. Las sesiones aparecerán aquí
                  cuando tú o tu mentor registren una sesión.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {flattenedSessions.map(({ session, mentorship }) => {
                const isMentor = mentorship.mentorId === user?.id
                const otherPerson = isMentor ? mentorship.participant : mentorship.mentor
                const otherPersonName = otherPerson?.displayName || otherPerson?.username || 'Usuario'

                return (
                  <SessionCard
                    key={session.id}
                    session={session}
                    mentorName={isMentor ? undefined : otherPersonName}
                    participantName={isMentor ? otherPersonName : undefined}
                    showRole={true}
                  />
                )
              })}
            </div>
          )}
        </div>
      </div>
    </PageWrapper>
  )
}
