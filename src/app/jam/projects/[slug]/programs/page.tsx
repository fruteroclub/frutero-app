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
import {
  getProject,
  getProjectMembers,
  type Project,
  type ProjectMember,
} from '@/services/jam/projects.service'
import {
  getProjectPrograms,
  type ProgramParticipation,
} from '@/services/jam/programs.service'

interface ProgramsPageProps {
  params: Promise<{ slug: string }>
}

export default function ProgramsPage({ params }: ProgramsPageProps) {
  const { user } = useAppAuth()
  const { slug } = use(params)

  const { data: project, isLoading: projectLoading } = useQuery<Project | null>(
    {
      queryKey: ['project', slug],
      queryFn: () => getProject(slug),
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
    },
  )

  const { data: activePrograms = [], isLoading: activeProgramsLoading } =
    useQuery<ProgramParticipation[]>({
      queryKey: ['project-programs', slug, 'ACTIVE'],
      queryFn: () => getProjectPrograms(slug, 'ACTIVE'),
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
    })

  const { data: completedPrograms = [], isLoading: completedProgramsLoading } =
    useQuery<ProgramParticipation[]>({
      queryKey: ['project-programs', slug, 'COMPLETED'],
      queryFn: () => getProjectPrograms(slug, 'COMPLETED'),
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
    })

  const { data: members = [] } = useQuery<ProjectMember[]>({
    queryKey: ['project-members', slug],
    queryFn: () => getProjectMembers(slug),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  })

  if (projectLoading) {
    return (
      <PageWrapper>
        <div className="container py-6">
          <p className="text-center text-foreground">Cargando proyecto...</p>
        </div>
      </PageWrapper>
    )
  }

  if (!project) {
    return (
      <PageWrapper>
        <div className="container py-6">
          <Card className="p-6 text-center">
            <p className="mb-4 text-foreground">Proyecto no encontrado</p>
            <Link href="/jam/projects" className="text-primary hover:underline">
              ← Volver a Proyectos
            </Link>
          </Card>
        </div>
      </PageWrapper>
    )
  }

  const isAdmin = members.find(
    (m) => m.userId === user?.id && m.role === 'ADMIN',
  )

  const isLoading = activeProgramsLoading || completedProgramsLoading

  return (
    <PageWrapper>
      <div className="container space-y-6 py-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <Link
              href={`/jam/projects/${slug}`}
              className="mb-2 inline-flex items-center gap-2 text-sm text-foreground hover:text-primary"
            >
              <ArrowLeft className="h-4 w-4" />
              Volver al Proyecto
            </Link>
            <h1 className="text-3xl font-bold">{project.name} - Programas</h1>
            <p className="mt-2 text-foreground">
              Participa en múltiples programas para acceder a más quests y
              oportunidades
            </p>
          </div>

          {isAdmin && <JoinProgramDialog projectSlug={slug} />}
        </div>

        {isLoading && (
          <p className="py-8 text-center text-foreground">
            Cargando programas...
          </p>
        )}

        {!isLoading && (
          <>
            {/* Active Programs */}
            <section>
              <h2 className="mb-4 text-2xl font-semibold">Programas Activos</h2>
              {activePrograms.length === 0 ? (
                <Card className="p-6 text-center text-foreground">
                  No hay programas activos actualmente.
                  {isAdmin && (
                    <p className="mt-2 text-sm">
                      Únete a un programa para comenzar.
                    </p>
                  )}
                </Card>
              ) : (
                <div className="grid gap-4 md:grid-cols-2">
                  {activePrograms.map((pp: ProgramParticipation) => (
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
                <h2 className="mb-4 text-2xl font-semibold">
                  Programas Completados
                </h2>
                <div className="grid gap-4 md:grid-cols-2">
                  {completedPrograms.map((pp: ProgramParticipation) => (
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
