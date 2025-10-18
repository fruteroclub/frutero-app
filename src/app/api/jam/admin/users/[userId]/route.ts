import { NextRequest, NextResponse } from 'next/server'
import { getUserDetails } from '@/server/controllers/jam/user-management.controller'

/**
 * GET /api/jam/admin/users/[userId]
 * Get user details (admin only)
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    // TODO: Add admin permission check here
    // const user = await getCurrentUser(request)
    // if (!user?.isAdmin) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    // }

    const user = await getUserDetails(userId)

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json(user)
  } catch (error) {
    console.error('Get user details error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to get user details' },
      { status: 500 }
    )
  }
}
