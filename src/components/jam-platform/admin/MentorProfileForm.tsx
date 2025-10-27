'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { X, Plus } from 'lucide-react'
import { createMentorProfileSchema, EXPERTISE_AREAS } from '@/server/schema/mentor-schema'
import type { CreateMentorProfileInput } from '@/server/schema/mentor-schema'
import {
  createMentorProfile,
  getNonMentorUsers,
  type SelectableUser,
} from '@/services/jam/mentor-management.service'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

interface MentorProfileFormProps {
  trigger?: React.ReactNode
  onSuccess?: () => void
}

export function MentorProfileForm({ trigger, onSuccess }: MentorProfileFormProps) {
  const [open, setOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<SelectableUser | null>(null)
  const [expertiseInput, setExpertiseInput] = useState('')
  const [expertiseList, setExpertiseList] = useState<string[]>([])
  const queryClient = useQueryClient()

  const { data: availableUsers = [] } = useQuery<SelectableUser[]>({
    queryKey: ['non-mentor-users'],
    queryFn: async () => {
      const result = await getNonMentorUsers()
      return result.data || []
    },
    enabled: open,
  })

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<CreateMentorProfileInput>({
    resolver: zodResolver(createMentorProfileSchema),
    defaultValues: {
      userId: '',
      availability: 'UNAVAILABLE' as const,
      maxParticipants: 5,
      expertiseAreas: [],
    },
  })

  const availability = watch('availability')

  const createMutation = useMutation({
    mutationFn: createMentorProfile,
    onSuccess: () => {
      toast.success('Mentor profile creado exitosamente')
      queryClient.invalidateQueries({ queryKey: ['mentor-profiles'] })
      queryClient.invalidateQueries({ queryKey: ['non-mentor-users'] })
      setOpen(false)
      reset()
      setSelectedUser(null)
      setExpertiseList([])
      onSuccess?.()
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Error al crear mentor profile')
    },
  })

  const addExpertise = () => {
    const expertise = expertiseInput.trim().toLowerCase()
    if (expertise && !expertiseList.includes(expertise)) {
      const newList = [...expertiseList, expertise]
      setExpertiseList(newList)
      setValue('expertiseAreas', newList)
      setExpertiseInput('')
    }
  }

  const removeExpertise = (expertise: string) => {
    const newList = expertiseList.filter((e) => e !== expertise)
    setExpertiseList(newList)
    setValue('expertiseAreas', newList)
  }

  const onSubmit = (data: CreateMentorProfileInput) => {
    if (!selectedUser) {
      toast.error('Selecciona un usuario')
      return
    }

    createMutation.mutate({
      ...data,
      userId: selectedUser.id,
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Crear Mentor Profile
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Crear Mentor Profile</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* User Selection */}
          <div className="space-y-2">
            <Label>Usuario *</Label>
            {selectedUser ? (
              <div className="flex items-center justify-between rounded-md border p-3">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={selectedUser.avatarUrl || undefined} />
                    <AvatarFallback>
                      {selectedUser.displayName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{selectedUser.displayName}</p>
                    <p className="text-sm text-foreground">{selectedUser.email}</p>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSelectedUser(null)
                    setValue('userId', '')
                  }}
                >
                  Cambiar
                </Button>
              </div>
            ) : (
              <Select
                onValueChange={(userId) => {
                  const user = availableUsers.find((u) => u.id === userId)
                  if (user) {
                    setSelectedUser(user)
                    setValue('userId', user.id)
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar usuario..." />
                </SelectTrigger>
                <SelectContent>
                  {availableUsers.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={user.avatarUrl || undefined} />
                          <AvatarFallback>{user.displayName.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span>{user.displayName}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            {errors.userId && (
              <p className="text-sm text-destructive">{errors.userId.message}</p>
            )}
          </div>

          {/* Availability */}
          <div className="space-y-2">
            <Label>Disponibilidad *</Label>
            <Select
              value={availability}
              onValueChange={(value) => setValue('availability', value as 'AVAILABLE' | 'LIMITED' | 'UNAVAILABLE')}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="AVAILABLE">Disponible</SelectItem>
                <SelectItem value="LIMITED">Limitada</SelectItem>
                <SelectItem value="UNAVAILABLE">No disponible</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Max Participants */}
          <div className="space-y-2">
            <Label>Máximo de Participantes *</Label>
            <Input
              type="number"
              min="1"
              max="50"
              {...register('maxParticipants', { valueAsNumber: true })}
            />
            {errors.maxParticipants && (
              <p className="text-sm text-destructive">{errors.maxParticipants.message}</p>
            )}
          </div>

          {/* Expertise Areas */}
          <div className="space-y-2">
            <Label>Áreas de Experiencia *</Label>
            <div className="flex gap-2">
              <Select value={expertiseInput} onValueChange={setExpertiseInput}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Seleccionar área..." />
                </SelectTrigger>
                <SelectContent>
                  {EXPERTISE_AREAS.filter((area) => !expertiseList.includes(area)).map(
                    (area) => (
                      <SelectItem key={area} value={area}>
                        {area}
                      </SelectItem>
                    )
                  )}
                </SelectContent>
              </Select>
              <Button type="button" onClick={addExpertise} size="icon">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {expertiseList.map((expertise) => (
                <Badge key={expertise} variant="secondary">
                  {expertise}
                  <button
                    type="button"
                    onClick={() => removeExpertise(expertise)}
                    className="ml-2"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
            {errors.expertiseAreas && (
              <p className="text-sm text-destructive">{errors.expertiseAreas.message}</p>
            )}
          </div>

          {/* Mentoring Approach */}
          <div className="space-y-2">
            <Label>Enfoque de Mentoría</Label>
            <Textarea
              {...register('mentoringApproach')}
              placeholder="Describe tu enfoque para mentorear participantes..."
              rows={4}
            />
          </div>

          {/* Experience */}
          <div className="space-y-2">
            <Label>Experiencia</Label>
            <Textarea
              {...register('experience')}
              placeholder="Describe tu experiencia relevante..."
              rows={4}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={createMutation.isPending}
              className="flex-1"
            >
              {createMutation.isPending ? 'Creando...' : 'Crear Mentor'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
