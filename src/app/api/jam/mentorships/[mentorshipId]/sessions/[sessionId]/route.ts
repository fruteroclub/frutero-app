import { NextRequest, NextResponse } from 'next/server'
import { updateSessionRating } from '@/server/controllers/mentors'

/**
 * PATCH /api/jam/mentorships/[mentorshipId]/sessions/[sessionId]
 * Update a session rating
 */
export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ mentorshipId: string; sessionId: string }> }
) {
  try {
    const { mentorshipId, sessionId } = await context.params
    const body = await request.json()

    const { rating } = body

    if (!rating) {
      return NextResponse.json({ error: 'Missing required field: rating' }, { status: 400 })
    }

    const session = await updateSessionRating(mentorshipId, sessionId, Number(rating))

    if (!session) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 })
    }

    return NextResponse.json(session)
  } catch (error) {
    console.error('Error updating session:', error)
    const message = error instanceof Error ? error.message : 'Failed to update session'
    const status = message.includes('between 1 and 5') ? 400 : 500
    return NextResponse.json({ error: message }, { status })
  }
}
