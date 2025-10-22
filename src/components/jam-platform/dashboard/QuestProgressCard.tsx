import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import type { QuestStats } from '@/types/jam'

interface QuestProgressCardProps {
  stats: QuestStats
}

export function QuestProgressCard({ stats }: QuestProgressCardProps) {
  return (
    <Card className="flex h-full flex-col">
      <CardHeader>
        <CardTitle>Progreso de Quests</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {stats.total > 0 ? (
          <>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-foreground">Progreso total</span>
                <span className="font-medium">{stats.percentComplete}%</span>
              </div>
              <Progress value={stats.percentComplete} className="h-2" />
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="space-y-1">
                <p className="text-2xl font-bold">{stats.completed}</p>
                <p className="text-xs text-foreground">Completados</p>
              </div>
              <div className="space-y-1">
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-xs text-foreground">Total</p>
              </div>
            </div>

            <div className="border-t pt-2">
              <div className="flex justify-between text-sm">
                <span className="text-foreground">Individuales:</span>
                <span className="font-medium">{stats.individualCompleted}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-foreground">En equipo:</span>
                <span className="font-medium">{stats.teamCompleted}</span>
              </div>
            </div>

            <Button className="w-full" asChild>
              <Link href="/jam/quests">Ver Quests</Link>
            </Button>
          </>
        ) : (
          <div className="space-y-3 py-6 text-center">
            <p className="text-foreground">No hay quests disponibles aún</p>
            <Button variant="outline" className="w-full" disabled>
              Próximamente
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
