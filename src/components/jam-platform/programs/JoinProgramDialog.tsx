'use client'

import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Plus, Calendar } from 'lucide-react'
import {
  getAllPrograms,
  getProjectPrograms,
  joinProgram,
  type Program,
} from '@/services/jam/programs.service'

interface JoinProgramDialogProps {
  projectSlug: string
}

export function JoinProgramDialog({ projectSlug }: JoinProgramDialogProps) {
  const [open, setOpen] = useState(false)
  const queryClient = useQueryClient()

  const { data: availablePrograms = [], isLoading } = useQuery<Program[]>({
    queryKey: ['available-programs', projectSlug],
    queryFn: async () => {
      const allPrograms = await getAllPrograms()
      const projectPrograms = await getProjectPrograms(projectSlug)

      // Filter out already joined programs
      const joinedProgramIds = projectPrograms.map((pp) => pp.program.id)
      return allPrograms.filter((p) => !joinedProgramIds.includes(p.id))
    },
    enabled: open,
  })

  const joinMutation = useMutation({
    mutationFn: (programId: string) => joinProgram(projectSlug, programId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['project-programs', projectSlug],
      })
      queryClient.invalidateQueries({
        queryKey: ['available-programs', projectSlug],
      })
      setOpen(false)
    },
  })

  const handleJoinProgram = (programId: string) => {
    if (!confirm('¿Unirse a este programa?')) return
    joinMutation.mutate(programId)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Unirse a Programa
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[80vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Unirse a un Programa</DialogTitle>
          <DialogDescription>
            Selecciona un programa para participar. Tu proyecto tendrá acceso a
            los quests y recursos del programa.
          </DialogDescription>
        </DialogHeader>

        {isLoading && (
          <p className="py-8 text-center text-foreground">
            Cargando programas disponibles...
          </p>
        )}

        {!isLoading && availablePrograms.length === 0 && (
          <Card className="p-6 text-center">
            <p className="text-foreground">
              No hay programas disponibles en este momento.
            </p>
          </Card>
        )}

        {!isLoading && availablePrograms.length > 0 && (
          <div className="space-y-3">
            {availablePrograms.map((program) => (
              <Card
                key={program.id}
                className="transition-colors hover:border-primary"
              >
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{program.name}</CardTitle>
                      <div className="mt-2 flex flex-wrap items-center gap-2">
                        <Badge variant="secondary">{program.type}</Badge>
                        <Badge variant="outline">{program.status}</Badge>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => handleJoinProgram(program.id)}
                      disabled={joinMutation.isPending}
                    >
                      Unirse
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="line-clamp-2 text-sm text-foreground">
                    {program.description}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-foreground">
                    <Calendar className="h-3 w-3" />
                    <span>
                      Inicio:{' '}
                      {new Date(program.startDate).toLocaleDateString('es-ES')}
                    </span>
                    {program.endDate && (
                      <>
                        <span>-</span>
                        <span>
                          Fin:{' '}
                          {new Date(program.endDate).toLocaleDateString(
                            'es-ES',
                          )}
                        </span>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
