import { NextRequest, NextResponse } from 'next/server'
import { logMentorshipSession, getMentorshipSessions } from '@/server/controllers/mentors'

/**
 * GET /api/jam/mentorships/[mentorshipId]/sessions
 * Get all sessions for a mentorship
 */
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ mentorshipId: string }> }
) {
  try {
    const { mentorshipId } = await context.params
    const sessions = await getMentorshipSessions(mentorshipId)
    return NextResponse.json(sessions)
  } catch (error) {
    console.error('Error fetching sessions:', error)
    const message = error instanceof Error ? error.message : 'Failed to fetch sessions'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

/**
 * POST /api/jam/mentorships/[mentorshipId]/sessions
 * Log a new mentorship session
 */
export async function POST(
  request: NextRequest,
  context: { params: Promise<{ mentorshipId: string }> }
) {
  try {
    const { mentorshipId } = await context.params
    const body = await request.json()

    const { date, duration, objectives, outcomes, nextSteps, rating, loggedBy } = body

    // Validation
    if (!date || !duration || !outcomes || !rating || !loggedBy) {
      return NextResponse.json(
        { error: 'Missing required fields: date, duration, outcomes, rating, loggedBy' },
        { status: 400 }
      )
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json({ error: 'Rating must be between 1 and 5' }, { status: 400 })
    }

    if (loggedBy !== 'mentor' && loggedBy !== 'participant') {
      return NextResponse.json(
        { error: 'loggedBy must be "mentor" or "participant"' },
        { status: 400 }
      )
    }

    const result = await logMentorshipSession(mentorshipId, {
      date,
      duration: Number(duration),
      objectives: objectives || '',
      outcomes,
      nextSteps: nextSteps || '',
      rating: Number(rating),
      loggedBy,
    })

    return NextResponse.json(result, { status: 201 })
  } catch (error) {
    console.error('Error logging session:', error)
    const message = error instanceof Error ? error.message : 'Failed to log session'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
