'use client'

import { use } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useAppAuth } from '@/store/auth-context'
import PageWrapper from '@/components/layout/page-wrapper'
import { JamNav } from '@/components/jam-platform/navigation/JamNav'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { SessionLogger } from '@/components/jam-platform/mentors/SessionLogger'
import { SessionHistory } from '@/components/jam-platform/mentors/SessionHistory'
import { SessionStats } from '@/components/jam-platform/mentors/SessionStats'
import {
  getMentorshipById,
  getMentorshipSessions,
  type UserMentorship,
  type MentorshipSession,
} from '@/services/jam/mentors.service'
import { MapPin } from 'lucide-react'

export default function MentorshipDetailPage({
  params,
}: {
  params: Promise<{ mentorshipId: string }>
}) {
  const { mentorshipId } = use(params)
  const { user, isAppAuthenticated } = useAppAuth()

  const { data: mentorship, isLoading } = useQuery<UserMentorship>({
    queryKey: ['mentorship', mentorshipId],
    queryFn: async () => {
      const result = await getMentorshipById(mentorshipId)
      if (!result.data) throw new Error('Mentoría no encontrada')
      return result.data
    },
  })

  const { data: sessions = [] } = useQuery<MentorshipSession[]>({
    queryKey: ['mentorship-sessions', mentorshipId],
    queryFn: async () => {
      const result = await getMentorshipSessions(mentorshipId)
      return result.data || []
    },
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
              <p className="text-foreground">Cargando mentoría...</p>
            </div>
          </div>
        </div>
      </PageWrapper>
    )
  }

  if (!mentorship || !user) {
    return (
      <PageWrapper>
        <div className="page py-6">
          <div className="sticky top-0 z-10">
            <JamNav />
          </div>
          <div className="container max-w-6xl space-y-6 pl-64">
            <div className="py-12 text-center">
              <h2 className="text-2xl font-bold">Mentoría no encontrada</h2>
              <p className="mt-2 text-foreground">
                La mentoría que buscas no existe o no tienes acceso a ella.
              </p>
            </div>
          </div>
        </div>
      </PageWrapper>
    )
  }

  // Determine user role
  const userRole: 'mentor' | 'participant' = mentorship.mentorId === user.id ? 'mentor' : 'participant'
  const otherPerson = userRole === 'mentor' ? mentorship.participant : mentorship.mentor
  const otherProfile = userRole === 'mentor' ? mentorship.participantProfile : mentorship.mentorProfile

  const statusLabels = {
    active: 'Activa',
    paused: 'Pausada',
    completed: 'Completada',
  } as const

  const statusColors = {
    active: 'bg-green-500/10 text-green-700 dark:text-green-400',
    paused: 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400',
    completed: 'bg-gray-500/10 text-gray-700 dark:text-gray-400',
  } as const

  const location = [otherProfile?.cityRegion, otherProfile?.country]
    .filter(Boolean)
    .join(', ')

  return (
    <PageWrapper>
      <div className="page py-6">
        <div className="sticky top-0 z-10">
          <JamNav />
        </div>
        <div className="container max-w-6xl space-y-6 pl-64">
          {/* Mentorship Header */}
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={otherPerson?.avatarUrl || undefined} />
                    <AvatarFallback>
                      {otherPerson?.displayName?.charAt(0) || otherPerson?.username?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-2xl">
                      {userRole === 'mentor' ? 'Mentee: ' : 'Mentor: '}
                      {otherPerson?.displayName || otherPerson?.username || 'Usuario'}
                    </CardTitle>
                    {location && (
                      <div className="mt-1 flex items-center gap-2 text-sm text-foreground">
                        <MapPin className="h-4 w-4" />
                        <span>{location}</span>
                      </div>
                    )}
                  </div>
                </div>
                <Badge className={statusColors[mentorship.status as keyof typeof statusColors]}>
                  {statusLabels[mentorship.status as keyof typeof statusLabels] || mentorship.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium">Sesiones completadas</p>
                  <p className="mt-1 text-2xl font-bold">{mentorship.sessionCount}</p>
                </div>
                {userRole === 'mentor' && (
                  <SessionLogger
                    mentorshipId={mentorshipId}
                    userRole={userRole}
                  />
                )}
              </div>
            </CardContent>
          </Card>

          {/* Session Stats */}
          <SessionStats sessions={sessions} />

          {/* Session History */}
          <div>
            <h2 className="mb-4 text-2xl font-bold">Historial de Sesiones</h2>
            <SessionHistory
              mentorshipId={mentorshipId}
              mentorName={mentorship.mentor?.displayName || mentorship.mentor?.username || 'Mentor'}
            />
          </div>
        </div>
      </div>
    </PageWrapper>
  )
}
