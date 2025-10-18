import { NextRequest, NextResponse } from 'next/server'
import { getAllUsers } from '@/server/controllers/jam/user-management.controller'

/**
 * GET /api/jam/admin/users
 * Get all users with optional filters (admin only)
 */
export async function GET(request: NextRequest) {
  try {
    // TODO: Add admin permission check here
    // const user = await getCurrentUser(request)
    // if (!user?.isAdmin) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    // }

    const searchParams = request.nextUrl.searchParams
    const search = searchParams.get('search') || undefined
    const isAdmin = searchParams.get('isAdmin')
    const limit = searchParams.get('limit')
    const offset = searchParams.get('offset')

    const options = {
      search,
      isAdmin: isAdmin ? isAdmin === 'true' : undefined,
      limit: limit ? parseInt(limit, 10) : undefined,
      offset: offset ? parseInt(offset, 10) : undefined,
    }

    const result = await getAllUsers(options)
    return NextResponse.json(result)
  } catch (error) {
    console.error('Get users error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to get users' },
      { status: 500 }
    )
  }
}
