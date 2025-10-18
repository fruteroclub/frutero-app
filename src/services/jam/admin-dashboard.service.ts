/**
 * Admin Dashboard Service
 * Frontend service layer for admin dashboard API calls
 */

export interface AdminDashboardStats {
  users: {
    total: number
    admins: number
    recentlyJoined: number
  }
  projects: {
    total: number
    byStage: Record<string, number>
    activeProjects: number
  }
  quests: {
    total: number
    individual: number
    team: number
    completed: number
    pending: number
  }
  submissions: {
    pendingVerification: number
    verifiedToday: number
    totalBountiesPaid: number
  }
  programs: {
    total: number
    active: number
  }
}

/**
 * Get admin dashboard statistics
 */
export async function getAdminDashboardStats(): Promise<AdminDashboardStats> {
  try {
    const res = await fetch('/api/jam/admin/dashboard/stats')

    if (!res.ok) {
      const error = await res.json().catch(() => ({ error: 'Failed to get dashboard stats' }))
      throw new Error(error.error || 'Failed to get dashboard stats')
    }

    return res.json()
  } catch (error) {
    console.error('Get admin dashboard stats error:', error)
    throw error
  }
}

/**
 * Get recent activity
 */
export async function getRecentActivity() {
  try {
    const res = await fetch('/api/jam/admin/dashboard/activity')

    if (!res.ok) {
      const error = await res.json().catch(() => ({ error: 'Failed to get recent activity' }))
      throw new Error(error.error || 'Failed to get recent activity')
    }

    return res.json()
  } catch (error) {
    console.error('Get recent activity error:', error)
    throw error
  }
}
