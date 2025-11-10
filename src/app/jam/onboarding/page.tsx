'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAppAuth } from '@/store/auth-context'
import { useQuery } from '@tanstack/react-query'
import { OnboardingWizard } from '@/components/jam-platform/onboarding/OnboardingWizard'
import PageWrapper from '@/components/layout/page-wrapper'
import Link from 'next/link'

async function checkOnboardingStatus(userId: string): Promise<{ completed: boolean }> {
  const res = await fetch(`/api/jam/settings?userId=${userId}`)
  if (!res.ok) return { completed: false }
  const settings = await res.json()
  return { completed: !!settings.onboardingCompletedAt }
}

export default function OnboardingPage() {
  const router = useRouter()
  const { user, isAppAuthenticated, isLoading } = useAppAuth()

  // Check if user already completed onboarding
  const { data: onboardingStatus, isLoading: checkingStatus } = useQuery({
    queryKey: ['onboarding-status', user?.id],
    queryFn: () => checkOnboardingStatus(user!.id),
    enabled: isAppAuthenticated && !!user,
  })

  // Redirect to dashboard if onboarding is already completed
  useEffect(() => {
    if (onboardingStatus?.completed && !isLoading && !checkingStatus) {
      router.push('/jam/dashboard')
    }
  }, [onboardingStatus, isLoading, checkingStatus, router])

  // Show loading state while auth or onboarding status is loading
  if (isLoading || checkingStatus) {
    return (
      <PageWrapper>
        <div className="page">
          <div className="container flex items-center justify-center">
            <div className="text-center">
              <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-primary"></div>
              <p className="text-foreground">Cargando...</p>
            </div>
          </div>
        </div>
      </PageWrapper>
    )
  }

  // If not authenticated, show message
  if (!isAppAuthenticated || !user) {
    return (
      <PageWrapper>
        <div className="page">
          <div className="container flex items-center justify-center">
            <div className="space-y-4 text-center">
              <h2 className="text-2xl font-bold">Authentication Required</h2>
              <p className="text-foreground">
                Please log in to access the onboarding flow.
              </p>
              <Link
                href="/"
                className="inline-block rounded-md bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90"
              >
                Go to Home
              </Link>
            </div>
          </div>
        </div>
      </PageWrapper>
    )
  }

  // Don't render if redirecting
  if (onboardingStatus?.completed) {
    return null
  }

  return (
    <PageWrapper>
      <div className="page">
        <div className="container flex flex-col items-center gap-y-8 pb-12 md:max-w-2xl lg:max-w-3xl xl:max-w-4xl">
          <OnboardingWizard userId={user.id} />
        </div>
      </div>
    </PageWrapper>
  )
}
