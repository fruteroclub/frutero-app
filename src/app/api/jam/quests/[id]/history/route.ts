import { NextRequest, NextResponse } from 'next/server'
import { getQuestSubmissionHistory } from '@/server/controllers/user-quests'

/**
 * GET /api/jam/quests/[id]/history
 * Get submission history for a user's quest
 */
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id: questId } = await context.params
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    // TODO: Get userId from authenticated session instead of query param
    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 })
    }

    const history = await getQuestSubmissionHistory(userId, questId)

    return NextResponse.json(history)
  } catch (error) {
    console.error('Quest history error:', error)

    const errorMessage = error instanceof Error ? error.message : 'Unknown error'

    // Handle specific error cases
    if (errorMessage.includes('not found')) {
      return NextResponse.json({ error: errorMessage }, { status: 404 })
    }

    return NextResponse.json(
      { error: 'Failed to fetch quest history' },
      { status: 500 }
    )
  }
}
