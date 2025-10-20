import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { StarRating } from '@/components/ui/star-rating'
import { Clock, Calendar } from 'lucide-react'
import { type MentorshipSession } from '@/services/jam/mentors.service'

interface SessionCardProps {
  session: MentorshipSession
  mentorName?: string
  participantName?: string
  showRole?: boolean
}

export function SessionCard({
  session,
  mentorName,
  participantName,
  showRole = false,
}: SessionCardProps) {
  const sessionDate = new Date(session.date)
  const formattedDate = sessionDate.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            {mentorName && (
              <CardTitle className="text-lg">Sesión con {mentorName}</CardTitle>
            )}
            {participantName && (
              <CardTitle className="text-lg">Sesión con {participantName}</CardTitle>
            )}
            <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>{formattedDate}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{session.duration} minutos</span>
              </div>
              {showRole && (
                <span className="rounded-full bg-muted px-2 py-1 text-xs">
                  Registrado por: {session.loggedBy === 'mentor' ? 'Mentor' : 'Participante'}
                </span>
              )}
            </div>
          </div>
          <StarRating value={session.rating} readonly size="sm" />
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {session.objectives && (
          <div>
            <h4 className="mb-1 font-medium">Objetivos</h4>
            <p className="text-sm text-muted-foreground">{session.objectives}</p>
          </div>
        )}

        <div>
          <h4 className="mb-1 font-medium">Resultados Clave</h4>
          <p className="text-sm text-muted-foreground">{session.outcomes}</p>
        </div>

        {session.nextSteps && (
          <div>
            <h4 className="mb-1 font-medium">Próximos Pasos</h4>
            <p className="text-sm text-muted-foreground">{session.nextSteps}</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
