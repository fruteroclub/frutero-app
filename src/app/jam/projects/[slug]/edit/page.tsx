'use client'

import { use } from 'react'
import { useQuery } from '@tanstack/react-query'
import { notFound, useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAppAuth } from '@/store/auth-context'
import PageWrapper from '@/components/layout/page-wrapper'
import { JamNav } from '@/components/jam-platform/navigation/JamNav'
import { ProjectForm } from '@/components/jam-platform/projects/ProjectForm'
import { getProject, type Project } from '@/services/jam/projects.service'
import { ArrowLeft, Loader2 } from 'lucide-react'

interface EditProjectPageProps {
  params: Promise<{
    slug: string
  }>
}

export default function EditProjectPage({ params }: EditProjectPageProps) {
  const { user } = useAppAuth()
  const { slug } = use(params)
  const router = useRouter()

  // Fetch project data
  const { data: project, isLoading } = useQuery<Project | null>({
    queryKey: ['project', slug],
    queryFn: () => getProject(slug),
  })

  if (isLoading) {
    return (
      <PageWrapper>
        <div className="page py-6">
          <div className="sticky top-0 z-10">
            <JamNav />
          </div>
          <div className="container max-w-3xl space-y-8 pl-64">
            <div className="flex min-h-[400px] items-center justify-center">
              <div className="space-y-4 text-center">
                <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary" />
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

  // Check if user is admin
  if (!user || project.adminId !== user.id) {
    router.push(`/jam/projects/${slug}`)
    return null
  }

  return (
    <PageWrapper>
      <div className="page py-6">
        <div className="sticky top-0 z-10">
          <JamNav />
        </div>
        <div className="container max-w-3xl space-y-8 pl-64">
          {/* Back Link */}
          <Link
            href={`/jam/projects/${slug}`}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver al Proyecto
          </Link>

          {/* Header */}
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">Editar Proyecto</h1>
            <p className="text-lg text-muted-foreground">
              Actualiza la información y recursos de tu proyecto
            </p>
          </div>

          {/* Edit Form */}
          <ProjectForm
            userId={user.id}
            initialData={{
              id: project.id,
              name: project.name,
              description: project.description,
              category: project.category || '',
              stage: project.stage,
              repositoryUrl: project.repositoryUrl || '',
              videoUrl: project.videoUrl || '',
              productionUrl: project.productionUrl || '',
              pitchDeckUrl: project.pitchDeckUrl || '',
              avatarUrl: project.avatarUrl || '',
              xUsername: project.xUsername || '',
              walletAddress: project.walletAddress || '',
              website: project.website || '',
            }}
          />
        </div>
      </div>
    </PageWrapper>
  )
}
