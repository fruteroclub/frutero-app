'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { TRACKS } from '@/lib/jam/tracks'
import { Sprout, Rocket, Briefcase, Target, AlertCircle } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { toast } from 'sonner'
import type { Track } from '@/types/jam'
import { cn } from '@/lib/utils'

const TRACK_ICONS = {
  LEARNING: Sprout,
  FOUNDER: Rocket,
  PROFESSIONAL: Briefcase,
  FREELANCER: Target,
}

interface TrackChangerProps {
  userId: string
  currentTrack: Track
  trackChangeCount: number
  onTrackChanged?: (newTrack: Track) => void
}

export function TrackChanger({
  userId,
  currentTrack,
  trackChangeCount = 0,
  onTrackChanged,
}: TrackChangerProps) {
  const [selectedTrack, setSelectedTrack] = useState<Track>(currentTrack)
  const [isUpdating, setIsUpdating] = useState(false)

  const remainingChanges = 2 - trackChangeCount
  const canChangeTrack = remainingChanges > 0

  const handleSaveTrack = async () => {
    if (selectedTrack === currentTrack) {
      toast.info('No has cambiado tu ruta')
      return
    }

    if (!canChangeTrack) {
      toast.error('Has alcanzado el límite de cambios de ruta')
      return
    }

    setIsUpdating(true)

    try {
      const response = await fetch('/api/jam/settings/track', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, track: selectedTrack }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update track')
      }

      toast.success(`Ruta cambiada a ${TRACKS[selectedTrack].titleEs}`, {
        description: `Te quedan ${data.remainingChanges} cambios disponibles`,
      })

      onTrackChanged?.(selectedTrack)
    } catch (error) {
      console.error('Error updating track:', error)
      toast.error(
        error instanceof Error ? error.message : 'Error al cambiar de ruta'
      )
      setSelectedTrack(currentTrack) // Reset to current track on error
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <div className="space-y-6">
      {!canChangeTrack && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Has alcanzado el límite de 2 cambios de ruta. Contacta al equipo si
            necesitas hacer un cambio adicional.
          </AlertDescription>
        </Alert>
      )}

      {canChangeTrack && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Puedes cambiar de ruta hasta {remainingChanges} {remainingChanges === 1 ? 'vez' : 'veces'} más.
            Elige cuidadosamente ya que esto afectará tus quests y mentores recomendados.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {(Object.entries(TRACKS) as [Track, typeof TRACKS[Track]][]).map(
          ([key, track]) => {
            const Icon = TRACK_ICONS[key]
            const isSelected = selectedTrack === key
            const isCurrent = currentTrack === key

            return (
              <Card
                key={key}
                className={cn(
                  'cursor-pointer transition-all hover:shadow-lg',
                  isSelected && 'ring-2 ring-primary',
                  !canChangeTrack && !isCurrent && 'cursor-not-allowed opacity-50'
                )}
                onClick={() => {
                  if (canChangeTrack || isCurrent) {
                    setSelectedTrack(key)
                  }
                }}
              >
                <CardHeader className="text-center">
                  <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <div className="mb-2 text-3xl">{track.icon}</div>
                  <CardTitle className="text-lg">{track.titleEs}</CardTitle>
                  <CardDescription className="text-xs">
                    {track.descriptionEs}
                  </CardDescription>
                </CardHeader>

                <CardContent>
                  <ul className="space-y-1 text-xs text-muted-foreground">
                    {track.goalsEs.slice(0, 2).map((goal, i) => (
                      <li key={i} className="flex items-start gap-1">
                        <span className="text-primary">✓</span>
                        <span>{goal}</span>
                      </li>
                    ))}
                  </ul>
                  {isCurrent && (
                    <div className="mt-3">
                      <span className="rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                        Ruta Actual
                      </span>
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          }
        )}
      </div>

      {canChangeTrack && selectedTrack !== currentTrack && (
        <div className="flex justify-end">
          <Button onClick={handleSaveTrack} disabled={isUpdating}>
            {isUpdating ? 'Guardando...' : 'Cambiar Ruta'}
          </Button>
        </div>
      )}
    </div>
  )
}
