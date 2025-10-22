'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useAppAuth } from '@/store/auth-context'
import PageWrapper from '@/components/layout/page-wrapper'
import { JamNav } from '@/components/jam-platform/navigation/JamNav'
import { ProjectCard } from '@/components/jam-platform/projects/ProjectCard'
import { ProjectFilters } from '@/components/jam-platform/projects/ProjectFilters'
import { Loader2 } from 'lucide-react'
import { getAllProjects, type Project } from '@/services/jam/projects.service'

export default function ProjectsPage() {
  const { isAppAuthenticated, isLoading: authLoading } = useAppAuth()
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('ALL')
  const [stageFilter, setStageFilter] = useState('ALL')

  const { data: projects = [], isLoading } = useQuery<Project[]>({
    queryKey: ['projects'],
    queryFn: getAllProjects,
    enabled: isAppAuthenticated,
  })

  // Client-side filtering
  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      searchQuery === '' ||
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesCategory =
      categoryFilter === 'ALL' || project.category === categoryFilter

    const matchesStage = stageFilter === 'ALL' || project.stage === stageFilter

    return matchesSearch && matchesCategory && matchesStage
  })

  if (authLoading || isLoading) {
    return (
      <PageWrapper>
        <div className="page py-6">
          <div className="sticky top-0 z-10">
            <JamNav />
          </div>
          <div className="container max-w-6xl pl-64">
            <div className="flex min-h-[400px] items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-foreground" />
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
        <div className="container max-w-7xl space-y-8 pl-64">
          {/* Hero Section */}
          <div className="space-y-4">
            <div className="space-y-2">
              <h1 className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-4xl font-bold tracking-tight text-transparent">
                Explorar Proyectos
              </h1>
              <p className="max-w-2xl text-lg text-foreground">
                Descubre proyectos increíbles de la comunidad, ofrece tu apoyo
                como mentor, y colabora en el siguiente gran hackathon
              </p>
            </div>

            {/* Stats bar */}
            <div className="flex items-center gap-6 pt-2">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
                <span className="text-sm text-foreground">
                  {projects.length} proyectos activos
                </span>
              </div>
            </div>
          </div>

          {/* Filters */}
          <ProjectFilters
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            categoryFilter={categoryFilter}
            onCategoryChange={setCategoryFilter}
            stageFilter={stageFilter}
            onStageChange={setStageFilter}
          />

          {/* Results Section */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-foreground">
                {filteredProjects.length === 0 ? (
                  'No hay proyectos'
                ) : (
                  <>
                    Mostrando{' '}
                    <span className="font-bold text-foreground">
                      {filteredProjects.length}
                    </span>{' '}
                    {filteredProjects.length === 1 ? 'proyecto' : 'proyectos'}
                  </>
                )}
              </p>
            </div>

            {filteredProjects.length === 0 ? (
              <div className="flex flex-col items-center justify-center px-4 py-20 text-center">
                <div className="mb-4 rounded-full bg-muted p-6">
                  <svg
                    className="h-12 w-12 text-foreground"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="mb-2 text-lg font-semibold">
                  No se encontraron proyectos
                </h3>
                <p className="max-w-md text-foreground">
                  Intenta ajustar los filtros o realiza una búsqueda diferente
                  para encontrar proyectos que coincidan con tus criterios
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                {filteredProjects.map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </PageWrapper>
  )
}
