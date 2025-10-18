'use client'

import { use } from 'react'
import { useQuery } from '@tanstack/react-query'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { useAppAuth } from '@/store/auth-context'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Users, Calendar, ExternalLink } from 'lucide-react'
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
import type { ProjectStage } from '@/lib/jam/stages'

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

  return (
    <PageWrapper>
      <div className="page py-6">
        <div className="sticky top-0 z-10">
          <JamNav />
        </div>
        <div className="container max-w-2xl space-y-6 pl-64">
          {/* Back Link */}
          <Link
            href="/jam/dashboard"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
          >
            ← Volver al Dashboard
          </Link>

          {/* Project Header */}
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="mb-2 text-3xl font-bold">{project.name}</h1>
                <div className="flex items-center gap-2">
                  {project.category && <Badge>{project.category}</Badge>}
                  <Badge variant="outline">{project.stage}</Badge>
                </div>
              </div>

              {isAdmin && (
                <Button asChild variant="outline" size="sm">
                  <Link href={`/jam/projects/${project.slug}/edit`}>
                    Editar
                  </Link>
                </Button>
              )}
            </div>
          </div>

          {/* Main Content */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Sobre el Proyecto</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{project.description}</p>
              </CardContent>
            </Card>

            {/* Stage Indicator */}
            <StageIndicator currentStage={project.stage as ProjectStage} variant="full" />

            {/* Stage Advancement (Admin Only) */}
            {isAdmin && <StageAdvancementCard projectSlug={project.slug} />}

            {project.website && (
              <Card>
                <CardHeader>
                  <CardTitle>Enlaces</CardTitle>
                </CardHeader>
                <CardContent>
                  <a
                    href={project.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-primary hover:underline"
                  >
                    {project.website}
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </CardContent>
              </Card>
            )}

            {/* Team Members */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Equipo ({members.length})
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
                  <div className="space-y-2">
                    {members.map((member: ProjectMember) => (
                      <div
                        key={member.userId}
                        className="flex items-center justify-between rounded-md border p-3"
                      >
                        <span className="font-mono text-sm">
                          {member.userId.slice(0, 20)}...
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

            {/* Programs */}
            {programs.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Programas</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {programs.map((pp: ProgramParticipation) => (
                      <div
                        key={pp.id}
                        className="flex items-center justify-between rounded-md border p-3"
                      >
                        <span className="text-sm">
                          {pp.program.name}
                        </span>
                        <Badge variant="outline" className="text-xs">
                          {pp.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Treasury Wallet */}
            {project.walletAddress && (
              <Card>
                <CardHeader>
                  <CardTitle>Treasury Wallet</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="break-all font-mono text-xs text-muted-foreground">
                    {project.walletAddress}
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Created Date */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>
                Creado el{' '}
                {new Date(project.createdAt).toLocaleDateString('es-ES', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  )
}
