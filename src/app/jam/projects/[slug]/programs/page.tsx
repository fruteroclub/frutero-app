'use client'

import { use } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useAppAuth } from '@/store/auth-context'
import PageWrapper from '@/components/layout/page-wrapper'
import { Card } from '@/components/ui/card'
import { ProgramParticipationCard } from '@/components/jam-platform/programs/ProgramParticipationCard'
import { JoinProgramDialog } from '@/components/jam-platform/programs/JoinProgramDialog'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

interface ProjectProgram {
  id: string
  status: 'ACTIVE' | 'COMPLETED' | 'WITHDRAWN'
  joinedAt: string
  completedAt?: string
  program: {
    id: string
    name: string
    description: string
    startDate: string
    endDate?: string
  }
}

interface ProjectMember {
  userId: string
  role: string
}

interface ProgramsPageProps {
  params: Promise<{ slug: string }>
}

export default function ProgramsPage({ params }: ProgramsPageProps) {
  const { user } = useAppAuth()
  const { slug } = use(params)

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

  const { data: activePrograms = [], isLoading: activeProgramsLoading } = useQuery({
    queryKey: ['project-programs', slug, 'ACTIVE'],
    queryFn: async () => {
      const res = await fetch(`/api/jam/projects/${slug}/programs?status=ACTIVE`)
      if (!res.ok) throw new Error('Failed to fetch active programs')
      return res.json()
    },
    enabled: !!project,
  })

  const { data: completedPrograms = [], isLoading: completedProgramsLoading } = useQuery({
    queryKey: ['project-programs', slug, 'COMPLETED'],
    queryFn: async () => {
      const res = await fetch(`/api/jam/projects/${slug}/programs?status=COMPLETED`)
      if (!res.ok) throw new Error('Failed to fetch completed programs')
      return res.json()
    },
    enabled: !!project,
  })

  const { data: members = [] } = useQuery({
    queryKey: ['project-members', slug],
    queryFn: async () => {
      const res = await fetch(`/api/jam/projects/${slug}/members`)
      if (!res.ok) throw new Error('Failed to fetch members')
      return res.json()
    },
    enabled: !!project,
  })

  if (projectLoading) {
    return (
      <PageWrapper>
        <div className="container py-6">
          <p className="text-center text-muted-foreground">Cargando proyecto...</p>
        </div>
      </PageWrapper>
    )
  }

  if (!project) {
    return (
      <PageWrapper>
        <div className="container py-6">
          <Card className="p-6 text-center">
            <p className="text-muted-foreground mb-4">Proyecto no encontrado</p>
            <Link href="/jam/projects" className="text-primary hover:underline">
              ← Volver a Proyectos
            </Link>
          </Card>
        </div>
      </PageWrapper>
    )
  }

  const isAdmin = members.find(
    (m: ProjectMember) => m.userId === user?.id && m.role === 'ADMIN'
  )

  const isLoading = activeProgramsLoading || completedProgramsLoading

  return (
    <PageWrapper>
      <div className="container py-6 space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <Link
              href={`/jam/projects/${slug}`}
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Volver al Proyecto
            </Link>
            <h1 className="text-3xl font-bold">{project.name} - Programas</h1>
            <p className="text-muted-foreground mt-2">
              Participa en múltiples programas para acceder a más quests y oportunidades
            </p>
          </div>

          {isAdmin && <JoinProgramDialog projectSlug={slug} />}
        </div>

        {isLoading && (
          <p className="text-center text-muted-foreground py-8">
            Cargando programas...
          </p>
        )}

        {!isLoading && (
          <>
            {/* Active Programs */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">Programas Activos</h2>
              {activePrograms.length === 0 ? (
                <Card className="p-6 text-center text-muted-foreground">
                  No hay programas activos actualmente.
                  {isAdmin && (
                    <p className="mt-2 text-sm">
                      Únete a un programa para comenzar.
                    </p>
                  )}
                </Card>
              ) : (
                <div className="grid gap-4 md:grid-cols-2">
                  {activePrograms.map((pp: ProjectProgram) => (
                    <ProgramParticipationCard
                      key={pp.id}
                      programParticipation={pp}
                      projectSlug={slug}
                      isAdmin={!!isAdmin}
                    />
                  ))}
                </div>
              )}
            </section>

            {/* Completed Programs */}
            {completedPrograms.length > 0 && (
              <section>
                <h2 className="text-2xl font-semibold mb-4">Programas Completados</h2>
                <div className="grid gap-4 md:grid-cols-2">
                  {completedPrograms.map((pp: ProjectProgram) => (
                    <ProgramParticipationCard
                      key={pp.id}
                      programParticipation={pp}
                      projectSlug={slug}
                      isAdmin={!!isAdmin}
                      completed
                    />
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </div>
    </PageWrapper>
  )
}
