import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ExternalLink, Github, Globe, Users } from 'lucide-react'
import type { Project } from '@/services/jam/projects.service'
import Image from 'next/image'

interface ProjectCardProps {
  project: Project
}

const STAGE_EMOJI = {
  IDEA: '💡',
  PROTOTYPE: '🔨',
  BUILD: '🚧',
  PROJECT: '🚀',
}

const CATEGORY_COLORS = {
  DeFi: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
  RWA: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  Consumer: 'bg-green-500/10 text-green-500 border-green-500/20',
  Stablecoins: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
  Infrastructure: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
  PublicGoods: 'bg-pink-500/10 text-pink-500 border-pink-500/20',
  AI: 'bg-cyan-500/10 text-cyan-500 border-cyan-500/20',
  Web3: 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20',
  NFT: 'bg-rose-500/10 text-rose-500 border-rose-500/20',
  Gaming: 'bg-violet-500/10 text-violet-500 border-violet-500/20',
  Social: 'bg-teal-500/10 text-teal-500 border-teal-500/20',
}

export function ProjectCard({ project }: ProjectCardProps) {
  const truncatedDescription =
    project.description.length > 150
      ? project.description.slice(0, 150) + '...'
      : project.description

  const categoryColor = CATEGORY_COLORS[project.category as keyof typeof CATEGORY_COLORS] ||
    'bg-gray-500/10 text-gray-500 border-gray-500/20'

  return (
    <Link href={`/jam/projects/${project.slug}`}>
      <Card className="group relative overflow-hidden h-full hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] cursor-pointer border-2 hover:border-primary/50">
        {/* Project Image/Avatar */}
        <div className="relative h-48 w-full overflow-hidden bg-gradient-to-br from-primary/10 via-primary/5 to-transparent">
          {project.avatarUrl ? (
            <Image
              src={project.avatarUrl}
              alt={project.name}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-110"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <div className="text-6xl font-bold text-primary/20">
                {project.name.charAt(0).toUpperCase()}
              </div>
            </div>
          )}

          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent opacity-60" />

          {/* Stage badge overlay */}
          <div className="absolute top-3 right-3">
            <Badge className="bg-background/90 backdrop-blur-sm border">
              {STAGE_EMOJI[project.stage as keyof typeof STAGE_EMOJI]} {project.stage}
            </Badge>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Title and external link icon */}
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-xl font-bold line-clamp-2 group-hover:text-primary transition-colors">
              {project.name}
            </h3>
            <ExternalLink className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0 mt-1" />
          </div>

          {/* Category */}
          {project.category && (
            <Badge
              variant="outline"
              className={`${categoryColor} font-semibold`}
            >
              {project.category}
            </Badge>
          )}

          {/* Description */}
          <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
            {truncatedDescription}
          </p>

          {/* Footer with icons */}
          <div className="flex items-center gap-4 pt-2 border-t">
            {project.repositoryUrl && (
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Github className="h-3.5 w-3.5" />
                <span>Code</span>
              </div>
            )}
            {project.productionUrl && (
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Globe className="h-3.5 w-3.5" />
                <span>Live</span>
              </div>
            )}
            {project.members && project.members.length > 0 && (
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground ml-auto">
                <Users className="h-3.5 w-3.5" />
                <span>{project.members.length} {project.members.length === 1 ? 'member' : 'members'}</span>
              </div>
            )}
          </div>
        </div>
      </Card>
    </Link>
  )
}
