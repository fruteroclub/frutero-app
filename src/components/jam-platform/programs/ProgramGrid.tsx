'use client'

import { ProgramCard } from './ProgramCard'
import type { Program } from '@/services/jam/programs.service'

interface ProgramGridProps {
  programs: Program[]
  onJoin?: (programId: string) => void
  showJoinButton?: boolean
}

export function ProgramGrid({
  programs,
  onJoin,
  showJoinButton = true,
}: ProgramGridProps) {
  if (programs.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground text-lg">
          No se encontraron programas.
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {programs.map((program) => (
        <ProgramCard
          key={program.id}
          program={program}
          showJoinButton={showJoinButton}
          onJoin={onJoin}
        />
      ))}
    </div>
  )
}
