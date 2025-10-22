'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAppAuth } from '@/store/auth-context'
import PageWrapper from '@/components/layout/page-wrapper'
import { JamNav } from '@/components/jam-platform/navigation/JamNav'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
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
import { X, Plus, Save, AlertCircle } from 'lucide-react'
import { mentorSettingsSchema, EXPERTISE_AREAS } from '@/server/schema/mentor-schema'
import type { MentorSettingsInput } from '@/server/schema/mentor-schema'
import {
  getMentorSettings,
  updateMentorSettings,
  type MentorProfileFull,
} from '@/services/jam/mentor-management.service'

export default function MentorSettingsPage() {
  const { user, isAppAuthenticated } = useAppAuth()
  const queryClient = useQueryClient()
  const [expertiseInput, setExpertiseInput] = useState('')
  const [expertiseList, setExpertiseList] = useState<string[]>([])

  const { data: mentorProfile, isLoading } = useQuery<MentorProfileFull>({
    queryKey: ['mentor-settings', user?.id],
    queryFn: async () => {
      if (!user?.id) throw new Error('User not authenticated')
      const result = await getMentorSettings(user.id)
      if (!result.data) throw new Error('Mentor profile not found')
      return result.data
    },
    enabled: isAppAuthenticated && !!user,
    onSuccess: (data) => {
      setExpertiseList(data.expertiseAreas)
    },
  })

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<MentorSettingsInput>({
    resolver: zodResolver(mentorSettingsSchema),
    values: mentorProfile ? {
      availability: mentorProfile.availability,
      maxParticipants: mentorProfile.maxParticipants,
      expertiseAreas: mentorProfile.expertiseAreas,
      mentoringApproach: mentorProfile.mentoringApproach || '',
      experience: mentorProfile.experience || '',
    } : undefined,
  })

  const availability = watch('availability')

  const updateMutation = useMutation({
    mutationFn: (data: MentorSettingsInput) => {
      if (!user?.id) throw new Error('User not authenticated')
      return updateMentorSettings(user.id, data)
    },
    onSuccess: () => {
      toast.success('Configuración actualizada')
      queryClient.invalidateQueries({ queryKey: ['mentor-settings'] })
      queryClient.invalidateQueries({ queryKey: ['mentor-profiles'] })
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Error al actualizar configuración')
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

  const onSubmit = (data: MentorSettingsInput) => {
    updateMutation.mutate(data)
  }

  if (isLoading) {
    return (
      <PageWrapper>
        <div className="page py-6">
          <div className="sticky top-0 z-10">
            <JamNav />
          </div>
          <div className="container max-w-4xl space-y-6 pl-64">
            <div className="py-12 text-center">
              <p className="text-foreground">Cargando configuración...</p>
            </div>
          </div>
        </div>
      </PageWrapper>
    )
  }

  if (!mentorProfile) {
    return (
      <PageWrapper>
        <div className="page py-6">
          <div className="sticky top-0 z-10">
            <JamNav />
          </div>
          <div className="container max-w-4xl space-y-6 pl-64">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-yellow-600" />
                  <CardTitle>No eres un mentor</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-foreground">
                  No tienes un perfil de mentor activo. Contacta al administrador si deseas convertirte en mentor.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </PageWrapper>
    )
  }

  const availabilityLabels = {
    AVAILABLE: 'Disponible',
    LIMITED: 'Limitada',
    UNAVAILABLE: 'No disponible',
  }

  return (
    <PageWrapper>
      <div className="page py-6">
        <div className="sticky top-0 z-10">
          <JamNav />
        </div>
        <div className="container max-w-4xl space-y-6 pl-64">
          {/* Header */}
          <div>
            <h1 className="mb-2 text-3xl font-bold">Configuración de Mentor</h1>
            <p className="text-foreground">
              Actualiza tu disponibilidad y preferencias de mentoría
            </p>
          </div>

          {/* Settings Form */}
          <form onSubmit={handleSubmit(onSubmit)}>
            <Card>
              <CardHeader>
                <CardTitle>Preferencias de Mentoría</CardTitle>
                <CardDescription>
                  Gestiona tu disponibilidad y capacidad de participantes
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Availability */}
                <div className="space-y-2">
                  <Label>Disponibilidad</Label>
                  <Select
                    value={availability}
                    onValueChange={(value) => setValue('availability', value as any)}
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
                  <p className="text-sm text-foreground">
                    Controla si apareces en la lista de mentores disponibles
                  </p>
                </div>

                {/* Max Participants */}
                <div className="space-y-2">
                  <Label>Máximo de Participantes</Label>
                  <Input
                    type="number"
                    min="1"
                    max="50"
                    {...register('maxParticipants', { valueAsNumber: true })}
                  />
                  {errors.maxParticipants && (
                    <p className="text-sm text-destructive">{errors.maxParticipants.message}</p>
                  )}
                  <p className="text-sm text-foreground">
                    Número máximo de participantes que puedes mentorar simultáneamente
                  </p>
                </div>

                {/* Expertise Areas */}
                <div className="space-y-2">
                  <Label>Áreas de Experiencia</Label>
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
                    rows={5}
                  />
                  <p className="text-sm text-foreground">
                    Explica tu metodología y estilo de mentoría
                  </p>
                </div>

                {/* Experience */}
                <div className="space-y-2">
                  <Label>Experiencia</Label>
                  <Textarea
                    {...register('experience')}
                    placeholder="Describe tu experiencia relevante..."
                    rows={5}
                  />
                  <p className="text-sm text-foreground">
                    Comparte tu trayectoria y experiencia profesional
                  </p>
                </div>

                {/* Save Button */}
                <div className="flex justify-end">
                  <Button type="submit" disabled={updateMutation.isPending}>
                    <Save className="mr-2 h-4 w-4" />
                    {updateMutation.isPending ? 'Guardando...' : 'Guardar Cambios'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </form>
        </div>
      </div>
    </PageWrapper>
  )
}
