'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Calendar, CheckCircle2, MoreVertical, XCircle } from 'lucide-react'
import {
  updateProgramStatus,
  leaveProgram,
  type ProgramParticipation,
} from '@/services/jam/programs.service'

interface ProgramParticipationCardProps {
  programParticipation: ProgramParticipation
  projectSlug: string
  isAdmin: boolean
  completed?: boolean
}

export function ProgramParticipationCard({
  programParticipation,
  projectSlug,
  isAdmin,
  completed = false,
}: ProgramParticipationCardProps) {
  const queryClient = useQueryClient()

  const markCompleteMutation = useMutation({
    mutationFn: () =>
      updateProgramStatus(
        projectSlug,
        programParticipation.program.id,
        'COMPLETED',
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['project-programs', projectSlug],
      })
    },
  })

  const withdrawMutation = useMutation({
    mutationFn: () =>
      leaveProgram(projectSlug, programParticipation.program.id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['project-programs', projectSlug],
      })
    },
  })

  const handleMarkComplete = () => {
    if (!confirm('¿Marcar este programa como completado?')) return
    markCompleteMutation.mutate()
  }

  const handleWithdraw = () => {
    if (!confirm('¿Retirarse de este programa?')) return
    withdrawMutation.mutate()
  }

  const isPending = markCompleteMutation.isPending || withdrawMutation.isPending

  return (
    <Card className={completed ? 'opacity-75' : ''}>
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <CardTitle className="text-lg">
              {programParticipation.program.name}
            </CardTitle>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <Badge
                variant={completed ? 'secondary' : 'default'}
                className="flex items-center gap-1"
              >
                {completed ? (
                  <>
                    <CheckCircle2 className="h-3 w-3" />
                    Completado
                  </>
                ) : (
                  'Activo'
                )}
              </Badge>
              <span className="text-xs text-foreground">
                Unido el{' '}
                {new Date(programParticipation.joinedAt).toLocaleDateString(
                  'es-ES',
                )}
              </span>
            </div>
          </div>

          {isAdmin && !completed && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" disabled={isPending}>
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleMarkComplete}>
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Marcar como Completado
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleWithdraw}
                  className="text-destructive"
                >
                  <XCircle className="mr-2 h-4 w-4" />
                  Retirarse del Programa
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="line-clamp-2 text-sm text-foreground">
          {programParticipation.program.description}
        </p>

        {programParticipation.program.endDate && (
          <div className="flex items-center gap-2 text-sm text-foreground">
            <Calendar className="h-4 w-4" />
            <span>
              Finaliza:{' '}
              {new Date(
                programParticipation.program.endDate,
              ).toLocaleDateString('es-ES')}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
