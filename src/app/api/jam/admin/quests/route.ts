import { NextRequest, NextResponse } from 'next/server'
import { createQuest } from '@/server/controllers/admin'

/**
 * POST /api/jam/admin/quests
 * Create a new quest (admin only)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { adminId, ...questData } = body

    // TODO: Get adminId from authenticated session instead of request body
    if (!adminId) {
      return NextResponse.json({ error: 'Admin ID required' }, { status: 400 })
    }

    // Validate required fields
    if (!questData.title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 })
    }

    if (!questData.start || !questData.end) {
      return NextResponse.json(
        { error: 'Start and end dates are required' },
        { status: 400 }
      )
    }

    if (!questData.questType) {
      return NextResponse.json({ error: 'Quest type is required' }, { status: 400 })
    }

    // Parse dates
    const questDataWithDates = {
      ...questData,
      start: new Date(questData.start),
      end: new Date(questData.end),
      availableFrom: questData.availableFrom
        ? new Date(questData.availableFrom)
        : undefined,
      dueDate: questData.dueDate ? new Date(questData.dueDate) : undefined,
    }

    const quest = await createQuest(adminId, questDataWithDates)

    return NextResponse.json(quest, { status: 201 })
  } catch (error) {
    console.error('Create quest error:', error)

    const errorMessage = error instanceof Error ? error.message : 'Unknown error'

    if (errorMessage.includes('Unauthorized')) {
      return NextResponse.json({ error: errorMessage }, { status: 403 })
    }

    if (errorMessage.includes('required') || errorMessage.includes('Invalid')) {
      return NextResponse.json({ error: errorMessage }, { status: 400 })
    }

    return NextResponse.json({ error: 'Failed to create quest' }, { status: 500 })
  }
}
