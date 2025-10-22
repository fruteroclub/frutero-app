/**
 * Quest Assignment API
 * POST /api/jam/quests/assign - Assign quests to user based on track
 */

import { NextRequest, NextResponse } from 'next/server'
import { assignWeeklyQuests, assignQuestToUser } from '@/lib/jam/quest-assignment'

/**
 * POST /api/jam/quests/assign
 * Assign quests to a user
 * Body: { userId: string, programId?: string, questId?: string }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, programId, questId } = body

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 })
    }

    // Manual quest assignment (admin feature)
    if (questId) {
      const assigned = await assignQuestToUser(userId, questId)
      return NextResponse.json({
        success: assigned,
        message: assigned
          ? 'Quest assigned successfully'
          : 'Quest already assigned to user',
      })
    }

    // Automatic weekly quest assignment
    const assignedCount = await assignWeeklyQuests(userId, programId)

    return NextResponse.json({
      success: true,
      assignedCount,
      message: `Assigned ${assignedCount} quests to user`,
    })
  } catch (error) {
    console.error('Error assigning quests:', error)
    const message =
      error instanceof Error ? error.message : 'Failed to assign quests'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
