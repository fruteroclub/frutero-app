import { NextRequest, NextResponse } from 'next/server'
import { updateQuest, deleteQuest } from '@/server/controllers/admin'

/**
 * PATCH /api/jam/admin/quests/[id]
 * Update an existing quest (admin only)
 */
export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id: questId } = await context.params
    const body = await request.json()
    const { adminId, ...questData } = body

    // TODO: Get adminId from authenticated session instead of request body
    if (!adminId) {
      return NextResponse.json({ error: 'Admin ID required' }, { status: 400 })
    }

    // Parse dates if provided
    const questDataWithDates: Record<string, unknown> = { ...questData }

    if (questData.start) {
      questDataWithDates.start = new Date(questData.start)
    }
    if (questData.end) {
      questDataWithDates.end = new Date(questData.end)
    }
    if (questData.availableFrom) {
      questDataWithDates.availableFrom = new Date(questData.availableFrom)
    }
    if (questData.dueDate) {
      questDataWithDates.dueDate = new Date(questData.dueDate)
    }

    const updated = await updateQuest(questId, adminId, questDataWithDates)

    return NextResponse.json(updated)
  } catch (error) {
    console.error('Update quest error:', error)

    const errorMessage = error instanceof Error ? error.message : 'Unknown error'

    if (errorMessage.includes('Unauthorized')) {
      return NextResponse.json({ error: errorMessage }, { status: 403 })
    }

    if (errorMessage.includes('not found')) {
      return NextResponse.json({ error: errorMessage }, { status: 404 })
    }

    if (errorMessage.includes('Invalid')) {
      return NextResponse.json({ error: errorMessage }, { status: 400 })
    }

    return NextResponse.json({ error: 'Failed to update quest' }, { status: 500 })
  }
}

/**
 * DELETE /api/jam/admin/quests/[id]
 * Delete a quest (admin only)
 */
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id: questId } = await context.params
    const { searchParams } = new URL(request.url)
    const adminId = searchParams.get('adminId')

    // TODO: Get adminId from authenticated session instead of query param
    if (!adminId) {
      return NextResponse.json({ error: 'Admin ID required' }, { status: 400 })
    }

    await deleteQuest(questId, adminId)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete quest error:', error)

    const errorMessage = error instanceof Error ? error.message : 'Unknown error'

    if (errorMessage.includes('Unauthorized')) {
      return NextResponse.json({ error: errorMessage }, { status: 403 })
    }

    if (errorMessage.includes('not found')) {
      return NextResponse.json({ error: errorMessage }, { status: 404 })
    }

    return NextResponse.json({ error: 'Failed to delete quest' }, { status: 500 })
  }
}
