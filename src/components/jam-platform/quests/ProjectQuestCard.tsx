'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { CheckCircle2, Clock, XCircle, DollarSign } from 'lucide-react'
import Link from 'next/link'
import type { ProjectQuest } from '@/services/jam/project-quests.service'

const statusConfig = {
  NOT_STARTED: { icon: Clock, label: 'Sin Empezar', color: 'secondary' },
  IN_PROGRESS: { icon: Clock, label: 'En Progreso', color: 'default' },
  SUBMITTED: { icon: CheckCircle2, label: 'Enviado', color: 'default' },
  VERIFIED: { icon: CheckCircle2, label: 'Verificado', color: 'default' },
  REJECTED: { icon: XCircle, label: 'Rechazado', color: 'destructive' },
} as const

interface ProjectQuestCardProps {
  projectQuest: ProjectQuest
  projectSlug: string
}

export function ProjectQuestCard({
  projectQuest,
  projectSlug,
}: ProjectQuestCardProps) {
  const config = statusConfig[projectQuest.status]
  const Icon = config.icon

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg">
            {projectQuest.quest?.title || 'Quest'}
          </CardTitle>
          <Badge variant={config.color}>
            <Icon className="mr-1 h-3 w-3" />
            {config.label}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progreso</span>
            <span>{projectQuest.progress}%</span>
          </div>
          <Progress value={projectQuest.progress} />
        </div>

        {projectQuest.quest?.bountyUsd && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-foreground">Bounty</span>
            <Badge variant="default" className="flex items-center gap-1">
              <DollarSign className="h-3 w-3" />${projectQuest.quest.bountyUsd}{' '}
              USD
            </Badge>
          </div>
        )}

        {projectQuest.status === 'VERIFIED' && projectQuest.paidAt && (
          <Badge variant="default" className="w-full justify-center">
            ✅ Pagado el {new Date(projectQuest.paidAt).toLocaleDateString()}
          </Badge>
        )}

        {projectQuest.status === 'REJECTED' &&
          projectQuest.verificationNotes && (
            <div className="rounded-md bg-destructive/10 p-3">
              <p className="mb-1 text-xs font-medium text-destructive">
                Razón del rechazo:
              </p>
              <p className="text-xs text-foreground">
                {projectQuest.verificationNotes}
              </p>
            </div>
          )}

        <Button asChild className="w-full">
          <Link
            href={`/jam/projects/${projectSlug}/quests/${projectQuest.questId}`}
          >
            {projectQuest.status === 'NOT_STARTED'
              ? 'Iniciar Quest'
              : 'Ver Detalles'}
          </Link>
        </Button>
      </CardContent>
    </Card>
  )
}
