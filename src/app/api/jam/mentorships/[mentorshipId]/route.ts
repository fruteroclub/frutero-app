import { NextRequest, NextResponse } from 'next/server'
import { getMentorshipById } from '@/server/controllers/mentors'

/**
 * GET /api/jam/mentorships/[mentorshipId]
 * Get mentorship by ID with full details
 */
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ mentorshipId: string }> }
) {
  try {
    const { mentorshipId } = await context.params
    const mentorship = await getMentorshipById(mentorshipId)
    return NextResponse.json(mentorship)
  } catch (error) {
    console.error('Error fetching mentorship:', error)
    const message = error instanceof Error ? error.message : 'Failed to fetch mentorship'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
