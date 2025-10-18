import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Calendar } from 'lucide-react'
import type { MentorshipInfo } from '@/types/jam'

interface MentorshipCardProps {
  mentorship: MentorshipInfo | null
}

export function MentorshipCard({ mentorship }: MentorshipCardProps) {
  if (!mentorship) {
    return (
      <Card className="h-full flex flex-col">
        <CardHeader>
          <CardTitle>Mentoría</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 py-6 text-center">
          <p className="text-muted-foreground">No tienes un mentor asignado</p>
          <Button variant="outline" className="w-full" asChild>
            <Link href="/jam/mentors">Explorar Mentores</Link>
          </Button>
        </CardContent>
      </Card>
    )
  }

  const statusLabel = {
    active: 'Activa',
    paused: 'Pausada',
    completed: 'Completada',
  }[mentorship.status]

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>Tu Mentor</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={mentorship.mentorAvatar || undefined} />
            <AvatarFallback>{mentorship.mentorName.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <p className="font-medium">{mentorship.mentorName}</p>
            <p className="text-sm text-muted-foreground">{statusLabel}</p>
          </div>
        </div>

        <div className="space-y-2 border-t pt-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Sesiones completadas:</span>
            <span className="font-medium">{mentorship.sessionsCompleted}</span>
          </div>

          {mentorship.nextSession && (
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Próxima sesión:</span>
              <span className="font-medium">
                {new Date(mentorship.nextSession).toLocaleDateString('es-ES', {
                  day: 'numeric',
                  month: 'short',
                })}
              </span>
            </div>
          )}
        </div>

        <Button className="w-full" variant="outline" asChild>
          <Link href="/jam/mentors">Ver Detalles</Link>
        </Button>
      </CardContent>
    </Card>
  )
}
