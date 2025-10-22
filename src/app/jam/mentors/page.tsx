'use client'

import { useState, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useAppAuth } from '@/store/auth-context'
import PageWrapper from '@/components/layout/page-wrapper'
import { JamNav } from '@/components/jam-platform/navigation/JamNav'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Info } from 'lucide-react'
import { MentorFilters } from '@/components/jam-platform/mentors/MentorFilters'
import { MentorGrid } from '@/components/jam-platform/mentors/MentorGrid'
import {
  getAllMentors,
  getMentorRecommendations,
  type Mentor,
} from '@/services/jam/mentors.service'

export default function MentorsPage() {
  const { user, isAppAuthenticated } = useAppAuth()
  const [availability, setAvailability] = useState('all')
  const [expertiseArea, setExpertiseArea] = useState('all')

  const { data: mentors = [], isLoading } = useQuery<Mentor[]>({
    queryKey: ['mentors'],
    queryFn: async () => {
      const result = await getAllMentors()
      return result.data || []
    },
  })

  const { data: recommendations = [] } = useQuery<Mentor[]>({
    queryKey: ['mentor-recommendations', user?.id],
    queryFn: async () => {
      if (!user?.id) return []
      const result = await getMentorRecommendations(user.id)
      return result.data || []
    },
    enabled: isAppAuthenticated && !!user,
  })

  // Filter mentors based on selected filters
  const filteredMentors = useMemo(() => {
    return mentors.filter((mentor) => {
      // Availability filter
      if (availability !== 'all' && mentor.availability !== availability) {
        return false
      }

      // Expertise area filter
      if (expertiseArea !== 'all') {
        if (!mentor.expertiseAreas.includes(expertiseArea)) {
          return false
        }
      }

      return true
    })
  }, [mentors, availability, expertiseArea])

  return (
    <PageWrapper>
      <div className="page py-6">
        <div className="sticky top-0 z-10">
          <JamNav />
        </div>
        <div className="container max-w-6xl space-y-6 pl-64">
          <div className="mb-6 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
            <div>
              <h1 className="text-3xl font-bold md:text-4xl">Mentores</h1>
              <p className="mt-2 text-foreground">
                Conecta con mentores expertos que te guiarán en tu camino
              </p>
            </div>
            <MentorFilters
              availability={availability}
              expertiseArea={expertiseArea}
              onAvailabilityChange={setAvailability}
              onExpertiseAreaChange={setExpertiseArea}
            />
          </div>

          <Alert className="mb-6">
            <Info className="h-4 w-4" />
            <AlertDescription>
              Los mentores están disponibles para guiarte durante tu programa.
              Revisa las recomendaciones personalizadas basadas en tu perfil.
            </AlertDescription>
          </Alert>

          {isLoading ? (
            <div className="py-12 text-center">
              <p className="text-foreground">Cargando mentores...</p>
            </div>
          ) : (
            <Tabs defaultValue="recommended" className="w-full">
              <TabsList className="grid w-full max-w-md grid-cols-2">
                <TabsTrigger value="recommended">
                  Recomendados ({recommendations.length})
                </TabsTrigger>
                <TabsTrigger value="all">
                  Todos ({filteredMentors.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="recommended" className="mt-6">
                <MentorGrid
                  mentors={recommendations}
                  emptyMessage="No hay recomendaciones disponibles. Completa tu perfil para obtener mejores recomendaciones."
                />
              </TabsContent>

              <TabsContent value="all" className="mt-6">
                <MentorGrid mentors={filteredMentors} />
              </TabsContent>
            </Tabs>
          )}
        </div>
      </div>
    </PageWrapper>
  )
}
