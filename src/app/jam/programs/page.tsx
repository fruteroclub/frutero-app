'use client'

import { useState, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import PageWrapper from '@/components/layout/page-wrapper'
import { JamNav } from '@/components/jam-platform/navigation/JamNav'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Info } from 'lucide-react'
import { ProgramFilters } from '@/components/jam-platform/programs/ProgramFilters'
import { ProgramGrid } from '@/components/jam-platform/programs/ProgramGrid'
import { getAllPrograms, type Program } from '@/services/jam/programs.service'

export default function ProgramsPage() {
  const [category, setCategory] = useState('all')
  const [track, setTrack] = useState('all')
  const [timeline, setTimeline] = useState('all')

  const { data: programs = [], isLoading } = useQuery<Program[]>({
    queryKey: ['programs'],
    queryFn: getAllPrograms,
  })

  // Filter programs based on selected filters
  const filteredPrograms = useMemo(() => {
    return programs.filter((program) => {
      // Category filter
      if (category !== 'all' && program.type !== category) {
        return false
      }

      // Track filter
      if (track !== 'all') {
        if (!program.tracks || !program.tracks.includes(track)) {
          return false
        }
      }

      // Timeline filter
      if (timeline !== 'all') {
        const now = new Date()
        const startDate = new Date(program.startDate)
        const endDate = program.endDate ? new Date(program.endDate) : null

        if (timeline === 'upcoming' && startDate <= now) {
          return false
        }
        if (
          timeline === 'active' &&
          (startDate > now || (endDate && endDate < now))
        ) {
          return false
        }
        if (timeline === 'past' && (!endDate || endDate >= now)) {
          return false
        }
      }

      return true
    })
  }, [programs, category, track, timeline])

  // Separate programs into recommended (active) and all
  const recommendedPrograms = useMemo(() => {
    return filteredPrograms.filter((p) => p.status === 'ACTIVE')
  }, [filteredPrograms])

  return (
    <PageWrapper>
      <div className="page">
        <div className="sticky top-0 z-10">
          <JamNav />
        </div>
        <div className="container space-y-6 pl-64">
          <div className="mb-6 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
            <div>
              <h1 className="text-3xl font-bold md:text-4xl">
                Programas Externos
              </h1>
              <p className="mt-2 text-foreground">
                Descubre hackathons, cursos e incubadoras para aplicar tus
                habilidades
              </p>
            </div>
            <ProgramFilters
              category={category}
              track={track}
              timeline={timeline}
              onCategoryChange={setCategory}
              onTrackChange={setTrack}
              onTimelineChange={setTimeline}
            />
          </div>

          <Alert className="mb-6">
            <Info className="h-4 w-4" />
            <AlertDescription>
              Únete a programas externos para aplicar lo aprendido. Tu mentor te
              guiará durante estos programas.
            </AlertDescription>
          </Alert>

          {isLoading ? (
            <div className="py-12 text-center">
              <p className="text-foreground">Cargando programas...</p>
            </div>
          ) : (
            <Tabs defaultValue="recommended" className="w-full">
              <TabsList className="grid w-full max-w-md grid-cols-2">
                <TabsTrigger value="recommended">
                  Recomendados ({recommendedPrograms.length})
                </TabsTrigger>
                <TabsTrigger value="all">
                  Todos ({filteredPrograms.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="recommended" className="mt-6">
                <ProgramGrid
                  programs={recommendedPrograms}
                  showJoinButton={false}
                />
              </TabsContent>

              <TabsContent value="all" className="mt-6">
                <ProgramGrid
                  programs={filteredPrograms}
                  showJoinButton={false}
                />
              </TabsContent>
            </Tabs>
          )}
        </div>
      </div>
    </PageWrapper>
  )
}
