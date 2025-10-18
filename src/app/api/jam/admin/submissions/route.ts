import { NextRequest, NextResponse } from 'next/server'
import {
  checkAdminPermissions,
  getSubmissionsByStatus,
  getVerificationStats,
} from '@/server/controllers/admin'

/**
 * GET /api/jam/admin/submissions
 * Get submissions by status and verification stats
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const statusParam = searchParams.get('status') || 'SUBMITTED'
    const adminId = searchParams.get('adminId')
    const getStats = searchParams.get('stats') === 'true'

    // TODO: Get adminId from authenticated session instead of query param
    if (!adminId) {
      return NextResponse.json({ error: 'Admin ID required' }, { status: 400 })
    }

    // Check admin permissions
    const isAdmin = await checkAdminPermissions(adminId)
    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    if (getStats) {
      const stats = await getVerificationStats()
      return NextResponse.json(stats)
    }

    // Validate status parameter
    const validStatuses = [
      'NOT_STARTED',
      'IN_PROGRESS',
      'SUBMITTED',
      'VERIFIED',
      'REJECTED',
    ] as const
    if (!validStatuses.includes(statusParam as typeof validStatuses[number])) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
    }

    const status = statusParam as
      | 'NOT_STARTED'
      | 'IN_PROGRESS'
      | 'SUBMITTED'
      | 'VERIFIED'
      | 'REJECTED'
    const submissions = await getSubmissionsByStatus(status)
    return NextResponse.json(submissions)
  } catch (error) {
    console.error('Submissions fetch error:', error)

    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    if (errorMessage.includes('Unauthorized')) {
      return NextResponse.json({ error: errorMessage }, { status: 403 })
    }

    return NextResponse.json(
      { error: 'Failed to fetch submissions' },
      { status: 500 }
    )
  }
}
