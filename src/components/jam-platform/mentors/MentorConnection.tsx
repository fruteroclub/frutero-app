'use client'

import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { createMentorshipRequest } from '@/services/jam/mentors.service'
import { Mentor } from '@/services/jam/mentors.service'

interface MentorConnectionProps {
  mentor: Mentor
  userId: string
  hasExistingConnection: boolean
}

export function MentorConnection({
  mentor,
  userId,
  hasExistingConnection,
}: MentorConnectionProps) {
  const [message, setMessage] = useState('')
  const [goals, setGoals] = useState('')
  const queryClient = useQueryClient()

  const createConnection = useMutation({
    mutationFn: () =>
      createMentorshipRequest(mentor.id, userId, message, goals),
    onSuccess: () => {
      toast.success('¡Solicitud enviada!', {
        description: 'El mentor recibirá tu solicitud de mentoría.',
      })
      setMessage('')
      setGoals('')
      queryClient.invalidateQueries({
        queryKey: ['mentorship-status', mentor.id, userId],
      })
    },
    onError: (error: Error) => {
      toast.error('Error al enviar solicitud', {
        description: error.message,
      })
    },
  })

  if (hasExistingConnection) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Conexión Existente</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-foreground">
            Ya tienes una conexión de mentoría con{' '}
            {mentor.displayName || 'este mentor'}.
          </p>
        </CardContent>
      </Card>
    )
  }

  if (mentor.isAtCapacity) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Capacidad Máxima</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-foreground">
            Este mentor actualmente está en capacidad máxima y no puede aceptar
            nuevos mentees.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Solicitar Mentoría</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="message">Mensaje de Presentación</Label>
          <Textarea
            id="message"
            placeholder="Cuéntale al mentor sobre ti y por qué quieres trabajar con él/ella..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={4}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="goals">Objetivos de Mentoría</Label>
          <Textarea
            id="goals"
            placeholder="¿Qué esperas lograr con esta mentoría? Sé específico..."
            value={goals}
            onChange={(e) => setGoals(e.target.value)}
            rows={4}
          />
        </div>

        <Button
          onClick={() => createConnection.mutate()}
          disabled={!message || !goals || createConnection.isPending}
          className="w-full"
        >
          {createConnection.isPending ? 'Enviando...' : 'Enviar Solicitud'}
        </Button>
      </CardContent>
    </Card>
  )
}
