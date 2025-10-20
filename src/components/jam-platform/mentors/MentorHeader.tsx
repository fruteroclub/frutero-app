import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { MapPin, Star, Users } from 'lucide-react'
import { Mentor } from '@/services/jam/mentors.service'

interface MentorHeaderProps {
  mentor: Mentor
}

export function MentorHeader({ mentor }: MentorHeaderProps) {
  const availabilityColors = {
    available: 'bg-green-500/10 text-green-700 dark:text-green-400',
    limited: 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400',
    unavailable: 'bg-gray-500/10 text-gray-700 dark:text-gray-400',
  }

  const availabilityLabels = {
    available: 'Disponible',
    limited: 'Disponibilidad Limitada',
    unavailable: 'No Disponible',
  }

  const getInitials = (name: string | null) => {
    if (!name) return '??'
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const location = [mentor.profile?.cityRegion, mentor.profile?.country].filter(Boolean).join(', ')

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
        <Avatar className="h-24 w-24">
          <AvatarImage src={mentor.avatarUrl || undefined} />
          <AvatarFallback className="text-2xl">
            {getInitials(mentor.displayName)}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 space-y-3">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <h1 className="text-3xl font-bold">
              {mentor.displayName || mentor.username || 'Sin nombre'}
            </h1>
            <Badge className={availabilityColors[mentor.availability]}>
              {availabilityLabels[mentor.availability]}
            </Badge>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            {location && (
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                <span>{location}</span>
              </div>
            )}
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span>
                {mentor.menteeCount} mentee{mentor.menteeCount !== 1 ? 's' : ''}
              </span>
            </div>
            {mentor.rating !== undefined && mentor.rating > 0 && (
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                <span>{mentor.rating.toFixed(1)} promedio</span>
              </div>
            )}
          </div>

          {mentor.profile?.professionalProfile && (
            <p className="text-muted-foreground">{mentor.profile.professionalProfile}</p>
          )}
        </div>
      </div>

      {mentor.expertiseAreas.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-semibold">Áreas de Expertise</h3>
          <div className="flex flex-wrap gap-2">
            {mentor.expertiseAreas.map((area) => (
              <Badge key={area} variant="outline">
                {area}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
