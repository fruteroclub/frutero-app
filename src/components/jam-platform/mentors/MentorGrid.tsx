import { MentorCard } from './MentorCard'
import { Mentor } from '@/services/jam/mentors.service'

interface MentorGridProps {
  mentors: Mentor[]
  emptyMessage?: string
}

export function MentorGrid({
  mentors,
  emptyMessage = 'No se encontraron mentores',
}: MentorGridProps) {
  if (mentors.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-foreground">{emptyMessage}</p>
      </div>
    )
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {mentors.map((mentor) => (
        <MentorCard key={mentor.id} mentor={mentor} />
      ))}
    </div>
  )
}
