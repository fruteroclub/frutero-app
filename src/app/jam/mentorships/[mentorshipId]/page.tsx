'use client'

import { use } from 'react'
import { useQuery } from '@tanstack/react-query'
import PageWrapper from '@/components/layout/page-wrapper'
import { JamNav } from '@/components/jam-platform/navigation/JamNav'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { SessionLogger } from '@/components/jam-platform/mentors/SessionLogger'
import { SessionHistory } from '@/components/jam-platform/mentors/SessionHistory'
import { SessionStats } from '@/components/jam-platform/mentors/SessionStats'
import {
  getMentorshipSessions,
  type MentorshipSession,
} from '@/services/jam/mentors.service'
import { MapPin } from 'lucide-react'

export default function MentorshipDetailPage({
  params,
}: {
  params: Promise<{ mentorshipId: string }>
}) {
  const { mentorshipId } = use(params)

  // For MVP, we'll need to fetch mentorship details via a new API endpoint
  // For now, this is a placeholder showing the session tracking features

  const { data: sessions = [] } = useQuery<MentorshipSession[]>({
    queryKey: ['mentorship-sessions', mentorshipId],
    queryFn: async () => {
      const result = await getMentorshipSessions(mentorshipId)
      return result.data || []
    },
  })

  // Determine user role (would come from mentorship data in real implementation)
  const userRole: 'mentor' | 'participant' = 'participant' // Placeholder

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
                    <AvatarImage src="" />
                    <AvatarFallback>M</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-2xl">Mentoría</CardTitle>
                    <div className="mt-1 flex items-center gap-2 text-sm text-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>Ciudad de México, México</span>
                    </div>
                  </div>
                </div>
                <Badge className="bg-green-500/10 text-green-700 dark:text-green-400">
                  Activa
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Objetivos de Mentoría</p>
                  <p className="mt-1 text-sm text-foreground">
                    Aprender desarrollo frontend y construir mi primer proyecto
                    web
                  </p>
                </div>
                <SessionLogger
                  mentorshipId={mentorshipId}
                  userRole={userRole}
                />
              </div>
            </CardContent>
          </Card>

          {/* Session Stats */}
          <SessionStats sessions={sessions} />

          {/* Session History */}
          <div>
            <h2 className="mb-4 text-2xl font-bold">Historial de Sesiones</h2>
            <SessionHistory mentorshipId={mentorshipId} mentorName="Mentor" />
          </div>
        </div>
      </div>
    </PageWrapper>
  )
}
