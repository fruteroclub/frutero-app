'use client'

import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { StarRating } from '@/components/ui/star-rating'
import { toast } from 'sonner'
import { logMentorshipSession } from '@/services/jam/mentors.service'
import { Calendar } from 'lucide-react'

interface SessionLoggerProps {
  mentorshipId: string
  userRole: 'mentor' | 'participant'
  triggerButton?: React.ReactNode
}

export function SessionLogger({ mentorshipId, userRole, triggerButton }: SessionLoggerProps) {
  const [open, setOpen] = useState(false)
  const [sessionData, setSessionData] = useState({
    date: new Date().toISOString().split('T')[0], // YYYY-MM-DD format
    duration: 60,
    objectives: '',
    outcomes: '',
    nextSteps: '',
    rating: 5,
  })

  const queryClient = useQueryClient()

  const logSession = useMutation({
    mutationFn: () =>
      logMentorshipSession(mentorshipId, {
        ...sessionData,
        loggedBy: userRole,
      }),
    onSuccess: () => {
      toast.success('Sesión registrada', {
        description: 'La sesión de mentoría ha sido registrada exitosamente.',
      })
      setOpen(false)
      setSessionData({
        date: new Date().toISOString().split('T')[0],
        duration: 60,
        objectives: '',
        outcomes: '',
        nextSteps: '',
        rating: 5,
      })
      queryClient.invalidateQueries({ queryKey: ['mentorship-sessions', mentorshipId] })
      queryClient.invalidateQueries({ queryKey: ['user-mentorships'] })
    },
    onError: (error: Error) => {
      toast.error('Error al registrar sesión', {
        description: error.message,
      })
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!sessionData.outcomes.trim()) {
      toast.error('Campo requerido', {
        description: 'Por favor completa el campo de resultados clave.',
      })
      return
    }
    logSession.mutate()
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {triggerButton || (
          <Button>
            <Calendar className="mr-2 h-4 w-4" />
            Registrar Sesión
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Registrar Sesión de Mentoría</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="date">Fecha</Label>
              <Input
                id="date"
                type="date"
                value={sessionData.date}
                onChange={(e) => setSessionData({ ...sessionData, date: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="duration">Duración (minutos)</Label>
              <Input
                id="duration"
                type="number"
                min="15"
                max="240"
                value={sessionData.duration}
                onChange={(e) =>
                  setSessionData({ ...sessionData, duration: Number(e.target.value) })
                }
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="objectives">Objetivos de la Sesión</Label>
            <Textarea
              id="objectives"
              placeholder="¿Qué planeaste cubrir en esta sesión?"
              value={sessionData.objectives}
              onChange={(e) => setSessionData({ ...sessionData, objectives: e.target.value })}
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="outcomes">Resultados Clave *</Label>
            <Textarea
              id="outcomes"
              placeholder="¿Qué se logró en esta sesión?"
              value={sessionData.outcomes}
              onChange={(e) => setSessionData({ ...sessionData, outcomes: e.target.value })}
              rows={4}
              required
            />
          </div>

          <div>
            <Label htmlFor="nextSteps">Próximos Pasos</Label>
            <Textarea
              id="nextSteps"
              placeholder="¿Qué debe pasar antes de la próxima sesión?"
              value={sessionData.nextSteps}
              onChange={(e) => setSessionData({ ...sessionData, nextSteps: e.target.value })}
              rows={3}
            />
          </div>

          <div>
            <Label>Tu Calificación</Label>
            <StarRating
              value={sessionData.rating}
              onChange={(rating) => setSessionData({ ...sessionData, rating })}
              size="lg"
            />
          </div>

          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={logSession.isPending} className="flex-1">
              {logSession.isPending ? 'Guardando...' : 'Guardar Sesión'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
