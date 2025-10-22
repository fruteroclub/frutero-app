import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TRACKS, type Track } from '@/lib/jam/tracks'
import { Sprout, Rocket, Briefcase, Target } from 'lucide-react'
import Link from 'next/link'

interface TrackCardProps {
  track: Track | null | undefined
}

const TRACK_ICONS = {
  LEARNING: Sprout,
  FOUNDER: Rocket,
  PROFESSIONAL: Briefcase,
  FREELANCER: Target,
}

export function TrackCard({ track }: TrackCardProps) {
  if (!track) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Tu Ruta</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Completa el onboarding para seleccionar tu ruta de desarrollo.
          </p>
          <Link
            href="/jam/onboarding"
            className="inline-block rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground hover:bg-primary/90"
          >
            Comenzar Onboarding
          </Link>
        </CardContent>
      </Card>
    )
  }

  const trackConfig = TRACKS[track]
  const Icon = TRACK_ICONS[track]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Tu Ruta</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-primary/10 p-2">
            <Icon className="h-5 w-5 text-primary" />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">{trackConfig.icon}</span>
            <div>
              <div className="font-semibold">{trackConfig.titleEs}</div>
              <div className="text-xs text-muted-foreground">
                {trackConfig.descriptionEs}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-1.5 pt-2">
          <p className="text-xs font-medium text-muted-foreground">
            Objetivos de tu ruta:
          </p>
          <ul className="space-y-1">
            {trackConfig.goalsEs.slice(0, 2).map((goal, idx) => (
              <li
                key={idx}
                className="flex items-start gap-1.5 text-xs text-muted-foreground"
              >
                <span className="text-primary">✓</span>
                <span>{goal}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex items-center justify-between pt-2">
          <Link
            href="/jam/tracks"
            className="text-xs text-primary hover:underline"
          >
            Ver todas las rutas →
          </Link>
          <Link
            href="/jam/settings"
            className="text-xs text-muted-foreground hover:text-primary hover:underline"
          >
            Cambiar ruta
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
