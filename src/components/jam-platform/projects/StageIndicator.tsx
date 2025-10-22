'use client'

import { Badge } from '@/components/ui/badge'
import {
  STAGES,
  STAGE_ORDER,
  getStageIndex,
  type ProjectStage,
} from '@/lib/jam/stages'
import { cn } from '@/lib/utils'

interface StageIndicatorProps {
  currentStage: ProjectStage
  className?: string
}

export function StageIndicator({
  currentStage,
  className,
}: StageIndicatorProps) {
  const currentIndex = getStageIndex(currentStage)

  return (
    <div className={cn('space-y-6', className)}>
      {/* Stage Timeline */}
      <div className="relative">
        <div className="flex items-center justify-between">
          {STAGE_ORDER.map((stageName, index) => {
            const stageConfig = STAGES[stageName]
            const isCompleted = index < currentIndex
            const isCurrent = index === currentIndex

            return (
              <div key={stageName} className="flex flex-1 items-center">
                {/* Stage Circle */}
                <div className="relative z-10 flex flex-col items-center">
                  <div
                    className={cn(
                      'flex h-10 w-10 items-center justify-center rounded-full border-2 text-lg transition-all',
                      isCompleted &&
                        'border-green-600 bg-green-600 text-white dark:border-green-500 dark:bg-green-500',
                      isCurrent &&
                        'border-primary bg-primary text-primary-foreground shadow-lg ring-4 ring-primary/20',
                      !isCompleted &&
                        !isCurrent &&
                        'border-gray-300 bg-white text-gray-400 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-500',
                    )}
                  >
                    {stageConfig.icon}
                  </div>

                  {/* Stage Label */}
                  <div className="mt-2 text-center">
                    <div
                      className={cn(
                        'text-xs font-medium',
                        isCurrent && 'text-primary',
                        isCompleted && 'text-green-600 dark:text-green-500',
                        !isCompleted &&
                          !isCurrent &&
                          'text-gray-500 dark:text-gray-400',
                      )}
                    >
                      {stageConfig.title}
                    </div>
                    {stageConfig.minQuestsCompleted && (
                      <div className="text-xs text-foreground">
                        {stageConfig.minQuestsCompleted} quests
                      </div>
                    )}
                  </div>
                </div>

                {/* Connector Line */}
                {index < STAGE_ORDER.length - 1 && (
                  <div className="relative mx-2 flex-1">
                    <div className="h-0.5 w-full bg-gray-300 dark:bg-gray-600">
                      <div
                        className={cn(
                          'h-full transition-all',
                          isCompleted && 'bg-green-600 dark:bg-green-500',
                          !isCompleted && 'bg-transparent',
                        )}
                        style={{ width: isCompleted ? '100%' : '0%' }}
                      />
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Current Stage Info */}
      <div className="rounded-lg border bg-card p-4">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">{STAGES[currentStage].icon}</span>
              <h3 className="text-lg font-semibold">
                {STAGES[currentStage].title}
              </h3>
            </div>
            <p className="mt-1 text-sm text-foreground">
              {STAGES[currentStage].description}
            </p>

            {/* Requirements */}
            <div className="mt-3 space-y-1">
              {STAGES[currentStage].requirements.map((req, idx) => (
                <div key={idx} className="flex items-center gap-2 text-sm">
                  <span className="text-foreground">•</span>
                  <span>{req}</span>
                </div>
              ))}
            </div>
          </div>

          <Badge variant="outline" className="shrink-0">
            Etapa {currentIndex + 1}/{STAGE_ORDER.length}
          </Badge>
        </div>
      </div>
    </div>
  )
}
