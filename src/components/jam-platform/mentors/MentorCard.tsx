import Link from 'next/link'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Users, Star, MapPin } from 'lucide-react'
import { Mentor } from '@/services/jam/mentors.service'

interface MentorCardProps {
  mentor: Mentor
}

export function MentorCard({ mentor }: MentorCardProps) {
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
    <Link href={`/jam/mentors/${mentor.id}`}>
      <Card className="group h-full transition-all hover:shadow-lg">
        <CardHeader className="space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12">
                <AvatarImage src={mentor.avatarUrl || undefined} />
                <AvatarFallback>{getInitials(mentor.displayName)}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold group-hover:text-primary">
                  {mentor.displayName || mentor.username || 'Sin nombre'}
                </h3>
                {location && (
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <MapPin className="h-3 w-3" />
                    <span>{location}</span>
                  </div>
                )}
              </div>
            </div>
            <Badge className={availabilityColors[mentor.availability]}>
              {availabilityLabels[mentor.availability]}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {mentor.profile?.professionalProfile && (
            <p className="line-clamp-2 text-sm text-muted-foreground">{mentor.profile.professionalProfile}</p>
          )}

          {mentor.expertiseAreas.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {mentor.expertiseAreas.slice(0, 3).map((area) => (
                <Badge key={area} variant="outline" className="text-xs">
                  {area}
                </Badge>
              ))}
              {mentor.expertiseAreas.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{mentor.expertiseAreas.length - 3}
                </Badge>
              )}
            </div>
          )}

          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span>
                {mentor.menteeCount} mentee{mentor.menteeCount !== 1 ? 's' : ''}
              </span>
            </div>
            {mentor.rating !== undefined && mentor.rating > 0 && (
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                <span>{mentor.rating.toFixed(1)}</span>
              </div>
            )}
          </div>

          {mentor.isAtCapacity && (
            <Badge variant="secondary" className="w-full justify-center">
              En capacidad máxima
            </Badge>
          )}
        </CardContent>
      </Card>
    </Link>
  )
}
