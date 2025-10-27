'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { useAppAuth } from '@/store/auth-context'
import PageWrapper from '@/components/layout/page-wrapper'
import { JamNav } from '@/components/jam-platform/navigation/JamNav'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Sprout, Rocket, Briefcase, Target, AlertCircle, CheckCircle2 } from 'lucide-react'
import { TRACKS, type Track } from '@/lib/jam/tracks'
import { getUserTrack, updateUserTrack, type TrackInfo } from '@/services/track-service'
import { toast } from 'sonner'

const TRACK_ICONS = {
  LEARNING: Sprout,
  FOUNDER: Rocket,
  PROFESSIONAL: Briefcase,
  FREELANCER: Target,
}

export default function TrackSettingsPage() {
  const { user, isAppAuthenticated } = useAppAuth()
  const router = useRouter()
  const queryClient = useQueryClient()
  const [selectedTrack, setSelectedTrack] = useState<Track | null>(null)

  // Fetch track info
  const { data: trackInfo, isLoading } = useQuery<TrackInfo>({
    queryKey: ['track-info', user?.id],
    queryFn: async () => {
      if (!user?.id) throw new Error('User not authenticated')
      const result = await getUserTrack(user.id)
      if (!result.data) throw new Error('Failed to fetch track info')
      setSelectedTrack(result.data.track)
      return result.data
    },
    enabled: isAppAuthenticated && !!user,
  })

  // Update track mutation
  const updateTrackMutation = useMutation({
    mutationFn: async (track: Track) => {
      if (!user?.id) throw new Error('User not authenticated')
      const result = await updateUserTrack(user.id, track)
      if (!result.success) {
        throw new Error(result.errorMsg || 'Failed to update track')
      }
      return result.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['track-info', user?.id] })
      queryClient.invalidateQueries({ queryKey: ['user', user?.id] })
      toast.success('Ruta actualizada exitosamente')
      router.push('/jam/dashboard')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Error al actualizar ruta')
    },
  })

  const handleSave = () => {
    if (!selectedTrack) {
      toast.error('Por favor selecciona una ruta')
      return
    }

    if (selectedTrack === trackInfo?.track) {
      toast.info('Ya tienes esta ruta seleccionada')
      return
    }

    updateTrackMutation.mutate(selectedTrack)
  }

  if (isLoading) {
    return (
      <PageWrapper>
        <div className="page py-6">
          <div className="sticky top-0 z-10">
            <JamNav />
          </div>
          <div className="container max-w-4xl space-y-6 pl-64">
            <p>Cargando...</p>
          </div>
        </div>
      </PageWrapper>
    )
  }

  const allTracks = Object.keys(TRACKS) as Track[]

  return (
    <PageWrapper>
      <div className="page py-6">
        <div className="sticky top-0 z-10">
          <JamNav />
        </div>
        <div className="container max-w-4xl space-y-6 pl-64">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold">Configuración de Ruta</h1>
            <p className="mt-2 text-foreground">
              Elige o cambia tu ruta de desarrollo
            </p>
          </div>

          {/* Current track info */}
          {trackInfo?.track && (
            <Alert>
              <CheckCircle2 className="h-4 w-4" />
              <AlertDescription>
                <strong>Ruta actual:</strong> {TRACKS[trackInfo.track].titleEs}
                {trackInfo.trackChangeCount > 0 && (
                  <span className="ml-2 text-sm text-foreground">
                    (Cambiada {trackInfo.trackChangeCount}{' '}
                    {trackInfo.trackChangeCount === 1 ? 'vez' : 'veces'})
                  </span>
                )}
              </AlertDescription>
            </Alert>
          )}

          {/* Track change eligibility */}
          {!trackInfo?.canChange && trackInfo?.changeReason && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{trackInfo.changeReason}</AlertDescription>
            </Alert>
          )}

          {/* Track selection */}
          <div className="grid gap-4 md:grid-cols-2">
            {allTracks.map((trackKey) => {
              const track = TRACKS[trackKey]
              const Icon = TRACK_ICONS[trackKey]
              const isSelected = selectedTrack === trackKey
              const isCurrent = trackInfo?.track === trackKey

              return (
                <Card
                  key={trackKey}
                  className={`cursor-pointer transition-all hover:shadow-lg ${
                    isSelected
                      ? 'border-primary ring-2 ring-primary'
                      : 'hover:border-primary/50'
                  }`}
                  onClick={() => setSelectedTrack(trackKey)}
                >
                  <CardHeader>
                    <div className="mb-2 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className={`rounded-lg p-2 ${
                            isSelected
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-muted'
                          }`}
                        >
                          <Icon className="h-5 w-5" />
                        </div>
                        <div className="text-2xl">{track.icon}</div>
                      </div>
                      {isCurrent && (
                        <Badge variant="secondary">Actual</Badge>
                      )}
                    </div>
                    <CardTitle className="text-lg">{track.titleEs}</CardTitle>
                    <CardDescription>{track.descriptionEs}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <h4 className="mb-2 text-sm font-semibold">Objetivos:</h4>
                    <ul className="space-y-1">
                      {track.goalsEs.slice(0, 3).map((goal, idx) => (
                        <li
                          key={idx}
                          className="flex items-start gap-2 text-xs text-foreground"
                        >
                          <span className="mt-0.5 text-primary">✓</span>
                          <span>{goal}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Info alert */}
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>Nota:</strong> Tu ruta determina las misiones y mentores
              recomendados. Puedes cambiar de ruta una vez al mes si tus
              objetivos cambian.
            </AlertDescription>
          </Alert>

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => router.push('/jam/profile')}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSave}
              disabled={
                !selectedTrack ||
                !trackInfo?.canChange ||
                updateTrackMutation.isPending
              }
              className="flex-1"
            >
              {updateTrackMutation.isPending
                ? 'Guardando...'
                : 'Guardar Cambios'}
            </Button>
          </div>
        </div>
      </div>
    </PageWrapper>
  )
}
