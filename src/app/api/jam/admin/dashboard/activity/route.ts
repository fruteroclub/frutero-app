import { NextResponse } from 'next/server'
import { getRecentActivity } from '@/server/controllers/jam/admin-dashboard.controller'

/**
 * GET /api/jam/admin/dashboard/activity
 * Get recent activity for admin dashboard (admin only)
 */
export async function GET() {
  try {
    // TODO: Add admin permission check here
    // const user = await getCurrentUser(request)
    // if (!user?.isAdmin) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    // }

    const activity = await getRecentActivity()
    return NextResponse.json(activity)
  } catch (error) {
    console.error('Get recent activity error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to get recent activity' },
      { status: 500 }
    )
  }
}
