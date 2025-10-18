import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Users } from 'lucide-react'
import type { ProjectInfo } from '@/types/jam'

interface ProjectStageCardProps {
  project: ProjectInfo | null
}

const STAGE_LABELS: Record<string, string> = {
  IDEA: 'Idea',
  PROTOTYPE: 'Prototipo',
  BUILD: 'Construcción',
  PROJECT: 'Proyecto',
  INCUBATE: 'Incubación',
  ACCELERATE: 'Aceleración',
  SCALE: 'Escalamiento',
}

export function ProjectStageCard({ project }: ProjectStageCardProps) {
  if (!project) {
    return (
      <Card className="flex h-full flex-col">
        <CardHeader>
          <CardTitle>Tu Proyecto</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 py-6 text-center">
          <p className="text-muted-foreground">No tienes un proyecto activo</p>
          <Button variant="outline" className="w-full" asChild>
            <Link href="/jam/onboarding">Crear Proyecto</Link>
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="flex h-full flex-col">
      <CardHeader>
        <CardTitle>Tu Proyecto</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold">{project.name}</h3>
          <p className="text-sm text-muted-foreground">
            Etapa: {STAGE_LABELS[project.stage] || project.stage}
          </p>
        </div>

        <div className="border-t pt-2">
          <div className="mb-3 flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              {project.memberCount}{' '}
              {project.memberCount === 1 ? 'miembro' : 'miembros'}
            </span>
          </div>

          {project.members.length > 0 && (
            <div className="flex -space-x-2">
              {project.members.slice(0, 5).map((member) => (
                <Avatar
                  key={member.id}
                  className="h-8 w-8 border-2 border-background"
                >
                  <AvatarImage src={member.avatarUrl || undefined} />
                  <AvatarFallback className="text-xs">
                    {member.displayName.charAt(0)}
                  </AvatarFallback>
                </Avatar>
              ))}
              {project.memberCount > 5 && (
                <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-background bg-muted">
                  <span className="text-xs font-medium">
                    +{project.memberCount - 5}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        <Button className="w-full" variant="outline" asChild>
          <Link href={`/jam/projects/${project.slug}`}>Ver Proyecto</Link>
        </Button>
      </CardContent>
    </Card>
  )
}
