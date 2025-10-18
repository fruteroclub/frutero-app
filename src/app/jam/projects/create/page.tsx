'use client'

import { useAppAuth } from '@/store/auth-context'
import { ProjectForm } from '@/components/jam-platform/projects/ProjectForm'
import Link from 'next/link'
import PageWrapper from '@/components/layout/page-wrapper'
import { JamNav } from '@/components/jam-platform/navigation/JamNav'

export default function CreateProjectPage() {
  const { user, isAppAuthenticated, isLoading } = useAppAuth()

  if (isLoading) {
    return (
      <PageWrapper>
        <div className="page py-6">
          <div className="sticky top-0 z-10">
            <JamNav />
          </div>
          <div className="container max-w-2xl pl-64">
            <div className="flex min-h-[400px] items-center justify-center">
              <div className="space-y-4 text-center">
                <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-primary"></div>
                <p className="text-muted-foreground">Cargando...</p>
              </div>
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
          <div className="container max-w-2xl pl-64">
            <div className="flex min-h-[400px] items-center justify-center">
              <div className="space-y-4 text-center">
                <h2 className="text-2xl font-bold">Autenticación Requerida</h2>
                <p className="text-muted-foreground">
                  Por favor inicia sesión para crear un proyecto.
                </p>
                <Link
                  href="/"
                  className="inline-block rounded-md bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90"
                >
                  Ir a Inicio
                </Link>
              </div>
            </div>
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
        <div className="container pl-64">
          <div className="mb-6">
            <h1 className="text-3xl font-bold">Crea Tu Proyecto</h1>
            <p className="text-muted-foreground">
              Inicia un nuevo proyecto e invita a miembros del equipo para
              colaborar
            </p>
          </div>

          <div className="w-4/5">
            <ProjectForm userId={user.id} />
          </div>
        </div>
      </div>
    </PageWrapper>
  )
}
