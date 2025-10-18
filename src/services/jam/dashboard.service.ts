/**
 * Dashboard Service
 * Frontend service layer for dashboard API calls
 */

import type { DashboardStats } from '@/types/jam'

// Re-export types for convenience
export type { DashboardStats }

export async function getDashboardStats(userId: string): Promise<DashboardStats> {
  try {
    const res = await fetch(`/api/jam/dashboard?userId=${userId}`)

    if (!res.ok) {
      const error = await res.json().catch(() => ({ error: 'Failed to load dashboard stats' }))
      throw new Error(error.error || 'Failed to load dashboard stats')
    }

    return res.json()
  } catch (error) {
    console.error('Dashboard stats fetch error:', error)
    throw error
  }
}
