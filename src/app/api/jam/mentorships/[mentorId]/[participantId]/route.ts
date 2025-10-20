import { NextRequest, NextResponse } from 'next/server'
import { getMentorshipStatus } from '@/server/controllers/mentors'

/**
 * GET /api/jam/mentorships/[mentorId]/[participantId]
 * Get mentorship connection status between mentor and participant
 */
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ mentorId: string; participantId: string }> }
) {
  try {
    const { mentorId, participantId } = await context.params
    const mentorship = await getMentorshipStatus(mentorId, participantId)

    if (!mentorship) {
      return NextResponse.json({ exists: false, mentorship: null })
    }

    return NextResponse.json({ exists: true, mentorship })
  } catch (error) {
    console.error('Error fetching mentorship status:', error)
    const message = error instanceof Error ? error.message : 'Failed to fetch mentorship status'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
