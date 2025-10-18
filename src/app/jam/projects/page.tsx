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

    const matchesStage =
      stageFilter === 'ALL' || project.stage === stageFilter

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
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
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
        <div className="container max-w-6xl space-y-6 pl-64">
          <div>
            <h1 className="text-3xl font-bold">Explorar Proyectos</h1>
            <p className="text-muted-foreground mt-2">
              Descubre proyectos de la comunidad y ofrece tu apoyo como mentor
            </p>
          </div>

          <ProjectFilters
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            categoryFilter={categoryFilter}
            onCategoryChange={setCategoryFilter}
            stageFilter={stageFilter}
            onStageChange={setStageFilter}
          />

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                {filteredProjects.length} proyecto{filteredProjects.length !== 1 ? 's' : ''} encontrado{filteredProjects.length !== 1 ? 's' : ''}
              </p>
            </div>

            {filteredProjects.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  No se encontraron proyectos con los filtros seleccionados
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
