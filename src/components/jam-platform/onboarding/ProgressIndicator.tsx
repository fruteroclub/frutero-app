interface Step {
  id: string
  title: string
}

interface ProgressIndicatorProps {
  steps: Step[]
  currentStep: number
  projectChoice?: 'create' | 'join' | 'skip'
}

export function ProgressIndicator({
  steps,
  currentStep,
  projectChoice,
}: ProgressIndicatorProps) {
  // Skip project details step in progress if not creating
  const visibleSteps = steps.filter((step, idx) => {
    if (idx === 3 && projectChoice !== 'create') {
      return false // Hide project details step
    }
    return true
  })

  const currentVisibleIndex = visibleSteps.findIndex((_, idx) => {
    const originalIdx = steps.indexOf(visibleSteps[idx])
    return originalIdx === currentStep
  })

  return (
    <div className="w-full">
      <div className="flex items-center justify-between">
        {visibleSteps.map((step, idx) => {
          const isCompleted = idx < currentVisibleIndex
          const isCurrent = idx === currentVisibleIndex

          return (
            <div key={step.id} className="flex flex-1 items-center">
              <div className="flex flex-1 flex-col items-center">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium transition-colors ${
                    isCompleted
                      ? 'bg-primary text-primary-foreground'
                      : isCurrent
                        ? 'bg-primary text-primary-foreground ring-2 ring-primary ring-offset-2'
                        : 'bg-muted text-foreground'
                  }`}
                >
                  {isCompleted ? '✓' : idx + 1}
                </div>
                <span
                  className={`mt-2 text-center text-xs ${
                    isCurrent ? 'font-medium' : 'text-foreground'
                  }`}
                >
                  {step.title}
                </span>
              </div>
              {idx < visibleSteps.length - 1 && (
                <div
                  className={`mx-2 h-0.5 flex-1 transition-colors ${
                    isCompleted ? 'bg-primary' : 'bg-muted'
                  }`}
                />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
