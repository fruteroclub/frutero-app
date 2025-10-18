'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAppAuth } from '@/store/auth-context'
import PageWrapper from '@/components/layout/page-wrapper'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { JamNav } from '@/components/jam-platform/navigation/JamNav'
import { Shield, Search, UserCog, Users as UsersIcon, Mail } from 'lucide-react'
import { getAllUsers, toggleAdminStatus } from '@/services/jam/user-management.service'
import { toast } from 'sonner'

export default function AdminUsersPage() {
  const { user } = useAppAuth()
  const queryClient = useQueryClient()
  const [search, setSearch] = useState('')
  const [filterAdmin, setFilterAdmin] = useState<boolean | undefined>(undefined)

  const { data, isLoading } = useQuery({
    queryKey: ['admin-users', search, filterAdmin],
    queryFn: () => getAllUsers({ search, isAdmin: filterAdmin }),
    enabled: !!user?.isAdmin,
  })

  const toggleAdminMutation = useMutation({
    mutationFn: toggleAdminStatus,
    onSuccess: () => {
      toast.success('Admin status actualizado')
      queryClient.invalidateQueries({ queryKey: ['admin-users'] })
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Error al actualizar admin status')
    },
  })

  if (!user?.isAdmin) {
    return (
      <PageWrapper>
        <div className="page py-6">
          <div className="sticky top-0 z-10">
            <JamNav />
          </div>
          <div className="container max-w-6xl pl-64">
            <Alert variant="destructive">
              <Shield className="h-4 w-4" />
              <AlertDescription>
                No tienes permisos de administrador para acceder a esta página.
              </AlertDescription>
            </Alert>
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
        <div className="container space-y-6 pl-64">
          {/* Header */}
          <div>
            <h1 className="mb-2 text-3xl font-bold">User Management</h1>
            <p className="text-muted-foreground">
              Gestionar usuarios y permisos de administrador
            </p>
          </div>

          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UsersIcon className="h-5 w-5" />
                Usuarios ({data?.total || 0})
              </CardTitle>
              <CardDescription>
                Buscar y filtrar usuarios de la plataforma
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nombre o email..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9"
                />
              </div>

              {/* Filter Buttons */}
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant={filterAdmin === undefined ? 'default' : 'outline'}
                  onClick={() => setFilterAdmin(undefined)}
                >
                  Todos
                </Button>
                <Button
                  size="sm"
                  variant={filterAdmin === true ? 'default' : 'outline'}
                  onClick={() => setFilterAdmin(true)}
                >
                  Solo Admins
                </Button>
                <Button
                  size="sm"
                  variant={filterAdmin === false ? 'default' : 'outline'}
                  onClick={() => setFilterAdmin(false)}
                >
                  Solo Usuarios
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Users List */}
          <Card>
            <CardContent className="pt-6">
              {isLoading ? (
                <div className="flex min-h-[200px] items-center justify-center">
                  <div className="space-y-4 text-center">
                    <div className="mx-auto h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
                    <p className="text-sm text-muted-foreground">Cargando usuarios...</p>
                  </div>
                </div>
              ) : !data || data.users.length === 0 ? (
                <div className="py-8 text-center text-muted-foreground">
                  No se encontraron usuarios
                </div>
              ) : (
                <div className="space-y-3">
                  {data.users.map((u) => (
                    <div
                      key={u.id}
                      className="flex items-center justify-between rounded-lg border p-4 hover:bg-muted/50"
                    >
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">{u.displayName}</span>
                          {u.isAdmin && (
                            <Badge variant="default" className="bg-purple-600">
                              <Shield className="mr-1 h-3 w-3" />
                              Admin
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">@{u.username}</p>
                        {u.email && (
                          <p className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Mail className="h-3 w-3" />
                            {u.email}
                          </p>
                        )}
                        {u.profile && (
                          <div className="flex gap-2 text-xs text-muted-foreground">
                            {u.profile.primaryRole && (
                              <Badge variant="outline" className="text-xs">
                                {u.profile.primaryRole}
                              </Badge>
                            )}
                            {u.profile.country && (
                              <span>{u.profile.country}</span>
                            )}
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant={u.isAdmin ? 'destructive' : 'default'}
                          onClick={() => toggleAdminMutation.mutate(u.id)}
                          disabled={toggleAdminMutation.isPending || u.id === user?.id}
                        >
                          <UserCog className="mr-1 h-3 w-3" />
                          {u.isAdmin ? 'Remover Admin' : 'Hacer Admin'}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </PageWrapper>
  )
}
