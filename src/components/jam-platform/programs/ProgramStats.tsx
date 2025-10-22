import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, Trophy } from 'lucide-react'

interface ProgramStatsProps {
  participantCount: number
  totalPrizes?: number | null
}

export function ProgramStats({
  participantCount,
  totalPrizes,
}: ProgramStatsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Estadísticas</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-foreground">
            <Users className="h-4 w-4" />
            <span className="text-sm">Participantes</span>
          </div>
          <span className="text-2xl font-bold">{participantCount}</span>
        </div>

        {totalPrizes && (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-foreground">
              <Trophy className="h-4 w-4" />
              <span className="text-sm">Premio Total</span>
            </div>
            <span className="text-2xl font-bold">
              ${totalPrizes.toLocaleString()}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
