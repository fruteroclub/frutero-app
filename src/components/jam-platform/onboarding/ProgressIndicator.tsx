interface Step {
  id: string;
  title: string;
}

interface ProgressIndicatorProps {
  steps: Step[];
  currentStep: number;
  projectChoice?: 'create' | 'join' | 'skip';
}

export function ProgressIndicator({
  steps,
  currentStep,
  projectChoice,
}: ProgressIndicatorProps) {
  // Skip project details step in progress if not creating
  const visibleSteps = steps.filter((step, idx) => {
    if (idx === 3 && projectChoice !== 'create') {
      return false; // Hide project details step
    }
    return true;
  });

  const currentVisibleIndex = visibleSteps.findIndex(
    (_, idx) => {
      const originalIdx = steps.indexOf(visibleSteps[idx]);
      return originalIdx === currentStep;
    }
  );

  return (
    <div className="w-full">
      <div className="flex items-center justify-between">
        {visibleSteps.map((step, idx) => {
          const isCompleted = idx < currentVisibleIndex;
          const isCurrent = idx === currentVisibleIndex;

          return (
            <div key={step.id} className="flex items-center flex-1">
              <div className="flex flex-col items-center flex-1">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                    isCompleted
                      ? 'bg-primary text-primary-foreground'
                      : isCurrent
                      ? 'bg-primary text-primary-foreground ring-2 ring-primary ring-offset-2'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {isCompleted ? '✓' : idx + 1}
                </div>
                <span
                  className={`text-xs mt-2 text-center ${
                    isCurrent ? 'font-medium' : 'text-muted-foreground'
                  }`}
                >
                  {step.title}
                </span>
              </div>
              {idx < visibleSteps.length - 1 && (
                <div
                  className={`h-0.5 flex-1 mx-2 transition-colors ${
                    isCompleted ? 'bg-primary' : 'bg-muted'
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
