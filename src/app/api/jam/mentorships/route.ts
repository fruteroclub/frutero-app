import { NextRequest, NextResponse } from 'next/server'
import { createMentorshipRequest } from '@/server/controllers/mentors'

/**
 * POST /api/jam/mentorships
 * Create a new mentorship connection request
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { mentorId, participantId, message, goals } = body

    // Basic validation
    if (!mentorId || !participantId || !message || !goals) {
      return NextResponse.json(
        { error: 'Missing required fields: mentorId, participantId, message, goals' },
        { status: 400 }
      )
    }

    const mentorship = await createMentorshipRequest(mentorId, participantId, message, goals)
    return NextResponse.json(mentorship, { status: 201 })
  } catch (error) {
    console.error('Error creating mentorship request:', error)
    const message = error instanceof Error ? error.message : 'Failed to create mentorship request'
    const status = error instanceof Error && error.message.includes('already exists') ? 409 : 500
    return NextResponse.json({ error: message }, { status })
  }
}
