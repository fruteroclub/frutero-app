/**
 * User Settings Service
 * Frontend service for user settings and onboarding status
 */

export interface UserSettings {
  id: string
  userId: string
  track: string | null
  goals: string[] | null
  interests: string[]
  onboardingCompletedAt: string | null
  trackChangedAt: string | null
  trackChangeCount: number
  createdAt: string
  updatedAt: string
}

/**
 * Get user settings including onboarding completion status
 */
export async function getUserSettings(userId: string): Promise<UserSettings | null> {
  try {
    const response = await fetch(`/api/jam/settings?userId=${userId}`)

    if (response.status === 404) {
      return null
    }

    if (!response.ok) {
      throw new Error('Failed to fetch user settings')
    }

    return response.json()
  } catch (error) {
    console.error('Error fetching user settings:', error)
    throw error
  }
}

/**
 * Check if user has completed onboarding
 */
export async function hasCompletedOnboarding(userId: string): Promise<boolean> {
  const settings = await getUserSettings(userId)
  return !!settings?.onboardingCompletedAt
}
