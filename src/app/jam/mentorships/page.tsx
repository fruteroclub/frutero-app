'use client'

import { useAppAuth } from '@/store/auth-context'
import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'
import PageWrapper from '@/components/layout/page-wrapper'
import { JamNav } from '@/components/jam-platform/navigation/JamNav'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Calendar, Users, MessageSquare } from 'lucide-react'
import { getUserMentorships, type UserMentorship } from '@/services/jam/mentors.service'

export default function MentorshipsPage() {
  const { user, isAppAuthenticated, isLoading } = useAppAuth()

  const { data: mentorships = [], isLoading: loadingMentorships } = useQuery<UserMentorship[]>({
    queryKey: ['user-mentorships', user?.id],
    queryFn: async () => {
      if (!user?.id) return []
      const result = await getUserMentorships(user.id)
      return result.data || []
    },
    enabled: isAppAuthenticated && !!user,
  })

  if (isLoading || loadingMentorships) {
    return (
      <PageWrapper>
        <div className="page py-6">
          <div className="sticky top-0 z-10">
            <JamNav />
          </div>
          <div className="container max-w-6xl space-y-6 pl-64">
            <div className="py-12 text-center">
              <p className="text-foreground">Cargando mentorías...</p>
            </div>
          </div>
        </div>
      </PageWrapper>
    )
  }

  if (!isAppAuthenticated || !user) {
    return (
      <PageWrapper>
        <div className="page py-6">
          <div className="sticky top-0 z-10">
            <JamNav />
          </div>
          <div className="container max-w-6xl space-y-6 pl-64">
            <div className="py-12 text-center">
              <h2 className="text-2xl font-bold">Autenticación Requerida</h2>
              <p className="mt-2 text-foreground">
                Por favor inicia sesión para ver tus mentorías.
              </p>
            </div>
          </div>
        </div>
      </PageWrapper>
    )
  }

  const statusLabels = {
    active: 'Activa',
    paused: 'Pausada',
    completed: 'Completada',
  } as const

  const statusColors = {
    active: 'bg-green-500/10 text-green-700 dark:text-green-400',
    paused: 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400',
    completed: 'bg-gray-500/10 text-gray-700 dark:text-gray-400',
  } as const

  // Separate mentorships into mentor and participant roles
  const asMentor = mentorships.filter((m) => m.mentorId === user.id)
  const asParticipant = mentorships.filter((m) => m.participantId === user.id)

  return (
    <PageWrapper>
      <div className="page py-6">
        <div className="sticky top-0 z-10">
          <JamNav />
        </div>
        <div className="container max-w-6xl space-y-8 pl-64">
          <div className="flex flex-col gap-4">
            <h1 className="text-3xl font-bold md:text-4xl">Mis Mentorías</h1>
            <p className="text-foreground">
              Gestiona tus conexiones de mentoría y registra sesiones
            </p>
          </div>

          {/* As Mentor Section */}
          {asMentor.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                <h2 className="text-2xl font-bold">Como Mentor</h2>
              </div>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {asMentor.map((mentorship) => (
                  <Card key={mentorship.id} className="group transition-all hover:shadow-lg">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={mentorship.participant?.avatarUrl || undefined} />
                            <AvatarFallback>
                              {mentorship.participant?.displayName?.charAt(0) || 'P'}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <CardTitle className="text-lg">
                              {mentorship.participant?.displayName || mentorship.participant?.username || 'Participante'}
                            </CardTitle>
                            <p className="text-sm text-foreground">
                              {mentorship.participantProfile?.cityRegion && mentorship.participantProfile?.country
                                ? `${mentorship.participantProfile.cityRegion}, ${mentorship.participantProfile.country}`
                                : 'Sin ubicación'}
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <Badge className={statusColors[mentorship.status as keyof typeof statusColors]}>
                        {statusLabels[mentorship.status as keyof typeof statusLabels] || mentorship.status}
                      </Badge>

                      <div className="space-y-2 text-sm">
                        <div className="flex items-center justify-between">
                          <span className="text-foreground">Sesiones:</span>
                          <span className="font-medium">{mentorship.sessionCount}</span>
                        </div>
                        {mentorship.lastSessionDate && (
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-foreground" />
                            <span className="text-foreground">Última sesión:</span>
                            <span className="font-medium">
                              {new Date(mentorship.lastSessionDate).toLocaleDateString('es-ES', {
                                day: 'numeric',
                                month: 'short',
                              })}
                            </span>
                          </div>
                        )}
                      </div>

                      <Button className="w-full" asChild>
                        <Link href={`/jam/mentorships/${mentorship.id}`}>
                          <MessageSquare className="mr-2 h-4 w-4" />
                          Ver Detalles
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* As Participant Section */}
          {asParticipant.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">Como Participante</h2>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {asParticipant.map((mentorship) => (
                  <Card key={mentorship.id} className="group transition-all hover:shadow-lg">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={mentorship.mentor?.avatarUrl || undefined} />
                            <AvatarFallback>
                              {mentorship.mentor?.displayName?.charAt(0) || 'M'}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <CardTitle className="text-lg">
                              {mentorship.mentor?.displayName || mentorship.mentor?.username || 'Mentor'}
                            </CardTitle>
                            <p className="text-sm text-foreground">
                              {mentorship.mentorProfile?.cityRegion && mentorship.mentorProfile?.country
                                ? `${mentorship.mentorProfile.cityRegion}, ${mentorship.mentorProfile.country}`
                                : 'Sin ubicación'}
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <Badge className={statusColors[mentorship.status as keyof typeof statusColors]}>
                        {statusLabels[mentorship.status as keyof typeof statusLabels] || mentorship.status}
                      </Badge>

                      <div className="space-y-2 text-sm">
                        <div className="flex items-center justify-between">
                          <span className="text-foreground">Sesiones:</span>
                          <span className="font-medium">{mentorship.sessionCount}</span>
                        </div>
                        {mentorship.lastSessionDate && (
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-foreground" />
                            <span className="text-foreground">Última sesión:</span>
                            <span className="font-medium">
                              {new Date(mentorship.lastSessionDate).toLocaleDateString('es-ES', {
                                day: 'numeric',
                                month: 'short',
                              })}
                            </span>
                          </div>
                        )}
                      </div>

                      <Button className="w-full" variant="outline" asChild>
                        <Link href={`/jam/mentorships/${mentorship.id}`}>
                          Ver Historial
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Empty State */}
          {mentorships.length === 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Sin Mentorías Activas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-center">
                <p className="text-foreground">
                  Aún no tienes conexiones de mentoría.
                </p>
                <Button asChild>
                  <Link href="/jam/mentors">Explorar Mentores</Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </PageWrapper>
  )
}
