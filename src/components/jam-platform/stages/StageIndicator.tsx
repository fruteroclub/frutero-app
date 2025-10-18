'use client'

import { STAGES, STAGE_ORDER, calculateStageProgress, type ProjectStage } from '@/lib/jam/stages'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Check } from 'lucide-react'

interface StageIndicatorProps {
  currentStage: ProjectStage
  showProgress?: boolean
  variant?: 'compact' | 'full'
}

export function StageIndicator({ currentStage, showProgress = true, variant = 'compact' }: StageIndicatorProps) {
  const stageConfig = STAGES[currentStage]
  const progress = calculateStageProgress(currentStage)
  const currentIndex = STAGE_ORDER.indexOf(currentStage)

  if (variant === 'compact') {
    return (
      <div className="flex items-center gap-3">
        <span className="text-2xl">{stageConfig.icon}</span>
        <div>
          <Badge variant="secondary" className="mb-1">
            {stageConfig.title}
          </Badge>
          <p className="text-xs text-muted-foreground">{stageConfig.description}</p>
        </div>
        {showProgress && (
          <div className="ml-auto text-sm font-medium text-primary">
            {progress}%
          </div>
        )}
      </div>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="text-2xl">{stageConfig.icon}</span>
          Stage Actual: {stageConfig.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-muted-foreground">{stageConfig.description}</p>

        {/* Progress Bar */}
        {showProgress && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Progreso General</span>
              <span className="font-medium">{progress}%</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full bg-primary transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Stage Timeline */}
        <div className="space-y-2">
          <p className="text-sm font-medium">Progresión de Stages</p>
          <div className="flex items-center gap-2">
            {STAGE_ORDER.map((stage, index) => {
              const isPast = index < currentIndex
              const isCurrent = index === currentIndex
              const config = STAGES[stage]

              return (
                <div key={stage} className="flex flex-1 items-center">
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-full border-2 transition-all ${
                      isCurrent
                        ? 'border-primary bg-primary text-primary-foreground'
                        : isPast
                          ? 'border-primary bg-primary text-primary-foreground'
                          : 'border-muted-foreground/30 bg-background text-muted-foreground'
                    }`}
                    title={config.title}
                  >
                    {isPast ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <span className="text-xs">{config.icon}</span>
                    )}
                  </div>
                  {index < STAGE_ORDER.length - 1 && (
                    <div
                      className={`h-0.5 flex-1 ${
                        isPast ? 'bg-primary' : 'bg-muted-foreground/30'
                      }`}
                    />
                  )}
                </div>
              )
            })}
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            {STAGE_ORDER.map((stage) => (
              <span key={stage} className="flex-1 text-center">
                {STAGES[stage].title}
              </span>
            ))}
          </div>
        </div>

        {/* Requirements */}
        <div className="space-y-2">
          <p className="text-sm font-medium">Requisitos del Stage</p>
          <ul className="space-y-1">
            {stageConfig.requirements.map((req, index) => (
              <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                <span>{req}</span>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
