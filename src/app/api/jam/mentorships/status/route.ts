import { NextRequest, NextResponse } from 'next/server'
import { getMentorshipStatus } from '@/server/controllers/mentors'

/**
 * GET /api/jam/mentorships/status?mentorId=X&participantId=Y
 * Get mentorship connection status between mentor and participant
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const mentorId = searchParams.get('mentorId')
    const participantId = searchParams.get('participantId')

    if (!mentorId || !participantId) {
      return NextResponse.json(
        { error: 'Missing required parameters: mentorId and participantId' },
        { status: 400 }
      )
    }

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
