import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Target } from 'lucide-react';
import type { Deadline } from '@/types/jam';

interface UpcomingDeadlinesProps {
  deadlines: Deadline[];
}

export function UpcomingDeadlines({ deadlines }: UpcomingDeadlinesProps) {
  if (deadlines.length === 0) {
    return (
      <Card className="h-full flex flex-col">
        <CardHeader>
          <CardTitle>Próximos Vencimientos</CardTitle>
        </CardHeader>
        <CardContent className="text-center py-6">
          <p className="text-muted-foreground">No hay vencimientos próximos</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>Próximos Vencimientos</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {deadlines.map((deadline) => {
          const icon = deadline.type === 'quest' ? Target : Calendar;
          const Icon = icon;
          const daysUntil = Math.ceil(
            (new Date(deadline.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
          );
          const isUrgent = daysUntil <= 3;

          return (
            <div
              key={deadline.id}
              className="flex items-start gap-3 p-3 rounded-lg border"
            >
              <Icon className={`h-5 w-5 mt-0.5 ${isUrgent ? 'text-destructive' : 'text-muted-foreground'}`} />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{deadline.title}</p>
                <p className="text-xs text-muted-foreground">
                  {daysUntil <= 0
                    ? 'Vence hoy'
                    : daysUntil === 1
                      ? 'Vence mañana'
                      : `Vence en ${daysUntil} días`}
                </p>
              </div>
              <time className="text-xs text-muted-foreground whitespace-nowrap">
                {new Date(deadline.dueDate).toLocaleDateString('es-ES', {
                  day: 'numeric',
                  month: 'short',
                })}
              </time>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
