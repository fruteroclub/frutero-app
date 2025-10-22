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
      <div className="py-12 text-center">
        <p className="text-lg text-foreground">No se encontraron programas.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
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
