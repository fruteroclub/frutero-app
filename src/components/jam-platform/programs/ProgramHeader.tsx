import { Badge } from '@/components/ui/badge'
import type { Program } from '@/services/jam/programs.service'
import { Calendar, MapPin, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ProgramHeaderProps {
  program: Program
}

export function ProgramHeader({ program }: ProgramHeaderProps) {
  return (
    <div className="space-y-4">
      {program.bannerUrl && (
        <div className="w-full h-48 md:h-64 rounded-lg overflow-hidden">
          <img
            src={program.bannerUrl}
            alt={program.name}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            {program.name}
          </h1>
          {program.organizer && (
            <p className="text-lg text-muted-foreground mb-4">
              Organizado por {program.organizer}
            </p>
          )}

          <div className="flex flex-wrap gap-2 mb-4">
            <Badge variant="secondary" className="text-sm">
              {program.type}
            </Badge>
            <Badge variant="outline" className="text-sm">
              {program.status}
            </Badge>
            {program.tracks?.map((track) => (
              <Badge key={track} variant="outline" className="text-sm">
                {track}
              </Badge>
            ))}
          </div>

          <div className="flex flex-col gap-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>
                {new Date(program.startDate).toLocaleDateString('es-ES', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
                {program.endDate &&
                  ` - ${new Date(program.endDate).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}`}
              </span>
            </div>

            {program.location && (
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>{program.location}</span>
              </div>
            )}
          </div>
        </div>

        {program.avatarUrl && (
          <img
            src={program.avatarUrl}
            alt={program.name}
            className="w-24 h-24 rounded-lg object-cover"
          />
        )}
      </div>

      {program.websiteUrl && (
        <div>
          <Button variant="outline" size="sm" asChild>
            <a
              href={program.websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Sitio Web
            </a>
          </Button>
        </div>
      )}
    </div>
  )
}
