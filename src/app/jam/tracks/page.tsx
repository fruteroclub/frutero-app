import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { TRACKS } from '@/lib/jam/tracks'
import { Sprout, Rocket, Briefcase, Target } from 'lucide-react'
import type { Track } from '@/types/jam'

const TRACK_ICONS = {
  LEARNING: Sprout,
  FOUNDER: Rocket,
  PROFESSIONAL: Briefcase,
  FREELANCER: Target,
}

function TrackDetailSection({
  trackKey,
  track,
}: {
  trackKey: Track
  track: (typeof TRACKS)[Track]
}) {
  const Icon = TRACK_ICONS[trackKey]

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-primary/10 p-3">
            <Icon className="h-6 w-6 text-primary" />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-3xl">{track.icon}</span>
            <div>
              <CardTitle>{track.titleEs}</CardTitle>
              <CardDescription>{track.descriptionEs}</CardDescription>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <h3 className="mb-3 font-semibold">Objetivos y Resultados</h3>
            <ul className="space-y-2">
              {track.goalsEs.map((goal, i) => (
                <li key={i} className="flex items-start gap-2">
                  <Target className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <span className="text-sm text-foreground">{goal}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-3 font-semibold">Tipos de Quests</h3>
            <div className="mb-4 flex flex-wrap gap-2">
              {track.questTypes.map((type) => (
                <Badge key={type} variant="secondary">
                  {type}
                </Badge>
              ))}
            </div>

            <h3 className="mb-3 font-semibold">Expertise de Mentores</h3>
            <div className="flex flex-wrap gap-2">
              {track.mentorExpertise.map((expertise) => (
                <Badge key={expertise} variant="outline">
                  {expertise}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default function TracksInfoPage() {
  return (
    <div className="container py-6">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold">Rutas de Desarrollo</h1>
        <p className="mt-2 text-foreground">
          Cuatro caminos hacia el éxito como Hacker de Alto Impacto
        </p>
      </div>

      <div className="space-y-8">
        {(Object.entries(TRACKS) as [Track, (typeof TRACKS)[Track]][]).map(
          ([key, track]) => (
            <TrackDetailSection key={key} trackKey={key} track={track} />
          ),
        )}
      </div>
    </div>
  )
}
