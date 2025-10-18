'use client'

import { use } from 'react'
import { useQuery } from '@tanstack/react-query'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { useAppAuth } from '@/store/auth-context'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Users,
  Calendar,
  Github,
  Globe,
  Video,
  FileText,
  Twitter,
  Wallet,
  ArrowLeft,
  Edit,
  Target,
} from 'lucide-react'
import PageWrapper from '@/components/layout/page-wrapper'
import { JamNav } from '@/components/jam-platform/navigation/JamNav'
import {
  getProject,
  getProjectMembers,
  type Project,
  type ProjectMember,
} from '@/services/jam/projects.service'
import { getProjectPrograms, type ProgramParticipation } from '@/services/jam/programs.service'
import { StageIndicator } from '@/components/jam-platform/stages/StageIndicator'
import { StageAdvancementCard } from '@/components/jam-platform/stages/StageAdvancementCard'
import { StageAdvancementAlert } from '@/components/jam-platform/stages/StageAdvancementAlert'
import type { ProjectStage } from '@/lib/jam/stages'

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

interface ProjectPageProps {
  params: Promise<{
    slug: string
  }>
}

export default function ProjectPage({ params }: ProjectPageProps) {
  const { user } = useAppAuth()
  const { slug } = use(params)

  // Fetch project data
  const { data: project, isLoading: projectLoading } = useQuery<Project | null>({
    queryKey: ['project', slug],
    queryFn: () => getProject(slug),
  })

  // Fetch project members
  const { data: members = [], isLoading: membersLoading } = useQuery<ProjectMember[]>({
    queryKey: ['project-members', slug],
    queryFn: () => getProjectMembers(slug),
    enabled: !!project,
  })

  // Fetch project programs
  const { data: programs = [], isLoading: programsLoading } = useQuery<ProgramParticipation[]>({
    queryKey: ['project-programs', slug],
    queryFn: () => getProjectPrograms(slug),
    enabled: !!project,
  })

  if (projectLoading || membersLoading || programsLoading) {
    return (
      <PageWrapper>
        <div className="page py-6">
          <div className="sticky top-0 z-10">
            <JamNav />
          </div>
          <div className="container max-w-4xl space-y-8 pb-2 pl-64">
            <div className="flex min-h-[400px] items-center justify-center">
              <div className="space-y-4 text-center">
                <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-primary"></div>
                <p className="text-muted-foreground">Cargando proyecto...</p>
              </div>
            </div>
          </div>
        </div>
      </PageWrapper>
    )
  }

  if (!project) {
    notFound()
  }

  const isAdmin = members.find(
    (m: ProjectMember) => m.userId === user?.id && m.role === 'ADMIN'
  )

  const categoryColor = CATEGORY_COLORS[project.category as keyof typeof CATEGORY_COLORS] ||
    'bg-gray-500/10 text-gray-500 border-gray-500/20'

  return (
    <PageWrapper>
      <div className="page py-6">
        <div className="sticky top-0 z-10">
          <JamNav />
        </div>
        <div className="container max-w-5xl space-y-8 pl-64">
          {/* Back Link */}
          <Link
            href="/jam/projects"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver a Proyectos
          </Link>

          {/* Stage Advancement Alert (Admin Only) */}
          {isAdmin && <StageAdvancementAlert projectSlug={project.slug} />}

          {/* Hero Section with Image */}
          <div className="relative overflow-hidden rounded-2xl border-2 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent">
            {/* Hero Image */}
            <div className="relative h-64 md:h-80 w-full">
              {project.avatarUrl ? (
                <Image
                  src={project.avatarUrl}
                  alt={project.name}
                  fill
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="flex h-full items-center justify-center">
                  <div className="text-9xl font-bold text-primary/20">
                    {project.name.charAt(0).toUpperCase()}
                  </div>
                </div>
              )}

              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />

              {/* Stage badge */}
              <div className="absolute top-4 right-4">
                <Badge className="bg-background/90 backdrop-blur-sm border-2 text-base px-3 py-1">
                  {STAGE_EMOJI[project.stage as keyof typeof STAGE_EMOJI]} {project.stage}
                </Badge>
              </div>

              {/* Edit button */}
              {isAdmin && (
                <div className="absolute top-4 left-4">
                  <Button asChild size="sm" variant="secondary" className="backdrop-blur-sm">
                    <Link href={`/jam/projects/${project.slug}/edit`}>
                      <Edit className="h-4 w-4 mr-2" />
                      Editar
                    </Link>
                  </Button>
                </div>
              )}
            </div>

            {/* Project Title & Info */}
            <div className="relative p-8 space-y-4">
              <div className="space-y-3">
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                  {project.name}
                </h1>

                <div className="flex flex-wrap items-center gap-3">
                  {project.category && (
                    <Badge
                      variant="outline"
                      className={`${categoryColor} font-semibold text-base px-3 py-1`}
                    >
                      {project.category}
                    </Badge>
                  )}

                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Users className="h-4 w-4" />
                    <span>{members.length} {members.length === 1 ? 'miembro' : 'miembros'}</span>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>
                      {new Date(project.createdAt).toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                  </div>
                </div>
              </div>

              {/* Quick Links */}
              <div className="flex flex-wrap gap-3 pt-2">
                {project.repositoryUrl && (
                  <Button asChild variant="outline" size="sm">
                    <a
                      href={project.repositoryUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Github className="h-4 w-4 mr-2" />
                      Código
                    </a>
                  </Button>
                )}

                {project.productionUrl && (
                  <Button asChild variant="outline" size="sm">
                    <a
                      href={project.productionUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Globe className="h-4 w-4 mr-2" />
                      Demo en Vivo
                    </a>
                  </Button>
                )}

                {project.videoUrl && (
                  <Button asChild variant="outline" size="sm">
                    <a
                      href={project.videoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Video className="h-4 w-4 mr-2" />
                      Video Demo
                    </a>
                  </Button>
                )}

                {project.pitchDeckUrl && (
                  <Button asChild variant="outline" size="sm">
                    <a
                      href={project.pitchDeckUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      Pitch Deck
                    </a>
                  </Button>
                )}

                {project.website && (
                  <Button asChild variant="outline" size="sm">
                    <a
                      href={project.website}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Globe className="h-4 w-4 mr-2" />
                      Website
                    </a>
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* About Section */}
              <Card className="border-2">
                <CardHeader>
                  <CardTitle className="text-2xl">Sobre el Proyecto</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-base leading-relaxed text-muted-foreground">
                    {project.description}
                  </p>
                </CardContent>
              </Card>

              {/* Stage Indicator */}
              <StageIndicator currentStage={project.stage as ProjectStage} variant="full" />

              {/* Stage Advancement (Admin Only) */}
              {isAdmin && <StageAdvancementCard projectSlug={project.slug} />}

              {/* Programs */}
              {programs.length > 0 && (
                <Card className="border-2">
                  <CardHeader>
                    <CardTitle className="text-xl">Programas</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {programs.map((pp: ProgramParticipation) => (
                        <div
                          key={pp.id}
                          className="flex items-center justify-between rounded-lg border-2 p-4 hover:bg-accent transition-colors"
                        >
                          <span className="font-medium">
                            {pp.program.name}
                          </span>
                          <Badge variant="outline">
                            {pp.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Right Column - Sidebar */}
            <div className="space-y-6">
              {/* Team Members */}
              <Card className="border-2">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2 text-xl">
                      <Users className="h-5 w-5" />
                      Equipo
                    </CardTitle>
                    {isAdmin && (
                      <Button size="sm" variant="outline" asChild>
                        <Link href={`/jam/projects/${project.slug}/team`}>
                          Gestionar
                        </Link>
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  {members.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      No hay miembros en el equipo aún
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {members.map((member: ProjectMember) => (
                        <div
                          key={member.userId}
                          className="flex items-center justify-between rounded-lg border p-3 bg-muted/30"
                        >
                          <span className="font-mono text-xs">
                            {member.userId.slice(0, 12)}...
                          </span>
                          {member.role === 'ADMIN' && (
                            <Badge variant="secondary" className="text-xs">
                              Admin
                            </Badge>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Social Links */}
              {(project.xUsername || project.walletAddress) && (
                <Card className="border-2">
                  <CardHeader>
                    <CardTitle className="text-xl">Información de Contacto</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {project.xUsername && (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm font-medium">
                          <Twitter className="h-4 w-4" />
                          <span>Twitter/X</span>
                        </div>
                        <a
                          href={`https://x.com/${project.xUsername.replace('@', '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block text-sm text-primary hover:underline"
                        >
                          {project.xUsername}
                        </a>
                      </div>
                    )}

                    {project.walletAddress && (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm font-medium">
                          <Wallet className="h-4 w-4" />
                          <span>Treasury Wallet</span>
                        </div>
                        <p className="break-all font-mono text-xs text-muted-foreground bg-muted p-2 rounded">
                          {project.walletAddress}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Quick Navigation */}
              <Card className="border-2">
                <CardHeader>
                  <CardTitle className="text-xl">Navegación Rápida</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button
                    asChild
                    variant="outline"
                    className="w-full justify-start"
                  >
                    <Link href={`/jam/projects/${project.slug}/quests`}>
                      <Target className="h-4 w-4 mr-2" />
                      Quests del Proyecto
                    </Link>
                  </Button>

                  <Button
                    asChild
                    variant="outline"
                    className="w-full justify-start"
                  >
                    <Link href={`/jam/projects/${project.slug}/programs`}>
                      <Calendar className="h-4 w-4 mr-2" />
                      Ver Programas
                    </Link>
                  </Button>

                  {isAdmin && (
                    <Button
                      asChild
                      variant="outline"
                      className="w-full justify-start"
                    >
                      <Link href={`/jam/projects/${project.slug}/team`}>
                        <Users className="h-4 w-4 mr-2" />
                        Gestionar Equipo
                      </Link>
                    </Button>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  )
}
