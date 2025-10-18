'use client'

import { use } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useAppAuth } from '@/store/auth-context'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import PageWrapper from '@/components/layout/page-wrapper'
import { JamNav } from '@/components/jam-platform/navigation/JamNav'
import { TeamMemberList } from '@/components/jam-platform/projects/TeamMemberList'
import { InviteMemberDialog } from '@/components/jam-platform/projects/InviteMemberDialog'
import { Loader2 } from 'lucide-react'
import {
  getProject,
  getProjectMembers,
  type Project,
  type ProjectMember,
} from '@/services/jam/projects.service'

interface TeamPageProps {
  params: Promise<{
    slug: string
  }>
}

export default function TeamPage({ params }: TeamPageProps) {
  const { user } = useAppAuth()
  const { slug } = use(params)

  // Fetch project
  const { data: project, isLoading: projectLoading } = useQuery<Project | null>({
    queryKey: ['project', slug],
    queryFn: () => getProject(slug),
  })

  // Fetch team members
  const { data: members = [], isLoading: membersLoading } = useQuery<ProjectMember[]>({
    queryKey: ['project-members', slug],
    queryFn: () => getProjectMembers(slug),
    enabled: !!project,
  })

  if (projectLoading || membersLoading) {
    return (
      <PageWrapper>
        <div className="page py-6">
          <div className="sticky top-0 z-10">
            <JamNav />
          </div>
          <div className="container max-w-4xl pl-64">
            <div className="flex min-h-[400px] items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
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
    (m) => m.userId === user?.id && m.role === 'ADMIN'
  )

  return (
    <PageWrapper>
      <div className="page py-6">
        <div className="sticky top-0 z-10">
          <JamNav />
        </div>
        <div className="container max-w-4xl space-y-6 pl-64">
          {/* Back Link */}
          <Link
            href={`/jam/projects/${slug}`}
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
          >
            ← Volver al Proyecto
          </Link>

          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">{project.name} - Equipo</h1>
              <p className="text-muted-foreground mt-2">
                {members.length} miembro{members.length !== 1 ? 's' : ''} del equipo
              </p>
            </div>

            {isAdmin && <InviteMemberDialog projectSlug={slug} />}
          </div>

          {/* Team Member List */}
          <TeamMemberList
            members={members}
            projectSlug={slug}
            currentUserId={user?.id || ''}
            isAdmin={!!isAdmin}
          />
        </div>
      </div>
    </PageWrapper>
  )
}
