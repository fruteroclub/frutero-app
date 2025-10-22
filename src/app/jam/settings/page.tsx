'use client'

import { useEffect, useState } from 'react'
import { useAppAuth } from '@/store/auth-context'
import { TrackChanger } from '@/components/jam-platform/settings/TrackChanger'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import PageWrapper from '@/components/layout/page-wrapper'
import { JamNav } from '@/components/jam-platform/navigation/JamNav'
import type { UserSettings } from '@/types/jam'
import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function SettingsPage() {
  const { user, isAppAuthenticated, isLoading: authLoading } = useAppAuth()
  const router = useRouter()
  const [settings, setSettings] = useState<UserSettings | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchSettings() {
      if (!user?.id) return

      try {
        const response = await fetch(`/api/jam/dashboard?userId=${user.id}`)
        const data = await response.json()

        if (data.userSettings) {
          setSettings(data.userSettings)
        }
      } catch (error) {
        console.error('Error fetching settings:', error)
      } finally {
        setIsLoading(false)
      }
    }

    if (!authLoading) {
      fetchSettings()
    }
  }, [user?.id, authLoading])

  const handleTrackChanged = () => {
    // Redirect to dashboard after successful track change
    router.push('/jam/dashboard')
  }

  if (authLoading || isLoading) {
    return (
      <PageWrapper>
        <div className="page py-6">
          <div className="container py-8">
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
          <div className="container py-8">
            <div className="flex min-h-[400px] items-center justify-center">
              <div className="space-y-4 text-center">
                <h2 className="text-2xl font-bold">Autenticación Requerida</h2>
                <p className="text-muted-foreground">
                  Debes iniciar sesión para ver tus configuraciones
                </p>
              </div>
            </div>
          </div>
        </div>
      </PageWrapper>
    )
  }

  if (!settings?.track) {
    return (
      <PageWrapper>
        <div className="page py-6">
          <div className="container py-8">
            <div className="flex min-h-[400px] items-center justify-center">
              <div className="space-y-4 text-center">
                <h2 className="text-2xl font-bold">Onboarding Requerido</h2>
                <p className="text-muted-foreground">
                  Completa el onboarding para seleccionar tu ruta
                </p>
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
        <div className="container space-y-8 pb-2 pl-64">
          <div className="mb-8">
            <Link href="/jam/dashboard">
              <Button variant="ghost" size="sm" className="mb-4 -ml-2">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Volver al Dashboard
              </Button>
            </Link>
            <h1 className="text-3xl font-bold">Configuración</h1>
            <p className="mt-2 text-muted-foreground">
              Administra tu perfil y preferencias de JAM Platform
            </p>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Tu Ruta de Desarrollo</CardTitle>
                <CardDescription>
                  Cambia tu ruta si tus objetivos han evolucionado. Puedes hacer
                  hasta 2 cambios.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <TrackChanger
                  userId={user.id}
                  currentTrack={settings.track}
                  trackChangeCount={settings.trackChangeCount || 0}
                  onTrackChanged={handleTrackChanged}
                />
              </CardContent>
            </Card>

            {/* Future settings sections can be added here */}
          </div>
        </div>
      </div>
    </PageWrapper>
  )
}
