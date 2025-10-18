import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ExternalLink } from 'lucide-react'
import type { Project } from '@/services/jam/projects.service'

interface ProjectCardProps {
  project: Project
}

export function ProjectCard({ project }: ProjectCardProps) {
  const truncatedDescription =
    project.description.length > 120
      ? project.description.slice(0, 120) + '...'
      : project.description

  return (
    <Link href={`/jam/projects/${project.slug}`}>
      <Card className="h-full hover:shadow-lg transition-all hover:border-primary cursor-pointer">
        <CardHeader>
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="text-lg line-clamp-2">
              {project.name}
            </CardTitle>
            <ExternalLink className="h-4 w-4 text-muted-foreground flex-shrink-0" />
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {project.category && (
              <Badge variant="secondary">{project.category}</Badge>
            )}
            <Badge variant="outline">{project.stage}</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground line-clamp-3">
            {truncatedDescription}
          </p>
        </CardContent>
      </Card>
    </Link>
  )
}
