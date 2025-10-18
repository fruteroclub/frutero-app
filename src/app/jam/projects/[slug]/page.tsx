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

interface ProjectPageProps {
  params: Promise<{
    slug: string
  }>
}

interface ProjectMember {
  userId: string
  role: string
  joinedAt: Date
}

interface ProgramProject {
  id: string
  programId: string
  status: string
  program?: {
    name: string
  }
}

export default function ProjectPage({ params }: ProjectPageProps) {
  const { user } = useAppAuth()
  const { slug } = use(params)

  // Fetch project data
  const { data: project, isLoading: projectLoading } = useQuery({
    queryKey: ['project', slug],
    queryFn: async () => {
      const res = await fetch(`/api/jam/projects/${slug}`)
      if (!res.ok) {
        if (res.status === 404) return null
        throw new Error('Failed to fetch project')
      }
      return res.json()
    },
  })

  // Fetch project members
  const { data: members = [], isLoading: membersLoading } = useQuery({
    queryKey: ['project-members', project?.id],
    queryFn: async () => {
      if (!project?.id) return []
      const res = await fetch(`/api/jam/projects/${project.id}/members`)
      if (!res.ok) throw new Error('Failed to fetch members')
      return res.json()
    },
    enabled: !!project?.id,
  })

  // Fetch project programs
  const { data: programs = [], isLoading: programsLoading } = useQuery({
    queryKey: ['project-programs', project?.id],
    queryFn: async () => {
      if (!project?.id) return []
      const res = await fetch(`/api/jam/projects/${project.id}/programs`)
      if (!res.ok) throw new Error('Failed to fetch programs')
      return res.json()
    },
    enabled: !!project?.id,
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
        <div className="container max-w-4xl space-y-8 pb-2 pl-64">
          {/* Project Header */}
          <div className="flex items-start justify-between">
            <div>
              <h1 className="mb-2 text-3xl font-bold">{project.name}</h1>
              <div className="flex items-center gap-2">
                {project.category && <Badge>{project.category}</Badge>}
                <Badge variant="outline">{project.stage}</Badge>
              </div>
            </div>

            {isAdmin && (
              <Button asChild variant="outline">
                <Link href={`/jam/projects/${project.slug}/edit`}>
                  Editar Proyecto
                </Link>
              </Button>
            )}
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {/* Main Content */}
            <div className="space-y-6 md:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Sobre el Proyecto</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{project.description}</p>
                </CardContent>
              </Card>

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
                      <Button size="sm" asChild>
                        <Link href={`/jam/projects/${project.id}/team`}>
                          Gestionar Equipo
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
                          className="flex items-center gap-2"
                        >
                          <span>{member.userId}</span>
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
            </div>

            {/* Sidebar */}
            <div className="space-y-4">
              {/* Programs */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Programas</CardTitle>
                </CardHeader>
                <CardContent>
                  {programs.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      No participa en programas aún
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {programs.map((pp: ProgramProject) => (
                        <div key={pp.id} className="text-sm">
                          {pp.program?.name || pp.programId}
                          <Badge variant="outline" className="ml-2 text-xs">
                            {pp.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  )}
                  {isAdmin && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="mt-3 w-full"
                      asChild
                    >
                      <Link href={`/jam/projects/${project.id}/programs`}>
                        Gestionar Programas
                      </Link>
                    </Button>
                  )}
                </CardContent>
              </Card>

              {/* Treasury */}
              {project.walletAddress && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">
                      Wallet del Equipo
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <code className="break-all text-xs">
                      {project.walletAddress}
                    </code>
                  </CardContent>
                </Card>
              )}

              {/* Created */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Calendar className="h-4 w-4" />
                    Creado
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">
                    {new Date(project.createdAt).toLocaleDateString('es-ES', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  )
}
