import { Card, CardContent } from '@/components/ui/card'
import { Users, Star, Award, Calendar } from 'lucide-react'
import { Mentor } from '@/services/jam/mentors.service'

interface MentorStatsProps {
  mentor: Mentor
}

export function MentorStats({ mentor }: MentorStatsProps) {
  const stats = [
    {
      icon: Users,
      label: 'Mentees Activos',
      value: mentor.menteeCount,
      color: 'text-blue-600',
    },
    {
      icon: Star,
      label: 'Calificación Promedio',
      value: mentor.rating ? mentor.rating.toFixed(1) : 'N/A',
      color: 'text-yellow-600',
    },
    {
      icon: Award,
      label: 'Disponibilidad',
      value:
        mentor.availability === 'available'
          ? 'Alta'
          : mentor.availability === 'limited'
            ? 'Media'
            : 'Baja',
      color: 'text-green-600',
    },
    {
      icon: Calendar,
      label: 'Capacidad',
      value: mentor.isAtCapacity ? 'Lleno' : 'Disponible',
      color: mentor.isAtCapacity ? 'text-red-600' : 'text-green-600',
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
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
