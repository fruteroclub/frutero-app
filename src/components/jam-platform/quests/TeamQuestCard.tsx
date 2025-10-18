'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { DollarSign, Users } from 'lucide-react'
import { applyToQuest, type TeamQuest } from '@/services/jam/project-quests.service'
import { useAppAuth } from '@/store/auth-context'
import { toast } from 'sonner'

interface TeamQuestCardProps {
  quest: TeamQuest
  projectSlug: string
  onApplied?: () => void
}

export function TeamQuestCard({ quest, projectSlug, onApplied }: TeamQuestCardProps) {
  const { user } = useAppAuth()
  const [applying, setApplying] = useState(false)

  const slotsRemaining = quest.maxSubmissions
    ? quest.maxSubmissions - quest.currentSubmissions
    : null

  const isFull = slotsRemaining !== null && slotsRemaining <= 0

  const handleApply = async () => {
    if (!user) {
      toast.error('Debes iniciar sesión')
      return
    }

    setApplying(true)
    try {
      await applyToQuest(projectSlug, quest.id, user.id)
      toast.success('¡Aplicado exitosamente!')
      onApplied?.()
    } catch (error) {
      console.error('Failed to apply:', error)
      const errorMessage = error instanceof Error ? error.message : 'Error al aplicar al quest'
      toast.error(errorMessage)
    } finally {
      setApplying(false)
    }
  }

  return (
    <Card className={isFull ? 'opacity-60' : ''}>
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{quest.title}</CardTitle>
          <div className="flex gap-2">
            {quest.bountyUsd && (
              <Badge variant="default" className="flex items-center gap-1">
                <DollarSign className="h-3 w-3" />
                ${quest.bountyUsd}
              </Badge>
            )}
            <Badge variant="outline">
              <Users className="h-3 w-3 mr-1" />
              {quest.questType}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground line-clamp-2">
          {quest.description}
        </p>

        {quest.category && (
          <Badge variant="secondary">{quest.category}</Badge>
        )}

        {slotsRemaining !== null && (
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span>Cupos disponibles</span>
              <span>
                {slotsRemaining} / {quest.maxSubmissions}
              </span>
            </div>
            <Progress
              value={(slotsRemaining / quest.maxSubmissions!) * 100}
              className="h-2"
            />
          </div>
        )}

        <Button
          onClick={handleApply}
          disabled={isFull || applying}
          className="w-full"
        >
          {isFull
            ? 'Quest Lleno'
            : applying
              ? 'Aplicando...'
              : 'Aplicar al Quest'}
        </Button>
      </CardContent>
    </Card>
  )
}
