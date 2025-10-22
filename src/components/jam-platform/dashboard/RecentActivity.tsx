import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle, Code, Users, FileText } from 'lucide-react'
import type { Activity } from '@/types/jam'

interface RecentActivityProps {
  activities: Activity[]
}

const ACTIVITY_CONFIG = {
  quest_completed: {
    icon: CheckCircle,
    color: 'text-green-500',
    label: 'Quest completado',
  },
  project_updated: {
    icon: Code,
    color: 'text-blue-500',
    label: 'Proyecto actualizado',
  },
  mentor_session: {
    icon: Users,
    color: 'text-purple-500',
    label: 'Sesión de mentoría',
  },
  post_created: {
    icon: FileText,
    color: 'text-orange-500',
    label: 'Post creado',
  },
}

export function RecentActivity({ activities }: RecentActivityProps) {
  if (activities.length === 0) {
    return (
      <Card className="flex h-full flex-col">
        <CardHeader>
          <CardTitle>Actividad Reciente</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 py-6 text-center">
          <p className="text-foreground">No hay actividad reciente</p>
          <p className="text-sm text-foreground">
            Completa quests, actualiza tu proyecto o crea posts para ver
            actividad aquí
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="flex h-full flex-col">
      <CardHeader>
        <CardTitle>Actividad Reciente</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {activities.map((activity) => {
          const config = ACTIVITY_CONFIG[activity.type]
          const Icon = config.icon

          return (
            <div
              key={activity.id}
              className="flex items-start gap-3 rounded-lg border p-3"
            >
              <Icon className={`mt-0.5 h-5 w-5 ${config.color}`} />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium">{activity.description}</p>
                <p className="text-xs text-foreground">
                  {new Date(activity.timestamp).toLocaleDateString('es-ES', {
                    day: 'numeric',
                    month: 'short',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
