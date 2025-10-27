'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Calendar, ExternalLink, Users, AlertCircle } from 'lucide-react'
import type { Program } from '@/services/jam/programs.service'

interface ProgramCardProps {
  program: Program
  showJoinButton?: boolean
  onJoin?: (programId: string) => void
}

function getDaysUntil(dateString?: string): number {
  if (!dateString) return 999
  const targetDate = new Date(dateString)
  const today = new Date()
  const diffTime = targetDate.getTime() - today.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays
}

export function ProgramCard({
  program,
  showJoinButton = true,
  onJoin,
}: ProgramCardProps) {
  const daysUntilDeadline = getDaysUntil(program.submissionDeadline)
  const isUrgent = daysUntilDeadline <= 3 && daysUntilDeadline > 0
  const isPast = daysUntilDeadline < 0

  return (
    <Card className="flex h-full flex-col transition-shadow hover:shadow-lg">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <CardTitle className="text-xl">
              <Link
                href={`/jam/programs/${program.id}`}
                className="hover:underline"
              >
                {program.name}
              </Link>
            </CardTitle>
            {program.organizer && (
              <p className="mt-1 text-sm text-foreground">
                por {program.organizer}
              </p>
            )}
          </div>
          {program.avatarUrl && (
            <Image
              src={program.avatarUrl}
              alt={program.name}
              width={64}
              height={64}
              className="h-16 w-16 rounded object-cover"
            />
          )}
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          <Badge variant="secondary">{program.type}</Badge>
          {program.tracks?.slice(0, 3).map((track) => (
            <Badge key={track} variant="outline">
              {track}
            </Badge>
          ))}
          {program.tracks && program.tracks.length > 3 && (
            <Badge variant="outline">+{program.tracks.length - 3} más</Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col">
        <p className="mb-4 line-clamp-3 text-foreground">
          {program.description}
        </p>

        <div className="mb-4 space-y-2 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-foreground">Inicio:</span>
            <span className="font-medium">
              {new Date(program.startDate).toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })}
            </span>
          </div>

          {program.endDate && (
            <div className="flex items-center justify-between">
              <span className="text-foreground">Fin:</span>
              <span className="font-medium">
                {new Date(program.endDate).toLocaleDateString('es-ES', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })}
              </span>
            </div>
          )}

          {program.submissionDeadline && !isPast && (
            <div
              className={`flex items-center justify-between ${
                isUrgent ? 'font-semibold text-red-500' : ''
              }`}
            >
              <span className="flex items-center gap-1">
                {isUrgent && <AlertCircle className="h-4 w-4" />}
                Cierre de aplicaciones:
              </span>
              <span>{daysUntilDeadline} días</span>
            </div>
          )}

          {program.participantCount !== undefined && (
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1 text-foreground">
                <Users className="h-4 w-4" />
                Participantes:
              </span>
              <span className="font-medium">{program.participantCount}</span>
            </div>
          )}
        </div>

        <div className="mt-auto flex gap-2 pt-4">
          {showJoinButton && onJoin && (
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={() => onJoin(program.id)}
            >
              <Calendar className="mr-2 h-4 w-4" />
              Seguir
            </Button>
          )}
          {program.applicationUrl && (
            <Button size="sm" className="flex-1" asChild>
              <a
                href={program.applicationUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                Aplicar
              </a>
            </Button>
          )}
          {!program.applicationUrl && (
            <Button size="sm" className="flex-1" asChild>
              <Link href={`/jam/programs/${program.id}`}>Ver Detalles</Link>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
