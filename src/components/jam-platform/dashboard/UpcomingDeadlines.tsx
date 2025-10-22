import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Calendar, Target } from 'lucide-react'
import type { Deadline } from '@/types/jam'

interface UpcomingDeadlinesProps {
  deadlines: Deadline[]
}

export function UpcomingDeadlines({ deadlines }: UpcomingDeadlinesProps) {
  if (deadlines.length === 0) {
    return (
      <Card className="flex h-full flex-col">
        <CardHeader>
          <CardTitle>Próximos Vencimientos</CardTitle>
        </CardHeader>
        <CardContent className="py-6 text-center">
          <p className="text-foreground">No hay vencimientos próximos</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="flex h-full flex-col">
      <CardHeader>
        <CardTitle>Próximos Vencimientos</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {deadlines.map((deadline) => {
          const icon = deadline.type === 'quest' ? Target : Calendar
          const Icon = icon
          const daysUntil = Math.ceil(
            (new Date(deadline.dueDate).getTime() - new Date().getTime()) /
              (1000 * 60 * 60 * 24),
          )
          const isUrgent = daysUntil <= 3

          return (
            <div
              key={deadline.id}
              className="flex items-start gap-3 rounded-lg border p-3"
            >
              <Icon
                className={`mt-0.5 h-5 w-5 ${isUrgent ? 'text-destructive' : 'text-foreground'}`}
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{deadline.title}</p>
                <p className="text-xs text-foreground">
                  {daysUntil <= 0
                    ? 'Vence hoy'
                    : daysUntil === 1
                      ? 'Vence mañana'
                      : `Vence en ${daysUntil} días`}
                </p>
              </div>
              <time className="text-xs whitespace-nowrap text-foreground">
                {new Date(deadline.dueDate).toLocaleDateString('es-ES', {
                  day: 'numeric',
                  month: 'short',
                })}
              </time>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
