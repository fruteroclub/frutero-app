'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { MoreVertical, UserMinus, Crown, User } from 'lucide-react'
import {
  removeMember,
  updateMemberRole,
  type ProjectMember,
} from '@/services/jam/projects.service'

interface TeamMemberListProps {
  members: ProjectMember[]
  projectSlug: string
  currentUserId: string
  isAdmin: boolean
}

export function TeamMemberList({
  members,
  projectSlug,
  currentUserId,
  isAdmin,
}: TeamMemberListProps) {
  const queryClient = useQueryClient()

  const removeMutation = useMutation({
    mutationFn: (userId: string) => removeMember(projectSlug, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project-members', projectSlug] })
    },
  })

  const roleMutation = useMutation({
    mutationFn: ({ userId, role }: { userId: string; role: 'ADMIN' | 'MEMBER' }) =>
      updateMemberRole(projectSlug, userId, role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project-members', projectSlug] })
    },
  })

  const handleRemoveMember = (userId: string) => {
    if (!confirm('¿Remover este miembro del equipo?')) return
    removeMutation.mutate(userId)
  }

  const handleChangeRole = (userId: string, newRole: 'ADMIN' | 'MEMBER') => {
    roleMutation.mutate({ userId, role: newRole })
  }

  return (
    <div className="space-y-2">
      {members.map((member) => {
        const isCurrentUser = member.userId === currentUserId
        const canModify = isAdmin && !isCurrentUser
        const isLoading = removeMutation.isPending || roleMutation.isPending

        return (
          <Card key={member.userId}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback>
                      {member.userId.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm">
                        {member.userId.slice(0, 20)}...
                      </span>
                      {isCurrentUser && (
                        <Badge variant="outline" className="text-xs">
                          Tú
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Se unió el {new Date(member.joinedAt).toLocaleDateString('es-ES')}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Badge
                    variant={member.role === 'ADMIN' ? 'default' : 'secondary'}
                  >
                    {member.role === 'ADMIN' ? (
                      <>
                        <Crown className="h-3 w-3 mr-1" /> Admin
                      </>
                    ) : (
                      <>
                        <User className="h-3 w-3 mr-1" /> Miembro
                      </>
                    )}
                  </Badge>

                  {canModify && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          disabled={isLoading}
                        >
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {member.role === 'MEMBER' ? (
                          <DropdownMenuItem
                            onClick={() => handleChangeRole(member.userId, 'ADMIN')}
                          >
                            <Crown className="h-4 w-4 mr-2" />
                            Promover a Admin
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem
                            onClick={() => handleChangeRole(member.userId, 'MEMBER')}
                          >
                            <User className="h-4 w-4 mr-2" />
                            Degradar a Miembro
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem
                          onClick={() => handleRemoveMember(member.userId)}
                          className="text-destructive"
                        >
                          <UserMinus className="h-4 w-4 mr-2" />
                          Remover del Equipo
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}

                  {isCurrentUser && !isAdmin && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveMember(currentUserId)}
                      disabled={isLoading}
                    >
                      Salir del Equipo
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
