'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import type { QuestType } from '@/services/jam/quests.service'

interface QuestTypeToggleProps {
  currentType: QuestType
}

export function QuestTypeToggle({ currentType }: QuestTypeToggleProps) {
  return (
    <div className="flex gap-2">
      <Link href="/jam/quests?type=ALL">
        <Button variant={currentType === 'ALL' ? 'default' : 'outline'} size="sm">
          Todos
        </Button>
      </Link>
      <Link href="/jam/quests?type=INDIVIDUAL">
        <Button variant={currentType === 'INDIVIDUAL' ? 'default' : 'outline'} size="sm">
          Individuales
        </Button>
      </Link>
      <Link href="/jam/quests?type=TEAM">
        <Button variant={currentType === 'TEAM' ? 'default' : 'outline'} size="sm">
          En Equipo
        </Button>
      </Link>
    </div>
  )
}
