import { NextRequest, NextResponse } from 'next/server'
import {
  startQuest,
  updateQuestProgress,
  submitQuest,
} from '@/server/controllers/user-quests'

/**
 * POST /api/jam/quests/[id]/submit
 * Submit or update progress for an individual quest
 */
export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id: questId } = await context.params
    const body = await request.json()
    const { userId, action, progress, submissionText, submissionUrls } = body

    // TODO: Get userId from authenticated session instead of request body
    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 })
    }

    // Handle different actions
    if (action === 'start') {
      // Start/assign quest to user
      const userQuest = await startQuest(userId, questId)
      return NextResponse.json(userQuest, { status: 201 })
    } else if (action === 'update') {
      // Update progress (partial submission)
      if (progress === undefined) {
        return NextResponse.json(
          { error: 'Progress is required for update action' },
          { status: 400 }
        )
      }

      const updated = await updateQuestProgress(userId, questId, {
        progress,
        submissionText,
        submissionUrls,
      })

      return NextResponse.json(updated)
    } else if (action === 'submit') {
      // Final submission (100% completion)
      if (!submissionText) {
        return NextResponse.json(
          { error: 'Submission description is required' },
          { status: 400 }
        )
      }

      const submitted = await submitQuest(userId, questId, {
        submissionText,
        submissionUrls,
      })

      return NextResponse.json(submitted)
    } else {
      return NextResponse.json(
        { error: 'Invalid action. Use: start, update, or submit' },
        { status: 400 }
      )
    }
  } catch (error) {
    console.error('Quest submission error:', error)

    const errorMessage = error instanceof Error ? error.message : 'Unknown error'

    // Handle specific error cases
    if (errorMessage.includes('not found')) {
      return NextResponse.json({ error: errorMessage }, { status: 404 })
    }
    if (
      errorMessage.includes('already') ||
      errorMessage.includes('maximum submissions')
    ) {
      return NextResponse.json({ error: errorMessage }, { status: 400 })
    }
    if (errorMessage.includes('team-only')) {
      return NextResponse.json({ error: errorMessage }, { status: 400 })
    }

    return NextResponse.json(
      { error: 'Failed to process quest submission' },
      { status: 500 }
    )
  }
}
