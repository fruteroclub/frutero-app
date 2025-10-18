'use client'

import { useQuery } from '@tanstack/react-query'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { ArrowRight, TrendingUp } from 'lucide-react'
import Link from 'next/link'
import { checkStageAdvancement } from '@/services/jam/stages.service'
import { STAGES } from '@/lib/jam/stages'

interface StageAdvancementAlertProps {
  projectSlug: string
}

/**
 * Alert component that shows when a project is eligible for stage advancement
 * Displays in project dashboard/header as a notification
 */
export function StageAdvancementAlert({ projectSlug }: StageAdvancementAlertProps) {
  const { data: advancementCheck, isLoading } = useQuery({
    queryKey: ['stage-advancement', projectSlug],
    queryFn: () => checkStageAdvancement(projectSlug),
    refetchInterval: 60000, // Recheck every minute
  })

  if (isLoading || !advancementCheck) {
    return null
  }

  const { canAdvance, nextStage } = advancementCheck

  if (!canAdvance || !nextStage) {
    return null
  }

  const nextStageConfig = STAGES[nextStage]

  return (
    <Alert className="border-primary bg-primary/10">
      <TrendingUp className="h-4 w-4 text-primary" />
      <AlertDescription className="flex items-center justify-between">
        <span className="text-primary">
          ¡Felicitaciones! Tu proyecto puede avanzar a{' '}
          <span className="font-bold">
            {nextStageConfig.icon} {nextStageConfig.title}
          </span>
        </span>
        <Button size="sm" asChild variant="default">
          <Link href={`/jam/projects/${projectSlug}#stage`}>
            Avanzar Ahora <ArrowRight className="ml-1 h-3 w-3" />
          </Link>
        </Button>
      </AlertDescription>
    </Alert>
  )
}
