import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Flag, AlertCircle } from 'lucide-react'
import type { Program } from '@/services/jam/programs.service'

interface ProgramTimelineProps {
  program: Program
}

export function ProgramTimeline({ program }: ProgramTimelineProps) {
  const events = []

  // Start date
  events.push({
    date: new Date(program.startDate),
    label: 'Inicio del Programa',
    icon: Flag,
    type: 'start',
  })

  // Submission deadline
  if (program.submissionDeadline) {
    events.push({
      date: new Date(program.submissionDeadline),
      label: 'Cierre de Aplicaciones',
      icon: AlertCircle,
      type: 'deadline',
    })
  }

  // End date
  if (program.endDate) {
    events.push({
      date: new Date(program.endDate),
      label: 'Fin del Programa',
      icon: Flag,
      type: 'end',
    })
  }

  // Sort by date
  events.sort((a, b) => a.date.getTime() - b.date.getTime())

  const now = new Date()

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Cronología</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {events.map((event, index) => {
            const isPast = event.date < now
            const Icon = event.icon

            return (
              <div key={index} className="flex items-start gap-3">
                <div
                  className={`p-2 rounded-full ${
                    isPast ? 'bg-muted' : 'bg-primary/10'
                  }`}
                >
                  <Icon
                    className={`h-4 w-4 ${
                      isPast ? 'text-muted-foreground' : 'text-primary'
                    }`}
                  />
                </div>
                <div className="flex-1">
                  <p
                    className={`font-medium ${
                      isPast ? 'text-muted-foreground' : ''
                    }`}
                  >
                    {event.label}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {event.date.toLocaleDateString('es-ES', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
