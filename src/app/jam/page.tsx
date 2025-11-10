'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAppAuth } from '@/store/auth-context'
import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'
import PageWrapper from '@/components/layout/page-wrapper'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Target,
  Rocket,
  Users,
  Trophy,
  ArrowRight,
  CheckCircle2,
  Zap
} from 'lucide-react'

interface JamStats {
  totalProjects: number
  activeQuests: number
  completedQuests: number
  activeMentorships: number
  totalParticipants: number
}

async function getJamStats(): Promise<JamStats> {
  const res = await fetch('/api/jam/stats')
  if (!res.ok) throw new Error('Failed to fetch stats')
  return res.json()
}

export default function JamPage() {
  const router = useRouter()
  const { isAppAuthenticated, isLoading } = useAppAuth()

  // Redirect authenticated users to dashboard
  useEffect(() => {
    if (!isLoading && isAppAuthenticated) {
      router.push('/jam/dashboard')
    }
  }, [isAppAuthenticated, isLoading, router])

  const { data: stats } = useQuery<JamStats>({
    queryKey: ['jam-stats'],
    queryFn: getJamStats,
    enabled: !isAppAuthenticated,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  })

  // Show loading during auth check
  if (isLoading) {
    return (
      <PageWrapper>
        <div className="page py-6">
          <div className="container py-8">
            <div className="flex min-h-[400px] items-center justify-center">
              <div className="space-y-4 text-center">
                <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-primary"></div>
                <p className="text-foreground">Cargando...</p>
              </div>
            </div>
          </div>
        </div>
      </PageWrapper>
    )
  }

  // Don't render landing page if authenticated (redirect will happen)
  if (isAppAuthenticated) {
    return null
  }

  return (
    <PageWrapper>
      <div className="page">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-primary/5 to-transparent py-20">
          <div className="container max-w-6xl">
            <div className="flex flex-col items-center text-center">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border-2 border-primary/20 bg-primary/10 px-4 py-2">
                <Zap className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">Plataforma de Incubación JAM</span>
              </div>

              <h1 className="mb-6 max-w-4xl text-5xl font-bold tracking-tight md:text-6xl lg:text-7xl">
                De Builder a{' '}
                <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                  Hacker de Alto Impacto
                </span>
              </h1>

              <p className="mb-8 max-w-2xl text-xl text-foreground">
                Construye proyectos reales, completa quests, recibe mentorías, y transforma
                tu carrera tech con nuestra metodología de incubación probada.
              </p>

              <div className="flex flex-wrap items-center justify-center gap-4">
                <Button asChild size="lg" className="text-lg">
                  <Link href="/">
                    Únete a JAM
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="text-lg">
                  <Link href="/jam/showcase">
                    Ver Proyectos
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        {stats && (
          <section className="py-16">
            <div className="container max-w-6xl">
              <div className="grid grid-cols-2 gap-6 md:grid-cols-5">
                <Card className="border-2">
                  <CardContent className="p-6 text-center">
                    <div className="mb-2 text-4xl font-bold text-primary">
                      {stats.totalProjects}
                    </div>
                    <div className="text-sm font-medium text-foreground">
                      Proyectos Activos
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-2">
                  <CardContent className="p-6 text-center">
                    <div className="mb-2 text-4xl font-bold text-primary">
                      {stats.activeQuests}
                    </div>
                    <div className="text-sm font-medium text-foreground">
                      Quests Disponibles
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-2">
                  <CardContent className="p-6 text-center">
                    <div className="mb-2 text-4xl font-bold text-primary">
                      {stats.completedQuests}
                    </div>
                    <div className="text-sm font-medium text-foreground">
                      Quests Completados
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-2">
                  <CardContent className="p-6 text-center">
                    <div className="mb-2 text-4xl font-bold text-primary">
                      {stats.activeMentorships}
                    </div>
                    <div className="text-sm font-medium text-foreground">
                      Mentorías Activas
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-2">
                  <CardContent className="p-6 text-center">
                    <div className="mb-2 text-4xl font-bold text-primary">
                      {stats.totalParticipants}
                    </div>
                    <div className="text-sm font-medium text-foreground">
                      Hackers Activos
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>
        )}

        {/* How It Works Section */}
        <section className="py-16">
          <div className="container max-w-6xl">
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-4xl font-bold">Cómo Funciona JAM</h2>
              <p className="text-xl text-foreground">
                Tu camino de builder a hacker de alto impacto en 4 fases
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              <Card className="border-2 transition-all hover:shadow-lg">
                <CardContent className="p-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <Target className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="mb-2 text-xl font-bold">1. Elige tu Quest</h3>
                  <p className="text-foreground">
                    Selecciona quests alineados con tus objetivos. Desde MVP builds
                    hasta product-market fit.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 transition-all hover:shadow-lg">
                <CardContent className="p-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <Rocket className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="mb-2 text-xl font-bold">2. Construye Real</h3>
                  <p className="text-foreground">
                    Ejecuta con tu equipo. Ship productos que resuelven problemas
                    reales, no ejercicios teóricos.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 transition-all hover:shadow-lg">
                <CardContent className="p-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="mb-2 text-xl font-bold">3. Mentorías 1-1</h3>
                  <p className="text-foreground">
                    Recibe guidance de mentores que ya caminaron el path.
                    Sesiones enfocadas en ejecución.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 transition-all hover:shadow-lg">
                <CardContent className="p-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <Trophy className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="mb-2 text-xl font-bold">4. Ship & Scale</h3>
                  <p className="text-foreground">
                    Completa quests, gana bounties, avanza stages. Convierte
                    tu proyecto en impacto real.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Success Stories Section */}
        <section className="bg-gradient-to-br from-primary/5 to-transparent py-16">
          <div className="container max-w-6xl">
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-4xl font-bold">Proyectos que Shipean</h2>
              <p className="text-xl text-foreground">
                De ideas a productos con usuarios reales
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
              <Card className="border-2">
                <CardContent className="p-6">
                  <div className="mb-4 flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                    <span className="text-sm font-medium text-green-500">
                      Quest Completado
                    </span>
                  </div>
                  <h3 className="mb-2 text-xl font-bold">15+ Proyectos Shipeados</h3>
                  <p className="text-foreground">
                    Desde DeFi protocols hasta consumer apps, nuestros hackers
                    construyen productos que la gente usa.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2">
                <CardContent className="p-6">
                  <div className="mb-4 flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                    <span className="text-sm font-medium text-green-500">
                      En Producción
                    </span>
                  </div>
                  <h3 className="mb-2 text-xl font-bold">Usuarios Reales, Feedback Real</h3>
                  <p className="text-foreground">
                    Cada proyecto tiene usuarios activos. Aprendes a iterar basado
                    en datos, no suposiciones.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2">
                <CardContent className="p-6">
                  <div className="mb-4 flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                    <span className="text-sm font-medium text-green-500">
                      Growth Path
                    </span>
                  </div>
                  <h3 className="mb-2 text-xl font-bold">De IDEA a PROJECT Stage</h3>
                  <p className="text-foreground">
                    Sistema de stages que refleja tu progreso real. Cada stage
                    destrabado es un milestone alcanzado.
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="mt-12 text-center">
              <Button asChild size="lg" variant="outline">
                <Link href="/jam/showcase">
                  Explora Proyectos Showcase
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20">
          <div className="container max-w-4xl">
            <Card className="border-2 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent">
              <CardContent className="p-12 text-center">
                <h2 className="mb-4 text-4xl font-bold">
                  Listo para Hackear tu Carrera?
                </h2>
                <p className="mb-8 text-xl text-foreground">
                  Únete a la comunidad de builders que ejecutan. Primera mentoria gratis,
                  acceso a quests, y la oportunidad de construir con los mejores.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-4">
                  <Button asChild size="lg" className="text-lg">
                    <Link href="/">
                      Comenzar Ahora
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                  <Button asChild size="lg" variant="outline" className="text-lg">
                    <Link href="/jam/quests">
                      Ver Quests Disponibles
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </PageWrapper>
  )
}
