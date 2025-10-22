'use client'

import { useQuery } from '@tanstack/react-query'
import { SessionCard } from './SessionCard'
import {
  getMentorshipSessions,
  type MentorshipSession,
} from '@/services/jam/mentors.service'

interface SessionHistoryProps {
  mentorshipId: string
  mentorName?: string
  participantName?: string
}

export function SessionHistory({
  mentorshipId,
  mentorName,
  participantName,
}: SessionHistoryProps) {
  const { data: sessions = [], isLoading } = useQuery<MentorshipSession[]>({
    queryKey: ['mentorship-sessions', mentorshipId],
    queryFn: async () => {
      const result = await getMentorshipSessions(mentorshipId)
      return result.data || []
    },
  })

  if (isLoading) {
    return (
      <div className="py-8 text-center">
        <p className="text-foreground">Cargando sesiones...</p>
      </div>
    )
  }

  if (sessions.length === 0) {
    return (
      <div className="py-8 text-center">
        <p className="text-foreground">
          No hay sesiones registradas todavía. ¡Registra tu primera sesión!
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {sessions.map((session) => (
        <SessionCard
          key={session.id}
          session={session}
          mentorName={mentorName}
          participantName={participantName}
          showRole={true}
        />
      ))}
    </div>
  )
}
