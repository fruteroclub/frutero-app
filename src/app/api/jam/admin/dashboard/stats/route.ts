import { NextResponse } from 'next/server'
import { getAdminDashboardStats } from '@/server/controllers/jam/admin-dashboard.controller'

/**
 * GET /api/jam/admin/dashboard/stats
 * Get admin dashboard statistics (admin only)
 */
export async function GET() {
  try {
    // TODO: Add admin permission check here
    // const user = await getCurrentUser(request)
    // if (!user?.isAdmin) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    // }

    const stats = await getAdminDashboardStats()
    return NextResponse.json(stats)
  } catch (error) {
    console.error('Get admin dashboard stats error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to get dashboard stats' },
      { status: 500 }
    )
  }
}
