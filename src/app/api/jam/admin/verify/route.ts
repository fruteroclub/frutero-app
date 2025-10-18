import { NextRequest, NextResponse } from 'next/server'
import { verifySubmission, rejectSubmission } from '@/server/controllers/admin'

/**
 * POST /api/jam/admin/verify
 * Verify or reject a quest submission
 */
export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const { projectQuestId, action, verificationNotes, paymentTxHash, adminId } =
      data

    // TODO: Get adminId from authenticated session instead of request body
    if (!adminId) {
      return NextResponse.json({ error: 'Admin ID required' }, { status: 400 })
    }

    if (!projectQuestId || !action) {
      return NextResponse.json(
        { error: 'Project quest ID and action are required' },
        { status: 400 }
      )
    }

    if (action === 'verify') {
      const verified = await verifySubmission(projectQuestId, adminId, {
        verificationNotes,
        paymentTxHash,
      })
      return NextResponse.json(verified)
    } else if (action === 'reject') {
      if (!verificationNotes) {
        return NextResponse.json(
          { error: 'Rejection reason is required' },
          { status: 400 }
        )
      }
      const rejected = await rejectSubmission(
        projectQuestId,
        adminId,
        verificationNotes
      )
      return NextResponse.json(rejected)
    } else {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }
  } catch (error) {
    console.error('Verification error:', error)

    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    if (errorMessage.includes('Unauthorized')) {
      return NextResponse.json({ error: errorMessage }, { status: 403 })
    }
    if (errorMessage.includes('not found')) {
      return NextResponse.json({ error: errorMessage }, { status: 404 })
    }
    if (errorMessage.includes('Only submitted')) {
      return NextResponse.json({ error: errorMessage }, { status: 400 })
    }

    return NextResponse.json(
      { error: 'Failed to process verification' },
      { status: 500 }
    )
  }
}
