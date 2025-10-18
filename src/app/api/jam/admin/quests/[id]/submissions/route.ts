import { NextRequest, NextResponse } from 'next/server'
import { getQuestSubmissions } from '@/server/controllers/jam/admin.controller'

/**
 * GET /api/jam/admin/quests/[id]/submissions
 * Get all submissions for a specific quest (admin only)
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    if (!id) {
      return NextResponse.json({ error: 'Quest ID is required' }, { status: 400 })
    }

    const submissions = await getQuestSubmissions(id)
    return NextResponse.json(submissions)
  } catch (error) {
    console.error('Get quest submissions error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to get quest submissions' },
      { status: 500 }
    )
  }
}
