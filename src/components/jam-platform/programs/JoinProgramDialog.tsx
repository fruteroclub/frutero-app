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

interface Program {
  id: string
  name: string
  description: string
  type: string
  status: string
  startDate: string
  endDate?: string
}

interface ProjectProgram {
  program: {
    id: string
  }
}

interface JoinProgramDialogProps {
  projectSlug: string
}

export function JoinProgramDialog({ projectSlug }: JoinProgramDialogProps) {
  const [open, setOpen] = useState(false)
  const queryClient = useQueryClient()

  const { data: availablePrograms = [], isLoading } = useQuery<Program[]>({
    queryKey: ['available-programs', projectSlug],
    queryFn: async () => {
      const res = await fetch('/api/jam/programs')
      if (!res.ok) throw new Error('Failed to fetch programs')
      const allPrograms: Program[] = await res.json()

      // Get project's current programs
      const projectRes = await fetch(`/api/jam/projects/${projectSlug}/programs`)
      if (!projectRes.ok) throw new Error('Failed to fetch project programs')
      const projectPrograms: ProjectProgram[] = await projectRes.json()

      // Filter out already joined programs
      const joinedProgramIds = projectPrograms.map((pp) => pp.program.id)
      return allPrograms.filter((p) => !joinedProgramIds.includes(p.id))
    },
    enabled: open,
  })

  const joinMutation = useMutation({
    mutationFn: async (programId: string) => {
      const res = await fetch(`/api/jam/projects/${projectSlug}/programs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ programId }),
      })

      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error || 'Failed to join program')
      }

      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project-programs', projectSlug] })
      queryClient.invalidateQueries({ queryKey: ['available-programs', projectSlug] })
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
          <Plus className="h-4 w-4 mr-2" />
          Unirse a Programa
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Unirse a un Programa</DialogTitle>
          <DialogDescription>
            Selecciona un programa para participar. Tu proyecto tendrá acceso a los quests y recursos del programa.
          </DialogDescription>
        </DialogHeader>

        {isLoading && (
          <p className="text-center text-muted-foreground py-8">
            Cargando programas disponibles...
          </p>
        )}

        {!isLoading && availablePrograms.length === 0 && (
          <Card className="p-6 text-center">
            <p className="text-muted-foreground">
              No hay programas disponibles en este momento.
            </p>
          </Card>
        )}

        {!isLoading && availablePrograms.length > 0 && (
          <div className="space-y-3">
            {availablePrograms.map((program) => (
              <Card key={program.id} className="hover:border-primary transition-colors">
                <CardHeader>
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{program.name}</CardTitle>
                      <div className="flex items-center gap-2 mt-2 flex-wrap">
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
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {program.description}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    <span>
                      Inicio: {new Date(program.startDate).toLocaleDateString('es-ES')}
                    </span>
                    {program.endDate && (
                      <>
                        <span>-</span>
                        <span>
                          Fin: {new Date(program.endDate).toLocaleDateString('es-ES')}
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
