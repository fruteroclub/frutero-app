'use client'

import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { UserPlus } from 'lucide-react'

interface InviteMemberDialogProps {
  projectSlug: string
}

export function InviteMemberDialog({ projectSlug }: InviteMemberDialogProps) {
  const [open, setOpen] = useState(false)
  const [userId, setUserId] = useState('')
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: async (data: { userId: string }) => {
      const res = await fetch(`/api/jam/projects/${projectSlug}/members`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: data.userId, role: 'MEMBER' }),
      })

      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error || 'Failed to add member')
      }

      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project-members', projectSlug] })
      setOpen(false)
      setUserId('')
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    mutation.mutate({ userId })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <UserPlus className="h-4 w-4 mr-2" />
          Agregar Miembro
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Agregar Miembro al Equipo</DialogTitle>
          <DialogDescription>
            Invita a un usuario a unirse al proyecto
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mutation.error && (
            <div className="rounded-md border border-destructive bg-destructive/10 p-3 text-sm text-destructive">
              {mutation.error instanceof Error
                ? mutation.error.message
                : 'Failed to add member'}
            </div>
          )}

          <div>
            <Label htmlFor="userId">ID de Usuario o Email</Label>
            <Input
              id="userId"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              placeholder="did:privy:... o usuario@ejemplo.com"
              required
            />
            <p className="text-xs text-muted-foreground mt-1">
              Ingresa el ID de Privy del usuario o su email
            </p>
          </div>

          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={mutation.isPending}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? 'Agregando...' : 'Agregar Miembro'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
