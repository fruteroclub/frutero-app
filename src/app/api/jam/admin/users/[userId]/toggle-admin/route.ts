import { NextRequest, NextResponse } from 'next/server'
import { toggleAdminStatus } from '@/server/controllers/jam/user-management.controller'

/**
 * POST /api/jam/admin/users/[userId]/toggle-admin
 * Toggle admin status for a user (admin only)
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    // TODO: Get current admin user ID from auth
    // For now, using a placeholder - this needs proper auth integration
    const adminId = 'admin-placeholder'

    const isAdmin = await toggleAdminStatus(userId, adminId)
    return NextResponse.json({ isAdmin })
  } catch (error) {
    console.error('Toggle admin status error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to toggle admin status' },
      { status: error instanceof Error && error.message.includes('Unauthorized') ? 403 : 500 }
    )
  }
}
