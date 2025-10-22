'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  getProgressToNextStage,
  getNextStage,
  STAGES,
  type ProjectStage,
} from '@/lib/jam/stages'
import { toast } from 'sonner'
import { Rocket, CheckCircle2 } from 'lucide-react'

interface StageProgressProps {
  projectSlug: string
  currentStage: ProjectStage
  questsCompleted: number
  canAdvance: boolean
  reason?: string
}

export function StageProgress({
  projectSlug,
  currentStage,
  questsCompleted,
  canAdvance,
  reason,
}: StageProgressProps) {
  const queryClient = useQueryClient()
  const nextStage = getNextStage(currentStage)
  const progressInfo = getProgressToNextStage(currentStage, questsCompleted)

  const advanceStage = useMutation({
    mutationFn: async () => {
      const response = await fetch(
        `/api/jam/projects/${projectSlug}/stage/advance`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ manualOverride: false }),
        },
      )

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to advance stage')
      }

      return response.json()
    },
    onSuccess: (data: { project: { stage: ProjectStage } }) => {
      toast.success(
        `<� �Proyecto avanzado a ${STAGES[data.project.stage].title}!`,
      )
      queryClient.invalidateQueries({ queryKey: ['project', projectSlug] })
      queryClient.invalidateQueries({ queryKey: ['stage-check', projectSlug] })
    },
    onError: (error: Error) => {
      toast.error(error.message || 'No se pudo avanzar de etapa')
    },
  })

  // If at final stage
  if (!nextStage) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-green-600" />
            �Proyecto Completado!
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center">
            <div className="mb-4 text-6xl">{STAGES[currentStage].icon}</div>
            <p className="text-foreground">
              Has alcanzado la etapa final. �Sigue construyendo y escalando tu
              proyecto!
            </p>
            <Badge className="mt-4" variant="default">
              {questsCompleted} quests completados
            </Badge>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!progressInfo) {
    return null
  }

  const { progress, questsNeeded, questsRemaining } = progressInfo

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Progreso a {STAGES[nextStage].title}</span>
          <Badge variant="outline">
            {questsCompleted}/{questsNeeded} quests
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Progress Bar */}
        <div className="space-y-2">
          <Progress value={progress} className="h-3" />
          <div className="flex justify-between text-sm text-foreground">
            <span>{progress}% completado</span>
            {questsRemaining > 0 && (
              <span>{questsRemaining} quests restantes</span>
            )}
          </div>
        </div>

        {/* Next Stage Info */}
        <div className="rounded-lg border bg-muted/50 p-3">
          <div className="flex items-start gap-3">
            <span className="text-3xl">{STAGES[nextStage].icon}</span>
            <div className="flex-1">
              <h4 className="font-medium">{STAGES[nextStage].title}</h4>
              <p className="text-sm text-foreground">
                {STAGES[nextStage].description}
              </p>
            </div>
          </div>
        </div>

        {/* Action Button */}
        {canAdvance ? (
          <Button
            onClick={() => advanceStage.mutate()}
            disabled={advanceStage.isPending}
            className="w-full"
            size="lg"
          >
            <Rocket className="mr-2 h-4 w-4" />
            {advanceStage.isPending
              ? 'Avanzando...'
              : `Avanzar a ${STAGES[nextStage].title}`}
          </Button>
        ) : (
          <div className="rounded-lg bg-yellow-50 p-3 text-sm text-yellow-800 dark:bg-yellow-950 dark:text-yellow-200">
            {reason || 'Completa m�s quests para avanzar'}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
