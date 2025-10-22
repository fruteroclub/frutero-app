'use client'

import { use } from 'react'
import { useQuery } from '@tanstack/react-query'
import PageWrapper from '@/components/layout/page-wrapper'
import { JamNav } from '@/components/jam-platform/navigation/JamNav'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, ExternalLink } from 'lucide-react'
import Link from 'next/link'
import { ProgramHeader } from '@/components/jam-platform/programs/ProgramHeader'
import { ProgramStats } from '@/components/jam-platform/programs/ProgramStats'
import { ProgramTimeline } from '@/components/jam-platform/programs/ProgramTimeline'
import {
  getProgramById,
  getProgramParticipants,
  type Program,
} from '@/services/jam/programs.service'

interface ProgramDetailPageProps {
  params: Promise<{ id: string }>
}

export default function ProgramDetailPage({ params }: ProgramDetailPageProps) {
  const { id } = use(params)

  const { data: program, isLoading: loadingProgram } = useQuery<Program>({
    queryKey: ['program', id],
    queryFn: () => getProgramById(id),
  })

  const { data: participants = [], isLoading: loadingParticipants } = useQuery({
    queryKey: ['program-participants', id],
    queryFn: () => getProgramParticipants(id),
  })

  if (loadingProgram) {
    return (
      <PageWrapper>
        <div className="page py-6">
          <div className="sticky top-0 z-10">
            <JamNav />
          </div>
          <div className="container max-w-6xl space-y-6 pl-64">
            <p className="text-center text-foreground">Cargando programa...</p>
          </div>
        </div>
      </PageWrapper>
    )
  }

  if (!program) {
    return (
      <PageWrapper>
        <div className="page py-6">
          <div className="sticky top-0 z-10">
            <JamNav />
          </div>
          <div className="container max-w-6xl space-y-6 pl-64">
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="mb-4 text-foreground">Programa no encontrado</p>
                <Button asChild>
                  <Link href="/jam/programs">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Volver a Programas
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </PageWrapper>
    )
  }

  return (
    <PageWrapper>
      <div className="page py-6">
        <div className="sticky top-0 z-10">
          <JamNav />
        </div>
        <div className="container max-w-6xl space-y-6 pl-64">
          <div className="mb-6">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/jam/programs">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Volver a Programas
              </Link>
            </Button>
          </div>

          <ProgramHeader program={program} />

          <div className="mt-8 grid gap-6 md:grid-cols-3">
            <div className="space-y-6 md:col-span-2">
              {/* Description */}
              <Card>
                <CardHeader>
                  <CardTitle>Descripción</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="whitespace-pre-wrap text-foreground">
                    {program.description}
                  </p>
                </CardContent>
              </Card>

              {/* Timeline */}
              <ProgramTimeline program={program} />

              {/* Participants */}
              {participants.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Proyectos Participantes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {loadingParticipants ? (
                      <p className="text-sm text-foreground">
                        Cargando participantes...
                      </p>
                    ) : (
                      <div className="space-y-3">
                        {participants.slice(0, 10).map((participant) => {
                          const typedParticipant = participant as Record<
                            string,
                            unknown
                          >
                          const project = typedParticipant.project as Record<
                            string,
                            unknown
                          >
                          const admin = project.admin as Record<string, string>
                          const participantStatus =
                            typedParticipant.status as string
                          const participantId = typedParticipant.id as string
                          const projectSlug = project.slug as string
                          const projectName = project.name as string

                          return (
                            <div
                              key={participantId}
                              className="flex items-center justify-between border-b py-2 last:border-0"
                            >
                              <div>
                                <Link
                                  href={`/jam/projects/${projectSlug}`}
                                  className="font-medium hover:underline"
                                >
                                  {projectName}
                                </Link>
                                <p className="text-sm text-foreground">
                                  por {admin.displayName}
                                </p>
                              </div>
                              <Badge variant="outline">
                                {participantStatus}
                              </Badge>
                            </div>
                          )
                        })}
                        {participants.length > 10 && (
                          <p className="pt-2 text-center text-sm text-foreground">
                            +{participants.length - 10} proyectos más
                          </p>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>

            <div className="space-y-4">
              {/* Stats */}
              <ProgramStats
                participantCount={program.participantCount || 0}
                totalPrizes={null}
              />

              {/* Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Acciones</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {program.applicationUrl && (
                    <Button className="w-full" asChild>
                      <a
                        href={program.applicationUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="mr-2 h-4 w-4" />
                        Aplicar al Programa
                      </a>
                    </Button>
                  )}

                  {program.websiteUrl && (
                    <Button variant="outline" className="w-full" asChild>
                      <a
                        href={program.websiteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="mr-2 h-4 w-4" />
                        Visitar Sitio Web
                      </a>
                    </Button>
                  )}
                </CardContent>
              </Card>

              {/* Info */}
              {program.capacity && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Información</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-foreground">Capacidad:</span>
                      <span className="font-medium">
                        {program.capacity} personas
                      </span>
                    </div>
                    {program.cohort && (
                      <div className="flex justify-between">
                        <span className="text-foreground">Cohorte:</span>
                        <span className="font-medium">{program.cohort}</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  )
}
