import Link from 'next/link'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Calendar, Users, DollarSign } from 'lucide-react'
import type { Quest, UserQuest, ProjectQuest } from '@/services/jam/quests.service'

interface QuestCardProps {
  quest: Quest
  userQuest?: UserQuest | null
  projectQuest?: ProjectQuest | null
  projectName?: string
  highlight?: boolean
}

export function QuestCard({
  quest,
  userQuest,
  projectQuest,
  projectName,
  highlight = false,
}: QuestCardProps) {
  const isTeamQuest = quest.questType === 'TEAM' || (quest.questType === 'BOTH' && projectQuest)
  const submission = isTeamQuest ? projectQuest : userQuest
  const status = submission?.status || 'NOT_STARTED'

  // Format due date
  const dueDate = new Date(quest.dueDate || quest.end)
  const daysUntilDue = Math.ceil((dueDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24))

  // Quest type badge color
  const getQuestTypeBadgeVariant = (type: string) => {
    switch (type) {
      case 'TEAM':
        return 'default'
      case 'INDIVIDUAL':
        return 'secondary'
      case 'BOTH':
        return 'outline'
      default:
        return 'secondary'
    }
  }

  // Difficulty badge color
  const getDifficultyBadgeVariant = (difficulty: string | null) => {
    switch (difficulty) {
      case 'easy':
        return 'secondary'
      case 'medium':
        return 'default'
      case 'hard':
        return 'destructive'
      default:
        return 'secondary'
    }
  }

  // Status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'COMPLETED':
      case 'VERIFIED':
        return <Badge variant="default" className="bg-green-600">Completado</Badge>
      case 'IN_PROGRESS':
        return <Badge variant="default">En Progreso</Badge>
      case 'SUBMITTED':
        return <Badge variant="secondary">Enviado</Badge>
      case 'REJECTED':
        return <Badge variant="destructive">Rechazado</Badge>
      default:
        return <Badge variant="outline">No Iniciado</Badge>
    }
  }

  return (
    <Card
      className={`transition-all hover:shadow-lg ${
        highlight ? 'border-primary shadow-md' : ''
      }`}
    >
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg">{quest.title}</CardTitle>
            <div className="mt-2 flex flex-wrap gap-2">
              {/* Quest Type Badge */}
              <Badge variant={getQuestTypeBadgeVariant(quest.questType)}>
                {quest.questType === 'TEAM' && <Users className="mr-1 h-3 w-3" />}
                {quest.questType}
              </Badge>

              {/* Category & Difficulty */}
              <Badge variant="outline">{quest.category}</Badge>
              <Badge variant={getDifficultyBadgeVariant(quest.difficulty)}>
                {quest.difficulty}
              </Badge>

              {/* Reward Points */}
              <Badge variant="secondary">{quest.rewardPoints} puntos</Badge>

              {/* Bounty Badge */}
              {quest.bountyUsd && (
                <Badge variant="default" className="bg-green-600">
                  <DollarSign className="mr-1 h-3 w-3" />
                  ${quest.bountyUsd} USD
                </Badge>
              )}
            </div>

            {/* Team Quest Project Name */}
            {isTeamQuest && projectName && (
              <p className="mt-1 text-sm text-muted-foreground">
                Equipo: {projectName}
              </p>
            )}
          </div>

          <div className="ml-2">{getStatusBadge(status)}</div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="line-clamp-2 text-muted-foreground">{quest.description}</p>

        {/* Max Submissions Tracking */}
        {quest.maxSubmissions && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="h-4 w-4" />
            <span>
              {quest.maxSubmissions - quest.currentSubmissions} / {quest.maxSubmissions} espacios
              disponibles
            </span>
          </div>
        )}

        {/* Progress Bar */}
        {submission && submission.progress > 0 && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progreso</span>
              <span>{submission.progress}%</span>
            </div>
            <Progress value={submission.progress} />
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>
              {daysUntilDue > 0
                ? `${daysUntilDue} días restantes`
                : 'Vencido'}
            </span>
          </div>
          <Button asChild size="sm">
            <Link href={`/jam/quests/${quest.id}`}>Ver Detalles</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
