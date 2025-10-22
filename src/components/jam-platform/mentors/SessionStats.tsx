import { Card, CardContent } from '@/components/ui/card'
import { Clock, Calendar, Star, TrendingUp } from 'lucide-react'
import { type MentorshipSession } from '@/services/jam/mentors.service'

interface SessionStatsProps {
  sessions: MentorshipSession[]
}

export function SessionStats({ sessions }: SessionStatsProps) {
  const sessionCount = sessions.length
  const totalDuration = sessions.reduce((sum, s) => sum + s.duration, 0)
  const avgDuration =
    sessionCount > 0 ? Math.round(totalDuration / sessionCount) : 0
  const avgRating =
    sessionCount > 0
      ? (sessions.reduce((sum, s) => sum + s.rating, 0) / sessionCount).toFixed(
          1,
        )
      : '0.0'

  const stats = [
    {
      icon: Calendar,
      label: 'Total de Sesiones',
      value: sessionCount,
      color: 'text-blue-600',
    },
    {
      icon: Clock,
      label: 'Duración Promedio',
      value: `${avgDuration} min`,
      color: 'text-green-600',
    },
    {
      icon: Star,
      label: 'Calificación Promedio',
      value: avgRating,
      color: 'text-yellow-600',
    },
    {
      icon: TrendingUp,
      label: 'Tiempo Total',
      value: `${Math.round(totalDuration / 60)}h ${totalDuration % 60}m`,
      color: 'text-purple-600',
    },
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.label}>
          <CardContent className="flex items-center gap-3 p-6">
            <div className={`rounded-lg bg-muted p-3 ${stat.color}`}>
              <stat.icon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-sm text-foreground">{stat.label}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
