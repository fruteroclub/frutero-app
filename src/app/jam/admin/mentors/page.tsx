'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAppAuth } from '@/store/auth-context'
import PageWrapper from '@/components/layout/page-wrapper'
import { JamNav } from '@/components/jam-platform/navigation/JamNav'
import { AdminProtected } from '@/components/auth/AdminProtected'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Users, UserCheck, AlertCircle } from 'lucide-react'
import { MentorProfileForm } from '@/components/jam-platform/admin/MentorProfileForm'
import {
  getAllMentorProfiles,
  deleteMentorProfile,
  type MentorProfileFull,
} from '@/services/jam/mentor-management.service'
import { toast } from 'sonner'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'

export default function AdminMentorsPage() {
  const { user } = useAppAuth()
  const queryClient = useQueryClient()

  const { data: mentors = [], isLoading } = useQuery<MentorProfileFull[]>({
    queryKey: ['mentor-profiles'],
    queryFn: async () => {
      const result = await getAllMentorProfiles()
      return result.data || []
    },
    enabled: !!user?.isAdmin,
  })

  const deleteMutation = useMutation({
    mutationFn: deleteMentorProfile,
    onSuccess: () => {
      toast.success('Mentor profile eliminado')
      queryClient.invalidateQueries({ queryKey: ['mentor-profiles'] })
      queryClient.invalidateQueries({ queryKey: ['non-mentor-users'] })
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Error al eliminar mentor profile')
    },
  })

  const availabilityLabels = {
    AVAILABLE: 'Disponible',
    LIMITED: 'Limitada',
    UNAVAILABLE: 'No disponible',
  }

  const availabilityColors = {
    AVAILABLE: 'bg-green-500/10 text-green-700 dark:text-green-400',
    LIMITED: 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400',
    UNAVAILABLE: 'bg-gray-500/10 text-gray-700 dark:text-gray-400',
  }

  return (
    <PageWrapper>
      <div className="page py-6">
        <div className="sticky top-0 z-10">
          <JamNav />
        </div>
        <div className="container max-w-6xl pl-64">
          <AdminProtected>
            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="mb-2 text-3xl font-bold">Gestión de Mentores</h1>
                  <p className="text-foreground">
                    Crear y gestionar perfiles de mentores para la plataforma JAM
                  </p>
                </div>
                <MentorProfileForm />
              </div>

              {/* Stats */}
              <div className="grid gap-4 md:grid-cols-3">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Total Mentores
                    </CardTitle>
                    <Users className="h-4 w-4 text-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{mentors.length}</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Disponibles
                    </CardTitle>
                    <UserCheck className="h-4 w-4 text-green-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {mentors.filter((m) => m.availability === 'AVAILABLE').length}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      No Disponibles
                    </CardTitle>
                    <AlertCircle className="h-4 w-4 text-gray-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {mentors.filter((m) => m.availability === 'UNAVAILABLE').length}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Mentors Table */}
              <Card>
                <CardHeader>
                  <CardTitle>Mentores Registrados</CardTitle>
                  <CardDescription>
                    Lista completa de mentores en la plataforma
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="py-8 text-center text-foreground">Cargando...</div>
                  ) : mentors.length === 0 ? (
                    <div className="py-12 text-center">
                      <Users className="mx-auto h-12 w-12 text-foreground" />
                      <h3 className="mt-4 text-lg font-semibold">No hay mentores</h3>
                      <p className="mt-2 text-sm text-foreground">
                        Crea el primer mentor profile para comenzar
                      </p>
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Mentor</TableHead>
                          <TableHead>Disponibilidad</TableHead>
                          <TableHead>Capacidad</TableHead>
                          <TableHead>Experiencia</TableHead>
                          <TableHead>Acciones</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {mentors.map((mentor) => (
                          <TableRow key={mentor.id}>
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <Avatar className="h-10 w-10">
                                  <AvatarImage src={mentor.user.avatarUrl || undefined} />
                                  <AvatarFallback>
                                    {mentor.user.displayName.charAt(0)}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <div className="font-medium">
                                    {mentor.user.displayName}
                                  </div>
                                  <div className="text-sm text-foreground">
                                    {mentor.user.email}
                                  </div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge
                                className={
                                  availabilityColors[mentor.availability]
                                }
                              >
                                {availabilityLabels[mentor.availability]}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <span className="text-sm">
                                Máx: {mentor.maxParticipants}
                              </span>
                            </TableCell>
                            <TableCell>
                              <div className="flex flex-wrap gap-1">
                                {mentor.expertiseAreas.slice(0, 3).map((area) => (
                                  <Badge key={area} variant="outline" className="text-xs">
                                    {area}
                                  </Badge>
                                ))}
                                {mentor.expertiseAreas.length > 3 && (
                                  <Badge variant="outline" className="text-xs">
                                    +{mentor.expertiseAreas.length - 3}
                                  </Badge>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button
                                    variant="destructive"
                                    size="sm"
                                    disabled={deleteMutation.isPending}
                                  >
                                    Eliminar
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>
                                      ¿Eliminar mentor profile?
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Esta acción removerá el status de mentor de{' '}
                                      {mentor.user.displayName}. Las mentorías activas
                                      no serán afectadas.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() =>
                                        deleteMutation.mutate(mentor.userId)
                                      }
                                    >
                                      Eliminar
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </div>
          </AdminProtected>
        </div>
      </div>
    </PageWrapper>
  )
}
