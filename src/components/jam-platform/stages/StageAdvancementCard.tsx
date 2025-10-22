'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { ArrowRight, Check, X, Loader2, Trophy } from 'lucide-react'
import { STAGES } from '@/lib/jam/stages'
import {
  checkStageAdvancement,
  advanceProjectStage,
} from '@/services/jam/stages.service'
import { toast } from 'sonner'

interface StageAdvancementCardProps {
  projectSlug: string
}

export function StageAdvancementCard({
  projectSlug,
}: StageAdvancementCardProps) {
  const queryClient = useQueryClient()
  const [advancing, setAdvancing] = useState(false)

  const { data: advancementCheck, isLoading } = useQuery({
    queryKey: ['stage-advancement', projectSlug],
    queryFn: () => checkStageAdvancement(projectSlug),
  })

  const advanceMutation = useMutation({
    mutationFn: () => advanceProjectStage(projectSlug),
    onSuccess: () => {
      toast.success('¡Stage avanzado exitosamente!')
      queryClient.invalidateQueries({
        queryKey: ['stage-advancement', projectSlug],
      })
      queryClient.invalidateQueries({ queryKey: ['project', projectSlug] })
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Error al avanzar stage')
    },
  })

  const handleAdvance = async () => {
    setAdvancing(true)
    try {
      await advanceMutation.mutateAsync()
    } finally {
      setAdvancing(false)
    }
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex h-48 items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-foreground" />
        </CardContent>
      </Card>
    )
  }

  if (!advancementCheck) {
    return null
  }

  const {
    canAdvance,
    currentStage,
    nextStage,
    missingRequirements,
    questsCompleted,
    teamMembersCount,
  } = advancementCheck

  if (!nextStage) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-600" />
            <CardTitle>Stage Máximo Alcanzado</CardTitle>
          </div>
          <CardDescription>
            ¡Felicitaciones! Has alcanzado el stage más alto disponible.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertDescription>
              Tu proyecto está en el stage {STAGES[currentStage].title}.
              Continúa desarrollando y mejorando tu proyecto.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    )
  }

  const currentStageConfig = STAGES[currentStage]
  const nextStageConfig = STAGES[nextStage]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="text-2xl">{currentStageConfig.icon}</span>
          Avance de Stage
          <ArrowRight className="h-4 w-4 text-foreground" />
          <span className="text-2xl">{nextStageConfig.icon}</span>
        </CardTitle>
        <CardDescription>
          De {currentStageConfig.title} a {nextStageConfig.title}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Next Stage Info */}
        <div className="rounded-lg bg-muted p-4">
          <h4 className="mb-2 font-semibold">{nextStageConfig.title}</h4>
          <p className="text-sm text-foreground">
            {nextStageConfig.description}
          </p>
        </div>

        {/* Current Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-lg border p-3">
            <p className="text-sm text-foreground">Quests Completados</p>
            <p className="text-2xl font-bold">{questsCompleted}</p>
          </div>
          <div className="rounded-lg border p-3">
            <p className="text-sm text-foreground">Miembros del Equipo</p>
            <p className="text-2xl font-bold">{teamMembersCount || 1}</p>
          </div>
        </div>

        {/* Requirements Check */}
        <div className="space-y-2">
          <p className="text-sm font-medium">Requisitos para Avanzar</p>

          {canAdvance ? (
            <Alert>
              <Check className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-600">
                ¡Todos los requisitos cumplidos! Puedes avanzar al siguiente
                stage.
              </AlertDescription>
            </Alert>
          ) : (
            <div className="space-y-2">
              {missingRequirements?.map((requirement, index) => (
                <div
                  key={index}
                  className="flex items-start gap-2 rounded-lg border border-destructive/50 bg-destructive/10 p-3"
                >
                  <X className="mt-0.5 h-4 w-4 flex-shrink-0 text-destructive" />
                  <span className="text-sm text-destructive">
                    {requirement}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Next Stage Requirements Preview */}
        <div className="space-y-2">
          <p className="text-sm font-medium">
            Requisitos del {nextStageConfig.title}
          </p>
          <ul className="space-y-1">
            {nextStageConfig.requirements.map((req, index) => (
              <li
                key={index}
                className="flex items-start gap-2 text-sm text-foreground"
              >
                <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-foreground" />
                <span>{req}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Action Button */}
        <Button
          onClick={handleAdvance}
          disabled={!canAdvance || advancing}
          className="w-full"
          size="lg"
        >
          {advancing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {advancing ? 'Avanzando...' : `Avanzar a ${nextStageConfig.title}`}
        </Button>
      </CardContent>
    </Card>
  )
}
